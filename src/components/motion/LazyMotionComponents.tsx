/**
 * Lazy-loaded motion components for better bundle optimization
 * These components are loaded only when needed to reduce initial bundle size
 */

'use client';

import React from 'react';

import dynamic from 'next/dynamic';

// Lightweight fallback component
const MotionFallback = ({ children }: { children: React.ReactNode }) => (
  <div className="animate-pulse opacity-0">{children}</div>
);

// Lazy load heavy parallax components
export const LazyParallaxContainer = dynamic(
  () =>
    import('../interactive/ParallaxContainer').then(mod => ({ default: mod.ParallaxContainer })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false, // Disable SSR for performance-heavy components
  }
);

export const LazyParallaxLayer = dynamic(
  () => import('../interactive/ParallaxContainer').then(mod => ({ default: mod.ParallaxLayer })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyCinematicParallax = dynamic(
  () =>
    import('../interactive/ParallaxContainer').then(mod => ({ default: mod.CinematicParallax })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyMagneticField = dynamic(
  () => import('../interactive/ParallaxContainer').then(mod => ({ default: mod.MagneticField })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

// Lazy load complex scroll animations
export const LazyScrollReveal = dynamic(
  () =>
    import('../interactive/AdvancedScrollAnimations').then(mod => ({ default: mod.ScrollReveal })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyParallaxText = dynamic(
  () =>
    import('../interactive/AdvancedScrollAnimations').then(mod => ({ default: mod.ParallaxText })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyScrollProgressBar = dynamic(
  () =>
    import('../interactive/AdvancedScrollAnimations').then(mod => ({
      default: mod.ScrollProgressBar,
    })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyCountUp = dynamic(
  () => import('../interactive/AdvancedScrollAnimations').then(mod => ({ default: mod.CountUp })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyStaggeredGrid = dynamic(
  () =>
    import('../interactive/AdvancedScrollAnimations').then(mod => ({ default: mod.StaggeredGrid })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyMorphingShape = dynamic(
  () =>
    import('../interactive/AdvancedScrollAnimations').then(mod => ({ default: mod.MorphingShape })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

// Lazy load micro-interactions
export const LazyHoverMagnify = dynamic(
  () => import('../interactive/MicroInteractions').then(mod => ({ default: mod.HoverMagnify })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyTiltCard = dynamic(
  () => import('../interactive/MicroInteractions').then(mod => ({ default: mod.TiltCard })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyFloatingElement = dynamic(
  () => import('../interactive/MicroInteractions').then(mod => ({ default: mod.FloatingElement })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyMorphingButton = dynamic(
  () => import('../interactive/MicroInteractions').then(mod => ({ default: mod.MorphingButton })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyTextReveal = dynamic(
  () => import('../interactive/MicroInteractions').then(mod => ({ default: mod.TextReveal })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyGlitchText = dynamic(
  () => import('../interactive/MicroInteractions').then(mod => ({ default: mod.GlitchText })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyTypewriterText = dynamic(
  () => import('../interactive/MicroInteractions').then(mod => ({ default: mod.TypewriterText })),
  {
    loading: () => (
      <MotionFallback>
        <div />
      </MotionFallback>
    ),
    ssr: false,
  }
);

// Lazy load complex systems
export const LazyComplexParallaxSystem = dynamic(
  () =>
    import('../interactive/ComplexParallaxSystem').then(mod => ({
      default: mod.ComplexParallaxSystem,
    })),
  {
    loading: () => (
      <MotionFallback>
        <div className="h-screen" />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyCinematicParallaxScene = dynamic(
  () =>
    import('../interactive/ComplexParallaxSystem').then(mod => ({
      default: mod.CinematicParallaxScene,
    })),
  {
    loading: () => (
      <MotionFallback>
        <div className="h-screen" />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyParallaxStorySequence = dynamic(
  () =>
    import('../interactive/ComplexParallaxSystem').then(mod => ({
      default: mod.ParallaxStorySequence,
    })),
  {
    loading: () => (
      <MotionFallback>
        <div className="h-screen" />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyAtmosphericLayer = dynamic(
  () =>
    import('../interactive/ComplexParallaxSystem').then(mod => ({ default: mod.AtmosphericLayer })),
  {
    loading: () => (
      <MotionFallback>
        <div className="h-screen" />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyAdvancedPortfolioFilter = dynamic(
  () =>
    import('../interactive/AdvancedPortfolioFilter').then(mod => ({
      default: mod.AdvancedPortfolioFilter,
    })),
  {
    loading: () => (
      <MotionFallback>
        <div className="h-64" />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyScrollStoryTeller = dynamic(
  () =>
    import('../interactive/ScrollStoryTeller').then(mod => ({ default: mod.ScrollStoryTeller })),
  {
    loading: () => (
      <MotionFallback>
        <div className="h-screen" />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyWebGLEnhancedBackground = dynamic(
  () =>
    import('../interactive/WebGLEffects').then(mod => ({ default: mod.WebGLEnhancedBackground })),
  {
    loading: () => (
      <MotionFallback>
        <div className="absolute inset-0" />
      </MotionFallback>
    ),
    ssr: false,
  }
);

export const LazyMagneticCursor = dynamic(
  () => import('../interactive/MagneticCursor').then(mod => ({ default: mod.MagneticCursor })),
  {
    loading: () => null, // No fallback needed for cursor
    ssr: false,
  }
);

// Utility function to conditionally load heavy components based on device capabilities
export const ConditionalMotionComponent = ({
  children,
  fallback,
  condition = true,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  condition?: boolean;
}) => {
  if (!condition) {
    return fallback ?? children;
  }

  return children;
};

// Hook to determine if heavy animations should be loaded
export const useHeavyAnimationsEnabled = () => {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    // Check device capabilities
    const hasGoodPerformance = () => {
      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return false;
      }

      // Check device memory (if available)
      const { deviceMemory } = navigator as unknown as { deviceMemory?: number };
      if (deviceMemory && deviceMemory < 4) {
        return false;
      }

      // Check connection speed (if available)
      const { connection } = navigator as unknown as { connection?: { effectiveType?: string } };
      if (
        connection &&
        (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      ) {
        return false;
      }

      return true;
    };

    setEnabled(hasGoodPerformance());
  }, []);

  return enabled;
};

// Export all lazy components
export const LazyMotionComponents = {
  ParallaxContainer: LazyParallaxContainer,
  ParallaxLayer: LazyParallaxLayer,
  CinematicParallax: LazyCinematicParallax,
  MagneticField: LazyMagneticField,
  ScrollReveal: LazyScrollReveal,
  ParallaxText: LazyParallaxText,
  ScrollProgressBar: LazyScrollProgressBar,
  CountUp: LazyCountUp,
  StaggeredGrid: LazyStaggeredGrid,
  MorphingShape: LazyMorphingShape,
  HoverMagnify: LazyHoverMagnify,
  TiltCard: LazyTiltCard,
  FloatingElement: LazyFloatingElement,
  MorphingButton: LazyMorphingButton,
  TextReveal: LazyTextReveal,
  GlitchText: LazyGlitchText,
  TypewriterText: LazyTypewriterText,
  ComplexParallaxSystem: LazyComplexParallaxSystem,
  CinematicParallaxScene: LazyCinematicParallaxScene,
  ParallaxStorySequence: LazyParallaxStorySequence,
  AtmosphericLayer: LazyAtmosphericLayer,
  AdvancedPortfolioFilter: LazyAdvancedPortfolioFilter,
  ScrollStoryTeller: LazyScrollStoryTeller,
  WebGLEnhancedBackground: LazyWebGLEnhancedBackground,
  MagneticCursor: LazyMagneticCursor,
};
