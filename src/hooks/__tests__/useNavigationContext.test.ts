import { renderHook } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import { 
  useNavigationContext, 
  usePageNavigation, 
  useActiveNavigation, 
  useMobileNavigation 
} from '../useNavigationContext';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock internal linking utility
jest.mock('@/lib/utils/internal-linking', () => ({
  getInternalLinksForPage: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockGetInternalLinksForPage = require('@/lib/utils/internal-linking').getInternalLinksForPage;

describe('Navigation Context Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useNavigationContext', () => {
    it('correctly identifies homepage', () => {
      mockUsePathname.mockReturnValue('/');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current.currentPath).toBe('/');
      expect(result.current.pageType).toBe('home');
      expect(result.current.isSubpage).toBe(false);
      expect(result.current.section).toBeUndefined();
      expect(result.current.parentPath).toBeUndefined();
    });

    it('correctly identifies about pages', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current.pageType).toBe('about');
      expect(result.current.parentPath).toBe('/about');
      expect(result.current.isSubpage).toBe(false);
    });

    it('correctly identifies about subpages', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current.pageType).toBe('about');
      expect(result.current.section).toBe('our-story');
      expect(result.current.parentPath).toBe('/about');
      expect(result.current.isSubpage).toBe(true);
    });

    it('correctly identifies services pages', () => {
      mockUsePathname.mockReturnValue('/services/video-production-morocco');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current.pageType).toBe('services');
      expect(result.current.section).toBe('video-production-morocco');
      expect(result.current.parentPath).toBe('/services');
      expect(result.current.isSubpage).toBe(true);
    });

    it('correctly identifies portfolio pages', () => {
      mockUsePathname.mockReturnValue('/portfolio');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current.pageType).toBe('portfolio');
      expect(result.current.isSubpage).toBe(false);
    });

    it('correctly identifies contact pages', () => {
      mockUsePathname.mockReturnValue('/contact');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current.pageType).toBe('contact');
      expect(result.current.isSubpage).toBe(false);
    });

    it('correctly identifies other pages', () => {
      mockUsePathname.mockReturnValue('/unknown-page');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current.pageType).toBe('other');
      expect(result.current.isSubpage).toBe(false);
    });

    it('determines correct breadcrumb variant', () => {
      // Test enhanced variant for about pages
      mockUsePathname.mockReturnValue('/about/team');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result: aboutResult } = renderHook(() => useNavigationContext());
      expect(aboutResult.current.breadcrumbVariant).toBe('enhanced');

      // Test enhanced variant for services pages
      mockUsePathname.mockReturnValue('/services');
      const { result: servicesResult } = renderHook(() => useNavigationContext());
      expect(servicesResult.current.breadcrumbVariant).toBe('enhanced');

      // Test minimal variant for home page
      mockUsePathname.mockReturnValue('/');
      const { result: homeResult } = renderHook(() => useNavigationContext());
      expect(homeResult.current.breadcrumbVariant).toBe('minimal');

      // Test default variant for other pages
      mockUsePathname.mockReturnValue('/portfolio');
      const { result: otherResult } = renderHook(() => useNavigationContext());
      expect(otherResult.current.breadcrumbVariant).toBe('default');
    });

    it('determines navigation features correctly', () => {
      // Test subpage with navigation features
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue({ 
        relatedPages: [{ href: '/about/team', text: 'Team' }], 
        contextualLinks: [] 
      });

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current.showPageNavigation).toBe(true);
      expect(result.current.showRelatedLinks).toBe(true);
    });

    it('handles related links correctly', () => {
      const mockRelatedLinks = [
        { href: '/about/team', text: 'Our Team' },
        { href: '/about/workflow', text: 'Our Workflow' }
      ];

      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue({ 
        relatedPages: mockRelatedLinks, 
        contextualLinks: [] 
      });

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current.relatedLinks).toEqual(mockRelatedLinks);
    });
  });

  describe('usePageNavigation', () => {
    it('returns correct configuration for subpages', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue({ 
        relatedPages: [{ href: '/about/team', text: 'Team' }], 
        contextualLinks: [] 
      });

      const { result } = renderHook(() => usePageNavigation());

      expect(result.current.showBreadcrumbs).toBe(true);
      expect(result.current.breadcrumbProps.variant).toBe('enhanced');
      expect(result.current.showPageNavigation).toBe(true);
      expect(result.current.pageNavigationProps.showPrevNext).toBe(true);
    });

    it('returns correct configuration for homepage', () => {
      mockUsePathname.mockReturnValue('/');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => usePageNavigation());

      expect(result.current.showBreadcrumbs).toBe(false);
      expect(result.current.breadcrumbProps.variant).toBe('minimal');
    });

    it('configures breadcrumb props correctly', () => {
      mockUsePathname.mockReturnValue('/services/video-production-morocco');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => usePageNavigation());

      expect(result.current.breadcrumbProps.showCurrentPage).toBe(true);
      expect(result.current.breadcrumbProps.maxItems).toBe(6); // Subpage gets more items
    });
  });

  describe('useActiveNavigation', () => {
    it('correctly identifies active links', () => {
      mockUsePathname.mockReturnValue('/about/our-story');

      const { result } = renderHook(() => useActiveNavigation());

      expect(result.current.isActive('/about')).toBe(true);
      expect(result.current.isActive('/about/our-story', true)).toBe(true);
      expect(result.current.isActive('/services')).toBe(false);
    });

    it('handles homepage correctly', () => {
      mockUsePathname.mockReturnValue('/');

      const { result } = renderHook(() => useActiveNavigation());

      expect(result.current.isActive('/')).toBe(true);
      expect(result.current.isActive('/about')).toBe(false);
    });

    it('handles hash links on homepage', () => {
      mockUsePathname.mockReturnValue('/');

      const { result } = renderHook(() => useActiveNavigation());

      expect(result.current.isActive('#about')).toBe(false);
      expect(result.current.isActive('#portfolio')).toBe(false);
    });

    it('returns correct active classes', () => {
      mockUsePathname.mockReturnValue('/about');

      const { result } = renderHook(() => useActiveNavigation());

      expect(result.current.getActiveClass('/about')).toBe('text-bw-accent-gold');
      expect(result.current.getActiveClass('/services')).toBe('');
    });

    it('provides current path', () => {
      const testPath = '/services/photography';
      mockUsePathname.mockReturnValue(testPath);

      const { result } = renderHook(() => useActiveNavigation());

      expect(result.current.currentPath).toBe(testPath);
    });
  });

  describe('useMobileNavigation', () => {
    it('returns correct mobile configuration for subpages', () => {
      mockUsePathname.mockReturnValue('/about/our-story');
      mockGetInternalLinksForPage.mockReturnValue({ 
        relatedPages: [{ href: '/about/team', text: 'Team' }], 
        contextualLinks: [] 
      });

      const { result } = renderHook(() => useMobileNavigation());

      expect(result.current.showCompactBreadcrumbs).toBe(true);
      expect(result.current.showBackButton).toBe(true);
      expect(result.current.backButtonHref).toBe('/about');
      expect(result.current.showRelatedInSidebar).toBe(true);
      expect(result.current.maxRelatedMobile).toBe(2);
    });

    it('returns correct mobile configuration for main pages', () => {
      mockUsePathname.mockReturnValue('/services');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => useMobileNavigation());

      expect(result.current.showCompactBreadcrumbs).toBe(false);
      expect(result.current.showBackButton).toBe(false);
      expect(result.current.backButtonHref).toBe('/'); // Main pages fallback to home
    });

    it('handles pages without parent correctly', () => {
      mockUsePathname.mockReturnValue('/portfolio');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result } = renderHook(() => useMobileNavigation());

      expect(result.current.backButtonHref).toBe('/');
    });
  });

  describe('Hook Memoization', () => {
    it('memoizes navigation context correctly', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result, rerender } = renderHook(() => useNavigationContext());
      const firstResult = result.current;

      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it('updates when pathname changes', () => {
      mockUsePathname.mockReturnValue('/about');
      mockGetInternalLinksForPage.mockReturnValue({ relatedPages: [], contextualLinks: [] });

      const { result, rerender } = renderHook(() => useNavigationContext());
      const firstResult = result.current;

      mockUsePathname.mockReturnValue('/services');
      rerender();
      const secondResult = result.current;

      expect(firstResult.pageType).toBe('about');
      expect(secondResult.pageType).toBe('services');
    });
  });
});
