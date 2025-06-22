# BlackWoods Creative - Technical Documentation

A portfolio website built with Next.js 14, featuring advanced animations, WebGL effects, and accessibility support.

## ✨ Key Features

- **Professional Branding**: Official BlackWoods Creative logo with SVG/PNG fallback support
- **Contact Integration**: Formspree-powered contact form with CSRF protection and validation
- **Modern Design**: Clean, professional aesthetic with forest-inspired theme
- **Interactive Elements**: Smooth animations, magnetic effects, and hover interactions
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Performance Optimized**: Fast loading with Next.js 14 and optimized images
- **Security**: CSRF protection, rate limiting, and input sanitization
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🏗️ Architecture Overview

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom theme system
- **Animations**: Framer Motion + Custom WebGL effects
- **Testing**: Jest + Testing Library + Playwright
- **Performance**: Built-in optimization + custom monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd BlackWoodsCreative-Website

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run start        # Production server
npm run test         # Run test suite
npm run test:watch   # Watch mode testing
npm run test:coverage # Coverage report
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # TypeScript validation
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Homepage with dynamic sections
│   └── sitemap.ts         # SEO sitemap generation
├── components/
│   ├── interactive/       # Advanced animations & effects
│   │   ├── WebGLEffects.tsx      # WebGL aurora/particle systems
│   │   ├── ParallaxContainer.tsx # Scroll-based parallax
│   │   ├── MagneticCursor.tsx    # Interactive cursor effects
│   │   └── ComplexParallaxSystem.tsx # Story-driven animations
│   ├── layout/            # Header, footer, navigation
│   ├── sections/          # Page sections (Hero, Portfolio, etc.)
│   ├── ui/               # Reusable UI components
│   └── seo/              # SEO optimization components
├── context/
│   └── ThemeContext.tsx   # Theme management (dark/light)
├── hooks/                 # Custom React hooks
│   ├── useDeviceAdaptation.ts    # Device-specific optimizations
│   ├── useAnimationPerformance.ts # Performance monitoring
│   └── useScrollProgress.ts      # Scroll tracking
├── lib/
│   ├── utils/            # Utility functions
│   ├── data/             # Static data and configurations
│   └── constants/        # App constants and config
└── __tests__/            # Test suites
```

## 🎨 Theme System

### Deep Forest Haze Theme

- **Primary Colors**: Dark forest greens with gold accents
- **Typography**: Urbanist Bold (headings) + Inter (body)
- **Animations**: Enhanced aurora visibility, sophisticated parallax
- **Responsive**: Mobile-first with device-specific adaptations

### Theme Configuration

```typescript
// Tailwind config with custom theme
const theme = {
  colors: {
    'bw-primary': '#0a0f0a',
    'bw-accent-gold': '#d4af37',
    'bw-forest': '#1a2f1a',
    // ... full color palette
  },
};
```

### Running Tests

```bash
# Full test suite with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Specific test file
npm test -- ContactSection.test.tsx
```

### Monitoring

```typescript
// Performance monitoring hooks
const { metrics } = useAnimationPerformance();
const { deviceInfo } = useDeviceAdaptation();
```

## 🔧 Development Workflow

### Code Quality

- **TypeScript**: Strict mode with comprehensive type safety
- **ESLint**: Custom rules for React/Next.js best practices
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality gates

### Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
git commit -m "feat: description"

# Testing and validation
npm run test
npm run lint
npm run build

# Merge to main
git checkout main
git merge feature/new-feature
```

## 🚀 Deployment

### Production Build

```bash
# Create optimized build
npm run build

# Test production build locally
npm run start
```

### Environment Variables

```env
# Required for production
NEXT_PUBLIC_SITE_URL=https://blackwoodscreative.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🔄 Recent Updates

### Contact Form Integration (Latest)
- **Formspree Integration**: Replaced Resend email service with Formspree endpoint (`https://formspree.io/f/mzzgagbb`)
- **Maintained Security**: All existing CSRF protection, rate limiting, and validation preserved
- **Comprehensive Testing**: Updated test suites to verify Formspree integration
- **Error Handling**: Graceful fallback and user feedback for form submissions

### Logo Implementation (Latest)
- **Official Branding**: Integrated BlackWoods Creative logo from CDN
- **Multi-format Support**: SVG primary with PNG fallback
- **Responsive Design**: Adaptive sizing for different screen sizes and contexts
- **Accessibility**: Proper alt text and ARIA labels for screen readers
- **Performance**: Optimized loading with Next.js Image component
- **Fallback Handling**: Text-based fallback if images fail to load

### Deployment Checklist

- [ ] All tests passing
- [ ] Build successful
- [ ] Performance audit completed
- [ ] Accessibility validation
- [ ] SEO optimization verified
- [ ] Security headers configured

## 📜 License

---

**BlackWoods Creative** - Professional portfolio website showcasing cinema, photography, and 3D artistry with cutting-edge web technologies.
