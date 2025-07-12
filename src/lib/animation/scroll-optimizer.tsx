/**
 * Advanced Scroll Animation Optimizer with Virtualization
 * Provides intelligent scroll-based animation management
 */

'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import { motion } from 'framer-motion';

import { useAnimationOptimizer } from './performance-optimizer';

interface ScrollAnimationConfig {
  threshold: number;
  rootMargin: string;
  triggerOnce: boolean;
  enableVirtualization: boolean;
  maxConcurrentAnimations: number;
  priorityThreshold: number;
}

const defaultScrollConfig: ScrollAnimationConfig = {
  threshold: 0.1,
  rootMargin: '-50px',
  triggerOnce: true,
  enableVirtualization: true,
  maxConcurrentAnimations: 8,
  priorityThreshold: 5,
};

// Enhanced intersection observer with performance optimization
class OptimizedIntersectionObserver {
  private static instance: OptimizedIntersectionObserver;
  private observers: Map<string, IntersectionObserver> = new Map();
  private callbacks: Map<Element, Set<(entry: IntersectionObserverEntry) => void>> = new Map();
  private throttleMap = new Map<string, number>();

  static getInstance(): OptimizedIntersectionObserver {
    if (!OptimizedIntersectionObserver.instance) {
      OptimizedIntersectionObserver.instance = new OptimizedIntersectionObserver();
    }
    return OptimizedIntersectionObserver.instance;
  }

  observe(
    element: Element,
    callback: (entry: IntersectionObserverEntry) => void,
    options: IntersectionObserverInit = {}
  ): () => void {
    const key = this.getObserverKey(options);

    if (!this.observers.has(key)) {
      const observer = new IntersectionObserver(this.createThrottledCallback(key), options);
      this.observers.set(key, observer);
    }

    const observer = this.observers.get(key);
    if (!observer)
      return () => {
        // Cleanup function for when observer is not available
      };

    // Add callback to element
    if (!this.callbacks.has(element)) {
      this.callbacks.set(element, new Set());
    }
    this.callbacks.get(element)?.add(callback);

    observer.observe(element);

    // Return cleanup function
    return () => {
      this.callbacks.get(element)?.delete(callback);
      if (this.callbacks.get(element)?.size === 0) {
        observer.unobserve(element);
        this.callbacks.delete(element);
      }
    };
  }

  private getObserverKey(options: IntersectionObserverInit): string {
    return (
      JSON.stringify({
        threshold: options.threshold,
        rootMargin: options.rootMargin,
        root: options.root,
      }) ?? 'default'
    );
  }

  private createThrottledCallback(key: string) {
    return (entries: IntersectionObserverEntry[]) => {
      const now = Date.now();
      const lastCall = this.throttleMap.get(key) ?? 0;

      // Throttle to 60fps max
      if (now - lastCall < 16.67) {
        return;
      }

      this.throttleMap.set(key, now);

      entries.forEach(entry => {
        const callbacks = this.callbacks.get(entry.target);
        if (callbacks) {
          callbacks.forEach(callback => callback(entry));
        }
      });
    };
  }
}

// Virtualized scroll animation hook
export function useVirtualizedScrollAnimation(
  priority = 5,
  config: Partial<ScrollAnimationConfig> = {}
) {
  const finalConfig = useMemo(() => ({ ...defaultScrollConfig, ...config }), [config]);
  const { shouldSkipAnimation, registerAnimation, unregisterAnimation } = useAnimationOptimizer();
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const animationId = useRef(`scroll-${Math.random().toString(36).substr(2, 9)}`);

  const shouldAnimate = useMemo(() => {
    if (shouldSkipAnimation(priority)) return false;
    if (finalConfig.triggerOnce && hasTriggered) return false;
    return true;
  }, [shouldSkipAnimation, priority, finalConfig.triggerOnce, hasTriggered]);

  const handleIntersection = useCallback(
    (entry: IntersectionObserverEntry) => {
      const { isIntersecting } = entry;

      if (isIntersecting && shouldAnimate) {
        const canRegister = registerAnimation(animationId.current, priority);
        if (canRegister) {
          setIsVisible(true);
          if (finalConfig.triggerOnce) {
            setHasTriggered(true);
          }
        }
      } else if (!finalConfig.triggerOnce) {
        setIsVisible(false);
        unregisterAnimation(animationId.current);
      }
    },
    [shouldAnimate, registerAnimation, unregisterAnimation, priority, finalConfig.triggerOnce]
  );

  useEffect(() => {
    if (!elementRef.current || !finalConfig.enableVirtualization) return;

    const observer = OptimizedIntersectionObserver.getInstance();
    const cleanup = observer.observe(elementRef.current, handleIntersection, {
      threshold: finalConfig.threshold,
      rootMargin: finalConfig.rootMargin,
    });

    return cleanup;
  }, [handleIntersection, finalConfig]);

  useEffect(() => {
    const id = animationId.current;
    return () => {
      unregisterAnimation(id);
    };
  }, [unregisterAnimation]);

  return {
    ref: elementRef,
    isVisible: shouldAnimate ? isVisible : false,
    shouldAnimate,
    hasTriggered,
  };
}

// Enhanced scroll reveal component with virtualization
interface OptimizedScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  delay?: number;
  duration?: number;
  priority?: number;
  config?: Partial<ScrollAnimationConfig>;
}

export function OptimizedScrollReveal({
  children,
  className = '',
  direction = 'up',
  distance = 50,
  delay = 0,
  duration = 0.8,
  priority = 5,
  config,
}: OptimizedScrollRevealProps) {
  const { ref, isVisible, shouldAnimate } = useVirtualizedScrollAnimation(priority, config);
  const { getOptimizedTransition } = useAnimationOptimizer();

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
    opacity: isVisible ? 1 : 0,
    x: isVisible ? 0 : getInitialTransform().x,
    y: isVisible ? 0 : getInitialTransform().y,
  };

  const optimizedTransition = getOptimizedTransition({
    duration,
    delay,
    ease: [0.25, 0.46, 0.45, 0.94],
  });

  // Skip animation entirely if performance is poor
  if (!shouldAnimate) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={optimizedTransition}
    >
      {children}
    </motion.div>
  );
}

// Batch scroll animation manager for multiple elements
export class ScrollAnimationBatch {
  private static instance: ScrollAnimationBatch;
  private batches: Map<string, Set<() => void>> = new Map();
  private rafId: number | null = null;

  static getInstance(): ScrollAnimationBatch {
    if (!ScrollAnimationBatch.instance) {
      ScrollAnimationBatch.instance = new ScrollAnimationBatch();
    }
    return ScrollAnimationBatch.instance;
  }

  addToBatch(batchId: string, callback: () => void): () => void {
    if (!this.batches.has(batchId)) {
      this.batches.set(batchId, new Set());
    }

    this.batches.get(batchId)?.add(callback);
    this.scheduleBatchExecution();

    return () => {
      this.batches.get(batchId)?.delete(callback);
    };
  }

  private scheduleBatchExecution(): void {
    if (this.rafId) return;

    this.rafId = requestAnimationFrame(() => {
      this.batches.forEach((callbacks, _batchId) => {
        callbacks.forEach(callback => callback());
      });
      this.rafId = null;
    });
  }
}

// Hook for batched scroll animations
export function useBatchedScrollAnimation(batchId: string, callback: () => void) {
  useEffect(() => {
    const batch = ScrollAnimationBatch.getInstance();
    const cleanup = batch.addToBatch(batchId, callback);
    return cleanup;
  }, [batchId, callback]);
}

// Performance-aware parallax hook
export function useOptimizedParallax(speed = 0.5, priority = 6) {
  const { shouldSkipAnimation } = useAnimationOptimizer();
  const elementRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    if (shouldSkipAnimation(priority)) return;

    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const isVisible = rect.bottom >= 0 && rect.top <= window.innerHeight;

      if (isVisible) {
        const scrolled = window.scrollY;
        setScrollY(scrolled * speed);
      }
    }
  }, [shouldSkipAnimation, priority, speed]);

  useEffect(() => {
    if (shouldSkipAnimation(priority)) return;

    const throttledScroll = throttle(handleScroll, 16); // ~60fps
    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll, shouldSkipAnimation, priority]);

  return {
    ref: elementRef,
    y: scrollY,
    shouldAnimate: !shouldSkipAnimation(priority),
  };
}

// Utility function for throttling
function throttle<T extends (...args: unknown[]) => unknown>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: unknown[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}
