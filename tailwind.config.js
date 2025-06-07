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
        // BlackWoods Creative Brand Colors - Enhanced
        bw: {
          black: '#000000',
          charcoal: '#0f0f0f',
          'dark-gray': '#1a1a1a',
          'medium-gray': '#2a2a2a',
          'light-gray': '#6a6a6a',
          white: '#ffffff',
          silver: '#b8b8b8',
          platinum: '#f0f0f0',
        gold: '#a8e6cf', // Pastel green
          red: '#cc3333',
          // New sophisticated colors
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
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
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
    },
  },
  plugins: [],
};
