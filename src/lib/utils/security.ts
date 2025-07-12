import { NextRequest, NextResponse } from 'next/server';

import { logger } from './logger';

/**
 * Security utilities for BlackWoods Creative website
 * Implements comprehensive security measures including CSP, CSRF protection, and more
 */

// Comprehensive Framer Motion CSP hashes collected from development
// Edge Runtime compatible - no file system access required
function getFramerMotionHashes(): string[] {
  // Production-ready comprehensive hash collection
  return [
    "'sha256-tTgjrFAQDNcRW/9ebtwfDewCTgZMFnKpGa9tcHFyvcs='",
    "'sha256-E+XKxe8E3U03Zx3+QBwIsPqhP7hTQb0/u8HHYp6Kmoo='",
    "'sha256-yjeIWbfkHCqakGNfgINzQek4xBo2zW5+69GgakTPbVY='",
    "'sha256-HGYbL7c7YTMNrtcUQBvASpkCpnhcLdlW/2pKHJ8sJ98='",
    "'sha256-igGwtKCyYZbjDinj7jsNnSWb5Avo7xUUWi+36D2r1l8='",
    "'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk='",
    "'sha256-8kVweCgo+M+HwPlASou2/3D6QAvPiEIKYlrZfc3cdxk='",
    "'sha256-ZQWo4Cn5Nm60gEr8ny7kaB92rnn4oTiV7JQqMo3+PyA='",
    "'sha256-WtLsIkggB7ab+53OaGBhXaMA5fstTDE8uWNZc4RaEgA='",
    "'sha256-NxBRc5sFpYixGRxUjXbEdR+oY91MsYAD5ZyMizZmwxQ='",
    "'sha256-QX237/hlIhcHo//CDgXlzRCuNT3a9BwQfHBeR1PRdPM='",
    "'sha256-Y8LrZ2N6qJPNNWCSz1nYlYIG9Sq6rFJK+GqRTkBt3iE='",
    "'sha256-Wn/6oAmc0SaAHk/bHUMmsujhv9yS/ahVuVwt8eYpoNQ='",
    "'sha256-Iu5DjghVzFMtPXvj01vObCmCh8dhQUZx9E6yn17jYCU='",
    "'sha256-r22BBb/Eg90BfeGvJjRh85ANAS4ACA4OqI+81pgc7ks='",
    "'sha256-GWGY0N6wwt3tl+nwPANspBV0sYMRLJD0rkJ72J9phWw='",
    "'sha256-Nt1kH5ptvm/W5OWKWDgO1CzT7+D2oBInKWjI3PjlCvw='",
    "'sha256-D8khTyWIqhXfpVUgreV8I0yRapkFH/Sl14i//ci+vWE='",
    "'sha256-eLn7RVblru9CzxRXEaM62rL+w1r3e4aJQjAuAUmVqj0='",
    "'sha256-s1BUYykudHqBwnFKIsRrnIG1nU/RVJVyRMLJ9rkqH/k='",
    "'sha256-WL3CN4Gp5UIBZTFuwGdFGQ9IFDDcYXW/981lGDJt5mQ='",
    "'sha256-uBujpxyHbOuzn75sM496NZhK8s3155SPdCxyxGRD9ek='",
    "'sha256-22cvBJyX6uQmoScdxghADtnVRTAqAfuBYF8lx2enKVg='",
    "'sha256-b0Z5LuFkZJcWR+sk9vCKzBl1xlqgwgjYKS4Vx4TTrGc='",
    "'sha256-8bzII+OkGlwX0Dli5QEkBRrof/LKae/l4Gtj9L2AWOU='",
    "'sha256-hhVUiVM8DomaajFNlYURV9HMYROFWL8pRgpB4UsrcH4='",
    "'sha256-KKEXPP2xrosVV4irXxbwpJRH2aPxYiN2TkfREWW6qbM='",
    "'sha256-uZ9cNPxE54WbvoUSGuphWIjBmz9UzpjxjpRIKxsQ7AE='",
    "'sha256-AnfdA8HQ1ENIMB9a64fsIERn4UPU5QIFX1oxoWFG7Kg='",
  ];
}

// Load the comprehensive hash collection - Edge Runtime compatible
const FRAMER_MOTION_CSP_HASHES: string[] = getFramerMotionHashes();

// Additional hashes can be added here if needed (Edge Runtime compatible)
const additionalHashes: string[] = [];

// Enhanced cryptographically secure nonce generation for CSP
export function generateNonce(): string {
  try {
    // Use Web Crypto API for Edge Runtime compatibility (preferred)
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
      const array = new Uint8Array(32); // Increased to 32 bytes for better security
      globalThis.crypto.getRandomValues(array);
      return btoa(String.fromCharCode.apply(null, Array.from(array)));
    }

    // Fallback to crypto global if available
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return btoa(String.fromCharCode.apply(null, Array.from(array)))
        .replace(/[+/]/g, char => (char === '+' ? '-' : '_'))
        .replace(/=/g, '');
    }

    // Last resort fallback (not cryptographically secure - warn in development)
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'CSP Nonce: Using non-cryptographic random generation - not suitable for production'
      );
    }
    const fallbackArray = new Uint8Array(32);
    for (let i = 0; i < fallbackArray.length; i++) {
      fallbackArray[i] = Math.floor(Math.random() * 256);
    }
    return btoa(String.fromCharCode.apply(null, Array.from(fallbackArray)))
      .replace(/[+/]/g, char => (char === '+' ? '-' : '_'))
      .replace(/=/g, '');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('CSP nonce generation failed:', error);
    }
    throw new Error('Failed to generate secure CSP nonce');
  }
}

// Generate CSRF token using cryptographically secure random bytes
export function generateCSRFToken(): string {
  try {
    // Check if we're in Edge Runtime (middleware) or Node.js runtime
    const isEdgeRuntime =
      typeof globalThis !== 'undefined' &&
      typeof globalThis.crypto !== 'undefined' &&
      typeof require === 'undefined';

    if (!isEdgeRuntime && typeof require !== 'undefined') {
      // Use Node.js crypto for secure random generation (API routes)
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
        const crypto = require('crypto');
        return crypto.randomBytes(32).toString('hex');
      } catch {
        // Fall through to Web Crypto API if Node.js crypto fails
      }
    }

    // Use Web Crypto API for Edge Runtime (middleware) or as fallback
    if (globalThis.crypto?.getRandomValues) {
      const array = new Uint8Array(32);
      globalThis.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Fallback to crypto global if available
    if (crypto?.getRandomValues) {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Last resort fallback (not cryptographically secure)
    if (process.env.NODE_ENV !== 'production') {
      console.warn('CSRF: Using non-cryptographic random generation - not suitable for production');
    }
    const fallbackArray = new Uint8Array(32);
    for (let i = 0; i < fallbackArray.length; i++) {
      fallbackArray[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(fallbackArray, byte => byte.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('CSRF token generation failed:', error);
    }
    throw new Error('Failed to generate secure CSRF token');
  }
}

// Verify CSRF token using cryptographically secure comparison
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false;
  }

  try {
    // Ensure both tokens are strings and have the same length
    if (typeof token !== 'string' || typeof sessionToken !== 'string') {
      return false;
    }

    if (token.length !== sessionToken.length) {
      return false;
    }

    // Check if we're in Edge Runtime or Node.js runtime
    const isEdgeRuntime =
      typeof globalThis !== 'undefined' &&
      typeof globalThis.crypto !== 'undefined' &&
      typeof require === 'undefined';

    if (!isEdgeRuntime && typeof require !== 'undefined') {
      // Use Node.js crypto.timingSafeEqual for secure comparison (API routes)
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
        const crypto = require('crypto');
        const tokenBuffer = Buffer.from(token, 'utf8');
        const sessionBuffer = Buffer.from(sessionToken, 'utf8');

        // Ensure buffers are the same length for timingSafeEqual
        if (tokenBuffer.length !== sessionBuffer.length) {
          return false;
        }

        return crypto.timingSafeEqual(tokenBuffer, sessionBuffer);
      } catch {
        // Fall through to manual timing-safe comparison
      }
    }

    // Fallback to manual timing-safe comparison for Edge Runtime
    return timingSafeEqual(token, sessionToken);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('CSRF token verification failed:', error);
    }
    return false;
  }
}

// Manual timing-safe comparison for environments without crypto.timingSafeEqual
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

// Content Security Policy configuration
export interface CSPConfig {
  nonce?: string;
  isDevelopment?: boolean;
}

export function buildCSP(config: CSPConfig = {}): string {
  const { nonce, isDevelopment = false } = config;

  // Base CSP directives with enhanced nonce-based approach
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      ...(nonce ? [`'nonce-${nonce}'`] : []),
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
      // Allow specific trusted domains for analytics/monitoring
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://vercel.live',
      // Allow specific script hashes for critical inline scripts if needed
      "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='", // Empty string hash for safety
    ],
    'style-src': [
      "'self'",
      // ENHANCED: Prioritize nonce-based approach for better Framer Motion compatibility
      ...(nonce ? [`'nonce-${nonce}'`] : []),
      'https://fonts.googleapis.com',
      // Allow hashed styles for critical CSS
      "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='", // Empty string hash for safety
      // ENHANCED: Use unsafe-hashes for Framer Motion inline style attributes
      "'unsafe-hashes'",
      // Add specific hashes for common Framer Motion transform patterns
      "'sha256-znj0NEVhwILfxeu7V7vtJVK6DtTBhxUVS49mgpuCsZs='", // transform:scaleX(0)
      "'sha256-BnHSOvWj9O4ysF9r1Q6ru0Op368yhiH77C12DzT2jJI='", // transform:translateY(-100px)
      "'sha256-Hqbhl3Qt3fKlgqSGL3zO2zdErWAMYaCV4kyM1eMEQs8='", // opacity:0;transform:translateY(-10px)
      "'sha256-68ahHyH65aqS202beKyu22MkdAEr0fBCN3eHnbYX+wg='", // opacity:0;transform:translateY(20px)
      "'sha256-4IpjyPW3T1vEyCZLF8hGr7A9zNijDZPldrwecZUymac='", // opacity:0;transform:translateY(10px)
      "'sha256-sCpxwgBU/nAP9Dq207PeuDiLWxKtbAbdTK0xFQ8WvW0='", // opacity:0;transform:translateY(80px)
      "'sha256-4q8EqNZohqIz4uYNhQm4inUf9vSzRZfyewHF8wuTSY8='", // opacity:0;transform:translateY(40px)
      "'sha256-xc3Z6FlGcSw3eD/UUqzsUCCHMxhr9zyueta2gHlPiX8='", // opacity:0;transform:translateY(30px)
      "'sha256-y8go9YvXQI44VfiCb0Mp8/u2HJNdFxHoGHdMU5TaeLw='", // opacity:0;transform:translateY(60px)
      "'sha256-rEffuu38Fju0kqQrafaTlxU78KAFkS/nkDM1V69umMk='", // opacity:0;transform:translateY(50px)
      "'sha256-/hiza+UgOYUlmZu/gJ2LL4WNI+kpbzWkjSEKF6vZgqQ='", // opacity:0;transform:translateX(50px)
      "'sha256-hp3Id+Sc9ou+oehRAM0YuDGCJ1K3YW0FAXD7iGsXy0c='", // opacity:0;transform:translateX(30px)
      // MIGRATION: Keep hash-based approach as fallback for compatibility
      ...(isDevelopment || !nonce ? FRAMER_MOTION_CSP_HASHES : []),
      // Optional: Additional dynamically loaded hashes (fallback)
      ...(isDevelopment || !nonce ? additionalHashes : []),
      // Development only: Allow unsafe-inline for easier development
      ...(isDevelopment ? ["'unsafe-inline'"] : []),
    ],
    'style-src-elem': [
      "'self'",
      ...(nonce ? [`'nonce-${nonce}'`] : []),
      'https://fonts.googleapis.com',
      // Allow inline styles for Framer Motion with nonce
      ...(isDevelopment ? ["'unsafe-inline'"] : []),
    ],
    'style-src-attr': [
      "'self'",
      // ENHANCED: Allow unsafe-hashes for Framer Motion inline style attributes
      "'unsafe-hashes'",
      // Add specific hashes for common Framer Motion transform patterns
      "'sha256-znj0NEVhwILfxeu7V7vtJVK6DtTBhxUVS49mgpuCsZs='", // transform:scaleX(0)
      "'sha256-BnHSOvWj9O4ysF9r1Q6ru0Op368yhiH77C12DzT2jJI='", // transform:translateY(-100px)
      "'sha256-Hqbhl3Qt3fKlgqSGL3zO2zdErWAMYaCV4kyM1eMEQs8='", // opacity:0;transform:translateY(-10px)
      "'sha256-68ahHyH65aqS202beKyu22MkdAEr0fBCN3eHnbYX+wg='", // opacity:0;transform:translateY(20px)
      "'sha256-4IpjyPW3T1vEyCZLF8hGr7A9zNijDZPldrwecZUymac='", // opacity:0;transform:translateY(10px)
      "'sha256-sCpxwgBU/nAP9Dq207PeuDiLWxKtbAbdTK0xFQ8WvW0='", // opacity:0;transform:translateY(80px)
      "'sha256-4q8EqNZohqIz4uYNhQm4inUf9vSzRZfyewHF8wuTSY8='", // opacity:0;transform:translateY(40px)
      "'sha256-xc3Z6FlGcSw3eD/UUqzsUCCHMxhr9zyueta2gHlPiX8='", // opacity:0;transform:translateY(30px)
      "'sha256-y8go9YvXQI44VfiCb0Mp8/u2HJNdFxHoGHdMU5TaeLw='", // opacity:0;transform:translateY(60px)
      "'sha256-rEffuu38Fju0kqQrafaTlxU78KAFkS/nkDM1V69umMk='", // opacity:0;transform:translateY(50px)
      "'sha256-/hiza+UgOYUlmZu/gJ2LL4WNI+kpbzWkjSEKF6vZgqQ='", // opacity:0;transform:translateX(50px)
      "'sha256-hp3Id+Sc9ou+oehRAM0YuDGCJ1K3YW0FAXD7iGsXy0c='", // opacity:0;transform:translateX(30px)
      // Development only: Allow unsafe-inline for easier development
      ...(isDevelopment ? ["'unsafe-inline'"] : []),
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://www.blackwoodscreative.com', // Company assets and logos
      'https://images.unsplash.com',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
    ],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': [
      "'self'",
      'https://api.resend.com',
      'https://api.sendgrid.com',
      'https://formspree.io', // Required for contact form submissions
      'https://www.google-analytics.com',
      'https://vercel.live',
      ...(isDevelopment ? ['ws://localhost:*', 'wss://localhost:*'] : []),
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'", 'https://formspree.io'], // Allow contact form submissions
    'frame-ancestors': ["'none'"],
    'frame-src': ["'none'"],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'media-src': ["'self'", 'data:', 'blob:'],
    // Additional security directives
    'child-src': ["'none'"],
    'script-src-elem': [
      "'self'",
      ...(nonce ? [`'nonce-${nonce}'`] : []),
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://vercel.live',
    ],
  };

  // CSP configuration tracked internally for production diagnostics

  // Build CSP string
  const cspString = Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');

  // Final CSP string configuration tracked internally

  // Add CSP violation reporting in production
  const reportUri = isDevelopment ? '' : '; report-uri /api/csp-report';

  return `${cspString}; block-all-mixed-content; upgrade-insecure-requests${reportUri};`;
}

// Security headers configuration
export function getSecurityHeaders(nonce?: string): Record<string, string> {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Always generate a nonce if not provided for maximum security
  const secureNonce = nonce ?? generateNonce();

  return {
    // Content Security Policy
    'Content-Security-Policy': buildCSP({ nonce: secureNonce, isDevelopment }),

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // XSS Protection (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',

    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // HSTS (HTTP Strict Transport Security)
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

    // Permissions Policy (formerly Feature Policy) - Enhanced
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'accelerometer=()',
      'gyroscope=()',
      'fullscreen=(self)',
      'picture-in-picture=()',
      'web-share=()',
      'clipboard-read=()',
      'clipboard-write=(self)',
    ].join(', '),

    // Additional security headers
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Expect-CT': 'max-age=86400, enforce',
    'X-Robots-Tag': 'noindex, nofollow, nosnippet, noarchive',

    // Cross-Origin Policies
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };
}

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  burstLimit?: number; // Allow burst requests
  blockDuration?: number; // Block duration after limit exceeded
}

export const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // General API rate limiting
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    burstLimit: 20, // Allow 20 burst requests
    blockDuration: 5 * 60 * 1000, // 5 minute block
  },

  // Contact form specific (more restrictive)
  contact: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 5,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    burstLimit: 2, // Allow 2 burst requests
    blockDuration: 15 * 60 * 1000, // 15 minute block
  },

  // Authentication endpoints (very restrictive)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
    burstLimit: 1, // No burst for auth
    blockDuration: 30 * 60 * 1000, // 30 minute block
  },

  // Performance monitoring endpoints
  monitoring: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 50,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    burstLimit: 10,
    blockDuration: 2 * 60 * 1000, // 2 minute block
  },

  // Newsletter signup (restrictive to prevent spam)
  newsletter: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    burstLimit: 1, // No burst for newsletter
    blockDuration: 60 * 60 * 1000, // 1 hour block
  },
};

// In-memory rate limiting store for fallback
interface RateLimitRecord {
  count: number;
  resetTime: number;
  blocked?: boolean;
  blockUntil?: number;
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired records every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    );
  }

  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.store.entries());
    for (const [key, record] of entries) {
      if (now > record.resetTime && (!record.blockUntil || now > record.blockUntil)) {
        this.store.delete(key);
      }
    }
  }

  limit(
    key: string,
    config: RateLimitConfig
  ): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    blocked?: boolean;
  }> {
    return Promise.resolve(
      (() => {
        const now = Date.now();
        const record = this.store.get(key);

        // Check if currently blocked
        if (record?.blocked && record.blockUntil && now < record.blockUntil) {
          return {
            success: false,
            limit: config.maxRequests,
            remaining: 0,
            reset: record.blockUntil,
            blocked: true,
          };
        }

        // Reset or create new record if window expired
        if (!record || now > record.resetTime) {
          const newRecord: RateLimitRecord = {
            count: 1,
            resetTime: now + config.windowMs,
          };
          this.store.set(key, newRecord);

          return {
            success: true,
            limit: config.maxRequests,
            remaining: config.maxRequests - 1,
            reset: newRecord.resetTime,
          };
        }

        // Check if limit exceeded
        if (record.count >= config.maxRequests) {
          // Block the key if block duration is configured
          if (config.blockDuration) {
            record.blocked = true;
            record.blockUntil = now + config.blockDuration;
            this.store.set(key, record);
          }

          return {
            success: false,
            limit: config.maxRequests,
            remaining: 0,
            reset: record.resetTime,
            blocked: !!config.blockDuration,
          };
        }

        // Increment count
        record.count += 1;
        this.store.set(key, record);

        return {
          success: true,
          limit: config.maxRequests,
          remaining: config.maxRequests - record.count,
          reset: record.resetTime,
        };
      })()
    );
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}

// Singleton in-memory rate limiter for fallback
let inMemoryLimiter: InMemoryRateLimiter | null = null;

export function getInMemoryRateLimiter(): InMemoryRateLimiter {
  inMemoryLimiter ??= new InMemoryRateLimiter();
  return inMemoryLimiter;
}

// Note: DOMPurify initialization moved to security-server.ts for Edge Runtime compatibility

// Basic input sanitization for Edge Runtime compatibility
export function sanitizeInput(input: string, options: { maxLength?: number } = {}): string {
  if (typeof input !== 'string') return '';

  const { maxLength = 1000 } = options;

  const sanitized = input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/data:/gi, '') // Remove data: protocol (potential XSS)
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\uFEFF]/g, ''); // Remove Unicode spaces

  return sanitized.slice(0, maxLength);
}

// Alias for backward compatibility
export const sanitizeInputSync = sanitizeInput;

export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';

  // Basic email sanitization
  const sanitized = email.toLowerCase().trim();

  // Additional checks for common invalid patterns
  if (sanitized.includes('..') || sanitized.startsWith('.') || sanitized.endsWith('.')) {
    return '';
  }

  // Check for dots at the end of local part
  const [localPart] = sanitized.split('@');
  if (localPart && (localPart.endsWith('.') || localPart.startsWith('.'))) {
    return '';
  }

  // Validate email format (ReDoS-safe) - simplified regex to avoid catastrophic backtracking
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(sanitized) ? sanitized : '';
}

// SQL Injection prevention utilities
export function sanitizeForDatabase(input: string): string {
  if (typeof input !== 'string') return '';

  // Remove common SQL injection patterns
  return input
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, '') // Remove block comment end
    .replace(/\bUNION\s+/gi, '') // Remove UNION keyword with space
    .replace(/\bSELECT\s+/gi, '') // Remove SELECT keyword with space
    .replace(/\bINSERT\s+/gi, '') // Remove INSERT keyword with space
    .replace(/\bUPDATE\s+/gi, '') // Remove UPDATE keyword with space
    .replace(/\bDELETE\s+/gi, '') // Remove DELETE keyword with space
    .replace(/\bDROP\s+/gi, '') // Remove DROP keyword with space
    .replace(/\bCREATE\s+/gi, '') // Remove CREATE keyword with space
    .replace(/\bALTER\s+/gi, '') // Remove ALTER keyword with space
    .replace(/\bEXEC\s+/gi, '') // Remove EXEC keyword with space
    .replace(/\bEXECUTE\s+/gi, '') // Remove EXECUTE keyword with space
    .replace(/\bSCRIPT\s+/gi, '') // Remove SCRIPT keyword with space
    .replace(/\bWHERE\s+/gi, '') // Remove WHERE keyword with space
    .replace(/\bFROM\s+/gi, '') // Remove FROM keyword with space
    .trim();
}

// NoSQL Injection prevention utilities
export function sanitizeForNoSQL(input: unknown): unknown {
  if (typeof input === 'string') {
    return sanitizeInput(input);
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeForNoSQL);
  }

  if (input && typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      // Prevent MongoDB operator injection
      if (key.startsWith('$') || key.includes('.')) {
        continue; // Skip potentially dangerous keys
      }
      // Safe object assignment with validation
      const sanitizedKey = sanitizeInput(key);
      if (typeof sanitizedKey === 'string' && sanitizedKey.length > 0 && sanitizedKey.length < 100) {
        sanitized[sanitizedKey] = sanitizeForNoSQL(value);
      }
    }
    return sanitized;
  }

  return input;
}

// Request size validation
export interface RequestSizeLimits {
  maxBodySize: number; // in bytes
  maxFieldSize: number; // in bytes
  maxFields: number;
  maxFileSize: number; // in bytes
  maxFiles: number;
}

export const DEFAULT_SIZE_LIMITS: RequestSizeLimits = {
  maxBodySize: 1024 * 1024, // 1MB
  maxFieldSize: 1024 * 100, // 100KB
  maxFields: 20,
  maxFileSize: 1024 * 1024 * 5, // 5MB
  maxFiles: 5,
};

export function validateRequestSize(
  request: Request,
  limits: RequestSizeLimits = DEFAULT_SIZE_LIMITS
): { valid: boolean; error?: string } {
  const contentLength = request.headers.get('content-length');

  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (size > limits.maxBodySize) {
      return {
        valid: false,
        error: `Request body too large. Maximum allowed: ${limits.maxBodySize} bytes`,
      };
    }
  }

  return { valid: true };
}

// Enhanced password validation (for future auth implementation)
export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  forbiddenPatterns: string[];
}

export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  forbiddenPatterns: ['password', '123456', 'qwerty', 'admin'],
};

export function validatePassword(
  password: string,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
  }

  if (password.length > policy.maxLength) {
    errors.push(`Password must be no more than ${policy.maxLength} characters long`);
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for forbidden patterns
  const lowerPassword = password.toLowerCase();
  for (const pattern of policy.forbiddenPatterns) {
    if (lowerPassword.includes(pattern.toLowerCase())) {
      errors.push(`Password cannot contain "${pattern}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Security audit utilities
export interface SecurityAuditResult {
  passed: boolean;
  score: number; // 0-100
  issues: SecurityIssue[];
  recommendations: string[];
}

export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'csp' | 'headers' | 'input' | 'auth' | 'transport';
  description: string;
  fix?: string;
}

export function auditSecurity(request?: NextRequest): SecurityAuditResult {
  const issues: SecurityIssue[] = [];
  const recommendations: string[] = [];

  // Check if HTTPS is being used
  if (request && !request.url.startsWith('https://') && process.env.NODE_ENV === 'production') {
    issues.push({
      severity: 'high',
      category: 'transport',
      description: 'Request not using HTTPS in production',
      fix: 'Ensure all requests use HTTPS in production',
    });
  }

  // Check for security headers
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Strict-Transport-Security',
  ];

  if (request) {
    requiredHeaders.forEach(header => {
      if (!request.headers.get(header)) {
        issues.push({
          severity: 'medium',
          category: 'headers',
          description: `Missing security header: ${header}`,
          fix: `Add ${header} to response headers`,
        });
      }
    });
  }

  // Calculate security score
  const criticalIssues = issues.filter(i => i.severity === 'critical').length;
  const highIssues = issues.filter(i => i.severity === 'high').length;
  const mediumIssues = issues.filter(i => i.severity === 'medium').length;
  const lowIssues = issues.filter(i => i.severity === 'low').length;

  const score = Math.max(
    0,
    100 - (criticalIssues * 25 + highIssues * 15 + mediumIssues * 10 + lowIssues * 5)
  );

  // Generate recommendations
  if (criticalIssues > 0) {
    recommendations.push('Address critical security issues immediately');
  }
  if (highIssues > 0) {
    recommendations.push('Fix high-severity security issues as soon as possible');
  }
  if (score < 80) {
    recommendations.push('Implement comprehensive security headers');
    recommendations.push('Review and tighten Content Security Policy');
  }

  return {
    passed: criticalIssues === 0 && highIssues === 0,
    score,
    issues,
    recommendations,
  };
}

// Middleware helper for applying security headers
export function withSecurityHeaders(response: NextResponse, nonce?: string): NextResponse {
  const headers = getSecurityHeaders(nonce);

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// CSRF protection middleware implementing double submit cookie pattern
export function withCSRFProtection(request: NextRequest, response: NextResponse): NextResponse {
  // Skip CSRF for safe HTTP methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return response;
  }

  try {
    // Get CSRF token from header (client-side token)
    const headerToken = request.headers.get('x-csrf-token') ?? request.headers.get('X-CSRF-Token');

    // Get CSRF token from cookie (server-side token)
    const cookieToken = request.cookies.get('csrf-token')?.value;

    // Validate both tokens exist
    if (!headerToken || !cookieToken) {
      logSecurityEvent({
        type: 'csrf_missing_tokens',
        ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown',
        userAgent: request.headers.get('user-agent') ?? 'unknown',
        details: {
          hasHeaderToken: !!headerToken,
          hasCookieToken: !!cookieToken,
          method: request.method,
          url: request.url,
        },
      });

      return new NextResponse('CSRF token missing', {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Verify tokens match using secure comparison
    if (!verifyCSRFToken(headerToken, cookieToken)) {
      logSecurityEvent({
        type: 'csrf_token_mismatch',
        ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown',
        userAgent: request.headers.get('user-agent') ?? 'unknown',
        details: {
          method: request.method,
          url: request.url,
          headerTokenLength: headerToken.length,
          cookieTokenLength: cookieToken.length,
        },
      });

      return new NextResponse('CSRF token validation failed', {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // CSRF validation successful
    return response;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('CSRF protection middleware error:', error);
    }

    logSecurityEvent({
      type: 'csrf_middleware_error',
      ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown',
      userAgent: request.headers.get('user-agent') ?? 'unknown',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        method: request.method,
        url: request.url,
      },
    });

    return new NextResponse('CSRF protection error', {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Security logging
export function logSecurityEvent(event: {
  type:
    | 'csp_violation'
    | 'rate_limit'
    | 'csrf_failure'
    | 'csrf_missing_tokens'
    | 'csrf_token_mismatch'
    | 'csrf_middleware_error'
    | 'suspicious_activity';
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}): void {
  // Create log entry with timestamp
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: event.type,
    ...(event.ip && { ip: event.ip }),
    ...(event.userAgent && { userAgent: event.userAgent }),
    ...(event.details && { details: event.details }),
  };

  // Log to console in development/test for debugging (not in production)
  if (process.env.NODE_ENV !== 'production') {
    logger.warn('Security Event', logEntry);
  }

  // In production, this would send to a security monitoring service
  // Security event logged for monitoring
}
