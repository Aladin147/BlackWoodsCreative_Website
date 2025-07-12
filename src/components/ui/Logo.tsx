'use client';

import { useState } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  onClick?: () => void;
  priority?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-auto',
  md: 'h-10 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto',
};

const logoUrls = {
  svg: '/assets/icons/BLKWDS Creative Logo_Inverted.svg',
  png: '/assets/icons/BLKWDS Creative Logo_inverted.png',
};

export function Logo({
  className = '',
  size = 'md',
  variant = 'full',
  onClick,
  priority = false,
}: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Fallback to text logo if images fail to load
  if (imageError) {
    return (
      <motion.div
        className={`flex items-center ${className}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClick}
          className="cursor-pointer rounded-md text-bw-text-primary transition-colors duration-300 hover:text-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50"
          aria-label="BlackWoods Creative - Go to homepage"
          title="BlackWoods Creative - Go to homepage"
        >
          <span
            className={`font-display text-bw-accent-gold ${
              size === 'sm'
                ? 'text-lg'
                : size === 'md'
                  ? 'text-xl'
                  : size === 'lg'
                    ? 'text-2xl'
                    : 'text-3xl'
            }`}
          >
            {variant === 'icon' ? 'BWC' : 'BlackWoods Creative'}
          </span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative flex items-center ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Loading state */}
      {isLoading && (
        <div
          className={`${
            sizeClasses[size] ?? sizeClasses.md
          } flex animate-pulse items-center justify-center rounded bg-bw-accent-gold/10`}
        >
          <div className="text-xs font-medium text-bw-accent-gold">BWC</div>
        </div>
      )}

      {/* Main logo image */}
      <button
        onClick={onClick}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} cursor-pointer rounded-md transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50`}
        aria-label="BlackWoods Creative - Go to homepage"
        title="BlackWoods Creative - Go to homepage"
        data-testid="logo-button"
      >
        <Image
          src={logoUrls.svg}
          alt="BlackWoods Creative"
          width={variant === 'icon' ? 40 : 200}
          height={variant === 'icon' ? 40 : 60}
          className={`${
            sizeClasses[size] ?? sizeClasses.md
          } object-contain`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          priority={priority}
          data-testid="logo-image-main"
          style={{
            filter: 'brightness(0) saturate(100%) invert(1)',
          }}
        />
      </button>

      {/* PNG fallback (hidden, loads in background) */}
      <Image
        src={logoUrls.png}
        alt=""
        width={variant === 'icon' ? 40 : 200}
        height={variant === 'icon' ? 40 : 60}
        className="hidden"
        onError={() => {
          // Fallback image error handling - image remains hidden
        }}
        priority={false}
        data-testid="logo-image-fallback"
      />
    </motion.div>
  );
}
