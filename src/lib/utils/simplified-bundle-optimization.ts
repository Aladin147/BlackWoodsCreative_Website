/**
 * Simplified Bundle Optimization
 *
 * A streamlined approach to bundle optimization that focuses on practical performance
 * improvements without over-engineering.
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

import { logger } from './logger';

// Simplified lazy loading options
export interface SimpleLazyOptions {
  fallback?: ComponentType;
  preload?: boolean;
  critical?: boolean; // Mark as critical for immediate loading
}

// Simple bundle metrics
export interface BundleMetrics {
  chunksLoaded: number;
  totalLoadTime: number;
  failedLoads: number;
}

// Simplified lazy component creator
export function createSimpleLazyComponent<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  options: SimpleLazyOptions = {}
): LazyExoticComponent<T> & { preload?: () => Promise<void> } {
  const { preload, critical } = options;

  // For critical components, don't use lazy loading
  if (critical) {
    // Return a wrapper that loads immediately
    const EagerComponent = lazy(importFn);

    // Preload immediately for critical components
    if (typeof window !== 'undefined') {
      importFn().catch(error => {
        logger.warn('Failed to preload critical component', { error });
      });
    }

    return EagerComponent;
  }

  const LazyComponent = lazy(importFn) as LazyExoticComponent<T> & {
    preload?: () => Promise<void>;
  };

  // Add simple preload method
  if (preload) {
    LazyComponent.preload = () =>
      importFn().then(() => {
        // Component preloaded successfully
      });

    // Auto-preload after initial page load
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        LazyComponent.preload?.();
      }, 2000); // Wait 2 seconds after page load
    }
  }

  return LazyComponent;
}

// Simplified bundle analyzer
class SimpleBundleAnalyzer {
  private metrics: BundleMetrics = {
    chunksLoaded: 0,
    totalLoadTime: 0,
    failedLoads: 0,
  };

  // Track chunk loading
  trackChunkLoad(loadTime: number, success = true) {
    if (success) {
      this.metrics.chunksLoaded++;
      this.metrics.totalLoadTime += loadTime;
    } else {
      this.metrics.failedLoads++;
    }

    // Log in development only
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Chunk load tracked', {
        loadTime: `${loadTime.toFixed(2)}ms`,
        success,
        totalChunks: this.metrics.chunksLoaded,
      });
    }
  }

  // Get simple metrics
  getMetrics(): BundleMetrics & { averageLoadTime: number } {
    return {
      ...this.metrics,
      averageLoadTime:
        this.metrics.chunksLoaded > 0 ? this.metrics.totalLoadTime / this.metrics.chunksLoaded : 0,
    };
  }

  // Get simple recommendations
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.getMetrics();

    if (metrics.averageLoadTime > 1000) {
      recommendations.push('Consider reducing chunk sizes - average load time is high');
    }

    if (metrics.failedLoads > 0) {
      recommendations.push(
        `${metrics.failedLoads} chunks failed to load - check network conditions`
      );
    }

    if (metrics.chunksLoaded > 20) {
      recommendations.push('High number of chunks loaded - consider bundling related components');
    }

    return recommendations;
  }

  // Reset metrics
  reset() {
    this.metrics = {
      chunksLoaded: 0,
      totalLoadTime: 0,
      failedLoads: 0,
    };
  }
}

// Global bundle analyzer instance
export const bundleAnalyzer = new SimpleBundleAnalyzer();

// Simplified component categories for better organization
export const ComponentCategories = {
  // Critical components that should load immediately
  CRITICAL: 'critical',

  // Above-the-fold components that should load quickly
  ABOVE_FOLD: 'above-fold',

  // Interactive components that can be lazy loaded
  INTERACTIVE: 'interactive',

  // Heavy components that should be lazy loaded with preloading
  HEAVY: 'heavy',

  // Development-only components
  DEVELOPMENT: 'development',
} as const;

// Simplified loading strategies
export const LoadingStrategies = {
  // Load immediately (for critical components)
  immediate: (importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>) =>
    createSimpleLazyComponent(importFn, { critical: true }),

  // Load on interaction (for interactive components)
  onInteraction: (importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>) =>
    createSimpleLazyComponent(importFn, { preload: false }),

  // Preload after initial page load (for heavy components)
  preload: (importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>) =>
    createSimpleLazyComponent(importFn, { preload: true }),

  // Development only (conditional loading)
  development: (importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>) => {
    if (process.env.NODE_ENV !== 'development') {
      // Return a no-op component in production
      return lazy(() => Promise.resolve({ default: () => null }));
    }
    return createSimpleLazyComponent(importFn, { preload: false });
  },
};

// Utility to track component loading performance
export function trackComponentLoad<T>(componentName: string, loadFn: () => Promise<T>): Promise<T> {
  const startTime = performance.now();

  return loadFn()
    .then(result => {
      const loadTime = performance.now() - startTime;
      bundleAnalyzer.trackChunkLoad(loadTime, true);

      if (process.env.NODE_ENV === 'development') {
        logger.debug('Component loaded successfully', {
          componentName,
          loadTime: `${loadTime.toFixed(2)}ms`,
        });
      }

      return result;
    })
    .catch(error => {
      const loadTime = performance.now() - startTime;
      bundleAnalyzer.trackChunkLoad(loadTime, false);

      logger.warn('Component failed to load', {
        componentName,
        loadTime: `${loadTime.toFixed(2)}ms`,
        error,
      });

      throw error;
    });
}

// Simple preloader for critical resources
export class SimplePreloader {
  private preloadedComponents = new Set<string>();

  // Preload a component
  async preloadComponent(
    name: string,
    importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>
  ): Promise<void> {
    if (this.preloadedComponents.has(name)) {
      return; // Already preloaded
    }

    try {
      await trackComponentLoad(name, importFn);
      this.preloadedComponents.add(name);

      if (process.env.NODE_ENV === 'development') {
        logger.debug('Component preloaded', { name });
      }
    } catch (error) {
      logger.warn('Failed to preload component', { name, error });
    }
  }

  // Preload multiple components
  async preloadComponents(
    components: Array<{
      name: string;
      importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
    }>
  ): Promise<void> {
    const preloadPromises = components.map(({ name, importFn }) =>
      this.preloadComponent(name, importFn)
    );

    await Promise.allSettled(preloadPromises);
  }

  // Check if component is preloaded
  isPreloaded(name: string): boolean {
    return this.preloadedComponents.has(name);
  }

  // Get preload status
  getStatus() {
    return {
      preloadedCount: this.preloadedComponents.size,
      preloadedComponents: Array.from(this.preloadedComponents),
    };
  }
}

// Global preloader instance
export const preloader = new SimplePreloader();

// Development utilities
export const BundleDevUtils = {
  // Log bundle metrics
  logMetrics: () => {
    if (process.env.NODE_ENV !== 'development') return;

    const metrics = bundleAnalyzer.getMetrics();
    const recommendations = bundleAnalyzer.getRecommendations();
    const preloadStatus = preloader.getStatus();

    logger.info('Bundle Performance Report', {
      metrics,
      recommendations,
      preloadStatus,
    });
  },

  // Reset all metrics
  reset: () => {
    bundleAnalyzer.reset();
    logger.info('Bundle metrics reset');
  },
};

// Auto-report metrics in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Report metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      BundleDevUtils.logMetrics();
    }, 5000); // Wait 5 seconds after page load
  });
}
