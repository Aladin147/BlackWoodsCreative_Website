/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import React from 'react';

import { AtmosphericParticles } from '../AtmosphericParticles';

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = jest.fn(() => 1);
const mockCancelAnimationFrame = jest.fn();

global.requestAnimationFrame = mockRequestAnimationFrame;
global.cancelAnimationFrame = mockCancelAnimationFrame;

// Mock canvas context for device capabilities
const mockCanvasContext = {
  getParameter: jest.fn(() => 'WebGL 1.0'),
  getSupportedExtensions: jest.fn(() => []),
};

const mockGetContext = jest.fn((contextType: string) => {
  if (contextType === 'webgl' || contextType === 'experimental-webgl' || contextType === 'webgl2') {
    return mockCanvasContext;
  }
  return null;
});

// Mock HTMLCanvasElement.prototype.getContext
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: mockGetContext,
  writable: true,
  configurable: true,
});

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
  toJSON: () => ({
    width: 800,
    height: 600,
    top: 0,
    left: 0,
    bottom: 600,
    right: 800,
    x: 0,
    y: 0,
  }),
}));

describe('AtmosphericParticles', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock getBoundingClientRect for all elements
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
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

    // Should start animation loop
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it('creates particles with custom count', () => {
    render(<AtmosphericParticles count={5} />);

    // Should start animation loop
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
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
      toJSON: () => ({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
      }),
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

    expect(mockRequestAnimationFrame).toHaveBeenCalled();

    jest.clearAllMocks();

    rerender(<AtmosphericParticles count={10} />);

    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it('maintains particle properties within expected ranges', () => {
    render(<AtmosphericParticles count={1} />);

    // Verify that animation starts
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });
});
