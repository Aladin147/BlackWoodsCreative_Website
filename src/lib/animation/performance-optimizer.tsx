/**
 * Advanced Animation Performance Optimizer for Next.js 15
 * Provides intelligent animation management and optimization
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

import { Transition } from 'framer-motion';

interface AnimationPerformanceState {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  activeAnimations: number;
  isOptimal: boolean;
  shouldReduceAnimations: boolean;
  gpuAcceleration: boolean;
}

interface AnimationOptimizerConfig {
  targetFPS: number;
  maxActiveAnimations: number;
  memoryThreshold: number; // MB
  enableGPUAcceleration: boolean;
  enableAnimationPooling: boolean;
  enableVirtualization: boolean;
}

const defaultConfig: AnimationOptimizerConfig = {
  targetFPS: 60,
  maxActiveAnimations: 12, // Optimized for better performance
  memoryThreshold: 120, // 120MB - More conservative threshold
  enableGPUAcceleration: true,
  enableAnimationPooling: true,
  enableVirtualization: true,
};

// Use Framer Motion's Transition type directly for better compatibility
type MotionTransition = Transition;

interface AnimationOptimizerContextType {
  state: AnimationPerformanceState;
  config: AnimationOptimizerConfig;
  registerAnimation: (id: string, priority: number) => boolean;
  unregisterAnimation: (id: string) => void;
  shouldSkipAnimation: (priority: number) => boolean;
  getOptimizedTransition: (baseTransition: MotionTransition) => MotionTransition;
  enableGPULayer: (element: HTMLElement) => void;
  disableGPULayer: (element: HTMLElement) => void;
}

const AnimationOptimizerContext = createContext<AnimationOptimizerContextType | null>(null);

interface AnimationOptimizerProviderProps {
  children: React.ReactNode;
  config?: Partial<AnimationOptimizerConfig>;
}

export function AnimationOptimizerProvider({
  children,
  config: userConfig,
}: AnimationOptimizerProviderProps) {
  const config = React.useMemo(() => ({ ...defaultConfig, ...userConfig }), [userConfig]);
  const [state, setState] = useState<AnimationPerformanceState>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    activeAnimations: 0,
    isOptimal: true,
    shouldReduceAnimations: false,
    gpuAcceleration: config.enableGPUAcceleration,
  });

  const animationRegistry = useRef<Map<string, { priority: number; timestamp: number }>>(new Map());
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const rafIdRef = useRef<number | undefined>(undefined);

  // Performance monitoring loop
  const monitorPerformance = useCallback(() => {
    const now = performance.now();
    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    frameTimesRef.current.push(frameTime);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }

    // Calculate metrics every 10 frames
    if (frameTimesRef.current.length >= 10) {
      const avgFrameTime =
        frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      const fps = Math.round(1000 / avgFrameTime);

      // Get memory usage if available
      const performanceWithMemory = performance as Performance & {
        memory?: { usedJSHeapSize: number };
      };
      const memoryUsage = performanceWithMemory.memory
        ? Math.round(performanceWithMemory.memory.usedJSHeapSize / 1024 / 1024)
        : 0;

      const activeAnimations = animationRegistry.current.size;
      const isOptimal =
        fps >= config.targetFPS * 0.9 &&
        avgFrameTime <= 16.67 * 1.1 &&
        memoryUsage <= config.memoryThreshold;

      const shouldReduceAnimations =
        fps < config.targetFPS * 0.7 ||
        activeAnimations > config.maxActiveAnimations ||
        memoryUsage > config.memoryThreshold * 1.2;

      setState(prevState => ({
        ...prevState,
        fps,
        frameTime: Math.round(avgFrameTime * 100) / 100,
        memoryUsage,
        activeAnimations,
        isOptimal,
        shouldReduceAnimations,
      }));
    }

    rafIdRef.current = requestAnimationFrame(monitorPerformance);
  }, [config]);

  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(monitorPerformance);
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [monitorPerformance]);

  // Animation registration system
  const registerAnimation = useCallback(
    (id: string, priority: number): boolean => {
      // Check if we should skip this animation due to performance constraints
      if (state.shouldReduceAnimations && priority < 5) {
        return false; // Skip low-priority animations when performance is poor
      }

      if (animationRegistry.current.size >= config.maxActiveAnimations && priority < 7) {
        return false; // Skip medium-priority animations when at capacity
      }

      animationRegistry.current.set(id, { priority, timestamp: Date.now() });
      return true;
    },
    [state.shouldReduceAnimations, config.maxActiveAnimations]
  );

  const unregisterAnimation = useCallback((id: string) => {
    animationRegistry.current.delete(id);
  }, []);

  const shouldSkipAnimation = useCallback(
    (priority: number): boolean => {
      if (state.shouldReduceAnimations && priority < 5) return true;
      if (animationRegistry.current.size >= config.maxActiveAnimations && priority < 7) return true;
      return false;
    },
    [state.shouldReduceAnimations, config.maxActiveAnimations]
  );

  // Optimized transition generator
  const getOptimizedTransition = useCallback(
    (baseTransition: MotionTransition): MotionTransition => {
      if (state.shouldReduceAnimations) {
        return {
          ...baseTransition,
          duration: (baseTransition.duration ?? 0.5) * 0.5, // Reduce duration by 50%
          ease: 'easeOut', // Use simpler easing
        };
      }

      if (!state.isOptimal) {
        return {
          ...baseTransition,
          duration: (baseTransition.duration ?? 0.5) * 0.75, // Reduce duration by 25%
        };
      }

      return baseTransition;
    },
    [state.shouldReduceAnimations, state.isOptimal]
  );

  // GPU acceleration management
  const enableGPULayer = useCallback(
    (element: HTMLElement) => {
      if (!config.enableGPUAcceleration) return;

      element.style.transform = element.style.transform || 'translateZ(0)';
      element.style.willChange = 'transform, opacity';
      element.style.backfaceVisibility = 'hidden';
    },
    [config.enableGPUAcceleration]
  );

  const disableGPULayer = useCallback((element: HTMLElement) => {
    element.style.willChange = 'auto';
    if (element.style.transform === 'translateZ(0)') {
      element.style.transform = '';
    }
  }, []);

  const contextValue: AnimationOptimizerContextType = {
    state,
    config,
    registerAnimation,
    unregisterAnimation,
    shouldSkipAnimation,
    getOptimizedTransition,
    enableGPULayer,
    disableGPULayer,
  };

  return (
    <AnimationOptimizerContext.Provider value={contextValue}>
      {children}
    </AnimationOptimizerContext.Provider>
  );
}

// Hook to use animation optimizer
export function useAnimationOptimizer() {
  const context = useContext(AnimationOptimizerContext);
  if (!context) {
    throw new Error('useAnimationOptimizer must be used within an AnimationOptimizerProvider');
  }
  return context;
}

// Enhanced hook for optimized animations
export function useOptimizedAnimation(id: string, priority = 5) {
  const { registerAnimation, unregisterAnimation, shouldSkipAnimation, getOptimizedTransition } =
    useAnimationOptimizer();
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const allowed = registerAnimation(id, priority);
    setCanAnimate(allowed);

    return () => {
      unregisterAnimation(id);
    };
  }, [id, priority, registerAnimation, unregisterAnimation]);

  return {
    canAnimate,
    shouldSkip: shouldSkipAnimation(priority),
    optimizeTransition: getOptimizedTransition,
  };
}

// GPU-accelerated motion component wrapper
export function GPUOptimizedMotion({
  children,
  enabled = true,
  ...props
}: {
  children: React.ReactNode;
  enabled?: boolean;
  [key: string]: unknown;
}) {
  const { enableGPULayer, disableGPULayer, config } = useAnimationOptimizer();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element && enabled && config.enableGPUAcceleration) {
      enableGPULayer(element);
      return () => {
        disableGPULayer(element);
      };
    }
    return undefined;
  }, [enabled, enableGPULayer, disableGPULayer, config.enableGPUAcceleration]);

  return (
    <div ref={elementRef} {...props}>
      {children}
    </div>
  );
}

// Animation pool for reusable animations
class AnimationPool {
  private static instance: AnimationPool;
  private pools = new Map<string, Record<string, unknown>[]>();

  static getInstance(): AnimationPool {
    if (!AnimationPool.instance) {
      AnimationPool.instance = new AnimationPool();
    }
    return AnimationPool.instance;
  }

  getAnimation(type: string, config: Record<string, unknown>): Record<string, unknown> {
    const pool = this.pools.get(type) ?? [];
    const animation = pool.pop();

    if (animation) {
      // Reuse existing animation with new config
      return { ...animation, ...config };
    }

    // Create new animation if pool is empty
    return this.createAnimation(type, config);
  }

  returnAnimation(type: string, animation: Record<string, unknown>): void {
    const pool = this.pools.get(type) ?? [];
    if (pool.length < 10) {
      // Limit pool size
      pool.push(animation);
      this.pools.set(type, pool);
    }
  }

  private createAnimation(type: string, config: Record<string, unknown>): Record<string, unknown> {
    // Factory method for creating animations
    switch (type) {
      case 'fadeIn':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5 },
          ...config,
        };
      case 'slideUp':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          ...config,
        };
      default:
        return config;
    }
  }
}

export const animationPool = AnimationPool.getInstance();
