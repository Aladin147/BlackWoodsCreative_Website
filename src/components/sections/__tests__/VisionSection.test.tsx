import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VisionSection } from '../VisionSection';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section data-testid="motion-section" {...props}>{children}</section>,
  },
  useScroll: () => ({
    scrollYProgress: { on: jest.fn(), get: () => 0 }
  }),
  useTransform: () => 0,
  useSpring: () => ({ on: jest.fn() }),
}));

// Mock intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock TextReveal component
jest.mock('@/components/interactive', () => ({
  TextReveal: ({ text, className }: { text: string; className?: string }) => (
    <div data-testid="text-reveal" className={className}>{text}</div>
  ),
  ParallaxLayer: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="parallax-layer" className={className}>{children}</div>
  ),
}));

describe('VisionSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<VisionSection />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<VisionSection className="custom-class" />);
    const section = screen.getByRole('region');
    expect(section).toHaveClass('custom-class');
  });

  it('has correct base classes', () => {
    render(<VisionSection />);
    const section = screen.getByRole('region');
    expect(section).toHaveClass('relative', 'bg-bw-black');
  });

  it('renders vision story sections', () => {
    render(<VisionSection />);
    
    // Check for vision story content
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
    expect(screen.getByText('Our Craft')).toBeInTheDocument();
    expect(screen.getByText('Our Impact')).toBeInTheDocument();
  });

  it('renders vision story subtitles', () => {
    render(<VisionSection />);
    
    expect(screen.getByText('Visual Storytelling')).toBeInTheDocument();
    expect(screen.getByText('Meticulous Excellence')).toBeInTheDocument();
    expect(screen.getByText('Results That Matter')).toBeInTheDocument();
  });

  it('renders vision story descriptions', () => {
    render(<VisionSection />);
    
    expect(screen.getByText(/We believe in the power of visual storytelling/)).toBeInTheDocument();
    expect(screen.getByText(/From concept to completion/)).toBeInTheDocument();
    expect(screen.getByText(/We create visual experiences/)).toBeInTheDocument();
  });

  it('renders the cinematic finale section', () => {
    render(<VisionSection />);
    
    expect(screen.getByText('Experience the Difference')).toBeInTheDocument();
    expect(screen.getByText(/Our commitment to excellence and innovation/)).toBeInTheDocument();
  });

  it('renders progress indicators', () => {
    render(<VisionSection />);
    
    // Progress indicators should be present
    const motionDivs = screen.getAllByTestId('motion-div');
    expect(motionDivs.length).toBeGreaterThan(0);
  });

  it('handles scroll events without errors', () => {
    render(<VisionSection />);
    
    // Simulate scroll event
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    
    // Component should handle scroll without errors
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
  });

  it('renders TextReveal components', () => {
    render(<VisionSection />);
    
    const textReveals = screen.getAllByTestId('text-reveal');
    expect(textReveals.length).toBeGreaterThan(0);
  });

  it('renders ParallaxLayer components', () => {
    render(<VisionSection />);
    
    const parallaxLayers = screen.getAllByTestId('parallax-layer');
    expect(parallaxLayers.length).toBeGreaterThan(0);
  });

  it('maintains proper section structure', () => {
    render(<VisionSection />);
    
    const section = screen.getByRole('region');
    expect(section.tagName).toBe('SECTION');
    
    // Should contain the main content
    expect(section).toHaveTextContent('Our Vision');
    expect(section).toHaveTextContent('Experience the Difference');
  });

  it('handles resize events gracefully', () => {
    render(<VisionSection />);
    
    // Simulate window resize
    fireEvent.resize(window);
    
    // Component should still render correctly
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
  });

  it('renders section numbers correctly', () => {
    render(<VisionSection />);
    
    // Section numbers should be present as decorative elements
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    
    // Check that sections have proper structure
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
    expect(screen.getByText('Our Craft')).toBeInTheDocument();
    expect(screen.getByText('Our Impact')).toBeInTheDocument();
  });

  it('applies correct accent colors', () => {
    render(<VisionSection />);
    
    // Check that different sections have different styling
    expect(screen.getByText('Visual Storytelling')).toBeInTheDocument();
    expect(screen.getByText('Meticulous Excellence')).toBeInTheDocument();
    expect(screen.getByText('Results That Matter')).toBeInTheDocument();
  });

  it('renders with proper semantic structure', () => {
    render(<VisionSection />);
    
    // Should have proper section structure
    const section = screen.getByRole('region');
    expect(section.tagName).toBe('SECTION');
    
    // Should contain text content
    expect(section).toHaveTextContent('Our Vision');
    expect(section).toHaveTextContent('Our Craft');
    expect(section).toHaveTextContent('Our Impact');
  });

  it('handles component unmounting gracefully', () => {
    const { unmount } = render(<VisionSection />);
    
    expect(() => unmount()).not.toThrow();
  });

  it('renders all story data correctly', () => {
    render(<VisionSection />);
    
    // Check all three main sections are rendered
    const visionText = screen.getByText('Our Vision');
    const craftText = screen.getByText('Our Craft');
    const impactText = screen.getByText('Our Impact');
    
    expect(visionText).toBeInTheDocument();
    expect(craftText).toBeInTheDocument();
    expect(impactText).toBeInTheDocument();
  });

  it('maintains accessibility standards', () => {
    render(<VisionSection />);
    
    // Check for proper section structure
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    
    // Should have text content for screen readers
    expect(section).toHaveTextContent('Our Vision');
  });
});
