/**
 * BlackWoods Creative - Enhanced Color System
 * Professional color palette for creative agency branding
 */

export const colors = {
  // Primary Brand Colors - Deep forest theme with sophistication
  primary: {
    50: '#f0f9f4', // Lightest green - for backgrounds
    100: '#dcf4e3', // Very light green - for subtle highlights
    200: '#bbe8cc', // Light green - for hover states
    300: '#86d5a6', // Medium light green - for accents
    400: '#4ade80', // Medium green - for interactive elements
    500: '#22c55e', // Main brand green - primary actions
    600: '#16a34a', // Dark green - primary hover
    700: '#15803d', // Darker green - pressed states
    800: '#166534', // Very dark green - text on light
    900: '#14532d', // Darkest green - headings
    950: '#052e16', // Almost black green - deep contrast
  },

  // Secondary Colors - Warm earth tones for creative warmth
  secondary: {
    50: '#fefdf8', // Warm white
    100: '#fef7e0', // Cream
    200: '#fdecc8', // Light amber
    300: '#fbd89d', // Medium amber
    400: '#f7c065', // Golden amber
    500: '#f59e0b', // Main amber - secondary actions
    600: '#d97706', // Dark amber
    700: '#b45309', // Darker amber
    800: '#92400e', // Very dark amber
    900: '#78350f', // Darkest amber
    950: '#451a03', // Deep amber brown
  },

  // Neutral Colors - Sophisticated grays with warm undertones
  neutral: {
    50: '#fafaf9', // Pure white with warmth
    100: '#f5f5f4', // Off white
    200: '#e7e5e4', // Light gray
    300: '#d6d3d1', // Medium light gray
    400: '#a8a29e', // Medium gray
    500: '#78716c', // Main gray - body text
    600: '#57534e', // Dark gray - secondary text
    700: '#44403c', // Darker gray - headings
    800: '#292524', // Very dark gray - strong contrast
    900: '#1c1917', // Almost black - maximum contrast
    950: '#0c0a09', // Pure black
  },

  // Accent Colors - For highlights and special elements
  accent: {
    blue: {
      500: '#3b82f6', // Professional blue
      600: '#2563eb', // Darker blue
      700: '#1d4ed8', // Deep blue
    },
    purple: {
      500: '#8b5cf6', // Creative purple
      600: '#7c3aed', // Darker purple
      700: '#6d28d9', // Deep purple
    },
    pink: {
      500: '#ec4899', // Vibrant pink
      600: '#db2777', // Darker pink
      700: '#be185d', // Deep pink
    },
    orange: {
      500: '#f97316', // Energetic orange
      600: '#ea580c', // Darker orange
      700: '#c2410c', // Deep orange
    },
  },

  // Semantic Colors - For status and feedback
  semantic: {
    success: {
      50: '#f0fdf4',
      500: '#22c55e', // Success green
      600: '#16a34a',
      700: '#15803d',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b', // Warning amber
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444', // Error red
      600: '#dc2626',
      700: '#b91c1c',
    },
    info: {
      50: '#eff6ff',
      500: '#3b82f6', // Info blue
      600: '#2563eb',
      700: '#1d4ed8',
    },
  },

  // Background Colors - For different sections and contexts
  background: {
    primary: '#fafaf9', // Main background
    secondary: '#f5f5f4', // Secondary sections
    tertiary: '#e7e5e4', // Cards and containers
    dark: '#1c1917', // Dark mode background
    darkSecondary: '#292524', // Dark mode secondary
    overlay: 'rgba(28, 25, 23, 0.8)', // Modal overlays
  },

  // Text Colors - Optimized for readability and hierarchy
  text: {
    primary: '#1c1917', // Main text - high contrast
    secondary: '#44403c', // Secondary text - medium contrast
    tertiary: '#78716c', // Tertiary text - lower contrast
    inverse: '#fafaf9', // Text on dark backgrounds
    muted: '#a8a29e', // Muted text - subtle
    brand: '#15803d', // Brand colored text
    accent: '#22c55e', // Accent text
  },

  // Border Colors - For subtle divisions and outlines
  border: {
    light: '#e7e5e4', // Light borders
    medium: '#d6d3d1', // Medium borders
    dark: '#a8a29e', // Dark borders
    focus: '#22c55e', // Focus states
    error: '#ef4444', // Error borders
    success: '#22c55e', // Success borders
  },

  // Shadow Colors - For depth and elevation
  shadow: {
    sm: 'rgba(28, 25, 23, 0.05)', // Small shadows
    md: 'rgba(28, 25, 23, 0.1)', // Medium shadows
    lg: 'rgba(28, 25, 23, 0.15)', // Large shadows
    xl: 'rgba(28, 25, 23, 0.2)', // Extra large shadows
    colored: 'rgba(34, 197, 94, 0.2)', // Brand colored shadows
  },
} as const;

// Color utility functions
export const colorUtils = {
  // Get color with opacity
  withOpacity: (color: string, opacity: number) => {
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // Get contrasting text color
  getContrastText: (backgroundColor: string) => {
    // Simple contrast calculation - in production, use a proper contrast ratio calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? colors.text.primary : colors.text.inverse;
  },

  // Generate gradient
  gradient: (from: string, to: string, direction = 'to right') => {
    return `linear-gradient(${direction}, ${from}, ${to})`;
  },
};

// CSS Custom Properties for dynamic theming
export const cssVariables = {
  '--color-primary-50': colors.primary[50],
  '--color-primary-500': colors.primary[500],
  '--color-primary-600': colors.primary[600],
  '--color-primary-700': colors.primary[700],
  '--color-primary-900': colors.primary[900],

  '--color-secondary-500': colors.secondary[500],
  '--color-secondary-600': colors.secondary[600],

  '--color-neutral-50': colors.neutral[50],
  '--color-neutral-100': colors.neutral[100],
  '--color-neutral-500': colors.neutral[500],
  '--color-neutral-700': colors.neutral[700],
  '--color-neutral-900': colors.neutral[900],

  '--color-background-primary': colors.background.primary,
  '--color-background-secondary': colors.background.secondary,
  '--color-background-dark': colors.background.dark,

  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-text-inverse': colors.text.inverse,
  '--color-text-brand': colors.text.brand,

  '--color-border-light': colors.border.light,
  '--color-border-focus': colors.border.focus,

  '--shadow-sm': `0 1px 2px 0 ${colors.shadow.sm}`,
  '--shadow-md': `0 4px 6px -1px ${colors.shadow.md}`,
  '--shadow-lg': `0 10px 15px -3px ${colors.shadow.lg}`,
  '--shadow-xl': `0 20px 25px -5px ${colors.shadow.xl}`,
} as const;

// Export types for TypeScript
export type ColorScale = typeof colors.primary;
export type ColorName = keyof typeof colors;
export type SemanticColor = keyof typeof colors.semantic;
