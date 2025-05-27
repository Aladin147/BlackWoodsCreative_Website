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
    sameAs: [
      siteConfig.links.instagram,
      siteConfig.links.linkedin,
    ],
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

export function generatePortfolioStructuredData(projects: Array<{
  title: string;
  description: string;
  image: string;
  year?: number;
  category: string;
  tags?: string[];
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'BlackWoods Creative Portfolio',
    description: 'Professional portfolio showcasing filmmaking, photography, and 3D visualization work',
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
