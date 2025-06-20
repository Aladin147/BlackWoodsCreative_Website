// Performance budget checker with comprehensive monitoring and reporting
import {
  PerformanceBudget,
  BudgetViolation,
  ViolationSeverity,
  getPerformanceBudget,
  calculateViolationSeverity,
  formatBytes,
  formatMilliseconds,
} from '../config/performance-budgets';

export interface BudgetCheckResult {
  passed: boolean;
  score: number; // 0-100 performance score
  violations: BudgetViolation[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations: string[];
  timestamp: string;
}

export interface PerformanceData {
  bundles?: {
    main: number;
    vendor: number;
    total: number;
    gzipped: number;
  };
  coreWebVitals?: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
    inp?: number;
  };
  resources?: {
    requests: number;
    imageSize: number;
    fontSize: number;
    cssSize: number;
    jsSize: number;
  };
  performance?: {
    renderTime: number;
    memoryUsage: number;
    fps: number;
    domNodes: number;
    eventListeners: number;
  };
  network?: {
    latency: number;
    bandwidth: number;
    concurrentRequests: number;
  };
}

class PerformanceBudgetChecker {
  private budget: PerformanceBudget;
  private violations: BudgetViolation[] = [];

  constructor(customBudget?: PerformanceBudget) {
    this.budget = customBudget || getPerformanceBudget();
  }

  // Main budget checking function
  checkBudgets(data: PerformanceData): BudgetCheckResult {
    this.violations = [];

    // Check each category
    if (data.bundles) this.checkBundleBudgets(data.bundles);
    if (data.coreWebVitals) this.checkCoreWebVitalsBudgets(data.coreWebVitals);
    if (data.resources) this.checkResourceBudgets(data.resources);
    if (data.performance) this.checkPerformanceBudgets(data.performance);
    if (data.network) this.checkNetworkBudgets(data.network);

    // Calculate results
    const summary = this.calculateSummary();
    const score = this.calculatePerformanceScore();
    const recommendations = this.generateRecommendations();

    return {
      passed: this.violations.length === 0,
      score,
      violations: this.violations,
      summary,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }

  private checkBundleBudgets(bundles: NonNullable<PerformanceData['bundles']>) {
    this.checkMetric('main', bundles.main, this.budget.bundles.main, 'bundles', 'Main bundle size');
    this.checkMetric(
      'vendor',
      bundles.vendor,
      this.budget.bundles.vendor,
      'bundles',
      'Vendor bundle size'
    );
    this.checkMetric(
      'total',
      bundles.total,
      this.budget.bundles.total,
      'bundles',
      'Total bundle size'
    );
    this.checkMetric(
      'gzipped',
      bundles.gzipped,
      this.budget.bundles.gzipped,
      'bundles',
      'Gzipped bundle size'
    );
  }

  private checkCoreWebVitalsBudgets(vitals: NonNullable<PerformanceData['coreWebVitals']>) {
    if (vitals.lcp)
      this.checkMetric(
        'lcp',
        vitals.lcp,
        this.budget.coreWebVitals.lcp,
        'coreWebVitals',
        'Largest Contentful Paint'
      );
    if (vitals.fid)
      this.checkMetric(
        'fid',
        vitals.fid,
        this.budget.coreWebVitals.fid,
        'coreWebVitals',
        'First Input Delay'
      );
    if (vitals.cls)
      this.checkMetric(
        'cls',
        vitals.cls,
        this.budget.coreWebVitals.cls,
        'coreWebVitals',
        'Cumulative Layout Shift'
      );
    if (vitals.fcp)
      this.checkMetric(
        'fcp',
        vitals.fcp,
        this.budget.coreWebVitals.fcp,
        'coreWebVitals',
        'First Contentful Paint'
      );
    if (vitals.ttfb)
      this.checkMetric(
        'ttfb',
        vitals.ttfb,
        this.budget.coreWebVitals.ttfb,
        'coreWebVitals',
        'Time to First Byte'
      );
    if (vitals.inp)
      this.checkMetric(
        'inp',
        vitals.inp,
        this.budget.coreWebVitals.inp,
        'coreWebVitals',
        'Interaction to Next Paint'
      );
  }

  private checkResourceBudgets(resources: NonNullable<PerformanceData['resources']>) {
    this.checkMetric(
      'requests',
      resources.requests,
      this.budget.resources.maxRequests,
      'resources',
      'Number of requests'
    );
    this.checkMetric(
      'imageSize',
      resources.imageSize,
      this.budget.resources.maxImageSize,
      'resources',
      'Image size'
    );
    this.checkMetric(
      'fontSize',
      resources.fontSize,
      this.budget.resources.maxFontSize,
      'resources',
      'Font size'
    );
    this.checkMetric(
      'cssSize',
      resources.cssSize,
      this.budget.resources.maxCSSSize,
      'resources',
      'CSS size'
    );
    this.checkMetric(
      'jsSize',
      resources.jsSize,
      this.budget.resources.maxJSSize,
      'resources',
      'JavaScript size'
    );
  }

  private checkPerformanceBudgets(performance: NonNullable<PerformanceData['performance']>) {
    this.checkMetric(
      'renderTime',
      performance.renderTime,
      this.budget.performance.maxRenderTime,
      'performance',
      'Render time'
    );
    this.checkMetric(
      'memoryUsage',
      performance.memoryUsage,
      this.budget.performance.maxMemoryUsage,
      'performance',
      'Memory usage'
    );
    this.checkMetric(
      'domNodes',
      performance.domNodes,
      this.budget.performance.maxDOMNodes,
      'performance',
      'DOM nodes'
    );
    this.checkMetric(
      'eventListeners',
      performance.eventListeners,
      this.budget.performance.maxEventListeners,
      'performance',
      'Event listeners'
    );

    // FPS is a minimum, so check differently
    if (performance.fps < this.budget.performance.minFPS) {
      const percentage =
        ((this.budget.performance.minFPS - performance.fps) / this.budget.performance.minFPS) * 100;
      const severity = calculateViolationSeverity(this.budget.performance.minFPS, performance.fps);

      this.violations.push({
        metric: 'fps',
        actual: performance.fps,
        budget: this.budget.performance.minFPS,
        percentage,
        severity,
        category: 'performance',
        message: `FPS (${performance.fps}) is below minimum threshold (${this.budget.performance.minFPS})`,
      });
    }
  }

  private checkNetworkBudgets(network: NonNullable<PerformanceData['network']>) {
    this.checkMetric(
      'latency',
      network.latency,
      this.budget.network.maxLatency,
      'network',
      'Network latency'
    );
    this.checkMetric(
      'bandwidth',
      network.bandwidth,
      this.budget.network.maxBandwidth,
      'network',
      'Bandwidth usage'
    );
    this.checkMetric(
      'concurrentRequests',
      network.concurrentRequests,
      this.budget.network.maxConcurrentRequests,
      'network',
      'Concurrent requests'
    );
  }

  private checkMetric(
    metric: string,
    actual: number,
    budget: number,
    category: keyof PerformanceBudget,
    description: string
  ) {
    if (actual > budget) {
      const percentage = ((actual - budget) / budget) * 100;
      const severity = calculateViolationSeverity(actual, budget);

      this.violations.push({
        metric,
        actual,
        budget,
        percentage,
        severity,
        category,
        message: `${description} (${this.formatValue(metric, actual)}) exceeds budget (${this.formatValue(metric, budget)}) by ${percentage.toFixed(1)}%`,
      });
    }
  }

  private formatValue(metric: string, value: number): string {
    // Format based on metric type
    if (metric.includes('Size') || metric.includes('bundle') || metric === 'bandwidth') {
      return formatBytes(value);
    } else if (
      metric.includes('Time') ||
      metric === 'lcp' ||
      metric === 'fid' ||
      metric === 'fcp' ||
      metric === 'ttfb' ||
      metric === 'inp' ||
      metric === 'latency'
    ) {
      return formatMilliseconds(value);
    } else if (metric === 'memoryUsage') {
      return `${value.toFixed(1)}%`;
    } else if (metric === 'cls') {
      return value.toFixed(3);
    } else {
      return value.toString();
    }
  }

  private calculateSummary() {
    const summary = {
      total: this.violations.length,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    this.violations.forEach(violation => {
      summary[violation.severity]++;
    });

    return summary;
  }

  private calculatePerformanceScore(): number {
    if (this.violations.length === 0) return 100;

    // Calculate weighted score based on violation severity
    let totalPenalty = 0;
    this.violations.forEach(violation => {
      switch (violation.severity) {
        case ViolationSeverity.CRITICAL:
          totalPenalty += 25;
          break;
        case ViolationSeverity.HIGH:
          totalPenalty += 15;
          break;
        case ViolationSeverity.MEDIUM:
          totalPenalty += 10;
          break;
        case ViolationSeverity.LOW:
          totalPenalty += 5;
          break;
      }
    });

    return Math.max(0, 100 - totalPenalty);
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const violationsByCategory = this.groupViolationsByCategory();

    // Bundle recommendations
    if (violationsByCategory.bundles && violationsByCategory.bundles.length > 0) {
      recommendations.push('Consider code splitting and lazy loading to reduce bundle sizes');
      recommendations.push('Use dynamic imports for non-critical components');
      recommendations.push('Optimize vendor bundle by removing unused dependencies');
    }

    // Core Web Vitals recommendations
    if (violationsByCategory.coreWebVitals && violationsByCategory.coreWebVitals.length > 0) {
      recommendations.push('Optimize images and use next/image for better LCP');
      recommendations.push('Reduce JavaScript execution time to improve FID');
      recommendations.push('Use CSS containment and avoid layout shifts for better CLS');
    }

    // Resource recommendations
    if (violationsByCategory.resources && violationsByCategory.resources.length > 0) {
      recommendations.push('Optimize and compress images');
      recommendations.push('Use font-display: swap for better font loading');
      recommendations.push('Minimize and compress CSS and JavaScript');
    }

    // Performance recommendations
    if (violationsByCategory.performance && violationsByCategory.performance.length > 0) {
      recommendations.push('Optimize component render performance');
      recommendations.push('Use React.memo and useMemo for expensive computations');
      recommendations.push('Reduce DOM complexity and event listener count');
    }

    // Network recommendations
    if (violationsByCategory.network && violationsByCategory.network.length > 0) {
      recommendations.push('Use CDN for static assets');
      recommendations.push('Implement request batching and caching');
      recommendations.push('Optimize API response times');
    }

    return recommendations;
  }

  private groupViolationsByCategory() {
    const grouped: Partial<Record<keyof PerformanceBudget, BudgetViolation[]>> = {};

    this.violations.forEach(violation => {
      if (!grouped[violation.category]) {
        grouped[violation.category] = [];
      }
      grouped[violation.category]!.push(violation);
    });

    return grouped;
  }
}

// Export singleton instance
let budgetChecker: PerformanceBudgetChecker | null = null;

export function getPerformanceBudgetChecker(
  customBudget?: PerformanceBudget
): PerformanceBudgetChecker {
  if (!budgetChecker || customBudget) {
    budgetChecker = new PerformanceBudgetChecker(customBudget);
  }
  return budgetChecker;
}

// Collect current performance data from browser APIs
export function collectPerformanceData(): PerformanceData {
  if (typeof window === 'undefined') {
    return {}; // Return empty object on server-side
  }

  const data: PerformanceData = {};

  // Collect Core Web Vitals if available
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    data.coreWebVitals = {};

    // TTFB
    if (navigation) {
      data.coreWebVitals.ttfb = navigation.responseStart - navigation.requestStart;
    }

    // FCP
    const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      data.coreWebVitals.fcp = fcpEntry.startTime;
    }
  }

  // Collect resource data
  if ('performance' in window) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    data.resources = {
      requests: resources.length,
      imageSize: 0,
      fontSize: 0,
      cssSize: 0,
      jsSize: 0,
    };

    resources.forEach(resource => {
      const size = resource.transferSize || 0;

      if (data.resources) {
        if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          data.resources.imageSize += size;
        } else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/i)) {
          data.resources.fontSize += size;
        } else if (resource.name.match(/\.css$/i)) {
          data.resources.cssSize += size;
        } else if (resource.name.match(/\.js$/i)) {
          data.resources.jsSize += size;
        }
      }
    });
  }

  // Collect performance metrics
  data.performance = {
    renderTime: 0, // Would need to be tracked separately
    memoryUsage: 0,
    fps: 60, // Default assumption
    domNodes: document.querySelectorAll('*').length,
    eventListeners: 0, // Would need to be tracked separately
  };

  // Memory usage if available
  if ('memory' in performance) {
    const memory = (performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number } })
      .memory;
    data.performance.memoryUsage = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
  }

  return data;
}

export { PerformanceBudgetChecker };
