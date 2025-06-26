import {
  PRODUCTION_BUDGETS,
  DEVELOPMENT_BUDGETS,
  ViolationSeverity,
  calculateViolationSeverity,
  formatBytes,
  formatMilliseconds,
} from '../../config/performance-budgets';
import {
  PerformanceBudgetChecker,
  getPerformanceBudgetChecker,
  collectPerformanceData,
  PerformanceData,
} from '../performance-budget-checker';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  getEntriesByType: jest.fn(),
  memory: {
    usedJSHeapSize: 1024 * 1024, // 1MB
    totalJSHeapSize: 4 * 1024 * 1024, // 4MB
  },
};

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock document
Object.defineProperty(global, 'document', {
  value: {
    querySelectorAll: jest.fn(() => ({ length: 1000 })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  writable: true,
});

// Mock window
Object.defineProperty(global, 'window', {
  value: {
    performance: mockPerformance,
  },
  writable: true,
});

describe('PerformanceBudgetChecker', () => {
  let checker: PerformanceBudgetChecker;
  let testData: PerformanceData;

  beforeEach(() => {
    checker = new PerformanceBudgetChecker(PRODUCTION_BUDGETS);

    testData = {
      bundles: {
        main: 400 * 1024, // 400KB - within budget
        vendor: 700 * 1024, // 700KB - within budget
        total: 1.1 * 1024 * 1024, // 1.1MB - within budget
        gzipped: 300 * 1024, // 300KB - within budget
      },
      coreWebVitals: {
        lcp: 2000, // 2s - within budget
        fid: 80, // 80ms - within budget
        cls: 0.08, // 0.08 - within budget
        fcp: 1500, // 1.5s - within budget
        ttfb: 500, // 500ms - within budget
        inp: 150, // 150ms - within budget
      },
      resources: {
        requests: 40,
        imageSize: 400 * 1024,
        fontSize: 80 * 1024,
        cssSize: 150 * 1024,
        jsSize: 800 * 1024,
      },
      performance: {
        renderTime: 12,
        memoryUsage: 60,
        fps: 58,
        domNodes: 1200,
        eventListeners: 80,
      },
      network: {
        latency: 150,
        bandwidth: 800,
        concurrentRequests: 4,
      },
    };
  });

  describe('checkBudgets', () => {
    it('passes when all metrics are within budget', () => {
      const result = checker.checkBudgets(testData);

      expect(result.passed).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.score).toBe(100);
      expect(result.summary.total).toBe(0);
    });

    it('fails when bundle size exceeds budget', () => {
      testData.bundles!.main = 600 * 1024; // Exceeds 500KB budget by 20%

      const result = checker.checkBudgets(testData);

      expect(result.passed).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0]?.metric).toBe('main');
      expect(result.violations[0]?.category).toBe('bundles');
      expect(result.violations[0]?.severity).toBe(ViolationSeverity.LOW); // 20% over = LOW severity
      expect(result.violations[0]?.percentage).toBe(20);
    });

    it('fails when Core Web Vitals exceed budget', () => {
      testData.coreWebVitals!.lcp = 3000; // Exceeds 2500ms budget
      testData.coreWebVitals!.fid = 150; // Exceeds 100ms budget

      const result = checker.checkBudgets(testData);

      expect(result.passed).toBe(false);
      expect(result.violations).toHaveLength(2);
      expect(result.violations.some(v => v.metric === 'lcp')).toBe(true);
      expect(result.violations.some(v => v.metric === 'fid')).toBe(true);
    });

    it('fails when FPS is below minimum threshold', () => {
      testData.performance!.fps = 30; // Below 55 FPS budget

      const result = checker.checkBudgets(testData);

      expect(result.passed).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0]?.metric).toBe('fps');
      expect(result.violations[0]?.message).toContain('below minimum threshold');
    });

    it('calculates correct violation severity', () => {
      testData.bundles!.main = 1000 * 1024; // 100% over budget (500KB -> 1000KB)

      const result = checker.checkBudgets(testData);

      expect(result.violations[0]?.severity).toBe(ViolationSeverity.CRITICAL);
      expect(result.violations[0]?.percentage).toBe(100);
    });

    it('calculates performance score correctly', () => {
      // Add violations of different severities
      testData.bundles!.main = 750 * 1024; // 50% over (HIGH)
      testData.coreWebVitals!.lcp = 3125; // 25% over (MEDIUM)
      testData.performance!.fps = 50; // Below threshold (LOW)

      const result = checker.checkBudgets(testData);

      // Score should be reduced: 100 - 15 (HIGH) - 10 (MEDIUM) - 5 (LOW) = 70
      expect(result.score).toBe(70);
    });

    it('generates appropriate recommendations', () => {
      testData.bundles!.main = 600 * 1024;
      testData.coreWebVitals!.lcp = 3000;

      const result = checker.checkBudgets(testData);

      expect(result.recommendations).toContain(
        'Consider code splitting and lazy loading to reduce bundle sizes'
      );
      expect(result.recommendations).toContain('Optimize images and use next/image for better LCP');
    });

    it('groups violations by category correctly', () => {
      testData.bundles!.main = 600 * 1024;
      testData.bundles!.vendor = 900 * 1024;
      testData.coreWebVitals!.lcp = 3000;

      const result = checker.checkBudgets(testData);

      expect(result.summary.total).toBe(3);
      expect(result.violations.filter(v => v.category === 'bundles')).toHaveLength(2);
      expect(result.violations.filter(v => v.category === 'coreWebVitals')).toHaveLength(1);
    });
  });

  describe('singleton instance', () => {
    it('returns the same instance', () => {
      const checker1 = getPerformanceBudgetChecker();
      const checker2 = getPerformanceBudgetChecker();

      expect(checker1).toBe(checker2);
    });

    it('creates new instance with custom budget', () => {
      const checker1 = getPerformanceBudgetChecker();
      const checker2 = getPerformanceBudgetChecker(DEVELOPMENT_BUDGETS);

      expect(checker1).not.toBe(checker2);
    });
  });
});

describe('collectPerformanceData', () => {
  beforeEach(() => {
    // Mock performance entries
    mockPerformance.getEntriesByType.mockImplementation((type: string) => {
      if (type === 'navigation') {
        return [
          {
            requestStart: 100,
            responseStart: 200,
          },
        ];
      }
      if (type === 'paint') {
        return [
          {
            name: 'first-contentful-paint',
            startTime: 1500,
          },
        ];
      }
      if (type === 'resource') {
        return [
          { name: 'image.jpg', transferSize: 100 * 1024 },
          { name: 'font.woff2', transferSize: 50 * 1024 },
          { name: 'style.css', transferSize: 30 * 1024 },
          { name: 'script.js', transferSize: 200 * 1024 },
        ];
      }
      return [];
    });
  });

  it('collects Core Web Vitals correctly', () => {
    const data = collectPerformanceData();

    expect(data.coreWebVitals?.ttfb).toBe(100); // 200 - 100
    expect(data.coreWebVitals?.fcp).toBe(1500);
  });

  it('collects resource data correctly', () => {
    const data = collectPerformanceData();

    expect(data.resources?.requests).toBe(4);
    expect(data.resources?.imageSize).toBe(100 * 1024);
    expect(data.resources?.fontSize).toBe(50 * 1024);
    expect(data.resources?.cssSize).toBe(30 * 1024);
    expect(data.resources?.jsSize).toBe(200 * 1024);
  });

  it('collects performance metrics correctly', () => {
    const data = collectPerformanceData();

    expect(data.performance?.domNodes).toBe(1000);
    expect(data.performance?.memoryUsage).toBe(25); // 1MB / 4MB * 100
    expect(data.performance?.fps).toBe(60);
  });

  it('returns empty object on server-side', () => {
    // Mock server environment
    const originalWindow = global.window;
    delete (global as any).window;

    const data = collectPerformanceData();

    expect(data).toEqual({});

    // Restore window
    (global as any).window = originalWindow;
  });
});

describe('utility functions', () => {
  describe('calculateViolationSeverity', () => {
    it('calculates LOW severity correctly', () => {
      expect(calculateViolationSeverity(110, 100)).toBe(ViolationSeverity.LOW);
      expect(calculateViolationSeverity(124, 100)).toBe(ViolationSeverity.LOW);
    });

    it('calculates MEDIUM severity correctly', () => {
      expect(calculateViolationSeverity(125, 100)).toBe(ViolationSeverity.MEDIUM);
      expect(calculateViolationSeverity(149, 100)).toBe(ViolationSeverity.MEDIUM);
    });

    it('calculates HIGH severity correctly', () => {
      expect(calculateViolationSeverity(150, 100)).toBe(ViolationSeverity.HIGH);
      expect(calculateViolationSeverity(199, 100)).toBe(ViolationSeverity.HIGH);
    });

    it('calculates CRITICAL severity correctly', () => {
      expect(calculateViolationSeverity(200, 100)).toBe(ViolationSeverity.CRITICAL);
      expect(calculateViolationSeverity(300, 100)).toBe(ViolationSeverity.CRITICAL);
    });
  });

  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(1536)).toBe('1.5 KB');
    });
  });

  describe('formatMilliseconds', () => {
    it('formats milliseconds correctly', () => {
      expect(formatMilliseconds(500)).toBe('500.00ms');
      expect(formatMilliseconds(1500)).toBe('1.50s');
      expect(formatMilliseconds(2000)).toBe('2.00s');
    });
  });
});
