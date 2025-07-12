# BlackWoods Creative - Technical Documentation

A professional portfolio website built with Next.js 15, featuring advanced animations, WebGL effects, comprehensive security, and enterprise-level accessibility support.

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

- **Framework**: Next.js 15 with App Router and React 19
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
npm run lint         # ESLint check with security rules
npm run lint:fix     # Auto-fix linting issues
npm run lint-staged  # Pre-commit linting
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

- **ESLint**: Enhanced security rules with automated vulnerability detection
- **TypeScript**: Strict mode compliance with Next.js 15 compatibility
- **Security**: Comprehensive security testing with automated linting rules
- **Accessibility**: WCAG Level AA compliance with comprehensive testing
- **Performance**: Next.js 15 optimizations with Core Web Vitals monitoring
- **Code Quality**: Pre-commit hooks with automated fixing and quality gates

### Monitoring & Analytics

```typescript
// Performance monitoring hooks
const { metrics } = useAnimationPerformance();
const { deviceInfo } = useDeviceAdaptation();
const { accessibilityFeatures } = useAccessibility();

// Core Web Vitals tracking
const { lcp, fid, cls } = useWebVitals();
```

## 🔧 Code Quality & Linting

### ESLint Configuration

The project uses a comprehensive ESLint setup with Next.js 15 best practices:

```javascript
// Enhanced ESLint configuration with security rules
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "@typescript-eslint/recommended",
    "plugin:security/recommended",
    "plugin:import/recommended"
  ],
  "plugins": ["@typescript-eslint", "security", "import"],
  "rules": {
    // Security rules for vulnerability detection
    "security/detect-object-injection": "warn",
    "security/detect-eval-with-expression": "error",
    "security/detect-unsafe-regex": "warn",

    // Import organization and code quality
    "import/order": "error", // Enforces import organization
    "prefer-const": "error",
    "prefer-template": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "warn"
  }
}
```

### Pre-commit Hooks

Automated quality gates ensure code quality before commits:

```bash
# Lint-staged configuration
*.{js,jsx,ts,tsx} → ESLint + Prettier + Git add
*.{json,css,md} → Prettier + Git add
```

## 🔒 Security & Performance Features

### Security Implementation

- **CSRF Protection**: Token-based protection with secure cookie handling
- **Rate Limiting**: Redis-based with fallback (API: 100/15min, Contact: 5/10min)
- **Enhanced Security Headers**: Comprehensive CSP with nonce-based approach, HSTS, Cross-Origin policies (COEP, COOP, CORP)
- **Content Security Policy**: Nonce-based CSP with Framer Motion compatibility and strict security controls
- **Permissions Policy**: Granular control over browser features and APIs
- **Input Sanitization**: XSS and injection protection with multi-layer validation
- **Security Middleware**: Production-ready with comprehensive logging and threat detection
- **ESLint Security Rules**: Automated security vulnerability detection during development

### Performance Optimization

- **Next.js 15 Features**: Latest optimization features including Server Components HMR cache and static generation optimizations
- **Bundle Analysis**: Dynamic imports, code splitting, and package optimization with bundlePagesRouterDependencies
- **Core Web Vitals**: LCP, FID, CLS, FCP, TTFB, INP monitoring with real-time tracking
- **Device Adaptation**: Mobile-specific optimizations, GPU detection, and performance profiling
- **WebGL Performance**: Particle count adaptation, performance degradation detection, and GPU optimization
- **Memory Management**: Heap size tracking, optimization, and automatic performance scaling
- **Build Optimization**: Advanced Next.js 15 build features with server minification and React optimizations

### Accessibility Features

- **WCAG Level AA**: Comprehensive compliance with AAA features
- **Keyboard Navigation**: Full support for Tab, Shift+Tab, Arrow keys, Enter/Space/Escape
- **Screen Reader**: ARIA labels, landmarks, live regions, announcements
- **Focus Management**: Focus trap, restoration, visible indicators
- **Color Accessibility**: Contrast validation and color-blind friendly design

## 🔧 Development Workflow

### Code Quality

- **TypeScript**: Strict mode with comprehensive type safety and Next.js 15 compatibility
- **ESLint**: Enhanced configuration with security rules, import order enforcement, and Next.js 15 best practices
- **Security Linting**: Automated vulnerability detection with eslint-plugin-security
- **Prettier**: Consistent code formatting with automated pre-commit hooks
- **Lint-staged**: Pre-commit quality gates with automatic fixing
- **Husky**: Git hooks for quality enforcement and automated testing
- **Testing**: Comprehensive test suite with enhanced coverage and security testing

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

### Phase 4-5: Performance & Security Headers + Code Quality (Latest)

- **Next.js 15 Upgrade**: ✅ Successfully upgraded to Next.js 15 with latest optimization features
- **Enhanced Security Headers**: ✅ Comprehensive CSP with nonce-based approach, Cross-Origin policies, enhanced Permissions Policy
- **ESLint Security Rules**: ✅ Implemented eslint-plugin-security with automated vulnerability detection
- **Build Optimization**: ✅ Next.js 15 features including Server Components HMR cache and static generation optimizations
- **Import Order Enforcement**: ✅ Strict import organization with automated fixing via lint-staged
- **Pre-commit Hooks**: ✅ Automated quality gates with lint-staged and husky integration
- **TypeScript**: ✅ Strict mode compliance with Next.js 15 compatibility
- **Performance Monitoring**: ✅ Enhanced Core Web Vitals tracking with Next.js 15 optimizations

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

- [x] Next.js 15 upgrade completed with latest optimizations
- [x] Enhanced security headers implemented (CSP with nonce, Cross-Origin policies)
- [x] ESLint security rules configured with automated vulnerability detection
- [x] Pre-commit hooks implemented with lint-staged and husky
- [x] Build optimization completed with Next.js 15 features
- [x] Performance monitoring enhanced with Core Web Vitals tracking
- [x] Accessibility validation (WCAG Level AA compliance)
- [x] SEO optimization verified (structured data, sitemap)
- [x] TypeScript strict mode compliance with Next.js 15
- [x] Code quality gates automated with comprehensive linting
- [ ] Content population (awaiting client content)
- [ ] Final production deployment

## 📜 License

---

**BlackWoods Creative** - Professional portfolio website showcasing cinema, photography, and 3D artistry with cutting-edge web technologies.
