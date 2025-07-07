/**
 * Mobile Optimized Layout
 * 
 * A layout component optimized for mobile devices with proper safe areas,
 * touch targets, and mobile-first responsive design
 */

'use client';

import { ReactNode } from 'react';

import { MobileOptimizedNavigation, MobileBreadcrumbs, MobileFooterNavigation } from '@/components/navigation/MobileOptimizedNavigation';
import { useMobileDevice, MobileStyles } from '@/lib/utils/mobile-optimization';

interface MobileOptimizedLayoutProps {
  children: ReactNode;
  showFooterNav?: boolean;
  showBreadcrumbs?: boolean;
  className?: string;
}

export function MobileOptimizedLayout({
  children,
  showFooterNav = true,
  showBreadcrumbs = true,
  className = '',
}: MobileOptimizedLayoutProps) {
  const deviceInfo = useMobileDevice();

  return (
    <div className={`min-h-screen bg-bw-bg-primary ${className}`}>
      {/* Mobile Navigation */}
      <MobileOptimizedNavigation />

      {/* Breadcrumbs */}
      {showBreadcrumbs && <MobileBreadcrumbs />}

      {/* Main Content */}
      <main 
        className={`
          ${deviceInfo.isMobile ? 'pb-20' : ''} 
          ${deviceInfo.hasNotch ? 'px-safe-left pr-safe-right' : ''}
        `}
      >
        {children}
      </main>

      {/* Footer Navigation */}
      {showFooterNav && <MobileFooterNavigation />}
    </div>
  );
}

// Mobile-optimized section wrapper
export function MobileSection({
  children,
  className = '',
  padding = 'normal',
}: {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'normal' | 'large';
}) {
  const deviceInfo = useMobileDevice();

  const paddingClasses = {
    none: '',
    small: deviceInfo.isMobile ? 'p-4' : 'p-6',
    normal: deviceInfo.isMobile ? 'p-6' : 'p-8',
    large: deviceInfo.isMobile ? 'p-8' : 'p-12',
  };

  return (
    <section className={`${paddingClasses[padding]} ${className}`}>
      {children}
    </section>
  );
}

// Mobile-optimized container
export function MobileContainer({
  children,
  size = 'default',
  className = '',
}: {
  children: ReactNode;
  size?: 'small' | 'default' | 'large' | 'full';
  className?: string;
}) {
  const deviceInfo = useMobileDevice();

  const sizeClasses = {
    small: 'max-w-sm',
    default: deviceInfo.isMobile ? 'max-w-full' : 'max-w-4xl',
    large: deviceInfo.isMobile ? 'max-w-full' : 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto ${sizeClasses[size]} ${MobileStyles.spacing.mobileX} ${className}`}>
      {children}
    </div>
  );
}

// Mobile-optimized grid
export function MobileGrid({
  children,
  columns = 1,
  gap = 'normal',
  className = '',
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'small' | 'normal' | 'large';
  className?: string;
}) {
  const deviceInfo = useMobileDevice();

  const gapClasses = {
    small: 'gap-2',
    normal: 'gap-4',
    large: 'gap-6',
  };

  // Force single column on mobile for columns > 2

  const gridClasses = {
    1: 'grid-cols-1',
    2: deviceInfo.isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2',
    3: deviceInfo.isMobile ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: deviceInfo.isMobile ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

// Mobile-optimized card
export function MobileCard({
  children,
  padding = 'normal',
  className = '',
  interactive = false,
}: {
  children: ReactNode;
  padding?: 'small' | 'normal' | 'large';
  className?: string;
  interactive?: boolean;
}) {
  const deviceInfo = useMobileDevice();

  const paddingClasses = {
    small: deviceInfo.isMobile ? 'p-3' : 'p-4',
    normal: deviceInfo.isMobile ? 'p-4' : 'p-6',
    large: deviceInfo.isMobile ? 'p-6' : 'p-8',
  };

  const interactiveClasses = interactive
    ? `${deviceInfo.isMobile ? 'active:scale-98' : 'hover:scale-105'} transition-transform cursor-pointer`
    : '';

  return (
    <div
      className={`
        bg-bw-bg-secondary 
        border border-bw-border-subtle 
        rounded-lg 
        ${paddingClasses[padding]} 
        ${interactiveClasses}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Mobile-optimized button
export function MobileButton({
  children,
  variant = 'primary',
  size = 'normal',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'normal' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const deviceInfo = useMobileDevice();

  const variantClasses = {
    primary: 'bg-bw-accent-gold text-black hover:bg-bw-accent-gold/90',
    secondary: 'bg-bw-bg-secondary text-bw-text-primary hover:bg-bw-bg-tertiary',
    outline: 'border border-bw-border-subtle text-bw-text-primary hover:bg-bw-bg-secondary',
  };

  const sizeClasses = {
    small: deviceInfo.isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-sm',
    normal: deviceInfo.isMobile ? 'px-4 py-3 text-base' : 'px-6 py-3 text-base',
    large: deviceInfo.isMobile ? 'px-6 py-4 text-lg' : 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${MobileStyles.touchTarget()}
        ${deviceInfo.isMobile ? 'active:scale-95' : 'hover:scale-105'}
        rounded-lg
        font-medium
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:transform-none
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Mobile-optimized input
export function MobileInput({
  label,
  error,
  className = '',
  ...props
}: {
  label?: string;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-bw-text-primary">
          {label}
        </label>
      )}
      <input
        className={`
          w-full
          px-4
          py-3
          border
          border-bw-border-subtle
          rounded-lg
          bg-bw-bg-primary
          text-bw-text-primary
          placeholder-bw-text-secondary
          focus:ring-2
          focus:ring-bw-accent-gold
          focus:border-bw-accent-gold
          transition-colors
          ${MobileStyles.touchTarget()}
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        style={{ fontSize: '16px' }} // Prevents zoom on iOS
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
