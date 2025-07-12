import { safeObjectIteration } from './safe-object-access';

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input The input string to sanitize
 * @returns Sanitized string with dangerous characters escaped
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes form data object
 * @param formData Object containing form data
 * @returns Sanitized form data object
 */
export function sanitizeFormData<T extends Record<string, unknown>>(formData: T): T {
  const sanitized: Record<string, unknown> = { ...formData };

  // Use safe object iteration to prevent object injection
  safeObjectIteration(sanitized, (key, value) => {
    if (typeof value === 'string' && typeof key === 'string' && key.length > 0 && key.length < 100) {
      // Safe object assignment with validation
      sanitized[key] = sanitizeInput(value);
    }
  });

  return sanitized as T;
}
