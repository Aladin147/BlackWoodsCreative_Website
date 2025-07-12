// Interactive Components Export Hub - Optimized for Bundle Size
// This file provides a centralized export point for all interactive components
// Organized by complexity and use case for better tree-shaking and performance

// Core motion wrapper (always needed)
export { MotionDiv, MotionButton, MotionSpan } from './MotionWrapper';

// Lightweight motion components (small bundle impact)
export * from '../motion/LightweightMotion';

// Lazy-loaded heavy components (loaded on demand)
export * from '../motion/LazyMotionComponents';

// Core interactive components
export { MagneticCursor } from './MagneticCursor';

// Critical components that need immediate loading (small bundle impact)
export { ParallaxLayer, ParallaxContainer, MagneticField } from './ParallaxContainer';
export { HoverMagnify, TextReveal } from './MicroInteractions';
export { ScrollReveal, ParallaxText } from './AdvancedScrollAnimations';

// Export missing components as lazy-loaded versions for better performance
export {
  LazyStaggeredGrid as StaggeredGrid,
  LazyCountUp as CountUp,
  LazyFloatingElement as FloatingElement,
  LazyMorphingButton as MorphingButton,
  LazyAdvancedPortfolioFilter as AdvancedPortfolioFilter,
  LazyWebGLEnhancedBackground as WebGLEnhancedBackground,
  LazyGlitchText as GlitchText,
  LazyTypewriterText as TypewriterText,
} from '../motion/LazyMotionComponents';

// Export AtmosphericLayer from ComplexParallaxSystem as lazy component
export { LazyAtmosphericLayer as AtmosphericLayer } from '../motion/LazyMotionComponents';

// Export PulseGlow as Pulse from LightweightMotion
export { Pulse as PulseGlow } from '../motion/LightweightMotion';

// Lightweight atmospheric effects
export { AtmosphericParticles } from './AtmosphericParticles';
export { ScrollFadeIn, StaggeredScrollFadeIn, SectionScrollAnimation } from './ScrollAnimations';

// Note: Heavy components like ComplexParallaxSystem, AdvancedPortfolioFilter,
// and WebGL effects are now available through LazyMotionComponents for better performance
