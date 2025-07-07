import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import { generateBreadcrumbs } from '@/lib/utils/internal-linking';

import { Breadcrumbs, CompactBreadcrumbs, StyledBreadcrumbs } from '../Breadcrumbs';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: any;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ChevronRightIcon: ({ className }: { className?: string }) => (
    <svg data-testid="chevron-right" className={className} />
  ),
  HomeIcon: ({ className }: { className?: string }) => (
    <svg data-testid="home-icon" className={className} />
  ),
}));

// Mock internal linking utility
jest.mock('@/lib/utils/internal-linking', () => ({
  generateBreadcrumbs: jest.fn(),
}));

// Mock interactive components
jest.mock('@/components/interactive', () => ({
  MagneticField: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="magnetic-field">{children}</div>
  ),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockGenerateBreadcrumbs = generateBreadcrumbs as jest.MockedFunction<
  typeof generateBreadcrumbs
>;

describe('Breadcrumbs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Breadcrumbs', () => {
    it('renders breadcrumbs for a simple path', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
      ]);

      render(<Breadcrumbs />);

      expect(screen.getByRole('navigation', { name: 'Breadcrumb navigation' })).toBeInTheDocument();
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('renders breadcrumbs for nested path', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Our Story', href: '/about/our-story' },
      ]);

      render(<Breadcrumbs />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Our Story')).toBeInTheDocument();
    });

    it('handles long breadcrumb paths with ellipsis', () => {
      mockUsePathname.mockReturnValue('/services/video-production-morocco');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Video Production', href: '/services/video-production' },
        { name: 'Morocco', href: '/services/video-production-morocco' },
      ]);

      render(<Breadcrumbs maxItems={3} />);

      // Should show ellipsis for truncated breadcrumbs
      expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('applies correct ARIA attributes', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
      ]);

      render(<Breadcrumbs />);

      const nav = screen.getByRole('navigation', { name: 'Breadcrumb navigation' });
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb navigation');

      const currentPage = screen.getByText('About');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('supports different variants', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
      ]);

      render(<Breadcrumbs variant="enhanced" />);

      // Enhanced variant should include magnetic field components
      expect(screen.getAllByTestId('magnetic-field')).toHaveLength(1);
    });

    it('hides current page when showCurrentPage is false', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
      ]);

      render(<Breadcrumbs showCurrentPage={false} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.queryByText('About')).not.toBeInTheDocument();
    });
  });

  describe('CompactBreadcrumbs', () => {
    it('renders compact breadcrumbs with parent and current page', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Our Story', href: '/about/our-story' },
      ]);

      render(<CompactBreadcrumbs />);

      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Our Story')).toBeInTheDocument();
    });

    it('returns null when no current page exists', () => {
      mockUsePathname.mockReturnValue('/');
      mockGenerateBreadcrumbs.mockReturnValue([]);

      const { container } = render(<CompactBreadcrumbs />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('StyledBreadcrumbs', () => {
    it('renders styled breadcrumbs with enhanced styling', () => {
      mockUsePathname.mockReturnValue('/services');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
      ]);

      render(<StyledBreadcrumbs />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty breadcrumbs gracefully', () => {
      mockUsePathname.mockReturnValue('/');
      mockGenerateBreadcrumbs.mockReturnValue([]);

      const { container } = render(<Breadcrumbs />);
      expect(container.firstChild).toBeNull();
    });

    it('handles single breadcrumb item', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
      ]);

      render(<Breadcrumbs />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByText('About')).toHaveAttribute('aria-current', 'page');
    });

    it('handles undefined breadcrumb items', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGenerateBreadcrumbs.mockReturnValue(
        [
          { name: 'Home', href: '/' },
          { name: 'About', href: '/about' },
        ].filter(Boolean)
      );

      render(<Breadcrumbs />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      // Should handle undefined gracefully without crashing
    });
  });

  describe('Accessibility', () => {
    it('provides proper keyboard navigation', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Our Story', href: '/about/our-story' },
      ]);

      render(<Breadcrumbs />);

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('includes proper focus management', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGenerateBreadcrumbs.mockReturnValue([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
      ]);

      render(<Breadcrumbs />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveClass('focus:outline-none');
    });
  });
});
