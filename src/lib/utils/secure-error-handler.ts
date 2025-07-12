/**
 * Secure Error Handler
 * Prevents information disclosure through error messages
 */

import { sanitizeInput } from './security';

export interface SecureErrorOptions {
  logError?: boolean;
  includeStack?: boolean;
  customMessage?: string;
  errorCode?: string;
}

export interface SecureErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    timestamp: string;
    requestId?: string;
  };
}

// Generic error messages to prevent information disclosure
const GENERIC_ERROR_MESSAGES = {
  validation: 'Invalid input provided',
  authentication: 'Authentication failed',
  authorization: 'Access denied',
  rateLimit: 'Too many requests',
  server: 'Internal server error',
  notFound: 'Resource not found',
  database: 'Data operation failed',
  network: 'Network error occurred',
  timeout: 'Request timeout',
  maintenance: 'Service temporarily unavailable',
} as const;

export type ErrorType = keyof typeof GENERIC_ERROR_MESSAGES;

export class SecureError extends Error {
  public readonly type: ErrorType;
  public readonly code?: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(type: ErrorType, statusCode = 500, code?: string, isOperational = true) {
    super(GENERIC_ERROR_MESSAGES[type]);
    this.type = type;
    if (code !== undefined) {
      this.code = code;
    }
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'SecureError';

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SecureError);
    }
  }
}

export function createSecureErrorResponse(
  error: Error | SecureError,
  options: SecureErrorOptions = {}
): SecureErrorResponse {
  const { logError = true, includeStack = false, customMessage, errorCode } = options;

  // Log the actual error for debugging (server-side only)
  if (logError && typeof window === 'undefined') {
    console.error('Secure Error Handler:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }

  // Determine the appropriate generic message
  let message: string;
  let code: string | undefined;

  if (error instanceof SecureError) {
    message = customMessage ?? error.message;
    code = errorCode ?? error.code;
  } else {
    // For unknown errors, use generic server error message
    message = customMessage ?? GENERIC_ERROR_MESSAGES.server;
    code = errorCode ?? 'INTERNAL_ERROR';
  }

  const response: SecureErrorResponse = {
    success: false,
    error: {
      message,
      ...(code && { code }),
      timestamp: new Date().toISOString(),
    },
  };

  // Only include stack trace in development and if explicitly requested
  if (includeStack && process.env.NODE_ENV === 'development') {
    (response.error as Record<string, unknown>).stack = error.stack;
  }

  return response;
}

// Utility functions for common error scenarios
export const secureErrors = {
  validation: (code?: string) => new SecureError('validation', 400, code),
  authentication: (code?: string) => new SecureError('authentication', 401, code),
  authorization: (code?: string) => new SecureError('authorization', 403, code),
  notFound: (code?: string) => new SecureError('notFound', 404, code),
  rateLimit: (code?: string) => new SecureError('rateLimit', 429, code),
  server: (code?: string) => new SecureError('server', 500, code),
  database: (code?: string) => new SecureError('database', 500, code),
  network: (code?: string) => new SecureError('network', 502, code),
  timeout: (code?: string) => new SecureError('timeout', 504, code),
  maintenance: (code?: string) => new SecureError('maintenance', 503, code),
};

// Middleware for handling errors securely
export function withSecureErrorHandling<T extends (...args: unknown[]) => unknown>(
  handler: T,
  options: SecureErrorOptions = {}
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      const secureResponse = createSecureErrorResponse(
        error instanceof Error ? error : new Error(String(error)),
        options
      );

      // For API routes, return the secure error response
      if (typeof Response !== 'undefined') {
        const statusCode = error instanceof SecureError ? error.statusCode : 500;
        return new Response(JSON.stringify(secureResponse), {
          status: statusCode,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // For other contexts, throw the secure error
      throw error instanceof SecureError ? error : secureErrors.server();
    }
  }) as T;
}

// Sanitize error messages for client consumption
export function sanitizeErrorMessage(message: string): string {
  // Remove file paths
  message = message.replace(/\/[^\s]+\.(js|ts|jsx|tsx)/g, '[file]');

  // Remove database connection strings
  message = message.replace(/mongodb:\/\/[^\s]+/g, '[database]');
  message = message.replace(/postgres:\/\/[^\s]+/g, '[database]');

  // Remove API keys and tokens
  message = message.replace(/[a-zA-Z0-9]{32,}/g, '[token]');

  // Remove IP addresses
  message = message.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[ip]');

  // Remove email addresses
  message = message.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]');

  return message;
}

// Rate limiting error with retry information
export function createRateLimitError(retryAfter: number): SecureError {
  const error = secureErrors.rateLimit('RATE_LIMIT_EXCEEDED');
  (error as SecureError & { retryAfter?: number }).retryAfter = retryAfter;
  return error;
}

// Validation error with field information (sanitized)
export function createValidationError(fields: string[]): SecureError {
  const error = secureErrors.validation('VALIDATION_FAILED');
  (error as SecureError & { fields?: string[] }).fields = fields.map(field => sanitizeInput(field));
  return error;
}

// Types are already exported at their declarations above
