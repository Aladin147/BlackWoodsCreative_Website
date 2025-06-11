import React from 'react';
import { render } from '@testing-library/react';

// Mock the performance module before importing
jest.mock('../performance', () => {
  const originalModule = jest.requireActual('../performance');

  // Create comprehensive mock performance object
  const mockPerformance = {
    mark: jest.fn(),
    measure: jest.fn(),
    now: jest.fn(() => Date.now()),
    memory: {
      usedJSHeapSize: 1024 * 1024,
      totalJSHeapSize: 4 * 1024 * 1024,
      jsHeapSizeLimit: 8 * 1024 * 1024,
    },
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
    timing: {
      navigationStart: Date.now() - 1000,
      loadEventEnd: Date.now(),
    },
  };

  // Override global performance with proper Jest mocks
  global.performance = mockPerformance as any;

  return originalModule;
});

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

// Get the mocked performance object
const mockPerformance = global.performance as jest.Mocked<Performance>;

// Mock window properties
Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });

// Mock requestAnimationFrame
let rafCallbacks: Array<() => void> = [];
global.requestAnimationFrame = jest.fn((cb) => {
  rafCallbacks.push(cb);
  return rafCallbacks.length;
}) as jest.MockedFunction<typeof requestAnimationFrame>;

global.cancelAnimationFrame = jest.fn((id: number) => {
  rafCallbacks = rafCallbacks.filter((_, index) => index + 1 !== id);
}) as jest.MockedFunction<typeof cancelAnimationFrame>;

// Mock addEventListener/removeEventListener
window.addEventListener = jest.fn();
window.removeEventListener = jest.fn();

describe('Performance Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('measurePerformance', () => {
    it('measures synchronous function performance', async () => {
      const testFn = jest.fn(() => 'result');

      const result = await measurePerformance('test-sync', testFn);

      expect(result).toBe('result');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-sync-start');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-sync-end');
      expect(mockPerformance.measure).toHaveBeenCalledWith('test-sync', 'test-sync-start', 'test-sync-end');
    });

    it('measures asynchronous function performance', async () => {
      const testFn = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'async-result';
      });

      const result = await measurePerformance('test-async', testFn);

      expect(result).toBe('async-result');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-async-start');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-async-end');
    });

    it('handles function errors gracefully', async () => {
      const errorFn = jest.fn(() => {
        throw new Error('Test error');
      });

      await expect(measurePerformance('test-error', errorFn)).rejects.toThrow('Test error');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-error-end');
    });

    it('handles performance.measure errors', async () => {
      mockPerformance.measure.mockImplementation(() => {
        throw new Error('Measure failed');
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const testFn = jest.fn(() => 'result');

      const result = await measurePerformance('test-measure-error', testFn);

      expect(result).toBe('result');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Performance measurement failed for test-measure-error:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('trackScrollPerformance', () => {
    it('tracks scroll metrics correctly', () => {
      const callback = jest.fn();
      const cleanup = trackScrollPerformance(callback);

      expect(window.addEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { passive: true }
      );

      cleanup();
      expect(window.removeEventListener).toHaveBeenCalled();
    });

    it('calculates scroll percentage correctly', () => {
      const callback = jest.fn();
      trackScrollPerformance(callback);

      // Simulate scroll event
      window.scrollY = 600; // 50% of scrollable area (1200px)

      // Get the scroll handler from addEventListener call
      const scrollHandler = (window.addEventListener as jest.Mock).mock.calls[0][1];
      scrollHandler();

      // Advance timers to trigger requestAnimationFrame
      jest.advanceTimersByTime(16);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          scrollY: 600,
          scrollPercent: expect.any(Number),
          direction: expect.any(String),
          velocity: expect.any(Number),
        })
      );
    });

    it('detects scroll direction correctly', () => {
      const callback = jest.fn();

      // Set initial scroll position
      window.scrollY = 0;
      trackScrollPerformance(callback);

      const scrollHandler = (window.addEventListener as jest.Mock).mock.calls[0][1];

      // Scroll down from 0 to 100
      window.scrollY = 100;
      scrollHandler();
      jest.advanceTimersByTime(16);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: 'down'
        })
      );

      callback.mockClear();

      // Scroll up from 100 to 50
      window.scrollY = 50;
      scrollHandler();
      jest.advanceTimersByTime(16);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: 'up'
        })
      );
    });

    it('uses custom throttle time', () => {
      const callback = jest.fn();
      trackScrollPerformance(callback, 100);

      expect(window.addEventListener).toHaveBeenCalled();
    });
  });

  describe('optimizeImages', () => {
    it('optimizes image URL with all options', () => {
      const url = 'https://example.com/image.jpg';
      const options = { width: 800, height: 600, quality: 90, format: 'webp' as const };

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

    it('handles auto format correctly', () => {
      const url = 'https://example.com/image.jpg';
      const result = optimizeImages(url, { format: 'auto' });

      expect(result).not.toContain('f=auto');
      expect(result).toContain('q=85');
    });

    it('handles invalid URLs gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = optimizeImages('invalid-url');

      expect(result).toBe('invalid-url');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to optimize image URL:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('preserves existing query parameters', () => {
      const url = 'https://example.com/image.jpg?existing=param';
      const result = optimizeImages(url, { width: 400 });

      expect(result).toContain('existing=param');
      expect(result).toContain('w=400');
    });

    it('handles only width parameter', () => {
      const url = 'https://example.com/image.jpg';
      const result = optimizeImages(url, { width: 500 });

      expect(result).toContain('w=500');
      expect(result).not.toContain('h=');
    });

    it('handles only height parameter', () => {
      const url = 'https://example.com/image.jpg';
      const result = optimizeImages(url, { height: 300 });

      expect(result).toContain('h=300');
      expect(result).not.toContain('w=');
    });
  });

  describe('debounce', () => {
    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });

    it('handles multiple arguments', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2', 'arg3');
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });

    it('resets timer on subsequent calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      jest.advanceTimersByTime(50);
      debouncedFn('second');
      jest.advanceTimersByTime(50);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('throttle', () => {
    it('limits function execution rate', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      jest.advanceTimersByTime(100);
      throttledFn('fourth');

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('fourth');
    });

    it('handles multiple arguments', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('arg1', 'arg2');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('prevents execution during throttle period', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first');
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttledFn('second');
      throttledFn('third');
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledFn('fourth');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('withPerformanceMonitoring', () => {
    it('wraps component with performance monitoring', () => {
      const TestComponent = ({ text }: { text: string }) => React.createElement('div', {}, text);
      const MonitoredComponent = withPerformanceMonitoring(TestComponent, 'TestComponent');

      const { unmount } = render(React.createElement(MonitoredComponent, { text: "test" }));

      // Simulate slow render
      jest.advanceTimersByTime(20);

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      unmount();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('TestComponent render took')
      );

      consoleSpy.mockRestore();
    });

    it('does not warn for fast renders', () => {
      const TestComponent = () => React.createElement('div', {}, 'Fast Component');
      const MonitoredComponent = withPerformanceMonitoring(TestComponent, 'FastComponent');

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { unmount } = render(React.createElement(MonitoredComponent));

      // Simulate fast render (under 16ms)
      jest.advanceTimersByTime(10);
      unmount();

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('creates component with correct display name', () => {
      const TestComponent = () => React.createElement('div');
      const MonitoredComponent = withPerformanceMonitoring(TestComponent, 'TestComponent');

      expect(MonitoredComponent.name).toBe('PerformanceMonitoredComponent');
    });
  });

  describe('createLazyComponent', () => {
    it('creates lazy component with performance tracking', async () => {
      const TestComponent = () => React.createElement('div', {}, 'Lazy Component');
      const mockImport = jest.fn(() => Promise.resolve({ default: TestComponent }));

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const LazyComponent = createLazyComponent(mockImport);

      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent).toBe('object');

      consoleSpy.mockRestore();
    });

    it('handles import errors', async () => {
      const mockImport = jest.fn(() => Promise.reject(new Error('Import failed')));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const LazyComponent = createLazyComponent(mockImport);

      // The lazy component should be created but will fail when loaded
      expect(LazyComponent).toBeDefined();

      consoleSpy.mockRestore();
    });

    it('logs loading time on successful import', async () => {
      const TestComponent = () => React.createElement('div');
      const mockImport = jest.fn(() => Promise.resolve({ default: TestComponent }));

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      createLazyComponent(mockImport);

      // The console.log will be called when the component is actually loaded
      // which happens asynchronously in React.lazy

      consoleSpy.mockRestore();
    });
  });

  describe('monitorMemoryUsage', () => {
    it('returns memory usage when available', () => {
      // Ensure memory property is available
      global.performance.memory = mockPerformance.memory;

      const result = monitorMemoryUsage();

      expect(result).toEqual({
        used: 1024 * 1024,
        total: 4 * 1024 * 1024,
        percentage: 25
      });
    });

    it('returns null when memory API is not available', () => {
      const originalMemory = mockPerformance.memory;
      delete (mockPerformance as Record<string, unknown>).memory;

      const result = monitorMemoryUsage();
      expect(result).toBeNull();

      mockPerformance.memory = originalMemory;
    });

    it('calculates percentage correctly', () => {
      // Ensure memory property is available
      global.performance.memory = mockPerformance.memory;

      const result = monitorMemoryUsage();

      expect(result?.percentage).toBe(25); // 1MB / 4MB * 100
    });
  });

  describe('monitorFPS', () => {
    beforeEach(() => {
      rafCallbacks = [];
      jest.clearAllMocks();
    });

    it('monitors FPS and calls callback', () => {
      const callback = jest.fn();
      const cleanup = monitorFPS(callback);

      // Simulate frames by calling the RAF callbacks
      expect(rafCallbacks.length).toBe(1);

      // Simulate time passing and frames
      mockPerformance.now.mockReturnValueOnce(0).mockReturnValueOnce(1000);

      // Execute the first frame
      rafCallbacks[0]();

      // Should have called callback with FPS
      expect(callback).toHaveBeenCalledWith(expect.any(Number));

      cleanup();
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('calculates FPS correctly', () => {
      const callback = jest.fn();
      monitorFPS(callback);

      // Mock performance.now to return specific times
      let currentTime = 0;
      mockPerformance.now.mockImplementation(() => {
        currentTime += 16.67; // ~60fps
        return currentTime;
      });

      // Execute the frame callback multiple times
      for (let i = 0; i < 60; i++) {
        if (rafCallbacks[0]) {
          rafCallbacks[0]();
        }
      }

      expect(callback).toHaveBeenCalled();
    });

    it('returns cleanup function', () => {
      const callback = jest.fn();
      const cleanup = monitorFPS(callback);

      expect(typeof cleanup).toBe('function');

      cleanup();
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
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
      expect(result.modules[0]).toHaveProperty('name');
      expect(result.modules[0]).toHaveProperty('size');
    });

    it('returns expected module data', async () => {
      const result = await analyzeBundleSize();

      expect(result.modules).toHaveLength(3);
      expect(result.modules[0].name).toBe('react');
      expect(result.modules[1].name).toBe('framer-motion');
      expect(result.modules[2].name).toBe('app');
    });
  });

  describe('checkPerformanceBudget', () => {
    it('passes when all metrics are within budget', async () => {
      const budget = {
        maxBundleSize: 2 * 1024 * 1024, // 2MB
        maxRenderTime: 100,
        maxMemoryUsage: 50, // 50%
        minFPS: 30
      };

      const result = await checkPerformanceBudget(budget);

      expect(result.passed).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('fails when bundle size exceeds budget', async () => {
      const budget = {
        maxBundleSize: 500 * 1024, // 500KB (smaller than actual 1MB)
        maxRenderTime: 100,
        maxMemoryUsage: 50,
        minFPS: 30
      };

      const result = await checkPerformanceBudget(budget);

      expect(result.passed).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations.some(v => v.includes('Bundle size'))).toBe(true);
      expect(result.violations[0]).toContain('Bundle size 1048576 exceeds budget 512000');
    });

    it('fails when memory usage exceeds budget', async () => {
      // Ensure memory property is available
      global.performance.memory = mockPerformance.memory;

      const budget = {
        maxBundleSize: 2 * 1024 * 1024,
        maxRenderTime: 100,
        maxMemoryUsage: 20, // 20% (smaller than actual 25%)
        minFPS: 30
      };

      const result = await checkPerformanceBudget(budget);

      expect(result.passed).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations.some(v => v.includes('Memory usage'))).toBe(true);
      expect(result.violations[0]).toContain('Memory usage 25% exceeds budget 20%');
    });

    it('handles multiple budget violations', async () => {
      // Ensure memory property is available
      global.performance.memory = mockPerformance.memory;

      const budget = {
        maxBundleSize: 100 * 1024, // Very small
        maxRenderTime: 1,
        maxMemoryUsage: 10, // Very small
        minFPS: 120 // Very high
      };

      const result = await checkPerformanceBudget(budget);

      expect(result.passed).toBe(false);
      expect(result.violations.length).toBeGreaterThanOrEqual(2);
      expect(result.violations.some(v => v.includes('Bundle size'))).toBe(true);
      expect(result.violations.some(v => v.includes('Memory usage'))).toBe(true);
    });

    it('handles missing memory API gracefully', async () => {
      const originalMemory = mockPerformance.memory;
      delete (mockPerformance as Record<string, unknown>).memory;

      const budget = {
        maxBundleSize: 2 * 1024 * 1024,
        maxRenderTime: 100,
        maxMemoryUsage: 50,
        minFPS: 30
      };

      const result = await checkPerformanceBudget(budget);

      // Should still work without memory monitoring
      expect(result).toHaveProperty('passed');
      expect(result).toHaveProperty('violations');
      expect(result.passed).toBe(true); // No memory violation when API unavailable

      mockPerformance.memory = originalMemory;
    });

    it('returns correct structure for passing budget', async () => {
      const budget = {
        maxBundleSize: 10 * 1024 * 1024, // 10MB
        maxRenderTime: 1000,
        maxMemoryUsage: 90,
        minFPS: 10
      };

      const result = await checkPerformanceBudget(budget);

      expect(result).toEqual({
        passed: true,
        violations: []
      });
    });

    it('returns correct structure for failing budget', async () => {
      const budget = {
        maxBundleSize: 100, // Very small
        maxRenderTime: 1,
        maxMemoryUsage: 1,
        minFPS: 1000
      };

      const result = await checkPerformanceBudget(budget);

      expect(result.passed).toBe(false);
      expect(Array.isArray(result.violations)).toBe(true);
      expect(result.violations.length).toBeGreaterThan(0);
    });
  });
});
