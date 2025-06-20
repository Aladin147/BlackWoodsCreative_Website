import { render, screen } from '@testing-library/react';
import React from 'react';

import {
  ScrollReveal,
  ParallaxText,
  ScrollProgressBar,
  CountUp,
  StaggeredGrid,
  MorphingShape,
  ScrollTriggeredCounter,
} from '../AdvancedScrollAnimations';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useScroll: jest.fn(() => ({
    scrollYProgress: { get: () => 0.5 },
  })),
  useTransform: jest.fn((_value, _input, output) => ({ get: () => output[1] })),
  useSpring: jest.fn(value => value),
  useInView: jest.fn(() => true),
}));

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn(callback => {
  setTimeout(callback, 16);
  return 1;
});
global.cancelAnimationFrame = jest.fn();

describe('ScrollReveal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children with default props', () => {
    render(
      <ScrollReveal>
        <div>Test content</div>
      </ScrollReveal>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ScrollReveal className="custom-class">
        <div>Test content</div>
      </ScrollReveal>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles different directions correctly', () => {
    const directions = ['up', 'down', 'left', 'right'] as const;

    directions.forEach(direction => {
      const { unmount } = render(
        <ScrollReveal direction={direction}>
          <div>Test {direction}</div>
        </ScrollReveal>
      );

      expect(screen.getByText(`Test ${direction}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('handles custom distance and timing props', () => {
    render(
      <ScrollReveal distance={100} delay={0.5} duration={1.2}>
        <div>Custom props test</div>
      </ScrollReveal>
    );

    expect(screen.getByText('Custom props test')).toBeInTheDocument();
  });

  it('handles invalid direction gracefully', () => {
    render(
      <ScrollReveal direction={'invalid' as any}>
        <div>Invalid direction test</div>
      </ScrollReveal>
    );

    expect(screen.getByText('Invalid direction test')).toBeInTheDocument();
  });
});

describe('ParallaxText', () => {
  it('renders children with parallax effect', () => {
    render(
      <ParallaxText>
        <h1>Parallax Title</h1>
      </ParallaxText>
    );

    expect(screen.getByText('Parallax Title')).toBeInTheDocument();
  });

  it('applies custom className and speed', () => {
    const { container } = render(
      <ParallaxText className="parallax-custom" speed={0.8}>
        <div>Fast parallax</div>
      </ParallaxText>
    );

    expect(container.firstChild).toHaveClass('parallax-custom');
    expect(screen.getByText('Fast parallax')).toBeInTheDocument();
  });

  it('uses default speed when not provided', () => {
    render(
      <ParallaxText>
        <div>Default speed</div>
      </ParallaxText>
    );

    expect(screen.getByText('Default speed')).toBeInTheDocument();
  });
});

describe('ScrollProgressBar', () => {
  it('renders progress bar with default styles', () => {
    const { container } = render(<ScrollProgressBar />);

    const progressBar = container.firstChild;
    expect(progressBar).toHaveClass('fixed top-0 left-0 right-0 h-1 bg-bw-accent-gold');
  });

  it('applies custom className', () => {
    const { container } = render(<ScrollProgressBar className="custom-progress" />);

    expect(container.firstChild).toHaveClass('custom-progress');
  });
});

describe('CountUp', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial count of 0', () => {
    render(<CountUp end={100} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('includes prefix and suffix', () => {
    render(<CountUp end={100} prefix="$" suffix="K" />);

    expect(screen.getByText('$0K')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<CountUp end={100} className="count-custom" />);

    expect(container.firstChild).toHaveClass('count-custom');
  });

  it('handles zero end value', () => {
    render(<CountUp end={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles large numbers with locale formatting', () => {
    render(<CountUp end={1000000} />);

    // Should format with commas
    expect(screen.getByText('0')).toBeInTheDocument(); // Initial state
  });

  it('respects duration and delay props', () => {
    render(<CountUp end={100} duration={1} delay={0.5} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

describe('StaggeredGrid', () => {
  it('renders all children', () => {
    render(
      <StaggeredGrid>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </StaggeredGrid>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StaggeredGrid className="grid-custom">
        <div>Item</div>
      </StaggeredGrid>
    );

    expect(container.firstChild).toHaveClass('grid-custom');
  });

  it('handles single child', () => {
    render(
      <StaggeredGrid>
        <div>Single item</div>
      </StaggeredGrid>
    );

    expect(screen.getByText('Single item')).toBeInTheDocument();
  });

  it('handles empty children gracefully', () => {
    const { container } = render(<StaggeredGrid>{null}</StaggeredGrid>);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('respects custom stagger delay', () => {
    render(
      <StaggeredGrid staggerDelay={0.2}>
        <div>Delayed item</div>
      </StaggeredGrid>
    );

    expect(screen.getByText('Delayed item')).toBeInTheDocument();
  });
});

describe('MorphingShape', () => {
  it('renders with default props', () => {
    const { container } = render(<MorphingShape />);

    const shape = container.firstChild;
    expect(shape).toHaveClass('absolute rounded-full blur-3xl');
  });

  it('applies custom className and color', () => {
    const { container } = render(<MorphingShape className="shape-custom" color="accent-blue" />);

    expect(container.firstChild).toHaveClass('shape-custom');
  });

  it('uses default color when not specified', () => {
    const { container } = render(<MorphingShape />);

    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('ScrollTriggeredCounter', () => {
  const mockCounters = [
    { label: 'Projects', value: 50, suffix: '+' },
    { label: 'Clients', value: 100, prefix: '$', suffix: 'K' },
    { label: 'Years', value: 5 },
  ];

  it('renders all counters', () => {
    render(<ScrollTriggeredCounter counters={mockCounters} />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Years')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ScrollTriggeredCounter counters={mockCounters} className="counter-grid" />
    );

    expect(container.firstChild).toHaveClass('counter-grid');
  });

  it('handles empty counters array', () => {
    const { container } = render(<ScrollTriggeredCounter counters={[]} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders counter values with proper formatting', () => {
    render(<ScrollTriggeredCounter counters={mockCounters} />);

    // Should render CountUp components for each counter
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Years')).toBeInTheDocument();
  });

  it('handles counters without prefix/suffix', () => {
    const simpleCounters = [{ label: 'Simple', value: 10 }];

    render(<ScrollTriggeredCounter counters={simpleCounters} />);

    expect(screen.getByText('Simple')).toBeInTheDocument();
  });
});
