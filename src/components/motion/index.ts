/**
 * Motion Components Index - Optimized for Tree Shaking
 * This file provides selective exports for better bundle optimization
 */

// Core motion utilities (always needed)
export * from '../../lib/motion';

// Lightweight motion components (small bundle impact)
export * from './LightweightMotion';

// Lazy motion components (loaded on demand)
export * from './LazyMotionComponents';

// Re-export motion wrapper components
export { MotionDiv, MotionButton, MotionSpan } from '../interactive/MotionWrapper';
