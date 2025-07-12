/**
 * Image Optimization Pipeline
 *
 * Comprehensive image loading and optimization system for portfolio and content images
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

// Image optimization configuration
export interface ImageOptimizationConfig {
  quality: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png' | 'auto';
  sizes: string;
  priority: boolean;
  placeholder: 'blur' | 'empty';
  loading: 'lazy' | 'eager';
  blurDataURL?: string;
  unoptimized?: boolean;
}

// Image source configuration
export interface ImageSource {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  credit?: string;
  metadata?: ImageMetadata;
}

// Image metadata
export interface ImageMetadata {
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  location?: string;
  camera?: string;
  lens?: string;
  settings?: {
    aperture?: string;
    shutter?: string;
    iso?: string;
    focalLength?: string;
  };
  colorSpace?: string;
  orientation?: number;
  fileSize?: number;
  originalDimensions?: {
    width: number;
    height: number;
  };
}

// Responsive image breakpoints
export const IMAGE_BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
  '4xl': 2560,
} as const;

// Image quality presets
export const QUALITY_PRESETS = {
  low: 60,
  medium: 75,
  high: 85,
  max: 95,
} as const;

// Image format priorities
export const FORMAT_PRIORITIES = ['avif', 'webp', 'jpeg', 'png'] as const;

// Image optimization utilities
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private cache = new Map<string, string>();
  private loadingPromises = new Map<string, Promise<string>>();

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }

  // Generate optimized image URL
  generateOptimizedUrl(
    src: string,
    width: number,
    height?: number,
    config: Partial<ImageOptimizationConfig> = {}
  ): string {
    const { quality = QUALITY_PRESETS.high, format = 'auto', unoptimized = false } = config;

    // Return original URL if unoptimized
    if (unoptimized) return src;

    // Handle external URLs
    if (src.startsWith('http')) {
      return this.optimizeExternalImage(src, width, height, quality, format);
    }

    // Handle internal images with Next.js Image Optimization
    const params = new URLSearchParams();
    params.set('url', src);
    params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    if (format !== 'auto') params.set('f', format);

    return `/_next/image?${params.toString()}`;
  }

  // Optimize external images (using a service like Cloudinary or similar)
  private optimizeExternalImage(
    src: string,
    width: number,
    height?: number,
    quality: number = QUALITY_PRESETS.high,
    format = 'auto'
  ): string {
    // For external images, we can use services like Cloudinary, ImageKit, etc.
    // For now, return the original URL with basic optimization parameters
    const url = new URL(src);

    // Add optimization parameters if the service supports them
    if (url.hostname.includes('unsplash.com')) {
      url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('fm', format === 'auto' ? 'webp' : format);
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('crop', 'center');
    }

    return url.toString();
  }

  // Generate responsive image sizes
  generateSizes(breakpoints: Partial<typeof IMAGE_BREAKPOINTS> = IMAGE_BREAKPOINTS): string {
    const entries = Object.entries(breakpoints).sort(([, a], [, b]) => a - b);

    return entries
      .map(([, width], index) => {
        if (index === entries.length - 1) {
          return `${width}px`;
        }
        return `(max-width: ${width}px) ${width}px`;
      })
      .join(', ');
  }

  // Generate srcSet for responsive images
  generateSrcSet(
    src: string,
    widths: number[],
    config: Partial<ImageOptimizationConfig> = {}
  ): string {
    return widths
      .map(width => {
        const optimizedUrl = this.generateOptimizedUrl(src, width, undefined, config);
        return `${optimizedUrl} ${width}w`;
      })
      .join(', ');
  }

  // Preload critical images
  preloadImage(src: string, config: Partial<ImageOptimizationConfig> = {}): Promise<string> {
    const cacheKey = `${src}-${JSON.stringify(config)}`;

    // Return cached promise if exists
    const cachedPromise = this.loadingPromises.get(cacheKey);
    if (cachedPromise) {
      return cachedPromise;
    }

    // Create new loading promise
    const loadingPromise = new Promise<string>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.cache.set(cacheKey, src);
        resolve(src);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };

      // Set source with optimization
      img.src = this.generateOptimizedUrl(src, 1920, undefined, config);
    });

    this.loadingPromises.set(cacheKey, loadingPromise);
    return loadingPromise;
  }

  // Generate blur placeholder
  generateBlurPlaceholder(width = 10, height = 10): string {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      // Return a static placeholder for server-side or test environments
      return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback for environments where canvas context is not available
        return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
      }

      // Create a simple gradient blur effect
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(0.5, '#e5e7eb');
      gradient.addColorStop(1, '#d1d5db');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      return canvas.toDataURL('image/jpeg', 0.1);
    } catch {
      // Fallback for any canvas-related errors
      return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  // Get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Image loading hook
export function useImageOptimization(src: string, config: Partial<ImageOptimizationConfig> = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');

  const optimizer = useMemo(() => ImageOptimizer.getInstance(), []);

  const loadImage = useCallback(async () => {
    if (!src) return;

    try {
      setLoading(true);
      setError(null);

      const optimized = optimizer.generateOptimizedUrl(src, 1920, undefined, config);
      setOptimizedSrc(optimized);

      // Preload if priority is set
      if (config.priority) {
        await optimizer.preloadImage(src, config);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to optimize image'));
    } finally {
      setLoading(false);
    }
  }, [src, config, optimizer]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  return {
    src: optimizedSrc,
    loading,
    error,
    reload: loadImage,
  };
}

// Progressive image loading hook
export function useProgressiveImage(
  src: string,
  placeholderSrc?: string,
  config: Partial<ImageOptimizationConfig> = {}
) {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc ?? '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const optimizer = useMemo(() => ImageOptimizer.getInstance(), []);

  useEffect(() => {
    if (!src) return;

    let isCancelled = false;

    const loadImage = () => {
      try {
        setLoading(true);
        setError(null);

        // Generate optimized URL
        const optimizedSrc = optimizer.generateOptimizedUrl(src, 1920, undefined, config);

        // Load the image
        const img = new Image();

        img.onload = () => {
          if (!isCancelled) {
            setCurrentSrc(optimizedSrc);
            setLoading(false);
          }
        };

        img.onerror = () => {
          if (!isCancelled) {
            setError(new Error(`Failed to load image: ${src}`));
            setLoading(false);
          }
        };

        img.src = optimizedSrc;
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load image'));
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isCancelled = true;
    };
  }, [src, config, optimizer]);

  return {
    src: currentSrc,
    loading,
    error,
  };
}

// Image preloader hook
export function useImagePreloader(
  sources: string[],
  config: Partial<ImageOptimizationConfig> = {}
) {
  const [preloadedCount, setPreloadedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);

  const optimizer = useMemo(() => ImageOptimizer.getInstance(), []);

  const preloadImages = useCallback(async () => {
    if (sources.length === 0) return;

    setLoading(true);
    setPreloadedCount(0);
    setErrors([]);

    const preloadPromises = sources.map(async (src, index) => {
      try {
        await optimizer.preloadImage(src, config);
        setPreloadedCount(prev => prev + 1);
      } catch (error) {
        setErrors(prev => [
          ...prev,
          error instanceof Error ? error : new Error(`Failed to preload image ${index}`),
        ]);
      }
    });

    await Promise.allSettled(preloadPromises);
    setLoading(false);
  }, [sources, config, optimizer]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  return {
    preloadedCount,
    totalCount: sources.length,
    loading,
    errors,
    progress: sources.length > 0 ? preloadedCount / sources.length : 0,
    retry: preloadImages,
  };
}

// Image gallery optimization
export function useImageGallery(
  images: ImageSource[],
  config: Partial<ImageOptimizationConfig> = {}
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloadRange, setPreloadRange] = useState(3); // Preload 3 images ahead and behind

  // Get images to preload based on current index
  const imagesToPreload = useMemo(() => {
    const start = Math.max(0, currentIndex - preloadRange);
    const end = Math.min(images.length, currentIndex + preloadRange + 1);
    return images.slice(start, end).map(img => img.src);
  }, [images, currentIndex, preloadRange]);

  // Preload images around current index
  const { preloadedCount, loading } = useImagePreloader(imagesToPreload, config);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setCurrentIndex(index);
      }
    },
    [images.length]
  );

  return {
    currentImage: (currentIndex >= 0 && currentIndex < images.length) ? images[currentIndex] : null,
    currentIndex,
    totalImages: images.length,
    preloadedCount,
    loading,
    goToNext,
    goToPrevious,
    goToIndex,
    setPreloadRange,
  };
}

// Export singleton instance
export const imageOptimizer = ImageOptimizer.getInstance();
