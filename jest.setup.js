import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock Next.js Google Fonts
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter-font',
    style: { fontFamily: 'Inter, sans-serif' },
    variable: '--font-primary',
  }),
  Crimson_Text: () => ({
    className: 'crimson-text-font',
    style: { fontFamily: 'Crimson Text, serif' },
    variable: '--font-secondary',
  }),
  Playfair_Display: () => ({
    className: 'playfair-display-font',
    style: { fontFamily: 'Playfair Display, serif' },
    variable: '--font-tertiary',
  }),
  JetBrains_Mono: () => ({
    className: 'jetbrains-mono-font',
    style: { fontFamily: 'JetBrains Mono, monospace' },
    variable: '--font-mono',
  }),
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    input: props => <input {...props} />,
    textarea: props => <textarea {...props} />,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useInView: () => true, // Mock useInView to always return true (element is in view)
  useScroll: () => ({
    scrollY: { get: () => 0 },
    scrollYProgress: { get: () => 0 },
  }),
  useTransform: () => ({ get: () => 0 }),
  useSpring: () => ({ get: () => 0 }),
  useMotionValue: () => ({ get: () => 0, set: jest.fn() }),
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock browser APIs only in jsdom environment
if (typeof window !== 'undefined') {
  // Mock matchMedia with proper device detection support
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => {
      // Support device detection queries
      const matches = (() => {
        if (query.includes('(max-width: 640px)')) return false; // sm
        if (query.includes('(max-width: 768px)')) return false; // md
        if (query.includes('(max-width: 1024px)')) return false; // lg
        if (query.includes('(max-width: 1280px)')) return false; // xl
        if (query.includes('(prefers-reduced-motion: reduce)')) return false;
        if (query.includes('(hover: hover)')) return true;
        if (query.includes('(pointer: coarse)')) return false;
        return false;
      })();

      return {
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    }),
  });

  // Mock scrollTo
  global.scrollTo = jest.fn();

  // Mock window dimensions for device detection
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1920,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 1080,
  });

  // Mock navigator for device detection
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    configurable: true,
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  });

  Object.defineProperty(navigator, 'maxTouchPoints', {
    writable: true,
    configurable: true,
    value: 0,
  });
}

// Mock document APIs only when document exists
if (typeof document !== 'undefined') {
  // Mock document.documentElement properties
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    writable: true,
    configurable: true,
    value: 2000,
  });

  Object.defineProperty(document.documentElement, 'scrollTop', {
    writable: true,
    configurable: true,
    value: 0,
  });

  Object.defineProperty(document.documentElement, 'clientHeight', {
    writable: true,
    configurable: true,
    value: 800,
  });
}

// Mock Performance API
global.performance = {
  ...global.performance,
  mark: jest.fn(),
  measure: jest.fn(),
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000,
  },
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  timing: {
    navigationStart: Date.now() - 1000,
    loadEventEnd: Date.now(),
  },
};

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn(cb => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock console.error to avoid noise in tests
global.console = {
  ...console,
  error: jest.fn(),
};

// Mock complex interactive components that cause test issues
jest.mock('@/components/interactive', () => ({
  // Core components used in HeroSection
  FloatingElement: ({ children, className, ...props }) => (
    <div className={className} data-testid="floating-element" {...props}>
      {children}
    </div>
  ),
  TextReveal: ({ text, className, ...props }) => (
    <div className={className} data-testid="text-reveal" {...props}>
      {text}
    </div>
  ),
  PulseGlow: ({ children, className, ...props }) => (
    <div className={className} data-testid="pulse-glow" {...props}>
      {children}
    </div>
  ),
  MorphingButton: ({ children, className, onClick, ...props }) => (
    <button className={className} onClick={onClick} data-testid="morphing-button" {...props}>
      {children}
    </button>
  ),
  MagneticField: ({ children, className, ...props }) => (
    <div className={className} data-testid="magnetic-field" {...props}>
      {children}
    </div>
  ),
  ParallaxText: ({ children, className, ...props }) => (
    <div className={className} data-testid="parallax-text" {...props}>
      {children}
    </div>
  ),
  AtmosphericLayer: ({ className, ...props }) => (
    <div className={className} data-testid="atmospheric-layer" {...props} />
  ),

  // Additional components for other sections
  ScrollReveal: ({ children, className, ...props }) => (
    <div className={className} data-testid="scroll-reveal" {...props}>
      {children}
    </div>
  ),
  AtmosphericParticles: ({ className, ...props }) => (
    <div className={className} data-testid="atmospheric-particles" {...props} />
  ),
  ScrollFadeIn: ({ children, className, ...props }) => (
    <div className={className} data-testid="scroll-fade-in" {...props}>
      {children}
    </div>
  ),
  StaggeredScrollFadeIn: ({ children, className, ...props }) => (
    <div className={className} data-testid="staggered-scroll-fade-in" {...props}>
      {children}
    </div>
  ),
  SectionScrollAnimation: ({ children, className, ...props }) => (
    <div className={className} data-testid="section-scroll-animation" {...props}>
      {children}
    </div>
  ),
  ParallaxContainer: ({ children, className, ...props }) => (
    <div className={className} data-testid="parallax-container" {...props}>
      {children}
    </div>
  ),
  ParallaxLayer: ({ children, className, ...props }) => (
    <div className={className} data-testid="parallax-layer" {...props}>
      {children}
    </div>
  ),
  MagneticCursor: ({ children, className, ...props }) => (
    <div className={className} data-testid="magnetic-cursor" {...props}>
      {children}
    </div>
  ),
  HoverMagnify: ({ children, className, ...props }) => (
    <div className={className} data-testid="hover-magnify" {...props}>
      {children}
    </div>
  ),
  GlitchText: ({ text, className, ...props }) => (
    <span className={className} data-testid="glitch-text" {...props}>
      {text}
    </span>
  ),
  TypewriterText: ({ text, className, ...props }) => (
    <span className={className} data-testid="typewriter-text" {...props}>
      {text}
    </span>
  ),
  TiltCard: ({ children, className, ...props }) => (
    <div className={className} data-testid="tilt-card" {...props}>
      {children}
    </div>
  ),
  RippleEffect: ({ children, className, ...props }) => (
    <div className={className} data-testid="ripple-effect" {...props}>
      {children}
    </div>
  ),
  StaggeredReveal: ({ children, className, ...props }) => (
    <div className={className} data-testid="staggered-reveal" {...props}>
      {children}
    </div>
  ),
  // AboutSection components
  StaggeredGrid: ({ children, className, ...props }) => (
    <div className={className} data-testid="staggered-grid" {...props}>
      {children}
    </div>
  ),
  CountUp: ({ end, duration, delay, ...props }) => (
    <span data-testid="count-up" {...props}>
      {end}
    </span>
  ),

  // PortfolioSection components
  AdvancedPortfolioFilter: ({ items, categories, onItemClick, className, ...props }) => (
    <div className={className} data-testid="advanced-portfolio-filter" {...props}>
      {/* Mock filter buttons */}
      <div data-testid="filter-buttons">
        <button data-testid="filter-all">All</button>
        {categories?.map((category, index) => (
          <button key={index} data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}>
            {category}
          </button>
        ))}
      </div>
      {/* Mock portfolio items */}
      <div data-testid="portfolio-grid">
        {items?.map((item, index) => (
          <div
            key={item.id || index}
            data-testid="portfolio-item"
            onClick={() => onItemClick?.(item)}
          >
            <h3>{item.title}</h3>
            <p>{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  ),
}));

// Mock ThemeContext - Single Deep Forest Haze theme
jest.mock('@/context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({
    theme: 'deep-forest-haze',
  }),
}));

// Mock layout components to prevent import issues
jest.mock('@/components/layout/Header', () => ({
  Header: ({ className, ...props }) => (
    <header className={className} data-testid="header" {...props}>
      <div data-testid="logo">BlackWoods Creative</div>
      <nav data-testid="navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/services">Services</a>
        <a href="/portfolio">Portfolio</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  ),
}));

jest.mock('@/components/layout/ScrollProgress', () => ({
  ScrollProgress: ({ className, ...props }) => (
    <div className={className} data-testid="scroll-progress" {...props} />
  ),
}));

jest.mock('@/components/layout/Footer', () => ({
  Footer: ({ className, ...props }) => (
    <footer className={className} data-testid="footer" {...props}>
      Footer Content
    </footer>
  ),
}));

// Mock device adaptation hook for consistent testing
jest.mock('@/hooks/useDeviceAdaptation', () => ({
  useDeviceAdaptation: () => ({
    deviceInfo: {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      screenSize: '2xl',
      orientation: 'landscape',
      pixelRatio: 1,
      hasHover: true,
      prefersReducedMotion: false,
      capabilities: {
        webgl: true,
        webgl2: true,
        intersectionObserver: true,
        resizeObserver: true,
      },
      optimizationProfile: {
        rendering: {
          webgl: true,
          complexAnimations: true,
          particles: true,
        },
        performance: {
          level: 'high',
          enableOptimizations: false,
        },
      },
    },
    adaptiveConfig: {
      magneticStrength: 0.3,
      magneticDistance: 150,
      animationDuration: 0.6,
      enableParallax: true,
      enableMagnetic: true,
      enableComplexAnimations: true,
    },
    shouldEnableFeature: () => true,
    getAdaptiveMagneticProps: () => ({
      strength: 0.3,
      distance: 150,
    }),
  }),
}));

// Mock heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ArrowDownIcon: props => <svg data-testid="arrow-down-icon" {...props} />,
  ChevronDownIcon: props => <svg data-testid="chevron-down-icon" {...props} />,
  PlayIcon: props => <svg data-testid="play-icon" {...props} />,
  EyeIcon: props => <svg data-testid="eye-icon" {...props} />,
  PauseIcon: props => <svg data-testid="pause-icon" {...props} />,
  XMarkIcon: props => <svg data-testid="x-mark-icon" {...props} />,
  Bars3Icon: props => <svg data-testid="bars-3-icon" {...props} />,
  // Footer icons
  EnvelopeIcon: props => <svg data-testid="envelope-icon" {...props} />,
  PhoneIcon: props => <svg data-testid="phone-icon" {...props} />,
  MapPinIcon: props => <svg data-testid="map-pin-icon" {...props} />,
  ArrowUpIcon: props => <svg data-testid="arrow-up-icon" {...props} />,
  CameraIcon: props => <svg data-testid="camera-icon" {...props} />,
  BriefcaseIcon: props => <svg data-testid="briefcase-icon" {...props} />,
  FilmIcon: props => <svg data-testid="film-icon" {...props} />,
  PaintBrushIcon: props => <svg data-testid="paint-brush-icon" {...props} />,
  // AboutSection icons
  CubeIcon: props => <svg data-testid="cube-icon" {...props} />,
  SparklesIcon: props => <svg data-testid="sparkles-icon" {...props} />,
  CheckBadgeIcon: props => <svg data-testid="check-badge-icon" {...props} />,
  TrophyIcon: props => <svg data-testid="trophy-icon" {...props} />,
  // ContactSection icons
  PaperAirplaneIcon: props => <svg data-testid="paper-airplane-icon" {...props} />,
  ExclamationTriangleIcon: props => <svg data-testid="exclamation-triangle-icon" {...props} />,
  CheckCircleIcon: props => <svg data-testid="check-circle-icon" {...props} />,
}));

// React 19 specific mocks
// Mock useTransition for React 19 form patterns
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: () => [false, jest.fn()], // [isPending, startTransition]
}));

// Mock WebGL context for WebGL effects tests
if (typeof global.HTMLCanvasElement !== 'undefined') {
  global.HTMLCanvasElement.prototype.getContext = jest.fn(contextType => {
    if (contextType === 'webgl' || contextType === 'experimental-webgl') {
      return {
        createShader: jest.fn(),
        shaderSource: jest.fn(),
        compileShader: jest.fn(),
        createProgram: jest.fn(),
        attachShader: jest.fn(),
        linkProgram: jest.fn(),
        useProgram: jest.fn(),
        createBuffer: jest.fn(),
        bindBuffer: jest.fn(),
        bufferData: jest.fn(),
        getAttribLocation: jest.fn(),
        enableVertexAttribArray: jest.fn(),
        vertexAttribPointer: jest.fn(),
        getUniformLocation: jest.fn(),
        uniform1f: jest.fn(),
        uniform2f: jest.fn(),
        uniform3f: jest.fn(),
        uniform4f: jest.fn(),
        uniformMatrix4fv: jest.fn(),
        clear: jest.fn(),
        clearColor: jest.fn(),
        drawArrays: jest.fn(),
        viewport: jest.fn(),
        getShaderParameter: jest.fn(() => true),
        getProgramParameter: jest.fn(() => true),
        getShaderInfoLog: jest.fn(() => ''),
        getProgramInfoLog: jest.fn(() => ''),
      };
    }
    return null;
  });
}

// Setup test environment
beforeEach(() => {
  jest.clearAllMocks();

  // Reset window dimensions for each test
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });
  }
});
