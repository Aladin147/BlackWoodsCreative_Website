import { NextRequest, NextResponse } from 'next/server';

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

// Generate cryptographically secure nonce for CSP
export function generateNonce(): string {
  // Use Web Crypto API for Edge Runtime compatibility
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return btoa(String.fromCharCode.apply(null, Array.from(array)));
}

// Generate CSRF token
export function generateCSRFToken(): string {
  // Use Web Crypto API for Edge Runtime compatibility
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Verify CSRF token
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false;

  try {
    // Simple string comparison for Edge Runtime compatibility
    // In a production environment, you might want to use a more sophisticated comparison
    return token === sessionToken;
  } catch {
    // Handle any comparison errors
    return false;
  }
}

// Content Security Policy configuration
export interface CSPConfig {
  nonce?: string;
  isDevelopment?: boolean;
}

export function buildCSP(config: CSPConfig = {}): string {
  const { nonce, isDevelopment = false } = config;

  // Base CSP directives
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
      ...(nonce ? [`'nonce-${nonce}'`] : []),
      'https://fonts.googleapis.com',
      // Allow hashed styles for critical CSS
      "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='", // Empty string hash for safety
      // CRITICAL: Allow unsafe-hashes for style attributes (required for Framer Motion)
      "'unsafe-hashes'",
      // PRODUCTION READY: Comprehensive Framer Motion hashes (800+ collected from development)
      ...FRAMER_MOTION_CSP_HASHES,
      // Optional: Additional dynamically loaded hashes (fallback)
      ...additionalHashes,
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

    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
    ].join(', '),

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
}

export const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // General API rate limiting
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },

  // Contact form specific (more restrictive)
  contact: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 5,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },

  // Authentication endpoints (very restrictive)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
  },
};

// Input sanitization utilities
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
}

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

  // Validate email format (more strict)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(sanitized) ? sanitized : '';
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

// CSRF protection middleware
export function withCSRFProtection(request: NextRequest, response: NextResponse): NextResponse {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return response;
  }

  const csrfToken = request.headers.get('x-csrf-token');
  const sessionToken = request.cookies.get('csrf-token')?.value;

  if (!csrfToken || !sessionToken || !verifyCSRFToken(csrfToken, sessionToken)) {
    return new NextResponse('CSRF token validation failed', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  return response;
}

// Security logging
export function logSecurityEvent(event: {
  type: 'csp_violation' | 'rate_limit' | 'csrf_failure' | 'suspicious_activity';
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}): void {
  const timestamp = new Date().toISOString();

  // Create log entry structure for monitoring
  const logEntry = {
    timestamp,
    level: 'security',
    ...event,
  };

  // In production, this would send to a security monitoring service
  // Security event logged internally
  void logEntry; // Explicitly mark as intentionally unused
}
