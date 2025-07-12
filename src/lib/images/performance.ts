/**
 * Image Performance Monitoring and Optimization
 *
 * Tools for monitoring and optimizing image loading performance
 */

import { logger } from '../utils/logger';

// Element timing entry interface for performance monitoring
interface ElementTimingEntry extends PerformanceEntry {
  identifier?: string;
  renderTime?: number;
  loadTime?: number;
  intersectionRect?: DOMRectReadOnly;
  naturalWidth?: number;
  naturalHeight?: number;
}

// Image performance metrics
export interface ImagePerformanceMetrics {
  loadTime: number;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  compressionRatio: number;
  cacheHit: boolean;
  renderTime: number;
  totalTime: number;
}

// Image loading analytics
export interface ImageLoadingAnalytics {
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  averageLoadTime: number;
  totalDataTransferred: number;
  cacheHitRate: number;
  formatDistribution: Record<string, number>;
  sizeDistribution: {
    small: number; // < 100KB
    medium: number; // 100KB - 500KB
    large: number; // 500KB - 1MB
    xlarge: number; // > 1MB
  };
}

// Performance monitoring class
export class ImagePerformanceMonitor {
  private static instance: ImagePerformanceMonitor;
  private metrics: Map<string, ImagePerformanceMetrics> = new Map();
  private loadingTimes: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): ImagePerformanceMonitor {
    if (!ImagePerformanceMonitor.instance) {
      ImagePerformanceMonitor.instance = new ImagePerformanceMonitor();
    }
    return ImagePerformanceMonitor.instance;
  }

  constructor() {
    this.initializeObservers();
  }

  // Initialize performance observers
  private initializeObservers(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      // Resource timing observer for image loads
      const resourceObserver = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (resourceEntry.initiatorType === 'img' || resourceEntry.initiatorType === 'image') {
            this.recordImageLoad(resourceEntry);
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Element timing observer for image rendering
      const elementObserver = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          const elementEntry = entry as ElementTimingEntry;
          if (elementEntry.identifier?.includes('image')) {
            this.recordImageRender(elementEntry);
          }
        });
      });

      elementObserver.observe({ entryTypes: ['element'] });
      this.observers.push(elementObserver);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        logger.warn(
          'Failed to initialize image performance observers',
          error as Record<string, unknown>
        );
      }
    }
  }

  // Record image loading metrics
  private recordImageLoad(entry: PerformanceResourceTiming): void {
    const url = entry.name;
    const loadTime = entry.responseEnd - entry.requestStart;
    const fileSize = entry.transferSize || entry.encodedBodySize || 0;

    // Extract format from URL or content type
    const format = this.extractImageFormat(url);

    const metrics: ImagePerformanceMetrics = {
      loadTime,
      fileSize,
      dimensions: { width: 0, height: 0 }, // Will be updated when image loads
      format,
      compressionRatio: 0, // Will be calculated if original size is known
      cacheHit: entry.transferSize === 0 && entry.decodedBodySize > 0,
      renderTime: 0, // Will be updated by element timing
      totalTime: loadTime,
    };

    this.metrics.set(url, metrics);
  }

  // Record image rendering metrics
  private recordImageRender(entry: ElementTimingEntry): void {
    const { identifier } = entry;
    const renderTime = (entry.renderTime ?? 0) - (entry.loadTime ?? 0);

    // Find corresponding load metrics
    for (const [url, metrics] of Array.from(this.metrics.entries())) {
      if (identifier && (url.includes(identifier) || identifier.includes(url))) {
        metrics.renderTime = renderTime;
        metrics.totalTime = metrics.loadTime + renderTime;
        break;
      }
    }
  }

  // Extract image format from URL
  private extractImageFormat(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    const formatMap: Record<string, string> = {
      jpg: 'jpeg',
      jpeg: 'jpeg',
      png: 'png',
      webp: 'webp',
      avif: 'avif',
      gif: 'gif',
      svg: 'svg',
    };

    return formatMap[extension ?? '' as keyof typeof formatMap] ?? 'unknown';
  }

  // Start tracking image load
  startImageLoad(url: string): void {
    this.loadingTimes.set(url, performance.now());
  }

  // End tracking image load
  endImageLoad(url: string, success = true): void {
    const startTime = this.loadingTimes.get(url);
    if (!startTime) return;

    const loadTime = performance.now() - startTime;
    this.loadingTimes.delete(url);

    if (!success) {
      // Record failed load
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Image load failed', { url, loadTime: `${loadTime.toFixed(2)}ms` });
      }
    }
  }

  // Get metrics for specific image
  getImageMetrics(url: string): ImagePerformanceMetrics | null {
    return this.metrics.get(url) ?? null;
  }

  // Get all metrics
  getAllMetrics(): ImagePerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  // Get analytics summary
  getAnalytics(): ImageLoadingAnalytics {
    const allMetrics = this.getAllMetrics();
    const totalImages = allMetrics.length;

    if (totalImages === 0) {
      return {
        totalImages: 0,
        loadedImages: 0,
        failedImages: 0,
        averageLoadTime: 0,
        totalDataTransferred: 0,
        cacheHitRate: 0,
        formatDistribution: {},
        sizeDistribution: { small: 0, medium: 0, large: 0, xlarge: 0 },
      };
    }

    const loadedImages = allMetrics.filter(m => m.loadTime > 0).length;
    const failedImages = totalImages - loadedImages;
    const averageLoadTime = allMetrics.reduce((sum, m) => sum + m.loadTime, 0) / totalImages;
    const totalDataTransferred = allMetrics.reduce((sum, m) => sum + m.fileSize, 0);
    const cacheHits = allMetrics.filter(m => m.cacheHit).length;
    const cacheHitRate = cacheHits / totalImages;

    // Format distribution
    const formatDistribution: Record<string, number> = {};
    allMetrics.forEach(m => {
      // Safe object assignment with validation
      if (typeof m.format === 'string' && m.format.length > 0 && m.format.length < 20) {
        formatDistribution[m.format] = (formatDistribution[m.format] ?? 0) + 1;
      }
    });

    // Size distribution
    const sizeDistribution = {
      small: 0,
      medium: 0,
      large: 0,
      xlarge: 0,
    };

    allMetrics.forEach(m => {
      const sizeKB = m.fileSize / 1024;
      if (sizeKB < 100) sizeDistribution.small++;
      else if (sizeKB < 500) sizeDistribution.medium++;
      else if (sizeKB < 1024) sizeDistribution.large++;
      else sizeDistribution.xlarge++;
    });

    return {
      totalImages,
      loadedImages,
      failedImages,
      averageLoadTime,
      totalDataTransferred,
      cacheHitRate,
      formatDistribution,
      sizeDistribution,
    };
  }

  // Get performance recommendations
  getRecommendations(): string[] {
    const analytics = this.getAnalytics();
    const recommendations: string[] = [];

    // Check average load time
    if (analytics.averageLoadTime > 2000) {
      recommendations.push(
        'Average image load time is high (>2s). Consider optimizing image sizes and formats.'
      );
    }

    // Check cache hit rate
    if (analytics.cacheHitRate < 0.7) {
      recommendations.push(
        'Low cache hit rate (<70%). Consider implementing better caching strategies.'
      );
    }

    // Check format distribution
    const { formatDistribution } = analytics;
    const modernFormats = (formatDistribution.webp ?? 0) + (formatDistribution.avif ?? 0);
    const totalFormats = Object.values(formatDistribution).reduce((sum, count) => sum + count, 0);

    if (modernFormats / totalFormats < 0.5) {
      recommendations.push(
        'Consider using modern image formats (WebP, AVIF) for better compression.'
      );
    }

    // Check size distribution
    const { sizeDistribution } = analytics;
    if (sizeDistribution.xlarge > sizeDistribution.small) {
      recommendations.push(
        'Many large images detected. Consider implementing responsive images and lazy loading.'
      );
    }

    // Check failed loads
    if (analytics.failedImages > 0) {
      recommendations.push(
        `${analytics.failedImages} images failed to load. Check image URLs and availability.`
      );
    }

    return recommendations;
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear();
    this.loadingTimes.clear();
  }

  // Disconnect observers
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image optimization analyzer
export class ImageOptimizationAnalyzer {
  // Analyze image for optimization opportunities
  static async analyzeImage(url: string): Promise<{
    currentSize: number;
    optimizedSize: number;
    savings: number;
    recommendations: string[];
  }> {
    try {
      // Fetch image to analyze
      const response = await fetch(url);
      const blob = await response.blob();
      const currentSize = blob.size;

      // Create image element to get dimensions
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const { width, height } = img;
      const recommendations: string[] = [];

      // Calculate potential optimized size (rough estimation)
      let optimizedSize = currentSize;

      // Check if image is too large
      if (width > 1920 || height > 1080) {
        recommendations.push('Image dimensions are very large. Consider resizing for web use.');
        optimizedSize *= 0.6; // Estimate 40% reduction from resizing
      }

      // Check format optimization
      const format = blob.type;
      if (format === 'image/png' && !url.includes('logo') && !url.includes('icon')) {
        recommendations.push(
          'PNG format detected. Consider using WebP or AVIF for better compression.'
        );
        optimizedSize *= 0.7; // Estimate 30% reduction from format change
      }

      if (format === 'image/jpeg' && currentSize > 500000) {
        recommendations.push(
          'Large JPEG detected. Consider reducing quality or using modern formats.'
        );
        optimizedSize *= 0.8; // Estimate 20% reduction from quality optimization
      }

      // Check if image needs responsive variants
      if (currentSize > 200000) {
        recommendations.push(
          'Large image size. Consider implementing responsive images with multiple sizes.'
        );
      }

      const savings = currentSize - optimizedSize;

      URL.revokeObjectURL(img.src);

      return {
        currentSize,
        optimizedSize: Math.max(optimizedSize, currentSize * 0.3), // Minimum 30% of original
        savings: Math.max(savings, 0),
        recommendations,
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        logger.error('Failed to analyze image', error);
      }
      return {
        currentSize: 0,
        optimizedSize: 0,
        savings: 0,
        recommendations: ['Failed to analyze image. Check URL and accessibility.'],
      };
    }
  }

  // Batch analyze multiple images
  static async batchAnalyze(urls: string[]): Promise<{
    totalCurrentSize: number;
    totalOptimizedSize: number;
    totalSavings: number;
    recommendations: string[];
  }> {
    const analyses = await Promise.allSettled(
      urls.map(url => ImageOptimizationAnalyzer.analyzeImage(url))
    );

    let totalCurrentSize = 0;
    let totalOptimizedSize = 0;
    const allRecommendations: string[] = [];

    analyses.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        totalCurrentSize += result.value.currentSize;
        totalOptimizedSize += result.value.optimizedSize;
        allRecommendations.push(...result.value.recommendations);
      } else {
        if (process.env.NODE_ENV === 'development') {
          // Safe array access with bounds checking
          const url = (index >= 0 && index < urls.length) ? urls[index] : 'unknown';
          logger.error('Failed to analyze image', { url, error: result.reason });
        }
      }
    });

    // Deduplicate recommendations
    const uniqueRecommendations = Array.from(new Set(allRecommendations));

    return {
      totalCurrentSize,
      totalOptimizedSize,
      totalSavings: totalCurrentSize - totalOptimizedSize,
      recommendations: uniqueRecommendations,
    };
  }
}

// Export singleton instance
export const imagePerformanceMonitor = ImagePerformanceMonitor.getInstance();

// Utility functions
export const ImagePerformanceUtils = {
  // Format file size for display
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i] ?? 'B'}`;
  },

  // Format load time for display
  formatLoadTime: (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  },

  // Calculate compression ratio
  calculateCompressionRatio: (originalSize: number, compressedSize: number): number => {
    if (originalSize === 0) return 0;
    return ((originalSize - compressedSize) / originalSize) * 100;
  },

  // Get performance grade
  getPerformanceGrade: (loadTime: number, fileSize: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
    let score = 100;

    // Deduct points for slow load time
    if (loadTime > 3000) score -= 40;
    else if (loadTime > 2000) score -= 25;
    else if (loadTime > 1000) score -= 10;

    // Deduct points for large file size
    const sizeKB = fileSize / 1024;
    if (sizeKB > 1000) score -= 30;
    else if (sizeKB > 500) score -= 20;
    else if (sizeKB > 200) score -= 10;

    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  },
};
