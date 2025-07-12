/**
 * Phase 2 Performance Optimization Validation Tests
 * Comprehensive testing suite for bundle optimization, animation performance, and CSP implementation
 */

import {
  runPerformanceTestSuite,
  validateBundleOptimization,
  validateAnimationPerformance,
  validateCSPCompliance,
  validateWebVitals,
  performanceTargets,
} from '@/lib/testing/performance-tests';

describe('Phase 2: Performance Optimization & Modern Patterns - Validation', () => {
  describe('Bundle Optimization Validation', () => {
    it('should meet bundle size targets', async () => {
      const result = await validateBundleOptimization();

      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);

      // Validate specific metrics
      expect(result.metrics.homepage).toBeLessThanOrEqual(performanceTargets.bundleSize.homepage);
      expect(result.metrics.sharedChunks).toBeLessThanOrEqual(
        performanceTargets.bundleSize.sharedChunks
      );
      expect(result.metrics.totalFirstLoad).toBeLessThanOrEqual(
        performanceTargets.bundleSize.totalFirstLoad
      );

      // Log results for visibility
      console.log('Bundle Optimization Results:', {
        homepage: `${Math.round(result.metrics.homepage / 1000)}kB`,
        sharedChunks: `${Math.round(result.metrics.sharedChunks / 1000)}kB`,
        totalFirstLoad: `${Math.round(result.metrics.totalFirstLoad / 1000)}kB`,
        middleware: `${Math.round(result.metrics.middleware / 1000)}kB`,
      });
    });

    it('should have optimized chunk splitting', async () => {
      const result = await validateBundleOptimization();

      // Verify that shared chunks are smaller than homepage bundle
      // This indicates proper code splitting
      expect(result.metrics.sharedChunks).toBeLessThan(result.metrics.homepage);

      // Verify reasonable middleware size
      expect(result.metrics.middleware).toBeLessThan(100000); // 100kB
    });
  });

  describe('Animation Performance Validation', () => {
    it('should meet animation performance targets', async () => {
      const result = await validateAnimationPerformance();

      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);

      // Validate specific metrics
      expect(result.metrics.fps).toBeGreaterThanOrEqual(
        performanceTargets.animationPerformance.minFps
      );
      expect(result.metrics.frameTime).toBeLessThanOrEqual(
        performanceTargets.animationPerformance.maxFrameTime
      );
      expect(result.metrics.memoryUsage).toBeLessThanOrEqual(
        performanceTargets.animationPerformance.maxMemoryUsage
      );
      expect(result.metrics.activeAnimations).toBeLessThanOrEqual(
        performanceTargets.animationPerformance.maxActiveAnimations
      );

      // Log results for visibility
      console.log('Animation Performance Results:', {
        fps: result.metrics.fps,
        frameTime: `${result.metrics.frameTime}ms`,
        memoryUsage: `${result.metrics.memoryUsage}MB`,
        activeAnimations: result.metrics.activeAnimations,
        gpuLayersActive: result.metrics.gpuLayersActive,
      });
    });

    it('should have efficient GPU layer management', async () => {
      const result = await validateAnimationPerformance();

      // GPU layers should be reasonable number
      expect(result.metrics.gpuLayersActive).toBeLessThanOrEqual(10);

      // GPU layers should be less than total active animations
      expect(result.metrics.gpuLayersActive).toBeLessThanOrEqual(result.metrics.activeAnimations);
    });
  });

  describe('CSP Implementation Validation', () => {
    it('should have working nonce-based CSP', async () => {
      const result = await validateCSPCompliance();

      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);

      // Validate specific CSP features
      expect(result.metrics.nonceGeneration).toBe(true);
      expect(result.metrics.hashFallback).toBe(true);
      expect(result.metrics.violationCount).toBe(0);
      expect(result.metrics.framerMotionCompatibility).toBe(true);

      // Log results for visibility
      console.log('CSP Compliance Results:', {
        nonceGeneration: result.metrics.nonceGeneration ? '✅' : '❌',
        hashFallback: result.metrics.hashFallback ? '✅' : '❌',
        violationCount: result.metrics.violationCount,
        framerMotionCompatibility: result.metrics.framerMotionCompatibility ? '✅' : '❌',
      });
    });

    it('should have zero CSP violations', async () => {
      const result = await validateCSPCompliance();

      expect(result.metrics.violationCount).toBe(0);
    });

    it('should support Framer Motion animations', async () => {
      const result = await validateCSPCompliance();

      expect(result.metrics.framerMotionCompatibility).toBe(true);
    });
  });

  describe('Web Vitals Validation', () => {
    it('should meet Core Web Vitals targets', async () => {
      const result = await validateWebVitals();

      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);

      // Validate specific Web Vitals
      expect(result.metrics.ttfb).toBeLessThanOrEqual(
        performanceTargets.loadingPerformance.maxTtfb
      );
      expect(result.metrics.fcp).toBeLessThanOrEqual(performanceTargets.loadingPerformance.maxFcp);
      expect(result.metrics.lcp).toBeLessThanOrEqual(performanceTargets.loadingPerformance.maxLcp);
      expect(result.metrics.cls).toBeLessThanOrEqual(performanceTargets.loadingPerformance.maxCls);
      expect(result.metrics.fid).toBeLessThanOrEqual(performanceTargets.loadingPerformance.maxFid);

      // Log results for visibility
      console.log('Web Vitals Results:', {
        ttfb: `${result.metrics.ttfb}ms`,
        fcp: `${result.metrics.fcp}ms`,
        lcp: `${result.metrics.lcp}ms`,
        cls: result.metrics.cls,
        fid: `${result.metrics.fid}ms`,
      });
    });

    it('should have excellent LCP performance', async () => {
      const result = await validateWebVitals();

      // LCP should be under 2.5s (excellent)
      expect(result.metrics.lcp).toBeLessThan(2500);
    });

    it('should have minimal layout shift', async () => {
      const result = await validateWebVitals();

      // CLS should be under 0.1 (good)
      expect(result.metrics.cls).toBeLessThan(0.1);
    });
  });

  describe('Comprehensive Performance Test Suite', () => {
    it('should pass all performance validations', async () => {
      const result = await runPerformanceTestSuite();

      expect(result.passed).toBe(true);
      expect(result.summary.failedTests).toBe(0);
      expect(result.summary.totalIssues).toBe(0);

      // Log comprehensive summary
      console.log('Performance Test Suite Summary:', {
        totalTests: result.summary.totalTests,
        passedTests: result.summary.passedTests,
        failedTests: result.summary.failedTests,
        totalIssues: result.summary.totalIssues,
        overallResult: result.passed ? '✅ PASSED' : '❌ FAILED',
      });

      // Log detailed results
      console.log('Detailed Results:', {
        bundleOptimization: result.results.bundleOptimization.passed ? '✅' : '❌',
        animationPerformance: result.results.animationPerformance.passed ? '✅' : '❌',
        cspCompliance: result.results.cspCompliance.passed ? '✅' : '❌',
        webVitals: result.results.webVitals.passed ? '✅' : '❌',
      });
    });

    it('should meet Phase 2 optimization goals', async () => {
      const result = await runPerformanceTestSuite();

      // Verify all major Phase 2 goals are met
      expect(result.results.bundleOptimization.passed).toBe(true);
      expect(result.results.animationPerformance.passed).toBe(true);
      expect(result.results.cspCompliance.passed).toBe(true);
      expect(result.results.webVitals.passed).toBe(true);

      // Verify specific improvements from Phase 2
      const bundleMetrics = result.results.bundleOptimization.metrics;
      const animationMetrics = result.results.animationPerformance.metrics;

      // Bundle optimization achievements
      expect(bundleMetrics.totalFirstLoad).toBeLessThan(400000); // Under 400kB
      expect(bundleMetrics.sharedChunks).toBeLessThan(170000); // Under 170kB

      // Animation performance achievements
      expect(animationMetrics.fps).toBeGreaterThanOrEqual(55); // 55+ FPS
      expect(animationMetrics.frameTime).toBeLessThan(18); // Under 18ms
      expect(animationMetrics.memoryUsage).toBeLessThan(200); // Under 200MB
    });
  });

  describe('Performance Targets Validation', () => {
    it('should have realistic performance targets', () => {
      // Validate that our targets are reasonable
      expect(performanceTargets.bundleSize.homepage).toBeGreaterThan(200000); // At least 200kB
      expect(performanceTargets.bundleSize.homepage).toBeLessThan(300000); // But under 300kB

      expect(performanceTargets.animationPerformance.minFps).toBeGreaterThanOrEqual(50);
      expect(performanceTargets.animationPerformance.maxFrameTime).toBeLessThanOrEqual(20);

      expect(performanceTargets.loadingPerformance.maxLcp).toBeLessThanOrEqual(2500);
      expect(performanceTargets.loadingPerformance.maxCls).toBeLessThanOrEqual(0.1);
    });
  });
});

// Additional integration tests for Phase 2 features
describe('Phase 2 Integration Tests', () => {
  it('should have working animation optimization system', () => {
    // Test that animation optimization classes exist and are importable
    expect(() => {
      require('@/lib/animation/performance-optimizer');
      require('@/lib/animation/gpu-optimizer');
      require('@/lib/animation/scroll-optimizer');
    }).not.toThrow();
  });

  it('should have working CSP nonce provider', () => {
    // Test that CSP nonce provider exists and is importable
    expect(() => {
      require('@/lib/csp/nonce-provider');
    }).not.toThrow();
  });

  it('should have optimized motion components', () => {
    // Test that optimized motion components exist and are importable
    expect(() => {
      require('@/components/motion/LightweightMotion');
      require('@/components/motion/LazyMotionComponents');
    }).not.toThrow();
  });
});
