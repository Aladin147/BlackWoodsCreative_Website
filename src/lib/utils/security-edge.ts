/**
 * Edge Runtime Compatible Security Utilities
 * Lightweight security functions that work in Edge Runtime without JSDOM
 */

import { NextRequest } from 'next/server';

// Basic input sanitization for Edge Runtime (no JSDOM)
export function sanitizeInputEdge(input: string, options: { maxLength?: number } = {}): string {
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

// NoSQL Injection prevention for Edge Runtime
export function sanitizeForNoSQLEdge(input: unknown): unknown {
  if (typeof input === 'string') {
    return sanitizeInputEdge(input);
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeForNoSQLEdge);
  }

  if (input && typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      // Prevent MongoDB operator injection
      if (key.startsWith('$') || key.includes('.')) {
        continue; // Skip potentially dangerous keys
      }
      sanitized[sanitizeInputEdge(key)] = sanitizeForNoSQLEdge(value);
    }
    return sanitized;
  }

  return input;
}

// Request size validation for Edge Runtime
export interface RequestSizeLimits {
  maxBodySize: number; // in bytes
  maxHeaderSize: number; // in bytes
  maxUrlLength: number; // in characters
  maxQueryParams: number; // number of query parameters
}

export const DEFAULT_SIZE_LIMITS: RequestSizeLimits = {
  maxBodySize: 1024 * 1024, // 1MB
  maxHeaderSize: 8192, // 8KB
  maxUrlLength: 2048, // 2KB
  maxQueryParams: 100,
};

export function validateRequestSizeEdge(
  request: NextRequest,
  limits: RequestSizeLimits = DEFAULT_SIZE_LIMITS
): { valid: boolean; error?: string } {
  try {
    // Check URL length
    if (request.url.length > limits.maxUrlLength) {
      return {
        valid: false,
        error: `URL too long: ${request.url.length} > ${limits.maxUrlLength}`,
      };
    }

    // Check query parameters count
    const { searchParams } = new URL(request.url);
    const paramCount = Array.from(searchParams.keys()).length;
    if (paramCount > limits.maxQueryParams) {
      return {
        valid: false,
        error: `Too many query parameters: ${paramCount} > ${limits.maxQueryParams}`,
      };
    }

    // Check headers size
    let totalHeaderSize = 0;
    request.headers.forEach((value, key) => {
      totalHeaderSize += key.length + value.length;
    });

    if (totalHeaderSize > limits.maxHeaderSize) {
      return {
        valid: false,
        error: `Headers too large: ${totalHeaderSize} > ${limits.maxHeaderSize}`,
      };
    }

    // Note: Body size validation would require reading the body,
    // which is not always possible in middleware. This should be
    // handled at the API route level.

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Request validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Basic email validation for Edge Runtime
export function validateEmailEdge(email: string): boolean {
  if (typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Basic password validation for Edge Runtime
export function validatePasswordEdge(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof password !== 'string') {
    errors.push('Password must be a string');
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return { valid: errors.length === 0, errors };
}

// Rate limiting key generation for Edge Runtime
export function generateRateLimitKey(ip: string, endpoint: string): string {
  return `${sanitizeInputEdge(endpoint)}:${sanitizeInputEdge(ip)}`;
}

// Basic IP validation for Edge Runtime
export function validateIPAddress(ip: string): boolean {
  if (typeof ip !== 'string') return false;

  // IPv4 regex (ReDoS-safe) - simplified to avoid catastrophic backtracking
  const ipv4Regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

  // IPv6 regex (simplified, ReDoS-safe) - basic validation only
  const ipv6Regex = /^[0-9a-fA-F:]+$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
