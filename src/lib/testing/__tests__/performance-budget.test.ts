/**
 * Performance Budget Tests
 */

import {
  PerformanceBudgetValidator,
  PerformanceBudgetUtils,
} from '../performance-budget';

describe('PerformanceBudgetValidator', () => {
  let validator: PerformanceBudgetValidator;

  beforeEach(() => {
    validator = new PerformanceBudgetValidator();
  });

  describe('Configuration', () => {
    it('should use default budget configuration', () => {
      const budget = validator.getBudget();
      
      expect(budget.bundles.main).toBe(250);
      expect(budget.bundles.vendor).toBe(500);
      expect(budget.bundles.css).toBe(50);
      expect(budget.bundles.total).toBe(800);
      expect(budget.metrics.firstContentfulPaint).toBe(1500);
      expect(budget.metrics.largestContentfulPaint).toBe(2500);
    });

    it('should allow custom budget configuration', () => {
      const customValidator = new PerformanceBudgetValidator({
        bundles: { main: 300, vendor: 500, css: 50, total: 850 },
        metrics: {
          firstContentfulPaint: 1000,
          largestContentfulPaint: 2500,
          firstInputDelay: 100,
          cumulativeLayoutShift: 0.1,
          timeToInteractive: 3000,
          totalBlockingTime: 200
        },
      });
      
      const budget = customValidator.getBudget();
      
      expect(budget.bundles.main).toBe(300);
      expect(budget.bundles.vendor).toBe(500); // Should keep default
      expect(budget.metrics.firstContentfulPaint).toBe(1000);
      expect(budget.metrics.largestContentfulPaint).toBe(2500); // Should keep default
    });

    it('should allow budget updates', () => {
      validator.updateBudget({
        bundles: { main: 400, vendor: 500, css: 50, total: 950 },
        lighthouse: { performance: 95, accessibility: 90, bestPractices: 90, seo: 90 },
      });
      
      const budget = validator.getBudget();
      
      expect(budget.bundles.main).toBe(400);
      expect(budget.lighthouse.performance).toBe(95);
    });
  });

  describe('Bundle Validation', () => {
    it('should pass when bundles are within budget', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis({
        main: {
          size: 200 * 1024,
          gzipped: 150 * 1024,
          chunks: [{ name: 'main', size: 200 * 1024 }]
        },
        vendor: {
          size: 400 * 1024,
          gzipped: 300 * 1024,
          dependencies: [{ name: 'react', size: 200 * 1024 }]
        },
        css: {
          size: 40 * 1024,
          gzipped: 30 * 1024,
          files: [{ name: 'main.css', size: 40 * 1024 }]
        },
        total: {
          size: 640 * 1024,
          gzipped: 480 * 1024
        },
      });
      
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      
      const bundleViolations = result.violations.filter(v => v.category === 'bundle');
      expect(bundleViolations).toHaveLength(0);
    });

    it('should fail when main bundle exceeds budget', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis({
        main: {
          size: 300 * 1024,
          gzipped: 225 * 1024,
          chunks: [{ name: 'main', size: 300 * 1024 }]
        },
      });
      
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      
      const mainBundleViolations = result.violations.filter(
        v => v.category === 'bundle' && v.metric === 'main bundle size'
      );
      expect(mainBundleViolations).toHaveLength(1);
      expect(mainBundleViolations[0]?.severity).toBe('major');
    });

    it('should fail when total bundle exceeds budget', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis({
        total: {
          size: 900 * 1024,
          gzipped: 675 * 1024
        },
      });
      
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      
      const totalBundleViolations = result.violations.filter(
        v => v.category === 'bundle' && v.metric === 'total bundle size'
      );
      expect(totalBundleViolations).toHaveLength(1);
      expect(totalBundleViolations[0]?.severity).toBe('critical');
    });
  });

  describe('Performance Metrics Validation', () => {
    it('should pass when metrics are within budget', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics({
        firstContentfulPaint: 1200, // Under 1500ms budget
        largestContentfulPaint: 2000, // Under 2500ms budget
        firstInputDelay: 80, // Under 100ms budget
        cumulativeLayoutShift: 0.05, // Under 0.1 budget
      });
      
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      
      const metricViolations = result.violations.filter(v => v.category === 'metric');
      expect(metricViolations).toHaveLength(0);
    });

    it('should fail when LCP exceeds budget', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics({
        largestContentfulPaint: 3000, // Over 2500ms budget
      });
      
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      
      const lcpViolations = result.violations.filter(
        v => v.category === 'metric' && v.metric === 'Largest Contentful Paint'
      );
      expect(lcpViolations).toHaveLength(1);
      expect(lcpViolations[0]?.severity).toBe('critical');
    });

    it('should fail when CLS exceeds budget', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics({
        cumulativeLayoutShift: 0.15, // Over 0.1 budget
      });
      
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      
      const clsViolations = result.violations.filter(
        v => v.category === 'metric' && v.metric === 'Cumulative Layout Shift'
      );
      expect(clsViolations).toHaveLength(1);
      expect(clsViolations[0]?.severity).toBe('major');
    });
  });

  describe('Network Validation', () => {
    it('should pass when network metrics are within budget', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      const networkMetrics = PerformanceBudgetUtils.generateMockNetworkMetrics({
        requests: 40, // Under 50 budget
        transferSize: 800 * 1024, // Under 1MB budget
      });
      
      const result = await validator.validateBudget(bundleAnalysis, metrics, networkMetrics);
      
      const networkViolations = result.violations.filter(v => v.category === 'network');
      expect(networkViolations).toHaveLength(0);
    });

    it('should fail when request count exceeds budget', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      const networkMetrics = PerformanceBudgetUtils.generateMockNetworkMetrics({
        requests: 60, // Over 50 budget
      });
      
      const result = await validator.validateBudget(bundleAnalysis, metrics, networkMetrics);
      
      const requestViolations = result.violations.filter(
        v => v.category === 'network' && v.metric === 'request count'
      );
      expect(requestViolations).toHaveLength(1);
      expect(requestViolations[0]?.severity).toBe('minor');
    });
  });

  describe('Lighthouse Validation', () => {
    it('should pass when Lighthouse scores meet budget', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      const lighthouseScores = PerformanceBudgetUtils.generateMockLighthouseScores({
        performance: 92, // Over 90 budget
        accessibility: 96, // Over 95 budget
        bestPractices: 91, // Over 90 budget
        seo: 97, // Over 95 budget
      });
      
      const result = await validator.validateBudget(bundleAnalysis, metrics, undefined, lighthouseScores);
      
      const lighthouseViolations = result.violations.filter(v => v.category === 'lighthouse');
      expect(lighthouseViolations).toHaveLength(0);
    });

    it('should fail when performance score is below budget', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      const lighthouseScores = PerformanceBudgetUtils.generateMockLighthouseScores({
        performance: 85, // Under 90 budget
      });
      
      const result = await validator.validateBudget(bundleAnalysis, metrics, undefined, lighthouseScores);
      
      const performanceViolations = result.violations.filter(
        v => v.category === 'lighthouse' && v.metric === 'performance score'
      );
      expect(performanceViolations).toHaveLength(1);
      expect(performanceViolations[0]?.severity).toBe('critical');
    });
  });

  describe('Overall Validation', () => {
    it('should calculate correct score', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.summary.totalChecks).toBeGreaterThan(0);
      expect(result.summary.passedChecks + result.summary.failedChecks).toBe(result.summary.totalChecks);
    });

    it('should pass when all budgets are met', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      
      expect(result.passed).toBe(true);
      expect(result.violations.filter(v => v.severity === 'critical' || v.severity === 'major')).toHaveLength(0);
    });

    it('should fail when critical violations exist', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis({
        total: { size: 1000 * 1024, gzipped: 750 * 1024 }, // Over budget
      });
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics({
        largestContentfulPaint: 4000, // Over budget
      });
      
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      
      expect(result.passed).toBe(false);
      expect(result.violations.filter(v => v.severity === 'critical')).toHaveLength(2);
    });

    it('should generate appropriate recommendations', async () => {
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis({
        main: {
          size: 300 * 1024,
          gzipped: 225 * 1024,
          chunks: [{ name: 'main', size: 300 * 1024 }]
        }, // Over budget
      });
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics({
        firstContentfulPaint: 2000, // Over budget
      });
      
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.some(r => r.includes('bundle'))).toBe(true);
      expect(result.recommendations.some(r => r.includes('performance'))).toBe(true);
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = PerformanceBudgetValidator.getInstance();
      const instance2 = PerformanceBudgetValidator.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
});

describe('PerformanceBudgetUtils', () => {
  describe('Formatting', () => {
    it('should format file sizes correctly', () => {
      expect(PerformanceBudgetUtils.formatFileSize(0)).toBe('0 B');
      expect(PerformanceBudgetUtils.formatFileSize(1024)).toBe('1 KB');
      expect(PerformanceBudgetUtils.formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(PerformanceBudgetUtils.formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format durations correctly', () => {
      expect(PerformanceBudgetUtils.formatDuration(500)).toBe('500ms');
      expect(PerformanceBudgetUtils.formatDuration(1500)).toBe('1.50s');
      expect(PerformanceBudgetUtils.formatDuration(2000)).toBe('2.00s');
    });
  });

  describe('Calculations', () => {
    it('should calculate utilization percentage', () => {
      expect(PerformanceBudgetUtils.calculateUtilization(50, 100)).toBe(50);
      expect(PerformanceBudgetUtils.calculateUtilization(150, 100)).toBe(150);
      expect(PerformanceBudgetUtils.calculateUtilization(0, 100)).toBe(0);
    });

    it('should get performance grades', () => {
      expect(PerformanceBudgetUtils.getPerformanceGrade(95)).toBe('A');
      expect(PerformanceBudgetUtils.getPerformanceGrade(85)).toBe('B');
      expect(PerformanceBudgetUtils.getPerformanceGrade(75)).toBe('C');
      expect(PerformanceBudgetUtils.getPerformanceGrade(65)).toBe('D');
      expect(PerformanceBudgetUtils.getPerformanceGrade(55)).toBe('F');
    });

    it('should calculate Core Web Vitals score', () => {
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics({
        largestContentfulPaint: 2000, // Good
        firstInputDelay: 80, // Good
        cumulativeLayoutShift: 0.05, // Good
      });
      
      const result = PerformanceBudgetUtils.calculateCoreWebVitalsScore(metrics);
      
      expect(result.score).toBe(100);
      expect(result.lcp).toBe('good');
      expect(result.fid).toBe('good');
      expect(result.cls).toBe('good');
    });

    it('should handle poor Core Web Vitals', () => {
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics({
        largestContentfulPaint: 5000, // Poor
        firstInputDelay: 400, // Poor
        cumulativeLayoutShift: 0.3, // Poor
      });
      
      const result = PerformanceBudgetUtils.calculateCoreWebVitalsScore(metrics);
      
      expect(result.score).toBe(50);
      expect(result.lcp).toBe('poor');
      expect(result.fid).toBe('poor');
      expect(result.cls).toBe('poor');
    });
  });

  describe('Mock Data Generation', () => {
    it('should generate mock bundle analysis', () => {
      const analysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      
      expect(analysis.main.size).toBeGreaterThan(0);
      expect(analysis.vendor.size).toBeGreaterThan(0);
      expect(analysis.css.size).toBeGreaterThan(0);
      expect(analysis.total.size).toBeGreaterThan(0);
      expect(analysis.main.chunks).toHaveLength(2);
      expect(analysis.vendor.dependencies).toHaveLength(3);
    });

    it('should generate mock performance metrics', () => {
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      
      expect(metrics.firstContentfulPaint).toBeGreaterThan(0);
      expect(metrics.largestContentfulPaint).toBeGreaterThan(0);
      expect(metrics.firstInputDelay).toBeGreaterThan(0);
      expect(metrics.cumulativeLayoutShift).toBeGreaterThanOrEqual(0);
      expect(metrics.timeToInteractive).toBeGreaterThan(0);
      expect(metrics.totalBlockingTime).toBeGreaterThan(0);
    });

    it('should allow overrides in mock data', () => {
      const analysis = PerformanceBudgetUtils.generateMockBundleAnalysis({
        main: {
          size: 500 * 1024,
          gzipped: 375 * 1024,
          chunks: [{ name: 'main', size: 500 * 1024 }]
        },
      });
      
      expect(analysis.main.size).toBe(500 * 1024);
      expect(analysis.vendor.size).toBe(400 * 1024); // Should keep default
    });
  });

  describe('Validation', () => {
    it('should validate budget configuration', () => {
      const validBudget = {
        bundles: { main: 250, vendor: 500, css: 50, total: 800 },
        metrics: {
          firstContentfulPaint: 1500,
          largestContentfulPaint: 2500,
          firstInputDelay: 100,
          cumulativeLayoutShift: 0.1,
          timeToInteractive: 3000,
          totalBlockingTime: 200
        },
        lighthouse: { performance: 90, accessibility: 90, bestPractices: 90, seo: 90 },
      };
      
      const result = PerformanceBudgetUtils.validateBudgetConfig(validBudget);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should identify invalid budget configuration', () => {
      const invalidBudget = {
        bundles: { main: -100, vendor: 500, css: 50, total: 450 }, // Invalid negative value
        lighthouse: { performance: 150, accessibility: 90, bestPractices: 90, seo: 90 }, // Invalid score > 100
      };
      
      const result = PerformanceBudgetUtils.validateBudgetConfig(invalidBudget);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.includes('positive'))).toBe(true);
      expect(result.errors.some(e => e.includes('between 0 and 100'))).toBe(true);
    });
  });

  describe('Report Generation', () => {
    it('should generate budget report', async () => {
      const validator = new PerformanceBudgetValidator();
      const bundleAnalysis = PerformanceBudgetUtils.generateMockBundleAnalysis();
      const metrics = PerformanceBudgetUtils.generateMockPerformanceMetrics();
      
      const result = await validator.validateBudget(bundleAnalysis, metrics);
      const report = PerformanceBudgetUtils.generateBudgetReport(result);
      
      expect(report).toContain('# Performance Budget Report');
      expect(report).toContain('## Summary');
      expect(report).toContain('Status:');
      expect(report).toContain('Score:');
    });
  });
});
