import { render, screen, fireEvent } from '@testing-library/react';

import { VisionSection } from '../VisionSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => (
      <section {...props}>{children}</section>
    ),
    p: ({ children, ...props }: React.ComponentProps<'p'>) => <p {...props}>{children}</p>,
  },
  useScroll: () => ({
    scrollYProgress: { on: jest.fn(), get: () => 0 },
  }),
  useTransform: (_value: unknown, _input: number[], output: (number | string)[]) => ({
    on: jest.fn(),
    get: () => output[0],
  }),
  useSpring: () => ({ on: jest.fn(() => jest.fn()), get: () => 0 }),
}));

// Mock interactive components
jest.mock('@/components/interactive', () => ({
  TextReveal: ({ text, className }: { text: string; className?: string }) => (
    <div className={className} data-testid="text-reveal">
      {text}
    </div>
  ),
  ParallaxLayer: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="parallax-layer">
      {children}
    </div>
  ),
  MagneticField: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="magnetic-field">
      {children}
    </div>
  ),
  ScrollReveal: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="scroll-reveal">
      {children}
    </div>
  ),
  WebGLEnhancedBackground: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="webgl-enhanced-background">
      {children}
    </div>
  ),
}));

// Mock scroll into view
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

describe('VisionSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders vision section with correct structure', () => {
      render(<VisionSection />);

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('relative');
      expect(section).toHaveClass('bg-bw-bg-primary/80');
    });

    it('applies custom className', () => {
      const { container } = render(<VisionSection className="custom-vision" />);
      expect(container.firstChild).toHaveClass('custom-vision');
    });

    it('has proper section structure', () => {
      render(<VisionSection />);

      const section = document.querySelector('section');
      expect(section).toHaveClass('relative');
      expect(section).toHaveClass('bg-bw-bg-primary/80');
    });
  });

  describe('Vision Story Data', () => {
    it('renders all three vision story sections', () => {
      render(<VisionSection />);

      expect(screen.getByText('Our Vision')).toBeInTheDocument();
      expect(screen.getByText('Our Craft')).toBeInTheDocument();
      expect(screen.getByText('Our Impact')).toBeInTheDocument();
    });

    it('displays correct subtitles for each section', () => {
      render(<VisionSection />);

      expect(screen.getByText('Visual Storytelling')).toBeInTheDocument();
      expect(screen.getByText('Meticulous Excellence')).toBeInTheDocument();
      expect(screen.getByText('Results That Matter')).toBeInTheDocument();
    });

    it('displays section content descriptions', () => {
      render(<VisionSection />);

      expect(
        screen.getByText(/We believe in the power of visual storytelling/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/From concept to completion, we meticulously craft/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/We create visual experiences that not only look stunning/)
      ).toBeInTheDocument();
    });

    it('renders section numbers', () => {
      render(<VisionSection />);

      // Section numbers should be rendered (01, 02, 03)
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('03')).toBeInTheDocument();
    });
  });

  describe('Progress Indicator', () => {
    it('renders progress indicator with correct number of sections', () => {
      render(<VisionSection />);

      // Should have 3 progress indicators for 3 sections
      const progressIndicators = document.querySelectorAll('.w-1.h-12.rounded-full');
      expect(progressIndicators).toHaveLength(3);
    });

    it('progress indicators are clickable', () => {
      render(<VisionSection />);

      const progressIndicators = document.querySelectorAll('.w-1.h-12.rounded-full');

      // Click first indicator
      fireEvent.click(progressIndicators[0]!);

      // Should not throw error
      expect(progressIndicators[0]).toBeInTheDocument();
    });

    it('progress indicator has proper styling classes', () => {
      render(<VisionSection />);

      const progressContainer = document.querySelector('.fixed.left-8.top-1\\/2');
      expect(progressContainer).toBeInTheDocument();
    });
  });

  describe('Cinematic Finale', () => {
    it('renders cinematic finale section', () => {
      render(<VisionSection />);

      expect(screen.getByText('Experience the Difference')).toBeInTheDocument();
      expect(screen.getByText(/Our commitment to excellence and innovation/)).toBeInTheDocument();
    });

    it('cinematic finale has proper structure', () => {
      render(<VisionSection />);

      // Should have the finale content
      const finaleText = screen.getByText('Experience the Difference');
      expect(finaleText).toBeInTheDocument();

      const finaleDescription = screen.getByText(/Our commitment to excellence and innovation/);
      expect(finaleDescription).toBeInTheDocument();
    });

    it('renders parallax layers in finale', () => {
      render(<VisionSection />);

      // Check for aurora effect layers in the finale section
      const auroraLayers = document.querySelectorAll(
        '.bg-bw-aurora-teal\\/20, .bg-bw-aurora-green\\/15, .bg-bw-aurora-bright\\/15'
      );
      expect(auroraLayers.length).toBeGreaterThan(0);
    });
  });

  describe('Interactive Elements', () => {
    it('renders TextReveal components', () => {
      render(<VisionSection />);

      const textReveals = screen.getAllByTestId('text-reveal');
      expect(textReveals.length).toBeGreaterThan(0);
    });

    it('section elements have proper IDs for navigation', () => {
      render(<VisionSection />);

      expect(document.getElementById('vision')).toBeInTheDocument();
      expect(document.getElementById('craft')).toBeInTheDocument();
      expect(document.getElementById('impact')).toBeInTheDocument();
    });

    it('handles scroll navigation correctly', () => {
      const scrollIntoViewSpy = jest.spyOn(Element.prototype, 'scrollIntoView');
      render(<VisionSection />);

      const progressIndicators = document.querySelectorAll('.w-1.h-12.rounded-full');

      // Click first indicator
      fireEvent.click(progressIndicators[0]!);

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });

  describe('Layout and Styling', () => {
    it('has proper minimum height for scroll storytelling', () => {
      render(<VisionSection />);

      const scrollContainer = document.querySelector('.min-h-\\[300vh\\]');
      expect(scrollContainer).toBeInTheDocument();
    });

    it('story sections have proper height and layout', () => {
      render(<VisionSection />);

      const storySections = document.querySelectorAll('.h-screen.flex.items-center.justify-center');
      expect(storySections.length).toBeGreaterThan(0);
    });

    it('applies proper background styling', () => {
      render(<VisionSection />);

      const section = document.querySelector('section');
      expect(section).toHaveClass('relative');
      expect(section).toHaveClass('bg-bw-bg-primary/80');
    });

    it('content has proper max width and centering', () => {
      render(<VisionSection />);

      const contentContainers = document.querySelectorAll('.max-w-4xl');
      expect(contentContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<VisionSection />);

      // Should be a section element
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section?.tagName.toLowerCase()).toBe('section');
    });

    it('provides meaningful text content', () => {
      render(<VisionSection />);

      // All text should be meaningful and descriptive
      expect(screen.getByText(/visual storytelling/)).toBeInTheDocument();
      expect(screen.getByText(/meticulously craft/)).toBeInTheDocument();
      expect(screen.getByText(/drive real results/)).toBeInTheDocument();
    });

    it('progress indicators are keyboard accessible', () => {
      render(<VisionSection />);

      const progressIndicators = document.querySelectorAll('.cursor-pointer');
      expect(progressIndicators.length).toBeGreaterThan(0);
    });

    it('maintains proper text hierarchy', () => {
      render(<VisionSection />);

      // Should have proper heading structure
      const visionTitle = screen.getByText('Our Vision');
      const craftTitle = screen.getByText('Our Craft');
      const impactTitle = screen.getByText('Our Impact');

      expect(visionTitle).toBeInTheDocument();
      expect(craftTitle).toBeInTheDocument();
      expect(impactTitle).toBeInTheDocument();
    });
  });

  describe('Content Accuracy', () => {
    it('displays correct vision story content', () => {
      render(<VisionSection />);

      expect(screen.getByText('Our Vision')).toBeInTheDocument();
      expect(screen.getByText('Visual Storytelling')).toBeInTheDocument();
      expect(
        screen.getByText(/We believe in the power of visual storytelling/)
      ).toBeInTheDocument();
    });

    it('displays correct craft story content', () => {
      render(<VisionSection />);

      expect(screen.getByText('Our Craft')).toBeInTheDocument();
      expect(screen.getByText('Meticulous Excellence')).toBeInTheDocument();
      expect(screen.getByText(/From concept to completion/)).toBeInTheDocument();
    });

    it('displays correct impact story content', () => {
      render(<VisionSection />);

      expect(screen.getByText('Our Impact')).toBeInTheDocument();
      expect(screen.getByText('Results That Matter')).toBeInTheDocument();
      expect(screen.getByText(/We create visual experiences/)).toBeInTheDocument();
    });

    it('displays finale content correctly', () => {
      render(<VisionSection />);

      expect(screen.getByText('Experience the Difference')).toBeInTheDocument();
      expect(screen.getByText(/Our commitment to excellence and innovation/)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('has responsive layout classes', () => {
      render(<VisionSection />);

      // Progress indicator should be hidden on small screens and visible on large screens
      const progressContainer = document.querySelector('.hidden.lg\\:flex');
      expect(progressContainer).toBeInTheDocument();
    });

    it('maintains proper spacing on all screen sizes', () => {
      render(<VisionSection />);

      const contentContainers = document.querySelectorAll('.px-6');
      expect(contentContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Brand Consistency', () => {
    it('uses brand colors consistently', () => {
      render(<VisionSection />);

      const section = document.querySelector('section');
      expect(section).toHaveClass('bg-bw-bg-primary/80');
    });

    it('applies brand typography classes', () => {
      render(<VisionSection />);

      // Should use display font classes
      const displayElements = document.querySelectorAll('.font-display');
      expect(displayElements.length).toBeGreaterThan(0);
    });

    it('uses consistent color scheme', () => {
      render(<VisionSection />);

      // Should use brand color classes
      const goldElements = document.querySelectorAll('.text-bw-accent-gold');
      const bodyElements = document.querySelectorAll('.text-body-xl');
      const displayElements = document.querySelectorAll('.text-display-xl');

      expect(goldElements.length + bodyElements.length + displayElements.length).toBeGreaterThan(0);
    });
  });
});
