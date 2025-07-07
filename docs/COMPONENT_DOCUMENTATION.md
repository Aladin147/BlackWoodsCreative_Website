# Component Documentation - BlackWoods Creative

## Overview

This document provides comprehensive documentation for all components in the BlackWoods Creative website, including usage examples, API references, and implementation details.

## 🎨 Interactive Components

### WebGLEffects

Advanced WebGL-based visual effects including aurora and particle systems.

**Location**: `src/components/interactive/WebGLEffects.tsx`

**Features**:
- Aurora background effects
- Particle systems
- Device-specific optimization
- Performance monitoring

**Usage**:
```tsx
import { WebGLEffects } from '@/components/interactive/WebGLEffects';

<WebGLEffects 
  intensity="medium" 
  enableParticles={true}
  performanceMode="auto"
/>
```

**Props**:
- `intensity`: 'low' | 'medium' | 'high' - Effect intensity level
- `enableParticles`: boolean - Enable particle systems
- `performanceMode`: 'auto' | 'high' | 'low' - Performance optimization mode

### MagneticCursor

Interactive cursor effects with magnetic attraction to elements.

**Location**: `src/components/interactive/MagneticCursor.tsx`

**Features**:
- Magnetic attraction effects
- Smooth animations
- Device adaptation (disabled on mobile)
- Performance optimization

**Usage**:
```tsx
import { MagneticCursor } from '@/components/interactive/MagneticCursor';

<MagneticCursor 
  strength={0.3}
  radius={100}
  disabled={false}
/>
```

### ParallaxContainer

Scroll-based parallax effects with performance optimization.

**Location**: `src/components/interactive/ParallaxContainer.tsx`

**Features**:
- Smooth parallax scrolling
- Performance monitoring
- Reduced motion support
- Device-specific adaptations

## 🏗️ Layout Components

### Header

Main navigation header with logo and responsive design.

**Location**: `src/components/layout/Header.tsx`

**Features**:
- BlackWoods Creative logo integration
- Responsive navigation
- Theme toggle
- Accessibility support

### Footer

Site footer with links and contact information.

**Location**: `src/components/layout/Footer.tsx`

**Features**:
- Contact information
- Social media links
- Copyright information
- Responsive design

## 📄 Section Components

### HeroSection

Main hero section with animated content and call-to-action.

**Location**: `src/components/sections/HeroSection.tsx`

**Features**:
- Animated text effects
- Background video/image support
- Call-to-action buttons
- Responsive design

### ContactSection

Contact form with comprehensive security and validation.

**Location**: `src/components/sections/ContactSection.tsx`

**Features**:
- Formspree integration
- CSRF protection
- Input validation and sanitization
- Rate limiting
- Accessibility compliance

**Form Fields**:
- Name (required)
- Email (required, validated)
- Company (optional)
- Project Type (optional)
- Budget (optional)
- Message (required)

### PortfolioSection

Portfolio showcase with filtering and animations.

**Location**: `src/components/sections/PortfolioSection.tsx`

**Features**:
- Project filtering
- Image galleries
- Smooth animations
- Responsive grid layout

## 🎯 UI Components

### Button

Reusable button component with multiple variants.

**Location**: `src/components/ui/Button.tsx`

**Variants**:
- `primary`: Main action buttons
- `secondary`: Secondary actions
- `outline`: Outlined buttons
- `ghost`: Minimal buttons

**Usage**:
```tsx
import { Button } from '@/components/ui/Button';

<Button 
  variant="primary" 
  size="lg"
  onClick={handleClick}
  disabled={false}
>
  Click Me
</Button>
```

### Input

Form input component with validation support.

**Location**: `src/components/ui/Input.tsx`

**Features**:
- Built-in validation
- Error state handling
- Accessibility labels
- Multiple input types

### Card

Flexible card component for content display.

**Location**: `src/components/ui/Card.tsx`

**Features**:
- Multiple layouts
- Hover effects
- Responsive design
- Accessibility support

## 🔍 SEO Components

### SimpleStructuredData

Structured data implementation for SEO optimization.

**Location**: `src/components/seo/SimpleStructuredData.tsx`

**Features**:
- JSON-LD structured data
- Organization schema
- Website schema
- Local business schema

**Usage**:
```tsx
import { SimpleStructuredData } from '@/components/seo/SimpleStructuredData';

<SimpleStructuredData 
  type="Organization"
  data={{
    name: "BlackWoods Creative",
    url: "https://blackwoodscreative.com",
    // ... additional schema data
  }}
/>
```

## 🎨 Theme System

### ThemeProvider

Context provider for theme management.

**Location**: `src/context/ThemeContext.tsx`

**Features**:
- Dark/light mode toggle
- System preference detection
- Persistent theme storage
- Smooth transitions

**Usage**:
```tsx
import { useTheme } from '@/context/ThemeContext';

const { theme, toggleTheme, isDark } = useTheme();
```

## 🔧 Custom Hooks

### useDeviceAdaptation

Device-specific optimization and adaptation.

**Location**: `src/hooks/useDeviceAdaptation.ts`

**Features**:
- Device type detection
- Performance capability assessment
- Screen size adaptation
- Touch support detection

### useAnimationPerformance

Performance monitoring for animations.

**Location**: `src/hooks/useAnimationPerformance.ts`

**Features**:
- FPS monitoring
- Frame time tracking
- Performance degradation detection
- Automatic optimization suggestions

### useAccessibility

Accessibility utilities and features.

**Location**: `src/hooks/useAccessibility.ts`

**Features**:
- Screen reader detection
- Keyboard navigation support
- Focus management
- Reduced motion preferences

## 🧪 Testing

All components include comprehensive test coverage:

- **Unit Tests**: Component behavior and props
- **Integration Tests**: Component interactions
- **Accessibility Tests**: WCAG compliance
- **Performance Tests**: Rendering performance

**Test Location**: `src/components/**/__tests__/`

## 📱 Responsive Design

All components follow mobile-first responsive design principles:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

## ♿ Accessibility

Components implement comprehensive accessibility features:

- **WCAG Level AA**: Full compliance
- **Keyboard Navigation**: Complete support
- **Screen Readers**: ARIA labels and descriptions
- **Focus Management**: Proper focus handling
- **Color Contrast**: Validated contrast ratios

## 🚀 Performance

Performance optimization features:

- **Lazy Loading**: Components load on demand
- **Code Splitting**: Dynamic imports
- **Memoization**: React.memo and useMemo
- **Bundle Optimization**: Tree shaking and minification

---

**Note**: This documentation reflects the current state of the BlackWoods Creative website components. All components are production-ready with comprehensive testing and optimization.
