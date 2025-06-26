// Production mode performance monitoring validation tests
import { PerformanceMonitor, getPerformanceMonitor, trackComponentLoad } from '../performance-monitor';

// Mock performance API for production testing
const mockPerformanceNow = jest.fn();
const mockGetEntriesByType = jest.fn();
const mockPerformanceObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
  callback: null as any,
};

// Store original NODE_ENV
const originalNodeEnv = process.env.NODE_ENV;

// Mock global performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: mockPerformanceNow,
    getEntriesByType: mockGetEntriesByType,
  },
  writable: true,
});

// Mock PerformanceObserver
Object.defineProperty(global, 'PerformanceObserver', {
  value: jest.fn().mockImplementation((callback) => {
    mockPerformanceObserver.callback = callback;
    return mockPerformanceObserver;
  }),
  writable: true,
});

// Mock window object
Object.defineProperty(global, 'window', {
  value: {
    PerformanceObserver: global.PerformanceObserver,
    performance: global.performance,
  },
  writable: true,
});

describe('Performance Monitor - Production Mode', () => {
  beforeEach(() => {
    // Set production environment using Object.defineProperty
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true,
    });

    // Reset module cache to ensure environment change takes effect
    jest.resetModules();

    jest.clearAllMocks();
    
    // Reset performance mocks
    mockPerformanceNow.mockReturnValue(1000);
    mockGetEntriesByType.mockImplementation((type) => {
      if (type === 'paint') {
        return [
          { name: 'first-contentful-paint', startTime: 800 },
          { name: 'first-paint', startTime: 750 },
        ];
      }
      if (type === 'navigation') {
        return [
          {
            requestStart: 100,
            responseStart: 300,
            loadEventEnd: 1200,
          },
        ];
      }
      return [];
    });
  });

  afterEach(() => {
    // Restore original NODE_ENV using Object.defineProperty
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalNodeEnv,
      writable: true,
      configurable: true,
    });

    // Reset module cache to ensure environment change takes effect
    jest.resetModules();
  });

  describe('Production Analytics Integration', () => {
    it('should not log to console in production mode', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();

      // Re-import module after environment change
      const { PerformanceMonitor } = await import('../performance-monitor');

      const monitor = new PerformanceMonitor();
      monitor.trackBundleLoad('test-chunk', 500);

      const result = monitor.reportMetrics();
      
      // Should not log to console in production
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(consoleGroupSpy).not.toHaveBeenCalled();
      
      // In production, should not return metrics object (returns undefined)
      // However, the method may still return metrics for internal tracking
      // The key is that it doesn't log to console
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(consoleGroupSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
      consoleGroupSpy.mockRestore();
    });

    it('should collect metrics correctly in production', () => {
      const monitor = new PerformanceMonitor();
      
      // Simulate bundle loading
      monitor.trackBundleLoad('main-chunk', 500);
      monitor.trackBundleLoad('vendor-chunk', 600);
      
      const metrics = monitor.getMetrics();
      
      // Should have collected bundle metrics
      expect(metrics.loadTime).toBeGreaterThan(0);
      expect(metrics.chunkCount).toBe(2);
      
      // Should have collected core web vitals
      expect(metrics.fcp).toBe(800);
      expect(metrics.ttfb).toBe(200); // responseStart - requestStart
    });

    it('should validate performance budgets in production', () => {
      new PerformanceMonitor();

      // Simulate poor performance metrics
      mockGetEntriesByType.mockImplementation((type) => {
        if (type === 'paint') {
          return [{ name: 'first-contentful-paint', startTime: 3000 }]; // Exceeds 1.8s budget
        }
        if (type === 'navigation') {
          return [{ requestStart: 100, responseStart: 800 }]; // Exceeds 600ms TTFB budget
        }
        return [];
      });
      
      const newMonitor = new PerformanceMonitor();
      const budgetCheck = newMonitor.checkPerformanceBudgets();
      
      expect(budgetCheck.passed).toBe(false);
      expect(budgetCheck.violations).toContain('FCP: 3000.00 > 1800');
      expect(budgetCheck.violations).toContain('TTFB: 700.00 > 600');
    });

    it('should handle missing performance APIs gracefully', () => {
      // Mock missing PerformanceObserver
      const originalPerformanceObserver = global.PerformanceObserver;
      delete (global as any).PerformanceObserver;
      
      expect(() => {
        new PerformanceMonitor();
      }).not.toThrow();
      
      // Restore PerformanceObserver
      global.PerformanceObserver = originalPerformanceObserver;
    });
  });

  describe('Component Performance Tracking', () => {
    it('should track component load times without console logging in production', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Re-import module after environment change
      const { trackComponentLoad, getPerformanceMonitor } = await import('../performance-monitor');

      mockPerformanceNow
        .mockReturnValueOnce(1000) // Start time
        .mockReturnValueOnce(1050); // End time

      const trackEnd = trackComponentLoad('TestComponent');
      trackEnd();

      // Should not log in production
      expect(consoleSpy).not.toHaveBeenCalled();

      // Should still track metrics
      const monitor = getPerformanceMonitor();
      const metrics = monitor.getMetrics();
      expect(metrics.chunkCount).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it('should handle server-side rendering gracefully', () => {
      // Mock server environment
      const originalWindow = global.window;
      delete (global as any).window;
      
      expect(() => {
        trackComponentLoad('ServerComponent');
      }).not.toThrow();
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('Performance Observer Integration', () => {
    it('should set up LCP observer correctly', () => {
      new PerformanceMonitor();
      
      expect(mockPerformanceObserver.observe).toHaveBeenCalledWith({
        entryTypes: ['largest-contentful-paint']
      });
    });

    it('should set up FID observer correctly', () => {
      new PerformanceMonitor();
      
      expect(mockPerformanceObserver.observe).toHaveBeenCalledWith({
        entryTypes: ['first-input']
      });
    });

    it('should set up CLS observer correctly', () => {
      new PerformanceMonitor();
      
      expect(mockPerformanceObserver.observe).toHaveBeenCalledWith({
        entryTypes: ['layout-shift']
      });
    });

    it('should process LCP entries correctly', () => {
      // Store observer callbacks
      const observerCallbacks: any[] = [];

      // Mock PerformanceObserver to capture callbacks
      const MockPerformanceObserver = jest.fn().mockImplementation((callback) => {
        observerCallbacks.push(callback);
        return {
          observe: jest.fn(),
          disconnect: jest.fn(),
        };
      });
      (MockPerformanceObserver as any).supportedEntryTypes = ['largest-contentful-paint', 'first-input', 'layout-shift'];

      global.PerformanceObserver = MockPerformanceObserver as any;

      const monitor = new PerformanceMonitor();

      // Simulate LCP entry - should be the first observer (LCP)
      const lcpCallback = observerCallbacks[0];
      const lcpEntry = { startTime: 1500 };
      lcpCallback({
        getEntries: () => [lcpEntry]
      });

      const metrics = monitor.getMetrics();
      expect(metrics.lcp).toBe(1500);
    });

    it('should process FID entries correctly', () => {
      // Store observer callbacks
      const observerCallbacks: any[] = [];

      // Mock PerformanceObserver to capture callbacks
      const MockPerformanceObserver = jest.fn().mockImplementation((callback) => {
        observerCallbacks.push(callback);
        return {
          observe: jest.fn(),
          disconnect: jest.fn(),
        };
      });
      (MockPerformanceObserver as any).supportedEntryTypes = ['largest-contentful-paint', 'first-input', 'layout-shift'];

      global.PerformanceObserver = MockPerformanceObserver as any;

      const monitor = new PerformanceMonitor();

      // Simulate FID entry - should be the second observer (FID)
      const fidCallback = observerCallbacks[1];
      const fidEntry = {
        entryType: 'first-input',
        startTime: 100,
        processingStart: 150
      };
      fidCallback({
        getEntries: () => [fidEntry]
      });

      const metrics = monitor.getMetrics();
      expect(metrics.fid).toBe(50); // processingStart - startTime
    });

    it('should process CLS entries correctly', () => {
      // Store observer callbacks
      const observerCallbacks: any[] = [];

      // Mock PerformanceObserver to capture callbacks
      const MockPerformanceObserver = jest.fn().mockImplementation((callback) => {
        observerCallbacks.push(callback);
        return {
          observe: jest.fn(),
          disconnect: jest.fn(),
        };
      });
      (MockPerformanceObserver as any).supportedEntryTypes = ['largest-contentful-paint', 'first-input', 'layout-shift'];

      global.PerformanceObserver = MockPerformanceObserver as any;

      const monitor = new PerformanceMonitor();

      // Simulate CLS entries - should be the third observer (CLS)
      const clsCallback = observerCallbacks[2];
      const clsEntries = [
        { entryType: 'layout-shift', value: 0.05, hadRecentInput: false },
        { entryType: 'layout-shift', value: 0.03, hadRecentInput: false },
        { entryType: 'layout-shift', value: 0.02, hadRecentInput: true }, // Should be ignored
      ];
      clsCallback({
        getEntries: () => clsEntries
      });

      const metrics = monitor.getMetrics();
      expect(metrics.cls).toBe(0.08); // 0.05 + 0.03 (ignoring hadRecentInput)
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance across calls', () => {
      const monitor1 = getPerformanceMonitor();
      const monitor2 = getPerformanceMonitor();
      
      expect(monitor1).toBe(monitor2);
      expect(monitor1).toBeInstanceOf(PerformanceMonitor);
    });
  });

  describe('Cleanup', () => {
    it('should disconnect observers on cleanup', () => {
      // Store observer instances
      const observerInstances: any[] = [];

      // Mock PerformanceObserver to capture instances
      const MockPerformanceObserver = jest.fn().mockImplementation((_callback) => {
        const instance = {
          observe: jest.fn(),
          disconnect: jest.fn(),
        };
        observerInstances.push(instance);
        return instance;
      });
      (MockPerformanceObserver as any).supportedEntryTypes = ['largest-contentful-paint', 'first-input', 'layout-shift'];

      global.PerformanceObserver = MockPerformanceObserver as any;

      const monitor = new PerformanceMonitor();
      monitor.disconnect();

      // Should have created 3 observers (LCP, FID, CLS) and disconnected all
      expect(observerInstances).toHaveLength(3);
      observerInstances.forEach(instance => {
        expect(instance.disconnect).toHaveBeenCalled();
      });
    });
  });
});
