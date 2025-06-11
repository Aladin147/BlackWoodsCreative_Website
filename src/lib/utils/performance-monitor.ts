// Performance monitoring utilities for production optimization
'use client';

import React from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

interface BundleMetrics {
  totalSize: number;
  gzippedSize: number;
  loadTime: number;
  chunkCount: number;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private bundleMetrics: Partial<BundleMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.measureInitialMetrics();
    }
  }

  private initializeObservers() {
    // Observe Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input') {
            this.metrics.fid = (entry as PerformanceEntry & { processingStart: number; startTime: number }).processingStart - entry.startTime;
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'layout-shift' && !(entry as PerformanceEntry & { hadRecentInput: boolean }).hadRecentInput) {
            clsValue += (entry as PerformanceEntry & { value: number }).value;
          }
        });
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  private measureInitialMetrics() {
    // Measure FCP and TTFB
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }

      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
        this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }
    }
  }

  // Track bundle loading performance
  trackBundleLoad(chunkName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    console.log(`Bundle chunk "${chunkName}" loaded in ${loadTime.toFixed(2)}ms`);
    
    // Update bundle metrics
    this.bundleMetrics.loadTime = (this.bundleMetrics.loadTime || 0) + loadTime;
    this.bundleMetrics.chunkCount = (this.bundleMetrics.chunkCount || 0) + 1;
  }

  // Get current performance metrics
  getMetrics(): PerformanceMetrics & BundleMetrics {
    return {
      ...this.metrics,
      ...this.bundleMetrics,
    } as PerformanceMetrics & BundleMetrics;
  }

  // Check if metrics meet performance budgets
  checkPerformanceBudgets(): {
    passed: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    const metrics = this.getMetrics();

    // Performance budget thresholds
    const budgets = {
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1,  // 0.1
      fcp: 1800, // 1.8s
      ttfb: 600, // 600ms
    };

    Object.entries(budgets).forEach(([metric, threshold]) => {
      const value = metrics[metric as keyof typeof metrics];
      if (typeof value === 'number' && value > threshold) {
        violations.push(`${metric.toUpperCase()}: ${value.toFixed(2)} > ${threshold}`);
      }
    });

    return {
      passed: violations.length === 0,
      violations,
    };
  }

  // Report metrics to analytics (placeholder)
  reportMetrics() {
    const metrics = this.getMetrics();
    const budgetCheck = this.checkPerformanceBudgets();

    console.group('🚀 Performance Metrics Report');
    console.log('Core Web Vitals:', {
      LCP: `${metrics.lcp?.toFixed(2)}ms`,
      FID: `${metrics.fid?.toFixed(2)}ms`,
      CLS: metrics.cls?.toFixed(3),
      FCP: `${metrics.fcp?.toFixed(2)}ms`,
      TTFB: `${metrics.ttfb?.toFixed(2)}ms`,
    });
    console.log('Bundle Performance:', {
      'Total Load Time': `${metrics.loadTime?.toFixed(2)}ms`,
      'Chunks Loaded': metrics.chunkCount,
    });
    console.log('Budget Check:', budgetCheck.passed ? '✅ PASSED' : '❌ FAILED');
    if (!budgetCheck.passed) {
      console.warn('Budget Violations:', budgetCheck.violations);
    }
    console.groupEnd();

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics, Sentry, or custom analytics
      // analytics.track('performance_metrics', metrics);
    }
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

// Utility function to track component load times
export function trackComponentLoad(componentName: string) {
  const startTime = performance.now();
  
  return () => {
    const loadTime = performance.now() - startTime;
    console.log(`Component "${componentName}" rendered in ${loadTime.toFixed(2)}ms`);
    
    // Track in performance monitor
    const monitor = getPerformanceMonitor();
    monitor.trackBundleLoad(componentName, startTime);
  };
}

// Hook for React components to track render performance
export function usePerformanceTracking(componentName: string) {
  const trackEnd = React.useMemo(() =>
    typeof window !== 'undefined' ? trackComponentLoad(componentName) : () => {},
    [componentName]
  );

  // Track on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      trackEnd();
    }
  }, [trackEnd]);
}

// Export for use in _app.tsx or layout.tsx
export { PerformanceMonitor };
