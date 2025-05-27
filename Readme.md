# BlackWoods Creative - Portfolio Website

> A cinematic showcase platform for BlackWoods Creative - where technical innovation meets visual storytelling.

![BlackWoods Creative Logo](./public/assets/images/logo-banner.png)

## 🎬 Project Overview

BlackWoods Creative specializes in filmmaking, photography, cinema, arts, 3D printing, and scene creation. This website serves as a premium showcase platform designed to impress potential clients and demonstrate our technical and creative capabilities.

**Live Site:** [blackwoodscreative.com](https://blackwoodscreative.com) _(Coming Soon)_
**Staging:** [staging.blackwoodscreative.com](https://staging.blackwoodscreative.com) _(Coming Soon)_
**Current Status:** 🚀 **Phase 4 Complete - Advanced Interactive Features**

### **Development Phases**
- ✅ **Phase 1: Foundation & Setup** _(Complete)_
- ✅ **Phase 2: Core Features & Design** _(Complete)_
- ✅ **Phase 3: Testing & Robustness** _(Complete)_
- ✅ **Phase 4: Advanced Features** _(Complete)_

---

## 🎯 Project Goals

### **Primary Objectives**

- **Professional Client Showcase** - Replace Instagram with a proper company portfolio
- **Technical Credibility** - Demonstrate advanced web development capabilities
- **Lead Generation** - Convert visitors into project inquiries
- **Brand Positioning** - Establish BlackWoods as a premium creative agency

### **Target Audience**

- Corporate clients seeking video/photo production
- Event planners requiring visual services
- Businesses needing marketing content
- Film industry collaborators
- Architecture firms (3D visualization)

---

## 🚀 Tech Stack

### **Core Framework**

```json
{
  "framework": "Next.js 14+",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "animations": "Framer Motion",
  "3d": "Three.js + React Three Fiber",
  "deployment": "Vercel",
  "analytics": "Vercel Analytics"
}
```

### **Key Dependencies**

```bash
# Core
next@latest
react@18+
typescript@5+

# Styling & Animation
tailwindcss@latest
framer-motion@latest
@tailwindcss/typography

# 3D & Visual Effects
three@latest
@react-three/fiber@latest
@react-three/drei@latest

# Media & Performance
sharp@latest                 # Image optimization
@next/bundle-analyzer       # Performance monitoring

# Development
eslint@latest
prettier@latest
@types/node@latest
@types/react@latest
```

---

## 🎨 Design System

### **Brand Colors**

```css
/* Primary Palette */
--bw-black: #0a0a0a; /* Deep black backgrounds */
--bw-charcoal: #1a1a1a; /* Secondary backgrounds */
--bw-white: #ffffff; /* Primary text & logo */

/* Accent Colors */
--bw-gold: #d4af37; /* Premium CTAs & highlights */
--bw-silver: #c0c0c0; /* Metallic accents */
--bw-red: #cc3333; /* Recording indicators */
```

### **Typography**

```css
/* Font Stack */
--font-primary: 'Inter', 'SF Pro Display', sans-serif;
--font-display: 'Playfair Display', serif;
--font-mono: 'JetBrains Mono', monospace;
```

### **Animation Principles**

- **Cinematic Timing** - 300-800ms durations with cinematic easing
- **Depth & Parallax** - Multiple layer movement for 3D feeling
- **Subtle Interactions** - Professional hover states and micro-animations
- **Performance First** - GPU-accelerated transforms, intersection observers

---

## 📁 Project Structure

```
blackwoods-creative/
├── 📁 src/
│   ├── 📁 app/                     # Next.js 13+ App Router
│   │   ├── page.tsx                # Homepage (single-page app)
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   └── 📁 api/                 # API routes
│   │       └── 📁 contact/         # Contact form endpoint
│   ├── 📁 components/
│   │   ├── 📁 ui/                  # Reusable UI components
│   │   ├── 📁 layout/              # Header, Footer, Navigation
│   │   ├── 📁 sections/            # Page sections
│   │   │   ├── Hero/               # Hero section with video
│   │   │   ├── Portfolio/          # Work showcase
│   │   │   ├── About/              # Company info
│   │   │   └── Contact/            # Contact form
│   │   ├── 📁 interactive/         # 3D & animation components
│   │   │   ├── 📁 3d/              # Three.js components
│   │   │   ├── 📁 animations/      # Framer Motion components
│   │   │   └── 📁 media/           # Video/image components
│   │   └── 📁 forms/               # Form components
│   ├── 📁 lib/
│   │   ├── 📁 utils/               # Utility functions
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   ├── 📁 services/            # External services
│   │   └── 📁 constants/           # App constants
│   ├── 📁 styles/                  # Additional CSS files
│   ├── 📁 types/                   # TypeScript definitions
│   └── 📁 data/                    # Static data files
├── 📁 public/
│   ├── 📁 assets/
│   │   ├── 📁 videos/              # Hero & portfolio videos
│   │   ├── 📁 images/              # Optimized images
│   │   ├── 📁 models/              # 3D models (.glb/.gltf)
│   │   └── 📁 audio/               # Sound effects (optional)
│   └── 📁 icons/                   # Favicons & logo variants
├── 📁 docs/                        # Documentation
│   ├── design-system.md            # Design guidelines
│   ├── animation-guide.md          # Animation reference
│   └── deployment.md               # Deployment instructions
└── 📁 tests/                       # Test files
```

---

## 🎭 User Experience Flow

### **Single-Page Architecture**

The website follows a single-page, scroll-based narrative:

1. **Hero Section** - Cinematic intro with logo animation
2. **Work Categories** - Film | Photography | 3D | Scenes
3. **Portfolio Grid** - Filterable showcase with hover previews
4. **About Section** - Company story and capabilities
5. **Contact Form** - Lead capture with project type selection

### **Key Interactions**

- **Smooth Scrolling** - Parallax effects throughout
- **Portfolio Filtering** - Smooth transitions between categories
- **Modal Lightbox** - Full-screen project viewing
- **Form Validation** - Real-time feedback with animations

---

## 🎬 Advanced Interactive Features

### **Phase 4 - Implemented Advanced Features**

- ✅ **Magnetic Cursor System** - Physics-based cursor with context awareness
- ✅ **Scroll-Based Storytelling** - Cinematic narrative experiences
- ✅ **Advanced Parallax System** - Multi-layer depth effects with custom speeds
- ✅ **Micro-Interactions Library** - Comprehensive interaction toolkit
- ✅ **Tilt Card Interactions** - 3D card tilting with realistic physics
- ✅ **Morphing Buttons** - Content transformation on hover
- ✅ **Text Reveal Animations** - Character-by-character reveals
- ✅ **Floating Elements** - Organic movement patterns
- ✅ **Depth of Field Effects** - Focus-based blur effects
- ✅ **Magnetic Field Interactions** - Cursor-responsive element movement

### **Core Animation Features**

- ✅ **Logo Entrance Animation** - Cinematic reveal on page load
- ✅ **Portfolio Grid Animations** - Smooth filtering and hover states
- ✅ **Scroll-Triggered Reveals** - Section animations on intersection
- ✅ **Performance Optimization** - 60fps smooth animations

### **Future Enhancements** _(Phase 5 Ready)_

- 🔄 **3D Scene Integration** - Three.js powered 3D elements
- 🔄 **Particle Systems** - GPU-accelerated particle effects
- 🔄 **WebGL Shader Effects** - Custom visual effects
- 🔄 **Audio Integration** - Sound design and audio visualization

### **Performance Optimizations**

- **Intersection Observer** - Animations only when in viewport
- **GPU Acceleration** - `transform3d` and `will-change` properties
- **Adaptive Quality** - Reduced effects on low-end devices
- **Frame Rate Monitoring** - Maintains 60fps priority

---

## 📊 Performance Targets

### **Core Web Vitals Goals**

- **LCP (Largest Contentful Paint)** - < 2.5s
- **FID (First Input Delay)** - < 100ms
- **CLS (Cumulative Layout Shift)** - < 0.1

### **Additional Metrics**

- **Time to Interactive** - < 3.5s
- **Speed Index** - < 3.0s
- **Bundle Size** - < 500KB gzipped

### **Monitoring Tools**

- Vercel Analytics for real-user metrics
- Lighthouse CI in GitHub Actions
- Bundle Analyzer for optimization insights

---

## 🛠️ Development Setup

### **Prerequisites**

```bash
Node.js 18+
npm or pnpm
Git
```

### **Installation**

```bash
# Clone the repository
git clone https://github.com/blackwoods-creative/website.git
cd blackwoods-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run analyze      # Bundle size analysis
npm test             # Run tests
npm run e2e          # End-to-end tests
```

---

## 📱 Responsive Design

### **Breakpoint Strategy**

```css
/* Mobile First Approach */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* Ultra wide displays */
```

### **Device-Specific Optimizations**

- **Mobile** - Simplified animations, touch-optimized interactions
- **Tablet** - Reduced parallax, optimized grid layouts
- **Desktop** - Full animation suite, mouse-based interactions
- **Ultra-wide** - Enhanced parallax depth, larger grid layouts

---

## 🔌 API Integration

### **Contact Form Endpoint**

```typescript
// POST /api/contact
interface ContactFormData {
  name: string;
  email: string;
  projectType: 'film' | 'photography' | '3d' | 'scenes' | 'other';
  budget?: string;
  message: string;
  attachments?: File[];
}
```

### **Portfolio Data**

```typescript
// Static data structure for portfolio items
interface PortfolioItem {
  id: string;
  title: string;
  category: 'film' | 'photography' | '3d' | 'scenes';
  thumbnail: string;
  media: {
    type: 'image' | 'video';
    src: string;
    alt: string;
  }[];
  description: string;
  client?: string;
  year: number;
  tags: string[];
}
```

---

## 🚀 Deployment

### **Production Environment**

- **Platform** - Vercel (recommended for Next.js)
- **Domain** - blackwoodscreative.com
- **CDN** - Vercel Edge Network
- **Database** - None required (static portfolio data)

### **Environment Variables**

```bash
# Required for production
NEXT_PUBLIC_SITE_URL=https://blackwoodscreative.com
CONTACT_EMAIL_TO=hello@blackwoodscreative.com
RESEND_API_KEY=your_email_service_key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### **CI/CD Pipeline**

```yaml
# .github/workflows/ci.yml
- Automated testing on PR
- Lighthouse performance checks
- Type checking and linting
- Automatic deployment to staging
- Manual promotion to production
```

---

## 📈 Content Management

### **Portfolio Updates**

Portfolio content is managed through static JSON files in `/src/data/`:

```bash
# Update portfolio
src/data/portfolio.json     # Project data
public/assets/images/       # Project images
public/assets/videos/       # Project videos
```

### **Content Guidelines**

- **Images** - WebP format, multiple sizes, optimized for Core Web Vitals
- **Videos** - MP4 format, compressed for web, poster images required
- **3D Models** - GLTF/GLB format, optimized file sizes
- **Copy** - Professional tone, benefit-focused, SEO-optimized

---

## 🎯 SEO Strategy

### **Technical SEO**

- Next.js App Router for optimal crawling
- Structured data for portfolio items
- XML sitemap generation
- Robot.txt optimization
- Core Web Vitals optimization

### **Content SEO**

- Target keywords: "creative agency", "video production", "3D visualization"
- Location-based optimization
- Industry-specific landing sections
- Case study storytelling approach

---

## 🧪 Testing Strategy

### **Testing Levels**

```bash
# Unit Tests
- Component functionality
- Utility functions
- Animation logic

# Integration Tests
- Form submissions
- Portfolio filtering
- Navigation flows

# E2E Tests
- Complete user journeys
- Performance benchmarks
- Cross-browser compatibility

# Visual Regression
- Screenshot comparisons
- Animation consistency
- Responsive layouts
```

---

## 📋 Maintenance

### **Regular Tasks**

- **Monthly** - Update dependencies, performance audit
- **Quarterly** - Content refresh, SEO review
- **Annually** - Design system evolution, tech stack evaluation

### **Monitoring**

- **Performance** - Core Web Vitals tracking
- **Errors** - Automated error reporting
- **Analytics** - User behavior insights
- **Uptime** - 99.9% availability target

---

## 🤝 Contributing

### **Development Workflow**

1. Create feature branch from `main`
2. Implement changes with tests
3. Run quality checks (`npm run lint && npm run type-check`)
4. Submit PR with performance impact assessment
5. Code review focusing on user experience
6. Deploy to staging for client review
7. Merge to main and deploy to production

### **Code Standards**

- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Conventional commits for changelog generation
- Component documentation with Storybook (planned)

---

## 📞 Support & Contact

### **Development Team**

- **Lead Developer** - [Your Name]
- **Design** - BlackWoods Creative Team
- **Project Management** - [PM Name]

### **Resources**

- **Design System** - `/docs/design-system.md`
- **Animation Guide** - `/docs/animation-inspiration.md`
- **Deployment Guide** - `/docs/deployment.md`
- **Issue Tracking** - GitHub Issues

---

## 📜 License

This project is proprietary to BlackWoods Creative. All rights reserved.

### **Third-Party Assets**

- Fonts licensed for commercial use
- Stock video/images properly licensed
- Open source libraries used under their respective licenses

---

**Built with ❤️ by BlackWoods Creative**

_Last Updated: [Current Date]_
