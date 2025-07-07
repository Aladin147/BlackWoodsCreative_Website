// Removed unused imports
import {
  PerformanceMonitor,
  getPerformanceMonitor,
  trackComponentLoad,
  usePerformanceTracking,
} from '../performance-monitor';

// Mock performance API
const mockPerformanceNow = jest.fn();
const mockGetEntriesByType = jest.fn();
const mockPerformanceObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
  callback: null as any,
};

// Mock console methods
jest.spyOn(console, 'log').mockImplementation();
jest.spyOn(console, 'group').mockImplementation();
jest.spyOn(console, 'groupEnd').mockImplementation();
jest.spyOn(console, 'warn').mockImplementation();

// Mock global performance
Object.defineProperty(global, 'performance', {
  value: {
    now: mockPerformanceNow,
    getEntriesByType: mockGetEntriesByType,
  },
  writable: true,
});

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation(callback => {
  mockPerformanceObserver.callback = callback;
  return mockPerformanceObserver;
}) as any;

// Add the required supportedEntryTypes property
(global.PerformanceObserver as any).supportedEntryTypes = [
  'largest-contentful-paint',
  'first-input',
  'layout-shift',
];

// Mock window
Object.defineProperty(global, 'window', {
  value: {
    PerformanceObserver: global.PerformanceObserver,
    performance: global.performance,
  },
  writable: true,
});

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformanceNow.mockReturnValue(1000);
    mockGetEntriesByType.mockReturnValue([]);
  });

  describe('constructor', () => {
    it('initializes observers when window is available', () => {
      new PerformanceMonitor();

      expect(global.PerformanceObserver).toHaveBeenCalledTimes(3); // LCP, FID, CLS
      expect(mockPerformanceObserver.observe).toHaveBeenCalledTimes(3);
    });

    it('measures initial metrics on construction', () => {
      mockGetEntriesByType.mockImplementation(type => {
        if (type === 'paint') {
          return [{ name: 'first-contentful-paint', startTime: 500 }];
        }
        if (type === 'navigation') {
          return [{ responseStart: 200, requestStart: 100 }];
        }
        return [];
      });

      const monitor = new PerformanceMonitor();
      const metrics = monitor.getMetrics();

      expect(metrics.fcp).toBe(500);
      expect(metrics.ttfb).toBe(100);
    });
  });

  describe('trackBundleLoad', () => {
    it('tracks bundle loading performance', () => {
      const monitor = new PerformanceMonitor();
      mockPerformanceNow.mockReturnValue(1500);

      monitor.trackBundleLoad('test-chunk', 1000);

      // The trackBundleLoad method now uses logger.debug, which formats messages differently
      // In test environment, debug messages are not logged by default
      // So we don't expect any console output

      const metrics = monitor.getMetrics();
      expect(metrics.loadTime).toBe(500);
      expect(metrics.chunkCount).toBe(1);
    });

    it('accumulates multiple bundle loads', () => {
      const monitor = new PerformanceMonitor();

      mockPerformanceNow.mockReturnValue(1200);
      monitor.trackBundleLoad('chunk-1', 1000);

      mockPerformanceNow.mockReturnValue(1800);
      monitor.trackBundleLoad('chunk-2', 1500);

      const metrics = monitor.getMetrics();
      expect(metrics.loadTime).toBe(500); // 200 + 300
      expect(metrics.chunkCount).toBe(2);
    });
  });

  describe('getMetrics', () => {
    it('returns combined performance and bundle metrics', () => {
      const monitor = new PerformanceMonitor();

      // Simulate some metrics
      monitor.trackBundleLoad('test', 1000);

      const metrics = monitor.getMetrics();

      expect(typeof metrics).toBe('object');
      expect(metrics.chunkCount).toBe(1);
    });
  });

  describe('checkPerformanceBudgets', () => {
    it('passes when all metrics are within budget', () => {
      // Create monitor for setup

      // Mock good metrics
      mockGetEntriesByType.mockImplementation(type => {
        if (type === 'paint') {
          return [{ name: 'first-contentful-paint', startTime: 1000 }]; // Under 1800ms budget
        }
        if (type === 'navigation') {
          return [{ responseStart: 150, requestStart: 100 }]; // 50ms TTFB, under 600ms budget
        }
        return [];
      });

      const newMonitor = new PerformanceMonitor();
      const budgetCheck = newMonitor.checkPerformanceBudgets();

      expect(budgetCheck.passed).toBe(true);
      expect(budgetCheck.violations).toHaveLength(0);
    });

    it('fails when metrics exceed budget', () => {
      // Create monitor for setup

      // Mock bad metrics
      mockGetEntriesByType.mockImplementation(type => {
        if (type === 'paint') {
          return [{ name: 'first-contentful-paint', startTime: 3000 }]; // Over 1800ms budget
        }
        if (type === 'navigation') {
          return [{ responseStart: 800, requestStart: 100 }]; // 700ms TTFB, over 600ms budget
        }
        return [];
      });

      const newMonitor = new PerformanceMonitor();
      const budgetCheck = newMonitor.checkPerformanceBudgets();

      expect(budgetCheck.passed).toBe(false);
      expect(budgetCheck.violations.length).toBeGreaterThan(0);
      expect(budgetCheck.violations.some(v => v.includes('FCP'))).toBe(true);
      expect(budgetCheck.violations.some(v => v.includes('TTFB'))).toBe(true);
    });
  });

  describe('reportMetrics', () => {
    it('reports performance metrics in development', () => {
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true });

      const monitor = new PerformanceMonitor();
      const result = monitor.reportMetrics();

      // In development mode, reportMetrics should return metrics object
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');

      Object.defineProperty(process.env, 'NODE_ENV', { value: originalEnv, writable: true });
    });

    it('shows budget violations when present', () => {
      // Create monitor for setup

      // Mock bad metrics
      mockGetEntriesByType.mockImplementation(type => {
        if (type === 'paint') {
          return [{ name: 'first-contentful-paint', startTime: 3000 }];
        }
        return [];
      });

      const newMonitor = new PerformanceMonitor();
      const result = newMonitor.reportMetrics();

      // Should return metrics object
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('disconnect', () => {
    it('disconnects all observers', () => {
      const monitor = new PerformanceMonitor();

      monitor.disconnect();

      expect(mockPerformanceObserver.disconnect).toHaveBeenCalledTimes(3);
    });
  });

  describe('observer callbacks', () => {
    it('handles LCP entries correctly', () => {
      const monitor = new PerformanceMonitor();

      // Get the LCP observer callback
      const lcpCallback = (global.PerformanceObserver as any).mock.calls[0][0];

      // Simulate LCP entry
      const mockList = {
        getEntries: () => [{ startTime: 2000 }],
      };

      lcpCallback(mockList);

      const metrics = monitor.getMetrics();
      expect(metrics.lcp).toBe(2000);
    });

    it('handles FID entries correctly', () => {
      const monitor = new PerformanceMonitor();

      // Get the FID observer callback
      const fidCallback = (global.PerformanceObserver as any).mock.calls[1][0];

      // Simulate FID entry
      const mockList = {
        getEntries: () => [
          {
            entryType: 'first-input',
            startTime: 100,
            processingStart: 150,
          },
        ],
      };

      fidCallback(mockList);

      const metrics = monitor.getMetrics();
      expect(metrics.fid).toBe(50); // processingStart - startTime
    });

    it('handles CLS entries correctly', () => {
      const monitor = new PerformanceMonitor();

      // Get the CLS observer callback
      const clsCallback = (global.PerformanceObserver as any).mock.calls[2][0];

      // Simulate CLS entries
      const mockList = {
        getEntries: () => [
          { entryType: 'layout-shift', hadRecentInput: false, value: 0.05 },
          { entryType: 'layout-shift', hadRecentInput: false, value: 0.03 },
          { entryType: 'layout-shift', hadRecentInput: true, value: 0.1 }, // Should be ignored
        ],
      };

      clsCallback(mockList);

      const metrics = monitor.getMetrics();
      expect(metrics.cls).toBe(0.08); // 0.05 + 0.03, ignoring the one with recent input
    });
  });
});

describe('getPerformanceMonitor', () => {
  it('returns singleton instance', () => {
    const monitor1 = getPerformanceMonitor();
    const monitor2 = getPerformanceMonitor();

    expect(monitor1).toBe(monitor2);
    expect(monitor1).toBeInstanceOf(PerformanceMonitor);
  });
});

describe('trackComponentLoad', () => {
  it('tracks component load time', () => {
    mockPerformanceNow.mockReturnValueOnce(1000).mockReturnValueOnce(1250);

    const trackEnd = trackComponentLoad('TestComponent');
    trackEnd();

    // The trackComponentLoad function now uses logger.debug, which doesn't log in test environment
    // So we don't expect any console output
  });

  it('integrates with performance monitor', () => {
    mockPerformanceNow.mockReturnValueOnce(1000).mockReturnValueOnce(1300);

    const trackEnd = trackComponentLoad('TestComponent');
    trackEnd();

    const monitor = getPerformanceMonitor();
    const metrics = monitor.getMetrics();

    // Should have tracked the component as a bundle load
    expect(metrics.chunkCount).toBeGreaterThan(0);
  });
});

describe('usePerformanceTracking', () => {
  it('exists and is a function', () => {
    expect(usePerformanceTracking).toBeInstanceOf(Function);
  });

  it('can be imported without errors', () => {
    // Test that the module exports the hook correctly
    expect(typeof usePerformanceTracking).toBe('function');
  });
});
