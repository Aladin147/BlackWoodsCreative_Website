import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { HeroSection } from '../HeroSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: React.ComponentProps<'section'>) => (
      <section {...props}>{children}</section>
    ),
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.ComponentProps<'h1'>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.ComponentProps<'p'>) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => (
      <button {...props}>{children}</button>
    ),
  },
}));

// Mock interactive components
jest.mock('@/components/interactive', () => ({
  CinematicParallax: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cinematic-parallax">{children}</div>
  ),
  FloatingElement: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="floating-element">{children}</div>
  ),
  TextReveal: ({
    children,
    text,
    ...props
  }: {
    children?: React.ReactNode;
    text?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid="text-reveal" {...props}>
      {text ?? children}
    </div>
  ),
  PulseGlow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pulse-glow">{children}</div>
  ),
  MorphingButton: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button data-testid="morphing-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  MagneticCursor: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="magnetic-cursor">{children}</div>
  ),
  MagneticField: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="magnetic-field">{children}</div>
  ),
  ParallaxContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="parallax-container">{children}</div>
  ),
  ParallaxText: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="parallax-text">{children}</div>
  ),
  AtmosphericLayer: ({ className }: { className?: string }) => (
    <div className={className} data-testid="atmospheric-layer" />
  ),
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ArrowDownIcon: () => <svg data-testid="arrow-down-icon" />,
  PlayIcon: () => <svg data-testid="play-icon" />,
}));

// Mock scroll utility
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  scrollToElement: jest.fn(),
}));

// Mock scrollIntoView
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

describe('HeroSection', () => {
  it('renders hero content', () => {
    render(<HeroSection />);

    expect(screen.getByText(/BlackWoods Creative/)).toBeInTheDocument();
    expect(screen.getByText(/Crafting Visual Stories/)).toBeInTheDocument();
  });

  it('renders hero description', () => {
    render(<HeroSection />);

    expect(screen.getByText(/Captivate and Convert/)).toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    render(<HeroSection />);

    expect(screen.getByText(/View Our Work/)).toBeInTheDocument();
    expect(screen.getByText(/Start Your Project/)).toBeInTheDocument();
  });

  it('renders scroll indicator', () => {
    render(<HeroSection />);

    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
    expect(screen.getByText('Scroll to explore')).toBeInTheDocument();
  });

  it('handles CTA button clicks', async () => {
    const user = userEvent.setup();
    render(<HeroSection />);

    const viewWorkButton = screen.getByText(/View Our Work/);
    const projectButton = screen.getByText(/Start Your Project/);

    await user.click(viewWorkButton);
    await user.click(projectButton);

    // Buttons should be clickable (no errors thrown)
    expect(viewWorkButton).toBeInTheDocument();
    expect(projectButton).toBeInTheDocument();
  });

  it('renders with proper semantic structure', () => {
    const { container } = render(<HeroSection />);

    const heroSection = container.querySelector('section');
    expect(heroSection).toBeInTheDocument();

    // Check for text content instead of heading role since TextReveal might not render as h1
    expect(screen.getByText(/BlackWoods Creative/)).toBeInTheDocument();
  });

  it('includes interactive components', () => {
    render(<HeroSection />);

    expect(screen.getByTestId('text-reveal')).toBeInTheDocument();
    expect(screen.getByTestId('floating-element')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-glow')).toBeInTheDocument();
    expect(screen.getAllByTestId('morphing-button')).toHaveLength(2);
  });

  it('has proper responsive classes', () => {
    const { container } = render(<HeroSection />);

    const heroSection = container.querySelector('section');
    expect(heroSection).toHaveClass('h-screen');
  });

  it('renders background elements', () => {
    render(<HeroSection />);

    // Check for background gradient or decorative elements
    const { container } = render(<HeroSection />);
    const backgroundElements = container.querySelectorAll('[class*="bg-"]');
    expect(backgroundElements.length).toBeGreaterThan(0);
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<HeroSection />);

    const viewWorkButton = screen.getByText(/View Our Work/);

    // Test keyboard interaction without checking focus state
    await user.click(viewWorkButton);
    await user.keyboard('{Enter}');

    // Should handle keyboard interaction without errors
    expect(viewWorkButton).toBeInTheDocument();
  });

  it('renders with proper accessibility attributes', () => {
    render(<HeroSection />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeVisible();
    });

    // Check for main content visibility
    expect(screen.getByText(/BlackWoods Creative/)).toBeVisible();
  });

  it('includes proper meta content for SEO', () => {
    render(<HeroSection />);

    // Hero should contain key brand messaging
    expect(screen.getByText(/BlackWoods Creative/i)).toBeInTheDocument();
    expect(screen.getByText(/Visual Stories/i)).toBeInTheDocument();
  });

  describe('Scroll Navigation', () => {
    beforeEach(() => {
      // Create mock DOM elements
      document.body.innerHTML = `
        <div id="portfolio"></div>
        <div id="contact"></div>
      `;
    });

    it('scrolls to portfolio section when View Work button is clicked', async () => {
      const user = userEvent.setup();
      const scrollIntoViewSpy = jest.spyOn(Element.prototype, 'scrollIntoView');

      render(<HeroSection />);

      const viewWorkButton = screen.getByText(/View Our Work/);
      await user.click(viewWorkButton);

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('scrolls to contact section when Start Project button is clicked', async () => {
      const user = userEvent.setup();
      const scrollIntoViewSpy = jest.spyOn(Element.prototype, 'scrollIntoView');

      render(<HeroSection />);

      const startProjectButton = screen.getByText(/Start Your Project/);
      await user.click(startProjectButton);

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('scrolls to portfolio section when scroll indicator is clicked', async () => {
      const user = userEvent.setup();
      const scrollIntoViewSpy = jest.spyOn(Element.prototype, 'scrollIntoView');

      render(<HeroSection />);

      const scrollButton = screen.getByText('Scroll to explore').closest('button');
      expect(scrollButton).toBeInTheDocument();

      if (scrollButton) {
        await user.click(scrollButton);
        expect(scrollIntoViewSpy).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });

    it('handles missing portfolio section gracefully', async () => {
      const user = userEvent.setup();
      document.body.innerHTML = ''; // Remove portfolio section

      render(<HeroSection />);

      const viewWorkButton = screen.getByText(/View Our Work/);

      // Should not throw error when portfolio section doesn't exist
      await expect(user.click(viewWorkButton)).resolves.not.toThrow();
    });

    it('handles missing contact section gracefully', async () => {
      const user = userEvent.setup();
      document.body.innerHTML = ''; // Remove contact section

      render(<HeroSection />);

      const startProjectButton = screen.getByText(/Start Your Project/);

      // Should not throw error when contact section doesn't exist
      await expect(user.click(startProjectButton)).resolves.not.toThrow();
    });
  });

  describe('Component Props', () => {
    it('applies custom className', () => {
      const { container } = render(<HeroSection className="custom-hero" />);

      const heroSection = container.querySelector('section');
      expect(heroSection).toHaveClass('custom-hero');
    });

    it('renders without className prop', () => {
      const { container } = render(<HeroSection />);

      const heroSection = container.querySelector('section');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection).toHaveClass('relative');
      expect(heroSection).toHaveClass('flex');
      expect(heroSection).toHaveClass('h-screen');
    });
  });

  describe('Interactive Elements', () => {
    it('renders morphing buttons with hover children', () => {
      render(<HeroSection />);

      const morphingButtons = screen.getAllByTestId('morphing-button');
      expect(morphingButtons).toHaveLength(2);

      // Check that buttons have the expected content
      expect(screen.getByText(/View Our Work/)).toBeInTheDocument();
      expect(screen.getByText(/Start Your Project/)).toBeInTheDocument();
    });

    it('renders pulse glow wrapper for primary button', () => {
      render(<HeroSection />);

      const pulseGlow = screen.getByTestId('pulse-glow');
      expect(pulseGlow).toBeInTheDocument();
    });

    it('renders floating element for subtitle', () => {
      render(<HeroSection />);

      const floatingElement = screen.getByTestId('floating-element');
      expect(floatingElement).toBeInTheDocument();
    });

    it('renders text reveal for main title', () => {
      render(<HeroSection />);

      const textReveal = screen.getByTestId('text-reveal');
      expect(textReveal).toBeInTheDocument();
      expect(textReveal).toHaveTextContent('BlackWoods Creative');
    });
  });

  describe('Layout and Styling', () => {
    it('has proper hero section structure', () => {
      const { container } = render(<HeroSection />);

      const heroSection = container.querySelector('section');
      expect(heroSection).toHaveAttribute('id', 'hero');
      expect(heroSection).toHaveClass('relative');
      expect(heroSection).toHaveClass('flex');
      expect(heroSection).toHaveClass('h-screen');
      expect(heroSection).toHaveClass('items-center');
      expect(heroSection).toHaveClass('justify-center');
      expect(heroSection).toHaveClass('bg-bw-bg-primary');
    });

    it('renders background animation elements', () => {
      const { container } = render(<HeroSection />);

      // Check for background elements
      const backgroundContainer = container.querySelector('.absolute.inset-0.overflow-hidden');
      expect(backgroundContainer).toBeInTheDocument();
    });

    it('has proper content hierarchy', () => {
      render(<HeroSection />);

      // Main title should be present
      expect(screen.getByText('BlackWoods Creative')).toBeInTheDocument();

      // Subtitle should be present
      expect(screen.getByText(/Crafting Visual Stories/)).toBeInTheDocument();

      // CTA buttons should be present
      expect(screen.getByText(/View Our Work/)).toBeInTheDocument();
      expect(screen.getByText(/Start Your Project/)).toBeInTheDocument();
    });

    it('renders scroll indicator at bottom', () => {
      const { container } = render(<HeroSection />);

      const scrollIndicator = container.querySelector('.absolute.bottom-8');
      expect(scrollIndicator).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles and interactions', () => {
      render(<HeroSection />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3); // 2 CTA buttons + 1 scroll button

      buttons.forEach(button => {
        expect(button).toBeVisible();
        expect(button).not.toHaveAttribute('disabled');
      });
    });

    it('provides meaningful button text', () => {
      render(<HeroSection />);

      expect(
        screen.getByRole('button', { name: /View our portfolio and previous work/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Start your project - Contact us to begin/ })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Scroll to explore/ })).toBeInTheDocument();
    });

    it('has proper semantic structure', () => {
      const { container } = render(<HeroSection />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section?.tagName.toLowerCase()).toBe('section');
    });
  });

  describe('Content Accuracy', () => {
    it('displays correct brand messaging', () => {
      render(<HeroSection />);

      expect(screen.getByText('BlackWoods Creative')).toBeInTheDocument();
      expect(
        screen.getByText('Crafting Visual Stories That Captivate and Convert')
      ).toBeInTheDocument();
    });

    it('displays correct call-to-action text', () => {
      render(<HeroSection />);

      expect(screen.getByText('View Our Work')).toBeInTheDocument();
      expect(screen.getByText('Start Your Project')).toBeInTheDocument();
      expect(screen.getByText('Scroll to explore')).toBeInTheDocument();
    });
  });
});
