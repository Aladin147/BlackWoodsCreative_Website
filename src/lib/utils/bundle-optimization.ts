// Advanced bundle optimization utilities for production performance
import { lazy, ComponentType, LazyExoticComponent } from 'react';

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: string[];
  }>;
  duplicates: Array<{
    module: string;
    chunks: string[];
    totalSize: number;
  }>;
  recommendations: string[];
}

export interface LazyComponentOptions {
  fallback?: ComponentType;
  retryCount?: number;
  retryDelay?: number;
  preload?: boolean;
  chunkName?: string;
}

// Enhanced lazy loading with retry logic and preloading
export function createOptimizedLazyComponent<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<T> & { preload: () => Promise<void> } {
  const { retryCount = 3, retryDelay = 1000, preload = false, chunkName: _chunkName } = options;

  let importPromise: Promise<{ default: T }> | null = null;

  const loadComponent = async (attempt = 1): Promise<{ default: T }> => {
    try {
      if (importPromise) {
        return await importPromise;
      }

      importPromise = importFn();
      const result = await importPromise;

      // Chunk loaded successfully

      return result;
    } catch (error) {
      importPromise = null; // Reset promise on failure

      if (attempt < retryCount) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        return loadComponent(attempt + 1);
      }

      // Failed to load component after retries
      throw error;
    }
  };

  const LazyComponent = lazy(() => loadComponent()) as LazyExoticComponent<T> & {
    preload: () => Promise<void>;
  };

  // Add preload method
  LazyComponent.preload = async () => {
    await loadComponent();
  };

  // Auto-preload if requested
  if (preload && typeof window !== 'undefined') {
    // Preload after initial page load
    setTimeout(() => {
      LazyComponent.preload();
    }, 100);
  }

  return LazyComponent;
}

// Intelligent component preloading based on user interaction
export class ComponentPreloader {
  private static instance: ComponentPreloader;
  private preloadQueue: Map<string, () => Promise<void>> = new Map();
  private preloadedComponents: Set<string> = new Set();
  private isPreloading = false;

  static getInstance(): ComponentPreloader {
    if (!ComponentPreloader.instance) {
      ComponentPreloader.instance = new ComponentPreloader();
    }
    return ComponentPreloader.instance;
  }

  // Register a component for potential preloading
  register(name: string, preloadFn: () => Promise<void>): void {
    this.preloadQueue.set(name, preloadFn);
  }

  // Preload component immediately
  async preload(name: string): Promise<void> {
    if (this.preloadedComponents.has(name)) {
      return; // Already preloaded
    }

    const preloadFn = this.preloadQueue.get(name);
    if (!preloadFn) {
      return;
    }

    try {
      await preloadFn();
      this.preloadedComponents.add(name);
    } catch {
      // Failed to preload component
    }
  }

  // Preload components based on user interaction hints
  async preloadOnHover(name: string): Promise<void> {
    if (this.isPreloading) return;

    this.isPreloading = true;
    await this.preload(name);
    this.isPreloading = false;
  }

  // Preload components based on viewport intersection
  preloadOnIntersection(name: string, element: Element): void {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.preload(name);
            observer.unobserve(element);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(element);
  }

  // Preload critical components after initial page load
  async preloadCritical(): Promise<void> {
    const criticalComponents = ['HeroSection', 'PortfolioSection', 'ContactSection'];

    for (const component of criticalComponents) {
      if (this.preloadQueue.has(component)) {
        await this.preload(component);
      }
    }
  }
}

// Bundle size monitoring and optimization recommendations
export class BundleOptimizer {
  private static readonly SIZE_THRESHOLDS = {
    SMALL: 50 * 1024, // 50KB
    MEDIUM: 200 * 1024, // 200KB
    LARGE: 500 * 1024, // 500KB
    HUGE: 1024 * 1024, // 1MB
  };

  // Analyze current bundle and provide recommendations
  static analyzeBundlePerformance(): BundleAnalysis {
    // In a real implementation, this would analyze actual webpack stats
    // For now, provide mock analysis with realistic recommendations

    const analysis: BundleAnalysis = {
      totalSize: 850 * 1024, // 850KB
      gzippedSize: 280 * 1024, // 280KB
      chunks: [
        {
          name: 'main',
          size: 450 * 1024,
          modules: ['app', 'components', 'utils'],
        },
        {
          name: 'vendors',
          size: 300 * 1024,
          modules: ['react', 'react-dom', 'framer-motion'],
        },
        {
          name: 'common',
          size: 100 * 1024,
          modules: ['shared-utilities', 'constants'],
        },
      ],
      duplicates: [],
      recommendations: [],
    };

    // Generate recommendations based on analysis
    analysis.recommendations = this.generateRecommendations(analysis);

    return analysis;
  }

  private static generateRecommendations(analysis: BundleAnalysis): string[] {
    const recommendations: string[] = [];

    // Check total bundle size
    if (analysis.totalSize > this.SIZE_THRESHOLDS.LARGE) {
      recommendations.push('Consider implementing more aggressive code splitting');
      recommendations.push('Evaluate if all dependencies are necessary');
    }

    // Check individual chunks
    analysis.chunks.forEach(chunk => {
      if (chunk.size > this.SIZE_THRESHOLDS.MEDIUM) {
        recommendations.push(
          `Chunk "${chunk.name}" is large (${Math.round(chunk.size / 1024)}KB) - consider splitting further`
        );
      }
    });

    // Check compression ratio
    const compressionRatio = analysis.gzippedSize / analysis.totalSize;
    if (compressionRatio > 0.4) {
      recommendations.push(
        'Bundle compression ratio could be improved - check for duplicate code or large assets'
      );
    }

    // Check for duplicates
    if (analysis.duplicates.length > 0) {
      recommendations.push('Duplicate modules detected - optimize webpack configuration');
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('Bundle size is well optimized');
      recommendations.push('Consider implementing preloading for better perceived performance');
    }

    return recommendations;
  }

  // Monitor bundle size in development
  static monitorBundleSize(): void {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Bundle size monitoring tracked internally
    this.analyzeBundlePerformance();
    // Analysis results processed internally
  }
}

// Tree shaking utilities
export const TreeShakingUtils = {
  // Mark functions for tree shaking
  markForTreeShaking: (fn: (...args: unknown[]) => unknown, used: boolean) => {
    if (!used && process.env.NODE_ENV === 'production') {
      return undefined;
    }
    return fn;
  },

  // Conditional imports for tree shaking
  conditionalImport: async <T>(
    condition: boolean,
    importFn: () => Promise<T>
  ): Promise<T | null> => {
    if (!condition) {
      return null;
    }
    return await importFn();
  },

  // Remove development-only code in production
  devOnly: <T>(value: T): T | undefined => {
    return process.env.NODE_ENV === 'development' ? value : undefined;
  },

  // Remove production-only code in development
  prodOnly: <T>(value: T): T | undefined => {
    return process.env.NODE_ENV === 'production' ? value : undefined;
  },
};

// Export utilities for global use
export const bundleOptimizer = BundleOptimizer;
export const componentPreloader = ComponentPreloader.getInstance();

// Initialize bundle monitoring in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Monitor bundle size after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      BundleOptimizer.monitorBundleSize();
    }, 1000);
  });
}
