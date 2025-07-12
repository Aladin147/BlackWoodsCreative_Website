/**
 * Centralized Framer Motion utilities for better tree-shaking and bundle optimization
 * This file provides optimized imports and reusable motion configurations
 */

'use client';

// Optimized framer-motion imports for better tree-shaking
// Import only what's needed to reduce bundle size
import {
  motion,
  type Variants,
  type Transition,
  type MotionValue,
  useScroll,
  useSpring,
} from 'framer-motion';

// Lazy import heavy features only when needed
export const lazyFramerMotionImports = {
  useScroll: () => import('framer-motion').then(m => m.useScroll),
  useSpring: () => import('framer-motion').then(m => m.useSpring),
  useTransform: () => import('framer-motion').then(m => m.useTransform),
  useMotionValue: () => import('framer-motion').then(m => m.useMotionValue),
  useInView: () => import('framer-motion').then(m => m.useInView),
  useAnimation: () => import('framer-motion').then(m => m.useAnimation),
  useAnimationControls: () => import('framer-motion').then(m => m.useAnimationControls),
  AnimatePresence: () => import('framer-motion').then(m => m.AnimatePresence),
  LayoutGroup: () => import('framer-motion').then(m => m.LayoutGroup),
};

// Re-export types (these don't affect bundle size)
export type {
  MotionValue,
  Variants,
  Transition,
  TargetAndTransition,
  MotionProps,
} from 'framer-motion';

// Re-export core motion component (always needed)
export { motion };

// Utility functions to get lazy imports when needed
export const getFramerMotionHook = async (hookName: keyof typeof lazyFramerMotionImports) => {
  const importFn = lazyFramerMotionImports[hookName];
  return importFn ? await importFn() : null;
};

// Convenience functions for common hooks
export const useScrollLazy = async () => await lazyFramerMotionImports.useScroll();
export const useSpringLazy = async () => await lazyFramerMotionImports.useSpring();
export const useTransformLazy = async () => await lazyFramerMotionImports.useTransform();
export const useInViewLazy = async () => await lazyFramerMotionImports.useInView();

// Common animation variants for reuse across components
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const slideInVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Common transitions for consistency
export const smoothTransition: Transition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const quickTransition: Transition = {
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
};

// Optimized motion components with common props
export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionButton = motion.button;
export const MotionSpan = motion.span;
export const MotionP = motion.p;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionH3 = motion.h3;

// Performance-optimized scroll hooks
export const useOptimizedScroll = (options?: Parameters<typeof useScroll>[0]) => {
  return useScroll({
    ...options,
    // Add performance optimizations
    layoutEffect: false, // Use useEffect instead of useLayoutEffect for better performance
  });
};

// Optimized spring hook with better defaults
export const useOptimizedSpring = (
  value: MotionValue<number>,
  config?: Parameters<typeof useSpring>[1]
) => {
  return useSpring(value, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
    ...config,
  });
};

// Utility function for creating responsive motion values
export const createResponsiveMotionValue = (desktop: number, tablet: number, mobile: number) => {
  if (typeof window === 'undefined') return desktop;

  const width = window.innerWidth;
  if (width < 768) return mobile;
  if (width < 1024) return tablet;
  return desktop;
};

// Reduced motion utilities
export const getReducedMotionVariants = (variants: Variants): Variants => {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) return variants;

  // Return simplified variants for reduced motion
  return Object.keys(variants).reduce((acc, key) => {
    // Safe object assignment with validation
    if (typeof key === 'string' && key.length > 0 && key.length < 50) {
      acc[key] = { opacity: 1 };
    }
    return acc;
  }, {} as Variants);
};

// Performance monitoring for animations
export const withPerformanceMonitoring = <T extends object>(
  component: T,
  componentName: string
): T => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[Motion Performance] ${componentName} rendered`);
  }
  return component;
};
