'use client';

import { useRef, useEffect, useState, useMemo, ReactNode } from 'react';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

import { useAnimationPerformance } from '@/hooks/useAnimationPerformance';
import { useDeviceAdaptation } from '@/hooks/useDeviceAdaptation';

interface ParallaxLayer {
  id: string;
  speed: number;
  depth: number;
  opacity?: MotionValue<number>;
  scale?: MotionValue<number>;
  blur?: MotionValue<number>;
  y?: MotionValue<number>;
  children: ReactNode;
  className?: string;
}

interface ComplexParallaxSystemProps {
  layers: Omit<ParallaxLayer, 'opacity' | 'scale' | 'blur' | 'y'>[];
  height?: string;
  className?: string;
  enableDepthOfField?: boolean;
  storyTriggers?: {
    position: number; // 0-1 scroll position
    action: () => void;
    id: string;
  }[];
}

export function ComplexParallaxSystem({
  layers,
  height = '200vh',
  className = '',
  enableDepthOfField = true,
  storyTriggers = [],
}: ComplexParallaxSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [triggeredStories, setTriggeredStories] = useState<Set<string>>(new Set());
  const { shouldEnableFeature } = useDeviceAdaptation();
  const { registerAnimation, unregisterAnimation } = useAnimationPerformance();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Smooth spring physics for parallax
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 40,
    restDelta: 0.001,
  });

  // Create all transforms at the component level to avoid hook violations
  // Base shared transforms
  const baseOpacityTransform = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);
  const staticOpacityTransform = useTransform(smoothProgress, [0, 1], [1, 1]);
  const staticScaleTransform = useTransform(smoothProgress, [0, 1], [1, 1]);
  const staticBlurTransform = useTransform(smoothProgress, [0, 1], [0, 0]);
  const staticBlurFilter = useTransform(staticBlurTransform, value => `blur(${value}px)`);

  // Pre-compute y transforms for each layer to avoid hook violations in render
  // Create transforms for common speed values to avoid calling hooks in loops
  const slowTransform = useTransform(smoothProgress, [0, 1], [0, -20]);
  const mediumTransform = useTransform(smoothProgress, [0, 1], [0, -50]);
  const fastTransform = useTransform(smoothProgress, [0, 1], [0, -80]);
  const veryFastTransform = useTransform(smoothProgress, [0, 1], [0, -120]);

  // Create enhanced layers with all transforms pre-computed
  const enhancedLayers = useMemo(() => {
    // Function to get appropriate transform based on speed
    const getTransformForSpeed = (speed: number) => {
      if (speed <= 0.3) return slowTransform;
      if (speed <= 0.6) return mediumTransform;
      if (speed <= 0.9) return fastTransform;
      return veryFastTransform;
    };

    return layers.map(layer => ({
      ...layer,
      opacity: enableDepthOfField ? baseOpacityTransform : staticOpacityTransform,
      scale: staticScaleTransform,
      blur: staticBlurTransform,
      blurFilter: staticBlurFilter,
      y: getTransformForSpeed(layer.speed),
    }));
  }, [
    layers,
    enableDepthOfField,
    baseOpacityTransform,
    staticOpacityTransform,
    staticScaleTransform,
    staticBlurTransform,
    staticBlurFilter,
    slowTransform,
    mediumTransform,
    fastTransform,
    veryFastTransform,
  ]);

  // Story trigger system with performance monitoring
  useEffect(() => {
    if (!shouldEnableFeature('enableComplexAnimations')) return;

    registerAnimation(); // Register this parallax system

    const unsubscribe = smoothProgress.on('change', progress => {
      storyTriggers.forEach(trigger => {
        if (
          progress >= trigger.position &&
          progress <= trigger.position + 0.1 &&
          !triggeredStories.has(trigger.id)
        ) {
          trigger.action();
          setTriggeredStories(prev => new Set(Array.from(prev).concat(trigger.id)));
        }
      });
    });

    return () => {
      unsubscribe();
      unregisterAnimation(); // Unregister on cleanup
    };
  }, [
    smoothProgress,
    storyTriggers,
    triggeredStories,
    shouldEnableFeature,
    registerAnimation,
    unregisterAnimation,
  ]);

  if (!shouldEnableFeature('enableParallax')) {
    // Fallback for devices that don't support parallax
    return (
      <div className={`relative ${className}`} style={{ height }}>
        {layers.map(layer => (
          <div key={layer.id} className={`absolute inset-0 ${layer.className ?? ''}`}>
            {layer.children}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={{ height }}>
      {enhancedLayers.map(layer => (
        <motion.div
          key={layer.id}
          className={`parallax-element animate-optimized absolute inset-0 ${layer.className ?? ''}`}
          style={{
            y: layer.y,
            opacity: layer.opacity,
            scale: layer.scale,
            filter: layer.blurFilter,
            zIndex: Math.round((1 - layer.depth) * 100),
          }}
        >
          {layer.children}
        </motion.div>
      ))}

      {/* Scroll progress indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="fixed right-4 top-20 z-50 h-32 w-2 rounded-full bg-bw-border-subtle"
          style={{
            scaleY: smoothProgress,
          }}
        />
      )}
    </div>
  );
}

// Cinematic parallax scene for storytelling
export function CinematicParallaxScene({
  title,
  subtitle,
  backgroundLayers,
  foregroundElements,
  className = '',
}: {
  title: string;
  subtitle?: string;
  backgroundLayers: ReactNode[];
  foregroundElements?: ReactNode[];
  className?: string;
}) {
  const { shouldEnableFeature } = useDeviceAdaptation();

  const parallaxLayers = [
    // Background layers (slowest)
    ...backgroundLayers.map((layer, index) => ({
      id: `bg-${index}`,
      speed: 0.2 + index * 0.1,
      depth: 0.8 + index * 0.1,
      children: layer,
      className: 'opacity-60',
    })),

    // Content layer (medium speed)
    {
      id: 'content',
      speed: 0.5,
      depth: 0.5,
      children: (
        <div className="flex h-full items-center justify-center">
          <div className="max-w-4xl px-6 text-center">
            <motion.h2
              className="mb-6 text-display-lg font-bold text-bw-text-primary"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
            >
              {title}
            </motion.h2>
            {subtitle && (
              <motion.p
                className="text-body-xl text-bw-text-secondary"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>
      ),
    },

    // Foreground elements (fastest)
    ...(foregroundElements?.map((element, index) => ({
      id: `fg-${index}`,
      speed: 0.8 + index * 0.1,
      depth: 0.1 + index * 0.05,
      children: element,
      className: 'pointer-events-none',
    })) ?? []),
  ];

  const storyTriggers = [
    {
      position: 0.2,
      action: () => {
        // Story chapter 1 trigger - placeholder for future implementation
      },
      id: 'chapter-1',
    },
    {
      position: 0.5,
      action: () => {
        // Story climax trigger - placeholder for future implementation
      },
      id: 'climax',
    },
    {
      position: 0.8,
      action: () => {
        // Story conclusion trigger - placeholder for future implementation
      },
      id: 'conclusion',
    },
  ];

  return (
    <ComplexParallaxSystem
      layers={parallaxLayers}
      height="150vh"
      className={className}
      enableDepthOfField={Boolean(shouldEnableFeature('enableComplexAnimations'))}
      storyTriggers={storyTriggers}
    />
  );
}

// Multi-scene parallax storytelling
export function ParallaxStorySequence({
  scenes,
  className = '',
}: {
  scenes: {
    id: string;
    title: string;
    subtitle?: string;
    backgroundLayers: ReactNode[];
    foregroundElements?: ReactNode[];
    duration?: string;
  }[];
  className?: string;
}) {
  return (
    <div className={`space-y-0 ${className}`}>
      {scenes.map((scene, index) => (
        <CinematicParallaxScene
          key={scene.id}
          title={scene.title}
          {...(scene.subtitle && { subtitle: scene.subtitle })}
          backgroundLayers={scene.backgroundLayers}
          {...(scene.foregroundElements && { foregroundElements: scene.foregroundElements })}
          className={index > 0 ? '-mt-32' : ''} // Overlap scenes for seamless flow
        />
      ))}
    </div>
  );
}

// Atmospheric background layers for storytelling
export function AtmosphericLayer({
  type,
  intensity = 0.5,
  color = 'bw-aurora-teal',
  className = '',
}: {
  type: 'mist' | 'particles' | 'gradient' | 'orbs';
  intensity?: number;
  color?: string;
  className?: string;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const baseClasses = `absolute inset-0 pointer-events-none ${className}`;

  // ✅ Fixed deterministic values using integer-based calculation to prevent hydration issues
  const getDeterministicValue = (seed: number, min: number, max: number): number => {
    // Use a simple linear congruential generator for consistent results
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    const normalized = ((a * seed + c) % m) / m;
    return min + normalized * (max - min);
  };

  // ✅ Don't render dynamic components on server to prevent hydration mismatch
  if (!isClient && (type === 'particles' || type === 'orbs')) {
    return <div className={baseClasses} />;
  }

  switch (type) {
    case 'mist':
      return (
        <div className={baseClasses}>
          <motion.div
            className={`absolute inset-0 bg-gradient-to-t from-${color}/20 via-transparent to-${color}/10`}
            animate={{
              opacity: [intensity * 0.5, intensity, intensity * 0.7],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      );

    case 'particles':
      return (
        <div className={baseClasses}>
          {Array.from({ length: Math.round(80 * intensity) }).map((_, i) => {
            // Use deterministic positioning based on index
            const leftPos = getDeterministicValue(i * 7, 0, 100);
            const topPos = getDeterministicValue(i * 11, 0, 100);
            const duration = getDeterministicValue(i * 13, 10, 20);
            const delay = getDeterministicValue(i * 17, 0, 5);

            return (
              <motion.div
                key={i}
                className={`absolute h-1 w-1 bg-${color} rounded-full opacity-60`}
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                }}
                suppressHydrationWarning
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, intensity, 0],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: 'linear',
                }}
              />
            );
          })}
        </div>
      );

    case 'gradient':
      return (
        <div className={baseClasses}>
          <div
            className={`absolute inset-0 bg-gradient-radial from-${color}/${Math.round(intensity * 30)} via-transparent to-transparent`}
          />
        </div>
      );

    case 'orbs':
      return (
        <div className={baseClasses}>
          {Array.from({ length: Math.round(5 * intensity) }).map((_, i) => {
            // Use deterministic values based on index
            const width = 100 + getDeterministicValue(i * 19, 0, 200);
            const height = 100 + getDeterministicValue(i * 23, 0, 200);
            const leftPos = getDeterministicValue(i * 29, 0, 100);
            const topPos = getDeterministicValue(i * 31, 0, 100);
            const xMovement = getDeterministicValue(i * 37, -25, 25);
            const yMovement = getDeterministicValue(i * 41, -15, 15);
            const duration = getDeterministicValue(i * 43, 12, 20);
            const delay = getDeterministicValue(i * 47, 0, 3);

            return (
              <motion.div
                key={i}
                className={`absolute rounded-full bg-${color} blur-xl`}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  opacity: intensity * 0.3,
                }}
                suppressHydrationWarning
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [intensity * 0.2, intensity * 0.4, intensity * 0.2],
                  x: [0, xMovement, 0],
                  y: [0, yMovement, 0],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay,
                }}
              />
            );
          })}
        </div>
      );

    default:
      return null;
  }
}
