'use client';

import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  animationCount: number;
  isOptimal: boolean;
}

interface AnimationPerformanceConfig {
  targetFPS: number;
  maxFrameTime: number;
  enableLogging: boolean;
  sampleSize: number;
}

const defaultConfig: AnimationPerformanceConfig = {
  targetFPS: 60,
  maxFrameTime: 16.67, // 60fps = 16.67ms per frame
  enableLogging: false,
  sampleSize: 60 // Sample over 1 second at 60fps
};

export function useAnimationPerformance(config: Partial<AnimationPerformanceConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    animationCount: 0,
    isOptimal: true
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const animationFrameRef = useRef<number>();
  const animationCountRef = useRef<number>(0);

  const measureFrame = () => {
    const now = performance.now();
    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    // Add frame time to our sample
    frameTimesRef.current.push(frameTime);
    
    // Keep only the last N samples
    if (frameTimesRef.current.length > finalConfig.sampleSize) {
      frameTimesRef.current.shift();
    }

    // Calculate metrics every few frames
    if (frameTimesRef.current.length >= 10) {
      const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      const fps = Math.round(1000 / avgFrameTime);
      
      // Get memory usage if available
      const performanceWithMemory = performance as Performance & {
        memory?: { usedJSHeapSize: number }
      };
      const memoryUsage = performanceWithMemory.memory
        ? Math.round(performanceWithMemory.memory.usedJSHeapSize / 1024 / 1024)
        : 0;

      const isOptimal = fps >= finalConfig.targetFPS * 0.9 && avgFrameTime <= finalConfig.maxFrameTime * 1.1;

      const newMetrics: PerformanceMetrics = {
        fps,
        frameTime: Math.round(avgFrameTime * 100) / 100,
        memoryUsage,
        animationCount: animationCountRef.current,
        isOptimal
      };

      setMetrics(newMetrics);

      if (finalConfig.enableLogging && !isOptimal) {
        console.warn('Animation Performance Warning:', newMetrics);
      }
    }

    animationFrameRef.current = requestAnimationFrame(measureFrame);
  };

  const registerAnimation = () => {
    animationCountRef.current++;
  };

  const unregisterAnimation = () => {
    animationCountRef.current = Math.max(0, animationCountRef.current - 1);
  };

  const getOptimizationSuggestions = (): string[] => {
    const suggestions: string[] = [];
    
    if (metrics.fps < finalConfig.targetFPS * 0.8) {
      suggestions.push('Consider reducing animation complexity or frequency');
    }
    
    if (metrics.frameTime > finalConfig.maxFrameTime * 1.5) {
      suggestions.push('Frame time is high - consider using transform3d for GPU acceleration');
    }
    
    if (metrics.animationCount > 20) {
      suggestions.push('High animation count - consider animation pooling or virtualization');
    }
    
    if (metrics.memoryUsage > 100) {
      suggestions.push('High memory usage - check for animation memory leaks');
    }

    return suggestions;
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(measureFrame);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    metrics,
    registerAnimation,
    unregisterAnimation,
    getOptimizationSuggestions,
    isMonitoring: !!animationFrameRef.current
  };
}

// Hook for individual animation components to register themselves
export function useAnimationRegistration() {
  const performanceContext = useAnimationPerformance();
  
  useEffect(() => {
    performanceContext.registerAnimation();
    
    return () => {
      performanceContext.unregisterAnimation();
    };
  }, []);

  return performanceContext;
}

// Performance monitoring component for development
export function AnimationPerformanceMonitor({}: {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  // Temporarily return null to fix build - component disabled due to className corruption issues
  return null;
}
