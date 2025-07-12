'use client';

import React from 'react';

import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  quality?: number;
}

/**
 * OptimizedImage component that automatically serves WebP/AVIF formats
 * with PNG fallback for maximum browser compatibility and performance
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  fill = false,
  quality = 85,
}) => {
  // Generate optimized image paths
  const getOptimizedSrc = (format: 'webp' | 'avif') => {
    if (src.includes('/assets/icons/')) {
      // For icon images, use our optimized versions
      const filename = src.split('/').pop()?.replace('.png', `.${format}`);
      return `/assets/icons/optimized/${filename}`;
    }
    return src; // For other images, Next.js will handle optimization
  };

  // For icon images, use picture element with multiple formats
  if (src.includes('/assets/icons/') && src.endsWith('.png')) {
    return (
      <picture className={className}>
        <source srcSet={getOptimizedSrc('avif')} type="image/avif" />
        <source srcSet={getOptimizedSrc('webp')} type="image/webp" />
        <Image
          src={src}
          alt={alt}
          {...(width !== undefined && { width })}
          {...(height !== undefined && { height })}
          priority={priority ?? false}
          {...(sizes && { sizes })}
          fill={fill ?? false}
          quality={quality ?? 75}
          className={className}
        />
      </picture>
    );
  }

  // For other images, use Next.js Image component with automatic optimization
  return (
    <Image
      src={src}
      alt={alt}
      {...(width !== undefined && { width })}
      {...(height !== undefined && { height })}
      priority={priority ?? false}
      {...(sizes && { sizes })}
      fill={fill ?? false}
      quality={quality ?? 75}
      className={className}
    />
  );
};
