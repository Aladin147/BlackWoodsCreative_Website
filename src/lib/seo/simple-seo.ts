/**
 * Simplified SEO System
 * 
 * A practical, focused SEO implementation for a portfolio website
 * that covers essential SEO needs without over-engineering.
 */

import { Metadata } from 'next';

// Essential SEO configuration
export interface SimpleSEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  twitterHandle?: string;
  locale: string;
}

// Page-specific SEO data
export interface PageSEO {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

// Default configuration for BlackWoods Creative
export const SIMPLE_SEO_CONFIG: SimpleSEOConfig = {
  siteName: 'BlackWoods Creative',
  siteUrl: 'https://blackwoodscreative.com',
  defaultTitle: "BlackWoods Creative | Morocco's Premier Creative Studio",
  defaultDescription: 'Professional video production, photography, and 3D visualization services in Morocco. Transform your vision into compelling visual stories.',
  defaultImage: '/assets/images/og-blackwoods-creative.jpg',
  twitterHandle: '@blackwoodscreative',
  locale: 'en_US',
};

// Simple SEO generator class
export class SimpleSEO {
  private config: SimpleSEOConfig;

  constructor(config: SimpleSEOConfig = SIMPLE_SEO_CONFIG) {
    this.config = config;
  }

  // Generate Next.js metadata
  generateMetadata(pageSEO: PageSEO = {}, path = ''): Metadata {
    const {
      title,
      description,
      image,
      canonical,
      noindex = false,
      type = 'website',
    } = pageSEO;

    const finalTitle = title ? `${title} | ${this.config.siteName}` : this.config.defaultTitle;
    const finalDescription = description ?? this.config.defaultDescription;
    const finalImage = image ?? this.config.defaultImage;
    const finalCanonical = canonical ?? `${this.config.siteUrl}${path}`;

    // Ensure images are absolute URLs
    const absoluteImage = finalImage.startsWith('http') 
      ? finalImage 
      : `${this.config.siteUrl}${finalImage}`;

    return {
      title: finalTitle,
      description: finalDescription,
      keywords: this.getDefaultKeywords(),
      
      // Canonical URL
      alternates: {
        canonical: finalCanonical,
      },

      // Open Graph
      openGraph: {
        title: finalTitle,
        description: finalDescription,
        url: finalCanonical,
        siteName: this.config.siteName,
        images: [
          {
            url: absoluteImage,
            width: 1200,
            height: 630,
            alt: finalTitle,
          },
        ],
        locale: this.config.locale,
        type: type,
      },

      // Twitter
      twitter: this.config.twitterHandle ? {
        card: 'summary_large_image',
        title: finalTitle,
        description: finalDescription,
        images: [absoluteImage],
        creator: this.config.twitterHandle,
        site: this.config.twitterHandle,
      } : null,

      // Robots
      robots: {
        index: !noindex,
        follow: !noindex,
        googleBot: {
          index: !noindex,
          follow: !noindex,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Additional metadata
      other: {
        'theme-color': '#1a1a1a',
      },
    };
  }

  // Get default keywords for the site
  private getDefaultKeywords(): string[] {
    return [
      'BlackWoods Creative',
      'video production Morocco',
      'photography Morocco',
      '3D visualization',
      'creative studio Morocco',
      'visual storytelling',
      'filmmaking Morocco',
      'professional photography',
      'architectural visualization',
      'corporate video',
      'Mohammedia',
      'Casablanca',
    ];
  }

  // Generate basic organization schema
  generateOrganizationSchema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.config.siteName,
      url: this.config.siteUrl,
      logo: `${this.config.siteUrl}/assets/icons/BLKWDS Creative Logo_Inverted.svg`,
      description: this.config.defaultDescription,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'MA',
        addressLocality: 'Mohammedia',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'hello@blackwoodscreative.com',
      },
      sameAs: [
        'https://instagram.com/blackwoodscreative',
        'https://linkedin.com/company/blackwoodscreative',
      ],
    };
  }

  // Generate local business schema
  generateLocalBusinessSchema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${this.config.siteUrl}/#organization`,
      name: this.config.siteName,
      url: this.config.siteUrl,
      description: this.config.defaultDescription,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'MA',
        addressLocality: 'Mohammedia',
        addressRegion: 'Casablanca-Settat',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 33.6866,
        longitude: -7.3833,
      },
      telephone: '+212-XXX-XXXXXX',
      email: 'hello@blackwoodscreative.com',
      priceRange: '$$',
      openingHours: 'Mo-Fr 09:00-18:00',
      serviceArea: {
        '@type': 'Country',
        name: 'Morocco',
      },
    };
  }

  // Generate website schema
  generateWebsiteSchema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.config.siteUrl}/#website`,
      url: this.config.siteUrl,
      name: this.config.siteName,
      description: this.config.defaultDescription,
      publisher: {
        '@id': `${this.config.siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.config.siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }
}

// Global instance
export const simpleSEO = new SimpleSEO();

// Utility functions for common use cases
export const SEOHelpers = {
  // Generate metadata for service pages
  servicePageSEO: (serviceName: string, description: string): PageSEO => ({
    title: `${serviceName} Services in Morocco`,
    description: `Professional ${serviceName.toLowerCase()} services in Morocco. ${description}`,
    canonical: `/services/${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
  }),

  // Generate metadata for portfolio pages
  portfolioPageSEO: (projectName: string, category: string): PageSEO => ({
    title: `${projectName} - ${category} Portfolio`,
    description: `${projectName} - Professional ${category.toLowerCase()} work by BlackWoods Creative in Morocco.`,
    canonical: `/portfolio/${projectName.toLowerCase().replace(/\s+/g, '-')}`,
    type: 'article',
  }),

  // Generate metadata for blog posts
  blogPageSEO: (title: string, excerpt: string, slug: string): PageSEO => ({
    title,
    description: excerpt,
    canonical: `/blog/${slug}`,
    type: 'article',
  }),

  // Generate basic sitemap entry
  generateSitemapEntry: (url: string, priority = 0.5, changefreq = 'monthly'): string => {
    const lastmod = new Date().toISOString().split('T')[0];
    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  },

  // Generate robots.txt content
  generateRobotsTxt: (): string => {
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SIMPLE_SEO_CONFIG.siteUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important assets
Allow: /assets/
Allow: /images/`;
  },
};

// Export for easy use
export default simpleSEO;
