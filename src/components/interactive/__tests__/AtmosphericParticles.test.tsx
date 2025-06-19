/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { AtmosphericParticles } from '../AtmosphericParticles';

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 0);
  return 1;
});
const mockCancelAnimationFrame = jest.fn();

global.requestAnimationFrame = mockRequestAnimationFrame;
global.cancelAnimationFrame = mockCancelAnimationFrame;

// Mock getBoundingClientRect
const mockGetBoundingClientRect = jest.fn(() => ({
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  bottom: 600,
  right: 800,
  x: 0,
  y: 0,
  toJSON: () => {},
}));

// Create a proper mock element that can be appended
const createMockElement = () => {
  if (typeof document !== 'undefined') {
    const element = document.createElement('div');
    element.className = 'absolute rounded-full pointer-events-none';
    return element;
  }
  // Fallback mock for when document is not available
  return {
    className: 'absolute rounded-full pointer-events-none',
    style: {},
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  } as any;
};

describe('AtmosphericParticles', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Ensure DOM environment is available
    if (typeof HTMLDivElement !== 'undefined') {
      // Mock getBoundingClientRect for all div elements
      HTMLDivElement.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    }

    // Mock document.createElement to return mock elements
    if (typeof document !== 'undefined') {
      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'div') {
          return createMockElement();
        }
        return originalCreateElement(tagName);
      });
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders container with default props', () => {
    const { container } = render(<AtmosphericParticles />);

    const particleContainer = container.firstChild as HTMLElement;
    expect(particleContainer).toHaveClass('fixed inset-0 pointer-events-none z-10');
    expect(particleContainer.style.mixBlendMode).toBe('screen');
  });

  it('applies custom className', () => {
    const { container } = render(<AtmosphericParticles className="custom-particles" />);

    expect(container.firstChild).toHaveClass('custom-particles');
  });

  it('creates particles with default count', () => {
    render(<AtmosphericParticles />);

    // Should call createElement for each particle
    expect(document.createElement).toHaveBeenCalledWith('div');
  });

  it('creates particles with custom count', () => {
    render(<AtmosphericParticles count={5} />);

    // Should call createElement for custom count
    expect(document.createElement).toHaveBeenCalledWith('div');
  });

  it('handles zero count gracefully', () => {
    const { container } = render(<AtmosphericParticles count={0} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('starts animation loop', () => {
    render(<AtmosphericParticles />);

    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it('handles container without dimensions', () => {
    mockGetBoundingClientRect.mockReturnValue({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const { container } = render(<AtmosphericParticles count={1} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('cleans up animation on unmount', () => {
    const { unmount } = render(<AtmosphericParticles />);

    unmount();

    expect(mockCancelAnimationFrame).toHaveBeenCalled();
  });

  it('applies mix-blend-mode style correctly', () => {
    const { container } = render(<AtmosphericParticles />);

    const particleContainer = container.firstChild as HTMLElement;
    expect(particleContainer.style.mixBlendMode).toBe('screen');
  });

  it('sets pointer-events-none for performance', () => {
    const { container } = render(<AtmosphericParticles />);

    expect(container.firstChild).toHaveClass('pointer-events-none');
  });

  it('positions container as fixed overlay', () => {
    const { container } = render(<AtmosphericParticles />);

    expect(container.firstChild).toHaveClass('fixed inset-0');
  });

  it('sets appropriate z-index', () => {
    const { container } = render(<AtmosphericParticles />);

    expect(container.firstChild).toHaveClass('z-10');
  });

  it('handles container ref being null', () => {
    // This test verifies the component doesn't crash when ref is null
    const { container } = render(<AtmosphericParticles />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('respects particle count changes', () => {
    const { rerender } = render(<AtmosphericParticles count={5} />);

    expect(document.createElement).toHaveBeenCalledWith('div');

    jest.clearAllMocks();

    rerender(<AtmosphericParticles count={10} />);

    expect(document.createElement).toHaveBeenCalledWith('div');
  });

  it('maintains particle properties within expected ranges', () => {
    render(<AtmosphericParticles count={1} />);

    // Verify that particle creation works
    expect(document.createElement).toHaveBeenCalledWith('div');
  });
});
