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

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]);
    }
  }

  return sanitized as T;
}
