# Contributing to BlackWoods Creative Website

Thank you for your interest in contributing to the BlackWoods Creative website! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Latest version (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended with TypeScript and ESLint extensions

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Aladin147/BlackWoodsCreative_Website.git
   cd BlackWoodsCreative_Website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 📋 Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **feature/**: New features (`feature/new-animation`)
- **fix/**: Bug fixes (`fix/contact-form-validation`)
- **docs/**: Documentation updates (`docs/update-readme`)
- **refactor/**: Code improvements (`refactor/optimize-components`)

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

Examples:
feat(ui): add magnetic cursor component
fix(security): resolve CSRF token validation
docs(readme): update installation instructions
style(theme): improve color contrast ratios
refactor(hooks): optimize useDeviceAdaptation
test(components): add Button component tests
perf(animations): reduce WebGL particle count
security(headers): enhance CSP configuration
```

### Code Quality Standards

#### TypeScript

- **Strict Mode**: All code must pass TypeScript strict mode
- **Type Safety**: Avoid `any` types, use proper type definitions
- **Interfaces**: Define clear interfaces for props and data structures

#### ESLint Rules

- **Security**: All security rules must pass (eslint-plugin-security)
- **Import Order**: Imports must be properly organized
- **Code Style**: Follow Next.js and React best practices
- **No Warnings**: Code should not introduce new ESLint warnings

#### Testing Requirements

- **Unit Tests**: All new components must have unit tests
- **Integration Tests**: Complex features require integration tests
- **Accessibility Tests**: UI components must pass accessibility tests
- **Security Tests**: Security-related code must have security tests

### Pre-commit Hooks

The project uses automated quality gates:

```bash
# Automatically runs on git commit
- ESLint with auto-fix
- Prettier formatting
- TypeScript type checking
- Test validation
```

## 🧪 Testing Guidelines

### Test Structure

```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Categories

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user workflow testing with Playwright
- **Accessibility Tests**: WCAG compliance testing
- **Security Tests**: Vulnerability and security testing
- **Performance Tests**: Core Web Vitals and performance testing

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
npm run test:e2e          # Run Playwright E2E tests
npm test -- Button.test.tsx # Run specific test file
```

## 🔒 Security Guidelines

### Security Best Practices

1. **Input Validation**: Always validate and sanitize user inputs
2. **XSS Prevention**: Use proper escaping and sanitization
3. **CSRF Protection**: Implement CSRF tokens for forms
4. **Security Headers**: Maintain comprehensive security headers
5. **Dependency Security**: Keep dependencies updated and secure

### Security Testing

```bash
npm run security:validate  # Run security validation
npm run lint              # Check for security violations
```

### Reporting Security Issues

- **Private Disclosure**: Report security issues privately
- **No Public Issues**: Do not create public GitHub issues for security vulnerabilities
- **Contact**: Reach out to maintainers directly for security concerns

## 🎨 UI/UX Guidelines

### Design System

- **Theme**: Follow the Deep Forest Haze theme guidelines
- **Typography**: Use Urbanist Bold for headings, Inter for body text
- **Colors**: Stick to the defined color palette
- **Spacing**: Use the design system spacing scale
- **Animations**: Ensure smooth, performant animations

### Accessibility Requirements

- **WCAG Level AA**: All UI must meet WCAG Level AA standards
- **Keyboard Navigation**: Full keyboard accessibility required
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Visible focus indicators and logical tab order

### Performance Standards

- **Core Web Vitals**: Maintain excellent Core Web Vitals scores
- **Bundle Size**: Keep bundle size optimized
- **Image Optimization**: Use Next.js Image component
- **Animation Performance**: 60fps animations with GPU acceleration

## 📝 Documentation Standards

### Code Documentation

```typescript
/**
 * Custom hook for device adaptation and performance optimization
 * @param options - Configuration options for device adaptation
 * @returns Device capabilities and optimization settings
 */
export function useDeviceAdaptation(options?: DeviceAdaptationOptions) {
  // Implementation
}
```

### Component Documentation

- **Props Interface**: Document all props with TypeScript interfaces
- **Usage Examples**: Provide clear usage examples
- **Accessibility Notes**: Document accessibility considerations
- **Performance Notes**: Document performance implications

## 🚀 Deployment Guidelines

### Production Checklist

- [ ] All tests passing
- [ ] ESLint validation clean
- [ ] TypeScript compilation successful
- [ ] Security headers configured
- [ ] Performance optimized
- [ ] Accessibility validated
- [ ] SEO optimized

### Environment Variables

```env
# Required for production
NEXT_PUBLIC_SITE_URL=https://blackwoodscreative.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Redis for rate limiting
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## 🤝 Code Review Process

### Review Criteria

1. **Functionality**: Does the code work as intended?
2. **Code Quality**: Is the code clean, readable, and maintainable?
3. **Performance**: Does it maintain or improve performance?
4. **Security**: Are there any security concerns?
5. **Accessibility**: Does it maintain accessibility standards?
6. **Testing**: Is there adequate test coverage?
7. **Documentation**: Is the code properly documented?

### Review Checklist

- [ ] Code follows TypeScript strict mode
- [ ] ESLint rules pass without warnings
- [ ] Tests are included and passing
- [ ] Accessibility requirements met
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Documentation updated if needed

## 📞 Getting Help

### Resources

- **Documentation**: Check README.md and inline documentation
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Code Examples**: Review existing components for patterns

### Contact

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: For security issues and private matters

---

Thank you for contributing to BlackWoods Creative! Your contributions help make this project better for everyone.
