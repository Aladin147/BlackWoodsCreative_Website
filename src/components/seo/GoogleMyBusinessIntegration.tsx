/**
 * Google My Business Schema Integration
 *
 * Provides structured data that can be used to optimize
 * Google My Business profile and local search presence
 */

'use client';

import { siteConfig } from '@/lib/constants/siteConfig';

// Google My Business optimized schema
export function GoogleMyBusinessSchema() {
  const gmbSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.name,
    alternateName: ['BlackWood Creative', 'Black Woods Creative', 'BlackWoods'],
    description:
      "Morocco's premier creative studio specializing in video production, photography, and 3D visualization services. Serving Casablanca, Rabat, Mohammedia, and all of Morocco.",

    // Business Identity
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/images/logo/blackwoods-creative-logo.png`,
      width: 400,
      height: 400,
    },
    image: [
      `${siteConfig.url}/images/studio/blackwoods-creative-studio-mohammedia.jpg`,
      `${siteConfig.url}/images/portfolio/video-production-morocco-showcase.jpg`,
      `${siteConfig.url}/images/team/blackwoods-creative-team-morocco.jpg`,
    ],

    // Contact Information
    telephone: '+212625553768',
    email: 'hello@blackwoodscreative.com',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+212625553768',
        contactType: 'customer service',
        areaServed: 'Morocco',
        availableLanguage: ['English', 'French', 'Arabic'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      },
      {
        '@type': 'ContactPoint',
        telephone: '+212625553768',
        contactType: 'sales',
        areaServed: 'Morocco',
        availableLanguage: ['English', 'French'],
      },
    ],

    // Address and Location
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'MFADEL Business Center, Building O, Floor 5',
      addressLocality: 'Mohammedia',
      addressRegion: 'Casablanca-Settat',
      postalCode: '28810',
      addressCountry: 'MA',
    },

    // Geographic Coordinates
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.6866,
      longitude: -7.3833,
    },

    // Service Areas
    areaServed: [
      {
        '@type': 'Country',
        name: 'Morocco',
        alternateName: ['Maroc', 'المغرب'],
      },
      {
        '@type': 'City',
        name: 'Mohammedia',
        alternateName: ['محمدية'],
      },
      {
        '@type': 'City',
        name: 'Casablanca',
        alternateName: ['الدار البيضاء'],
      },
      {
        '@type': 'City',
        name: 'Rabat',
        alternateName: ['الرباط'],
      },
      {
        '@type': 'City',
        name: 'Marrakech',
        alternateName: ['مراكش'],
      },
    ],

    // Business Hours
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
        validFrom: '2024-01-01',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
        validFrom: '2024-01-01',
      },
    ],

    // Services Offered
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Creative Services Morocco',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Video Production Morocco',
            description:
              'Professional video production including corporate videos, brand films, and commercial content',
            category: 'Video Production',
            areaServed: 'Morocco',
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'MAD',
            price: 'Contact for quote',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Photography Services Morocco',
            description:
              'Professional photography including corporate, product, and architectural photography',
            category: 'Photography',
            areaServed: 'Morocco',
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'MAD',
            price: 'Contact for quote',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '3D Visualization Morocco',
            description: 'Architectural visualization, product rendering, and 3D modeling services',
            category: '3D Visualization',
            areaServed: 'Morocco',
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'MAD',
            price: 'Contact for quote',
          },
        },
      ],
    },

    // Business Details
    foundingDate: '2019',
    numberOfEmployees: '5-10',
    slogan: "Morocco's Premier Creative Studio",
    keywords: [
      'video production morocco',
      'photography morocco',
      '3d visualization morocco',
      'creative studio morocco',
      'film production casablanca',
      'corporate video morocco',
      'architectural visualization morocco',
    ].join(', '),

    // Payment and Currency
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
    currenciesAccepted: ['MAD', 'EUR', 'USD'],
    priceRange: '$$',

    // Social Media
    sameAs: [
      'https://www.instagram.com/blackwoodscreative',
      'https://www.linkedin.com/company/blackwoodscreative',
      'https://www.facebook.com/blackwoodscreative',
    ],

    // Reviews and Ratings
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 50,
      bestRating: 5,
      worstRating: 1,
    },

    // Awards and Recognition
    award: [
      'Best Creative Studio Morocco 2023',
      'Top Video Production Company Morocco',
      'Excellence in 3D Visualization',
    ],

    // Additional Business Information
    knowsAbout: [
      'Video Production',
      'Photography',
      '3D Visualization',
      'Brand Films',
      'Corporate Videos',
      'Architectural Visualization',
      'Product Photography',
      'Commercial Photography',
    ],

    // Parent Organization (if applicable)
    parentOrganization: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(gmbSchema) }}
    />
  );
}

// Google My Business Posts Schema (for dynamic content)
interface GMBPostProps {
  posts: Array<{
    title: string;
    content: string;
    image?: string;
    url?: string;
    datePublished: string;
    category: 'UPDATE' | 'EVENT' | 'OFFER' | 'PRODUCT';
  }>;
}

export function GoogleMyBusinessPostsSchema({ posts }: GMBPostProps) {
  const postsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'BlackWoods Creative Updates',
    description: 'Latest updates and news from BlackWoods Creative Morocco',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        headline: post.title,
        description: post.content,
        datePublished: post.datePublished,
        author: {
          '@type': 'Organization',
          name: siteConfig.name,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/images/logo/blackwoods-creative-logo.png`,
          },
        },
        ...(post.image && {
          image: {
            '@type': 'ImageObject',
            url: post.image,
          },
        }),
        ...(post.url && {
          url: post.url,
        }),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(postsSchema) }}
    />
  );
}

// NAP (Name, Address, Phone) consistency data for citations
export const NAPData = {
  name: siteConfig.name,
  alternateName: ['BlackWood Creative', 'Black Woods Creative', 'BlackWoods'],
  address: {
    street: 'MFADEL Business Center, Building O, Floor 5',
    city: 'Mohammedia',
    region: 'Casablanca-Settat',
    postalCode: '28810',
    country: 'Morocco',
    countryCode: 'MA',
  },
  phone: '+212625553768',
  email: 'hello@blackwoodscreative.com',
  website: siteConfig.url,
  coordinates: {
    latitude: 33.6866,
    longitude: -7.3833,
  },
  categories: [
    'Video Production Company',
    'Photography Studio',
    '3D Visualization Service',
    'Creative Agency',
    'Film Production Company',
    'Commercial Photography',
    'Architectural Visualization',
  ],
  serviceAreas: [
    'Morocco',
    'Mohammedia',
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Fez',
    'Tangier',
    'Agadir',
  ],
};
