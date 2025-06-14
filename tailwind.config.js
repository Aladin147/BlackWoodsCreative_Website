/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // BlackWoods Creative - Deep Forest Haze Theme
        bw: {
          // Core Background Colors
          'bg-primary': '#101211',      // Near Black with green tint
          'text-primary': '#E8E8E3',    // Off-White, warm and soft
          'text-secondary': '#A8A8A3',  // Muted secondary text
          'accent-gold': '#C3A358',     // Muted Gold, rich ochre

          // Aurora Colors for Background Animation - AUTHENTIC THEME GUIDE
          'aurora-teal': '#0D2E2B',     // Dark Teal - authentic Deep Forest Haze
          'aurora-green': '#1A4230',    // Forest Green - authentic Deep Forest Haze
          'aurora-bright': '#2A5B54',   // Brighter accent for highlights only

          // Utility Colors
          'border-subtle': '#2A2E2C',   // Low-contrast borders

          // Legacy colors for gradual migration
          black: '#101211',             // Updated to match bg-primary
          charcoal: '#0f0f0f',
          'dark-gray': '#1a1a1a',
          'medium-gray': '#2a2a2a',
          'light-gray': '#6a6a6a',
          white: '#E8E8E3',             // Updated to match text-primary
          silver: '#b8b8b8',
          platinum: '#f0f0f0',
          gold: '#C3A358',              // Fixed to match accent-gold
          red: '#cc3333',

          // Enhanced atmospheric colors
          pearl: '#f8f8f8',
          smoke: '#8a8a8a',
          obsidian: '#0a0a0a',
          champagne: '#f7e7ce',

          // Semantic colors
          success: '#28a745',
          warning: '#ffc107',
          error: '#dc3545',
          info: '#17a2b8',
        },
      },
      fontFamily: {
        primary: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Playfair Display', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        // AUTHENTIC THEME GUIDE TYPOGRAPHY SPECIFICATION
        // h1 (Main Headline) - Playfair Display, 4rem, 600 weight, $accent-gold
        'heading-1': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        // h2 (Section Headings) - Playfair Display, 2.5rem, 600 weight, $text-primary
        'heading-2': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        // h3 (Card Titles, Sub-headings) - Inter, 1.5rem, 600 weight
        'heading-3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        // p (Body Text) - Inter, 1rem, 400 weight, line-height 1.6
        'body-text': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        // small (Captions, Meta info) - Inter, 0.875rem, 400 weight
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],

        // Legacy sizes for backward compatibility
        'display-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'body-xl': ['1.25rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],

        // Standard sizes
        '6xl': '3.75rem',
        '5xl': '3rem',
        '4xl': '2.25rem',
        '3xl': '1.875rem',
        '2xl': '1.5rem',
        xl: '1.25rem',
        lg: '1.125rem',
        base: '1rem',
        sm: '0.875rem',
        xs: '0.75rem',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      boxShadow: {
        cinematic: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        glow: '0 0 20px rgba(255, 255, 255, 0.1)',
        'gold-glow': '0 0 30px rgba(168, 230, 207, 0.3)',
      },
      animation: {
        // AUTHENTIC THEME GUIDE ANIMATIONS
        // Transition: opacity 0.8s ease-out, transform 0.6s ease-out
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        // AUTHENTIC THEME GUIDE SCROLL ANIMATIONS
        // Default State: opacity: 0; transform: translateY(20px);
        // Visible State: opacity: 1; transform: translateY(0);
        // Transition: opacity 0.8s ease-out, transform 0.6s ease-out
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
