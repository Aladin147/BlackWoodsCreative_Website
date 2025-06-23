'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { getInternalLinksForPage, type InternalLink } from '@/lib/utils/internal-linking';

export interface NavigationContext {
  currentPath: string;
  pageType: 'home' | 'about' | 'services' | 'portfolio' | 'contact' | 'other';
  section: string | undefined;
  isSubpage: boolean;
  parentPath: string | undefined;
  relatedLinks: InternalLink[];
  breadcrumbVariant: 'default' | 'enhanced' | 'minimal';
  showPageNavigation: boolean;
  showRelatedLinks: boolean;
}

/**
 * Hook to provide context-aware navigation information
 */
export function useNavigationContext(): NavigationContext {
  const pathname = usePathname();
  
  return useMemo(() => {
    // Handle null pathname
    if (!pathname) {
      return {
        currentPath: '/',
        pageType: 'home' as const,
        section: undefined,
        isSubpage: false,
        parentPath: undefined,
        relatedLinks: [],
        breadcrumbVariant: 'minimal' as const,
        showPageNavigation: false,
        showRelatedLinks: false
      };
    }

    // Determine page type
    let pageType: NavigationContext['pageType'] = 'other';
    let section: string | undefined;
    let parentPath: string | undefined;

    if (pathname === '/') {
      pageType = 'home';
    } else if (pathname.startsWith('/about')) {
      pageType = 'about';
      parentPath = '/about';
      section = pathname.split('/')[2]; // e.g., 'our-story', 'team'
    } else if (pathname.startsWith('/services')) {
      pageType = 'services';
      parentPath = '/services';
      section = pathname.split('/')[2]; // e.g., 'video-production-morocco'
    } else if (pathname.startsWith('/portfolio')) {
      pageType = 'portfolio';
    } else if (pathname.startsWith('/contact')) {
      pageType = 'contact';
    }
    
    // Determine if this is a subpage
    const isSubpage = pathname.split('/').length > 2;
    
    // Get related links for current page
    const linkingStrategy = getInternalLinksForPage(pathname);
    const relatedLinks = linkingStrategy ? [
      ...linkingStrategy.relatedPages,
      ...linkingStrategy.contextualLinks
    ] : [];
    
    // Determine breadcrumb variant based on page type
    let breadcrumbVariant: NavigationContext['breadcrumbVariant'] = 'default';
    if (pageType === 'about' || pageType === 'services') {
      breadcrumbVariant = 'enhanced';
    } else if (pageType === 'home') {
      breadcrumbVariant = 'minimal';
    }
    
    // Determine navigation features to show
    const showPageNavigation = isSubpage && (pageType === 'about' || pageType === 'services');
    const showRelatedLinks = relatedLinks.length > 0 && pageType !== 'home';
    
    return {
      currentPath: pathname,
      pageType,
      section,
      isSubpage,
      parentPath,
      relatedLinks,
      breadcrumbVariant,
      showPageNavigation,
      showRelatedLinks
    };
  }, [pathname]);
}

/**
 * Hook to get page-specific navigation configuration
 */
export function usePageNavigation() {
  const context = useNavigationContext();
  
  return useMemo(() => {
    const config = {
      showBreadcrumbs: context.currentPath !== '/',
      breadcrumbProps: {
        variant: context.breadcrumbVariant,
        showCurrentPage: true,
        maxItems: context.isSubpage ? 6 : 4
      },
      showPageNavigation: context.showPageNavigation,
      pageNavigationProps: {
        showPrevNext: context.pageType === 'about' || context.pageType === 'services',
        showRelated: context.showRelatedLinks,
        maxRelated: 3
      },
      showRelatedLinks: context.showRelatedLinks && !context.showPageNavigation
    };
    
    return config;
  }, [context]);
}

/**
 * Hook to determine active navigation state
 */
export function useActiveNavigation() {
  const pathname = usePathname();
  
  return useMemo(() => {
    const isActive = (href: string, exact = false) => {
      if (exact) {
        return pathname === href;
      }
      
      // Handle hash links on homepage
      if (pathname === '/' && href.startsWith('#')) {
        return false; // Let scroll position determine active state
      }
      
      // Handle regular page links
      if (href === '/') {
        return pathname === '/';
      }
      
      return pathname.startsWith(href);
    };
    
    const getActiveClass = (href: string, exact = false) => {
      return isActive(href, exact) ? 'text-bw-accent-gold' : '';
    };
    
    return {
      isActive,
      getActiveClass,
      currentPath: pathname
    };
  }, [pathname]);
}

/**
 * Hook for mobile navigation state management
 */
export function useMobileNavigation() {
  const context = useNavigationContext();
  
  return useMemo(() => {
    // Simplified navigation for mobile
    const mobileConfig = {
      showCompactBreadcrumbs: context.isSubpage,
      showBackButton: context.isSubpage,
      backButtonHref: context.parentPath ?? '/',
      showRelatedInSidebar: context.showRelatedLinks,
      maxRelatedMobile: 2
    };
    
    return mobileConfig;
  }, [context]);
}
