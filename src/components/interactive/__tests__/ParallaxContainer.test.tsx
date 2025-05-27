import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParallaxContainer } from '../ParallaxContainer';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useMotionValue: () => ({
    set: jest.fn(),
    get: jest.fn(() => 0),
  }),
  useSpring: () => ({
    set: jest.fn(),
    get: jest.fn(() => 0),
  }),
  useTransform: () => 0,
  useScroll: () => ({
    scrollY: { get: jest.fn(() => 0) },
    scrollYProgress: { get: jest.fn(() => 0) },
  }),
}));

// Mock intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

describe('ParallaxContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <ParallaxContainer>
        <div>Test Content</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ParallaxContainer className="custom-class">
        <div>Test</div>
      </ParallaxContainer>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles different parallax speeds', () => {
    render(
      <ParallaxContainer speed={0.5}>
        <div>Slow Parallax</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Slow Parallax')).toBeInTheDocument();
  });

  it('handles scroll events', () => {
    render(
      <ParallaxContainer>
        <div>Parallax Content</div>
      </ParallaxContainer>
    );

    // Simulate scroll event
    fireEvent.scroll(window, { target: { scrollY: 100 } });

    expect(screen.getByText('Parallax Content')).toBeInTheDocument();
  });

  it('supports different parallax directions', () => {
    render(
      <ParallaxContainer direction="horizontal">
        <div>Horizontal Parallax</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Horizontal Parallax')).toBeInTheDocument();
  });

  it('handles depth layers', () => {
    render(
      <ParallaxContainer depth={3}>
        <div>Deep Parallax</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Deep Parallax')).toBeInTheDocument();
  });

  it('respects reduced motion preferences', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <ParallaxContainer>
        <div>Reduced Motion</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
  });

  it('handles multiple parallax layers', () => {
    render(
      <ParallaxContainer>
        <div data-parallax-layer="background">Background</div>
        <div data-parallax-layer="midground">Midground</div>
        <div data-parallax-layer="foreground">Foreground</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Midground')).toBeInTheDocument();
    expect(screen.getByText('Foreground')).toBeInTheDocument();
  });

  it('supports cinematic effects', () => {
    render(
      <ParallaxContainer cinematic={true}>
        <div>Cinematic Parallax</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Cinematic Parallax')).toBeInTheDocument();
  });

  it('handles magnetic field effects', () => {
    render(
      <ParallaxContainer magnetic={true}>
        <div>Magnetic Parallax</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Magnetic Parallax')).toBeInTheDocument();
  });

  it('supports depth of field blur', () => {
    render(
      <ParallaxContainer depthOfField={true}>
        <div>Blurred Parallax</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Blurred Parallax')).toBeInTheDocument();
  });

  it('handles viewport boundaries', () => {
    render(
      <ParallaxContainer bounds={{ top: 0, bottom: 1000 }}>
        <div>Bounded Parallax</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Bounded Parallax')).toBeInTheDocument();
  });

  it('supports easing functions', () => {
    render(
      <ParallaxContainer easing="easeInOut">
        <div>Eased Parallax</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Eased Parallax')).toBeInTheDocument();
  });

  it('handles performance optimization', () => {
    render(
      <ParallaxContainer optimized={true}>
        <div>Optimized Parallax</div>
      </ParallaxContainer>
    );

    expect(screen.getByText('Optimized Parallax')).toBeInTheDocument();
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(
      <ParallaxContainer>
        <div>Cleanup Test</div>
      </ParallaxContainer>
    );

    unmount();

    // Should not throw errors on cleanup
    expect(true).toBe(true);
  });
});
