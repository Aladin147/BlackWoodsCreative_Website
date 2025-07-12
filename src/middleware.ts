import { NextResponse, type NextRequest } from 'next/server';

// Import proper types for security functions
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  burstLimit?: number;
  blockDuration?: number;
}

interface InMemoryRateLimiter {
  limit: (key: string, config: RateLimitConfig) => Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }>;
  destroy: () => void;
}

interface RequestSizeLimits {
  maxBodySize: number;
  maxHeaderSize: number;
  maxUrlLength: number;
  maxQueryParams: number;
}

// Lazy imports to reduce middleware bundle size
interface SecurityFunctions {
  generateNonce: () => string;
  generateCSRFToken: () => string;
  withSecurityHeaders: (response: NextResponse, nonce?: string) => NextResponse;
  logSecurityEvent: (event: {
    type: 'csp_violation' | 'rate_limit' | 'csrf_failure' | 'csrf_missing_tokens' | 'csrf_token_mismatch' | 'csrf_middleware_error' | 'suspicious_activity';
    ip?: string;
    userAgent?: string;
    details?: Record<string, unknown>;
  }) => void;
  getInMemoryRateLimiter: () => InMemoryRateLimiter;
  validateRequestSize: (request: NextRequest, limits?: RequestSizeLimits) => { valid: boolean; error?: string };
  sanitizeInput: (input: string) => string;
  sanitizeForNoSQL: (input: unknown) => unknown;
  rateLimitConfigs: Record<string, RateLimitConfig>;
}

interface LazyImports {
  rateLimit: typeof import('@upstash/ratelimit').Ratelimit | null;
  redis: typeof import('@upstash/redis').Redis | null;
  security: SecurityFunctions | null;
  logger: typeof import('./lib/utils/request-logger') | null;
}

const lazyImports: LazyImports = {
  rateLimit: null,
  redis: null,
  security: null,
  logger: null,
};

// Lazy load heavy dependencies only when needed
async function getRateLimitDependencies() {
  if (!lazyImports.rateLimit) {
    const [{ Ratelimit }, { Redis }] = await Promise.all([
      import('@upstash/ratelimit'),
      import('@upstash/redis'),
    ]);
    lazyImports.rateLimit = Ratelimit;
    lazyImports.redis = Redis;
  }
  return { Ratelimit: lazyImports.rateLimit, Redis: lazyImports.redis };
}

async function getSecurityDependencies() {
  if (!lazyImports.security) {
    // Use Edge Runtime compatible security utilities only
    const securityEdge = await import('./lib/utils/security-edge');

    // Import only specific functions from security.ts that don't use JSDOM
    const {
      generateNonce,
      generateCSRFToken,
      withSecurityHeaders,
      logSecurityEvent,
      getInMemoryRateLimiter,
      rateLimitConfigs,
    } = await import('./lib/utils/security');

    // Combine Edge Runtime compatible functions with safe security utilities
    lazyImports.security = {
      generateNonce,
      generateCSRFToken,
      withSecurityHeaders,
      logSecurityEvent,
      getInMemoryRateLimiter,
      rateLimitConfigs,
      validateRequestSize: securityEdge.validateRequestSizeEdge,
      sanitizeInput: securityEdge.sanitizeInputEdge,
      sanitizeForNoSQL: securityEdge.sanitizeForNoSQLEdge,
    };
  }
  return lazyImports.security;
}

async function getLoggerDependencies() {
  lazyImports.logger ??= await import('./lib/utils/request-logger');
  return lazyImports.logger;
}

// Initialize distributed rate limiters with Redis (preferred) and in-memory fallback
interface RateLimiters {
  api?: import('@upstash/ratelimit').Ratelimit;
  contact?: import('@upstash/ratelimit').Ratelimit;
  auth?: import('@upstash/ratelimit').Ratelimit;
  monitoring?: import('@upstash/ratelimit').Ratelimit;
  newsletter?: import('@upstash/ratelimit').Ratelimit;
}

let rateLimiters: RateLimiters = {};
let useRedis = false;
let rateLimitersInitialized = false;

// Lazy initialize rate limiters only when needed
async function initializeRateLimiters() {
  if (rateLimitersInitialized) return rateLimiters;

  const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

  if (hasRedisConfig) {
    try {
      const { Ratelimit, Redis } = await getRateLimitDependencies();
      const { rateLimitConfigs } = await getSecurityDependencies();

      if (!Redis) {
        throw new Error('Redis not available');
      }

      const redis = Redis.fromEnv();

      // Test Redis connection
      rateLimiters = {
        api: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            rateLimitConfigs.api?.maxRequests ?? 100,
            `${(rateLimitConfigs.api?.windowMs ?? 900000) / 1000} s`
          ),
          prefix: '@upstash/ratelimit:api',
          analytics: true,
        }),
        contact: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            rateLimitConfigs.contact?.maxRequests ?? 5,
            `${(rateLimitConfigs.contact?.windowMs ?? 600000) / 1000} s`
          ),
          prefix: '@upstash/ratelimit:contact',
          analytics: true,
        }),
        auth: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            rateLimitConfigs.auth?.maxRequests ?? 5,
            `${(rateLimitConfigs.auth?.windowMs ?? 900000) / 1000} s`
          ),
          prefix: '@upstash/ratelimit:auth',
          analytics: true,
        }),
        monitoring: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            rateLimitConfigs.monitoring?.maxRequests ?? 50,
            `${(rateLimitConfigs.monitoring?.windowMs ?? 300000) / 1000} s`
          ),
          prefix: '@upstash/ratelimit:monitoring',
          analytics: true,
        }),
        newsletter: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            rateLimitConfigs.newsletter?.maxRequests ?? 3,
            `${(rateLimitConfigs.newsletter?.windowMs ?? 3600000) / 1000} s`
          ),
          prefix: '@upstash/ratelimit:newsletter',
          analytics: true,
        }),
      };

      useRedis = true;
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('Rate limiting: Using Redis for distributed rate limiting');
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Rate limiting: Redis connection failed, falling back to in-memory:', error);
      }
      rateLimiters = {};
      useRedis = false;
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Rate limiting: Redis not configured, using in-memory fallback');
    }
    useRedis = false;
  }

  rateLimitersInitialized = true;
  return rateLimiters;
}

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const response = NextResponse.next();
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? (forwarded.split(',')[0]?.trim() ?? '127.0.0.1') : (realIp ?? '127.0.0.1');
  const userAgent = request.headers.get('user-agent') ?? '';

  // Lazy load dependencies only when needed
  const { getRequestLogger } = await getLoggerDependencies();
  const {
    generateNonce,
    generateCSRFToken,
    withSecurityHeaders,
    logSecurityEvent,
    getInMemoryRateLimiter,
    validateRequestSize,
  } = await getSecurityDependencies();

  // Enhanced security validation for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const sizeValidation = validateRequestSize(request);
    if (!sizeValidation.valid) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            message: 'Request too large',
            code: 'REQUEST_SIZE_EXCEEDED',
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 413,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // Initialize request logging
  const requestLogger = getRequestLogger();
  const userId = request.headers.get('x-user-id');
  const sessionId = request.headers.get('x-session-id');
  const requestId = requestLogger.logRequest(request, {
    ...(userId && { userId }),
    ...(sessionId && { sessionId }),
  });

  // Generate enhanced nonce for CSP
  const nonce = generateNonce();

  // Apply security headers with nonce (enhanced for production)
  const secureResponse = withSecurityHeaders(response, nonce);

  // Enhanced nonce distribution for better component access
  secureResponse.headers.set('x-nonce', nonce);

  // Add nonce to cookies for client-side access (secure, httpOnly in production)
  secureResponse.cookies.set('csp-nonce', nonce, {
    httpOnly: false, // Allow client-side access for Framer Motion
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour (shorter than CSRF for security)
    path: '/',
  });

  // Apply rate limiting to API routes with Redis or in-memory fallback
  if (request.nextUrl.pathname.startsWith('/api')) {
    try {
      let rateLimitResult: {
        success: boolean;
        limit: number;
        remaining: number;
        reset: number;
        blocked?: boolean;
      };

      // Determine which rate limit config to use
      let configKey = 'api';
      if (request.nextUrl.pathname.includes('/contact')) {
        configKey = 'contact';
      } else if (request.nextUrl.pathname.includes('/auth')) {
        configKey = 'auth';
      } else if (request.nextUrl.pathname.includes('/newsletter')) {
        configKey = 'newsletter';
      } else if (
        request.nextUrl.pathname.includes('/monitoring') ||
        request.nextUrl.pathname.includes('/performance')
      ) {
        configKey = 'monitoring';
      }

      // Initialize rate limiters only when needed for API routes
      const currentRateLimiters = await initializeRateLimiters();
      const inMemoryLimiter = getInMemoryRateLimiter();
      const { rateLimitConfigs } = await getSecurityDependencies();
      const config = rateLimitConfigs[configKey];

      if (!config) {
        // Skip rate limiting if config not found - add degraded header
        secureResponse.headers.set('X-RateLimit-Status', 'config-missing');
      } else {
        if (useRedis && currentRateLimiters[configKey as keyof typeof currentRateLimiters]) {
          // Use Redis-based rate limiting
          const rateLimiter = currentRateLimiters[configKey as keyof typeof currentRateLimiters];
          if (rateLimiter) {
            rateLimitResult = await rateLimiter.limit(ip);
          } else {
            // Fallback to in-memory if specific limiter not available
            rateLimitResult = await inMemoryLimiter.limit(`${configKey}:${ip}`, config);
          }
        } else {
          // Use in-memory rate limiting
          rateLimitResult = await inMemoryLimiter.limit(`${configKey}:${ip}`, config);
        }

        if (!rateLimitResult.success) {
          // Log security event with enhanced details
          logSecurityEvent({
            type: 'rate_limit',
            ip,
            userAgent,
            details: {
              path: request.nextUrl.pathname,
              method: request.method,
              configKey,
              blocked: rateLimitResult.blocked,
              backend: useRedis ? 'redis' : 'memory',
            },
          });

          // Calculate retry-after header
          const retryAfter = Math.round((rateLimitResult.reset - Date.now()) / 1000);

          // Update request log with rate limit info
          const responseTime = Date.now() - startTime;
          const rateLimitResponse = new NextResponse(
            JSON.stringify({
              error: 'Too many requests',
              message: rateLimitResult.blocked
                ? 'Rate limit exceeded. You have been temporarily blocked.'
                : 'Rate limit exceeded. Please try again later.',
              retryAfter,
            }),
            {
              status: 429,
              headers: {
                'Retry-After': retryAfter.toString(),
                'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.reset.toString(),
                'X-RateLimit-Backend': useRedis ? 'redis' : 'memory',
                'Content-Type': 'application/json',
              },
            }
          );

          requestLogger.updateRequestResponse(
            requestId,
            rateLimitResponse,
            responseTime,
            'Rate limit exceeded'
          );

          return rateLimitResponse;
        }

        // Add rate limit headers to successful responses
        secureResponse.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
        secureResponse.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        secureResponse.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
        secureResponse.headers.set('X-RateLimit-Backend', useRedis ? 'redis' : 'memory');

        // Update request log with rate limit info
        const logs = requestLogger.getRecentLogs(1000);
        const currentLog = logs.find((log: import('./lib/utils/request-logger').RequestLogEntry) => log.id === requestId);
        if (currentLog) {
          currentLog.rateLimitInfo = {
            limit: rateLimitResult.limit,
            remaining: rateLimitResult.remaining,
            reset: rateLimitResult.reset,
          };
        }
      }
    } catch (error) {
      // Rate limiting error - log but don't block request
      if (process.env.NODE_ENV !== 'production') {
        console.error('Rate limiting error:', error);
      }
      logSecurityEvent({
        type: 'rate_limit',
        ip,
        userAgent,
        details: {
          error: 'Rate limiting system error',
          path: request.nextUrl.pathname,
          method: request.method,
        },
      });

      // Add header to indicate rate limiting is degraded
      secureResponse.headers.set('X-RateLimit-Status', 'degraded');
    }
  }

  // Generate and set CSRF token for non-API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    const csrfToken = generateCSRFToken();
    secureResponse.cookies.set('csrf-token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Also set CSRF token in headers for client-side access
    secureResponse.headers.set('x-csrf-token', csrfToken);

    // Update request log with CSRF token
    const logs = requestLogger.getRecentLogs(1000);
    const currentLog = logs.find((log: import('./lib/utils/request-logger').RequestLogEntry) => log.id === requestId);
    if (currentLog) {
      currentLog.csrfToken = csrfToken;
    }
  }

  // Add request ID to response headers for tracking
  secureResponse.headers.set('x-request-id', requestId);

  // Log successful response
  const responseTime = Date.now() - startTime;
  requestLogger.updateRequestResponse(requestId, secureResponse, responseTime);

  return secureResponse;
}

export const config = {
  matcher: [
    // Apply to all API routes for rate limiting and security
    '/api/:path*',
    // Apply to all pages for CSRF token generation (exclude static assets)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)',
  ],
};
