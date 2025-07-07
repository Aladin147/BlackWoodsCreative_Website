// Advanced performance optimization utilities
'use client';

import { logger } from './logger';

interface OptimizationConfig {
  enableResourceHints: boolean;
  enableCriticalResourcePreload: boolean;
  enableLazyLoading: boolean;
  enableServiceWorker: boolean;
  enableImageOptimization: boolean;
}

class PerformanceOptimizer {
  private config: OptimizationConfig;
  private preloadedResources: Set<string> = new Set();

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      enableResourceHints: true,
      enableCriticalResourcePreload: true,
      enableLazyLoading: true,
      enableServiceWorker: false, // Disabled by default for compatibility
      enableImageOptimization: true,
      ...config,
    };
  }

  // Preload critical resources
  preloadCriticalResources(resources: string[]) {
    if (!this.config.enableCriticalResourcePreload) return;

    resources.forEach(resource => {
      if (this.preloadedResources.has(resource)) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;

      // Determine resource type
      if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
        link.as = 'image';
      } else if (resource.match(/\.(woff|woff2|ttf|otf)$/)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }

      document.head.appendChild(link);
      this.preloadedResources.add(resource);

      logger.debug('Preloaded critical resource', { resource });
    });
  }

  // Add resource hints for better loading performance
  addResourceHints() {
    if (!this.config.enableResourceHints) return;

    // DNS prefetch for external domains
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'images.unsplash.com',
      'www.blackwoodscreative.com',
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect to critical external resources
    const preconnectDomains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    logger.debug('Added resource hints', { externalDomains, preconnectDomains });
  }

  // Optimize images with intersection observer
  optimizeImages() {
    if (!this.config.enableImageOptimization) return;

    const images = document.querySelectorAll('img[data-src]');

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.dataset.src;

              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);

                logger.debug('Lazy loaded image', { src });
              }
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01,
        }
      );

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        const htmlImg = img as HTMLImageElement;
        const src = htmlImg.dataset.src;
        if (src) {
          htmlImg.src = src;
          htmlImg.removeAttribute('data-src');
        }
      });
    }
  }

  // Optimize font loading
  optimizeFonts() {
    // Add font-display: swap to improve FCP
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
      @font-face {
        font-family: 'Urbanist';
        font-display: swap;
      }
      @font-face {
        font-family: 'JetBrains Mono';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    logger.debug('Optimized font loading with font-display: swap');
  }

  // Prefetch next page resources based on user behavior
  prefetchNextPageResources(href: string) {
    if (this.preloadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    this.preloadedResources.add(href);

    logger.debug('Prefetched next page resource', { href });
  }

  // Setup hover-based prefetching
  setupHoverPrefetch() {
    let prefetchTimeout: NodeJS.Timeout;

    document.addEventListener('mouseover', e => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (link?.href?.startsWith(window.location.origin)) {
        clearTimeout(prefetchTimeout);
        prefetchTimeout = setTimeout(() => {
          this.prefetchNextPageResources(link.href);
        }, 100); // Small delay to avoid excessive prefetching
      }
    });

    logger.debug('Setup hover-based prefetching');
  }

  // Monitor and optimize Core Web Vitals
  optimizeCoreWebVitals() {
    // Optimize LCP by preloading hero images
    const heroImages = document.querySelectorAll('img[data-hero="true"]');
    heroImages.forEach(img => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.src) {
        this.preloadCriticalResources([htmlImg.src]);
      }
    });

    // Optimize CLS by setting image dimensions
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.naturalWidth && htmlImg.naturalHeight) {
        htmlImg.width = htmlImg.naturalWidth;
        htmlImg.height = htmlImg.naturalHeight;
      }
    });

    // Optimize FID by deferring non-critical JavaScript
    this.deferNonCriticalJS();

    logger.debug('Applied Core Web Vitals optimizations');
  }

  // Defer non-critical JavaScript
  private deferNonCriticalJS() {
    const scripts = document.querySelectorAll('script[data-defer="true"]');
    scripts.forEach(script => {
      const htmlScript = script as HTMLScriptElement;
      htmlScript.defer = true;
    });
  }

  // Initialize all optimizations
  initialize() {
    if (typeof window === 'undefined') return;

    // Run optimizations after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.runOptimizations();
      });
    } else {
      this.runOptimizations();
    }
  }

  private runOptimizations() {
    this.addResourceHints();
    this.optimizeFonts();
    this.optimizeImages();
    this.setupHoverPrefetch();

    // Run Core Web Vitals optimization after a short delay
    setTimeout(() => {
      this.optimizeCoreWebVitals();
    }, 100);

    logger.info('Performance optimizations initialized');
  }
}

// Create singleton instance
export const performanceOptimizer = new PerformanceOptimizer();

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  performanceOptimizer.initialize();
}

// Export for manual control
export { PerformanceOptimizer };
