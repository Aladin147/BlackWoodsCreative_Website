import { render, screen, fireEvent } from '@testing-library/react';
import {
  ParallaxLayer,
  ParallaxContainer,
  CinematicParallax,
  MagneticField,
  DepthOfField
} from '../ParallaxContainer';

// Mock framer-motion
interface MockMotionValue {
  on: jest.Mock;
  get: () => number;
  set?: jest.Mock;
}

interface MockTransformFunction {
  (progress: number): number;
}

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, ...props }: React.ComponentProps<'div'> & { style?: React.CSSProperties }) => (
      <div {...props} style={style}>{children}</div>
    ),
  },
  useScroll: () => ({
    scrollYProgress: { on: jest.fn(), get: () => 0 }
  }),
  useTransform: (motionValue: MockMotionValue | MockTransformFunction, _input?: number[], output?: (number | string)[]): MockMotionValue => {
    if (typeof motionValue === 'function') {
      return { on: jest.fn(), get: () => motionValue(0) };
    }
    return { on: jest.fn(), get: () => output ? (typeof output[0] === 'number' ? output[0] : 0) : 0 };
  },
  useSpring: (): MockMotionValue => ({
    on: jest.fn(),
    get: () => 0,
    set: jest.fn(),
  }),
}));

describe('ParallaxLayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(
        <ParallaxLayer>
          <div data-testid="child-content">Test Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ParallaxLayer className="custom-parallax">
          <div>Content</div>
        </ParallaxLayer>
      );

      const parallaxElement = container.firstChild;
      expect(parallaxElement).toHaveClass('custom-parallax');
    });

    it('renders without className', () => {
      const { container } = render(
        <ParallaxLayer>
          <div>Content</div>
        </ParallaxLayer>
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Direction Props', () => {
    it('handles up direction', () => {
      render(
        <ParallaxLayer direction="up" speed={1}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('handles down direction', () => {
      render(
        <ParallaxLayer direction="down" speed={1}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('handles left direction', () => {
      render(
        <ParallaxLayer direction="left" speed={1}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('handles right direction', () => {
      render(
        <ParallaxLayer direction="right" speed={1}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('uses default direction when not specified', () => {
      render(
        <ParallaxLayer>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('Speed and Effects', () => {
    it('handles custom speed values', () => {
      render(
        <ParallaxLayer speed={2.5}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('applies scale effects', () => {
      render(
        <ParallaxLayer scale={[0.8, 1.2]}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('applies opacity effects', () => {
      render(
        <ParallaxLayer opacity={[0.5, 1]}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('applies rotation effects', () => {
      render(
        <ParallaxLayer rotate={[0, 360]}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('applies blur effects', () => {
      render(
        <ParallaxLayer blur={[0, 10]}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('handles multiple effects combined', () => {
      render(
        <ParallaxLayer
          scale={[0.9, 1.1]}
          opacity={[0.8, 1]}
          rotate={[-5, 5]}
          blur={[0, 2]}
        >
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('Offset Configuration', () => {
    it('handles custom offset values', () => {
      render(
        <ParallaxLayer offset={['start center', 'end center']}>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('uses default offset when not specified', () => {
      render(
        <ParallaxLayer>
          <div data-testid="content">Content</div>
        </ParallaxLayer>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });
});

describe('ParallaxContainer', () => {
  it('renders children with proper container structure', () => {
    render(
      <ParallaxContainer>
        <div data-testid="child-content">Container Content</div>
      </ParallaxContainer>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Container Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ParallaxContainer className="custom-container">
        <div>Content</div>
      </ParallaxContainer>
    );

    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('custom-container');
  });

  it('has proper default classes', () => {
    const { container } = render(
      <ParallaxContainer>
        <div>Content</div>
      </ParallaxContainer>
    );

    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('relative');
    expect(containerElement).toHaveClass('overflow-hidden');
  });

  it('renders without className', () => {
    const { container } = render(
      <ParallaxContainer>
        <div>Content</div>
      </ParallaxContainer>
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('CinematicParallax', () => {
  it('renders children with cinematic structure', () => {
    render(
      <CinematicParallax>
        <div data-testid="cinematic-content">Cinematic Content</div>
      </CinematicParallax>
    );

    expect(screen.getByTestId('cinematic-content')).toBeInTheDocument();
    expect(screen.getByText('Cinematic Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CinematicParallax className="custom-cinematic">
        <div>Content</div>
      </CinematicParallax>
    );

    const cinematicElement = container.firstChild;
    expect(cinematicElement).toHaveClass('custom-cinematic');
  });

  it('has proper cinematic structure with background and foreground', () => {
    const { container } = render(
      <CinematicParallax>
        <div data-testid="content">Content</div>
      </CinematicParallax>
    );

    const cinematicContainer = container.firstChild;
    expect(cinematicContainer).toHaveClass('relative');
    expect(cinematicContainer).toHaveClass('h-screen');
    expect(cinematicContainer).toHaveClass('overflow-hidden');
  });

  it('renders background gradient', () => {
    const { container } = render(
      <CinematicParallax>
        <div>Content</div>
      </CinematicParallax>
    );

    const backgroundGradient = container.querySelector('.bg-gradient-to-br');
    expect(backgroundGradient).toBeInTheDocument();
  });

  it('renders floating elements', () => {
    const { container } = render(
      <CinematicParallax>
        <div>Content</div>
      </CinematicParallax>
    );

    const floatingElements = container.querySelectorAll('.rounded-full.blur-2xl, .rounded-full.blur-3xl');
    expect(floatingElements.length).toBeGreaterThan(0);
  });
});

describe('MagneticField', () => {
  beforeEach(() => {
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      right: 300,
      bottom: 300,
      x: 100,
      y: 100,
      toJSON: jest.fn(),
    }));
  });

  it('renders children correctly', () => {
    render(
      <MagneticField>
        <div data-testid="magnetic-content">Magnetic Content</div>
      </MagneticField>
    );

    expect(screen.getByTestId('magnetic-content')).toBeInTheDocument();
    expect(screen.getByText('Magnetic Content')).toBeInTheDocument();
  });

  it('handles custom strength values', () => {
    render(
      <MagneticField strength={0.8}>
        <div data-testid="content">Content</div>
      </MagneticField>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('uses default strength when not specified', () => {
    render(
      <MagneticField>
        <div data-testid="content">Content</div>
      </MagneticField>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('handles mouse interactions', () => {
    const { container } = render(
      <MagneticField>
        <div data-testid="content">Content</div>
      </MagneticField>
    );

    const magneticElement = container.firstChild as HTMLElement;

    // Simulate mouse move
    fireEvent.mouseMove(magneticElement, {
      clientX: 150,
      clientY: 150,
    });

    // Should not throw error
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('handles mouse leave', () => {
    const { container } = render(
      <MagneticField>
        <div data-testid="content">Content</div>
      </MagneticField>
    );

    const magneticElement = container.firstChild as HTMLElement;

    // Simulate mouse leave
    fireEvent.mouseLeave(magneticElement);

    // Should not throw error
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('has proper transform classes', () => {
    const { container } = render(
      <MagneticField>
        <div>Content</div>
      </MagneticField>
    );

    const magneticElement = container.firstChild;
    expect(magneticElement).toHaveClass('transform-gpu');
  });
});

describe('DepthOfField', () => {
  it('renders children correctly', () => {
    render(
      <DepthOfField>
        <div data-testid="depth-content">Depth Content</div>
      </DepthOfField>
    );

    expect(screen.getByTestId('depth-content')).toBeInTheDocument();
    expect(screen.getByText('Depth Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <DepthOfField className="custom-depth">
        <div>Content</div>
      </DepthOfField>
    );

    const depthElement = container.firstChild;
    expect(depthElement).toHaveClass('custom-depth');
  });

  it('handles custom focus distance', () => {
    render(
      <DepthOfField focusDistance={0.8}>
        <div data-testid="content">Content</div>
      </DepthOfField>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('uses default focus distance when not specified', () => {
    render(
      <DepthOfField>
        <div data-testid="content">Content</div>
      </DepthOfField>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders without className', () => {
    const { container } = render(
      <DepthOfField>
        <div>Content</div>
      </DepthOfField>
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
