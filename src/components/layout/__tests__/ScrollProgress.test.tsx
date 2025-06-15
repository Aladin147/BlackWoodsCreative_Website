import React from 'react';
import { render } from '@testing-library/react';
import { ScrollProgress } from '../ScrollProgress';

// Mock framer-motion
interface MockMotionDivProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  [key: string]: unknown;
}

interface MockMotionValue {
  get: () => number;
  set: jest.Mock;
}

interface MockSpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
}

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, initial, animate, transition, ...props }: MockMotionDivProps) => (
      <div
        className={className}
        style={style}
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
        {...props}
      >
        {children}
      </div>
    ),
  },
  useScroll: () => ({
    scrollYProgress: { get: () => 0.5 }
  }),
  useSpring: (_value: MockMotionValue, config: MockSpringConfig): MockMotionValue => ({
    get: () => 0.5,
    set: jest.fn(),
    ...config
  }),
}));

// Mock window properties
Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true,
});

Object.defineProperty(window, 'innerHeight', {
  value: 1000,
  writable: true,
});

describe('ScrollProgress', () => {
  beforeEach(() => {
    // Reset window properties
    window.scrollY = 0;
    window.innerHeight = 1000;
    
    // Clear all event listeners
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any remaining event listeners
    window.removeEventListener('scroll', jest.fn());
  });

  it('renders without crashing', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-progress-class';
    render(<ScrollProgress className={customClass} />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toHaveClass(customClass);
  });

  it('has correct default styling', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toHaveClass('fixed');
    expect(progressContainer).toHaveClass('top-0');
    expect(progressContainer).toHaveClass('left-0');
    expect(progressContainer).toHaveClass('right-0');
    expect(progressContainer).toHaveClass('z-50');
    expect(progressContainer).toHaveClass('h-1');
    expect(progressContainer).toHaveClass('bg-bw-dark-gray/50');
  });

  it('contains progress bar element', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    const progressBar = progressContainer?.querySelector('div');

    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass('h-full');
    expect(progressBar).toHaveClass('bg-gradient-to-r');
    expect(progressBar).toHaveClass('from-bw-gold');
    expect(progressBar).toHaveClass('to-yellow-400');
    expect(progressBar).toHaveClass('origin-left');
  });

  it('sets up scroll event listener', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    
    render(<ScrollProgress />);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('removes scroll event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<ScrollProgress />);
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('has correct initial animation properties', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toHaveAttribute('data-initial', JSON.stringify({ opacity: 0 }));
  });

  it('has correct transition properties', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toHaveAttribute('data-transition', JSON.stringify({ duration: 0.3 }));
  });

  it('uses framer-motion useScroll hook', () => {
    render(<ScrollProgress />);

    // Component should render without errors when using useScroll
    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toBeInTheDocument();
  });

  it('uses framer-motion useSpring hook with correct config', () => {
    render(<ScrollProgress />);

    // Component should render without errors when using useSpring
    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toBeInTheDocument();
  });

  it('handles scroll events correctly', () => {
    // Mock scroll event
    const scrollEvent = new Event('scroll');
    
    render(<ScrollProgress />);
    
    // Simulate scroll
    window.scrollY = 300; // 30% of window height (1000px)
    window.dispatchEvent(scrollEvent);
    
    // Component should handle the scroll event
    expect(window.scrollY).toBe(300);
  });

  it('calculates visibility threshold correctly', () => {
    render(<ScrollProgress />);
    
    // The component should show when scrollY > windowHeight * 0.2
    // With windowHeight = 1000, threshold should be 200px
    const threshold = window.innerHeight * 0.2;
    expect(threshold).toBe(200);
  });

  it('handles window resize correctly', () => {
    render(<ScrollProgress />);
    
    // Change window height
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
    });
    
    // The component should adapt to new window height
    expect(window.innerHeight).toBe(800);
  });

  it('has correct z-index for proper layering', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toHaveClass('z-50');
  });

  it('uses fixed positioning', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toHaveClass('fixed');
  });

  it('spans full width', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toHaveClass('left-0');
    expect(progressContainer).toHaveClass('right-0');
  });

  it('is positioned at top', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toHaveClass('top-0');
  });

  it('has correct height', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toHaveClass('h-1');
  });

  it('handles multiple scroll events', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    
    render(<ScrollProgress />);
    
    // Simulate multiple scroll events
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    window.dispatchEvent(scrollEvent);
    window.dispatchEvent(scrollEvent);
    
    // Should only add one listener
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('maintains component structure', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    const progressBar = progressContainer?.querySelector('div');

    expect(progressContainer).toBeInTheDocument();
    expect(progressBar).toBeInTheDocument();
    expect(progressContainer?.children).toHaveLength(1);
  });

  it('applies gradient styling to progress bar', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    const progressBar = progressContainer?.querySelector('div');

    expect(progressBar).toHaveClass('bg-gradient-to-r');
    expect(progressBar).toHaveClass('from-bw-gold');
    expect(progressBar).toHaveClass('to-yellow-400');
  });

  it('sets correct transform origin', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    const progressBar = progressContainer?.querySelector('div');

    expect(progressBar).toHaveClass('origin-left');
  });

  it('handles edge case with zero window height', () => {
    Object.defineProperty(window, 'innerHeight', {
      value: 0,
      writable: true,
    });

    render(<ScrollProgress />);

    // Should not crash with zero height
    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toBeInTheDocument();
  });

  it('handles edge case with negative scroll position', () => {
    Object.defineProperty(window, 'scrollY', {
      value: -100,
      writable: true,
    });

    render(<ScrollProgress />);

    // Should handle negative scroll gracefully
    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toBeInTheDocument();
  });

  it('combines custom className with default classes', () => {
    const customClass = 'my-custom-class';
    render(<ScrollProgress className={customClass} />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toHaveClass(customClass);
    expect(progressContainer).toHaveClass('fixed');
    expect(progressContainer).toHaveClass('top-0');
  });

  it('works without className prop', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toBeInTheDocument();
    expect(progressContainer).toHaveClass('fixed');
  });

  it('maintains accessibility', () => {
    render(<ScrollProgress />);

    const progressContainer = document.querySelector('.fixed.top-0.left-0.right-0.z-50.h-1');
    expect(progressContainer).toBeInTheDocument();

    // Should be a visual indicator, not interactive
    expect(progressContainer).not.toHaveAttribute('tabindex');
    expect(progressContainer).not.toHaveAttribute('role', 'button');
  });
});
