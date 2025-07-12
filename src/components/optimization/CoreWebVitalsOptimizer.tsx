'use client';

import { useEffect } from 'react';

import { logger } from '@/lib/utils/logger';

// Temporarily disabled for build optimization
// interface _VitalMetric {
//   name: string;
//   value: number;
//   rating: 'good' | 'needs-improvement' | 'poor';
//   delta: number;
// }

// // Core Web Vitals thresholds
// const _THRESHOLDS = {
//   LCP: { good: 2500, poor: 4000 },
//   INP: { good: 200, poor: 500 },
//   CLS: { good: 0.1, poor: 0.25 },
//   FCP: { good: 1800, poor: 3000 },
//   TTFB: { good: 800, poor: 1800 },
// };

// function _getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
//   const threshold = _THRESHOLDS[name as keyof typeof _THRESHOLDS];
//   if (!threshold) return 'good';

//   if (value <= threshold.good) return 'good';
//   if (value <= threshold.poor) return 'needs-improvement';
//   return 'poor';
// }

export function CoreWebVitalsOptimizer() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Temporarily disabled metric handler
    // const handleMetric = (metric: VitalMetric) => {
    //   const rating = getRating(metric.name, metric.value);
    //
    //   // Log metric for monitoring
    //   logger.info(`Core Web Vital: ${metric.name}`, {
    //     value: metric.value,
    //     rating,
    //     delta: metric.delta,
    //   });

    //   // Send to analytics if available
    //   if (typeof window !== 'undefined' && 'gtag' in window) {
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     (window as any).gtag('event', metric.name, {
    //       event_category: 'Web Vitals',
    //       value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //       event_label: rating,
    //       non_interaction: true,
    //     });
    //   }

    //   // Apply optimizations based on poor metrics
    //   if (rating === 'poor') {
    //     applyOptimizationsForMetric(metric.name, metric.value);
    //   }
    // };

    // Collect Core Web Vitals (temporarily disabled)
    // TODO: Re-enable when web-vitals SSR issue is resolved
    logger.info('Core Web Vitals monitoring temporarily disabled during build optimization');

    // Additional optimizations
    optimizeLCP();
    optimizeINP();
    optimizeCLS();
    optimizeFCP();
  }, []);

  return null; // This is a utility component with no UI
}

// LCP (Largest Contentful Paint) optimizations
function optimizeLCP() {
  // Preload hero images
  const heroImages = document.querySelectorAll('img[data-priority="high"], img[data-hero="true"]');
  heroImages.forEach(img => {
    const htmlImg = img as HTMLImageElement;
    if (htmlImg.src && !htmlImg.loading) {
      htmlImg.loading = 'eager';

      // Add preload link
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = htmlImg.src;
      document.head.appendChild(link);
    }
  });

  // Preload critical CSS
  const criticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-critical="true"]');
  criticalCSS.forEach(link => {
    const htmlLink = link as HTMLLinkElement;
    if (!htmlLink.hasAttribute('data-preloaded')) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'style';
      preloadLink.href = htmlLink.href;
      document.head.insertBefore(preloadLink, htmlLink);
      htmlLink.setAttribute('data-preloaded', 'true');
    }
  });

  logger.debug('Applied LCP optimizations');
}

// INP (Interaction to Next Paint) optimizations
function optimizeINP() {
  // Defer non-critical JavaScript
  const nonCriticalScripts = document.querySelectorAll('script[data-defer="true"]');
  nonCriticalScripts.forEach(script => {
    const htmlScript = script as HTMLScriptElement;
    if (!htmlScript.defer && !htmlScript.async) {
      htmlScript.defer = true;
    }
  });

  // Break up long tasks using scheduler API or setTimeout
  if ('scheduler' in window) {
    const windowWithScheduler = window as Window & {
      scheduler?: { postTask: (callback: () => void, options: { priority: string }) => void };
    };
    if (windowWithScheduler.scheduler?.postTask) {
      // Use modern scheduler API for better task scheduling
      const { scheduler } = windowWithScheduler;

      // Schedule non-critical tasks with low priority
      const nonCriticalTasks = document.querySelectorAll('[data-task="non-critical"]');
      nonCriticalTasks.forEach(element => {
        scheduler.postTask(
          () => {
            // Process non-critical task
            element.classList.add('processed');
          },
          { priority: 'background' }
        );
      });
    }
  }

  logger.debug('Applied INP optimizations');
}

// CLS (Cumulative Layout Shift) optimizations
function optimizeCLS() {
  // Set explicit dimensions for images without them
  const images = document.querySelectorAll(
    'img:not([width]):not([height]):not([style*="aspect-ratio"])'
  );
  images.forEach(img => {
    const htmlImg = img as HTMLImageElement;

    // Use intersection observer to set dimensions when image loads
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          if (image.naturalWidth && image.naturalHeight) {
            const aspectRatio = image.naturalWidth / image.naturalHeight;
            image.style.aspectRatio = aspectRatio.toString();
          }
          observer.unobserve(image);
        }
      });
    });

    observer.observe(htmlImg);
  });

  // Reserve space for dynamic content
  const dynamicContent = document.querySelectorAll('[data-dynamic="true"]');
  dynamicContent.forEach(element => {
    const htmlElement = element as HTMLElement;
    if (!htmlElement.style.minHeight) {
      htmlElement.style.minHeight = '100px'; // Reserve minimum space
    }
  });

  // Optimize font loading to prevent FOIT/FOUT
  const fontLinks = document.querySelectorAll('link[href*="fonts"]');
  fontLinks.forEach(link => {
    const htmlLink = link as HTMLLinkElement;
    if (!htmlLink.hasAttribute('data-optimized')) {
      htmlLink.setAttribute('data-optimized', 'true');

      // Add font-display: swap via CSS
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    }
  });

  logger.debug('Applied CLS optimizations');
}

// FCP (First Contentful Paint) optimizations
function optimizeFCP() {
  // Inline critical CSS for above-the-fold content
  const criticalCSS = document.querySelector('style[data-critical="true"]');
  if (!criticalCSS) {
    // Create critical CSS for above-the-fold content
    const style = document.createElement('style');
    style.setAttribute('data-critical', 'true');
    style.textContent = `
      /* Critical above-the-fold styles */
      .hero-section { display: block; }
      .header { display: flex; }
      .main-content { display: block; }
    `;
    document.head.insertBefore(style, document.head.firstChild);
  }

  // Preconnect to external font providers
  const fontProviders = ['fonts.googleapis.com', 'fonts.gstatic.com'];
  fontProviders.forEach(provider => {
    if (!document.querySelector(`link[href*="${provider}"][rel="preconnect"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${provider}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });

  logger.debug('Applied FCP optimizations');
}

// Temporarily disabled for build optimization
// // Apply specific optimizations based on poor metrics
// function _applyOptimizationsForMetric(metricName: string, value: number) {
//   switch (metricName) {
//     case 'LCP':
//       if (value > _THRESHOLDS.LCP.poor) {
//         // Aggressive LCP optimization
//         const images = document.querySelectorAll('img');
//         images.forEach(img => {
//           if (img.loading !== 'eager') {
//             img.loading = 'eager';
//           }
//         });
//         logger.warn('Applied aggressive LCP optimizations due to poor score', { value });
//       }
//       break;

//     case 'INP':
//       if (value > _THRESHOLDS.INP.poor) {
//         // Aggressive INP optimization
//         const scripts = document.querySelectorAll('script:not([async]):not([defer])');
//         scripts.forEach(script => {
//           const htmlScript = script as HTMLScriptElement;
//           if (!htmlScript.src.includes('critical')) {
//             htmlScript.defer = true;
//           }
//         });
//         logger.warn('Applied aggressive INP optimizations due to poor score', { value });
//       }
//       break;

//     case 'CLS':
//       if (value > _THRESHOLDS.CLS.poor) {
//         // Aggressive CLS optimization
//         const elements = document.querySelectorAll('*:not([style*="height"]):not([style*="min-height"])');
//         elements.forEach(element => {
//           const htmlElement = element as HTMLElement;
//           if (htmlElement.offsetHeight > 0) {
//             htmlElement.style.minHeight = `${htmlElement.offsetHeight}px`;
//           }
//         });
//         logger.warn('Applied aggressive CLS optimizations due to poor score', { value });
//       }
//       break;
//   }
// }
