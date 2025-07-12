/**
 * Simplified Performance Monitor
 *
 * A streamlined approach to performance monitoring that focuses on essential
 * metrics without over-engineering.
 */

import * as React from 'react';

import { logger } from './logger';

// Essential performance metrics
export interface SimpleMetrics {
  // Core Web Vitals (the only metrics that really matter)
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift

  // Basic loading metrics
  loadTime: number;
  domReady: number;
}

// Simple performance thresholds (Google's recommendations)
const PERFORMANCE_THRESHOLDS = {
  lcp: 2500, // Good: < 2.5s
  fid: 100, // Good: < 100ms
  cls: 0.1, // Good: < 0.1
  loadTime: 3000, // Good: < 3s
} as const;

class SimplePerformanceMonitor {
  private metrics: Partial<SimpleMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  // Initialize monitoring (only in browser)
  initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    this.isInitialized = true;
    this.setupBasicMetrics();
    this.setupCoreWebVitals();
  }

  // Setup basic timing metrics
  private setupBasicMetrics(): void {
    // Wait for page load
    if (document.readyState === 'complete') {
      this.collectBasicMetrics();
    } else {
      window.addEventListener('load', () => this.collectBasicMetrics());
    }
  }

  // Collect basic performance metrics
  private collectBasicMetrics(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (navigation) {
      this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.domReady = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    }
  }

  // Setup Core Web Vitals monitoring
  private setupCoreWebVitals(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
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
            const fidEntry = entry as PerformanceEntry & {
              processingStart: number;
              startTime: number;
            };
            this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
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
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as PerformanceEntry & {
              value: number;
              hadRecentInput: boolean;
            };
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
        });

        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      // Performance observers not supported or failed
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Performance observers setup failed', { error });
      }
    }
  }

  // Get current metrics
  getMetrics(): SimpleMetrics {
    return {
      lcp: this.metrics.lcp ?? 0,
      fid: this.metrics.fid ?? 0,
      cls: this.metrics.cls ?? 0,
      loadTime: this.metrics.loadTime ?? 0,
      domReady: this.metrics.domReady ?? 0,
    };
  }

  // Check if performance is good
  getPerformanceScore(): { score: number; issues: string[] } {
    const metrics = this.getMetrics();
    const issues: string[] = [];
    let score = 100;

    // Check LCP
    if (metrics.lcp > PERFORMANCE_THRESHOLDS.lcp) {
      issues.push(`LCP is slow (${(metrics.lcp / 1000).toFixed(1)}s)`);
      score -= 25;
    }

    // Check FID
    if (metrics.fid > PERFORMANCE_THRESHOLDS.fid) {
      issues.push(`FID is slow (${metrics.fid.toFixed(0)}ms)`);
      score -= 25;
    }

    // Check CLS
    if (metrics.cls > PERFORMANCE_THRESHOLDS.cls) {
      issues.push(`CLS is high (${metrics.cls.toFixed(3)})`);
      score -= 25;
    }

    // Check load time
    if (metrics.loadTime > PERFORMANCE_THRESHOLDS.loadTime) {
      issues.push(`Load time is slow (${(metrics.loadTime / 1000).toFixed(1)}s)`);
      score -= 25;
    }

    return {
      score: Math.max(0, score),
      issues,
    };
  }

  // Report metrics (simplified)
  reportMetrics(): void {
    const metrics = this.getMetrics();
    const performance = this.getPerformanceScore();

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      logger.info('Performance Report', {
        metrics: {
          lcp: `${(metrics.lcp / 1000).toFixed(1)}s`,
          fid: `${metrics.fid.toFixed(0)}ms`,
          cls: metrics.cls.toFixed(3),
          loadTime: `${(metrics.loadTime / 1000).toFixed(1)}s`,
        },
        score: `${performance.score}/100`,
        issues: performance.issues.length > 0 ? performance.issues : 'None',
      });
    }

    // In production, send to analytics if needed
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Send to Google Analytics if available
      if (window.gtag) {
        window.gtag('event', 'performance_metrics', {
          lcp: Math.round(metrics.lcp),
          fid: Math.round(metrics.fid),
          cls: Math.round(metrics.cls * 1000) / 1000,
          load_time: Math.round(metrics.loadTime),
          performance_score: performance.score,
        });
      }
    }
  }

  // Cleanup
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

// Global instance
let performanceMonitor: SimplePerformanceMonitor | null = null;

// Get or create performance monitor
export function getSimplePerformanceMonitor(): SimplePerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new SimplePerformanceMonitor();

    // Auto-initialize in browser
    if (typeof window !== 'undefined') {
      performanceMonitor.initialize();
    }
  }

  return performanceMonitor;
}

// Simple performance tracking hook for React components
export function useSimplePerformanceTracking(componentName: string): void {
  const startTime = React.useMemo(() => {
    return typeof window !== 'undefined' ? performance.now() : 0;
  }, []);

  // Track component mount time
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const mountTime = performance.now() - startTime;

    // Only log slow components in development
    if (process.env.NODE_ENV === 'development' && mountTime > 100) {
      logger.debug('Slow component mount', {
        component: componentName,
        mountTime: `${mountTime.toFixed(1)}ms`,
      });
    }
  }, [componentName, startTime]);
}

// Utility to track critical user interactions
export function trackUserInteraction(action: string): (() => void) | void {
  if (typeof window === 'undefined') return;

  const startTime = performance.now();

  // Return a function to mark the end of the interaction
  return () => {
    const duration = performance.now() - startTime;

    // Log slow interactions in development
    if (process.env.NODE_ENV === 'development' && duration > 50) {
      logger.debug('Slow user interaction', {
        action,
        duration: `${duration.toFixed(1)}ms`,
      });
    }

    // Track in production analytics
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', 'user_interaction', {
        action,
        duration: Math.round(duration),
      });
    }
  };
}

// Auto-report metrics after page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Wait a bit for metrics to stabilize
    setTimeout(() => {
      const monitor = getSimplePerformanceMonitor();
      monitor.reportMetrics();
    }, 3000);
  });
}

// Type declarations
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
