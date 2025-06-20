import { Metadata } from 'next';

import { siteConfig } from '@/lib/constants/siteConfig';

interface StructuredDataProps {
  metadata: Metadata;
}

export function StructuredData({ metadata }: StructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: metadata.title?.toString() || siteConfig.name,
    description: metadata.description || siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.ogImage}`,
    sameAs: [
      'https://www.facebook.com/blackwoodscreative',
      'https://www.instagram.com/blackwoodscreative',
      'https://www.linkedin.com/company/blackwoodscreative',
      'https://twitter.com/blackwoodscreative',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'Customer Service',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
