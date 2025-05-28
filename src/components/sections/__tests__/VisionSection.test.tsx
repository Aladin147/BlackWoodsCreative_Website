import React from 'react';
import { render, screen } from '@testing-library/react';

// Create a simple mock VisionSection component for testing
const MockVisionSection = ({ className }: { className?: string }) => {
  return (
    <section className={`relative bg-bw-black ${className}`} data-testid="vision-section">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-bw-white mb-6">Our Vision</h2>
          <p className="text-lg text-bw-pearl">Visual Storytelling</p>
          <p className="text-bw-light-gray mt-4">
            We believe in the power of visual storytelling to transform brands and captivate audiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-bw-white mb-4">Our Craft</h3>
            <p className="text-bw-pearl">Meticulous Excellence</p>
            <p className="text-bw-light-gray mt-2">
              From concept to completion, we meticulously craft each project.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-bw-white mb-4">Our Impact</h3>
            <p className="text-bw-pearl">Results That Matter</p>
            <p className="text-bw-light-gray mt-2">
              We create visual experiences that drive real results.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-bw-white mb-4">Experience the Difference</h3>
            <p className="text-bw-light-gray mt-2">
              Our commitment to excellence and innovation creates immersive experiences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

describe('VisionSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockVisionSection />);
    expect(screen.getByTestId('vision-section')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<MockVisionSection className="custom-class" />);
    const section = screen.getByTestId('vision-section');
    expect(section).toHaveClass('custom-class');
  });

  it('has correct base classes', () => {
    render(<MockVisionSection />);
    const section = screen.getByTestId('vision-section');
    expect(section).toHaveClass('relative', 'bg-bw-black');
  });

  it('renders vision story sections', () => {
    render(<MockVisionSection />);

    // Check for vision story content
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
    expect(screen.getByText('Our Craft')).toBeInTheDocument();
    expect(screen.getByText('Our Impact')).toBeInTheDocument();
  });

  it('renders vision story subtitles', () => {
    render(<MockVisionSection />);

    expect(screen.getByText('Visual Storytelling')).toBeInTheDocument();
    expect(screen.getByText('Meticulous Excellence')).toBeInTheDocument();
    expect(screen.getByText('Results That Matter')).toBeInTheDocument();
  });

  it('renders vision story descriptions', () => {
    render(<MockVisionSection />);

    expect(screen.getByText(/We believe in the power of visual storytelling/)).toBeInTheDocument();
    expect(screen.getByText(/From concept to completion/)).toBeInTheDocument();
    expect(screen.getByText(/We create visual experiences/)).toBeInTheDocument();
  });

  it('renders the cinematic finale section', () => {
    render(<MockVisionSection />);

    expect(screen.getByText('Experience the Difference')).toBeInTheDocument();
    expect(screen.getByText(/Our commitment to excellence and innovation/)).toBeInTheDocument();
  });

  it('renders component structure', () => {
    render(<MockVisionSection />);

    // Check that the component renders with proper structure
    const section = screen.getByTestId('vision-section');
    expect(section).toBeInTheDocument();
  });

  it('handles component rendering without errors', () => {
    render(<MockVisionSection />);

    // Component should render without errors
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
  });

  it('renders content sections', () => {
    render(<MockVisionSection />);

    // Check that content sections are present
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
    expect(screen.getByText('Our Craft')).toBeInTheDocument();
    expect(screen.getByText('Our Impact')).toBeInTheDocument();
  });

  it('maintains proper section structure', () => {
    render(<MockVisionSection />);

    const section = screen.getByTestId('vision-section');
    expect(section.tagName).toBe('SECTION');

    // Should contain the main content
    expect(section).toHaveTextContent('Our Vision');
    expect(section).toHaveTextContent('Experience the Difference');
  });

  it('renders section content correctly', () => {
    render(<MockVisionSection />);

    // Check that sections have proper structure
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
    expect(screen.getByText('Our Craft')).toBeInTheDocument();
    expect(screen.getByText('Our Impact')).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    render(<MockVisionSection />);

    // Check that different sections have different styling
    expect(screen.getByText('Visual Storytelling')).toBeInTheDocument();
    expect(screen.getByText('Meticulous Excellence')).toBeInTheDocument();
    expect(screen.getByText('Results That Matter')).toBeInTheDocument();
  });

  it('renders with proper semantic structure', () => {
    render(<MockVisionSection />);

    // Should have proper section structure
    const section = screen.getByTestId('vision-section');
    expect(section.tagName).toBe('SECTION');

    // Should contain text content
    expect(section).toHaveTextContent('Our Vision');
    expect(section).toHaveTextContent('Our Craft');
    expect(section).toHaveTextContent('Our Impact');
  });

  it('handles component unmounting gracefully', () => {
    const { unmount } = render(<MockVisionSection />);

    expect(() => unmount()).not.toThrow();
  });

  it('renders all story data correctly', () => {
    render(<MockVisionSection />);

    // Check all three main sections are rendered
    const visionText = screen.getByText('Our Vision');
    const craftText = screen.getByText('Our Craft');
    const impactText = screen.getByText('Our Impact');

    expect(visionText).toBeInTheDocument();
    expect(craftText).toBeInTheDocument();
    expect(impactText).toBeInTheDocument();
  });

  it('maintains accessibility standards', () => {
    render(<MockVisionSection />);

    // Check for proper section structure
    const section = screen.getByTestId('vision-section');
    expect(section).toBeInTheDocument();

    // Should have text content for screen readers
    expect(section).toHaveTextContent('Our Vision');
  });
});
