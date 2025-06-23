// Performance monitoring utilities for production optimization
'use client';

import { useMemo, useEffect } from 'react';

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
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // FID Observer
      const fidObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'first-input') {
            this.metrics.fid =
              (entry as PerformanceEntry & { processingStart: number; startTime: number })
                .processingStart - entry.startTime;
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // CLS Observer
      const clsObserver = new PerformanceObserver(list => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (
            entry.entryType === 'layout-shift' &&
            !(entry as PerformanceEntry & { hadRecentInput: boolean }).hadRecentInput
          ) {
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
  trackBundleLoad(_chunkName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    // Bundle chunk loading tracked internally

    // Update bundle metrics
    this.bundleMetrics.loadTime = (this.bundleMetrics.loadTime ?? 0) + loadTime;
    this.bundleMetrics.chunkCount = (this.bundleMetrics.chunkCount ?? 0) + 1;
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
      fid: 100, // 100ms
      cls: 0.1, // 0.1
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
    this.getMetrics();
    this.checkPerformanceBudgets();

    // Performance metrics reported internally
    // Core Web Vitals and Bundle Performance tracked

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics, Sentry, or custom analytics
      // analytics.track('performance_metrics', _metrics);
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
  performanceMonitor ??= new PerformanceMonitor();
  return performanceMonitor;
}

// Utility function to track component load times
export function trackComponentLoad(componentName: string) {
  const startTime = performance.now();

  return () => {
    const loadTime = performance.now() - startTime;
    // Component render time tracked internally
    void loadTime; // Explicitly mark as intentionally unused

    // Track in performance monitor
    const monitor = getPerformanceMonitor();
    monitor.trackBundleLoad(componentName, startTime);
  };
}

// Hook for React components to track render performance
export function usePerformanceTracking(componentName: string) {
  const trackEnd = useMemo(
    () => (typeof window !== 'undefined' ? trackComponentLoad(componentName) : () => {
      // Server-side rendering - no performance tracking needed
    }),
    [componentName]
  );

  // Track on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      trackEnd();
    }
  }, [trackEnd]);
}

// Export for use in _app.tsx or layout.tsx
export { PerformanceMonitor };
