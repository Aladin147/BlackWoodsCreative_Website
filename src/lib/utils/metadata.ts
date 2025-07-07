import { Metadata } from 'next';

// Enhanced SEO metadata interface for AI-first optimization
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  featuredSnippet?: {
    question: string;
    answer: string; // 40-55 words for optimal featured snippet
  };
  localBusiness?: {
    service: string;
    location: string;
    priceRange?: string;
  };
  structuredData?: Record<string, unknown>;
  canonicalUrl?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article' | 'service';
  };
}

/**
 * Generate Next.js metadata from SEO data
 * Server-side utility for static metadata generation
 */
export function generatePageMetadata(seoData: SEOMetadata): Metadata {
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords ?? null,
    openGraph: {
      title: seoData.openGraph?.title ?? seoData.title,
      description: seoData.openGraph?.description ?? seoData.description,
      type:
        seoData.openGraph?.type === 'service' ? 'website' : (seoData.openGraph?.type ?? 'website'),
      locale: 'en_US',
      siteName: 'BlackWoods Creative',
      ...(seoData.openGraph?.image && { images: [{ url: seoData.openGraph.image }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
    },
    alternates: {
      canonical: seoData.canonicalUrl
        ? `https://blackwoodscreative.com${seoData.canonicalUrl}`
        : null,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
