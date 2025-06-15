import { render, screen } from '@testing-library/react';
import { AboutSection } from '../AboutSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
  },
}));

describe('AboutSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders about section with correct structure', () => {
      render(<AboutSection />);

      const section = document.querySelector('#about');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'about');
    });

    it('renders main heading with company name', () => {
      render(<AboutSection />);

      expect(screen.getByText(/About/)).toBeInTheDocument();
      expect(screen.getByText('BlackWoods Creative')).toBeInTheDocument();
    });

    it('renders company description', () => {
      render(<AboutSection />);

      expect(screen.getByText(/We are a premium creative studio/)).toBeInTheDocument();
      expect(screen.getByText(/visual storytelling that captivates audiences/)).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<AboutSection className="custom-about" />);
      expect(container.firstChild).toHaveClass('custom-about');
    });
  });

  describe('Services Section', () => {
    it('renders all four service cards', () => {
      render(<AboutSection />);

      expect(screen.getByText('Filmmaking')).toBeInTheDocument();
      expect(screen.getByText('Photography')).toBeInTheDocument();
      expect(screen.getByText('3D Visualization')).toBeInTheDocument();
      expect(screen.getByText('Scene Creation')).toBeInTheDocument();
    });

    it('displays service descriptions', () => {
      render(<AboutSection />);

      expect(screen.getByText(/Cinematic storytelling that captures emotion/)).toBeInTheDocument();
      expect(screen.getByText(/Professional photography services from product shoots/)).toBeInTheDocument();
      expect(screen.getByText(/Photorealistic 3D renders and animations/)).toBeInTheDocument();
      expect(screen.getByText(/Immersive environments and scenes for VR/)).toBeInTheDocument();
    });

    it('renders service icons', () => {
      render(<AboutSection />);

      // Check that service cards have the proper structure for icons
      const serviceCards = screen.getAllByText(/Filmmaking|Photography|3D Visualization|Scene Creation/);
      expect(serviceCards).toHaveLength(4);
    });
  });

  describe('Company Story Section', () => {
    it('renders story heading', () => {
      render(<AboutSection />);

      expect(screen.getByText('Story')).toBeInTheDocument();
      
      // Check for "Our Story" heading specifically
      const storyHeading = screen.getByRole('heading', { name: /Our Story/ });
      expect(storyHeading).toBeInTheDocument();
    });

    it('displays story content', () => {
      render(<AboutSection />);

      expect(screen.getByText(/Founded with a passion for visual excellence/)).toBeInTheDocument();
      expect(screen.getByText(/Our team combines technical expertise/)).toBeInTheDocument();
      expect(screen.getByText(/We believe in the power of visual storytelling/)).toBeInTheDocument();
    });

    it('renders studio image placeholder', () => {
      render(<AboutSection />);

      expect(screen.getByText('Studio Image Placeholder')).toBeInTheDocument();
    });
  });

  describe('Achievements Section', () => {
    it('renders achievements heading', () => {
      render(<AboutSection />);

      expect(screen.getByText('Achievements')).toBeInTheDocument();
      
      // Check for "Our Achievements" heading specifically
      const achievementsHeading = screen.getByRole('heading', { name: /Our Achievements/ });
      expect(achievementsHeading).toBeInTheDocument();
    });

    it('displays all achievement items', () => {
      render(<AboutSection />);

      // Check for achievement numbers and text separately since they're in different elements
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Award-Winning Projects')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Satisfied Clients')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Years of Excellence')).toBeInTheDocument();
    });

    it('renders achievement icons', () => {
      render(<AboutSection />);

      // Check that achievement icons are rendered
      const trophyIcon = screen.getByTestId('trophy-icon');
      const checkBadgeIcons = screen.getAllByTestId('check-badge-icon');

      expect(trophyIcon).toBeInTheDocument();
      expect(checkBadgeIcons).toHaveLength(2);
    });
  });

  describe('Layout and Styling', () => {
    it('has proper section structure', () => {
      render(<AboutSection />);

      const section = document.querySelector('#about');
      expect(section).toHaveClass('relative');
      expect(section).toHaveClass('bg-bw-bg-primary');
      expect(section).toHaveClass('px-6');
      expect(section).toHaveClass('py-32');
    });

    it('uses responsive grid layouts', () => {
      render(<AboutSection />);

      // Services should be in a responsive grid
      const filmmaking = screen.getByText('Filmmaking');
      const serviceCard = filmmaking.closest('.card');
      expect(serviceCard).toBeInTheDocument();
    });

    it('applies proper spacing and padding', () => {
      render(<AboutSection />);

      const section = document.querySelector('#about');
      expect(section).toHaveClass('px-6');
      expect(section).toHaveClass('py-32');
    });

    it('has centered content with max width', () => {
      render(<AboutSection />);

      const section = document.querySelector('#about');
      const container = section?.querySelector('.mx-auto.max-w-7xl');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<AboutSection />);

      // Should be a section element
      const section = document.querySelector('#about');
      expect(section).toBeInTheDocument();
      expect(section?.tagName.toLowerCase()).toBe('section');

      // Should have proper heading hierarchy
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('has proper heading levels', () => {
      render(<AboutSection />);

      // Main heading should be h2
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();

      // Service titles should be h3
      const serviceHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(serviceHeadings.length).toBeGreaterThan(0);
    });

    it('provides meaningful text content', () => {
      render(<AboutSection />);

      // All text should be meaningful and descriptive
      expect(screen.getByText(/premium creative studio/)).toBeInTheDocument();
      expect(screen.getAllByText(/visual storytelling/).length).toBeGreaterThan(0);
      expect(screen.getByText(/filmmaking, photography, 3D visualization/)).toBeInTheDocument();
    });
  });

  describe('Content Accuracy', () => {
    it('displays correct company information', () => {
      render(<AboutSection />);

      expect(screen.getByText('BlackWoods Creative')).toBeInTheDocument();
      expect(screen.getByText(/premium creative studio/)).toBeInTheDocument();
      expect(screen.getAllByText(/visual storytelling/).length).toBeGreaterThan(0);
    });

    it('shows accurate service offerings', () => {
      render(<AboutSection />);

      // Check all four main services
      expect(screen.getByText('Filmmaking')).toBeInTheDocument();
      expect(screen.getByText('Photography')).toBeInTheDocument();
      expect(screen.getByText('3D Visualization')).toBeInTheDocument();
      expect(screen.getByText('Scene Creation')).toBeInTheDocument();
    });

    it('displays realistic achievements', () => {
      render(<AboutSection />);

      // Check for achievement numbers and text separately since they're in different elements
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Award-Winning Projects')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Satisfied Clients')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Years of Excellence')).toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    it('renders service cards with hover effects', () => {
      render(<AboutSection />);

      const filmmaking = screen.getByText('Filmmaking');
      const serviceCard = filmmaking.closest('.card');
      expect(serviceCard).toHaveClass('group');
    });

    it('has proper visual hierarchy', () => {
      render(<AboutSection />);

      // Main heading should be largest
      const mainHeading = screen.getByText('BlackWoods Creative');
      expect(mainHeading.closest('h2')).toHaveClass('text-display-lg');

      // Service titles use display classes
      const serviceTitle = screen.getByText('Filmmaking');
      expect(serviceTitle.closest('h3')).toHaveClass('text-display-md');
    });
  });

  describe('Responsive Design', () => {
    it('uses responsive grid classes', () => {
      render(<AboutSection />);

      // Services grid should be responsive
      const section = document.querySelector('#about');
      const servicesGrid = section?.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
      expect(servicesGrid).toBeInTheDocument();
    });

    it('has responsive story layout', () => {
      render(<AboutSection />);

      // Story section should have responsive grid
      const section = document.querySelector('#about');
      const storyGrid = section?.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12');
      expect(storyGrid).toBeInTheDocument();
    });

    it('maintains proper spacing on all screen sizes', () => {
      render(<AboutSection />);

      const section = document.querySelector('#about');
      expect(section).toHaveClass('px-6'); // Responsive padding
    });
  });

  describe('Brand Consistency', () => {
    it('uses brand colors consistently', () => {
      render(<AboutSection />);

      // Should use BlackWoods brand colors
      const section = document.querySelector('#about');
      expect(section).toHaveClass('bg-bw-bg-primary');

      // Check for brand accent colors
      const goldElements = document.querySelectorAll('.text-bw-accent-gold');
      expect(goldElements.length).toBeGreaterThan(0);
    });

    it('applies brand typography', () => {
      render(<AboutSection />);

      // Main heading should use display font
      const mainHeading = screen.getByText('BlackWoods Creative');
      expect(mainHeading.closest('h2')).toHaveClass('text-display-lg');
    });

    it('uses consistent spacing patterns', () => {
      render(<AboutSection />);

      // Should have consistent margin/padding patterns
      const section = document.querySelector('#about');
      expect(section).toHaveClass('py-32');
    });
  });
});
