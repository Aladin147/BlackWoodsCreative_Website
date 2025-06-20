// Performance budget configuration for automated monitoring and CI/CD integration
export interface PerformanceBudget {
  // Bundle size budgets (in bytes)
  bundles: {
    main: number;
    vendor: number;
    total: number;
    gzipped: number;
  };

  // Core Web Vitals budgets (in milliseconds, except CLS)
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift (unitless)
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
    inp: number; // Interaction to Next Paint
  };

  // Resource budgets
  resources: {
    maxRequests: number;
    maxImageSize: number;
    maxFontSize: number;
    maxCSSSize: number;
    maxJSSize: number;
  };

  // Performance metrics budgets
  performance: {
    maxRenderTime: number; // Component render time
    maxMemoryUsage: number; // Memory usage percentage
    minFPS: number; // Minimum frames per second
    maxDOMNodes: number; // Maximum DOM nodes
    maxEventListeners: number; // Maximum event listeners
  };

  // Network budgets
  network: {
    maxLatency: number; // Maximum network latency
    maxBandwidth: number; // Maximum bandwidth usage (KB/s)
    maxConcurrentRequests: number;
  };
}

// Production performance budgets (strict)
export const PRODUCTION_BUDGETS: PerformanceBudget = {
  bundles: {
    main: 500 * 1024, // 500KB main bundle
    vendor: 800 * 1024, // 800KB vendor bundle
    total: 1.5 * 1024 * 1024, // 1.5MB total
    gzipped: 400 * 1024, // 400KB gzipped
  },

  coreWebVitals: {
    lcp: 2500, // 2.5s - Good LCP threshold
    fid: 100, // 100ms - Good FID threshold
    cls: 0.1, // 0.1 - Good CLS threshold
    fcp: 1800, // 1.8s - Good FCP threshold
    ttfb: 600, // 600ms - Good TTFB threshold
    inp: 200, // 200ms - Good INP threshold
  },

  resources: {
    maxRequests: 50, // Maximum 50 requests
    maxImageSize: 500 * 1024, // 500KB per image
    maxFontSize: 100 * 1024, // 100KB per font
    maxCSSSize: 200 * 1024, // 200KB CSS
    maxJSSize: 1 * 1024 * 1024, // 1MB JavaScript
  },

  performance: {
    maxRenderTime: 16, // 16ms (60fps)
    maxMemoryUsage: 70, // 70% memory usage
    minFPS: 55, // Minimum 55 FPS
    maxDOMNodes: 1500, // Maximum 1500 DOM nodes
    maxEventListeners: 100, // Maximum 100 event listeners
  },

  network: {
    maxLatency: 200, // 200ms latency
    maxBandwidth: 1000, // 1MB/s bandwidth
    maxConcurrentRequests: 6, // 6 concurrent requests
  },
};

// Development performance budgets (relaxed)
export const DEVELOPMENT_BUDGETS: PerformanceBudget = {
  bundles: {
    main: 1 * 1024 * 1024, // 1MB main bundle
    vendor: 1.5 * 1024 * 1024, // 1.5MB vendor bundle
    total: 3 * 1024 * 1024, // 3MB total
    gzipped: 800 * 1024, // 800KB gzipped
  },

  coreWebVitals: {
    lcp: 4000, // 4s - Relaxed for development
    fid: 300, // 300ms
    cls: 0.25, // 0.25
    fcp: 3000, // 3s
    ttfb: 1000, // 1s
    inp: 500, // 500ms
  },

  resources: {
    maxRequests: 100, // 100 requests
    maxImageSize: 1024 * 1024, // 1MB per image
    maxFontSize: 200 * 1024, // 200KB per font
    maxCSSSize: 500 * 1024, // 500KB CSS
    maxJSSize: 2 * 1024 * 1024, // 2MB JavaScript
  },

  performance: {
    maxRenderTime: 33, // 33ms (30fps)
    maxMemoryUsage: 85, // 85% memory usage
    minFPS: 30, // Minimum 30 FPS
    maxDOMNodes: 3000, // Maximum 3000 DOM nodes
    maxEventListeners: 200, // Maximum 200 event listeners
  },

  network: {
    maxLatency: 500, // 500ms latency
    maxBandwidth: 2000, // 2MB/s bandwidth
    maxConcurrentRequests: 10, // 10 concurrent requests
  },
};

// Testing performance budgets (very relaxed)
export const TESTING_BUDGETS: PerformanceBudget = {
  bundles: {
    main: 2 * 1024 * 1024, // 2MB main bundle
    vendor: 2 * 1024 * 1024, // 2MB vendor bundle
    total: 5 * 1024 * 1024, // 5MB total
    gzipped: 1.5 * 1024 * 1024, // 1.5MB gzipped
  },

  coreWebVitals: {
    lcp: 10000, // 10s - Very relaxed for testing
    fid: 1000, // 1s
    cls: 0.5, // 0.5
    fcp: 5000, // 5s
    ttfb: 2000, // 2s
    inp: 1000, // 1s
  },

  resources: {
    maxRequests: 200, // 200 requests
    maxImageSize: 2 * 1024 * 1024, // 2MB per image
    maxFontSize: 500 * 1024, // 500KB per font
    maxCSSSize: 1024 * 1024, // 1MB CSS
    maxJSSize: 5 * 1024 * 1024, // 5MB JavaScript
  },

  performance: {
    maxRenderTime: 100, // 100ms
    maxMemoryUsage: 95, // 95% memory usage
    minFPS: 15, // Minimum 15 FPS
    maxDOMNodes: 10000, // Maximum 10000 DOM nodes
    maxEventListeners: 500, // Maximum 500 event listeners
  },

  network: {
    maxLatency: 2000, // 2s latency
    maxBandwidth: 5000, // 5MB/s bandwidth
    maxConcurrentRequests: 20, // 20 concurrent requests
  },
};

// Get appropriate budget based on environment
export function getPerformanceBudget(): PerformanceBudget {
  const env = process.env.NODE_ENV;

  if (env === 'production') {
    return PRODUCTION_BUDGETS;
  } else if (env === 'test') {
    return TESTING_BUDGETS;
  } else {
    return DEVELOPMENT_BUDGETS;
  }
}

// Budget violation severity levels
export enum ViolationSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface BudgetViolation {
  metric: string;
  actual: number;
  budget: number;
  percentage: number;
  severity: ViolationSeverity;
  category: keyof PerformanceBudget;
  message: string;
}

// Calculate violation severity based on how much the budget is exceeded
export function calculateViolationSeverity(actual: number, budget: number): ViolationSeverity {
  const percentage = ((actual - budget) / budget) * 100;

  if (percentage >= 100) return ViolationSeverity.CRITICAL; // 100%+ over budget
  if (percentage >= 50) return ViolationSeverity.HIGH; // 50-99% over budget
  if (percentage >= 25) return ViolationSeverity.MEDIUM; // 25-49% over budget
  return ViolationSeverity.LOW; // 1-24% over budget
}

// Format bytes for human-readable output
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Format milliseconds for human-readable output
export function formatMilliseconds(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
