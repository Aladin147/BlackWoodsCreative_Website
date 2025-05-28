import React from 'react';
import { render, screen } from '@testing-library/react';

// Import components from the index to test proper exports
import {
  TextReveal,
  ParallaxContainer,
  ParallaxLayer,
  ScrollStoryTeller,
  MagneticCursor,
  HoverMagnify,
  FloatingElement,
  PulseGlow,
  GlitchText,
  TypewriterText,
} from '../index';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span data-testid="motion-span" {...props}>{children}</span>,
  },
  useScroll: () => ({ scrollYProgress: { on: jest.fn(), get: () => 0 } }),
  useTransform: () => 0,
  useSpring: () => ({ on: jest.fn() }),
  useMotionValue: () => ({ on: jest.fn() }),
  AnimatePresence: ({ children }: any) => children,
}));

// Mock intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('Interactive Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('TextReveal component is defined', () => {
    expect(TextReveal).toBeDefined();
    expect(typeof TextReveal).toBe('function');
  });

  it('ParallaxContainer component is defined', () => {
    expect(ParallaxContainer).toBeDefined();
    expect(typeof ParallaxContainer).toBe('function');
  });

  it('ParallaxLayer component is defined', () => {
    expect(ParallaxLayer).toBeDefined();
    expect(typeof ParallaxLayer).toBe('function');
  });

  it('ScrollStoryTeller component is defined', () => {
    expect(ScrollStoryTeller).toBeDefined();
    expect(typeof ScrollStoryTeller).toBe('function');
  });

  it('MagneticCursor component is defined', () => {
    expect(MagneticCursor).toBeDefined();
    expect(typeof MagneticCursor).toBe('function');
  });

  it('HoverMagnify component is defined', () => {
    expect(HoverMagnify).toBeDefined();
    expect(typeof HoverMagnify).toBe('function');
  });

  it('FloatingElement component is defined', () => {
    expect(FloatingElement).toBeDefined();
    expect(typeof FloatingElement).toBe('function');
  });

  it('PulseGlow component is defined', () => {
    expect(PulseGlow).toBeDefined();
    expect(typeof PulseGlow).toBe('function');
  });

  it('GlitchText component is defined', () => {
    expect(GlitchText).toBeDefined();
    expect(typeof GlitchText).toBe('function');
  });

  it('TypewriterText component is defined', () => {
    expect(TypewriterText).toBeDefined();
    expect(typeof TypewriterText).toBe('function');
  });

  describe('TextReveal Component', () => {
    it('renders with text prop', () => {
      render(<TextReveal text="ABC" />);
      // TextReveal splits text into individual characters, check for unique letters
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<TextReveal text="Test" className="custom-class" />);
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });
  });

  describe('ParallaxContainer Component', () => {
    it('renders children', () => {
      render(
        <ParallaxContainer>
          <div>Parallax Content</div>
        </ParallaxContainer>
      );
      expect(screen.getByText('Parallax Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ParallaxContainer className="parallax-class">
          <div>Content</div>
        </ParallaxContainer>
      );
      const element = container.querySelector('.parallax-class');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('parallax-class');
    });
  });

  describe('ParallaxLayer Component', () => {
    it('renders children', () => {
      render(
        <ParallaxLayer>
          <div>Layer Content</div>
        </ParallaxLayer>
      );
      expect(screen.getByText('Layer Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ParallaxLayer className="layer-class">
          <div>Content</div>
        </ParallaxLayer>
      );
      const element = container.querySelector('.layer-class');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('layer-class');
    });
  });

  describe('MagneticCursor Component', () => {
    it('renders without crashing', () => {
      render(
        <MagneticCursor>
          <div data-testid="cursor-child">Cursor Content</div>
        </MagneticCursor>
      );
      // MagneticCursor wraps the entire page, so check for the cursor elements
      const motionDivs = screen.getAllByTestId('motion-div');
      expect(motionDivs.length).toBeGreaterThan(0);
    });
  });

  describe('HoverMagnify Component', () => {
    it('renders children', () => {
      render(
        <HoverMagnify>
          <div>Magnify Content</div>
        </HoverMagnify>
      );
      expect(screen.getByText('Magnify Content')).toBeInTheDocument();
    });

    it('applies custom scale', () => {
      render(
        <HoverMagnify scale={1.2}>
          <div>Content</div>
        </HoverMagnify>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('FloatingElement Component', () => {
    it('renders children', () => {
      render(
        <FloatingElement>
          <div>Floating Content</div>
        </FloatingElement>
      );
      expect(screen.getByText('Floating Content')).toBeInTheDocument();
    });

    it('applies custom intensity', () => {
      render(
        <FloatingElement intensity={0.5}>
          <div>Content</div>
        </FloatingElement>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('PulseGlow Component', () => {
    it('renders children', () => {
      render(
        <PulseGlow>
          <div>Pulse Content</div>
        </PulseGlow>
      );
      expect(screen.getByText('Pulse Content')).toBeInTheDocument();
    });

    it('applies custom duration', () => {
      render(
        <PulseGlow duration={3}>
          <div>Content</div>
        </PulseGlow>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('GlitchText Component', () => {
    it('renders with text prop', () => {
      render(<GlitchText text="Glitch Text" />);
      expect(screen.getByText('Glitch Text')).toBeInTheDocument();
    });

    it('applies custom intensity', () => {
      render(<GlitchText text="Test" intensity={0.8} />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('TypewriterText Component', () => {
    it('renders component structure', () => {
      const { container } = render(<TypewriterText text="Test" />);
      // TypewriterText shows text progressively, so check for the component structure
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
    });

    it('applies custom speed prop', () => {
      const { container } = render(<TypewriterText text="Test" speed={100} />);
      // Check that component renders with speed prop
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
    });
  });

  it('all components handle unmounting gracefully', () => {
    const components = [
      <TextReveal key="1" text="Test" />,
      <ParallaxContainer key="2"><div>Test</div></ParallaxContainer>,
      <ParallaxLayer key="3"><div>Test</div></ParallaxLayer>,
      <MagneticCursor key="4"><div>Test</div></MagneticCursor>,
      <HoverMagnify key="5"><div>Test</div></HoverMagnify>,
      <FloatingElement key="6"><div>Test</div></FloatingElement>,
      <PulseGlow key="7"><div>Test</div></PulseGlow>,
      <GlitchText key="8" text="Test" />,
      <TypewriterText key="9" text="Test" />,
    ];

    components.forEach(component => {
      const { unmount } = render(component);
      expect(() => unmount()).not.toThrow();
    });
  });
});
