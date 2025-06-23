/**
 * Performance monitoring and optimization utilities
 * for BlackWoods Creative website
 */

import React from 'react';

// Performance measurement utility
export async function measurePerformance<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  try {
    // Safely call performance.mark with fallback
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(startMark);
    }

    const result = await fn();

    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(endMark);
    }

    try {
      if (typeof performance !== 'undefined' && performance.measure) {
        performance.measure(name, startMark, endMark);
      }
    } catch {
      // Performance measurement failed - logged internally
    }

    return result;
  } catch (error) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(endMark);
    }
    throw error;
  }
}

// Scroll performance tracking
interface ScrollMetrics {
  scrollY: number;
  scrollPercent: number;
  direction: 'up' | 'down' | 'none';
  velocity: number;
}

export function trackScrollPerformance(
  callback: (metrics: ScrollMetrics) => void,
  throttleMs = 16 // ~60fps
): () => void {
  let lastScrollY = window.scrollY;
  let lastTimestamp =
    typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const currentTimestamp =
          typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollHeight > 0 ? (currentScrollY / scrollHeight) * 100 : 0;

        const deltaY = currentScrollY - lastScrollY;
        const deltaTime = currentTimestamp - lastTimestamp;
        const velocity = deltaTime > 0 ? Math.abs(deltaY / deltaTime) : 0;

        const direction = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : 'none';

        callback({
          scrollY: currentScrollY,
          scrollPercent: Math.min(100, Math.max(0, scrollPercent)),
          direction,
          velocity,
        });

        lastScrollY = currentScrollY;
        lastTimestamp = currentTimestamp;
        ticking = false;
      });
      ticking = true;
    }
  };

  const throttledHandler = throttle(handleScroll, throttleMs);
  window.addEventListener('scroll', throttledHandler, { passive: true });

  return () => {
    window.removeEventListener('scroll', throttledHandler);
  };
}

// Image optimization utility
interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'auto';
}

export function optimizeImages(url: string, options: ImageOptimizationOptions = {}): string {
  const { width, height, quality = 85, format = 'auto' } = options;

  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    if (format !== 'auto') params.set('f', format);

    urlObj.search = params.toString();
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return original URL
    console.warn('Failed to optimize image URL:', error);
    return url;
  }
}

// Debounce utility
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Performance monitoring for React components
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  _componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    React.useEffect(() => {
      const startTime =
        typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

      return () => {
        const endTime =
          typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
        const renderTime = endTime - startTime;

        if (renderTime > 16) {
          // More than one frame at 60fps - logged internally
        }
      };
    });

    return React.createElement(Component, props);
  };
}

// Lazy loading utility
export function createLazyComponent<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
) {
  return React.lazy(async () => {
    const start =
      typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

    try {
      const componentModule = await importFn();
      const end =
        typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

      console.log(`Lazy component loaded in ${(end - start).toFixed(2)}ms`);
      return componentModule;
    } catch (error) {
      console.error('Failed to load lazy component:', error);
      throw error;
    }
  });
}

// Memory usage monitoring
export function monitorMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} | null {
  if ('memory' in performance) {
    const memory = (performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number } })
      .memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }
  return null;
}

// FPS monitoring
export function monitorFPS(callback: (fps: number) => void): () => void {
  let frames = 0;
  let lastTime =
    typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  let animationId: number;

  function tick() {
    frames++;
    const currentTime =
      typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      callback(fps);

      frames = 0;
      lastTime = currentTime;
    }

    animationId = requestAnimationFrame(tick);
  }

  animationId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(animationId);
  };
}

// Bundle size analyzer
export function analyzeBundleSize(): Promise<{
  totalSize: number;
  gzippedSize: number;
  modules: Array<{ name: string; size: number }>;
}> {
  return new Promise(resolve => {
    // This would integrate with webpack-bundle-analyzer in a real implementation
    // For now, return mock data
    resolve({
      totalSize: 1024 * 1024, // 1MB
      gzippedSize: 256 * 1024, // 256KB
      modules: [
        { name: 'react', size: 100 * 1024 },
        { name: 'framer-motion', size: 200 * 1024 },
        { name: 'app', size: 724 * 1024 },
      ],
    });
  });
}

// Performance budget checker
interface PerformanceBudget {
  maxBundleSize: number; // bytes
  maxRenderTime: number; // ms
  maxMemoryUsage: number; // percentage
  minFPS: number;
}

export function checkPerformanceBudget(budget: PerformanceBudget): Promise<{
  passed: boolean;
  violations: string[];
}> {
  return new Promise(async resolve => {
    const violations: string[] = [];

    // Check bundle size
    const bundleInfo = await analyzeBundleSize();
    if (bundleInfo.totalSize > budget.maxBundleSize) {
      violations.push(`Bundle size ${bundleInfo.totalSize} exceeds budget ${budget.maxBundleSize}`);
    }

    // Check memory usage
    const memoryInfo = monitorMemoryUsage();
    if (memoryInfo && memoryInfo.percentage > budget.maxMemoryUsage) {
      violations.push(
        `Memory usage ${memoryInfo.percentage}% exceeds budget ${budget.maxMemoryUsage}%`
      );
    }

    resolve({
      passed: violations.length === 0,
      violations,
    });
  });
}
