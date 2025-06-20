import {
  debounce,
  throttle,
  validateEmail,
  validatePhone,
  formatDate,
  generateSlug,
  prefersReducedMotion,
  scrollToElement,
  cn,
} from '../index';

// Mock DOM methods
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: mockScrollTo,
});

const mockQuerySelector = jest.fn();
Object.defineProperty(document, 'querySelector', {
  writable: true,
  value: mockQuerySelector,
});

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('debounce', () => {
    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should cancel previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('throttle', () => {
    it('should limit function execution', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first'); // Should execute immediately
      throttledFn('second'); // Should be throttled

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      jest.advanceTimersByTime(100);

      // The throttled function should have executed with the last value
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('second');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test..test@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('1234567890')).toBe(true);
      expect(validatePhone('+44 20 7946 0958')).toBe(true);
      expect(validatePhone('(555) 123-4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc123')).toBe(false);
      expect(validatePhone('')).toBe(false);
      expect(validatePhone('+0123456789')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBe('January 15, 2024');
    });

    it('should handle string dates', () => {
      const formatted = formatDate('2024-12-25');
      expect(formatted).toBe('December 25, 2024');
    });
  });

  describe('generateSlug', () => {
    it('should generate valid slugs', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('Test & Example!')).toBe('test-example');
      expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(generateSlug('Special-Characters_123')).toBe('special-characters-123');
    });

    it('should handle edge cases', () => {
      expect(generateSlug('')).toBe('');
      expect(generateSlug('   ')).toBe('');
      expect(generateSlug('!@#$%^&*()')).toBe('');
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return false when matchMedia is not available', () => {
      // This is already mocked in jest.setup.js to return false
      expect(prefersReducedMotion()).toBe(false);
    });
  });

  describe('scrollToElement', () => {
    it('should scroll to element with offset', () => {
      const mockElement = {
        getBoundingClientRect: () => ({ top: 500 }),
      };
      mockQuerySelector.mockReturnValue(mockElement);
      Object.defineProperty(window, 'pageYOffset', { value: 100 });

      scrollToElement('#test', 80);

      expect(mockQuerySelector).toHaveBeenCalledWith('#test');
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 520, // 500 + 100 - 80
        behavior: 'smooth',
      });
    });

    it('should handle missing element gracefully', () => {
      mockQuerySelector.mockReturnValue(null);

      scrollToElement('#missing');

      expect(mockQuerySelector).toHaveBeenCalledWith('#missing');
      expect(mockScrollTo).not.toHaveBeenCalled();
    });
  });

  describe('cn (className utility)', () => {
    it('should combine class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    });
  });
});
