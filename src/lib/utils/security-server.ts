/**
 * Server-Only Security Utilities
 * Functions that use JSDOM and are not compatible with Edge Runtime
 */

import DOMPurify from 'dompurify';

// Type for DOMPurify instance
type DOMPurifyInstance = typeof DOMPurify | { sanitize: (input: string) => string };

// Lazy initialization function for server-side DOMPurify
let purify: DOMPurifyInstance | null = null;

async function initializePurify(): Promise<DOMPurifyInstance | null> {
  if (purify) return purify;

  if (typeof window === 'undefined') {
    // Server-side: dynamically import JSDOM
    try {
      const { JSDOM } = await import('jsdom');
      const { window } = new JSDOM('');
      purify = DOMPurify(window);
    } catch {
      // Fallback - use basic string sanitization
      console.warn('JSDOM not available, using basic sanitization');
      purify = {
        sanitize: (input: string) => {
          // Basic HTML tag removal
          return input.replace(/<[^>]*>/g, '');
        },
      };
    }
  } else {
    // Client-side: use window directly
    purify = DOMPurify(window);
  }

  return purify;
}

// Enhanced input sanitization utilities using DOMPurify (server-only)
export async function sanitizeInput(
  input: string,
  options: { maxLength?: number; allowHtml?: boolean } = {}
): Promise<string> {
  if (typeof input !== 'string') return '';

  const { maxLength = 1000, allowHtml = false } = options;

  let sanitized = input.trim();

  if (!allowHtml) {
    // Simple HTML tag removal while preserving text content
    sanitized = sanitized
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/data:/gi, '') // Remove data: protocol (potential XSS)
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  } else {
    // For HTML content, use DOMPurify for comprehensive sanitization
    const purifyInstance = await initializePurify();
    sanitized = purifyInstance?.sanitize(sanitized) ?? sanitized;
  }

  return sanitized.slice(0, maxLength);
}

// Comprehensive HTML sanitization using DOMPurify for rich content (server-only)
export async function sanitizeHtml(
  html: string,
  options: { allowedTags?: string[]; allowedAttributes?: string[] } = {}
): Promise<string> {
  if (typeof html !== 'string') return '';

  const { allowedTags, allowedAttributes } = options;

  const config: Record<string, unknown> = {};

  if (allowedTags) {
    config.ALLOWED_TAGS = allowedTags;
  }

  if (allowedAttributes) {
    config.ALLOWED_ATTR = allowedAttributes;
  }

  const purifyInstance = await initializePurify();
  return purifyInstance?.sanitize(html) as string ?? html;
}

// Synchronous version for backward compatibility (uses basic sanitization only)
export function sanitizeInputSync(input: string, options: { maxLength?: number } = {}): string {
  if (typeof input !== 'string') return '';

  const { maxLength = 1000 } = options;

  const sanitized = input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/data:/gi, '') // Remove data: protocol (potential XSS)
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers

  return sanitized.slice(0, maxLength);
}

// NoSQL Injection prevention utilities (server-only with async sanitization)
export async function sanitizeForNoSQL(input: unknown): Promise<unknown> {
  if (typeof input === 'string') {
    return await sanitizeInput(input);
  }

  if (Array.isArray(input)) {
    return await Promise.all(input.map(sanitizeForNoSQL));
  }

  if (input && typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      // Prevent MongoDB operator injection
      if (key.startsWith('$') || key.includes('.')) {
        continue; // Skip potentially dangerous keys
      }
      const sanitizedKey = await sanitizeInput(key);
      // Prevent prototype pollution and safe object assignment
      if (sanitizedKey && !['__proto__', 'constructor', 'prototype'].includes(sanitizedKey) &&
          typeof sanitizedKey === 'string' && sanitizedKey.length > 0 && sanitizedKey.length < 100) {
        sanitized[sanitizedKey] = await sanitizeForNoSQL(value);
      }
    }
    return sanitized;
  }

  return input;
}

// Synchronous NoSQL sanitization for Edge Runtime compatibility
export function sanitizeForNoSQLSync(input: unknown): unknown {
  if (typeof input === 'string') {
    return sanitizeInputSync(input);
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeForNoSQLSync);
  }

  if (input && typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      // Prevent MongoDB operator injection
      if (key.startsWith('$') || key.includes('.')) {
        continue; // Skip potentially dangerous keys
      }
      const sanitizedKey = sanitizeInputSync(key);
      // Prevent prototype pollution and safe object assignment
      if (sanitizedKey && !['__proto__', 'constructor', 'prototype'].includes(sanitizedKey) &&
          typeof sanitizedKey === 'string' && sanitizedKey.length > 0 && sanitizedKey.length < 100) {
        sanitized[sanitizedKey] = sanitizeForNoSQLSync(value);
      }
    }
    return sanitized;
  }

  return input;
}
