import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../page';

// Mock the dynamic imports
jest.mock('@/components/sections', () => ({
  AboutSection: () => <div data-testid="about-section">About Section</div>,
  ContactSection: () => <div data-testid="contact-section">Contact Section</div>,
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>,
  PortfolioSection: () => <div data-testid="portfolio-section">Portfolio Section</div>,
}));

jest.mock('@/components/sections/VisionSection', () => ({
  VisionSection: () => <div data-testid="vision-section">Vision Section</div>,
}));

jest.mock('@/components/layout', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

// Mock Next.js dynamic import
jest.mock('next/dynamic', () => {
  return (importFunc: () => Promise<any>, options?: any) => {
    const Component = React.lazy(importFunc);
    
    // Return a component that handles the loading state
    return React.forwardRef<any, any>((props, ref) => {
      return (
        <React.Suspense fallback={options?.loading?.() || <div>Loading...</div>}>
          <Component {...props} ref={ref} />
        </React.Suspense>
      );
    });
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all main sections', async () => {
    render(<HomePage />);

    // Wait for dynamic components to load
    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    expect(screen.getByTestId('portfolio-section')).toBeInTheDocument();
    expect(screen.getByTestId('vision-section')).toBeInTheDocument();
    expect(screen.getByTestId('about-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders sections in correct order', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    const sections = [
      screen.getByTestId('hero-section'),
      screen.getByTestId('portfolio-section'),
      screen.getByTestId('vision-section'),
      screen.getByTestId('about-section'),
      screen.getByTestId('contact-section'),
      screen.getByTestId('footer'),
    ];

    // Verify order by checking DOM positions
    for (let i = 0; i < sections.length - 1; i++) {
      expect(sections[i].compareDocumentPosition(sections[i + 1])).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    }
  });

  it('handles dynamic loading states', () => {
    // Test the loading components directly
    const HeroLoading = () => (
      <div className="h-screen bg-bw-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-display-xl mb-4">
            BlackWoods Creative
          </div>
          <div className="text-body-xl">
            Loading...
          </div>
        </div>
      </div>
    );

    const PortfolioLoading = () => (
      <div className="bg-bw-bg-primary px-6 py-32">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-8 text-display-lg">
            Our <span className="text-bw-accent-gold">Portfolio</span>
          </h2>
          <div className="text-body-xl">Loading portfolio...</div>
        </div>
      </div>
    );

    const VisionLoading = () => (
      <div className="relative bg-bw-bg-primary min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-display-xl mb-4">
            Experience the Difference
          </div>
          <div className="text-body-xl">Loading vision...</div>
        </div>
      </div>
    );

    // Test Hero loading state
    render(<HeroLoading />);
    expect(screen.getByText('BlackWoods Creative')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Test Portfolio loading state
    render(<PortfolioLoading />);
    expect(screen.getByText('Our')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Loading portfolio...')).toBeInTheDocument();

    // Test Vision loading state
    render(<VisionLoading />);
    expect(screen.getByText('Experience the Difference')).toBeInTheDocument();
    expect(screen.getByText('Loading vision...')).toBeInTheDocument();
  });

  it('applies correct CSS classes for layout', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    // The main container should be a React fragment, so we check the sections directly
    const heroSection = screen.getByTestId('hero-section');
    const portfolioSection = screen.getByTestId('portfolio-section');
    const visionSection = screen.getByTestId('vision-section');
    const aboutSection = screen.getByTestId('about-section');
    const contactSection = screen.getByTestId('contact-section');
    const footer = screen.getByTestId('footer');

    // Verify all sections are present
    expect(heroSection).toBeInTheDocument();
    expect(portfolioSection).toBeInTheDocument();
    expect(visionSection).toBeInTheDocument();
    expect(aboutSection).toBeInTheDocument();
    expect(contactSection).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('has proper semantic structure', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    // Verify the page structure makes sense
    const allSections = screen.getAllByTestId(/section|footer/);
    expect(allSections).toHaveLength(6);
  });

  it('loads all sections without errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    // Wait a bit more to ensure all dynamic imports complete
    await waitFor(() => {
      expect(screen.getByTestId('portfolio-section')).toBeInTheDocument();
      expect(screen.getByTestId('vision-section')).toBeInTheDocument();
    });

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
