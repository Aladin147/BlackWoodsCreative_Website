/**
 * BlackWoods Creative - Enhanced Spacing & Layout System
 * Professional spacing scale and layout utilities
 */

// Base spacing unit (4px) - All spacing is based on multiples of this
const BASE_UNIT = 4;

// Spacing scale - Consistent spacing throughout the application
export const spacing = {
  // Micro spacing - For fine adjustments
  px: '1px',
  0: '0',
  0.5: `${BASE_UNIT * 0.5}px`, // 2px
  1: `${BASE_UNIT * 1}px`, // 4px
  1.5: `${BASE_UNIT * 1.5}px`, // 6px
  2: `${BASE_UNIT * 2}px`, // 8px
  2.5: `${BASE_UNIT * 2.5}px`, // 10px
  3: `${BASE_UNIT * 3}px`, // 12px
  3.5: `${BASE_UNIT * 3.5}px`, // 14px
  4: `${BASE_UNIT * 4}px`, // 16px
  5: `${BASE_UNIT * 5}px`, // 20px
  6: `${BASE_UNIT * 6}px`, // 24px
  7: `${BASE_UNIT * 7}px`, // 28px
  8: `${BASE_UNIT * 8}px`, // 32px
  9: `${BASE_UNIT * 9}px`, // 36px
  10: `${BASE_UNIT * 10}px`, // 40px
  11: `${BASE_UNIT * 11}px`, // 44px
  12: `${BASE_UNIT * 12}px`, // 48px
  14: `${BASE_UNIT * 14}px`, // 56px
  16: `${BASE_UNIT * 16}px`, // 64px
  20: `${BASE_UNIT * 20}px`, // 80px
  24: `${BASE_UNIT * 24}px`, // 96px
  28: `${BASE_UNIT * 28}px`, // 112px
  32: `${BASE_UNIT * 32}px`, // 128px
  36: `${BASE_UNIT * 36}px`, // 144px
  40: `${BASE_UNIT * 40}px`, // 160px
  44: `${BASE_UNIT * 44}px`, // 176px
  48: `${BASE_UNIT * 48}px`, // 192px
  52: `${BASE_UNIT * 52}px`, // 208px
  56: `${BASE_UNIT * 56}px`, // 224px
  60: `${BASE_UNIT * 60}px`, // 240px
  64: `${BASE_UNIT * 64}px`, // 256px
  72: `${BASE_UNIT * 72}px`, // 288px
  80: `${BASE_UNIT * 80}px`, // 320px
  96: `${BASE_UNIT * 96}px`, // 384px
} as const;

// Semantic spacing - Named spacing for specific use cases
export const semanticSpacing = {
  // Component spacing
  componentPadding: {
    xs: spacing[2], // 8px
    sm: spacing[3], // 12px
    md: spacing[4], // 16px
    lg: spacing[6], // 24px
    xl: spacing[8], // 32px
  },

  // Section spacing
  sectionSpacing: {
    xs: spacing[8], // 32px
    sm: spacing[12], // 48px
    md: spacing[16], // 64px
    lg: spacing[24], // 96px
    xl: spacing[32], // 128px
    xxl: spacing[48], // 192px
  },

  // Content spacing
  contentSpacing: {
    paragraph: spacing[4], // 16px between paragraphs
    heading: spacing[6], // 24px before headings
    list: spacing[2], // 8px between list items
    card: spacing[6], // 24px card padding
    button: spacing[3], // 12px button padding
  },

  // Layout spacing
  layoutSpacing: {
    container: spacing[4], // 16px container padding
    grid: spacing[6], // 24px grid gaps
    navbar: spacing[4], // 16px navbar padding
    sidebar: spacing[6], // 24px sidebar padding
    footer: spacing[8], // 32px footer padding
  },
} as const;

// Container sizes - Maximum widths for different content types
export const containers = {
  xs: '20rem', // 320px - Mobile
  sm: '24rem', // 384px - Small mobile
  md: '28rem', // 448px - Large mobile
  lg: '32rem', // 512px - Tablet
  xl: '36rem', // 576px - Small desktop
  '2xl': '42rem', // 672px - Medium desktop
  '3xl': '48rem', // 768px - Large desktop
  '4xl': '56rem', // 896px - Extra large desktop
  '5xl': '64rem', // 1024px - Full width
  '6xl': '72rem', // 1152px - Ultra wide
  '7xl': '80rem', // 1280px - Maximum width
  full: '100%', // Full width
  screen: '100vw', // Full viewport width
} as const;

// Breakpoints - Responsive design breakpoints
export const breakpoints = {
  xs: '475px', // Extra small devices
  sm: '640px', // Small devices (landscape phones)
  md: '768px', // Medium devices (tablets)
  lg: '1024px', // Large devices (desktops)
  xl: '1280px', // Extra large devices (large desktops)
  '2xl': '1536px', // 2X large devices (larger desktops)
} as const;

// Grid system - Flexible grid configuration
export const grid = {
  columns: 12,
  gap: {
    xs: spacing[2], // 8px
    sm: spacing[4], // 16px
    md: spacing[6], // 24px
    lg: spacing[8], // 32px
    xl: spacing[10], // 40px
  },
  container: {
    padding: {
      xs: spacing[4], // 16px
      sm: spacing[6], // 24px
      md: spacing[8], // 32px
      lg: spacing[12], // 48px
      xl: spacing[16], // 64px
    },
  },
} as const;

// Z-index scale - Consistent layering
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Border radius - Consistent rounded corners
export const borderRadius = {
  none: '0',
  xs: '0.125rem', // 2px
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px', // Fully rounded
} as const;

// Layout utilities
export const layoutUtils = {
  // Center content horizontally and vertically
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Center content horizontally
  centerX: {
    display: 'flex',
    justifyContent: 'center',
  },

  // Center content vertically
  centerY: {
    display: 'flex',
    alignItems: 'center',
  },

  // Flex column layout
  flexCol: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  // Flex row layout
  flexRow: {
    display: 'flex',
    flexDirection: 'row' as const,
  },

  // Space between items
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  // Space around items
  spaceAround: {
    display: 'flex',
    justifyContent: 'space-around',
  },

  // Absolute positioning shortcuts
  absolute: {
    position: 'absolute' as const,
  },

  absoluteCenter: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },

  // Fixed positioning
  fixed: {
    position: 'fixed' as const,
  },

  // Sticky positioning
  sticky: {
    position: 'sticky' as const,
  },

  // Full width and height
  fullSize: {
    width: '100%',
    height: '100%',
  },

  // Aspect ratios
  aspectRatio: {
    square: { aspectRatio: '1 / 1' },
    video: { aspectRatio: '16 / 9' },
    photo: { aspectRatio: '4 / 3' },
    portrait: { aspectRatio: '3 / 4' },
    wide: { aspectRatio: '21 / 9' },
  },
} as const;

// CSS Custom Properties for spacing
export const spacingCSSVariables = {
  '--spacing-xs': semanticSpacing.componentPadding.xs,
  '--spacing-sm': semanticSpacing.componentPadding.sm,
  '--spacing-md': semanticSpacing.componentPadding.md,
  '--spacing-lg': semanticSpacing.componentPadding.lg,
  '--spacing-xl': semanticSpacing.componentPadding.xl,

  '--section-spacing-sm': semanticSpacing.sectionSpacing.sm,
  '--section-spacing-md': semanticSpacing.sectionSpacing.md,
  '--section-spacing-lg': semanticSpacing.sectionSpacing.lg,
  '--section-spacing-xl': semanticSpacing.sectionSpacing.xl,

  '--container-xs': containers.xs,
  '--container-sm': containers.sm,
  '--container-md': containers.md,
  '--container-lg': containers.lg,
  '--container-xl': containers.xl,
  '--container-2xl': containers['2xl'],
  '--container-full': containers.full,

  '--border-radius-sm': borderRadius.sm,
  '--border-radius-md': borderRadius.md,
  '--border-radius-lg': borderRadius.lg,
  '--border-radius-xl': borderRadius.xl,

  '--z-index-dropdown': zIndex.dropdown.toString(),
  '--z-index-modal': zIndex.modal.toString(),
  '--z-index-overlay': zIndex.overlay.toString(),
  '--z-index-tooltip': zIndex.tooltip.toString(),
} as const;

// Responsive utilities
export const responsive = {
  // Generate responsive styles
  breakpoint: (bp: keyof typeof breakpoints, styles: Record<string, unknown>) => ({
    [`@media (min-width: ${breakpoints[bp]})`]: styles,
  }),

  // Mobile-first responsive design helpers
  mobile: (styles: Record<string, unknown>) => styles,
  tablet: (styles: Record<string, unknown>) => responsive.breakpoint('md', styles),
  desktop: (styles: Record<string, unknown>) => responsive.breakpoint('lg', styles),
  wide: (styles: Record<string, unknown>) => responsive.breakpoint('xl', styles),

  // Container queries (when supported)
  container: (size: string, styles: Record<string, unknown>) => ({
    [`@container (min-width: ${size})`]: styles,
  }),
};

// Export types
export type Spacing = keyof typeof spacing;
export type Container = keyof typeof containers;
export type Breakpoint = keyof typeof breakpoints;
export type ZIndex = keyof typeof zIndex;
export type BorderRadius = keyof typeof borderRadius;
