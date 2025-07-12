/**
 * Enhanced Card Component - BlackWoods Creative Design System
 * Professional card variants with sophisticated styling and depth
 */

'use client';

import React from 'react';

import { motion, MotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';

// Card variant types
type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled' | 'glass' | 'gradient';

type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  motionProps?: MotionProps;
  style?: React.CSSProperties;
}

// Enhanced card variants with sophisticated styling
const cardVariants = {
  // Default - Clean and minimal
  default: {
    base: 'bg-background-primary border border-border-light shadow-sm',
    hover: 'hover:shadow-md hover:border-border-medium',
    interactive: 'cursor-pointer hover:-translate-y-1 hover:shadow-lg',
  },

  // Elevated - Prominent with depth
  elevated: {
    base: 'bg-background-primary border-0 shadow-lg',
    hover: 'hover:shadow-xl',
    interactive: 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl',
  },

  // Outlined - Subtle with emphasis on border
  outlined: {
    base: 'bg-transparent border-2 border-border-medium shadow-none',
    hover: 'hover:border-primary-500 hover:shadow-sm',
    interactive: 'cursor-pointer hover:-translate-y-0.5 hover:border-primary-600',
  },

  // Filled - Solid background
  filled: {
    base: 'bg-background-secondary border border-border-light shadow-sm',
    hover: 'hover:bg-background-tertiary hover:shadow-md',
    interactive: 'cursor-pointer hover:-translate-y-1 hover:shadow-lg',
  },

  // Glass - Modern glassmorphism effect
  glass: {
    base: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg',
    hover: 'hover:bg-white/15 hover:border-white/30',
    interactive: 'cursor-pointer hover:-translate-y-1 hover:bg-white/20',
  },

  // Gradient - Eye-catching gradient background
  gradient: {
    base: 'bg-gradient-to-br from-primary-500 to-secondary-500 border-0 shadow-lg text-white',
    hover: 'hover:from-primary-600 hover:to-secondary-600 hover:shadow-xl',
    interactive: 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl',
  },
};

// Card sizes with proper spacing
const cardSizes = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-xl',
  xl: 'p-10 rounded-2xl',
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 w-3/4 rounded bg-neutral-200" />
    <div className="space-y-2">
      <div className="h-3 rounded bg-neutral-200" />
      <div className="h-3 w-5/6 rounded bg-neutral-200" />
    </div>
    <div className="h-8 w-1/4 rounded bg-neutral-200" />
  </div>
);

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      interactive = false,
      loading = false,
      children,
      className,
      motionProps,
      ...props
    },
    ref
  ) => {
    const variantStyles = cardVariants[variant] ?? cardVariants.default;

    const baseClasses = cn(
      // Base card styles
      'relative overflow-hidden',
      'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',

      // Variant styles
      variantStyles.base,
      variantStyles.hover,
      {
        [variantStyles.interactive]: interactive,
      },

      // Size styles
      cardSizes[size] ?? cardSizes.md,

      className
    );

    const content = loading ? <LoadingSkeleton /> : children;

    if (motionProps || interactive) {
      return (
        <motion.div
          ref={ref}
          className={baseClasses}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          {...(interactive ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } } : {})}
          {...(motionProps as Record<string, unknown>)}
          onClick={props.onClick}
          id={props.id}
          style={props.style as Record<string, unknown>}
        >
          {content}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {content}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('mb-4 flex items-start justify-between', className)} {...props}>
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="truncate font-primary text-lg font-semibold text-text-primary">{title}</h3>
        )}
        {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
};

// Card Content component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('text-text-secondary', className)} {...props}>
      {children}
    </div>
  );
};

// Card Footer component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  justify = 'start',
  className,
  ...props
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={cn(
        'mt-6 flex items-center gap-3 border-t border-border-light pt-4',
        justifyClasses[justify] ?? justifyClasses.start,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Image component
interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | 'photo' | 'wide';
  objectFit?: 'cover' | 'contain' | 'fill';
}

export const CardImage: React.FC<CardImageProps> = ({
  aspectRatio = 'photo',
  objectFit = 'cover',
  className,
  alt,
  ...props
}) => {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    photo: 'aspect-[4/3]',
    wide: 'aspect-[21/9]',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
  };

  return (
    <div className={cn('mb-4 overflow-hidden rounded-lg',
      aspectRatioClasses[aspectRatio] ?? aspectRatioClasses.square)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={cn(
          'h-full w-full transition-transform duration-300 hover:scale-105',
          objectFitClasses[objectFit] ?? objectFitClasses.cover,
          className
        )}
        alt={alt}
        {...props}
      />
    </div>
  );
};

// Card Grid component for layouts
interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className,
}) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };

  return (
    <div className={cn('grid',
      columnClasses[columns] ?? columnClasses[1],
      gapClasses[gap] ?? gapClasses.md, className)}>{children}</div>
  );
};

// Feature Card component for showcasing features
interface FeatureCardProps extends Omit<CardProps, 'children'> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  action,
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
          {icon}
        </div>
      )}
      <CardHeader title={title} />
      <CardContent>
        <p>{description}</p>
      </CardContent>
      {action && <CardFooter>{action}</CardFooter>}
    </Card>
  );
};
