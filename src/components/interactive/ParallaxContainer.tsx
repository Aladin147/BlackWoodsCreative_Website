'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: [number, number];
  opacity?: [number, number];
  rotate?: [number, number];
  blur?: [number, number];
  className?: string;
  offset?: [string, string];
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
  offset = ['start end', 'end start'],
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

  // Always call hooks, but use conditional values
  const yTransform = useTransform(smoothProgress, [0, 1], [startPos, endPos]);
  const xTransform = useTransform(smoothProgress, [0, 1], [startPos, endPos]);
  const scaleTransformValue = useTransform(smoothProgress, [0, 1], scale || [1, 1]);
  const opacityTransformValue = useTransform(smoothProgress, [0, 1], opacity || [1, 1]);
  const rotateTransformValue = useTransform(smoothProgress, [0, 1], rotate || [0, 0]);
  const blurTransformValue = useTransform(smoothProgress, [0, 1], blur || [0, 0]);

  // Apply conditional logic to the final values
  const y = (direction === 'up' || direction === 'down') ? yTransform : 0;
  const x = (direction === 'left' || direction === 'right') ? xTransform : 0;
  const scaleTransform = scale ? scaleTransformValue : 1;
  const opacityTransform = opacity ? opacityTransformValue : 1;
  const rotateTransform = rotate ? rotateTransformValue : 0;
  const blurTransform = blur ? blurTransformValue : 0;

  const filterTransform = useTransform(
    blurTransform as MotionValue<number>,
    (value) => blur ? `blur(${value}px)` : 'none'
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
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
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
        <div className="w-full h-full bg-gradient-to-br from-bw-black via-bw-charcoal to-bw-dark-gray" />
      </motion.div>

      {/* Floating Elements */}
      <ParallaxLayer speed={0.3} direction="up" className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-bw-gold/10 rounded-full blur-2xl" />
      </ParallaxLayer>

      <ParallaxLayer speed={0.7} direction="down" className="absolute inset-0 z-10">
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-bw-pearl/5 rounded-full blur-3xl" />
      </ParallaxLayer>

      {/* Foreground Content */}
      <motion.div
        className="relative z-20 h-full flex items-center justify-center"
        style={{ y: foregroundY }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Magnetic field effect for portfolio items
export function MagneticField({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      x.set(deltaX);
      y.set(deltaY);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y, strength]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="transform-gpu"
    >
      {children}
    </motion.div>
  );
}

// Depth of field effect
export function DepthOfField({
  children,
  focusDistance = 0.5,
  className = ''
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
  const blur = useTransform(scrollYProgress, (value) => {
    const distance = Math.abs(value - focusDistance);
    return distance * 10; // Max blur of 10px
  });

  const opacity = useTransform(scrollYProgress, (value) => {
    const distance = Math.abs(value - focusDistance);
    return Math.max(0.3, 1 - distance * 2); // Min opacity of 0.3
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        filter: useTransform(blur, (value) => `blur(${value}px)`),
        opacity,
      }}
    >
      {children}
    </motion.div>
  );
}
