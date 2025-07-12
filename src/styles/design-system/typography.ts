/**
 * BlackWoods Creative - Enhanced Typography System
 * Professional typography for creative agency branding
 */

// Font families - Professional and modern
export const fontFamilies = {
  // Primary font - Modern sans-serif for headings and UI
  primary: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'sans-serif',
  ].join(', '),

  // Secondary font - Elegant serif for body text and articles
  secondary: ['Crimson Text', 'Georgia', 'Times New Roman', 'serif'].join(', '),

  // Accent font - Creative display font for special headings
  accent: ['Playfair Display', 'Georgia', 'serif'].join(', '),

  // Monospace - For code and technical content
  mono: [
    'JetBrains Mono',
    'Fira Code',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ].join(', '),
} as const;

// Font weights
export const fontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
} as const;

// Font sizes with responsive scaling
export const fontSizes = {
  // Display sizes - For hero sections and major headings
  display: {
    xs: { base: '2.25rem', md: '2.5rem', lg: '3rem' }, // 36px -> 40px -> 48px
    sm: { base: '2.5rem', md: '3rem', lg: '3.75rem' }, // 40px -> 48px -> 60px
    md: { base: '3rem', md: '3.75rem', lg: '4.5rem' }, // 48px -> 60px -> 72px
    lg: { base: '3.75rem', md: '4.5rem', lg: '6rem' }, // 60px -> 72px -> 96px
    xl: { base: '4.5rem', md: '6rem', lg: '8rem' }, // 72px -> 96px -> 128px
  },

  // Heading sizes - For section headings and titles
  heading: {
    h1: { base: '1.875rem', md: '2.25rem', lg: '3rem' }, // 30px -> 36px -> 48px
    h2: { base: '1.5rem', md: '1.875rem', lg: '2.25rem' }, // 24px -> 30px -> 36px
    h3: { base: '1.25rem', md: '1.5rem', lg: '1.875rem' }, // 20px -> 24px -> 30px
    h4: { base: '1.125rem', md: '1.25rem', lg: '1.5rem' }, // 18px -> 20px -> 24px
    h5: { base: '1rem', md: '1.125rem', lg: '1.25rem' }, // 16px -> 18px -> 20px
    h6: { base: '0.875rem', md: '1rem', lg: '1.125rem' }, // 14px -> 16px -> 18px
  },

  // Body sizes - For paragraphs and general content
  body: {
    xl: { base: '1.25rem', md: '1.375rem' }, // 20px -> 22px
    lg: { base: '1.125rem', md: '1.25rem' }, // 18px -> 20px
    md: { base: '1rem', md: '1.125rem' }, // 16px -> 18px
    sm: { base: '0.875rem', md: '1rem' }, // 14px -> 16px
    xs: { base: '0.75rem', md: '0.875rem' }, // 12px -> 14px
  },

  // Utility sizes - For captions, labels, etc.
  caption: '0.75rem', // 12px
  label: '0.875rem', // 14px
  button: '0.875rem', // 14px
  input: '1rem', // 16px
} as const;

// Line heights for optimal readability
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,

  // Specific line heights for different content types
  heading: 1.2,
  body: 1.6,
  caption: 1.4,
} as const;

// Letter spacing for fine typography control
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Typography variants - Pre-defined text styles
export const textVariants = {
  // Display variants
  displayXl: {
    fontFamily: fontFamilies.accent,
    fontSize: fontSizes.display.xl,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  displayLg: {
    fontFamily: fontFamilies.accent,
    fontSize: fontSizes.display.lg,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  displayMd: {
    fontFamily: fontFamilies.accent,
    fontSize: fontSizes.display.md,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal,
  },

  // Heading variants
  h1: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.heading.h1,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.heading,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.heading.h2,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.heading,
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.heading.h3,
    fontWeight: fontWeights.semiBold,
    lineHeight: lineHeights.heading,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.heading.h4,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.heading,
    letterSpacing: letterSpacing.normal,
  },

  // Body variants
  bodyLg: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.body.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },
  bodyMd: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.body.md,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },
  bodySm: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.body.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },

  // UI variants
  button: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.button,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },
  label: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.label,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },
  caption: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.caption,
    letterSpacing: letterSpacing.normal,
  },

  // Special variants
  quote: {
    fontFamily: fontFamilies.accent,
    fontSize: fontSizes.body.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    fontStyle: 'italic',
  },
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.body.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
} as const;

// CSS Custom Properties for typography
export const typographyCSSVariables = {
  '--font-family-primary': fontFamilies.primary,
  '--font-family-secondary': fontFamilies.secondary,
  '--font-family-accent': fontFamilies.accent,
  '--font-family-mono': fontFamilies.mono,

  '--font-weight-normal': fontWeights.normal.toString(),
  '--font-weight-medium': fontWeights.medium.toString(),
  '--font-weight-semibold': fontWeights.semiBold.toString(),
  '--font-weight-bold': fontWeights.bold.toString(),

  '--line-height-heading': lineHeights.heading.toString(),
  '--line-height-body': lineHeights.body.toString(),
  '--line-height-normal': lineHeights.normal.toString(),

  '--letter-spacing-tight': letterSpacing.tight,
  '--letter-spacing-normal': letterSpacing.normal,
  '--letter-spacing-wide': letterSpacing.wide,
} as const;

// Utility functions
export const typographyUtils = {
  // Generate responsive font size CSS
  responsiveFontSize: (sizes: { base: string; md?: string; lg?: string }) => ({
    fontSize: sizes.base,
    ...(sizes.md && {
      '@media (min-width: 768px)': {
        fontSize: sizes.md,
      },
    }),
    ...(sizes.lg && {
      '@media (min-width: 1024px)': {
        fontSize: sizes.lg,
      },
    }),
  }),

  // Calculate optimal line height based on font size
  calculateLineHeight: (
    _fontSize: number,
    contentType: 'heading' | 'body' | 'caption' = 'body'
  ) => {
    const baseLineHeights = {
      heading: 1.2,
      body: 1.6,
      caption: 1.4,
    } as const;
    // Safe object access with type validation
    return baseLineHeights[contentType] ?? baseLineHeights.body;
  },

  // Generate text shadow for better readability on images
  textShadow: (intensity: 'light' | 'medium' | 'strong' = 'medium') => {
    const shadows = {
      light: '0 1px 2px rgba(0, 0, 0, 0.1)',
      medium: '0 2px 4px rgba(0, 0, 0, 0.2)',
      strong: '0 2px 8px rgba(0, 0, 0, 0.3)',
    } as const;
    // Safe object access with fallback
    return shadows[intensity] ?? shadows.medium;
  },
};

// Export types
export type FontFamily = keyof typeof fontFamilies;
export type FontWeight = keyof typeof fontWeights;
export type FontSize = keyof typeof fontSizes;
export type TextVariant = keyof typeof textVariants;
