import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getRequestLogger } from './lib/utils/request-logger';
import {
  generateNonce,
  generateCSRFToken,
  withSecurityHeaders,
  logSecurityEvent,
  rateLimitConfigs,
} from './lib/utils/security';

// Initialize rate limiters for different endpoints
const rateLimiters = {
  api: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(
      rateLimitConfigs.api.maxRequests,
      `${rateLimitConfigs.api.windowMs / 1000} s`
    ),
    prefix: '@upstash/ratelimit:api',
  }),
  contact: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(
      rateLimitConfigs.contact.maxRequests,
      `${rateLimitConfigs.contact.windowMs / 1000} s`
    ),
    prefix: '@upstash/ratelimit:contact',
  }),
};

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const response = NextResponse.next();
  const ip = request.ip ?? '127.0.0.1';
  const userAgent = request.headers.get('user-agent') ?? '';

  // Initialize request logging
  const requestLogger = getRequestLogger();
  const requestId = requestLogger.logRequest(request, {
    userId: request.headers.get('x-user-id') || undefined,
    sessionId: request.headers.get('x-session-id') || undefined,
  });

  // Generate nonce for CSP
  const nonce = generateNonce();

  // Apply security headers with nonce
  const secureResponse = withSecurityHeaders(response, nonce);

  // Set nonce in response headers for use in components
  secureResponse.headers.set('x-nonce', nonce);

  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    let rateLimiter = rateLimiters.api;

    // Use more restrictive rate limiting for contact form
    if (request.nextUrl.pathname.includes('/contact')) {
      rateLimiter = rateLimiters.contact;
    }

    const { success, limit, remaining, reset } = await rateLimiter.limit(ip);

    if (!success) {
      // Log security event
      logSecurityEvent({
        type: 'rate_limit',
        ip,
        userAgent,
        details: {
          path: request.nextUrl.pathname,
          method: request.method,
        },
      });

      // Update request log with rate limit info
      const responseTime = Date.now() - startTime;
      const rateLimitResponse = new NextResponse('Too many requests', {
        status: 429,
        headers: {
          'Retry-After': Math.round((reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Content-Type': 'text/plain',
        },
      });

      requestLogger.updateRequestResponse(
        requestId,
        rateLimitResponse,
        responseTime,
        'Rate limit exceeded'
      );

      return rateLimitResponse;
    }

    // Add rate limit headers to successful responses
    secureResponse.headers.set('X-RateLimit-Limit', limit.toString());
    secureResponse.headers.set('X-RateLimit-Remaining', remaining.toString());
    secureResponse.headers.set('X-RateLimit-Reset', reset.toString());

    // Update request log with rate limit info
    const logIndex = requestLogger.getRecentLogs(1).findIndex(log => log.id === requestId);
    if (logIndex !== -1) {
      const logs = requestLogger.getRecentLogs(1000);
      const currentLog = logs.find(log => log.id === requestId);
      if (currentLog) {
        currentLog.rateLimitInfo = {
          limit,
          remaining,
          reset,
        };
      }
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
    const currentLog = logs.find(log => log.id === requestId);
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
