/**
 * Safe Object Access Utilities
 * Provides secure methods for accessing object properties to prevent object injection attacks
 */

/**
 * Safely access object property with validation
 * @param obj - The object to access
 * @param key - The property key
 * @param allowedKeys - Optional array of allowed keys for validation
 * @returns The property value or undefined if not safe to access
 */
export function safeObjectAccess<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K,
  allowedKeys?: readonly (string | number | symbol)[]
): T[K] | undefined {
  // Validate that the object exists and is actually an object
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }

  // If allowedKeys is provided, validate the key is in the allowed list
  if (allowedKeys && !allowedKeys.includes(key)) {
    return undefined;
  }

  // Use hasOwnProperty to ensure we're not accessing prototype properties
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    return undefined;
  }

  return obj[key];
}

/**
 * Safely iterate over object keys with validation
 * @param obj - The object to iterate over
 * @param callback - Function to call for each safe key-value pair
 * @param allowedKeys - Optional array of allowed keys for validation
 */
export function safeObjectIteration<T extends Record<string, unknown>>(
  obj: T,
  callback: (key: string, value: unknown) => void,
  allowedKeys?: readonly string[]
): void {
  if (!obj || typeof obj !== 'object') {
    return;
  }

  // Use Object.keys to get only enumerable own properties
  const keys = Object.keys(obj);

  for (const key of keys) {
    // Skip if allowedKeys is provided and key is not in the list
    if (allowedKeys && !allowedKeys.includes(key)) {
      continue;
    }

    // Double-check with hasOwnProperty for extra security
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      callback(key, obj[key]);
    }
  }
}

/**
 * Safely set object property with validation
 * @param obj - The object to modify
 * @param key - The property key
 * @param value - The value to set
 * @param allowedKeys - Optional array of allowed keys for validation
 * @returns Whether the operation was successful
 */
export function safeObjectSet<T extends Record<string, unknown>>(
  obj: T,
  key: string,
  value: unknown,
  allowedKeys?: readonly string[]
): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  // Validate key format (alphanumeric, underscore, hyphen only)
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
    return false;
  }

  // Limit key length to prevent abuse
  if (key.length > 100) {
    return false;
  }

  // If allowedKeys is provided, validate the key is in the allowed list
  if (allowedKeys && !allowedKeys.includes(key)) {
    return false;
  }

  // Prevent setting dangerous properties
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  if (dangerousKeys.includes(key)) {
    return false;
  }

  try {
    (obj as Record<string, unknown>)[key] = value;
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a safe object from user input with key validation
 * @param input - The input object
 * @param allowedKeys - Array of allowed keys
 * @param maxKeys - Maximum number of keys allowed (default: 50)
 * @returns A new object with only safe, allowed properties
 */
export function createSafeObject<T extends Record<string, unknown>>(
  input: T,
  allowedKeys: readonly string[],
  maxKeys = 50
): Partial<T> {
  if (!input || typeof input !== 'object') {
    return {};
  }

  const result: Partial<T> = {};
  let keyCount = 0;

  for (const key of allowedKeys) {
    if (keyCount >= maxKeys) {
      break;
    }

    if (Object.prototype.hasOwnProperty.call(input, key)) {
      result[key as keyof T] = input[key as keyof T];
      keyCount++;
    }
  }

  return result;
}

/**
 * Sanitize object keys to prevent injection
 * @param obj - The object to sanitize
 * @param maxKeyLength - Maximum allowed key length (default: 100)
 * @returns A new object with sanitized keys
 */
export function sanitizeObjectKeys<T extends Record<string, unknown>>(
  obj: T,
  maxKeyLength = 100
): Record<string, unknown> {
  if (!obj || typeof obj !== 'object') {
    return {};
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    // Sanitize key: only allow alphanumeric, underscore, hyphen
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '');

    // Skip if key becomes empty or too long after sanitization
    if (!sanitizedKey || sanitizedKey.length > maxKeyLength) {
      continue;
    }

    // Skip dangerous keys
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    if (dangerousKeys.includes(sanitizedKey)) {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[sanitizedKey] = obj[key];
    }
  }

  return result;
}

/**
 * Validate that an object only contains allowed keys
 * @param obj - The object to validate
 * @param allowedKeys - Array of allowed keys
 * @returns Whether the object is valid
 */
export function validateObjectKeys<T extends Record<string, unknown>>(
  obj: T,
  allowedKeys: readonly string[]
): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const keys = Object.keys(obj);

  // Check that all keys in the object are in the allowed list
  return keys.every(key => allowedKeys.includes(key));
}

/**
 * Deep clone an object safely, preventing prototype pollution
 * @param obj - The object to clone
 * @param maxDepth - Maximum recursion depth (default: 10)
 * @returns A safely cloned object
 */
export function safeDeepClone<T>(obj: T, maxDepth = 10): T {
  if (maxDepth <= 0) {
    return obj;
  }

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => safeDeepClone(item, maxDepth - 1)) as T;
  }

  const cloned = {} as T;

  for (const key of Object.keys(obj)) {
    // Skip dangerous keys
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      (cloned as Record<string, unknown>)[key] = safeDeepClone(
        (obj as Record<string, unknown>)[key],
        maxDepth - 1
      );
    }
  }

  return cloned;
}
