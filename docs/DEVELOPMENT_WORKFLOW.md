# Development Workflow Documentation

## Overview

This document outlines the development processes, testing procedures, and deployment workflows for the BlackWoods Creative website project.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm equivalent)
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Aladin147/BlackWoodsCreative_Website.git
cd BlackWoodsCreative_Website

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

Create `.env.local` for local development:

```env
# Required
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Redis for rate limiting
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🔧 Development Scripts

### Core Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run start           # Start production server

# Code Quality
npm run lint            # ESLint check (0 violations)
npm run lint:fix        # Auto-fix linting issues
npm run type-check      # TypeScript validation

# Testing
npm run test            # Run all tests (1597 tests)
npm run test:watch      # Watch mode testing
npm run test:coverage   # Coverage report
npm run test:e2e        # Playwright E2E tests

# Analysis
npm run analyze         # Bundle size analysis
npm run security        # Security audit
npm run accessibility   # Accessibility testing
```

### Quality Assurance

```bash
# Full quality check
npm run lint && npm run type-check && npm run test

# Pre-deployment validation
npm run build && npm run test:e2e
```

## 🧪 Testing Strategy

### Test Structure

```text
src/
├── __tests__/                 # Integration tests
├── components/
│   └── **/__tests__/         # Component tests
├── lib/
│   └── **/__tests__/         # Utility tests
└── e2e/                      # E2E tests (Playwright)
```

### Test Categories

1. **Unit Tests**: Individual component and utility testing
2. **Integration Tests**: Component interaction testing
3. **Security Tests**: CSRF, rate limiting, input validation
4. **Accessibility Tests**: WCAG compliance validation
5. **Performance Tests**: Core Web Vitals and optimization
6. **E2E Tests**: Full user journey validation

### Test Coverage Metrics

- **Total Tests**: 1597 tests across 72 test suites
- **Coverage**: 100% critical path coverage
- **Security**: 104/104 security tests passing
- **Accessibility**: 89/89 accessibility tests passing
- **Performance**: 193/193 performance tests passing

### Running Specific Tests

```bash
# Component tests
npm test -- ContactSection.test.tsx

# Test categories
npm test -- --testPathPattern="security"
npm test -- --testPathPattern="accessibility"
npm test -- --testPathPattern="performance"

# Watch mode for development
npm run test:watch -- --testPathPattern="components"
```

## 🔄 Git Workflow

### Branch Strategy

```bash
# Main branches
main                    # Production-ready code
develop                 # Integration branch (if needed)

# Feature branches
feature/component-name  # New features
fix/issue-description   # Bug fixes
docs/update-readme      # Documentation updates
```

### Commit Convention

```bash
# Format: type(scope): description

feat(components): add new portfolio section
fix(security): resolve CSRF token validation
docs(readme): update installation instructions
test(accessibility): add keyboard navigation tests
perf(bundle): optimize WebGL component loading
```

### Development Process

```bash
# 1. Create feature branch
git checkout -b feature/new-component

# 2. Make changes and test
npm run test
npm run lint
npm run type-check

# 3. Commit changes
git add .
git commit -m "feat(components): add new component with tests"

# 4. Push and create PR
git push origin feature/new-component
```

## 🏗️ Code Quality Standards

### TypeScript Configuration

- **Strict Mode**: Enabled with comprehensive type safety
- **No Implicit Any**: All types must be explicit
- **Exact Optional Properties**: Strict optional property handling
- **No Unchecked Index Access**: Safe array/object access

### ESLint Rules

- **React/JSX**: Best practices enforcement
- **TypeScript**: Strict type checking
- **Accessibility**: jsx-a11y rules
- **Import Organization**: Consistent import structure
- **Code Style**: Consistent formatting

### Code Review Checklist

- [ ] All tests passing (1597/1597)
- [ ] No ESLint violations (0/0)
- [ ] No TypeScript errors (0/0)
- [ ] Accessibility compliance verified
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Documentation updated

## 🚀 Deployment Process

### Pre-deployment Checklist

```bash
# 1. Quality validation
npm run lint && npm run type-check

# 2. Test suite validation
npm run test && npm run test:e2e

# 3. Build validation
npm run build

# 4. Security audit
npm run security

# 5. Accessibility validation
npm run accessibility

# 6. Performance analysis
npm run analyze
```

### Production Build

```bash
# Create optimized build
npm run build

# Test production build locally
npm run start

# Verify build output
ls -la .next/static/
```

### Environment Variables (Production)

```env
# Required
NEXT_PUBLIC_SITE_URL=https://blackwoodscreative.com
NODE_ENV=production

# Optional: Enhanced features
UPSTASH_REDIS_REST_URL=production-redis-url
UPSTASH_REDIS_REST_TOKEN=production-redis-token
NEXT_PUBLIC_ANALYTICS_ID=production-analytics-id
```

## 🔍 Monitoring & Debugging

### Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS tracking
- **Bundle Analysis**: Size and optimization monitoring
- **Animation Performance**: FPS and frame time tracking
- **Memory Usage**: Heap size monitoring

### Error Tracking

- **TypeScript**: Compile-time error prevention
- **ESLint**: Code quality issue detection
- **Test Failures**: Automated test monitoring
- **Security Events**: CSRF and rate limiting logs

### Debug Tools

```bash
# Development debugging
npm run dev -- --inspect

# Bundle analysis
npm run analyze

# Performance profiling
npm run test -- --testPathPattern="performance" --verbose
```

## 📚 Documentation Standards

### Code Documentation

- **JSDoc**: Function and component documentation
- **TypeScript**: Comprehensive type definitions
- **README**: Up-to-date project documentation
- **Component Docs**: Usage examples and API references

### Documentation Updates

- Update README.md for major changes
- Maintain component documentation
- Update API documentation
- Keep deployment guides current

## 🔒 Security Practices

### Security Checklist - Phase 1 ✅ COMPLETED

- [x] CSRF protection implemented (OWASP-compliant)
- [x] Rate limiting configured (Redis + in-memory fallback)
- [x] Input validation and sanitization
- [x] Security headers configured (12 comprehensive headers)
- [x] Dependency vulnerability scanning
- [x] Environment variable security
- [x] Security event logging and monitoring
- [x] Timing-safe cryptographic operations

### Security Testing

```bash
# Run security test suite
npm run security

# Dependency audit
npm audit

# CSRF protection tests
npm test -- --testPathPattern="csrf"
```

## 📈 Performance Optimization

### Bundle Optimization

- **Dynamic Imports**: Lazy loading for heavy components
- **Code Splitting**: Route-based splitting
- **Tree Shaking**: Unused code elimination
- **Minification**: Production build optimization

### Performance Testing

```bash
# Performance test suite
npm test -- --testPathPattern="performance"

# Bundle size analysis
npm run analyze

# Core Web Vitals monitoring
npm run test -- --testPathPattern="web-vitals"
```

---

**Status**: ✅ **All workflows validated and production-ready**

This development workflow ensures consistent, high-quality development practices with comprehensive testing and validation at every stage.
