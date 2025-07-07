/**
 * Simple Structured Data Component
 * 
 * Essential structured data for SEO without over-engineering
 */

import { Metadata } from 'next';

import { simpleSEO } from '@/lib/seo/simple-seo';

interface SimpleStructuredDataProps {
  metadata?: Metadata;
  includeOrganization?: boolean;
  includeLocalBusiness?: boolean;
  includeWebsite?: boolean;
}

export function SimpleStructuredData({
  metadata: _metadata,
  includeOrganization = true,
  includeLocalBusiness = true,
  includeWebsite = true,
}: SimpleStructuredDataProps) {
  const schemas: Record<string, unknown>[] = [];

  // Add organization schema
  if (includeOrganization) {
    schemas.push(simpleSEO.generateOrganizationSchema());
  }

  // Add local business schema
  if (includeLocalBusiness) {
    schemas.push(simpleSEO.generateLocalBusinessSchema());
  }

  // Add website schema
  if (includeWebsite) {
    schemas.push(simpleSEO.generateWebsiteSchema());
  }

  // If no schemas to render, return null
  if (schemas.length === 0) {
    return null;
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          data-testid={index === 0 ? "structured-data" : `structured-data-${index}`}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

// Specific structured data components for common use cases
export function OrganizationSchema() {
  const schema = simpleSEO.generateOrganizationSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = simpleSEO.generateLocalBusinessSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

export function WebsiteSchema() {
  const schema = simpleSEO.generateWebsiteSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

// Simple FAQ schema for common questions
export function SimpleFAQSchema() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does BlackWoods Creative offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BlackWoods Creative offers professional video production, photography, 3D visualization, and creative services in Morocco.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is BlackWoods Creative located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BlackWoods Creative is based in Mohammedia, Morocco, and serves clients throughout Morocco and internationally.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I contact BlackWoods Creative?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can contact BlackWoods Creative through our website contact form, email at hello@blackwoodscreative.com, or phone.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  );
}

// Simple service schema
export function SimpleServiceSchema({ 
  serviceName, 
  description, 
  price 
}: { 
  serviceName: string; 
  description: string; 
  price?: string; 
}) {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description,
    provider: {
      '@type': 'Organization',
      name: 'BlackWoods Creative',
      url: 'https://blackwoodscreative.com',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Morocco',
    },
    ...(price && { offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'MAD',
    }}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(serviceSchema),
      }}
    />
  );
}

// Simple breadcrumb schema
export function SimpleBreadcrumbSchema({ 
  items 
}: { 
  items: Array<{ name: string; url: string }> 
}) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://blackwoodscreative.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema),
      }}
    />
  );
}

// Simple article schema for blog posts
export function SimpleArticleSchema({
  title,
  description,
  publishedDate,
  modifiedDate,
  authorName = 'BlackWoods Creative Team',
  imageUrl,
}: {
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishedDate,
    dateModified: modifiedDate ?? publishedDate,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BlackWoods Creative',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blackwoodscreative.com/assets/icons/BLKWDS Creative Logo_Inverted.svg',
      },
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema),
      }}
    />
  );
}

// Export all components
export default SimpleStructuredData;
