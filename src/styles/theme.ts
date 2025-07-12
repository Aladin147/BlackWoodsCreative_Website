/**
 * Enhanced Theme Configuration for BlackWoods Creative
 * Professional design system with comprehensive design tokens
 */

import { colors, cssVariables as colorVariables } from './design-system/colors';
import {
  spacing,
  semanticSpacing,
  containers,
  breakpoints,
  grid,
  zIndex,
  borderRadius,
  layoutUtils,
  spacingCSSVariables,
} from './design-system/spacing';
import {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  textVariants,
  typographyCSSVariables,
} from './design-system/typography';

// Enhanced theme with comprehensive design system
export const theme = {
  // Color system
  colors,

  // Typography system
  typography: {
    fontFamilies,
    fontWeights,
    fontSizes,
    lineHeights,
    letterSpacing,
    variants: textVariants,
  },

  // Spacing and layout system
  spacing: {
    scale: spacing,
    semantic: semanticSpacing,
    containers,
    grid,
  },

  // Layout utilities
  layout: {
    breakpoints,
    zIndex,
    borderRadius,
    utils: layoutUtils,
  },

  // Enhanced shadows with multiple variants
  shadows: {
    // Basic shadows
    none: 'none',
    sm: `0 1px 2px 0 ${colors.shadow.sm}`,
    md: `0 4px 6px -1px ${colors.shadow.md}, 0 2px 4px -2px ${colors.shadow.sm}`,
    lg: `0 10px 15px -3px ${colors.shadow.lg}, 0 4px 6px -4px ${colors.shadow.md}`,
    xl: `0 20px 25px -5px ${colors.shadow.xl}, 0 8px 10px -6px ${colors.shadow.lg}`,
    '2xl': `0 25px 50px -12px ${colors.shadow.xl}`,

    // Colored shadows for brand elements
    primary: `0 4px 14px 0 ${colors.shadow.colored}`,
    primaryLg: `0 10px 25px -3px ${colors.shadow.colored}`,

    // Inner shadows
    inner: `inset 0 2px 4px 0 ${colors.shadow.sm}`,
    innerLg: `inset 0 4px 8px 0 ${colors.shadow.md}`,

    // Glow effects
    glow: `0 0 20px ${colors.shadow.colored}`,
    glowLg: `0 0 40px ${colors.shadow.colored}`,
  },

  // Animation system
  animation: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '750ms',
      slowest: '1000ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      // Custom easing curves for professional feel
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      snappy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      gentle: 'cubic-bezier(0.16, 1, 0.3, 1)',
      bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    },
    // Pre-defined transitions
    transitions: {
      default: 'all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fast: 'all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      slow: 'all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transform: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      opacity: 'opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      colors:
        'background-color 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), color 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },

  // Component-specific design tokens
  components: {
    button: {
      padding: {
        sm: `${spacing[2]} ${spacing[3]}`,
        md: `${spacing[3]} ${spacing[4]}`,
        lg: `${spacing[4]} ${spacing[6]}`,
        xl: `${spacing[5]} ${spacing[8]}`,
      },
      borderRadius: {
        sm: borderRadius.sm,
        md: borderRadius.md,
        lg: borderRadius.lg,
        xl: borderRadius.xl,
      },
      fontSize: {
        sm: fontSizes.body.sm,
        md: fontSizes.body.md,
        lg: fontSizes.body.lg,
      },
    },
    card: {
      padding: {
        sm: spacing[4],
        md: spacing[6],
        lg: spacing[8],
      },
      borderRadius: borderRadius.lg,
      shadow: `0 4px 6px -1px ${colors.shadow.md}`,
    },
    input: {
      padding: `${spacing[3]} ${spacing[4]}`,
      borderRadius: borderRadius.md,
      fontSize: fontSizes.body.md,
      borderWidth: '1px',
    },
    modal: {
      borderRadius: borderRadius.xl,
      shadow: `0 25px 50px -12px ${colors.shadow.xl}`,
      backdrop: colors.background.overlay,
    },
  },

  // Responsive design tokens
  responsive: {
    breakpoints,
    containers,
    // Responsive spacing multipliers
    spacingMultipliers: {
      mobile: 1,
      tablet: 1.25,
      desktop: 1.5,
      wide: 1.75,
    },
  },
} as const;

// CSS Custom Properties - Combine all design tokens
export const cssVariables = {
  ...colorVariables,
  ...typographyCSSVariables,
  ...spacingCSSVariables,

  // Animation variables
  '--transition-default': theme.animation.transitions.default,
  '--transition-fast': theme.animation.transitions.fast,
  '--transition-slow': theme.animation.transitions.slow,
  '--transition-transform': theme.animation.transitions.transform,
  '--transition-opacity': theme.animation.transitions.opacity,
  '--transition-colors': theme.animation.transitions.colors,

  // Component variables
  '--button-padding-md': theme.components.button.padding.md,
  '--button-border-radius': theme.components.button.borderRadius.md,
  '--card-padding': theme.components.card.padding.md,
  '--card-border-radius': theme.components.card.borderRadius,
  '--input-padding': theme.components.input.padding,
  '--input-border-radius': theme.components.input.borderRadius,
} as const;

// Theme utilities
export const themeUtils = {
  // Apply CSS variables to root element
  applyCSSVariables: () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      Object.entries(cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  },

  // Get responsive value based on breakpoint
  getResponsiveValue: <T>(values: Partial<Record<keyof typeof breakpoints, T>>, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;

    const width = window.innerWidth;

    if (width >= parseInt(breakpoints['2xl']))
      return values['2xl'] ?? values.xl ?? values.lg ?? values.md ?? values.sm ?? fallback;
    if (width >= parseInt(breakpoints.xl))
      return values.xl ?? values.lg ?? values.md ?? values.sm ?? fallback;
    if (width >= parseInt(breakpoints.lg)) return values.lg ?? values.md ?? values.sm ?? fallback;
    if (width >= parseInt(breakpoints.md)) return values.md ?? values.sm ?? fallback;
    if (width >= parseInt(breakpoints.sm)) return values.sm ?? fallback;

    return fallback;
  },

  // Generate component variants
  createVariants: <T extends Record<string, unknown>>(
    base: T,
    variants: Record<string, Partial<T>>
  ) => {
    return Object.entries(variants).reduce(
      (acc, [key, variant]) => {
        // Safe object assignment with validation
        if (typeof key === 'string' && key.length > 0 && key.length < 100) {
          acc[key] = { ...base, ...variant };
        }
        return acc;
      },
      {} as Record<string, T>
    );
  },

  // Color manipulation utilities
  lighten: (color: string, _amount?: number) => {
    // Simple color lightening - in production, use a proper color manipulation library
    return color; // Placeholder implementation
  },

  darken: (color: string, _amount?: number) => {
    // Simple color darkening - in production, use a proper color manipulation library
    return color; // Placeholder implementation
  },

  // Generate hover states
  generateHoverState: (baseColor: string) => ({
    backgroundColor: baseColor,
    '&:hover': {
      backgroundColor: baseColor, // Would use darken/lighten in real implementation
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows.md,
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: theme.shadows.sm,
    },
  }),
};

// Export types
export type Theme = typeof theme;
export type ThemeColors = typeof colors;
export type ThemeSpacing = typeof spacing;
export type ThemeBreakpoints = typeof breakpoints;
