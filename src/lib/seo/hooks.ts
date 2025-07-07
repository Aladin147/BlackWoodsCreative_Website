/**
 * SEO React Hooks
 *
 * React hooks for SEO optimization and content integration
 */

import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';

import { legacyContentManager } from '../content';
import { logger } from '../utils/logger';

import { seoOptimizer, PageSEO, SEOAnalysis } from './optimization';

// Hook for page SEO
export function usePageSEO(initialSEO: PageSEO = {}) {
  const [pageSEO, setPageSEO] = useState<PageSEO>(initialSEO);
  const pathname = usePathname();

  // Generate metadata for the current page
  const metadata = useMemo(() => {
    return seoOptimizer.generateMetadata(pageSEO, pathname);
  }, [pageSEO, pathname]);

  // Update SEO data
  const updateSEO = (updates: Partial<PageSEO>) => {
    setPageSEO(prev => ({ ...prev, ...updates }));
  };

  // Reset SEO data
  const resetSEO = () => {
    setPageSEO(initialSEO);
  };

  return {
    pageSEO,
    metadata,
    updateSEO,
    resetSEO,
  };
}

// Hook for SEO analysis
export function useSEOAnalysis(content: string, pageSEO: PageSEO = {}) {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeContent = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate async analysis (in real implementation, might involve API calls)
      await new Promise(resolve => setTimeout(resolve, 100));
      const result = seoOptimizer.analyzePage(content, pageSEO);
      setAnalysis(result);
    } catch (error) {
      logger.error('SEO analysis failed', error);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, [content, pageSEO]);

  useEffect(() => {
    if (content) {
      analyzeContent();
    }
  }, [content, analyzeContent]);

  return {
    analysis,
    loading,
    reanalyze: analyzeContent,
  };
}

// Hook for content-based SEO
export function useContentSEO(contentId: string) {
  const [seoData, setSeoData] = useState<PageSEO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContentSEO = () => {
      setLoading(true);

      const content = legacyContentManager.get(contentId);
      if (!content) {
        setSeoData(null);
        setLoading(false);
        return;
      }

      // Extract SEO data from content metadata
      const seo: PageSEO = {
        title: content.metadata?.seoTitle ?? content.metadata?.title ?? '',
        description: content.metadata?.seoDescription ?? content.metadata?.description ?? '',
        keywords: content.metadata?.seoKeywords ?? content.metadata?.tags ?? [],
        ogTitle: content.metadata?.seoTitle ?? content.metadata?.title ?? '',
        ogDescription: content.metadata?.seoDescription ?? content.metadata?.description ?? '',
      };

      // Add content-specific SEO data
      if (content.type === 'portfolio') {
        seo.ogType = 'article';
        seo.twitterCard = 'summary_large_image';
      } else if (content.type === 'blog') {
        seo.ogType = 'article';
        seo.twitterCard = 'summary_large_image';
      }

      setSeoData(seo);
      setLoading(false);
    };

    loadContentSEO();
  }, [contentId]);

  return {
    seoData,
    loading,
  };
}

// Hook for structured data
export function useStructuredData(type: string, data: Record<string, unknown>) {
  const structuredData = useMemo(() => {
    return seoOptimizer.generateStructuredData(type, data);
  }, [type, data]);

  // Generate JSON-LD script tag
  const jsonLdScript = useMemo(() => {
    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
  }, [structuredData]);

  return {
    structuredData,
    jsonLdScript,
  };
}

// Hook for SEO monitoring
export function useSEOMonitoring() {
  const [metrics, setMetrics] = useState({
    totalPages: 0,
    pagesWithSEO: 0,
    averageScore: 0,
    commonIssues: [] as string[],
  });

  const updateMetrics = () => {
    // In a real implementation, this would collect data from all pages
    const allContent = legacyContentManager.getAll();
    const contentWithSEO = allContent.filter(
      content => content.metadata?.seoTitle ?? content.metadata?.seoDescription
    );

    setMetrics({
      totalPages: allContent.length,
      pagesWithSEO: contentWithSEO.length,
      averageScore: 85, // Placeholder - would calculate from actual analysis
      commonIssues: [
        'Missing meta descriptions',
        'Title tags too long',
        'Missing alt text on images',
      ],
    });
  };

  useEffect(() => {
    updateMetrics();

    // Update metrics periodically
    const interval = setInterval(updateMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    refresh: updateMetrics,
  };
}

// Hook for breadcrumbs
export function useBreadcrumbs(customBreadcrumbs?: Array<{ name: string; url: string }>) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    // Generate breadcrumbs from pathname
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbList = [{ name: 'Home', url: '/' }];

    let currentPath = '';
    segments.forEach(segment => {
      currentPath += `/${segment}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbList.push({ name, url: currentPath });
    });

    return breadcrumbList;
  }, [pathname, customBreadcrumbs]);

  const structuredData = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${seoOptimizer.getConfig().siteUrl}${crumb.url}`,
      })),
    };
  }, [breadcrumbs]);

  return {
    breadcrumbs,
    structuredData,
  };
}

// Hook for canonical URLs
export function useCanonicalUrl(customCanonical?: string) {
  const pathname = usePathname();

  const canonicalUrl = useMemo(() => {
    if (customCanonical) {
      return customCanonical;
    }

    const config = seoOptimizer.getConfig();
    return `${config.siteUrl}${pathname}`;
  }, [pathname, customCanonical]);

  return canonicalUrl;
}

// Hook for social media meta tags
export function useSocialMeta(pageSEO: PageSEO) {
  const config = seoOptimizer.getConfig();
  const pathname = usePathname();

  const socialMeta = useMemo(() => {
    return {
      // Open Graph
      'og:title': pageSEO.ogTitle ?? pageSEO.title ?? config.defaultTitle,
      'og:description': pageSEO.ogDescription ?? pageSEO.description ?? config.defaultDescription,
      'og:image': pageSEO.ogImage ?? config.defaultImage,
      'og:url': pageSEO.canonical ?? `${config.siteUrl}${pathname}`,
      'og:type': pageSEO.ogType ?? 'website',
      'og:site_name': config.siteName,
      'og:locale': config.locale,

      // Twitter
      'twitter:card': pageSEO.twitterCard ?? 'summary_large_image',
      'twitter:title':
        pageSEO.twitterTitle ?? pageSEO.ogTitle ?? pageSEO.title ?? config.defaultTitle,
      'twitter:description':
        pageSEO.twitterDescription ??
        pageSEO.ogDescription ??
        pageSEO.description ??
        config.defaultDescription,
      'twitter:image': pageSEO.twitterImage ?? pageSEO.ogImage ?? config.defaultImage,
      'twitter:site': config.twitterHandle,
      'twitter:creator': config.twitterHandle,
    };
  }, [pageSEO, config, pathname]);

  return socialMeta;
}

// Hook for SEO performance tracking
export function useSEOPerformance() {
  const [performance, setPerformance] = useState({
    searchVisibility: 0,
    clickThroughRate: 0,
    averagePosition: 0,
    impressions: 0,
    clicks: 0,
  });

  const updatePerformance = () => {
    // In a real implementation, this would integrate with Google Search Console API
    // For now, return mock data
    setPerformance({
      searchVisibility: 75,
      clickThroughRate: 3.2,
      averagePosition: 8.5,
      impressions: 12500,
      clicks: 400,
    });
  };

  useEffect(() => {
    updatePerformance();
  }, []);

  return {
    performance,
    refresh: updatePerformance,
  };
}

// Hook for local SEO (for location-based businesses)
export function useLocalSEO(businessData: {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  businessType: string;
}) {
  const structuredData = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: businessData.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: businessData.address,
        addressLocality: businessData.city,
        addressCountry: businessData.country,
      },
      telephone: businessData.phone,
      '@id': seoOptimizer.getConfig().siteUrl,
      url: seoOptimizer.getConfig().siteUrl,
      image: seoOptimizer.getConfig().defaultImage,
      priceRange: '$$',
      openingHours: 'Mo-Fr 09:00-18:00',
    };
  }, [businessData]);

  return {
    structuredData,
  };
}
