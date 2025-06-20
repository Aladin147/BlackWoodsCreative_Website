'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, ReactNode } from 'react';

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: [number, number];
  opacity?: [number, number];
  rotate?: [number, number];
  blur?: [number, number];
  className?: string;
  offset?: [
    (
      | 'start start'
      | 'start center'
      | 'start end'
      | 'center start'
      | 'center center'
      | 'center end'
      | 'end start'
      | 'end center'
      | 'end end'
    ),
    (
      | 'start start'
      | 'start center'
      | 'start end'
      | 'center start'
      | 'center center'
      | 'center end'
      | 'end start'
      | 'end center'
      | 'end end'
    ),
  ];
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = 'up',
  scale,
  opacity,
  rotate,
  blur,
  className = '',
  offset = ['start end', 'end start'] as const,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  // Smooth spring animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Calculate movement based on direction and speed
  const getMovementRange = () => {
    const distance = 200 * speed;
    switch (direction) {
      case 'up':
        return [distance, -distance];
      case 'down':
        return [-distance, distance];
      case 'left':
        return [distance, -distance];
      case 'right':
        return [-distance, distance];
      default:
        return [0, 0];
    }
  };

  const [startPos, endPos] = getMovementRange();

  // Create transforms based on direction and effects
  const yRange = direction === 'up' || direction === 'down' ? [startPos, endPos] : [0, 0];
  const xRange = direction === 'left' || direction === 'right' ? [startPos, endPos] : [0, 0];

  const y = useTransform(smoothProgress, [0, 1], yRange);
  const x = useTransform(smoothProgress, [0, 1], xRange);
  const scaleTransform = useTransform(smoothProgress, [0, 1], scale || [1, 1]);
  const opacityTransform = useTransform(smoothProgress, [0, 1], opacity || [1, 1]);
  const rotateTransform = useTransform(smoothProgress, [0, 1], rotate || [0, 0]);
  const blurTransform = useTransform(smoothProgress, [0, 1], blur || [0, 0]);

  const filterTransform = useTransform(blurTransform, value =>
    blur ? `blur(${value}px)` : 'none'
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x,
        y,
        scale: scaleTransform,
        opacity: opacityTransform,
        rotate: rotateTransform,
        filter: filterTransform,
      }}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxContainerProps {
  children: ReactNode;
  className?: string;
}

export function ParallaxContainer({ children, className = '' }: ParallaxContainerProps) {
  return <div className={`relative overflow-hidden ${className}`}>{children}</div>;
}

// Advanced parallax effects for specific use cases
export function CinematicParallax({ children, className = '' }: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Dolly zoom effect (background scales while foreground stays fixed)
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className={`relative h-screen overflow-hidden ${className}`}>
      {/* Background Layer - Dolly Zoom */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          scale: backgroundScale,
          transformOrigin: 'center center',
        }}
      >
        <div className="h-full w-full bg-gradient-to-br from-bw-black via-bw-charcoal to-bw-dark-gray" />
      </motion.div>

      {/* Floating Elements */}
      <ParallaxLayer speed={0.3} direction="up" className="absolute inset-0 z-10">
        <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-bw-gold/10 blur-2xl" />
      </ParallaxLayer>

      <ParallaxLayer speed={0.7} direction="down" className="absolute inset-0 z-10">
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-bw-pearl/5 blur-3xl" />
      </ParallaxLayer>

      {/* Foreground Content */}
      <motion.div
        className="relative z-20 flex h-full items-center justify-center"
        style={{ y: foregroundY }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Enhanced Magnetic field effect with device adaptation
export function MagneticField({
  children,
  strength = 0.3,
  distance = 150,
  disabled = false,
}: {
  children: ReactNode;
  strength?: number;
  distance?: number;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 40 });
  const y = useSpring(0, { stiffness: 200, damping: 40 });
  const scale = useSpring(1, { stiffness: 200, damping: 40 });

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    // Check if device supports hover
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const isTouchDevice = 'ontouchstart' in window;

    // Adapt strength and distance for mobile devices
    const adaptedStrength = isTouchDevice ? strength * 0.5 : strength;
    const adaptedDistance = isTouchDevice ? distance * 0.7 : distance;

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasHover) return; // Skip on touch devices without hover

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Only apply magnetic effect within specified distance
      if (distanceFromCenter < adaptedDistance) {
        const magneticStrength = (1 - distanceFromCenter / adaptedDistance) * adaptedStrength;
        x.set(deltaX * magneticStrength);
        y.set(deltaY * magneticStrength);
        scale.set(1 + magneticStrength * 0.1); // Subtle scale effect
      } else {
        x.set(0);
        y.set(0);
        scale.set(1);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      scale.set(1);
    };

    // Touch event handlers for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (!isTouchDevice) return;

      const touch = e.touches[0];
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;

      // Quick tap feedback
      x.set(deltaX * adaptedStrength * 0.3);
      y.set(deltaY * adaptedStrength * 0.3);
      scale.set(1.05);

      // Return to normal after short delay
      setTimeout(() => {
        x.set(0);
        y.set(0);
        scale.set(1);
      }, 150);
    };

    // Keyboard navigation support
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      if (e.key === 'Enter' || e.key === ' ') {
        // Provide focus feedback for keyboard users
        scale.set(1.05);
        setTimeout(() => scale.set(1), 150);
      }
    };

    const handleFocus = () => {
      // Subtle focus indication for keyboard users
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        scale.set(1.02);
      }
    };

    const handleBlur = () => {
      x.set(0);
      y.set(0);
      scale.set(1);
    };

    // Use global mouse events for better magnetic field effect
    if (hasHover) {
      document.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    if (isTouchDevice) {
      element.addEventListener('touchstart', handleTouchStart);
    }

    // Add keyboard accessibility
    element.addEventListener('keydown', handleKeyDown);
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('keydown', handleKeyDown);
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, [x, y, scale, strength, distance, disabled]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y, scale }}
      className="transform-gpu"
      tabIndex={0}
      role="button"
      aria-label="Interactive magnetic field element"
    >
      {children}
    </motion.div>
  );
}

// Depth of field effect
export function DepthOfField({
  children,
  focusDistance = 0.5,
  className = '',
}: {
  children: ReactNode;
  focusDistance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Calculate blur based on distance from focus point
  const blur = useTransform(scrollYProgress, value => {
    const distance = Math.abs(value - focusDistance);
    return distance * 10; // Max blur of 10px
  });

  const opacity = useTransform(scrollYProgress, value => {
    const distance = Math.abs(value - focusDistance);
    return Math.max(0.3, 1 - distance * 2); // Min opacity of 0.3
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        filter: useTransform(blur, value => `blur(${value}px)`),
        opacity,
      }}
    >
      {children}
    </motion.div>
  );
}
