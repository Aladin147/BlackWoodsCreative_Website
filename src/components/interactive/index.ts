// Advanced Interactive Components - Phase 4
// Optimized for tree shaking and code splitting
import React from 'react';

// Core interactive components
// Temporarily commented out due to import issues - will fix in next step
// export { ScrollStoryTeller } from './ScrollStoryTeller';

// Temporary stub for ScrollStoryTeller only (until we implement it)
interface ScrollStoryTellerProps {
  className?: string;
  children?: React.ReactNode;
}

export const ScrollStoryTeller: React.FC<ScrollStoryTellerProps> = props => {
  return React.createElement(
    'div',
    {
      'data-testid': 'scroll-story-teller',
      className: props.className,
    },
    'ScrollStoryTeller Stub'
  );
};

export { MagneticCursor } from './MagneticCursor';

// Parallax components (heavy - consider dynamic imports)
export {
  ParallaxLayer,
  ParallaxContainer,
  CinematicParallax,
  MagneticField,
  DepthOfField,
} from './ParallaxContainer';

// Micro-interactions (lighter components)
export {
  HoverMagnify,
  TiltCard,
  FloatingElement,
  PulseGlow,
  MorphingButton,
  RippleEffect,
  StaggeredReveal,
  TextReveal,
  GlitchText,
  TypewriterText,
} from './MicroInteractions';

// Deep Forest Haze atmospheric effects
export { AtmosphericParticles } from './AtmosphericParticles';
export { ScrollFadeIn, StaggeredScrollFadeIn, SectionScrollAnimation } from './ScrollAnimations';

// Phase 2: Advanced Scroll Animations
export {
  ScrollReveal,
  ParallaxText,
  ScrollProgressBar,
  CountUp,
  StaggeredGrid,
  MorphingShape,
  ScrollTriggeredCounter,
} from './AdvancedScrollAnimations';

// Phase 2: Advanced Portfolio Features
export { AdvancedPortfolioFilter } from './AdvancedPortfolioFilter';

// Phase 2: Complex Parallax Systems
export {
  ComplexParallaxSystem,
  CinematicParallaxScene,
  ParallaxStorySequence,
  AtmosphericLayer,
} from './ComplexParallaxSystem';

// Phase 2: WebGL Effects
export { WebGLAuroraEffect, WebGLParticleSystem, WebGLEnhancedBackground } from './WebGLEffects';

// Future exports for Phase 4 expansion:
// export { ThreeDScene } from './ThreeDScene';
// export { AudioVisualizer } from './AudioVisualizer';
// export { WebGLEffects } from './WebGLEffects';
