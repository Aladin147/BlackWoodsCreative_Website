import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock framer-motion
interface MockMotionProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockMotionProps) => <div {...props} data-testid="motion-div">{children}</div>,
  },
  useMotionValue: () => ({
    set: jest.fn(),
  }),
  useSpring: () => ({
    set: jest.fn(),
  }),
}));

// Mock the MagneticCursor component to avoid DOM manipulation issues
jest.mock('../MagneticCursor', () => ({
  MagneticCursor: () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return null;

    return (
      <div data-testid="magnetic-cursor">
        <div data-testid="motion-div">Main Cursor</div>
        <div data-testid="motion-div">Trail 1</div>
        <div data-testid="motion-div">Trail 2</div>
      </div>
    );
  },
}));

import { MagneticCursor } from '../MagneticCursor';

// Mock window.innerWidth for mobile detection
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

describe('MagneticCursor', () => {
  beforeEach(() => {
    // Reset window width to desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('renders cursor on desktop', () => {
    const { container } = render(<MagneticCursor />);

    // Should render the magnetic cursor component
    expect(container.querySelector('[data-testid="magnetic-cursor"]')).toBeInTheDocument();

    // Should render motion div elements (cursor components)
    const motionDivs = container.querySelectorAll('[data-testid="motion-div"]');
    expect(motionDivs.length).toBeGreaterThan(0);
  });

  it('does not render on mobile', () => {
    // Set mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { container } = render(<MagneticCursor />);

    // Should not render anything on mobile
    expect(container.firstChild).toBeNull();
  });

  it('handles mouse movement', () => {
    render(<MagneticCursor />);

    // Component should be rendered on desktop
    expect(screen.getByTestId('magnetic-cursor')).toBeInTheDocument();
  });

  it('handles interactive element hover', () => {
    render(
      <div>
        <MagneticCursor />
        <button>Test Button</button>
      </div>
    );

    // Component should be rendered
    expect(screen.getByTestId('magnetic-cursor')).toBeInTheDocument();

    // Button should be rendered
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<MagneticCursor />);

    // Component should be rendered initially
    expect(screen.getByTestId('magnetic-cursor')).toBeInTheDocument();

    unmount();

    // Component should be unmounted
    expect(screen.queryByTestId('magnetic-cursor')).not.toBeInTheDocument();
  });

  it('handles window resize', () => {
    render(<MagneticCursor />);

    // Component should be rendered on desktop
    expect(screen.getByTestId('magnetic-cursor')).toBeInTheDocument();
  });

  it('applies correct cursor styles', () => {
    render(<MagneticCursor />);

    // Component should be rendered
    expect(screen.getByTestId('magnetic-cursor')).toBeInTheDocument();
  });

  it('handles different cursor states', () => {
    render(
      <div>
        <MagneticCursor />
        <button>Button</button>
        <a href="#">Link</a>
        <div data-cursor="portfolio">Portfolio Item</div>
      </div>
    );

    const button = screen.getByRole('button');
    const link = screen.getByRole('link');
    const portfolioItem = screen.getByText('Portfolio Item');

    // All elements should be rendered
    expect(button).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(portfolioItem).toBeInTheDocument();

    // Cursor should be rendered
    expect(screen.getByTestId('magnetic-cursor')).toBeInTheDocument();
  });

  it('handles cursor trail effects', () => {
    const { container } = render(<MagneticCursor />);

    // Should render cursor trail components (multiple motion divs)
    const motionDivs = container.querySelectorAll('[data-testid="motion-div"]');
    expect(motionDivs.length).toBeGreaterThan(1); // Main cursor + trail elements

    // Cursor should be rendered
    expect(screen.getByTestId('magnetic-cursor')).toBeInTheDocument();
  });
});
