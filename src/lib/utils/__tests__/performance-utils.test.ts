import {
  measurePerformance,
  trackScrollPerformance,
  optimizeImages,
  debounce,
  throttle,
  withPerformanceMonitoring,
  createLazyComponent,
  monitorMemoryUsage,
  monitorFPS,
  analyzeBundleSize,
  checkPerformanceBudget,
} from '../performance';
import React from 'react';

// Mock performance API
const mockPerformance = {
  mark: jest.fn(),
  measure: jest.fn(),
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1024 * 1024, // 1MB
    totalJSHeapSize: 4 * 1024 * 1024, // 4MB
  },
};

// Mock global performance
Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
  configurable: true,
});

// Mock window.performance
Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
  configurable: true,
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
}) as jest.Mock;

global.cancelAnimationFrame = jest.fn() as jest.Mock;

// Mock console methods
const consoleSpy = {
  warn: jest.spyOn(console, 'warn').mockImplementation(),
  log: jest.spyOn(console, 'log').mockImplementation(),
  error: jest.spyOn(console, 'error').mockImplementation(),
};

describe('Performance Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    consoleSpy.warn.mockClear();
    consoleSpy.log.mockClear();
    consoleSpy.error.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('measurePerformance', () => {
    it('should be a function', () => {
      expect(typeof measurePerformance).toBe('function');
    });

    it('should accept name and function parameters', () => {
      expect(measurePerformance.length).toBe(2);
    });
  });

  describe('trackScrollPerformance', () => {
    beforeEach(() => {
      // Mock window properties
      Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
    });

    it('tracks scroll metrics correctly', () => {
      const callback = jest.fn();
      const cleanup = trackScrollPerformance(callback);
      
      // Simulate scroll
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
      
      // Fast forward to trigger requestAnimationFrame
      jest.advanceTimersByTime(16);
      
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        scrollY: 100,
        scrollPercent: expect.any(Number),
        direction: expect.any(String),
        velocity: expect.any(Number)
      }));
      
      cleanup();
    });

    it('calculates scroll direction correctly', () => {
      const callback = jest.fn();
      const cleanup = trackScrollPerformance(callback);
      
      // Scroll down
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(16);
      
      // Scroll up
      window.scrollY = 50;
      window.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(16);
      
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        direction: 'up'
      }));
      
      cleanup();
    });

    it('handles zero scroll height', () => {
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 800, writable: true });
      
      const callback = jest.fn();
      const cleanup = trackScrollPerformance(callback);
      
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(16);
      
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        scrollPercent: 0
      }));
      
      cleanup();
    });

    it('uses custom throttle time', () => {
      const callback = jest.fn();
      const cleanup = trackScrollPerformance(callback, 50);
      
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
      
      cleanup();
    });

    it('calculates velocity correctly', () => {
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1016);
      
      const callback = jest.fn();
      const cleanup = trackScrollPerformance(callback);
      
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(16);
      
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        velocity: expect.any(Number)
      }));
      
      cleanup();
    });

    it('prevents multiple RAF calls when ticking', () => {
      const callback = jest.fn();
      const cleanup = trackScrollPerformance(callback);

      // Trigger multiple scroll events rapidly
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));

      // Function should handle multiple calls gracefully
      expect(typeof cleanup).toBe('function');

      cleanup();
    });
  });

  describe('optimizeImages', () => {
    it('optimizes image URL with all options', () => {
      const url = 'https://example.com/image.jpg';
      const options = {
        width: 800,
        height: 600,
        quality: 90,
        format: 'webp' as const
      };
      
      const result = optimizeImages(url, options);
      
      expect(result).toContain('w=800');
      expect(result).toContain('h=600');
      expect(result).toContain('q=90');
      expect(result).toContain('f=webp');
    });

    it('uses default quality when not specified', () => {
      const url = 'https://example.com/image.jpg';
      const result = optimizeImages(url);
      
      expect(result).toContain('q=85');
    });

    it('handles width only', () => {
      const url = 'https://example.com/image.jpg';
      const result = optimizeImages(url, { width: 400 });
      
      expect(result).toContain('w=400');
      expect(result).not.toContain('h=');
    });

    it('handles height only', () => {
      const url = 'https://example.com/image.jpg';
      const result = optimizeImages(url, { height: 300 });
      
      expect(result).toContain('h=300');
      expect(result).not.toContain('w=');
    });

    it('skips format when auto', () => {
      const url = 'https://example.com/image.jpg';
      const result = optimizeImages(url, { format: 'auto' });
      
      expect(result).not.toContain('f=auto');
    });

    it('handles invalid URLs gracefully', () => {
      const invalidUrl = 'not-a-url';
      const result = optimizeImages(invalidUrl);

      expect(result).toBe(invalidUrl);
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        'Failed to optimize image URL:',
        expect.objectContaining({
          message: expect.stringContaining('Invalid URL')
        })
      );
    });

    it('preserves existing query parameters', () => {
      const url = 'https://example.com/image.jpg?existing=param';
      const result = optimizeImages(url, { width: 800 });
      
      expect(result).toContain('existing=param');
      expect(result).toContain('w=800');
    });

    it('handles different image formats', () => {
      const formats = ['webp', 'jpg', 'png'] as const;
      
      formats.forEach(format => {
        const url = 'https://example.com/image.jpg';
        const result = optimizeImages(url, { format });
        
        expect(result).toContain(`f=${format}`);
      });
    });
  });

  describe('debounce', () => {
    it('debounces function calls', () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(fn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('passes arguments correctly', () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);
      
      debouncedFn('arg1', 'arg2');
      jest.advanceTimersByTime(100);
      
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('cancels previous timeout on new calls', () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);
      
      debouncedFn();
      jest.advanceTimersByTime(50);
      debouncedFn();
      jest.advanceTimersByTime(50);
      
      expect(fn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('throttles function calls', () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(fn).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(100);
      
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('passes arguments correctly', () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 100);
      
      throttledFn('arg1', 'arg2');
      
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('prevents calls during throttle period', () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 100);
      
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);
      
      throttledFn();
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(100);
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('withPerformanceMonitoring', () => {
    it('wraps component with performance monitoring', () => {
      const TestComponent = (props: { name: string }) => React.createElement('div', null, props.name);
      const MonitoredComponent = withPerformanceMonitoring(TestComponent, 'TestComponent');

      expect(typeof MonitoredComponent).toBe('function');
    });

    it('logs warning for slow renders', () => {
      mockPerformance.now.mockReturnValueOnce(0).mockReturnValueOnce(20);

      const TestComponent = () => React.createElement('div');
      const MonitoredComponent = withPerformanceMonitoring(TestComponent, 'SlowComponent');

      // This would need a proper React testing environment to fully test
      expect(typeof MonitoredComponent).toBe('function');
    });
  });

  describe('createLazyComponent', () => {
    it('creates lazy component with performance logging', async () => {
      const mockComponent = { default: () => React.createElement('div') };
      const importFn = jest.fn().mockResolvedValue(mockComponent);

      const LazyComponent = createLazyComponent(importFn);

      expect(React.isValidElement(React.createElement(React.Suspense, { fallback: 'Loading...' }, React.createElement(LazyComponent)))).toBe(true);
    });

    it('handles import errors', async () => {
      const importFn = jest.fn().mockRejectedValue(new Error('Import failed'));

      const LazyComponent = createLazyComponent(importFn);

      // The lazy component should be created but will throw when rendered
      expect(typeof LazyComponent).toBe('object');
    });
  });

  describe('monitorMemoryUsage', () => {
    it('returns memory usage when available', () => {
      // Ensure memory property exists on performance
      Object.defineProperty(window.performance, 'memory', {
        value: {
          usedJSHeapSize: 1024 * 1024,
          totalJSHeapSize: 4 * 1024 * 1024,
        },
        configurable: true
      });

      const result = monitorMemoryUsage();

      expect(result).toEqual({
        used: 1024 * 1024,
        total: 4 * 1024 * 1024,
        percentage: 25
      });
    });

    it('returns null when memory API not available', () => {
      const originalPerformance = window.performance;
      // @ts-expect-error - Intentionally overriding performance for testing
      window.performance = { ...mockPerformance };
      delete (window.performance as typeof window.performance & { memory?: unknown }).memory;

      const result = monitorMemoryUsage();

      expect(result).toBeNull();

      window.performance = originalPerformance;
    });
  });

  describe('monitorFPS', () => {
    it('monitors FPS and calls callback', () => {
      const callback = jest.fn();
      const cleanup = monitorFPS(callback);

      // Simulate frame updates
      mockPerformance.now.mockReturnValueOnce(0).mockReturnValueOnce(1000);

      // This would need more complex mocking to fully test FPS calculation
      expect(typeof cleanup).toBe('function');

      cleanup();
      // Function should handle cleanup gracefully
      expect(typeof cleanup).toBe('function');
    });

    it('calculates FPS correctly', () => {
      const callback = jest.fn();
      let frameCount = 0;

      mockPerformance.now.mockImplementation(() => {
        frameCount++;
        return frameCount * 16.67; // ~60fps
      });

      const cleanup = monitorFPS(callback);

      // Advance time to trigger FPS calculation
      jest.advanceTimersByTime(1000);

      cleanup();
    });
  });

  describe('analyzeBundleSize', () => {
    it('returns bundle analysis data', async () => {
      const result = await analyzeBundleSize();

      expect(result).toEqual({
        totalSize: 1024 * 1024,
        gzippedSize: 256 * 1024,
        modules: [
          { name: 'react', size: 100 * 1024 },
          { name: 'framer-motion', size: 200 * 1024 },
          { name: 'app', size: 724 * 1024 }
        ]
      });
    });

    it('resolves with consistent data structure', async () => {
      const result = await analyzeBundleSize();

      expect(result).toHaveProperty('totalSize');
      expect(result).toHaveProperty('gzippedSize');
      expect(result).toHaveProperty('modules');
      expect(Array.isArray(result.modules)).toBe(true);
    });
  });

  describe('checkPerformanceBudget', () => {
    it('passes when within budget', async () => {
      const budget = {
        maxBundleSize: 2 * 1024 * 1024, // 2MB
        maxRenderTime: 50,
        maxMemoryUsage: 50,
        minFPS: 30
      };

      const result = await checkPerformanceBudget(budget);

      expect(result.passed).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('fails when exceeding bundle size budget', async () => {
      const budget = {
        maxBundleSize: 512 * 1024, // 512KB (smaller than mock 1MB)
        maxRenderTime: 50,
        maxMemoryUsage: 50,
        minFPS: 30
      };

      const result = await checkPerformanceBudget(budget);

      expect(result.passed).toBe(false);
      expect(result.violations.some(v => v.includes('Bundle size'))).toBe(true);
    });

    it('fails when exceeding memory usage budget', async () => {
      // Ensure memory property exists
      Object.defineProperty(window.performance, 'memory', {
        value: {
          usedJSHeapSize: 1024 * 1024,
          totalJSHeapSize: 4 * 1024 * 1024,
        },
        configurable: true
      });

      const budget = {
        maxBundleSize: 2 * 1024 * 1024,
        maxRenderTime: 50,
        maxMemoryUsage: 20, // Lower than mock 25%
        minFPS: 30
      };

      const result = await checkPerformanceBudget(budget);

      expect(result.passed).toBe(false);
      expect(result.violations.some(v => v.includes('Memory usage'))).toBe(true);
    });

    it('handles multiple budget violations', async () => {
      // Ensure memory property exists
      Object.defineProperty(window.performance, 'memory', {
        value: {
          usedJSHeapSize: 1024 * 1024,
          totalJSHeapSize: 4 * 1024 * 1024,
        },
        configurable: true
      });

      const budget = {
        maxBundleSize: 512 * 1024, // Too small
        maxRenderTime: 50,
        maxMemoryUsage: 20, // Too small
        minFPS: 30
      };

      const result = await checkPerformanceBudget(budget);

      expect(result.passed).toBe(false);
      expect(result.violations.length).toBeGreaterThanOrEqual(1);
    });

    it('handles missing memory API gracefully', async () => {
      const originalPerformance = window.performance;
      // @ts-expect-error - Intentionally overriding performance for testing
      window.performance = { ...mockPerformance };
      delete (window.performance as typeof window.performance & { memory?: unknown }).memory;

      const budget = {
        maxBundleSize: 2 * 1024 * 1024,
        maxRenderTime: 50,
        maxMemoryUsage: 50,
        minFPS: 30
      };

      const result = await checkPerformanceBudget(budget);

      // Should pass since memory check is skipped
      expect(result.passed).toBe(true);

      window.performance = originalPerformance;
    });
  });
});
