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
        // Enhanced BlackWoods Creative Design System
        primary: {
          50: '#f0f9f4',
          100: '#dcf4e3',
          200: '#bbe8cc',
          300: '#86d5a6',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        secondary: {
          50: '#fefdf8',
          100: '#fef7e0',
          200: '#fdecc8',
          300: '#fbd89d',
          400: '#f7c065',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        background: {
          primary: '#fafaf9',
          secondary: '#f5f5f4',
          tertiary: '#e7e5e4',
          dark: '#1c1917',
          overlay: 'rgba(28, 25, 23, 0.8)',
        },
        text: {
          primary: '#1c1917',
          secondary: '#44403c',
          tertiary: '#78716c',
          inverse: '#fafaf9',
          muted: '#a8a29e',
          brand: '#15803d',
          accent: '#22c55e',
        },
        border: {
          light: '#e7e5e4',
          medium: '#d6d3d1',
          dark: '#a8a29e',
          focus: '#22c55e',
        },

        // Legacy BlackWoods Creative colors (for backward compatibility)
        bw: {
          'bg-primary': '#101211',
          'text-primary': '#E8E8E3',
          'text-secondary': '#A8A8A3',
          'accent-gold': '#C3A358',
          'aurora-teal': '#0F3530',
          'aurora-green': '#1E4A38',
          'aurora-bright': '#2E6B5E',
          'border-subtle': '#2A2E2C',
          black: '#101211',
          charcoal: '#0f0f0f',
          'dark-gray': '#1a1a1a',
          'medium-gray': '#2a2a2a',
          'light-gray': '#6a6a6a',
          white: '#E8E8E3',
          silver: '#b8b8b8',
          platinum: '#f0f0f0',
          gold: '#C3A358',
          red: '#cc3333',
          pearl: '#f8f8f8',
          smoke: '#8a8a8a',
          obsidian: '#0a0a0a',
          champagne: '#f7e7ce',
          success: '#28a745',
          warning: '#ffc107',
          error: '#dc3545',
          info: '#17a2b8',
        },
      },
      fontFamily: {
        primary: [
          'var(--font-primary)',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
        secondary: ['var(--font-secondary)', 'Crimson Text', 'Georgia', 'Times New Roman', 'serif'],
        accent: ['var(--font-accent)', 'Playfair Display', 'Georgia', 'serif'],
        mono: [
          'var(--font-mono)',
          'JetBrains Mono',
          'Fira Code',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
        // Legacy font families (for backward compatibility)
        display: [
          'var(--font-display)',
          'Urbanist',
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      fontSize: {
        // AUTHENTIC THEME GUIDE TYPOGRAPHY SPECIFICATION
        // h1 (Main Headline) - Urbanist Black, 4rem, 900 weight, $accent-gold
        'heading-1': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
        // h2 (Section Headings) - Urbanist Black, 2.5rem, 900 weight, $text-primary
        'heading-2': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '900' }],
        // h3 (Card Titles, Sub-headings) - Inter, 1.5rem, 600 weight
        'heading-3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        // p (Body Text) - Inter, 1rem, 400 weight, line-height 1.6
        'body-text': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        // small (Captions, Meta info) - Inter, 0.875rem, 400 weight
        caption: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],

        // Current implementation classes (keep for compatibility)
        'display-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-md': ['1.5rem', { lineHeight: '1.3' }],
        'body-xl': ['1rem', { lineHeight: '1.6' }],
        'body-lg': ['0.875rem', { lineHeight: '1.5' }],
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
