'use client';

import { useEffect, useState } from 'react';

interface SSRSafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * SSR-Safe wrapper component to prevent hydration mismatches
 * Only renders children after client-side hydration is complete
 */
export function SSRSafeWrapper({ children, fallback = null, className = '' }: SSRSafeWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after component mounts on client
    setIsHydrated(true);
  }, []);

  // During SSR and initial hydration, render fallback
  if (!isHydrated) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  // After hydration, render actual children
  return <div className={className}>{children}</div>;
}

/**
 * Higher-order component to make any component SSR-safe
 */
export function withSSRSafe<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function SSRSafeComponent(props: P) {
    return (
      <SSRSafeWrapper fallback={fallback}>
        <Component {...props} />
      </SSRSafeWrapper>
    );
  };
}

/**
 * Hook to check if component is hydrated
 * Useful for conditional rendering based on hydration state
 */
export function useIsHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * SSR-safe client-only component
 * Only renders on client-side, never during SSR
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const isHydrated = useIsHydrated();

  return isHydrated ? children : fallback;
}
