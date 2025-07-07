/**
 * Optimized Image Components
 *
 * High-performance image components with optimization, lazy loading, and progressive enhancement
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image, { ImageProps } from 'next/image';
import { useState, useEffect, forwardRef, ReactNode } from 'react';

import {
  useImageGallery,
  ImageOptimizationConfig,
  ImageSource,
  imageOptimizer,
  IMAGE_BREAKPOINTS,
  QUALITY_PRESETS,
} from '@/lib/images/optimization';

// Base optimized image props
export interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  showCaption?: boolean;
  showCredit?: boolean;
  optimization?: Partial<ImageOptimizationConfig>;
  fallback?: ReactNode;
  onLoad?: () => void;
  className?: string;
  containerClassName?: string;
}

// Progressive image component
export const ProgressiveImage = forwardRef<HTMLDivElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      caption,
      credit,
      showCaption = false,
      showCredit = false,
      optimization = {},
      fallback,
      onLoad,

      className = '',
      containerClassName = '',
      width,
      height,
      priority = false,
      sizes,
      ...props
    },
    ref
  ) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Generate blur placeholder
    const blurDataURL =
      optimization.placeholder === 'blur' ? imageOptimizer.generateBlurPlaceholder() : undefined;

    // Generate optimized sizes
    const optimizedSizes = sizes ?? imageOptimizer.generateSizes();

    const handleLoad = () => {
      setImageLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setImageError(true);
    };

    if (imageError && fallback) {
      return fallback;
    }

    return (
      <div ref={ref} className={`relative overflow-hidden ${containerClassName}`}>
        {/* Main image */}
        <div className={`relative ${className}`}>
          <Image
            {...props}
            src={src}
            alt={alt}
            {...(width !== undefined && { width })}
            {...(height !== undefined && { height })}
            priority={priority ?? false}
            {...(optimizedSizes && { sizes: optimizedSizes })}
            quality={optimization.quality ?? QUALITY_PRESETS.high}
            placeholder={optimization.placeholder ?? 'blur'}
            {...(blurDataURL && { blurDataURL })}
            className={`transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
          />

          {/* Loading overlay */}
          <AnimatePresence>
            {!imageLoaded && !imageError && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center bg-gray-200"
              >
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          {imageError && !fallback && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <div className="mb-2 text-2xl">📷</div>
                <div className="text-sm">Image not available</div>
              </div>
            </div>
          )}
        </div>

        {/* Caption and credit */}
        {(showCaption && caption) || (showCredit && credit) ? (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            {showCaption && caption && <p className="mb-1 text-sm text-white">{caption}</p>}
            {showCredit && credit && <p className="text-xs text-white/80">© {credit}</p>}
          </div>
        ) : null}
      </div>
    );
  }
);

ProgressiveImage.displayName = 'ProgressiveImage';

// Portfolio image component with hover effects
export function PortfolioImage({
  src,
  alt,
  caption,
  credit,
  className = '',
  containerClassName = '',
  showOverlay = true,
  overlayContent,
  onClick,
  ...props
}: OptimizedImageProps & {
  showOverlay?: boolean;
  overlayContent?: ReactNode;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`group relative cursor-pointer ${containerClassName}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <ProgressiveImage
        src={src}
        alt={alt}
        {...(caption && { caption })}
        {...(credit && { credit })}
        className={`h-full w-full object-cover ${className}`}
        optimization={{ quality: QUALITY_PRESETS.high }}
        {...props}
      />

      {/* Hover overlay */}
      {showOverlay && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              {overlayContent ?? (
                <div className="text-center text-white">
                  <div className="mb-2 text-2xl">👁️</div>
                  <div className="text-sm">View Details</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

// Image gallery component
export function ImageGallery({
  images,
  className = '',
  showThumbnails = true,
  showNavigation = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  optimization = {},
}: {
  images: ImageSource[];
  className?: string;
  showThumbnails?: boolean;
  showNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  optimization?: Partial<ImageOptimizationConfig>;
}) {
  const { currentImage, currentIndex, totalImages, goToNext, goToPrevious, goToIndex } =
    useImageGallery(images, optimization);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext]);

  if (!currentImage) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Main image */}
      <div className="relative aspect-video">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <ProgressiveImage
              src={currentImage.src}
              alt={currentImage.alt}
              {...(currentImage.caption && { caption: currentImage.caption })}
              {...(currentImage.credit && { credit: currentImage.credit })}
              showCaption
              showCredit
              className="h-full w-full object-cover"
              optimization={optimization}
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {showNavigation && totalImages > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
          {currentIndex + 1} / {totalImages}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && totalImages > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                index === currentIndex
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <ProgressiveImage
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                optimization={{ quality: QUALITY_PRESETS.medium }}
                width={80}
                height={80}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Responsive image component
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = 'aspect-video',
  breakpoints = IMAGE_BREAKPOINTS,
  className = '',
  ...props
}: OptimizedImageProps & {
  aspectRatio?: string;
  breakpoints?: Partial<typeof IMAGE_BREAKPOINTS>;
}) {
  const sizes = imageOptimizer.generateSizes(breakpoints);

  return (
    <div className={`relative ${aspectRatio} ${className}`}>
      <ProgressiveImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        optimization={{ quality: QUALITY_PRESETS.high }}
        {...props}
      />
    </div>
  );
}

// Hero image component with parallax effect
export function HeroImage({
  src,
  alt,
  overlayContent,
  parallaxStrength = 0.5,
  className = '',
  ...props
}: OptimizedImageProps & {
  overlayContent?: ReactNode;
  parallaxStrength?: number;
}) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative h-screen overflow-hidden ${className}`}>
      {/* Parallax image */}
      <motion.div
        style={{
          y: scrollY * parallaxStrength,
        }}
        className="absolute inset-0 scale-110"
      >
        <ProgressiveImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
          optimization={{ quality: QUALITY_PRESETS.max }}
          {...props}
        />
      </motion.div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Content overlay */}
      {overlayContent && (
        <div className="absolute inset-0 flex items-center justify-center">{overlayContent}</div>
      )}
    </div>
  );
}

// Lazy image grid component
export function ImageGrid({
  images,
  columns = 3,
  gap = 4,
  className = '',
  onImageClick,
}: {
  images: ImageSource[];
  columns?: number;
  gap?: number;
  className?: string;
  onImageClick?: (image: ImageSource, index: number) => void;
}) {
  return (
    <div
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {images.map((image, index) => (
        <PortfolioImage
          key={index}
          src={image.src}
          alt={image.alt}
          {...(image.caption && { caption: image.caption })}
          {...(image.credit && { credit: image.credit })}
          className="aspect-square"
          onClick={() => onImageClick?.(image, index)}
          optimization={{ quality: QUALITY_PRESETS.medium }}
        />
      ))}
    </div>
  );
}
