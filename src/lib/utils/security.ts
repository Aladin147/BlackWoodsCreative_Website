import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Security utilities for BlackWoods Creative website
 * Implements comprehensive security measures including CSP, CSRF protection, and more
 */

// Generate cryptographically secure nonce for CSP
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

// Generate CSRF token
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Verify CSRF token
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false;

  try {
    const tokenBuffer = Buffer.from(token, 'hex');
    const sessionBuffer = Buffer.from(sessionToken, 'hex');

    // Buffers must be same length for timingSafeEqual
    if (tokenBuffer.length !== sessionBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(tokenBuffer, sessionBuffer);
  } catch {
    // Handle invalid hex strings
    return false;
  }
}

// Content Security Policy configuration
export interface CSPConfig {
  nonce?: string;
  isDevelopment?: boolean;
  allowUnsafeEval?: boolean;
}

export function buildCSP(config: CSPConfig = {}): string {
  const { nonce, isDevelopment = false, allowUnsafeEval = false } = config;
  
  // Base CSP directives
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      ...(nonce ? [`'nonce-${nonce}'`] : []),
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
      ...(allowUnsafeEval ? ["'unsafe-eval'"] : []),
      // Allow specific trusted domains for analytics/monitoring
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://vercel.live',
    ],
    'style-src': [
      "'self'",
      ...(nonce ? [`'nonce-${nonce}'`] : ["'unsafe-inline'"]),
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://images.unsplash.com',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
    ],
    'connect-src': [
      "'self'",
      'https://api.resend.com',
      'https://api.sendgrid.com',
      'https://www.google-analytics.com',
      'https://vercel.live',
      ...(isDevelopment ? ['ws://localhost:*', 'wss://localhost:*'] : []),
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'frame-src': ["'none'"],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'media-src': ["'self'", 'data:', 'blob:'],
  };

  // Build CSP string
  const cspString = Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');

  return `${cspString}; block-all-mixed-content; upgrade-insecure-requests;`;
}

// Security headers configuration
export function getSecurityHeaders(nonce?: string): Record<string, string> {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    // Content Security Policy
    'Content-Security-Policy': buildCSP({ nonce, isDevelopment }),
    
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
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
  
  const score = Math.max(0, 100 - (criticalIssues * 25 + highIssues * 15 + mediumIssues * 10 + lowIssues * 5));
  
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
  const logEntry = {
    timestamp,
    level: 'security',
    ...event,
  };
  
  // In production, this would send to a security monitoring service
  console.warn('🔒 Security Event:', JSON.stringify(logEntry, null, 2));
}
