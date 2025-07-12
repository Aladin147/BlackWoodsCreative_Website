/**
 * Security Middleware Utilities
 * Additional security layers for request processing
 */

import { NextRequest, NextResponse } from 'next/server';

import { createSecureErrorResponse, secureErrors } from './secure-error-handler';
import {
  sanitizeInputSync,
  sanitizeForNoSQL,
  validateRequestSize,
  DEFAULT_SIZE_LIMITS,
  type RequestSizeLimits,
} from './security';

// Suspicious patterns that might indicate attacks
const SUSPICIOUS_PATTERNS = [
  // XSS patterns (ReDoS-safe)
  /<script[^>]{0,1000}>[\s\S]{0,10000}<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /on\w{1,20}\s*=/gi,
  /expression\s*\(/gi,

  // SQL injection patterns (ReDoS-safe)
  /\b(?:UNION|SELECT|INSERT|UPDATE|DELETE|DROP)\b/gi,
  /\b(?:OR|AND)\b\s+\d{1,10}\s*=\s*\d{1,10}/gi,
  /['";]\s{0,10}\b(?:OR|AND)\b/gi,

  // Command injection patterns
  /[;&|`$(){}[\]]/g,
  /\.\.\//g,

  // Path traversal patterns
  /\.\.[\\/]/g,
  /[\\/]\.\.[\\/]/g,

  // NoSQL injection patterns
  /\$where/gi,
  /\$ne/gi,
  /\$gt/gi,
  /\$lt/gi,
];

// Rate limiting bypass patterns (for future use)
// const RATE_LIMIT_BYPASS_PATTERNS = [
//   /x-forwarded-for/gi,
//   /x-real-ip/gi,
//   /x-originating-ip/gi,
//   /x-cluster-client-ip/gi,
// ];

export interface SecurityMiddlewareOptions {
  enableSuspiciousPatternDetection?: boolean;
  enableRequestSizeValidation?: boolean;
  enableHeaderValidation?: boolean;
  enableRateLimitBypassDetection?: boolean;
  customSizeLimits?: Partial<RequestSizeLimits>;
  allowedOrigins?: string[];
  blockedUserAgents?: string[];
}

export interface SecurityValidationResult {
  passed: boolean;
  blocked: boolean;
  reason?: string;
  suspiciousScore: number;
  sanitizedData?: unknown;
}

export class SecurityMiddleware {
  private options: Required<SecurityMiddlewareOptions>;

  constructor(options: SecurityMiddlewareOptions = {}) {
    this.options = {
      enableSuspiciousPatternDetection: true,
      enableRequestSizeValidation: true,
      enableHeaderValidation: true,
      enableRateLimitBypassDetection: true,
      customSizeLimits: {},
      allowedOrigins: [],
      blockedUserAgents: [
        'sqlmap',
        'nikto',
        'nessus',
        'openvas',
        'nmap',
        'masscan',
        'zap',
        'w3af',
        'burp',
      ],
      ...options,
    };
  }

  async validateRequest(request: NextRequest): Promise<SecurityValidationResult> {
    let suspiciousScore = 0;
    const reasons: string[] = [];

    // 1. Validate request size
    if (this.options.enableRequestSizeValidation) {
      const sizeLimits = { ...DEFAULT_SIZE_LIMITS, ...this.options.customSizeLimits };
      const sizeValidation = validateRequestSize(request, sizeLimits);

      if (!sizeValidation.valid) {
        return {
          passed: false,
          blocked: true,
          ...(sizeValidation.error && { reason: sizeValidation.error }),
          suspiciousScore: 100,
        };
      }
    }

    // 2. Validate headers
    if (this.options.enableHeaderValidation) {
      const headerValidation = this.validateHeaders(request);
      suspiciousScore += headerValidation.score;
      if (headerValidation.blocked) {
        reasons.push(headerValidation.reason || 'Suspicious headers detected');
      }
    }

    // 3. Check user agent
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
    for (const blockedAgent of this.options.blockedUserAgents) {
      if (userAgent.includes(blockedAgent.toLowerCase())) {
        return {
          passed: false,
          blocked: true,
          reason: 'Blocked user agent detected',
          suspiciousScore: 100,
        };
      }
    }

    // 4. Validate origin (for CORS)
    if (this.options.allowedOrigins.length > 0) {
      const origin = request.headers.get('origin');
      if (origin && !this.options.allowedOrigins.includes(origin)) {
        suspiciousScore += 30;
        reasons.push('Suspicious origin');
      }
    }

    // 5. Check for rate limit bypass attempts
    if (this.options.enableRateLimitBypassDetection) {
      const bypassAttempt = this.detectRateLimitBypass(request);
      if (bypassAttempt.detected) {
        suspiciousScore += 50;
        reasons.push('Rate limit bypass attempt detected');
      }
    }

    // 6. Analyze request body for suspicious patterns
    if (this.options.enableSuspiciousPatternDetection) {
      try {
        const body = await this.getRequestBody(request);
        if (body) {
          const patternAnalysis = this.analyzeSuspiciousPatterns(body);
          suspiciousScore += patternAnalysis.score;
          if (patternAnalysis.reasons.length > 0) {
            reasons.push(...patternAnalysis.reasons);
          }
        }
      } catch {
        // Body parsing failed - might be suspicious
        suspiciousScore += 20;
        reasons.push('Request body parsing failed');
      }
    }

    // Determine if request should be blocked
    const blocked = suspiciousScore >= 80;
    const passed = suspiciousScore < 50;

    return {
      passed,
      blocked,
      ...(reasons.length > 0 && { reason: reasons.join('; ') }),
      suspiciousScore,
    };
  }

  private validateHeaders(request: NextRequest): {
    score: number;
    blocked: boolean;
    reason?: string;
  } {
    let score = 0;
    const { headers } = request;

    // Check for missing security headers in requests that should have them
    if (request.method === 'POST' || request.method === 'PUT') {
      if (!headers.get('content-type')) {
        score += 20;
      }
    }

    // Check for suspicious header values
    const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-originating-ip'];
    for (const headerName of suspiciousHeaders) {
      const headerValue = headers.get(headerName);
      if (headerValue && this.containsSuspiciousPatterns(headerValue)) {
        score += 30;
      }
    }

    // Check for header injection attempts
    for (const [, value] of headers.entries()) {
      if (value && (value.includes('\n') || value.includes('\r'))) {
        return { score: 100, blocked: true, reason: 'Header injection detected' };
      }
    }

    return { score, blocked: score >= 80 };
  }

  private detectRateLimitBypass(request: NextRequest): { detected: boolean; reason?: string } {
    const { headers } = request;

    // Check for multiple IP headers (potential bypass attempt)
    const ipHeaders = ['x-forwarded-for', 'x-real-ip', 'x-originating-ip', 'x-cluster-client-ip'];
    const presentIpHeaders = ipHeaders.filter(header => headers.get(header));

    if (presentIpHeaders.length > 2) {
      return { detected: true, reason: 'Multiple IP headers detected' };
    }

    // Check for suspicious IP values
    for (const header of presentIpHeaders) {
      const value = headers.get(header);
      if (value && this.containsSuspiciousPatterns(value)) {
        return { detected: true, reason: `Suspicious IP header value: ${header}` };
      }
    }

    return { detected: false };
  }

  private async getRequestBody(request: NextRequest): Promise<string | null> {
    try {
      // Clone the request to avoid consuming the body
      const clonedRequest = request.clone();
      const contentType = clonedRequest.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const json = await clonedRequest.json();
        return JSON.stringify(json);
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await clonedRequest.formData();
        return Array.from(formData.entries())
          .map(([k, v]) => `${k}=${v}`)
          .join('&');
      } else if (contentType.includes('text/')) {
        return await clonedRequest.text();
      }

      return null;
    } catch {
      return null;
    }
  }

  private analyzeSuspiciousPatterns(content: string): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    for (const pattern of SUSPICIOUS_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        score += matches.length * 15;
        reasons.push(`Suspicious pattern detected: ${pattern.source.substring(0, 50)}...`);
      }
    }

    return { score: Math.min(score, 100), reasons };
  }

  private containsSuspiciousPatterns(value: string): boolean {
    return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(value));
  }

  // Sanitize request data
  sanitizeRequestData(data: unknown): unknown {
    if (typeof data === 'string') {
      return sanitizeInputSync(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeRequestData(item));
    }

    if (data && typeof data === 'object') {
      return sanitizeForNoSQL(data);
    }

    return data;
  }
}

// Default security middleware instance
export const defaultSecurityMiddleware = new SecurityMiddleware();

// Middleware wrapper for Next.js
export function withSecurityValidation(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: SecurityMiddlewareOptions
) {
  const middleware = new SecurityMiddleware(options);

  return async (request: NextRequest): Promise<NextResponse> => {
    const validation = await middleware.validateRequest(request);

    if (validation.blocked) {
      const error = secureErrors.validation('SECURITY_VALIDATION_FAILED');
      const errorResponse = createSecureErrorResponse(error, {
        customMessage: validation.reason || 'Request blocked for security reasons',
      });

      return new NextResponse(JSON.stringify(errorResponse), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Add security score to request headers for monitoring
    const response = await handler(request);
    response.headers.set('X-Security-Score', validation.suspiciousScore.toString());

    return response;
  };
}
