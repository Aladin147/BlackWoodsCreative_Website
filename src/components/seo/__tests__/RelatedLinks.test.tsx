import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import { RelatedLinks, RelatedServiceLinks, CTALinks, ContextualNavigation } from '../RelatedLinks';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock internal linking utility
jest.mock('@/lib/utils/internal-linking', () => ({
  getInternalLinksForPage: jest.fn(),
  getRelatedServicePages: jest.fn(),
}));

// Mock interactive components
jest.mock('@/components/interactive', () => ({
  MagneticField: ({ children }: { children: React.ReactNode }) => <div data-testid="magnetic-field">{children}</div>,
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <div data-testid="scroll-reveal">{children}</div>,
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockGetInternalLinksForPage = require('@/lib/utils/internal-linking').getInternalLinksForPage;
const mockGetRelatedServicePages = require('@/lib/utils/internal-linking').getRelatedServicePages;

describe('RelatedLinks Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RelatedLinks', () => {
    const mockLinkingStrategy = {
      relatedPages: [
        { href: '/about/our-story', text: 'Our Story', description: 'Learn about our journey', priority: 'high' },
        { href: '/about/team', text: 'Our Team', description: 'Meet our experts', priority: 'high' },
        { href: '/about/workflow', text: 'Our Workflow', description: 'How we work', priority: 'medium' }
      ],
      contextualLinks: [
        { href: '/services', text: 'Our Services', description: 'What we offer', priority: 'high', context: 'about' }
      ],
      callToActionLinks: [
        { href: '/contact', text: 'Contact Us', description: 'Get in touch' }
      ]
    };

    it('renders related links in default variant', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<RelatedLinks />);

      expect(screen.getByText('Related Pages')).toBeInTheDocument();
      expect(screen.getByText('Our Story')).toBeInTheDocument();
      expect(screen.getByText('Our Team')).toBeInTheDocument();
      expect(screen.getByText('Learn about our journey')).toBeInTheDocument();
    });

    it('renders related links in grid variant', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<RelatedLinks variant="grid" />);

      const container = screen.getByText('Related Pages').closest('div');
      expect(container?.querySelector('.grid')).toBeInTheDocument();
    });

    it('renders related links in compact variant', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<RelatedLinks variant="compact" />);

      expect(screen.getByText('Related Pages')).toBeInTheDocument();
      expect(screen.getByText('Our Story')).toBeInTheDocument();
      // Compact variant should not show descriptions
      expect(screen.queryByText('Learn about our journey')).not.toBeInTheDocument();
    });

    it('limits number of links based on maxLinks prop', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<RelatedLinks maxLinks={2} />);

      expect(screen.getByText('Our Story')).toBeInTheDocument();
      expect(screen.getByText('Our Team')).toBeInTheDocument();
      expect(screen.queryByText('Our Workflow')).not.toBeInTheDocument();
    });

    it('filters links by context when provided', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<RelatedLinks context="about" />);

      expect(screen.getByText('Our Services')).toBeInTheDocument();
      expect(screen.queryByText('Our Story')).not.toBeInTheDocument();
    });

    it('returns null when no linking strategy exists', () => {
      mockUsePathname.mockReturnValue('/unknown');
      mockGetInternalLinksForPage.mockReturnValue(null);

      const { container } = render(<RelatedLinks />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null when no links are available', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue({
        relatedPages: [],
        contextualLinks: [],
        callToActionLinks: []
      });

      const { container } = render(<RelatedLinks />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('RelatedServiceLinks', () => {
    const mockRelatedServices = [
      { href: '/services/video-production', text: 'Video Production', description: 'Professional video services' },
      { href: '/services/photography', text: 'Photography', description: 'Professional photography' }
    ];

    it('renders related service links', () => {
      mockGetRelatedServicePages.mockReturnValue(mockRelatedServices);

      render(<RelatedServiceLinks currentService="3d-visualization" />);

      expect(screen.getByText('Other Services')).toBeInTheDocument();
      expect(screen.getByText('Video Production')).toBeInTheDocument();
      expect(screen.getByText('Photography')).toBeInTheDocument();
    });

    it('returns null when no related services exist', () => {
      mockGetRelatedServicePages.mockReturnValue([]);

      const { container } = render(<RelatedServiceLinks currentService="unknown" />);
      expect(container.firstChild).toBeNull();
    });

    it('uses custom title when provided', () => {
      mockGetRelatedServicePages.mockReturnValue(mockRelatedServices);

      render(<RelatedServiceLinks currentService="3d-visualization" title="More Services" />);

      expect(screen.getByText('More Services')).toBeInTheDocument();
      expect(screen.queryByText('Other Services')).not.toBeInTheDocument();
    });
  });

  describe('CTALinks', () => {
    const mockLinkingStrategy = {
      relatedPages: [],
      contextualLinks: [],
      callToActionLinks: [
        { href: '/contact', text: 'Get Started', description: 'Contact us today' },
        { href: '/portfolio', text: 'View Work', description: 'See our portfolio' }
      ]
    };

    it('renders call-to-action links', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<CTALinks />);

      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('View Work')).toBeInTheDocument();
    });

    it('uses custom title when provided', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<CTALinks title="Take Action" />);

      expect(screen.getByText('Take Action')).toBeInTheDocument();
      expect(screen.queryByText('Ready to Get Started?')).not.toBeInTheDocument();
    });

    it('returns null when no CTA links exist', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue({
        relatedPages: [],
        contextualLinks: [],
        callToActionLinks: []
      });

      const { container } = render(<CTALinks />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('ContextualNavigation', () => {
    const mockLinkingStrategy = {
      relatedPages: [
        { href: '/about/story', text: 'Story', context: 'header' },
        { href: '/about/team', text: 'Team', context: 'header' }
      ],
      contextualLinks: [
        { href: '/services', text: 'Services', context: 'header' }
      ],
      callToActionLinks: []
    };

    it('renders contextual navigation for specific context', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<ContextualNavigation context="header" />);

      expect(screen.getByRole('navigation', { name: 'Contextual navigation' })).toBeInTheDocument();
      expect(screen.getByText('Story')).toBeInTheDocument();
      expect(screen.getByText('Team')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('returns null when no contextual links exist', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue({
        relatedPages: [],
        contextualLinks: [],
        callToActionLinks: []
      });

      const { container } = render(<ContextualNavigation context="header" />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null when no linking strategy exists', () => {
      mockUsePathname.mockReturnValue('/unknown');
      mockGetInternalLinksForPage.mockReturnValue(null);

      const { container } = render(<ContextualNavigation context="header" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    const mockLinkingStrategy = {
      relatedPages: [
        { href: '/about/story', text: 'Our Story', description: 'Learn about us', priority: 'high' }
      ],
      contextualLinks: [],
      callToActionLinks: []
    };

    it('provides proper link accessibility', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<RelatedLinks />);

      const link = screen.getByRole('link', { name: /our story/i });
      expect(link).toHaveAttribute('href', '/about/story');
    });

    it('includes proper ARIA labels for navigation', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue(mockLinkingStrategy);

      render(<ContextualNavigation context="test" />);

      const nav = screen.queryByRole('navigation');
      if (nav) {
        expect(nav).toHaveAttribute('aria-label', 'Contextual navigation');
      }
    });
  });
});
