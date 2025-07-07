/**
 * Enhanced Schema Markup Components
 *
 * Comprehensive structured data implementation for better search visibility
 * and rich snippets in Google search results
 */

'use client';

import { siteConfig } from '@/lib/constants/siteConfig';

// FAQ Schema Component
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

// Service Schema Component
interface ServiceSchemaProps {
  serviceName: string;
  description: string;
  serviceType: string;
  areaServed: string[];
  priceRange?: string;
  provider?: {
    name: string;
    url: string;
  };
}

export function ServiceSchema({
  serviceName,
  description,
  serviceType,
  areaServed,
  priceRange = '$$',
  provider = {
    name: siteConfig.name,
    url: siteConfig.url,
  },
}: ServiceSchemaProps) {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description,
    serviceType,
    provider: {
      '@type': 'Organization',
      name: provider.name,
      url: provider.url,
    },
    areaServed: areaServed.map(area => ({
      '@type': 'Place',
      name: area,
    })),
    priceRange,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${serviceName} Services`,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: serviceName,
            description,
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}

// Review/Rating Schema Component
interface ReviewSchemaProps {
  reviews: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>;
  aggregateRating: {
    ratingValue: number;
    reviewCount: number;
  };
}

export function ReviewSchema({ reviews, aggregateRating }: ReviewSchemaProps) {
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
    />
  );
}

// Breadcrumb Schema Component
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

// Enhanced Local Business Schema
interface LocalBusinessSchemaProps {
  businessType?: string;
  priceRange?: string;
  paymentAccepted?: string[];
  currenciesAccepted?: string[];
  openingHours?: string[];
  specialOffers?: string;
  awards?: string[];
  foundingDate?: string;
  numberOfEmployees?: string;
  slogan?: string;
}

export function EnhancedLocalBusinessSchema({
  businessType = 'ProfessionalService',
  priceRange = '$$',
  paymentAccepted = ['Cash', 'Credit Card', 'Bank Transfer'],
  currenciesAccepted = ['MAD', 'EUR', 'USD'],
  openingHours = ['Mo-Fr 09:00-18:00', 'Sa 10:00-16:00'],
  specialOffers,
  awards = [],
  foundingDate = '2019',
  numberOfEmployees = '5-10',
  slogan = 'Crafting Visual Stories That Captivate',
}: LocalBusinessSchemaProps = {}) {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', businessType],
    name: siteConfig.name,
    description: siteConfig.description,
    slogan,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.ogImage}`,
    foundingDate,
    numberOfEmployees,

    // Contact Information
    telephone: siteConfig.links.phone,
    email: siteConfig.links.email,

    // Address
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'MFADEL Business Center, Building O, Floor 5',
      addressLocality: 'Mohammedia',
      addressRegion: 'Casablanca-Settat',
      addressCountry: 'Morocco',
      postalCode: '28810',
    },

    // Geographic coordinates (approximate for Mohammedia)
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.6866,
      longitude: -7.3833,
    },

    // Service Areas
    areaServed: [
      {
        '@type': 'Place',
        name: 'Morocco',
      },
      {
        '@type': 'City',
        name: 'Mohammedia',
        containedInPlace: {
          '@type': 'Country',
          name: 'Morocco',
        },
      },
      {
        '@type': 'City',
        name: 'Casablanca',
        containedInPlace: {
          '@type': 'Country',
          name: 'Morocco',
        },
      },
      {
        '@type': 'City',
        name: 'Rabat',
        containedInPlace: {
          '@type': 'Country',
          name: 'Morocco',
        },
      },
    ],

    // Business Details
    priceRange,
    paymentAccepted,
    currenciesAccepted,
    openingHoursSpecification: openingHours
      .map(hours => {
        const [days, time] = hours.split(' ');
        if (!time || !days) return null;
        const [open, close] = time.split('-');

        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: days.split('-').map(day => {
            const dayMap: Record<string, string> = {
              Mo: 'Monday',
              Tu: 'Tuesday',
              We: 'Wednesday',
              Th: 'Thursday',
              Fr: 'Friday',
              Sa: 'Saturday',
              Su: 'Sunday',
            };
            return dayMap[day] ?? day;
          }),
          opens: open,
          closes: close,
        };
      })
      .filter(Boolean),

    // Services Offered
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Creative Services',
      itemListElement: siteConfig.services.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
        },
      })),
    },

    // Social Media
    sameAs: [siteConfig.links.instagram, siteConfig.links.linkedin, siteConfig.links.github],

    // Awards and Recognition
    ...(awards.length > 0 && {
      award: awards,
    }),

    // Special Offers
    ...(specialOffers && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Special Offers',
        description: specialOffers,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}

// Portfolio/Creative Work Schema
interface CreativeWorkSchemaProps {
  works: Array<{
    name: string;
    description: string;
    image: string;
    dateCreated: string;
    genre: string;
    keywords: string[];
    client?: string;
  }>;
}

export function CreativeWorkSchema({ works }: CreativeWorkSchemaProps) {
  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${siteConfig.name} Portfolio`,
    description:
      'Professional portfolio showcasing filmmaking, photography, and 3D visualization work',
    creator: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    workExample: works.map(work => ({
      '@type': 'CreativeWork',
      name: work.name,
      description: work.description,
      image: work.image,
      dateCreated: work.dateCreated,
      genre: work.genre,
      keywords: work.keywords.join(', '),
      creator: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
      ...(work.client && {
        sponsor: {
          '@type': 'Organization',
          name: work.client,
        },
      }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
    />
  );
}
