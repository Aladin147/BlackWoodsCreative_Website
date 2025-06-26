/**
 * Performance Budget Validation
 * 
 * Tools for validating bundle sizes and performance metrics against established budgets
 */

// Performance budget configuration
export interface PerformanceBudget {
  // Bundle size budgets (in KB)
  bundles: {
    main: number;
    vendor: number;
    css: number;
    total: number;
  };
  
  // Asset size budgets (in KB)
  assets: {
    images: number;
    fonts: number;
    other: number;
  };
  
  // Performance metrics budgets (in ms)
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number; // CLS is unitless
    timeToInteractive: number;
    totalBlockingTime: number;
  };
  
  // Network budgets
  network: {
    requests: number;
    transferSize: number; // Total transfer size in KB
  };
  
  // Lighthouse score budgets (0-100)
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

// Performance budget result
export interface PerformanceBudgetResult {
  passed: boolean;
  score: number;
  violations: BudgetViolation[];
  warnings: BudgetWarning[];
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
  };
  recommendations: string[];
}

// Budget violation
export interface BudgetViolation {
  category: 'bundle' | 'asset' | 'metric' | 'network' | 'lighthouse';
  metric: string;
  actual: number;
  budget: number;
  severity: 'critical' | 'major' | 'minor';
  impact: string;
  fix: string;
}

// Budget warning
export interface BudgetWarning {
  category: 'bundle' | 'asset' | 'metric' | 'network' | 'lighthouse';
  metric: string;
  actual: number;
  budget: number;
  message: string;
  suggestion: string;
}

// Bundle analysis result
export interface BundleAnalysis {
  main: {
    size: number;
    gzipped: number;
    chunks: Array<{ name: string; size: number }>;
  };
  vendor: {
    size: number;
    gzipped: number;
    dependencies: Array<{ name: string; size: number }>;
  };
  css: {
    size: number;
    gzipped: number;
    files: Array<{ name: string; size: number }>;
  };
  total: {
    size: number;
    gzipped: number;
  };
}

// Performance metrics
export interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  speedIndex: number;
}

// Default performance budget
export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  bundles: {
    main: 250, // 250KB for main bundle
    vendor: 500, // 500KB for vendor bundle
    css: 50, // 50KB for CSS
    total: 800, // 800KB total
  },
  assets: {
    images: 1000, // 1MB for images
    fonts: 100, // 100KB for fonts
    other: 200, // 200KB for other assets
  },
  metrics: {
    firstContentfulPaint: 1500, // 1.5s
    largestContentfulPaint: 2500, // 2.5s
    firstInputDelay: 100, // 100ms
    cumulativeLayoutShift: 0.1, // 0.1 CLS
    timeToInteractive: 3000, // 3s
    totalBlockingTime: 300, // 300ms
  },
  network: {
    requests: 50, // 50 requests max
    transferSize: 1000, // 1MB transfer size
  },
  lighthouse: {
    performance: 90, // 90+ performance score
    accessibility: 95, // 95+ accessibility score
    bestPractices: 90, // 90+ best practices score
    seo: 95, // 95+ SEO score
  },
};

// Performance budget validator
export class PerformanceBudgetValidator {
  private static instance: PerformanceBudgetValidator;
  private budget: PerformanceBudget;

  constructor(budget: Partial<PerformanceBudget> = {}) {
    this.budget = this.mergeBudgets(DEFAULT_PERFORMANCE_BUDGET, budget);
  }

  static getInstance(budget?: Partial<PerformanceBudget>): PerformanceBudgetValidator {
    if (!PerformanceBudgetValidator.instance) {
      PerformanceBudgetValidator.instance = new PerformanceBudgetValidator(budget);
    }
    return PerformanceBudgetValidator.instance;
  }

  // Validate performance budget
  validateBudget(
    bundleAnalysis: BundleAnalysis,
    performanceMetrics: PerformanceMetrics,
    networkMetrics?: { requests: number; transferSize: number },
    lighthouseScores?: { performance: number; accessibility: number; bestPractices: number; seo: number }
  ): PerformanceBudgetResult {
    const violations: BudgetViolation[] = [];
    const warnings: BudgetWarning[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // Validate bundle sizes
    const bundleResults = this.validateBundles(bundleAnalysis);
    violations.push(...bundleResults.violations);
    warnings.push(...bundleResults.warnings);
    totalChecks += bundleResults.totalChecks;
    passedChecks += bundleResults.passedChecks;

    // Validate performance metrics
    const metricsResults = this.validateMetrics(performanceMetrics);
    violations.push(...metricsResults.violations);
    warnings.push(...metricsResults.warnings);
    totalChecks += metricsResults.totalChecks;
    passedChecks += metricsResults.passedChecks;

    // Validate network metrics if provided
    if (networkMetrics) {
      const networkResults = this.validateNetwork(networkMetrics);
      violations.push(...networkResults.violations);
      warnings.push(...networkResults.warnings);
      totalChecks += networkResults.totalChecks;
      passedChecks += networkResults.passedChecks;
    }

    // Validate Lighthouse scores if provided
    if (lighthouseScores) {
      const lighthouseResults = this.validateLighthouse(lighthouseScores);
      violations.push(...lighthouseResults.violations);
      warnings.push(...lighthouseResults.warnings);
      totalChecks += lighthouseResults.totalChecks;
      passedChecks += lighthouseResults.passedChecks;
    }

    // Calculate score and generate recommendations
    const score = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;
    const passed = violations.filter(v => v.severity === 'critical' || v.severity === 'major').length === 0;
    const recommendations = this.generateRecommendations(violations);

    return {
      passed,
      score,
      violations,
      warnings,
      summary: {
        totalChecks,
        passedChecks,
        failedChecks: violations.length,
        warningChecks: warnings.length,
      },
      recommendations,
    };
  }

  // Validate bundle sizes
  private validateBundles(bundleAnalysis: BundleAnalysis): {
    violations: BudgetViolation[];
    warnings: BudgetWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const violations: BudgetViolation[] = [];
    const warnings: BudgetWarning[] = [];
    const totalChecks = 4; // main, vendor, css, total
    let passedChecks = 0;

    // Check main bundle
    if (bundleAnalysis.main.size > this.budget.bundles.main * 1024) {
      violations.push({
        category: 'bundle',
        metric: 'main bundle size',
        actual: bundleAnalysis.main.size,
        budget: this.budget.bundles.main * 1024,
        severity: 'major',
        impact: 'Slower initial page load',
        fix: 'Optimize main bundle by code splitting and tree shaking',
      });
    } else {
      passedChecks++;
    }

    // Check vendor bundle
    if (bundleAnalysis.vendor.size > this.budget.bundles.vendor * 1024) {
      violations.push({
        category: 'bundle',
        metric: 'vendor bundle size',
        actual: bundleAnalysis.vendor.size,
        budget: this.budget.bundles.vendor * 1024,
        severity: 'major',
        impact: 'Slower initial page load due to large dependencies',
        fix: 'Remove unused dependencies and optimize vendor bundle',
      });
    } else {
      passedChecks++;
    }

    // Check CSS bundle
    if (bundleAnalysis.css.size > this.budget.bundles.css * 1024) {
      violations.push({
        category: 'bundle',
        metric: 'CSS bundle size',
        actual: bundleAnalysis.css.size,
        budget: this.budget.bundles.css * 1024,
        severity: 'minor',
        impact: 'Slower style rendering',
        fix: 'Remove unused CSS and optimize stylesheets',
      });
    } else {
      passedChecks++;
    }

    // Check total bundle size
    if (bundleAnalysis.total.size > this.budget.bundles.total * 1024) {
      violations.push({
        category: 'bundle',
        metric: 'total bundle size',
        actual: bundleAnalysis.total.size,
        budget: this.budget.bundles.total * 1024,
        severity: 'critical',
        impact: 'Significantly slower page load times',
        fix: 'Implement aggressive code splitting and lazy loading',
      });
    } else {
      passedChecks++;
    }

    return { violations, warnings, totalChecks, passedChecks };
  }

  // Validate performance metrics
  private validateMetrics(metrics: PerformanceMetrics): {
    violations: BudgetViolation[];
    warnings: BudgetWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const violations: BudgetViolation[] = [];
    const warnings: BudgetWarning[] = [];
    const totalChecks = 6; // FCP, LCP, FID, CLS, TTI, TBT
    let passedChecks = 0;

    // Check First Contentful Paint
    if (metrics.firstContentfulPaint > this.budget.metrics.firstContentfulPaint) {
      violations.push({
        category: 'metric',
        metric: 'First Contentful Paint',
        actual: metrics.firstContentfulPaint,
        budget: this.budget.metrics.firstContentfulPaint,
        severity: 'major',
        impact: 'Users see content later',
        fix: 'Optimize critical rendering path and reduce server response time',
      });
    } else {
      passedChecks++;
    }

    // Check Largest Contentful Paint
    if (metrics.largestContentfulPaint > this.budget.metrics.largestContentfulPaint) {
      violations.push({
        category: 'metric',
        metric: 'Largest Contentful Paint',
        actual: metrics.largestContentfulPaint,
        budget: this.budget.metrics.largestContentfulPaint,
        severity: 'critical',
        impact: 'Poor perceived loading performance',
        fix: 'Optimize largest content element loading and reduce resource load times',
      });
    } else {
      passedChecks++;
    }

    // Check First Input Delay
    if (metrics.firstInputDelay > this.budget.metrics.firstInputDelay) {
      violations.push({
        category: 'metric',
        metric: 'First Input Delay',
        actual: metrics.firstInputDelay,
        budget: this.budget.metrics.firstInputDelay,
        severity: 'major',
        impact: 'Poor interactivity responsiveness',
        fix: 'Reduce JavaScript execution time and optimize main thread work',
      });
    } else {
      passedChecks++;
    }

    // Check Cumulative Layout Shift
    if (metrics.cumulativeLayoutShift > this.budget.metrics.cumulativeLayoutShift) {
      violations.push({
        category: 'metric',
        metric: 'Cumulative Layout Shift',
        actual: metrics.cumulativeLayoutShift,
        budget: this.budget.metrics.cumulativeLayoutShift,
        severity: 'major',
        impact: 'Visual instability and poor user experience',
        fix: 'Set explicit dimensions for images and avoid inserting content above existing content',
      });
    } else {
      passedChecks++;
    }

    // Check Time to Interactive
    if (metrics.timeToInteractive > this.budget.metrics.timeToInteractive) {
      violations.push({
        category: 'metric',
        metric: 'Time to Interactive',
        actual: metrics.timeToInteractive,
        budget: this.budget.metrics.timeToInteractive,
        severity: 'major',
        impact: 'Delayed interactivity',
        fix: 'Reduce JavaScript bundle size and optimize main thread work',
      });
    } else {
      passedChecks++;
    }

    // Check Total Blocking Time
    if (metrics.totalBlockingTime > this.budget.metrics.totalBlockingTime) {
      violations.push({
        category: 'metric',
        metric: 'Total Blocking Time',
        actual: metrics.totalBlockingTime,
        budget: this.budget.metrics.totalBlockingTime,
        severity: 'minor',
        impact: 'Reduced responsiveness during loading',
        fix: 'Break up long tasks and optimize JavaScript execution',
      });
    } else {
      passedChecks++;
    }

    return { violations, warnings, totalChecks, passedChecks };
  }

  // Validate network metrics
  private validateNetwork(networkMetrics: { requests: number; transferSize: number }): {
    violations: BudgetViolation[];
    warnings: BudgetWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const violations: BudgetViolation[] = [];
    const warnings: BudgetWarning[] = [];
    const totalChecks = 2;
    let passedChecks = 0;

    // Check request count
    if (networkMetrics.requests > this.budget.network.requests) {
      violations.push({
        category: 'network',
        metric: 'request count',
        actual: networkMetrics.requests,
        budget: this.budget.network.requests,
        severity: 'minor',
        impact: 'Increased connection overhead',
        fix: 'Combine resources and use HTTP/2 server push',
      });
    } else {
      passedChecks++;
    }

    // Check transfer size
    if (networkMetrics.transferSize > this.budget.network.transferSize * 1024) {
      violations.push({
        category: 'network',
        metric: 'transfer size',
        actual: networkMetrics.transferSize,
        budget: this.budget.network.transferSize * 1024,
        severity: 'major',
        impact: 'Slower loading on slow connections',
        fix: 'Enable compression and optimize asset sizes',
      });
    } else {
      passedChecks++;
    }

    return { violations, warnings, totalChecks, passedChecks };
  }

  // Validate Lighthouse scores
  private validateLighthouse(scores: { performance: number; accessibility: number; bestPractices: number; seo: number }): {
    violations: BudgetViolation[];
    warnings: BudgetWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const violations: BudgetViolation[] = [];
    const warnings: BudgetWarning[] = [];
    const totalChecks = 4;
    let passedChecks = 0;

    // Check performance score
    if (scores.performance < this.budget.lighthouse.performance) {
      violations.push({
        category: 'lighthouse',
        metric: 'performance score',
        actual: scores.performance,
        budget: this.budget.lighthouse.performance,
        severity: 'critical',
        impact: 'Poor overall performance',
        fix: 'Address performance issues identified in Lighthouse audit',
      });
    } else {
      passedChecks++;
    }

    // Check accessibility score
    if (scores.accessibility < this.budget.lighthouse.accessibility) {
      violations.push({
        category: 'lighthouse',
        metric: 'accessibility score',
        actual: scores.accessibility,
        budget: this.budget.lighthouse.accessibility,
        severity: 'major',
        impact: 'Poor accessibility for users with disabilities',
        fix: 'Fix accessibility issues identified in Lighthouse audit',
      });
    } else {
      passedChecks++;
    }

    // Check best practices score
    if (scores.bestPractices < this.budget.lighthouse.bestPractices) {
      violations.push({
        category: 'lighthouse',
        metric: 'best practices score',
        actual: scores.bestPractices,
        budget: this.budget.lighthouse.bestPractices,
        severity: 'minor',
        impact: 'Not following web development best practices',
        fix: 'Address best practices issues identified in Lighthouse audit',
      });
    } else {
      passedChecks++;
    }

    // Check SEO score
    if (scores.seo < this.budget.lighthouse.seo) {
      violations.push({
        category: 'lighthouse',
        metric: 'SEO score',
        actual: scores.seo,
        budget: this.budget.lighthouse.seo,
        severity: 'minor',
        impact: 'Poor search engine optimization',
        fix: 'Fix SEO issues identified in Lighthouse audit',
      });
    } else {
      passedChecks++;
    }

    return { violations, warnings, totalChecks, passedChecks };
  }

  // Generate recommendations
  private generateRecommendations(violations: BudgetViolation[]): string[] {
    const recommendations: string[] = [];

    const criticalViolations = violations.filter(v => v.severity === 'critical');
    const majorViolations = violations.filter(v => v.severity === 'major');

    if (criticalViolations.length > 0) {
      recommendations.push('Address critical performance issues immediately before deployment');
      recommendations.push('Focus on bundle size optimization and Core Web Vitals');
    }

    if (majorViolations.length > 0) {
      recommendations.push('Optimize major performance bottlenecks');
      recommendations.push('Consider implementing performance monitoring in production');
    }

    const bundleViolations = violations.filter(v => v.category === 'bundle');
    if (bundleViolations.length > 0) {
      recommendations.push('Implement code splitting and tree shaking to reduce bundle sizes');
      recommendations.push('Consider lazy loading non-critical components');
    }

    const metricViolations = violations.filter(v => v.category === 'metric');
    if (metricViolations.length > 0) {
      recommendations.push('Optimize Core Web Vitals for better user experience');
      recommendations.push('Use performance profiling tools to identify bottlenecks');
    }

    if (violations.length === 0) {
      recommendations.push('Excellent! All performance budgets are met');
      recommendations.push('Continue monitoring performance in production');
    }

    return recommendations;
  }

  // Merge budget configurations
  private mergeBudgets(defaultBudget: PerformanceBudget, customBudget: Partial<PerformanceBudget>): PerformanceBudget {
    return {
      bundles: { ...defaultBudget.bundles, ...customBudget.bundles },
      assets: { ...defaultBudget.assets, ...customBudget.assets },
      metrics: { ...defaultBudget.metrics, ...customBudget.metrics },
      network: { ...defaultBudget.network, ...customBudget.network },
      lighthouse: { ...defaultBudget.lighthouse, ...customBudget.lighthouse },
    };
  }

  // Update budget
  updateBudget(updates: Partial<PerformanceBudget>): void {
    this.budget = this.mergeBudgets(this.budget, updates);
  }

  // Get current budget
  getBudget(): PerformanceBudget {
    return { ...this.budget };
  }
}

// Export singleton instance
export const performanceBudgetValidator = PerformanceBudgetValidator.getInstance();

// Performance budget utilities
export const PerformanceBudgetUtils = {
  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  // Format duration
  formatDuration: (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  },

  // Calculate budget utilization percentage
  calculateUtilization: (actual: number, budget: number): number => {
    return (actual / budget) * 100;
  },

  // Get severity color
  getSeverityColor: (severity: 'critical' | 'major' | 'minor'): string => {
    switch (severity) {
      case 'critical': return '#dc2626'; // red-600
      case 'major': return '#ea580c'; // orange-600
      case 'minor': return '#ca8a04'; // yellow-600
      default: return '#6b7280'; // gray-500
    }
  },

  // Generate budget report
  generateBudgetReport: (result: PerformanceBudgetResult): string => {
    const { passed, score, violations, warnings, summary } = result;

    let report = `# Performance Budget Report\n\n`;
    report += `**Status:** ${passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `**Score:** ${score.toFixed(1)}%\n\n`;

    report += `## Summary\n`;
    report += `- Total Checks: ${summary.totalChecks}\n`;
    report += `- Passed: ${summary.passedChecks}\n`;
    report += `- Failed: ${summary.failedChecks}\n`;
    report += `- Warnings: ${summary.warningChecks}\n\n`;

    if (violations.length > 0) {
      report += `## Budget Violations\n`;
      violations.forEach((violation, index) => {
        const utilization = PerformanceBudgetUtils.calculateUtilization(violation.actual, violation.budget);
        report += `### ${index + 1}. ${violation.metric}\n`;
        report += `**Category:** ${violation.category}\n`;
        report += `**Severity:** ${violation.severity}\n`;
        report += `**Actual:** ${PerformanceBudgetUtils.formatFileSize(violation.actual)}\n`;
        report += `**Budget:** ${PerformanceBudgetUtils.formatFileSize(violation.budget)}\n`;
        report += `**Utilization:** ${utilization.toFixed(1)}%\n`;
        report += `**Impact:** ${violation.impact}\n`;
        report += `**Fix:** ${violation.fix}\n\n`;
      });
    }

    if (warnings.length > 0) {
      report += `## Warnings\n`;
      warnings.forEach((warning, index) => {
        const utilization = PerformanceBudgetUtils.calculateUtilization(warning.actual, warning.budget);
        report += `### ${index + 1}. ${warning.metric}\n`;
        report += `**Category:** ${warning.category}\n`;
        report += `**Actual:** ${PerformanceBudgetUtils.formatFileSize(warning.actual)}\n`;
        report += `**Budget:** ${PerformanceBudgetUtils.formatFileSize(warning.budget)}\n`;
        report += `**Utilization:** ${utilization.toFixed(1)}%\n`;
        report += `**Message:** ${warning.message}\n`;
        report += `**Suggestion:** ${warning.suggestion}\n\n`;
      });
    }

    return report;
  },

  // Mock bundle analysis for testing
  generateMockBundleAnalysis: (overrides: Partial<BundleAnalysis> = {}): BundleAnalysis => {
    const defaultAnalysis: BundleAnalysis = {
      main: {
        size: 200 * 1024, // 200KB
        gzipped: 60 * 1024, // 60KB
        chunks: [
          { name: 'main', size: 150 * 1024 },
          { name: 'components', size: 50 * 1024 },
        ],
      },
      vendor: {
        size: 400 * 1024, // 400KB
        gzipped: 120 * 1024, // 120KB
        dependencies: [
          { name: 'react', size: 150 * 1024 },
          { name: 'next', size: 200 * 1024 },
          { name: 'other', size: 50 * 1024 },
        ],
      },
      css: {
        size: 40 * 1024, // 40KB
        gzipped: 12 * 1024, // 12KB
        files: [
          { name: 'globals.css', size: 20 * 1024 },
          { name: 'components.css', size: 20 * 1024 },
        ],
      },
      total: {
        size: 640 * 1024, // 640KB
        gzipped: 192 * 1024, // 192KB
      },
    };

    return {
      main: { ...defaultAnalysis.main, ...overrides.main },
      vendor: { ...defaultAnalysis.vendor, ...overrides.vendor },
      css: { ...defaultAnalysis.css, ...overrides.css },
      total: { ...defaultAnalysis.total, ...overrides.total },
    };
  },

  // Mock performance metrics for testing
  generateMockPerformanceMetrics: (overrides: Partial<PerformanceMetrics> = {}): PerformanceMetrics => {
    const defaultMetrics: PerformanceMetrics = {
      firstContentfulPaint: 1200, // 1.2s
      largestContentfulPaint: 2000, // 2s
      firstInputDelay: 80, // 80ms
      cumulativeLayoutShift: 0.05, // 0.05
      timeToInteractive: 2500, // 2.5s
      totalBlockingTime: 200, // 200ms
      speedIndex: 1800, // 1.8s
    };

    return { ...defaultMetrics, ...overrides };
  },

  // Mock network metrics for testing
  generateMockNetworkMetrics: (overrides: Partial<{ requests: number; transferSize: number }> = {}): { requests: number; transferSize: number } => {
    const defaultMetrics = {
      requests: 35,
      transferSize: 800 * 1024, // 800KB
    };

    return { ...defaultMetrics, ...overrides };
  },

  // Mock Lighthouse scores for testing
  generateMockLighthouseScores: (overrides: Partial<{ performance: number; accessibility: number; bestPractices: number; seo: number }> = {}): { performance: number; accessibility: number; bestPractices: number; seo: number } => {
    const defaultScores = {
      performance: 92,
      accessibility: 96,
      bestPractices: 91,
      seo: 97,
    };

    return { ...defaultScores, ...overrides };
  },

  // Validate budget configuration
  validateBudgetConfig: (budget: Partial<PerformanceBudget>): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check bundle budgets
    if (budget.bundles) {
      if (budget.bundles.main && budget.bundles.main <= 0) {
        errors.push('Main bundle budget must be positive');
      }
      if (budget.bundles.vendor && budget.bundles.vendor <= 0) {
        errors.push('Vendor bundle budget must be positive');
      }
      if (budget.bundles.css && budget.bundles.css <= 0) {
        errors.push('CSS bundle budget must be positive');
      }
      if (budget.bundles.total && budget.bundles.total <= 0) {
        errors.push('Total bundle budget must be positive');
      }
    }

    // Check metric budgets
    if (budget.metrics) {
      if (budget.metrics.firstContentfulPaint && budget.metrics.firstContentfulPaint <= 0) {
        errors.push('First Contentful Paint budget must be positive');
      }
      if (budget.metrics.cumulativeLayoutShift && budget.metrics.cumulativeLayoutShift < 0) {
        errors.push('Cumulative Layout Shift budget must be non-negative');
      }
    }

    // Check Lighthouse budgets
    if (budget.lighthouse) {
      Object.entries(budget.lighthouse).forEach(([key, value]) => {
        if (value < 0 || value > 100) {
          errors.push(`Lighthouse ${key} score must be between 0 and 100`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Get performance grade
  getPerformanceGrade: (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  },

  // Calculate Core Web Vitals score
  calculateCoreWebVitalsScore: (metrics: PerformanceMetrics): {
    score: number;
    lcp: 'good' | 'needs-improvement' | 'poor';
    fid: 'good' | 'needs-improvement' | 'poor';
    cls: 'good' | 'needs-improvement' | 'poor';
  } => {
    // LCP scoring
    let lcp: 'good' | 'needs-improvement' | 'poor';
    if (metrics.largestContentfulPaint <= 2500) lcp = 'good';
    else if (metrics.largestContentfulPaint <= 4000) lcp = 'needs-improvement';
    else lcp = 'poor';

    // FID scoring
    let fid: 'good' | 'needs-improvement' | 'poor';
    if (metrics.firstInputDelay <= 100) fid = 'good';
    else if (metrics.firstInputDelay <= 300) fid = 'needs-improvement';
    else fid = 'poor';

    // CLS scoring
    let cls: 'good' | 'needs-improvement' | 'poor';
    if (metrics.cumulativeLayoutShift <= 0.1) cls = 'good';
    else if (metrics.cumulativeLayoutShift <= 0.25) cls = 'needs-improvement';
    else cls = 'poor';

    // Calculate overall score
    const scores = { good: 100, 'needs-improvement': 75, poor: 50 };
    const totalScore = (scores[lcp] + scores[fid] + scores[cls]) / 3;

    return {
      score: totalScore,
      lcp,
      fid,
      cls,
    };
  },
};
