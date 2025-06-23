'use client';

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import React, { useRef, useEffect, useState, Children } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  delay?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  distance = 50,
  delay = 0,
  duration = 0.8,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { y: distance, x: 0 };
    }
  };

  const initial = {
    opacity: 0,
    ...getInitialTransform(),
  };

  const animate = {
    opacity: isInView ? 1 : 0,
    x: isInView ? 0 : getInitialTransform().x,
    y: isInView ? 0 : getInitialTransform().y,
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxText({ children, className = '', speed = 0.5 }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const smoothY = useSpring(y, { stiffness: 60, damping: 40 });

  return (
    <motion.div ref={ref} className={className} style={{ y: smoothY }}>
      {children}
    </motion.div>
  );
}

interface ScrollProgressBarProps {
  className?: string;
}

export function ScrollProgressBar({ className = '' }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className={`fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-bw-accent-gold ${className}`}
      style={{ scaleX }}
    />
  );
}

interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CountUp({
  end,
  duration = 2,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startAnimation = () => {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    };

    // Apply delay if specified
    if (delay > 0) {
      const timeoutId = setTimeout(startAnimation, delay * 1000);
      return () => clearTimeout(timeoutId);
    } else {
      return startAnimation();
    }
  }, [isInView, end, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

interface StaggeredGridProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggeredGrid({
  children,
  className = '',
  staggerDelay = 0.1,
}: StaggeredGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Convert children to array if it's not already
  const childrenArray = Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
              : {
                  opacity: 0,
                  y: 30,
                  scale: 0.9,
                }
          }
          transition={{
            duration: 0.6,
            delay: index * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

interface MorphingShapeProps {
  className?: string;
  color?: string;
}

export function MorphingShape({ className = '', color = 'bw-accent-gold' }: MorphingShapeProps) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.2, 0.8, 1],
        rotate: [0, 180, 360],
        borderRadius: ['50%', '30%', '50%'],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        background: `radial-gradient(circle, var(--bw-${color})/20, transparent 70%)`,
      }}
    />
  );
}

interface ScrollTriggeredCounterProps {
  counters: Array<{
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
  }>;
  className?: string;
}

export function ScrollTriggeredCounter({ counters, className = '' }: ScrollTriggeredCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className={className}>
      {counters.map((counter, index) => (
        <motion.div
          key={index}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.6,
            delay: index * 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="mb-2 text-display-lg text-bw-accent-gold">
            <CountUp
              end={counter.value}
              prefix={counter.prefix ?? ''}
              suffix={counter.suffix ?? ''}
              duration={2 + index * 0.5}
            />
          </div>
          <p className="text-body-xl">{counter.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
