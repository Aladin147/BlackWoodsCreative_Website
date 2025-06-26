/**
 * SEO Optimization Framework
 * 
 * Comprehensive SEO system with content-based optimization and analytics
 */

import { Metadata } from 'next';

import { contentManager, ImageContent } from '../content';

// SEO configuration
export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  defaultImage: string;
  twitterHandle?: string;
  facebookAppId?: string;
  locale: string;
  alternateLocales?: string[];
  themeColor: string;
  robots: {
    index: boolean;
    follow: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
      noimageindex?: boolean;
      'max-video-preview'?: number;
      'max-image-preview'?: 'none' | 'standard' | 'large';
      'max-snippet'?: number;
    };
  };
}

// Page SEO data
export interface PageSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile' | 'book' | 'music' | 'video';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: Record<string, unknown>[];
  noindex?: boolean;
  nofollow?: boolean;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
}

// SEO analysis result
export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  recommendations: string[];
  metrics: {
    titleLength: number;
    descriptionLength: number;
    keywordDensity: Record<string, number>;
    headingStructure: HeadingStructure[];
    imageOptimization: ImageSEOMetrics;
    performance: PerformanceSEOMetrics;
  };
}

// SEO issue
export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'title' | 'description' | 'keywords' | 'images' | 'structure' | 'performance';
  message: string;
  impact: 'high' | 'medium' | 'low';
  fix?: string;
}

// Heading structure
export interface HeadingStructure {
  level: number;
  text: string;
  id?: string;
}

// Image SEO metrics
export interface ImageSEOMetrics {
  totalImages: number;
  imagesWithAlt: number;
  imagesWithTitle: number;
  averageFileSize: number;
  formatDistribution: Record<string, number>;
}

// Performance SEO metrics
export interface PerformanceSEOMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

// Default SEO configuration
export const DEFAULT_SEO_CONFIG: SEOConfig = {
  siteName: 'BlackWoods Creative',
  siteUrl: 'https://blackwoodscreative.com',
  defaultTitle: 'BlackWoods Creative - Premium Visual Storytelling',
  defaultDescription: 'Professional filmmaking, photography, 3D visualization, and scene creation services. Transform your vision into compelling visual narratives.',
  defaultKeywords: [
    'filmmaking',
    'photography',
    '3d visualization',
    'scene creation',
    'visual storytelling',
    'morocco',
    'mohammedia',
    'video production',
    'architectural visualization',
  ],
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@blackwoodscreative',
  locale: 'en_US',
  alternateLocales: ['fr_FR', 'ar_MA'],
  themeColor: '#1a1a1a',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': 30,
      'max-snippet': 160,
    },
  },
};

// SEO optimization class
export class SEOOptimizer {
  private static instance: SEOOptimizer;
  private config: SEOConfig;

  constructor(config: Partial<SEOConfig> = {}) {
    this.config = { ...DEFAULT_SEO_CONFIG, ...config };
  }

  static getInstance(config?: Partial<SEOConfig>): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer(config);
    }
    return SEOOptimizer.instance;
  }

  // Generate Next.js metadata
  generateMetadata(pageSEO: PageSEO = {}, path = ''): Metadata {
    const {
      title,
      description,
      keywords,
      canonical,
      ogTitle,
      ogDescription,
      ogImage,
      ogType = 'website',
      twitterTitle,
      twitterDescription,
      twitterImage,
      twitterCard = 'summary_large_image',
      noindex = false,
      nofollow = false,
    } = pageSEO;

    const finalTitle = title 
      ? `${title} | ${this.config.siteName}`
      : this.config.defaultTitle;

    const finalDescription = description ?? this.config.defaultDescription;
    const finalKeywords = keywords ?? this.config.defaultKeywords;
    const finalCanonical = canonical ?? `${this.config.siteUrl}${path}`;
    const finalOgImage = ogImage ?? this.config.defaultImage;

    const metadata: Metadata = {
      title: finalTitle,
      description: finalDescription,
      keywords: finalKeywords.join(', '),
      
      // Canonical URL
      alternates: {
        canonical: finalCanonical,
      },

      // Open Graph
      openGraph: {
        title: ogTitle ?? finalTitle,
        description: ogDescription ?? finalDescription,
        url: finalCanonical,
        siteName: this.config.siteName,
        images: [
          {
            url: finalOgImage,
            width: 1200,
            height: 630,
            alt: ogTitle ?? finalTitle,
          },
        ],
        locale: this.config.locale,
        type: ogType === 'video' || ogType === 'music' ? 'website' : ogType,
      },

      // Twitter
      twitter: {
        card: twitterCard,
        title: twitterTitle ?? ogTitle ?? finalTitle,
        description: twitterDescription ?? ogDescription ?? finalDescription,
        images: [twitterImage ?? finalOgImage],
        creator: this.config.twitterHandle ?? '',
        site: this.config.twitterHandle ?? '',
      },

      // Robots
      robots: {
        index: !noindex && this.config.robots.index,
        follow: !nofollow && this.config.robots.follow,
        googleBot: this.config.robots.googleBot ?? {
          index: true,
          follow: true,
        },
      },

      // Additional metadata
      other: {
        'theme-color': this.config.themeColor,
      },
    };

    // Add alternate locales if configured
    if (this.config.alternateLocales) {
      metadata.alternates = {
        ...metadata.alternates,
        languages: this.config.alternateLocales.reduce((acc, locale) => {
          acc[locale] = `${this.config.siteUrl}/${locale}${path}`;
          return acc;
        }, {} as Record<string, string>),
      };
    }

    return metadata;
  }

  // Generate structured data
  generateStructuredData(type: string, data: Record<string, unknown>): Record<string, unknown> {
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': type,
    };

    switch (type) {
      case 'Organization':
        return {
          ...baseStructuredData,
          name: this.config.siteName,
          url: this.config.siteUrl,
          logo: `${this.config.siteUrl}/images/logo.png`,
          sameAs: [
            'https://instagram.com/blackwoodscreative',
            'https://linkedin.com/company/blackwoodscreative',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+212-XXX-XXXXXX',
            contactType: 'customer service',
            areaServed: 'MA',
            availableLanguage: ['English', 'French', 'Arabic'],
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Mohammedia',
            addressCountry: 'MA',
          },
          ...data,
        };

      case 'WebSite':
        return {
          ...baseStructuredData,
          name: this.config.siteName,
          url: this.config.siteUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${this.config.siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
          ...data,
        };

      case 'Service':
        return {
          ...baseStructuredData,
          provider: {
            '@type': 'Organization',
            name: this.config.siteName,
            url: this.config.siteUrl,
          },
          areaServed: {
            '@type': 'Country',
            name: 'Morocco',
          },
          ...data,
        };

      case 'CreativeWork':
        return {
          ...baseStructuredData,
          creator: {
            '@type': 'Organization',
            name: this.config.siteName,
            url: this.config.siteUrl,
          },
          ...data,
        };

      default:
        return {
          ...baseStructuredData,
          ...data,
        };
    }
  }

  // Analyze page SEO
  analyzePage(content: string, pageSEO: PageSEO = {}): SEOAnalysis {
    const issues: SEOIssue[] = [];
    const recommendations: string[] = [];

    // Analyze title
    const titleLength = (pageSEO.title ?? this.config.defaultTitle).length;
    if (titleLength < 30) {
      issues.push({
        type: 'warning',
        category: 'title',
        message: 'Title is too short',
        impact: 'medium',
        fix: 'Consider expanding the title to 30-60 characters',
      });
    } else if (titleLength > 60) {
      issues.push({
        type: 'warning',
        category: 'title',
        message: 'Title is too long',
        impact: 'medium',
        fix: 'Consider shortening the title to under 60 characters',
      });
    }

    // Analyze description
    const descriptionLength = (pageSEO.description ?? this.config.defaultDescription).length;
    if (descriptionLength < 120) {
      issues.push({
        type: 'warning',
        category: 'description',
        message: 'Meta description is too short',
        impact: 'medium',
        fix: 'Consider expanding the description to 120-160 characters',
      });
    } else if (descriptionLength > 160) {
      issues.push({
        type: 'warning',
        category: 'description',
        message: 'Meta description is too long',
        impact: 'medium',
        fix: 'Consider shortening the description to under 160 characters',
      });
    }

    // Analyze keyword density
    const keywordDensity = this.calculateKeywordDensity(content, pageSEO.keywords ?? []);

    // Analyze heading structure
    const headingStructure = this.extractHeadingStructure(content);
    if (headingStructure.length === 0) {
      issues.push({
        type: 'error',
        category: 'structure',
        message: 'No headings found',
        impact: 'high',
        fix: 'Add proper heading structure (H1, H2, H3, etc.)',
      });
    }

    // Calculate SEO score
    let score = 100;
    issues.forEach(issue => {
      switch (issue.impact) {
        case 'high': score -= 15; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }
    });

    // Generate recommendations
    if (score < 70) {
      recommendations.push('Focus on fixing high-impact SEO issues first');
    }
    if (titleLength < 30 || titleLength > 60) {
      recommendations.push('Optimize title length for better search visibility');
    }
    if (descriptionLength < 120 || descriptionLength > 160) {
      recommendations.push('Optimize meta description length for better click-through rates');
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
      metrics: {
        titleLength,
        descriptionLength,
        keywordDensity,
        headingStructure,
        imageOptimization: this.analyzeImageSEO(),
        performance: this.analyzePerformanceSEO(),
      },
    };
  }

  // Calculate keyword density
  private calculateKeywordDensity(content: string, keywords: string[]): Record<string, number> {
    const words = content.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    const density: Record<string, number> = {};

    keywords.forEach(keyword => {
      const keywordWords = keyword.toLowerCase().split(/\s+/);
      let count = 0;

      if (keywordWords.length === 1) {
        count = words.filter(word => word === keywordWords[0]).length;
      } else {
        // Multi-word keyword
        for (let i = 0; i <= words.length - keywordWords.length; i++) {
          const phrase = words.slice(i, i + keywordWords.length).join(' ');
          if (phrase === keyword.toLowerCase()) {
            count++;
          }
        }
      }

      density[keyword] = totalWords > 0 ? (count / totalWords) * 100 : 0;
    });

    return density;
  }

  // Extract heading structure
  private extractHeadingStructure(content: string): HeadingStructure[] {
    const headingRegex = /<h([1-6])(?:\s+id="([^"]*)")?[^>]*>([^<]+)<\/h[1-6]>/gi;
    const headings: HeadingStructure[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: parseInt(match[1] ?? '1'),
        text: (match[3] ?? '').trim(),
        id: match[2] ?? `heading-${headings.length}`,
      });
    }

    return headings;
  }

  // Analyze image SEO
  private analyzeImageSEO(): ImageSEOMetrics {
    const images = contentManager.getByType<ImageContent>('image');
    
    return {
      totalImages: images.length,
      imagesWithAlt: images.filter(img => img.alt && img.alt.trim().length > 0).length,
      imagesWithTitle: images.filter(img => img.metadata?.title).length,
      averageFileSize: 0, // File size not tracked in metadata
      formatDistribution: images.reduce((acc, img) => {
        const format = img.src.split('.').pop()?.toLowerCase() ?? 'unknown';
        acc[format] = (acc[format] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  // Analyze performance SEO
  private analyzePerformanceSEO(): PerformanceSEOMetrics {
    // In a real implementation, this would integrate with performance monitoring
    return {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
    };
  }

  // Update configuration
  updateConfig(updates: Partial<SEOConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // Get current configuration
  getConfig(): SEOConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const seoOptimizer = SEOOptimizer.getInstance();

// SEO utilities
export const SEOUtils = {
  // Generate sitemap entry
  generateSitemapEntry: (url: string, pageSEO: PageSEO = {}): string => {
    const {
      priority = 0.5,
      changefreq = 'weekly',
      lastmod = new Date().toISOString().split('T')[0],
    } = pageSEO;

    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  },

  // Generate robots.txt content
  generateRobotsTxt: (config: SEOConfig): string => {
    const { siteUrl, robots } = config;

    let robotsTxt = '';

    if (robots.index && robots.follow) {
      robotsTxt += 'User-agent: *\nAllow: /\n\n';
    } else {
      robotsTxt += 'User-agent: *\nDisallow: /\n\n';
    }

    // Add sitemap reference
    robotsTxt += `Sitemap: ${siteUrl}/sitemap.xml\n`;

    return robotsTxt;
  },

  // Validate SEO data
  validateSEO: (pageSEO: PageSEO): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (pageSEO.title && pageSEO.title.length > 60) {
      errors.push('Title exceeds 60 characters');
    }

    if (pageSEO.description && pageSEO.description.length > 160) {
      errors.push('Description exceeds 160 characters');
    }

    if (pageSEO.keywords && pageSEO.keywords.length > 10) {
      errors.push('Too many keywords (max 10 recommended)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData: (breadcrumbs: Array<{ name: string; url: string }>): Record<string, unknown> => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  },

  // Extract keywords from content
  extractKeywords: (content: string, maxKeywords = 10): string[] => {
    // Simple keyword extraction (in production, use more sophisticated NLP)
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const wordCount: Record<string, number> = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] ?? 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  },

  // Generate meta tags HTML
  generateMetaTags: (pageSEO: PageSEO, config: SEOConfig): string => {
    const tags: string[] = [];

    // Basic meta tags
    if (pageSEO.title) {
      tags.push(`<title>${pageSEO.title} | ${config.siteName}</title>`);
    }
    if (pageSEO.description) {
      tags.push(`<meta name="description" content="${pageSEO.description}" />`);
    }
    if (pageSEO.keywords) {
      tags.push(`<meta name="keywords" content="${pageSEO.keywords.join(', ')}" />`);
    }

    // Open Graph tags
    if (pageSEO.ogTitle) {
      tags.push(`<meta property="og:title" content="${pageSEO.ogTitle}" />`);
    }
    if (pageSEO.ogDescription) {
      tags.push(`<meta property="og:description" content="${pageSEO.ogDescription}" />`);
    }
    if (pageSEO.ogImage) {
      tags.push(`<meta property="og:image" content="${pageSEO.ogImage}" />`);
    }

    // Twitter tags
    if (pageSEO.twitterCard) {
      tags.push(`<meta name="twitter:card" content="${pageSEO.twitterCard}" />`);
    }
    if (pageSEO.twitterTitle) {
      tags.push(`<meta name="twitter:title" content="${pageSEO.twitterTitle}" />`);
    }

    // Robots
    if (pageSEO.noindex || pageSEO.nofollow) {
      const robotsContent = [
        pageSEO.noindex ? 'noindex' : 'index',
        pageSEO.nofollow ? 'nofollow' : 'follow',
      ].join(', ');
      tags.push(`<meta name="robots" content="${robotsContent}" />`);
    }

    return tags.join('\n');
  },
};
