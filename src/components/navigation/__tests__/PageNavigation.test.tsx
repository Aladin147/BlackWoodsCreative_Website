import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import { PageNavigation, CompactPageNavigation, SectionNavigation } from '../PageNavigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock internal linking utility
jest.mock('@/lib/utils/internal-linking', () => ({
  getInternalLinksForPage: jest.fn(),
}));

// Mock interactive components
jest.mock('@/components/interactive', () => ({
  MagneticField: ({ children }: { children: React.ReactNode }) => <div data-testid="magnetic-field">{children}</div>,
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <div data-testid="scroll-reveal">{children}</div>,
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockGetInternalLinksForPage = require('@/lib/utils/internal-linking').getInternalLinksForPage;

describe('PageNavigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PageNavigation', () => {
    const mockLinkingStrategy = {
      relatedPages: [
        { href: '/about/team', text: 'Our Team', description: 'Meet our experts' },
        { href: '/about/workflow', text: 'Our Workflow', description: 'How we work' }
      ],
      contextualLinks: [],
      callToActionLinks: []
    };

    it('returns null for homepage', () => {
      mockUsePathname.mockReturnValue('/');

      const { container } = render(<PageNavigation />);
      expect(container.firstChild).toBeNull();
    });

    it('renders navigation for About section pages', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<PageNavigation />);

      expect(screen.getByRole('navigation', { name: 'Page navigation' })).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('renders navigation for Services section pages', () => {
      mockUsePathname.mockReturnValue('/services/video-production-morocco');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<PageNavigation />);

      expect(screen.getByRole('navigation', { name: 'Page navigation' })).toBeInTheDocument();
    });

    it('shows home button in navigation', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<PageNavigation />);

      const homeButton = screen.getByRole('link', { name: 'Go to homepage' });
      expect(homeButton).toHaveAttribute('href', '/');
    });

    it('renders related links when available', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<PageNavigation showRelated={true} />);

      expect(screen.getByText('Related Pages')).toBeInTheDocument();
      expect(screen.getByText('Our Team')).toBeInTheDocument();
      expect(screen.getByText('Our Workflow')).toBeInTheDocument();
    });

    it('limits related links based on maxRelated prop', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<PageNavigation showRelated={true} maxRelated={1} />);

      expect(screen.getByText('Our Team')).toBeInTheDocument();
      expect(screen.queryByText('Our Workflow')).not.toBeInTheDocument();
    });

    it('hides prev/next navigation when showPrevNext is false', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<PageNavigation showPrevNext={false} />);

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('hides related links when showRelated is false', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<PageNavigation showRelated={false} />);

      expect(screen.queryByText('Related Pages')).not.toBeInTheDocument();
    });
  });

  describe('CompactPageNavigation', () => {
    it('returns null for homepage', () => {
      mockUsePathname.mockReturnValue('/');

      const { container } = render(<CompactPageNavigation />);
      expect(container.firstChild).toBeNull();
    });

    it('renders compact navigation for About pages', () => {
      mockUsePathname.mockReturnValue('/about/team');

      render(<CompactPageNavigation />);

      expect(screen.getByRole('navigation', { name: 'Compact page navigation' })).toBeInTheDocument();
    });

    it('shows previous and next links when available', () => {
      mockUsePathname.mockReturnValue('/about/team');

      render(<CompactPageNavigation />);

      // Should show links to adjacent pages in About sequence
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('returns null when no prev/next pages exist', () => {
      mockUsePathname.mockReturnValue('/unknown-page');

      const { container } = render(<CompactPageNavigation />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('SectionNavigation', () => {
    const mockSections = [
      { id: 'overview', title: 'Overview' },
      { id: 'features', title: 'Features' },
      { id: 'pricing', title: 'Pricing' }
    ];

    it('renders section navigation with all sections', () => {
      render(<SectionNavigation sections={mockSections} />);

      expect(screen.getByRole('navigation', { name: 'Section navigation' })).toBeInTheDocument();
      expect(screen.getByText('On this page')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('Pricing')).toBeInTheDocument();
    });

    it('creates proper anchor links for sections', () => {
      render(<SectionNavigation sections={mockSections} />);

      const overviewLink = screen.getByRole('link', { name: 'Overview' });
      expect(overviewLink).toHaveAttribute('href', '#overview');

      const featuresLink = screen.getByRole('link', { name: 'Features' });
      expect(featuresLink).toHaveAttribute('href', '#features');
    });

    it('applies custom className', () => {
      const { container } = render(
        <SectionNavigation sections={mockSections} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('handles empty sections array', () => {
      render(<SectionNavigation sections={[]} />);

      expect(screen.getByText('On this page')).toBeInTheDocument();
      // Should still render the container but with no section links
    });
  });

  describe('Page Sequence Logic', () => {
    it('correctly identifies About page sequence', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [], callToActionLinks: [] });

      render(<PageNavigation />);

      // Should show navigation for About sequence
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('correctly identifies Services page sequence', () => {
      mockUsePathname.mockReturnValue('/services/video-production-morocco');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [], callToActionLinks: [] });

      render(<PageNavigation />);

      // Should show navigation for Services sequence
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('handles pages not in any sequence', () => {
      mockUsePathname.mockReturnValue('/portfolio');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [], callToActionLinks: [] });

      render(<PageNavigation />);

      // Should still render navigation but without prev/next
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [], callToActionLinks: [] });

      render(<PageNavigation />);

      const nav = screen.getByRole('navigation', { name: 'Page navigation' });
      expect(nav).toHaveAttribute('aria-label', 'Page navigation');
    });

    it('includes proper link descriptions', () => {
      mockUsePathname.mockReturnValue('/about/team');

      render(<PageNavigation />);

      // Previous/Next links should have descriptive text
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('provides keyboard navigation support', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [], callToActionLinks: [] });

      render(<PageNavigation />);

      const homeButton = screen.getByRole('link', { name: 'Go to homepage' });
      expect(homeButton).not.toHaveAttribute('tabindex', '-1');
    });
  });
});
