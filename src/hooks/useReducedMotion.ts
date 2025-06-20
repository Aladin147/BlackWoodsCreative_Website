'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation configuration based on reduced motion preference
 */
export function useAnimationConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    // Transition durations
    duration: {
      fast: prefersReducedMotion ? 0.01 : 0.2,
      normal: prefersReducedMotion ? 0.01 : 0.4,
      slow: prefersReducedMotion ? 0.01 : 0.6,
      cinematic: prefersReducedMotion ? 0.01 : 0.8,
    },

    // Scale effects
    scale: {
      hover: prefersReducedMotion ? 1 : 1.02,
      tap: prefersReducedMotion ? 1 : 0.98,
      magnify: prefersReducedMotion ? 1 : 1.05,
    },

    // Transform effects
    transform: {
      lift: prefersReducedMotion ? 0 : -2,
      float: prefersReducedMotion ? 0 : 10,
    },

    // Animation variants
    variants: {
      hidden: {
        opacity: prefersReducedMotion ? 1 : 0,
        y: prefersReducedMotion ? 0 : 20,
      },
      visible: {
        opacity: 1,
        y: 0,
      },
    },

    // Disable complex animations
    disableAnimations: prefersReducedMotion,
  };
}
