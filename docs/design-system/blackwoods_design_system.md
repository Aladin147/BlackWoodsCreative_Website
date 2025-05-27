# BlackWoods Creative - Design System

> **Status**: ✅ Complete - Ready for implementation
> **Last Updated**: December 2024
> **Version**: 1.0

## 🎨 Color Palette

### **Primary Colors**

```css
--bw-black: #0a0a0a; /* Deep black - primary background */
--bw-charcoal: #1a1a1a; /* Charcoal - secondary backgrounds */
--bw-dark-gray: #2a2a2a; /* Dark gray - card backgrounds */
--bw-medium-gray: #404040; /* Medium gray - borders, dividers */
--bw-light-gray: #707070; /* Light gray - secondary text */
--bw-white: #ffffff; /* Pure white - primary text, logo */
```

### **Accent Colors**

```css
--bw-silver: #c0c0c0; /* Metallic silver - highlights */
--bw-platinum: #e5e5e5; /* Platinum - subtle accents */
--bw-gold: #d4af37; /* Gold - premium CTAs, awards */
--bw-red: #cc3333; /* Cinematic red - recording, live indicators */
```

### **Semantic Colors**

```css
--bw-success: #28a745; /* Success states */
--bw-warning: #ffc107; /* Warning states */
--bw-error: #dc3545; /* Error states */
--bw-info: #17a2b8; /* Info states */
```

### **Gradients**

```css
--bw-gradient-dark: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
--bw-gradient-silver: linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%);
--bw-gradient-gold: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
--bw-gradient-glow: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
```

## 📝 Typography

### **Font Stack**

```css
/* Primary - Modern Sans-Serif */
--font-primary: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;

/* Secondary - Cinematic Display */
--font-display: 'Playfair Display', 'Times New Roman', serif;

/* Monospace - Technical/Code */
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### **Typography Scale**

```css
/* Headings */
--text-6xl: 3.75rem; /* 60px - Hero titles */
--text-5xl: 3rem; /* 48px - Section titles */
--text-4xl: 2.25rem; /* 36px - Large headings */
--text-3xl: 1.875rem; /* 30px - Medium headings */
--text-2xl: 1.5rem; /* 24px - Small headings */
--text-xl: 1.25rem; /* 20px - Large text */

/* Body */
--text-lg: 1.125rem; /* 18px - Large body */
--text-base: 1rem; /* 16px - Base body */
--text-sm: 0.875rem; /* 14px - Small text */
--text-xs: 0.75rem; /* 12px - Captions */
```

### **Font Weights**

```css
--font-thin: 100;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;
```

## 📐 Spacing System

### **Base Unit: 4px**

```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
--space-32: 8rem; /* 128px */
```

### **Responsive Spacing**

```css
--section-padding-mobile: var(--space-8); /* 32px */
--section-padding-tablet: var(--space-16); /* 64px */
--section-padding-desktop: var(--space-24); /* 96px */
```

## 🎭 Visual Effects

### **Shadows & Depth**

```css
/* Subtle depth */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* Cinematic shadows */
--shadow-cinematic: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
--shadow-glow: 0 0 20px rgba(255, 255, 255, 0.1);
--shadow-gold-glow: 0 0 30px rgba(212, 175, 55, 0.3);
```

### **Border Radius**

```css
--radius-sm: 0.125rem; /* 2px */
--radius-md: 0.375rem; /* 6px */
--radius-lg: 0.5rem; /* 8px */
--radius-xl: 0.75rem; /* 12px */
--radius-2xl: 1rem; /* 16px */
--radius-full: 9999px; /* Full rounded */
```

### **Blur Effects**

```css
--blur-sm: blur(4px);
--blur-md: blur(8px);
--blur-lg: blur(16px);
--blur-xl: blur(24px);
```

## 🎬 Animation System

### **Timing Functions**

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-cinematic: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-dramatic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### **Duration Scale**

```css
--duration-fast: 150ms; /* Quick interactions */
--duration-normal: 300ms; /* Standard transitions */
--duration-slow: 500ms; /* Dramatic effects */
--duration-cinematic: 800ms; /* Hero animations */
```

### **Animation Presets**

```css
/* Hover Effects */
.hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-cinematic);
}

/* Fade In Animation */
.fade-in {
  animation: fadeIn var(--duration-cinematic) var(--ease-cinematic);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px; /* Small devices */
--breakpoint-md: 768px; /* Medium devices */
--breakpoint-lg: 1024px; /* Large devices */
--breakpoint-xl: 1280px; /* Extra large devices */
--breakpoint-2xl: 1536px; /* Ultra wide displays */
```

## 🎨 Component Styles

### **Buttons**

```css
/* Primary Button */
.btn-primary {
  background: var(--bw-gradient-gold);
  color: var(--bw-black);
  font-weight: var(--font-semibold);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  transition: all var(--duration-normal) var(--ease-out);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-gold-glow), var(--shadow-lg);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--bw-white);
  border: 1px solid var(--bw-medium-gray);
  font-weight: var(--font-medium);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-secondary:hover {
  border-color: var(--bw-silver);
  background: rgba(255, 255, 255, 0.05);
}
```

### **Cards**

```css
.card {
  background: var(--bw-gradient-dark);
  border: 1px solid var(--bw-dark-gray);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-normal) var(--ease-out);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-cinematic);
  border-color: var(--bw-medium-gray);
}

.card-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: var(--blur-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## 🎯 Usage Guidelines

### **Do's**

- Use the gradient backgrounds for depth
- Apply cinematic shadows for premium feel
- Maintain consistent spacing ratios
- Use gold accents sparingly for impact
- Implement smooth, meaningful animations

### **Don'ts**

- Don't use bright colors (breaks the cinematic mood)
- Avoid harsh transitions or jarring animations
- Don't overcrowd with too many visual effects
- Never compromise readability for style
- Avoid using more than 2-3 accent colors per page

## 🎪 Logo Integration

Your existing logo works perfectly with this system:

- **Black background** matches `--bw-black`
- **White typography** uses `--bw-white`
- **Clean lines** complement the minimalist approach
- **Bold presence** fits the cinematic aesthetic

The logo should be the hero element on every page, with subtle animations on load that respect its strong, static presence.
