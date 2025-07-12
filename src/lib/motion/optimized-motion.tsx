/**
 * Optimized Motion Components for Better Bundle Size
 * This file provides motion components with minimal framer-motion imports
 */

'use client';

import React, { ReactNode } from 'react';

import { motion } from 'framer-motion';

import { useAnimationConfig } from '@/hooks/useReducedMotion';

// Core motion components with minimal imports
export const OptimizedMotionDiv = motion.div;
export const OptimizedMotionButton = motion.button;
export const OptimizedMotionSpan = motion.span;
export const OptimizedMotionSection = motion.section;

// Lightweight animation variants
export const optimizedVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

// Optimized transitions
export const optimizedTransitions = {
  fast: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  normal: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  slow: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
};

// Simple fade in component
interface OptimizedFadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function OptimizedFadeIn({ children, className = '', delay = 0 }: OptimizedFadeInProps) {
  const animationConfig = useAnimationConfig();

  if (animationConfig.disableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <OptimizedMotionDiv
      className={className}
      initial="hidden"
      animate="visible"
      variants={optimizedVariants.fadeIn}
      transition={{ ...optimizedTransitions.normal, delay }}
    >
      {children}
    </OptimizedMotionDiv>
  );
}

// Simple hover scale component
interface OptimizedHoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export function OptimizedHoverScale({
  children,
  className = '',
  scale = 1.02,
}: OptimizedHoverScaleProps) {
  const animationConfig = useAnimationConfig();

  return (
    <OptimizedMotionDiv
      className={className}
      whileHover={{ scale: animationConfig.scale.hover * scale }}
      transition={optimizedTransitions.fast}
    >
      {children}
    </OptimizedMotionDiv>
  );
}

// Simple button with tap animation
interface OptimizedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function OptimizedButton({
  children,
  className = '',
  onClick,
  disabled = false,
}: OptimizedButtonProps) {
  const animationConfig = useAnimationConfig();

  return (
    <OptimizedMotionButton
      className={className}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: animationConfig.scale.hover }}
      whileTap={{ scale: animationConfig.scale.tap }}
      transition={optimizedTransitions.fast}
    >
      {children}
    </OptimizedMotionButton>
  );
}

// Export all optimized components
export const OptimizedMotion = {
  Div: OptimizedMotionDiv,
  MotionButton: OptimizedMotionButton,
  Span: OptimizedMotionSpan,
  Section: OptimizedMotionSection,
  FadeIn: OptimizedFadeIn,
  HoverScale: OptimizedHoverScale,
  Button: OptimizedButton,
  variants: optimizedVariants,
  transitions: optimizedTransitions,
};
