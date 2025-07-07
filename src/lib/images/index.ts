/**
 * Image Loading Pipeline - Main Export
 *
 * Centralized exports for the image optimization and loading system
 */

// Import types for internal use
import { legacyContentManager, type LegacyImageContent } from '@/lib/content';

import { logger } from '../utils/logger';

import { imageOptimizer, QUALITY_PRESETS, type ImageOptimizationConfig } from './optimization';
import { imagePerformanceMonitor, ImagePerformanceUtils } from './performance';

// Core optimization exports
export {
  ImageOptimizer,
  imageOptimizer,
  useImageOptimization,
  useProgressiveImage,
  useImagePreloader,
  useImageGallery,
  IMAGE_BREAKPOINTS,
  QUALITY_PRESETS,
  FORMAT_PRIORITIES,
  type ImageOptimizationConfig,
  type ImageSource,
  type ImageMetadata,
} from './optimization';

// Performance monitoring exports
export {
  ImagePerformanceMonitor,
  ImageOptimizationAnalyzer,
  imagePerformanceMonitor,
  ImagePerformanceUtils,
  type ImagePerformanceMetrics,
  type ImageLoadingAnalytics,
} from './performance';

// Component exports
export {
  ProgressiveImage,
  PortfolioImage,
  ImageGallery,
  ResponsiveImage,
  HeroImage,
  ImageGrid,
  type OptimizedImageProps,
} from '../../components/images/OptimizedImage';

// Integration with content system

// Content-aware image optimization
export const ContentImageIntegration = {
  // Get optimized image from content system
  getOptimizedContentImage: (
    imageId: string,
    width = 1920,
    height?: number,
    config: Partial<ImageOptimizationConfig> = {}
  ): string | null => {
    const imageContent = legacyContentManager.get<LegacyImageContent>(imageId);
    if (!imageContent || imageContent.type !== 'image') return null;

    return imageOptimizer.generateOptimizedUrl(imageContent.src, width, height, config);
  },

  // Preload content images
  preloadContentImages: async (imageIds: string[]): Promise<void> => {
    const imagePromises = imageIds.map(async id => {
      const imageContent = legacyContentManager.get<LegacyImageContent>(id);
      if (imageContent && imageContent.type === 'image') {
        try {
          await imageOptimizer.preloadImage(imageContent.src);
        } catch (error) {
          logger.warn('Failed to preload content image', { id, error });
        }
      }
    });

    await Promise.allSettled(imagePromises);
  },

  // Get all portfolio images for preloading
  getPortfolioImages: (): LegacyImageContent[] => {
    return legacyContentManager
      .getByType<LegacyImageContent>('image')
      .filter(img => img.metadata?.category === 'portfolio');
  },

  // Get hero images for preloading
  getHeroImages: (): LegacyImageContent[] => {
    return legacyContentManager
      .getByType<LegacyImageContent>('image')
      .filter(img => img.metadata?.category === 'hero');
  },

  // Update image content with optimization metadata
  updateImageOptimization: (
    imageId: string,
    optimizationData: {
      optimizedSrc?: string;
      blurDataURL?: string;
      sizes?: string;
      srcSet?: string;
    }
  ): boolean => {
    const imageContent = legacyContentManager.get<LegacyImageContent>(imageId);
    if (!imageContent || imageContent.type !== 'image') return false;

    return legacyContentManager.update(imageId, {
      ...optimizationData,
      metadata: {
        ...imageContent.metadata,
        optimized: true,
        optimizedAt: new Date().toISOString(),
      },
    });
  },
};

// Image loading strategies
export const ImageLoadingStrategies = {
  // Critical images (above the fold)
  critical: {
    priority: true,
    loading: 'eager' as const,
    quality: QUALITY_PRESETS.max,
    placeholder: 'blur' as const,
  },

  // Portfolio images
  portfolio: {
    priority: false,
    loading: 'lazy' as const,
    quality: QUALITY_PRESETS.high,
    placeholder: 'blur' as const,
  },

  // Thumbnail images
  thumbnail: {
    priority: false,
    loading: 'lazy' as const,
    quality: QUALITY_PRESETS.medium,
    placeholder: 'empty' as const,
  },

  // Background images
  background: {
    priority: false,
    loading: 'lazy' as const,
    quality: QUALITY_PRESETS.high,
    placeholder: 'blur' as const,
  },

  // Gallery images
  gallery: {
    priority: false,
    loading: 'lazy' as const,
    quality: QUALITY_PRESETS.high,
    placeholder: 'blur' as const,
  },
};

// Image optimization presets for different use cases
export const ImageOptimizationPresets = {
  // Hero section images
  hero: {
    widths: [640, 768, 1024, 1280, 1536, 1920],
    sizes: '100vw',
    quality: QUALITY_PRESETS.max,
    format: 'webp' as const,
    priority: true,
  },

  // Portfolio grid images
  portfolioGrid: {
    widths: [300, 400, 500, 600],
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    quality: QUALITY_PRESETS.high,
    format: 'webp' as const,
    priority: false,
  },

  // Portfolio detail images
  portfolioDetail: {
    widths: [640, 768, 1024, 1280, 1536],
    sizes: '(max-width: 768px) 100vw, 80vw',
    quality: QUALITY_PRESETS.max,
    format: 'webp' as const,
    priority: false,
  },

  // Thumbnail images
  thumbnail: {
    widths: [80, 120, 160],
    sizes: '80px',
    quality: QUALITY_PRESETS.medium,
    format: 'webp' as const,
    priority: false,
  },

  // Team member photos
  team: {
    widths: [200, 300, 400],
    sizes: '(max-width: 768px) 200px, 300px',
    quality: QUALITY_PRESETS.high,
    format: 'webp' as const,
    priority: false,
  },
};

// Image performance optimization utilities
export const ImagePerformanceOptimization = {
  // Initialize image optimization for the app
  initialize: (): void => {
    // Preload critical images
    const heroImages = ContentImageIntegration.getHeroImages();
    if (heroImages.length > 0) {
      ContentImageIntegration.preloadContentImages(
        heroImages.slice(0, 2).map(img => img.id) // Preload first 2 hero images
      );
    }

    // Initialize performance monitoring
    if (process.env.NODE_ENV === 'development') {
      logger.info('Image optimization system initialized', {
        heroImagesFound: heroImages.length,
      });

      // Log performance recommendations after a delay
      setTimeout(() => {
        const recommendations = imagePerformanceMonitor.getRecommendations();

        if (recommendations.length > 0) {
          logger.info('Image Performance Recommendations', { recommendations });
        }
      }, 5000);
    }
  },

  // Optimize images for production
  optimizeForProduction: (): void => {
    const allImages = legacyContentManager.getByType<LegacyImageContent>('image');

    if (process.env.NODE_ENV === 'development') {
      logger.info('Optimizing images for production', { imageCount: allImages.length });
    }

    for (const image of allImages) {
      try {
        // Generate optimized variants
        const optimizedSrc = imageOptimizer.generateOptimizedUrl(image.src, 1920, undefined, {
          quality: QUALITY_PRESETS.high,
          format: 'webp',
        });

        // Generate blur placeholder
        const blurDataURL = imageOptimizer.generateBlurPlaceholder();

        // Generate responsive sizes
        const sizes = imageOptimizer.generateSizes();

        // Update content with optimization data
        ContentImageIntegration.updateImageOptimization(image.id, {
          optimizedSrc,
          blurDataURL,
          sizes,
        });
      } catch (error) {
        logger.error('Failed to optimize image', { imageId: image.id, error });
      }
    }

    if (process.env.NODE_ENV === 'development') {
      logger.info('Image optimization complete');
    }
  },

  // Get optimization report
  getOptimizationReport: () => {
    const analytics = imagePerformanceMonitor.getAnalytics();
    const recommendations = imagePerformanceMonitor.getRecommendations();

    return {
      analytics,
      recommendations,
      summary: {
        totalImages: analytics.totalImages,
        averageLoadTime: ImagePerformanceUtils.formatLoadTime(analytics.averageLoadTime),
        totalDataTransferred: ImagePerformanceUtils.formatFileSize(analytics.totalDataTransferred),
        cacheHitRate: `${(analytics.cacheHitRate * 100).toFixed(1)}%`,
        performanceGrade: ImagePerformanceUtils.getPerformanceGrade(
          analytics.averageLoadTime,
          analytics.totalDataTransferred / Math.max(analytics.totalImages, 1)
        ),
      },
    };
  },
};

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Initialize after a short delay to ensure everything is loaded
  setTimeout(() => {
    ImagePerformanceOptimization.initialize();
  }, 100);
}

// Development utilities
export const ImageDevUtils = {
  // Log image system status
  logStatus: () => {
    if (process.env.NODE_ENV !== 'development') return;

    const report = ImagePerformanceOptimization.getOptimizationReport();

    logger.info('Image System Status', {
      analytics: report.analytics,
      summary: report.summary,
      recommendations: report.recommendations,
    });
  },

  // Test image optimization
  testOptimization: (imageUrl: string) => {
    if (process.env.NODE_ENV !== 'development') return;

    logger.info('Testing optimization', { imageUrl });

    try {
      // Image analysis would go here
      const optimizedUrl = imageOptimizer.generateOptimizedUrl(imageUrl, 800);
      logger.info('Optimization test result', { optimizedUrl });
    } catch (error) {
      logger.error('Optimization test failed', { error });
    }
  },

  // Clear all caches
  clearCaches: () => {
    if (process.env.NODE_ENV !== 'development') return;

    imageOptimizer.clearCache();
    imagePerformanceMonitor.clearMetrics();
    logger.info('Image caches cleared');
  },
};
