/**
 * Lightweight motion components for better bundle optimization
 * These components provide common motion patterns with minimal bundle impact
 */

'use client';

import React, { ReactNode } from 'react';

import { useAnimationConfig } from '@/hooks/useReducedMotion';
import { useGPUOptimization } from '@/lib/animation/gpu-optimizer';
import { useOptimizedAnimation } from '@/lib/animation/performance-optimizer';
import {
  MotionDiv,
  MotionButton,
  fadeInVariants,
  slideUpVariants,
  smoothTransition,
  quickTransition,
  type Variants,
} from '@/lib/motion';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className = '', delay = 0 }: FadeInProps) {
  const animationConfig = useAnimationConfig();
  const { canAnimate, optimizeTransition } = useOptimizedAnimation('fadeIn', 5);
  const { ref: gpuRef } = useGPUOptimization(5);
  const combinedRef = React.useRef<HTMLDivElement>(null);

  // Combine refs using callback pattern
  const setRefs = React.useCallback((node: HTMLDivElement | null) => {
    // Use Object.defineProperty to bypass readonly restriction
    Object.defineProperty(combinedRef, 'current', {
      value: node,
      writable: true,
      configurable: true
    });

    // Set the GPU ref if it exists and has a current property
    if (gpuRef && typeof gpuRef === 'object' && 'current' in gpuRef) {
      Object.defineProperty(gpuRef, 'current', {
        value: node,
        writable: true,
        configurable: true
      });
    }
  }, [gpuRef]);

  if (animationConfig.disableAnimations || !canAnimate) {
    return (
      <div ref={setRefs} className={className}>
        {children}
      </div>
    );
  }

  const optimizedTransition = optimizeTransition({ ...smoothTransition, delay });

  return (
    <MotionDiv
      ref={setRefs}
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={optimizedTransition}
    >
      {children}
    </MotionDiv>
  );
}

interface SlideUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SlideUp({ children, className = '', delay = 0 }: SlideUpProps) {
  const animationConfig = useAnimationConfig();
  const { canAnimate, optimizeTransition } = useOptimizedAnimation('slideUp', 6);
  const { ref: gpuRef } = useGPUOptimization(6);
  const combinedRef = React.useRef<HTMLDivElement>(null);

  // Combine refs using callback pattern
  const setRefs = React.useCallback((node: HTMLDivElement | null) => {
    // Use Object.defineProperty to bypass readonly restriction
    Object.defineProperty(combinedRef, 'current', {
      value: node,
      writable: true,
      configurable: true
    });

    // Set the GPU ref if it exists and has a current property
    if (gpuRef && typeof gpuRef === 'object' && 'current' in gpuRef) {
      Object.defineProperty(gpuRef, 'current', {
        value: node,
        writable: true,
        configurable: true
      });
    }
  }, [gpuRef]);

  if (animationConfig.disableAnimations || !canAnimate) {
    return (
      <div ref={setRefs} className={className}>
        {children}
      </div>
    );
  }

  const optimizedTransition = optimizeTransition({ ...smoothTransition, delay });

  return (
    <MotionDiv
      ref={setRefs}
      className={className}
      initial="hidden"
      animate="visible"
      variants={slideUpVariants}
      transition={optimizedTransition}
    >
      {children}
    </MotionDiv>
  );
}

interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  onClick?: () => void;
}

export function HoverScale({ children, className = '', scale = 1.02, onClick }: HoverScaleProps) {
  const animationConfig = useAnimationConfig();
  const { canAnimate, optimizeTransition } = useOptimizedAnimation('hoverScale', 7);
  const { ref: gpuRef } = useGPUOptimization(7);
  const combinedRef = React.useRef<HTMLDivElement>(null);

  // Combine refs using callback pattern
  const setRefs = React.useCallback((node: HTMLDivElement | null) => {
    // Use Object.defineProperty to bypass readonly restriction
    Object.defineProperty(combinedRef, 'current', {
      value: node,
      writable: true,
      configurable: true
    });

    // Set the GPU ref if it exists and has a current property
    if (gpuRef && typeof gpuRef === 'object' && 'current' in gpuRef) {
      Object.defineProperty(gpuRef, 'current', {
        value: node,
        writable: true,
        configurable: true
      });
    }
  }, [gpuRef]);

  if (!canAnimate) {
    return (
      <div ref={setRefs} className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  const optimizedTransition = optimizeTransition(quickTransition);

  return (
    <MotionDiv
      ref={setRefs}
      className={className}
      whileHover={{ scale: animationConfig.scale.hover * scale }}
      whileTap={{ scale: animationConfig.scale.tap }}
      transition={optimizedTransition}
      onClick={onClick}
    >
      {children}
    </MotionDiv>
  );
}

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export function AnimatedButton({
  children,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ariaLabel,
}: AnimatedButtonProps) {
  const animationConfig = useAnimationConfig();

  return (
    <MotionButton
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={{ scale: animationConfig.scale.hover }}
      whileTap={{ scale: animationConfig.scale.tap }}
      transition={quickTransition}
    >
      {children}
    </MotionButton>
  );
}

interface StaggeredListProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export function StaggeredList({
  children,
  className = '',
  staggerDelay = 0.1,
}: StaggeredListProps) {
  const animationConfig = useAnimationConfig();

  if (animationConfig.disableAnimations) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MotionDiv
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {children.map((child, index) => (
        <MotionDiv key={index} variants={itemVariants} transition={smoothTransition}>
          {child}
        </MotionDiv>
      ))}
    </MotionDiv>
  );
}

interface PulseProps {
  children: ReactNode;
  className?: string;
  color?: string;
  intensity?: number;
  duration?: number;
  scale?: number;
}

export function Pulse({
  children,
  className = '',
  intensity: _intensity = 0.3,
  duration = 2,
  scale = 1.05,
}: PulseProps) {
  const animationConfig = useAnimationConfig();

  if (animationConfig.disableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionDiv
      className={className}
      animate={{ scale: [1, scale, 1] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </MotionDiv>
  );
}

interface FloatProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function Float({ children, className = '', amplitude = 10, duration = 3 }: FloatProps) {
  const animationConfig = useAnimationConfig();

  if (animationConfig.disableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionDiv
      className={className}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </MotionDiv>
  );
}

interface RotateProps {
  children: ReactNode;
  className?: string;
  degrees?: number;
  duration?: number;
}

export function Rotate({ children, className = '', degrees = 360, duration = 4 }: RotateProps) {
  const animationConfig = useAnimationConfig();

  if (animationConfig.disableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionDiv
      className={className}
      animate={{ rotate: degrees }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </MotionDiv>
  );
}

// Export all components for easy importing
export const LightweightMotion = {
  FadeIn,
  SlideUp,
  HoverScale,
  AnimatedButton,
  StaggeredList,
  Pulse,
  Float,
  Rotate,
};
