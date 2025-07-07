# BlackWoods Creative - Technical Documentation

A professional portfolio website built with Next.js 14, featuring advanced animations, WebGL effects, comprehensive security, and enterprise-level accessibility support.

## ✨ Key Features

- **Professional Branding**: Official BlackWoods Creative logo with SVG/PNG fallback support
- **Contact Integration**: Formspree-powered contact form with comprehensive CSRF protection and validation
- **Modern Design**: Clean, professional aesthetic with forest-inspired theme and dark/light mode support
- **Interactive Elements**: Advanced WebGL effects, magnetic cursor, atmospheric particles, and smooth animations
- **Responsive Layout**: Mobile-first design optimized for all devices and screen sizes
- **Performance Optimized**: Bundle-optimized with dynamic imports, Core Web Vitals monitoring, and device-specific adaptations
- **Enterprise Security**: Production-ready CSRF protection, rate limiting, security headers, and input sanitization
- **Accessibility Excellence**: WCAG Level AA compliant with comprehensive keyboard navigation and screen reader support
- **SEO Optimized**: Structured data, sitemap generation, and search engine optimization
- **Testing Infrastructure**: Comprehensive test suite with Jest, Testing Library, and Playwright E2E testing

## 🏗️ Architecture Overview

### Tech Stack

- **Framework**: Next.js 14 with App Router and React 18
- **Language**: TypeScript (strict mode with comprehensive type safety)
- **Styling**: Tailwind CSS with custom theme system and CSS-in-JS
- **Animations**: Framer Motion + Custom WebGL effects + Three.js
- **Testing**: Jest + Testing Library + Playwright E2E (comprehensive test suite)
- **Performance**: Bundle optimization, Core Web Vitals monitoring, device adaptation
- **Security**: CSRF protection, rate limiting, security headers, input sanitization
- **Accessibility**: WCAG Level AA compliance with comprehensive testing
- **SEO**: Structured data, sitemap generation, meta optimization

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
npm run test         # Run test suite (1597 tests)
npm run test:watch   # Watch mode testing
npm run test:coverage # Coverage report
npm run test:e2e     # Playwright E2E tests
npm run lint         # ESLint check (0 violations)
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # TypeScript validation (strict mode)
npm run analyze      # Bundle size analysis
npm run security     # Security audit
npm run accessibility # Accessibility testing
```

## 📁 Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Homepage with dynamic sections
│   ├── sitemap.ts         # SEO sitemap generation
│   └── api/               # API routes (contact form, etc.)
├── components/
│   ├── interactive/       # Advanced animations & effects
│   │   ├── WebGLEffects.tsx      # WebGL aurora/particle systems
│   │   ├── ParallaxContainer.tsx # Scroll-based parallax
│   │   ├── MagneticCursor.tsx    # Interactive cursor effects
│   │   └── ComplexParallaxSystem.tsx # Story-driven animations
│   ├── layout/            # Header, footer, navigation
│   ├── sections/          # Page sections (Hero, Portfolio, Contact)
│   ├── ui/               # Reusable UI components
│   └── seo/              # SEO optimization components
├── context/
│   └── ThemeContext.tsx   # Theme management (dark/light)
├── hooks/                 # Custom React hooks
│   ├── useDeviceAdaptation.ts    # Device-specific optimizations
│   ├── useAnimationPerformance.ts # Performance monitoring
│   ├── useScrollProgress.ts      # Scroll tracking
│   └── useAccessibility.ts      # Accessibility utilities
├── lib/
│   ├── utils/            # Utility functions & security
│   ├── data/             # Static data and configurations
│   ├── config/           # Configuration files
│   ├── testing/          # Testing utilities & mocks
│   └── constants/        # App constants and config
├── middleware.ts          # Security middleware & rate limiting
└── __tests__/            # Comprehensive test suites (1597 tests)
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

## 🧪 Testing & Quality Assurance

### Test Suite Overview

- **Total Tests**: 1597 tests across 72 test suites
- **Coverage**: Comprehensive unit, integration, and E2E testing
- **Test Types**: Component tests, utility tests, security tests, accessibility tests
- **E2E Testing**: Playwright for end-to-end validation

### Running Tests

```bash
# Full test suite with coverage (1597 tests)
npm run test:coverage

# Watch mode for development
npm run test:watch

# Specific test categories
npm test -- --testPathPattern="security"
npm test -- --testPathPattern="accessibility"
npm test -- --testPathPattern="performance"

# E2E testing with Playwright
npm run test:e2e

# Specific test file
npm test -- ContactSection.test.tsx
```

### Quality Metrics

- **ESLint**: 0 violations (strict mode)
- **TypeScript**: Strict mode compliance
- **Security**: 104/104 security tests passing
- **Accessibility**: 89/89 accessibility tests passing
- **Performance**: 193/193 performance tests passing

### Monitoring & Analytics

```typescript
// Performance monitoring hooks
const { metrics } = useAnimationPerformance();
const { deviceInfo } = useDeviceAdaptation();
const { accessibilityFeatures } = useAccessibility();

// Core Web Vitals tracking
const { lcp, fid, cls } = useWebVitals();
```

## 🔒 Security & Performance Features

### Security Implementation

- **CSRF Protection**: Token-based protection with secure cookie handling
- **Rate Limiting**: Redis-based with fallback (API: 100/15min, Contact: 5/10min)
- **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Input Sanitization**: XSS and injection protection
- **Security Middleware**: Production-ready with comprehensive logging

### Performance Optimization

- **Bundle Analysis**: Dynamic imports and code splitting
- **Core Web Vitals**: LCP, FID, CLS, FCP, TTFB, INP monitoring
- **Device Adaptation**: Mobile-specific optimizations and GPU detection
- **WebGL Performance**: Particle count adaptation and performance degradation detection
- **Memory Management**: Heap size tracking and optimization

### Accessibility Features

- **WCAG Level AA**: Comprehensive compliance with AAA features
- **Keyboard Navigation**: Full support for Tab, Shift+Tab, Arrow keys, Enter/Space/Escape
- **Screen Reader**: ARIA labels, landmarks, live regions, announcements
- **Focus Management**: Focus trap, restoration, visible indicators
- **Color Accessibility**: Contrast validation and color-blind friendly design

## 🔧 Development Workflow

### Code Quality

- **TypeScript**: Strict mode with comprehensive type safety (0 errors)
- **ESLint**: Custom rules for React/Next.js best practices (0 violations)
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality gates
- **Testing**: Comprehensive test suite with 1597 tests

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

# Optional: Redis for rate limiting (Upstash)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Optional: Enhanced monitoring
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ACCESSIBILITY_FEATURES=true
```

## 🔄 Recent Updates & Current Status

### Code Quality & Performance Audit (Latest)

- **ESLint Status**: ✅ 0 violations across all files (strict mode)
- **TypeScript**: ✅ Strict mode compliance with comprehensive type safety
- **Test Coverage**: ✅ 1597/1597 tests passing across 72 test suites
- **Bundle Optimization**: ✅ 218 kB homepage bundle with dynamic imports
- **Performance Monitoring**: ✅ Core Web Vitals tracking and device adaptation
- **Security Validation**: ✅ 104/104 security tests passing
- **Accessibility Compliance**: ✅ WCAG Level AA with 89/89 tests passing

### Contact Form Integration

- **Formspree Integration**: Production-ready contact form with endpoint (`https://formspree.io/f/mzzgagbb`)
- **Enterprise Security**: CSRF protection, rate limiting (5 requests/10 min), and input sanitization
- **Comprehensive Testing**: 6/6 CSRF tests + 7/7 middleware tests passing
- **Error Handling**: Graceful fallback and user feedback for form submissions

### Logo & Branding Implementation

- **Official Branding**: Integrated BlackWoods Creative logo from CDN
- **Multi-format Support**: SVG primary with PNG fallback and text fallback
- **Responsive Design**: Adaptive sizing for different screen sizes and contexts
- **Accessibility**: Proper alt text and ARIA labels for screen readers
- **Performance**: Optimized loading with Next.js Image component

### Production Readiness Checklist

- [x] All tests passing (1597/1597)
- [x] Build successful (optimized bundle)
- [x] Performance audit completed (Core Web Vitals)
- [x] Accessibility validation (WCAG Level AA)
- [x] SEO optimization verified (structured data, sitemap)
- [x] Security headers configured (CSP, HSTS, etc.)
- [x] Code quality validated (0 ESLint violations)
- [x] TypeScript strict mode compliance
- [ ] Content population (awaiting client content)
- [ ] Final production deployment

## 📜 License

---

**BlackWoods Creative** - Professional portfolio website showcasing cinema, photography, and 3D artistry with cutting-edge web technologies.
