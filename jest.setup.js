import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
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
    input: (props) => <input {...props} />,
    textarea: (props) => <textarea {...props} />,
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
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock scrollTo
  global.scrollTo = jest.fn();
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
global.requestAnimationFrame = jest.fn((cb) => {
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
  FloatingElement: ({ children, className, ...props }) => <div className={className} data-testid="floating-element" {...props}>{children}</div>,
  TextReveal: ({ text, className, ...props }) => <div className={className} data-testid="text-reveal" {...props}>{text}</div>,
  PulseGlow: ({ children, className, ...props }) => <div className={className} data-testid="pulse-glow" {...props}>{children}</div>,
  MorphingButton: ({ children, className, onClick, ...props }) => <button className={className} onClick={onClick} data-testid="morphing-button" {...props}>{children}</button>,
  MagneticField: ({ children, className, ...props }) => <div className={className} data-testid="magnetic-field" {...props}>{children}</div>,
  ParallaxText: ({ children, className, ...props }) => <div className={className} data-testid="parallax-text" {...props}>{children}</div>,
  AtmosphericLayer: ({ className, ...props }) => <div className={className} data-testid="atmospheric-layer" {...props} />,

  // Additional components for other sections
  ScrollReveal: ({ children, className, ...props }) => <div className={className} data-testid="scroll-reveal" {...props}>{children}</div>,
  AtmosphericParticles: ({ className, ...props }) => <div className={className} data-testid="atmospheric-particles" {...props} />,
  ScrollFadeIn: ({ children, className, ...props }) => <div className={className} data-testid="scroll-fade-in" {...props}>{children}</div>,
  StaggeredScrollFadeIn: ({ children, className, ...props }) => <div className={className} data-testid="staggered-scroll-fade-in" {...props}>{children}</div>,
  SectionScrollAnimation: ({ children, className, ...props }) => <div className={className} data-testid="section-scroll-animation" {...props}>{children}</div>,
  ParallaxContainer: ({ children, className, ...props }) => <div className={className} data-testid="parallax-container" {...props}>{children}</div>,
  ParallaxLayer: ({ children, className, ...props }) => <div className={className} data-testid="parallax-layer" {...props}>{children}</div>,
  MagneticCursor: ({ children, className, ...props }) => <div className={className} data-testid="magnetic-cursor" {...props}>{children}</div>,
  HoverMagnify: ({ children, className, ...props }) => <div className={className} data-testid="hover-magnify" {...props}>{children}</div>,
  GlitchText: ({ text, className, ...props }) => <span className={className} data-testid="glitch-text" {...props}>{text}</span>,
  TypewriterText: ({ text, className, ...props }) => <span className={className} data-testid="typewriter-text" {...props}>{text}</span>,
  TiltCard: ({ children, className, ...props }) => <div className={className} data-testid="tilt-card" {...props}>{children}</div>,
  RippleEffect: ({ children, className, ...props }) => <div className={className} data-testid="ripple-effect" {...props}>{children}</div>,
  StaggeredReveal: ({ children, className, ...props }) => <div className={className} data-testid="staggered-reveal" {...props}>{children}</div>,
  // AboutSection components
  StaggeredGrid: ({ children, className, ...props }) => <div className={className} data-testid="staggered-grid" {...props}>{children}</div>,
  CountUp: ({ end, duration, delay, ...props }) => <span data-testid="count-up" {...props}>{end}</span>,

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

// Mock heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ArrowDownIcon: (props) => <svg data-testid="arrow-down-icon" {...props} />,
  ChevronDownIcon: (props) => <svg data-testid="chevron-down-icon" {...props} />,
  PlayIcon: (props) => <svg data-testid="play-icon" {...props} />,
  EyeIcon: (props) => <svg data-testid="eye-icon" {...props} />,
  PauseIcon: (props) => <svg data-testid="pause-icon" {...props} />,
  XMarkIcon: (props) => <svg data-testid="x-mark-icon" {...props} />,
  Bars3Icon: (props) => <svg data-testid="bars-3-icon" {...props} />,
  // Footer icons
  EnvelopeIcon: (props) => <svg data-testid="envelope-icon" {...props} />,
  PhoneIcon: (props) => <svg data-testid="phone-icon" {...props} />,
  MapPinIcon: (props) => <svg data-testid="map-pin-icon" {...props} />,
  ArrowUpIcon: (props) => <svg data-testid="arrow-up-icon" {...props} />,
  CameraIcon: (props) => <svg data-testid="camera-icon" {...props} />,
  BriefcaseIcon: (props) => <svg data-testid="briefcase-icon" {...props} />,
  FilmIcon: (props) => <svg data-testid="film-icon" {...props} />,
  PaintBrushIcon: (props) => <svg data-testid="paint-brush-icon" {...props} />,
  // AboutSection icons
  CubeIcon: (props) => <svg data-testid="cube-icon" {...props} />,
  SparklesIcon: (props) => <svg data-testid="sparkles-icon" {...props} />,
  CheckBadgeIcon: (props) => <svg data-testid="check-badge-icon" {...props} />,
  TrophyIcon: (props) => <svg data-testid="trophy-icon" {...props} />,
  // ContactSection icons
  PaperAirplaneIcon: (props) => <svg data-testid="paper-airplane-icon" {...props} />,
  ExclamationTriangleIcon: (props) => <svg data-testid="exclamation-triangle-icon" {...props} />,
  CheckCircleIcon: (props) => <svg data-testid="check-circle-icon" {...props} />,
}));

// Setup test environment
beforeEach(() => {
  jest.clearAllMocks();
});
