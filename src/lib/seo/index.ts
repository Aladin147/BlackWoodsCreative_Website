/**
 * SEO Framework - Main Export
 *
 * Centralized exports for the SEO optimization system
 */

// Import for internal use
import { legacyContentManager, type LegacyContent } from '../content';
import { logger } from '../utils/logger';

import { SEOUtils, seoOptimizer, PageSEO } from './optimization';

// Core SEO exports
export {
  SEOOptimizer,
  seoOptimizer,
  SEOUtils,
  DEFAULT_SEO_CONFIG,
  type SEOConfig,
  type PageSEO,
  type SEOAnalysis,
  type HeadingStructure,
  type ImageSEOMetrics,
  type PerformanceSEOMetrics,
} from './optimization';

// Centralized types exports
export {
  type SEOIssue,
  type ContentAnalysisResult,
  type SEOMetrics,
  ensureFixProperty,
  ensureFixProperties,
} from './types';

// Hooks exports
export {
  usePageSEO,
  useSEOAnalysis,
  useContentSEO,
  useStructuredData,
  useSEOMonitoring,
  useBreadcrumbs,
  useCanonicalUrl,
  useSocialMeta,
  useSEOPerformance,
  useLocalSEO,
} from './hooks';

// Component exports
export {
  SEOHead,
  StructuredData,
  Breadcrumbs,
  OrganizationStructuredData,
  WebsiteStructuredData,
  LocalBusinessStructuredData,
  ServiceStructuredData,
  ArticleStructuredData,
  FAQStructuredData,
  CreativeWorkStructuredData,
  SEOAnalytics,
} from '../../components/seo/SEOComponents';

// Integration with content system
// Imports moved to top of file

// Content-aware SEO optimization
export const ContentSEOIntegration = {
  // Generate SEO for content item
  generateContentSEO: (content: LegacyContent): PageSEO => {
    const baseSEO: PageSEO = {
      title: content.metadata?.seoTitle ?? content.metadata?.title ?? '',
      description: content.metadata?.seoDescription ?? content.metadata?.description ?? '',
      keywords: content.metadata?.seoKeywords ?? content.metadata?.tags ?? [],
    };

    // Content-specific SEO optimization
    switch (content.type) {
      case 'blog':
        return {
          ...baseSEO,
          title: baseSEO.title ?? content.title,
          description: baseSEO.description ?? content.excerpt,
          keywords: baseSEO.keywords ?? content.tags,
          ogType: 'article',
          twitterCard: 'summary_large_image',
          ogImage: content.featuredImage?.src ?? '',
          canonical: `/blog/${content.slug}`,
          priority: 0.8,
          changefreq: 'weekly',
        };

      case 'portfolio':
        return {
          ...baseSEO,
          title: baseSEO.title ?? content.title,
          description: baseSEO.description ?? content.description,
          keywords: baseSEO.keywords ?? content.tags,
          ogType: 'article',
          twitterCard: 'summary_large_image',
          ogImage: content.images[0]?.src ?? '',
          canonical: `/portfolio/${content.id}`,
          priority: 0.9,
          changefreq: 'monthly',
        };

      case 'service':
        return {
          ...baseSEO,
          ogType: 'website',
          twitterCard: 'summary',
          priority: 0.8,
          changefreq: 'monthly',
        };

      case 'page':
        return {
          ...baseSEO,
          ogType: 'website',
          twitterCard: 'summary_large_image',
          priority: 0.7,
          changefreq: 'monthly',
        };

      default:
        return baseSEO;
    }
  },

  // Bulk update SEO for all content
  updateAllContentSEO: (): void => {
    const allContent = legacyContentManager.getAll();

    allContent.forEach(content => {
      const seoData = ContentSEOIntegration.generateContentSEO(content);

      // Update content metadata with SEO data
      legacyContentManager.update(content.id, {
        metadata: {
          ...content.metadata,
          seoTitle: seoData.title ?? '',
          seoDescription: seoData.description ?? '',
          seoKeywords: seoData.keywords ?? [],
          // Note: canonical and changefreq are SEO-specific, not stored in content metadata
        },
      });
    });

    logger.info('Updated SEO for content items', { count: allContent.length });
  },

  // Get SEO-optimized content for sitemap
  getSitemapContent: (): Array<{
    url: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }> => {
    const allContent = legacyContentManager.getAll();
    const config = seoOptimizer.getConfig();

    return allContent
      .filter(content => content.status === 'published')
      .map(content => {
        const seoData = ContentSEOIntegration.generateContentSEO(content);

        const isoString = content.lastUpdated?.toISOString() || new Date().toISOString();
        const datePart = isoString.split('T')[0] ?? isoString;

        return {
          url: `${config.siteUrl}${seoData.canonical ?? `/${content.type}/${content.id}`}`,
          lastmod: datePart ?? isoString.substring(0, 10), // Fallback to substring if split fails
          changefreq: seoData.changefreq ?? 'monthly',
          priority: seoData.priority ?? 0.5,
        };
      });
  },

  // Generate robots.txt content
  generateRobotsTxt: (): string => {
    const config = seoOptimizer.getConfig();
    return SEOUtils.generateRobotsTxt(config);
  },

  // Generate sitemap.xml content
  generateSitemap: (): string => {
    const sitemapContent = ContentSEOIntegration.getSitemapContent();
    const config = seoOptimizer.getConfig();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add homepage
    sitemap += SEOUtils.generateSitemapEntry(config.siteUrl, {
      priority: 1.0,
      changefreq: 'daily',
    });

    // Add static pages
    const staticPages = [
      { url: '/about', priority: 0.8, changefreq: 'monthly' },
      { url: '/services', priority: 0.9, changefreq: 'monthly' },
      { url: '/portfolio', priority: 0.9, changefreq: 'weekly' },
      { url: '/blog', priority: 0.8, changefreq: 'daily' },
      { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    ];

    staticPages.forEach(page => {
      sitemap += SEOUtils.generateSitemapEntry(`${config.siteUrl}${page.url}`, {
        priority: page.priority,
        changefreq: page.changefreq as 'monthly' | 'weekly' | 'daily',
      });
    });

    // Add content pages
    sitemapContent.forEach(item => {
      sitemap += SEOUtils.generateSitemapEntry(item.url, {
        priority: item.priority,
        changefreq: item.changefreq as
          | 'always'
          | 'hourly'
          | 'daily'
          | 'weekly'
          | 'monthly'
          | 'yearly'
          | 'never',
        lastmod: item.lastmod,
      });
    });

    sitemap += '\n</urlset>';
    return sitemap;
  },
};

// SEO performance optimization
export const SEOPerformanceOptimization = {
  // Initialize SEO system
  initialize: (): void => {
    // Update all content SEO
    ContentSEOIntegration.updateAllContentSEO();

    // Log SEO status in development
    if (process.env.NODE_ENV === 'development') {
      logger.info('SEO optimization system initialized');

      const allContent = legacyContentManager.getAll();
      const contentWithSEO = allContent.filter(
        content => content.metadata?.seoTitle ?? content.metadata?.seoDescription
      );

      logger.info('SEO Coverage analysis', {
        optimizedContent: contentWithSEO.length,
        totalContent: allContent.length,
      });
    }
  },

  // Analyze all content SEO
  analyzeAllContent: (): {
    totalContent: number;
    optimizedContent: number;
    averageScore: number;
    commonIssues: string[];
  } => {
    const allContent = legacyContentManager.getAll();
    let totalScore = 0;
    const issues: string[] = [];

    const optimizedContent = allContent.filter(content => {
      const seoData = ContentSEOIntegration.generateContentSEO(content);

      // Simple scoring
      let score = 0;
      if (seoData.title) score += 25;
      if (seoData.description) score += 25;
      if (seoData.keywords && seoData.keywords.length > 0) score += 25;
      if (content.metadata?.seoTitle) score += 25;

      totalScore += score;

      // Track common issues
      if (!seoData.title) issues.push('Missing title');
      if (!seoData.description) issues.push('Missing description');
      if (!seoData.keywords || seoData.keywords.length === 0) issues.push('Missing keywords');

      return score >= 50; // Consider optimized if score >= 50%
    });

    // Count common issues
    const issueCount: Record<string, number> = {};
    issues.forEach(issue => {
      // Safe object assignment with validation
      if (typeof issue === 'string' && issue.length > 0 && issue.length < 200) {
        issueCount[issue] = (issueCount[issue] ?? 0) + 1;
      }
    });

    const commonIssues = Object.entries(issueCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue, count]) => `${issue} (${count} items)`);

    return {
      totalContent: allContent.length,
      optimizedContent: optimizedContent.length,
      averageScore: allContent.length > 0 ? totalScore / allContent.length : 0,
      commonIssues,
    };
  },

  // Get SEO recommendations
  getRecommendations: (): string[] => {
    const analysis = SEOPerformanceOptimization.analyzeAllContent();
    const recommendations: string[] = [];

    if (analysis.optimizedContent / analysis.totalContent < 0.8) {
      recommendations.push('Improve SEO coverage - less than 80% of content is optimized');
    }

    if (analysis.averageScore < 75) {
      recommendations.push('Focus on improving content SEO quality');
    }

    if (analysis.commonIssues.some(issue => issue.includes('Missing title'))) {
      recommendations.push('Add SEO titles to content items');
    }

    if (analysis.commonIssues.some(issue => issue.includes('Missing description'))) {
      recommendations.push('Add meta descriptions to content items');
    }

    if (analysis.commonIssues.some(issue => issue.includes('Missing keywords'))) {
      recommendations.push('Add relevant keywords to content items');
    }

    return recommendations;
  },
};

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Initialize after a short delay to ensure content system is loaded
  setTimeout(() => {
    SEOPerformanceOptimization.initialize();
  }, 200);
}

// Development utilities
export const SEODevUtils = {
  // Log SEO system status
  logStatus: () => {
    if (process.env.NODE_ENV !== 'development') return;

    const analysis = SEOPerformanceOptimization.analyzeAllContent();
    const recommendations = SEOPerformanceOptimization.getRecommendations();

    logger.info('SEO System Status', {
      totalContent: analysis.totalContent,
      optimizedContent: analysis.optimizedContent,
      averageScore: `${analysis.averageScore.toFixed(1)}/100`,
      commonIssues: analysis.commonIssues,
      recommendations,
    });
  },

  // Test SEO for specific content
  testContentSEO: (contentId: string) => {
    if (process.env.NODE_ENV !== 'development') return;

    const content = legacyContentManager.get(contentId);
    if (!content) {
      logger.error('Content not found for SEO test', { contentId });
      return;
    }

    const seoData = ContentSEOIntegration.generateContentSEO(content);
    logger.info('SEO Test results', { contentId, seoData });
  },

  // Generate test sitemap
  generateTestSitemap: () => {
    if (process.env.NODE_ENV !== 'development') return;

    const sitemap = ContentSEOIntegration.generateSitemap();
    logger.info('Generated test sitemap', { sitemap });
    return sitemap;
  },
};
