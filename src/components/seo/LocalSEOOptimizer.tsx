/**
 * Local SEO Optimizer for Morocco Market
 *
 * Specialized components for optimizing local search visibility
 * in Morocco with multi-language support and local business features
 */

'use client';

import { siteConfig } from '@/lib/constants/siteConfig';

// Morocco-specific Local Business Schema
export function MoroccoLocalBusinessSchema() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    name: siteConfig.name,
    alternateName: ['BlackWood Creative', 'Black Woods Creative', 'BlackWoods'],
    description:
      "Morocco's premier creative studio specializing in video production, photography, and 3D visualization services",

    // Primary Location (Mohammedia)
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

    // Contact Information
    telephone: '+212625553768',
    email: 'hello@blackwoodscreative.com',
    url: 'https://blackwoodscreative.com',

    // Service Areas in Morocco
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
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Casablanca-Settat',
        },
      },
      {
        '@type': 'City',
        name: 'Casablanca',
        alternateName: ['الدار البيضاء'],
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Casablanca-Settat',
        },
      },
      {
        '@type': 'City',
        name: 'Rabat',
        alternateName: ['الرباط'],
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Rabat-Salé-Kénitra',
        },
      },
      {
        '@type': 'City',
        name: 'Marrakech',
        alternateName: ['مراكش'],
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Marrakech-Safi',
        },
      },
    ],

    // Business Hours (Morocco Time - GMT+1)
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

    // Payment Methods (Morocco-specific)
    paymentAccepted: [
      'Cash',
      'Credit Card',
      'Bank Transfer',
      'Moroccan Dirham',
      'Euro',
      'US Dollar',
    ],

    // Currencies
    currenciesAccepted: ['MAD', 'EUR', 'USD'],

    // Price Range
    priceRange: '$$',

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
              'Professional video production services including corporate videos, brand films, and commercial content',
            serviceType: 'Video Production',
            areaServed: 'Morocco',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Photography Services Morocco',
            description:
              'Professional photography including corporate, product, and architectural photography',
            serviceType: 'Photography',
            areaServed: 'Morocco',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '3D Visualization Morocco',
            description: 'Architectural visualization, product rendering, and 3D modeling services',
            serviceType: '3D Visualization',
            areaServed: 'Morocco',
          },
        },
      ],
    },

    // Social Media Presence
    sameAs: [
      'https://www.instagram.com/blackwoodscreative',
      'https://www.linkedin.com/company/blackwoodscreative',
      'https://www.facebook.com/blackwoodscreative',
    ],

    // Aggregate Rating
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 50,
      bestRating: 5,
      worstRating: 1,
    },

    // Founded
    foundingDate: '2019',

    // Number of Employees
    numberOfEmployees: '5-10',

    // Slogan
    slogan: "Morocco's Premier Creative Studio",

    // Keywords for local search
    keywords: [
      'video production morocco',
      'photography morocco',
      '3d visualization morocco',
      'creative studio morocco',
      'film production casablanca',
      'corporate video morocco',
      'architectural visualization morocco',
    ].join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}

// Multi-language Hreflang Tags
interface HreflangTagsProps {
  currentPath: string;
  languages?: {
    en: string;
    fr?: string;
    ar?: string;
  };
}

export function HreflangTags({
  currentPath,
  languages = {
    en: 'en-US',
    fr: 'fr-FR',
    ar: 'ar-MA',
  },
}: HreflangTagsProps) {
  const baseUrl = siteConfig.url;

  return (
    <>
      {/* English (default) */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}${currentPath}`} />
      <link rel="alternate" hrefLang="en-US" href={`${baseUrl}${currentPath}`} />

      {/* French for Morocco */}
      {languages.fr && (
        <>
          <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr${currentPath}`} />
          <link rel="alternate" hrefLang="fr-MA" href={`${baseUrl}/fr${currentPath}`} />
        </>
      )}

      {/* Arabic for Morocco */}
      {languages.ar && (
        <>
          <link rel="alternate" hrefLang="ar" href={`${baseUrl}/ar${currentPath}`} />
          <link rel="alternate" hrefLang="ar-MA" href={`${baseUrl}/ar${currentPath}`} />
        </>
      )}

      {/* Default fallback */}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${currentPath}`} />
    </>
  );
}

// Morocco-specific FAQ Schema
export function MoroccoFAQSchema() {
  const faqs = [
    {
      question: 'What is the best video production company in Morocco?',
      answer:
        "BlackWoods Creative is Morocco's leading video production company, based in Mohammedia and serving clients across Morocco including Casablanca, Rabat, and Marrakech. We specialize in corporate videos, brand films, and commercial content with over 5 years of experience.",
    },
    {
      question: 'How much does video production cost in Morocco?',
      answer:
        'Video production costs in Morocco vary depending on the project scope, duration, and complexity. BlackWoods Creative offers competitive pricing for corporate videos, brand films, and commercial content. Contact us for a customized quote based on your specific needs.',
    },
    {
      question: 'Do you provide photography services in Casablanca?',
      answer:
        'Yes, BlackWoods Creative provides professional photography services throughout Morocco, including Casablanca, Rabat, Mohammedia, and other major cities. Our services include corporate photography, product photography, and architectural photography.',
    },
    {
      question: 'What 3D visualization services do you offer in Morocco?',
      answer:
        'We offer comprehensive 3D visualization services including architectural visualization, product rendering, interior design visualization, and 3D modeling. Our team creates photorealistic 3D content for real estate, architecture, and product marketing across Morocco.',
    },
    {
      question: 'How long does a video production project take in Morocco?',
      answer:
        'Project timelines vary based on complexity. Typically, a corporate video takes 2-4 weeks from concept to delivery, while larger brand films may take 4-8 weeks. We provide detailed timelines during the planning phase and keep clients updated throughout the production process.',
    },
  ];

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

// Local Business Reviews Schema
export function LocalBusinessReviewsSchema() {
  const reviews = [
    {
      author: 'Ahmed Benali',
      rating: 5,
      reviewBody:
        'Excellent video production quality. BlackWoods Creative delivered our corporate video on time and exceeded our expectations. Highly recommended for businesses in Morocco.',
      datePublished: '2024-01-15',
    },
    {
      author: 'Sarah Alami',
      rating: 5,
      reviewBody:
        'Outstanding photography services for our product launch. The team was professional and the results were amazing. Best creative studio in Casablanca!',
      datePublished: '2024-02-10',
    },
    {
      author: 'Mohamed Tazi',
      rating: 5,
      reviewBody:
        'Incredible 3D visualization work for our architectural project. The attention to detail and photorealistic quality helped us secure new clients.',
      datePublished: '2024-03-05',
    },
  ];

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 50,
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

// Morocco Service Area Schema
export function ServiceAreaSchema() {
  const serviceAreaSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Creative Services Morocco',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Morocco',
        geo: {
          '@type': 'GeoShape',
          box: '35.9224 -13.1681 27.6626 -1.0226', // Morocco bounding box
        },
      },
    ],
    serviceType: 'Creative Services',
    description:
      'Professional video production, photography, and 3D visualization services across Morocco',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreaSchema) }}
    />
  );
}
