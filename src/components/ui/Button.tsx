/**
 * Enhanced Button Component - BlackWoods Creative Design System
 * Professional button variants with sophisticated styling and animations
 */

'use client';

import React from 'react';

import { motion, MotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';

// Button variant types
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'link';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
  elevated?: boolean;
  children: React.ReactNode;
  asChild?: boolean;
  motionProps?: MotionProps;
  style?: React.CSSProperties;
}

// Enhanced button variants with sophisticated styling
const buttonVariants = {
  // Primary - Main brand actions
  primary: {
    base: 'bg-primary-600 text-white border-primary-600 shadow-sm',
    hover: 'hover:bg-primary-700 hover:border-primary-700 hover:shadow-md hover:-translate-y-0.5',
    active: 'active:bg-primary-800 active:translate-y-0',
    focus: 'focus:ring-4 focus:ring-primary-200 focus:ring-opacity-50',
    disabled:
      'disabled:bg-primary-300 disabled:border-primary-300 disabled:cursor-not-allowed disabled:transform-none',
  },

  // Secondary - Supporting actions
  secondary: {
    base: 'bg-secondary-500 text-white border-secondary-500 shadow-sm',
    hover:
      'hover:bg-secondary-600 hover:border-secondary-600 hover:shadow-md hover:-translate-y-0.5',
    active: 'active:bg-secondary-700 active:translate-y-0',
    focus: 'focus:ring-4 focus:ring-secondary-200 focus:ring-opacity-50',
    disabled:
      'disabled:bg-secondary-300 disabled:border-secondary-300 disabled:cursor-not-allowed disabled:transform-none',
  },

  // Outline - Subtle actions
  outline: {
    base: 'bg-transparent text-primary-600 border-primary-600 border-2',
    hover:
      'hover:bg-primary-50 hover:text-primary-700 hover:border-primary-700 hover:shadow-sm hover:-translate-y-0.5',
    active: 'active:bg-primary-100 active:translate-y-0',
    focus: 'focus:ring-4 focus:ring-primary-200 focus:ring-opacity-50',
    disabled:
      'disabled:text-primary-300 disabled:border-primary-300 disabled:cursor-not-allowed disabled:transform-none',
  },

  // Ghost - Minimal actions
  ghost: {
    base: 'bg-transparent text-neutral-700 border-transparent',
    hover: 'hover:bg-neutral-100 hover:text-neutral-900 hover:-translate-y-0.5',
    active: 'active:bg-neutral-200 active:translate-y-0',
    focus: 'focus:ring-4 focus:ring-neutral-200 focus:ring-opacity-50',
    disabled: 'disabled:text-neutral-400 disabled:cursor-not-allowed disabled:transform-none',
  },

  // Destructive - Dangerous actions
  destructive: {
    base: 'bg-red-600 text-white border-red-600 shadow-sm',
    hover: 'hover:bg-red-700 hover:border-red-700 hover:shadow-md hover:-translate-y-0.5',
    active: 'active:bg-red-800 active:translate-y-0',
    focus: 'focus:ring-4 focus:ring-red-200 focus:ring-opacity-50',
    disabled:
      'disabled:bg-red-300 disabled:border-red-300 disabled:cursor-not-allowed disabled:transform-none',
  },

  // Success - Positive actions
  success: {
    base: 'bg-green-600 text-white border-green-600 shadow-sm',
    hover: 'hover:bg-green-700 hover:border-green-700 hover:shadow-md hover:-translate-y-0.5',
    active: 'active:bg-green-800 active:translate-y-0',
    focus: 'focus:ring-4 focus:ring-green-200 focus:ring-opacity-50',
    disabled:
      'disabled:bg-green-300 disabled:border-green-300 disabled:cursor-not-allowed disabled:transform-none',
  },

  // Warning - Cautionary actions
  warning: {
    base: 'bg-yellow-500 text-white border-yellow-500 shadow-sm',
    hover: 'hover:bg-yellow-600 hover:border-yellow-600 hover:shadow-md hover:-translate-y-0.5',
    active: 'active:bg-yellow-700 active:translate-y-0',
    focus: 'focus:ring-4 focus:ring-yellow-200 focus:ring-opacity-50',
    disabled:
      'disabled:bg-yellow-300 disabled:border-yellow-300 disabled:cursor-not-allowed disabled:transform-none',
  },

  // Link - Text-like actions
  link: {
    base: 'bg-transparent text-primary-600 border-transparent underline-offset-4',
    hover: 'hover:text-primary-700 hover:underline hover:-translate-y-0.5',
    active: 'active:text-primary-800 active:translate-y-0',
    focus: 'focus:ring-4 focus:ring-primary-200 focus:ring-opacity-50 focus:rounded-sm',
    disabled: 'disabled:text-primary-300 disabled:cursor-not-allowed disabled:transform-none',
  },
};

// Button sizes with proper spacing and typography
const buttonSizes = {
  xs: 'px-2.5 py-1.5 text-xs font-medium min-h-[28px]',
  sm: 'px-3 py-2 text-sm font-medium min-h-[32px]',
  md: 'px-4 py-2.5 text-sm font-medium min-h-[40px]',
  lg: 'px-6 py-3 text-base font-medium min-h-[44px]',
  xl: 'px-8 py-4 text-lg font-medium min-h-[52px]',
};

// Loading spinner component
const LoadingSpinner = ({ size }: { size: ButtonSize }) => {
  const spinnerSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  } as const;

  // Safely access spinner size with fallback using type-safe approach
  const spinnerClass = (size in spinnerSizes)
    ? spinnerSizes[size as keyof typeof spinnerSizes]
    : spinnerSizes.md;

  return (
    <motion.div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        spinnerClass
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = false,
      elevated = false,
      children,
      className,
      disabled,
      motionProps,
      ...props
    },
    ref
  ) => {
    const variantStyles = buttonVariants[variant as keyof typeof buttonVariants];

    const baseClasses = cn(
      // Base button styles
      'inline-flex items-center justify-center gap-2 font-primary',
      'border transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
      'focus:outline-none focus:ring-offset-2 focus:ring-offset-background-primary',
      'disabled:opacity-60 disabled:pointer-events-none',

      // Variant styles
      variantStyles.base,
      variantStyles.hover,
      variantStyles.active,
      variantStyles.focus,
      variantStyles.disabled,

      // Size styles
      buttonSizes[size],

      // Conditional styles
      {
        'w-full': fullWidth,
        'rounded-full': rounded,
        'rounded-lg': !rounded,
        'shadow-lg hover:shadow-xl': elevated,
      },

      className
    );

    const content = (
      <>
        {loading && <LoadingSpinner size={size} />}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className={cn('truncate', { 'sr-only': loading })}>{children}</span>
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </>
    );

    if (motionProps) {
      return (
        <motion.button
          ref={ref}
          className={baseClasses}
          disabled={disabled ?? loading}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          {...(motionProps as Record<string, unknown>)}
          onClick={props.onClick}
          type={props.type}
          form={props.form}
          name={props.name}
          value={props.value}
          id={props.id}
          style={props.style as Record<string, unknown>}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <button ref={ref} className={baseClasses} disabled={disabled ?? loading} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Button group component for related actions
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'sm',
  className,
}) => {
  const spacingClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  return (
    <div
      className={cn(
        'flex',
        {
          'flex-row': orientation === 'horizontal',
          'flex-col': orientation === 'vertical',
        },
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  );
};

// Icon button component for actions with only icons
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', className, ...props }, ref) => {
    const iconSizes = {
      xs: 'w-6 h-6 p-1',
      sm: 'w-8 h-8 p-1.5',
      md: 'w-10 h-10 p-2',
      lg: 'w-12 h-12 p-2.5',
      xl: 'w-14 h-14 p-3',
    };

    return (
      <Button
        ref={ref}
        size={size}
        className={cn('aspect-square', iconSizes[size], className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
