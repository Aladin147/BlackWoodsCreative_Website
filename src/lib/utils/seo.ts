import { Metadata } from 'next';

import { siteConfig } from '@/lib/constants/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateSEO({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  type = 'website',
  publishedTime,
  modifiedTime,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const fullUrl = url.startsWith('http') ? url : `${siteConfig.url}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@blackwoodscreative',
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
    alternates: {
      canonical: fullUrl,
    },
  };
}

export function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.links.email,
      telephone: siteConfig.links.phone,
      contactType: 'customer service',
    },
    sameAs: [siteConfig.links.instagram, siteConfig.links.linkedin],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    founder: {
      '@type': 'Person',
      name: 'BlackWoods Creative Team',
    },
    foundingDate: '2020',
    numberOfEmployees: '5-10',
    industry: 'Creative Services',
    services: siteConfig.services.map(service => ({
      '@type': 'Service',
      name: service.name,
      description: service.description,
    })),
  };
}

export function generatePortfolioStructuredData(
  projects: Array<{
    title: string;
    description: string;
    image: string;
    year?: number;
    category: string;
    tags?: string[];
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'BlackWoods Creative Portfolio',
    description:
      'Professional portfolio showcasing filmmaking, photography, and 3D visualization work',
    creator: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    workExample: projects.map(project => ({
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      image: project.image,
      creator: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
      dateCreated: project.year?.toString(),
      genre: project.category,
      keywords: project.tags?.join(', '),
    })),
  };
}

// ===== COMPREHENSIVE MISSPELLING SEO STRATEGY =====

// Comprehensive BlackWoods brand variations for maximum search coverage
export const BLACKWOODS_BRAND_VARIATIONS = [
  // Primary brand names
  'BlackWoods Creative',
  'BlackWood Creative',
  'BlackWoods',
  'BlackWood',

  // Capitalization variations
  'Blackwood Creative',
  'Blackwoods Creative',
  'blackwoods creative',
  'blackwood creative',

  // Spacing variations
  'Black Woods Creative',
  'Black Wood Creative',
  'Black Woods',
  'Black Wood',

  // Abbreviation variations
  'BLKWDS Creative',
  'BLKWDS',
  'BWC',

  // Common misspellings
  'Blckwoods Creative',
  'Blckwood Creative',
  'Blackwods Creative',
  'Blackwod Creative',
  'Blakwoods Creative',
  'Blakwood Creative',

  // Location-based variations
  'BlackWoods Morocco',
  'Blackwood Morocco',
  'Black Woods Morocco',
  'BLKWDS Morocco',

  // Service-based variations
  'BlackWoods Video',
  'BlackWoods Film',
  'BlackWoods Photo',
  'BlackWoods 3D',
  'Blackwood Video',
  'Blackwood Film',
];

// Enhanced Organization Schema with comprehensive misspelling coverage
export function generateEnhancedOrganizationSchema(additionalData?: Record<string, unknown>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BlackWoods Creative',
    alternateName: BLACKWOODS_BRAND_VARIATIONS,
    description:
      "Morocco's premier creative studio specializing in video production, photography, and 3D visualization",
    url: 'https://blackwoodscreative.com',
    logo: 'https://blackwoodscreative.com/assets/icons/BLKWDS Creative Logo_Inverted.svg',
    foundingDate: '2019',
    foundingLocation: {
      '@type': 'Place',
      name: 'Mohammedia, Morocco',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mohammedia',
      addressRegion: 'Casablanca-Settat',
      addressCountry: 'Morocco',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+212-625-55-37-68',
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Arabic'],
    },
    sameAs: ['https://blackwoodscreative.com', 'https://www.blackwoodscreative.com'],
    serviceArea: {
      '@type': 'Place',
      name: 'Morocco',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'BlackWoods Creative Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Video Production',
            description:
              'Professional video production services including corporate videos, brand films, and commercial content',
            provider: {
              '@type': 'Organization',
              name: 'BlackWoods Creative',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Photography',
            description:
              'Professional photography services including commercial, product, and corporate photography',
            provider: {
              '@type': 'Organization',
              name: 'BlackWoods Creative',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '3D Visualization',
            description: '3D modeling, rendering, and architectural visualization services',
            provider: {
              '@type': 'Organization',
              name: 'BlackWoods Creative',
            },
          },
        },
      ],
    },
    keywords: BLACKWOODS_BRAND_VARIATIONS.join(', '),
    knowsAbout: [
      'Video Production',
      'Photography',
      '3D Visualization',
      'Brand Films',
      'Corporate Videos',
      'Commercial Photography',
      'Architectural Visualization',
      'Visual Storytelling',
      'Creative Services Morocco',
    ],
    ...additionalData,
  };

  return {
    __html: JSON.stringify(schema),
  };
}

// Common misspelling patterns for redirect generation
export const MISSPELLING_PATTERNS = {
  // Domain-level misspellings
  domains: [
    'blackwood',
    'blackwods',
    'blckwoods',
    'blakwoods',
    'black-woods',
    'black-wood',
    'blkwds',
  ],

  // Path-level misspellings
  paths: [
    '/blackwood',
    '/blackwods',
    '/blckwoods',
    '/blakwoods',
    '/black-woods',
    '/black-wood',
    '/blkwds',
    '/bwc',
    '/blackwoods-creative',
    '/blackwood-creative',
  ],

  // Service-specific misspellings
  services: [
    '/blackwood-video',
    '/blackwood-film',
    '/blackwood-photo',
    '/blackwood-3d',
    '/blkwds-video',
    '/blkwds-film',
  ],
};

// SEO-optimized meta keywords for brand variations
export function generateBrandKeywords(additionalKeywords: string[] = []): string[] {
  return [
    ...BLACKWOODS_BRAND_VARIATIONS,
    ...additionalKeywords,
    // Service combinations
    ...BLACKWOODS_BRAND_VARIATIONS.slice(0, 10).map(brand => `${brand} video production`),
    ...BLACKWOODS_BRAND_VARIATIONS.slice(0, 10).map(brand => `${brand} photography`),
    ...BLACKWOODS_BRAND_VARIATIONS.slice(0, 10).map(brand => `${brand} 3D visualization`),
  ];
}
