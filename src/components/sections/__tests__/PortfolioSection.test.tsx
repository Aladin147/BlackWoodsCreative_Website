import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PortfolioSection } from '../PortfolioSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock interactive components
jest.mock('@/components/interactive', () => ({
  HoverMagnify: ({ children }: { children: React.ReactNode }) => <div data-testid="hover-magnify">{children}</div>,
  MagneticField: ({ children }: { children: React.ReactNode }) => <div data-testid="magnetic-field">{children}</div>,
}));

// Mock portfolio data
jest.mock('@/lib/data/portfolio', () => ({
  portfolioData: [
    {
      id: 'test-film-1',
      title: 'Test Film Project',
      description: 'A test film project description',
      category: 'Film',
      type: 'video',
      image: 'https://example.com/film.jpg',
      tags: ['Film', 'Test'],
      client: 'Test Client',
      year: 2024,
      featured: true,
    },
    {
      id: 'test-photo-1',
      title: 'Test Photography Project',
      description: 'A test photography project description',
      category: 'Photography',
      type: 'image',
      image: 'https://example.com/photo.jpg',
      tags: ['Photography', 'Test'],
      client: 'Photo Client',
      year: 2024,
    },
    {
      id: 'test-3d-1',
      title: 'Test 3D Visualization',
      description: 'A test 3D visualization project',
      category: '3D Visualization',
      type: 'image',
      image: 'https://example.com/3d.jpg',
      tags: ['3D', 'Visualization'],
      client: '3D Client',
      year: 2024,
    },
    {
      id: 'test-scene-1',
      title: 'Test Scene Creation',
      description: 'A test scene creation project',
      category: 'Scene Creation',
      type: 'image',
      image: 'https://example.com/scene.jpg',
      tags: ['Scene', 'Creation'],
      client: 'Scene Client',
      year: 2024,
    },
  ],
}));

// Mock PortfolioCard component
jest.mock('@/components/ui/PortfolioCard', () => ({
  PortfolioCard: ({ project }: { project: any }) => (
    <div data-testid="portfolio-card" data-project-id={project.id}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <span data-testid="project-category">{project.category}</span>
    </div>
  ),
}));

describe('PortfolioSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders portfolio section with correct structure', () => {
      render(<PortfolioSection />);

      const section = document.querySelector('#portfolio');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'portfolio');
    });

    it('renders main heading with portfolio title', () => {
      render(<PortfolioSection />);

      expect(screen.getByText(/Our/)).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });

    it('renders portfolio description', () => {
      render(<PortfolioSection />);

      expect(screen.getByText(/Explore our diverse range of creative projects/)).toBeInTheDocument();
      expect(screen.getByText(/visual storytelling and premium craftsmanship/)).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<PortfolioSection className="custom-portfolio" />);
      expect(container.firstChild).toHaveClass('custom-portfolio');
    });
  });

  describe('Category Filtering', () => {
    it('renders all category filter buttons', () => {
      render(<PortfolioSection />);

      expect(screen.getByRole('button', { name: /Filter portfolio by All/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Filter portfolio by Film/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Filter portfolio by Photography/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Filter portfolio by 3D Visualization/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Filter portfolio by Scene Creation/ })).toBeInTheDocument();
    });

    it('has "All" category selected by default', () => {
      render(<PortfolioSection />);

      const allButton = screen.getByRole('button', { name: /Filter portfolio by All/ });
      expect(allButton).toHaveAttribute('aria-pressed', 'true');
      expect(allButton).toHaveClass('bg-bw-gold', 'text-bw-black');
    });

    it('changes active category when filter button is clicked', async () => {
      render(<PortfolioSection />);

      const filmButton = screen.getByRole('button', { name: /Filter portfolio by Film/ });
      const allButton = screen.getByRole('button', { name: /Filter portfolio by All/ });

      // Initially All is active
      expect(allButton).toHaveAttribute('aria-pressed', 'true');
      expect(filmButton).toHaveAttribute('aria-pressed', 'false');

      // Click Film button
      fireEvent.click(filmButton);

      await waitFor(() => {
        expect(filmButton).toHaveAttribute('aria-pressed', 'true');
        expect(allButton).toHaveAttribute('aria-pressed', 'false');
      });
    });

    it('filters projects based on selected category', async () => {
      render(<PortfolioSection />);

      // Initially shows all projects
      expect(screen.getByText('Test Film Project')).toBeInTheDocument();
      expect(screen.getByText('Test Photography Project')).toBeInTheDocument();
      expect(screen.getByText('Test 3D Visualization')).toBeInTheDocument();
      expect(screen.getByText('Test Scene Creation')).toBeInTheDocument();

      // Filter by Film
      const filmButton = screen.getByRole('button', { name: /Filter portfolio by Film/ });
      fireEvent.click(filmButton);

      await waitFor(() => {
        expect(screen.getByText('Test Film Project')).toBeInTheDocument();
        expect(screen.queryByText('Test Photography Project')).not.toBeInTheDocument();
        expect(screen.queryByText('Test 3D Visualization')).not.toBeInTheDocument();
        expect(screen.queryByText('Test Scene Creation')).not.toBeInTheDocument();
      });
    });

    it('shows all projects when "All" category is selected', async () => {
      render(<PortfolioSection />);

      // Filter by Film first
      const filmButton = screen.getByRole('button', { name: /Filter portfolio by Film/ });
      fireEvent.click(filmButton);

      await waitFor(() => {
        expect(screen.queryByText('Test Photography Project')).not.toBeInTheDocument();
      });

      // Then filter by All
      const allButton = screen.getByRole('button', { name: /Filter portfolio by All/ });
      fireEvent.click(allButton);

      await waitFor(() => {
        expect(screen.getByText('Test Film Project')).toBeInTheDocument();
        expect(screen.getByText('Test Photography Project')).toBeInTheDocument();
        expect(screen.getByText('Test 3D Visualization')).toBeInTheDocument();
        expect(screen.getByText('Test Scene Creation')).toBeInTheDocument();
      });
    });
  });

  describe('Portfolio Grid', () => {
    it('renders portfolio cards for all projects', () => {
      render(<PortfolioSection />);

      const portfolioCards = screen.getAllByTestId('portfolio-card');
      expect(portfolioCards).toHaveLength(4);
    });

    it('renders portfolio cards with interactive wrappers', () => {
      render(<PortfolioSection />);

      const magneticFields = screen.getAllByTestId('magnetic-field');
      const hoverMagnifies = screen.getAllByTestId('hover-magnify');

      expect(magneticFields).toHaveLength(4);
      expect(hoverMagnifies).toHaveLength(4);
    });

    it('has proper grid structure and accessibility', () => {
      render(<PortfolioSection />);

      const gridRegion = screen.getByRole('region', { name: /Portfolio projects filtered by All/ });
      expect(gridRegion).toBeInTheDocument();
      expect(gridRegion).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('updates grid aria-label when category changes', async () => {
      render(<PortfolioSection />);

      // Initially shows "All"
      expect(screen.getByRole('region', { name: /Portfolio projects filtered by All/ })).toBeInTheDocument();

      // Change to Film category
      const filmButton = screen.getByRole('button', { name: /Filter portfolio by Film/ });
      fireEvent.click(filmButton);

      await waitFor(() => {
        expect(screen.getByRole('region', { name: /Portfolio projects filtered by Film/ })).toBeInTheDocument();
      });
    });
  });

  describe('View More Button', () => {
    it('renders view full portfolio button', () => {
      render(<PortfolioSection />);

      const viewMoreButton = screen.getByRole('button', { name: /View Full Portfolio/ });
      expect(viewMoreButton).toBeInTheDocument();
      expect(viewMoreButton).toHaveClass('btn-secondary');
    });

    it('view more button is clickable', () => {
      render(<PortfolioSection />);

      const viewMoreButton = screen.getByRole('button', { name: /View Full Portfolio/ });
      fireEvent.click(viewMoreButton);

      // Button should remain in document after click
      expect(viewMoreButton).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('has proper section structure and styling', () => {
      render(<PortfolioSection />);

      const section = document.querySelector('#portfolio');
      expect(section).toHaveClass(
        'bg-gradient-to-br',
        'from-bw-charcoal',
        'via-bw-dark-gray',
        'to-bw-charcoal',
        'px-6',
        'py-32'
      );
    });

    it('has centered content with max width', () => {
      render(<PortfolioSection />);

      const section = document.querySelector('#portfolio');
      const container = section?.querySelector('.mx-auto.max-w-7xl');
      expect(container).toBeInTheDocument();
    });

    it('applies proper spacing and layout classes', () => {
      render(<PortfolioSection />);

      const section = document.querySelector('#portfolio');
      expect(section).toHaveClass('px-6', 'py-32');
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<PortfolioSection />);

      // Should be a section element
      const section = document.querySelector('#portfolio');
      expect(section).toBeInTheDocument();
      expect(section?.tagName.toLowerCase()).toBe('section');

      // Should have proper heading hierarchy
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('has proper heading levels', () => {
      render(<PortfolioSection />);

      // Main heading should be h2
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();
    });

    it('filter buttons have proper accessibility attributes', () => {
      render(<PortfolioSection />);

      const filterButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('Filter portfolio by')
      );

      filterButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed');
        expect(button).toHaveAttribute('aria-label');
        expect(button.getAttribute('aria-label')).toMatch(/Filter portfolio by/);
      });
    });

    it('provides meaningful text content', () => {
      render(<PortfolioSection />);

      expect(screen.getByText(/diverse range of creative projects/)).toBeInTheDocument();
      expect(screen.getByText(/visual storytelling/)).toBeInTheDocument();
      expect(screen.getByText(/premium craftsmanship/)).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('renders cursor data attributes for interactive elements', () => {
      render(<PortfolioSection />);

      const cursorElements = document.querySelectorAll('[data-cursor="portfolio"]');
      expect(cursorElements.length).toBeGreaterThan(0);
    });

    it('handles multiple category switches correctly', async () => {
      render(<PortfolioSection />);

      const allButton = screen.getByRole('button', { name: /Filter portfolio by All/ });
      const filmButton = screen.getByRole('button', { name: /Filter portfolio by Film/ });
      const photoButton = screen.getByRole('button', { name: /Filter portfolio by Photography/ });

      // Switch to Film
      fireEvent.click(filmButton);
      await waitFor(() => {
        expect(filmButton).toHaveAttribute('aria-pressed', 'true');
      });

      // Switch to Photography
      fireEvent.click(photoButton);
      await waitFor(() => {
        expect(photoButton).toHaveAttribute('aria-pressed', 'true');
        expect(filmButton).toHaveAttribute('aria-pressed', 'false');
      });

      // Switch back to All
      fireEvent.click(allButton);
      await waitFor(() => {
        expect(allButton).toHaveAttribute('aria-pressed', 'true');
        expect(photoButton).toHaveAttribute('aria-pressed', 'false');
      });
    });
  });

  describe('Brand Consistency', () => {
    it('uses brand colors consistently', () => {
      render(<PortfolioSection />);

      const section = document.querySelector('#portfolio');
      expect(section).toHaveClass('bg-gradient-to-br', 'from-bw-charcoal');
    });

    it('applies brand typography', () => {
      render(<PortfolioSection />);

      const mainHeading = screen.getByText('Portfolio');
      expect(mainHeading.closest('h2')).toHaveClass('text-display-lg');
    });

    it('uses consistent spacing patterns', () => {
      render(<PortfolioSection />);

      const section = document.querySelector('#portfolio');
      expect(section).toHaveClass('py-32');
    });
  });
});
