// Advanced Interactive Components - Phase 4
// Optimized for tree shaking and code splitting

// Core interactive components
export { ScrollStoryTeller } from './ScrollStoryTeller';
export { MagneticCursor } from './MagneticCursor';

// Parallax components (heavy - consider dynamic imports)
export {
  ParallaxLayer,
  ParallaxContainer,
  CinematicParallax,
  MagneticField,
  DepthOfField
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
  ScrollTriggeredCounter
} from './AdvancedScrollAnimations';

// Phase 2: Advanced Portfolio Features
export { AdvancedPortfolioFilter } from './AdvancedPortfolioFilter';

// Future exports for Phase 4 expansion:
// export { ThreeDScene } from './ThreeDScene';
// export { AudioVisualizer } from './AudioVisualizer';
// export { WebGLEffects } from './WebGLEffects';
