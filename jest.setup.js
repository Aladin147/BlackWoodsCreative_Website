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
}));

// Mock heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ArrowDownIcon: (props) => <svg data-testid="arrow-down-icon" {...props} />,
  ChevronDownIcon: (props) => <svg data-testid="chevron-down-icon" {...props} />,
  PlayIcon: (props) => <svg data-testid="play-icon" {...props} />,
  PauseIcon: (props) => <svg data-testid="pause-icon" {...props} />,
  XMarkIcon: (props) => <svg data-testid="x-mark-icon" {...props} />,
  Bars3Icon: (props) => <svg data-testid="bars-3-icon" {...props} />,
}));

// Setup test environment
beforeEach(() => {
  jest.clearAllMocks();
});
