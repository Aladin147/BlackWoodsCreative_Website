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
  ScrollReveal: ({ children, className }) => <div className={className} data-testid="scroll-reveal">{children}</div>,
  MagneticField: ({ children, className }) => <div className={className} data-testid="magnetic-field">{children}</div>,
  AtmosphericLayer: ({ className }) => <div className={className} data-testid="atmospheric-layer" />,
  ParallaxText: ({ children, className }) => <div className={className} data-testid="parallax-text">{children}</div>,
  AtmosphericParticles: ({ className }) => <div className={className} data-testid="atmospheric-particles" />,
  ScrollFadeIn: ({ children, className }) => <div className={className} data-testid="scroll-fade-in">{children}</div>,
  StaggeredScrollFadeIn: ({ children, className }) => <div className={className} data-testid="staggered-scroll-fade-in">{children}</div>,
  SectionScrollAnimation: ({ children, className }) => <div className={className} data-testid="section-scroll-animation">{children}</div>,
  ParallaxContainer: ({ children, className }) => <div className={className} data-testid="parallax-container">{children}</div>,
  ParallaxLayer: ({ children, className }) => <div className={className} data-testid="parallax-layer">{children}</div>,
  MagneticCursor: ({ children, className }) => <div className={className} data-testid="magnetic-cursor">{children}</div>,
  HoverMagnify: ({ children, className }) => <div className={className} data-testid="hover-magnify">{children}</div>,
  FloatingElement: ({ children, className }) => <div className={className} data-testid="floating-element">{children}</div>,
  PulseGlow: ({ children, className }) => <div className={className} data-testid="pulse-glow">{children}</div>,
  GlitchText: ({ text, className }) => <span className={className} data-testid="glitch-text">{text}</span>,
  TypewriterText: ({ text, className }) => <span className={className} data-testid="typewriter-text">{text}</span>,
  TextReveal: ({ text, className }) => <div className={className} data-testid="text-reveal">{text}</div>,
  MorphingButton: ({ children, className, onClick }) => <button className={className} onClick={onClick} data-testid="morphing-button">{children}</button>,
  TiltCard: ({ children, className }) => <div className={className} data-testid="tilt-card">{children}</div>,
  RippleEffect: ({ children, className }) => <div className={className} data-testid="ripple-effect">{children}</div>,
  StaggeredReveal: ({ children, className }) => <div className={className} data-testid="staggered-reveal">{children}</div>,
}));

// Setup test environment
beforeEach(() => {
  jest.clearAllMocks();
});
