/**
 * SEO React Components
 *
 * Reusable components for SEO optimization
 */

'use client';

import { useState, useEffect, ReactNode } from 'react';

import Head from 'next/head';
import Script from 'next/script';

import {
  usePageSEO,
  useBreadcrumbs,
  useStructuredData,
  useSocialMeta,
  useLocalSEO,
} from '@/lib/seo/hooks';
import { PageSEO } from '@/lib/seo/optimization';

// SEO Head component
export function SEOHead({ pageSEO = {}, children }: { pageSEO?: PageSEO; children?: ReactNode }) {
  const { metadata } = usePageSEO(pageSEO);
  const socialMeta = useSocialMeta(pageSEO);

  return (
    <Head>
      {/* Basic meta tags */}
      <title>{metadata.title as string}</title>
      <meta name="description" content={metadata.description as string} />
      {metadata.keywords && <meta name="keywords" content={metadata.keywords as string} />}

      {/* Canonical URL */}
      {metadata.alternates?.canonical && (
        <link
          rel="canonical"
          href={
            typeof metadata.alternates.canonical === 'string'
              ? metadata.alternates.canonical
              : metadata.alternates.canonical.toString()
          }
        />
      )}

      {/* Open Graph tags */}
      {Object.entries(socialMeta).map(([key, value]) => {
        if (key.startsWith('og:')) {
          return <meta key={key} property={key} content={value as string} />;
        }
        if (key.startsWith('twitter:')) {
          return <meta key={key} name={key} content={value as string} />;
        }
        return null;
      })}

      {/* Robots */}
      {metadata.robots && (
        <meta
          name="robots"
          content={
            typeof metadata.robots === 'string'
              ? metadata.robots
              : `${metadata.robots.index ? 'index' : 'noindex'}, ${metadata.robots.follow ? 'follow' : 'nofollow'}`
          }
        />
      )}

      {/* Theme color */}
      {metadata.other?.['theme-color'] && (
        <meta name="theme-color" content={metadata.other['theme-color'] as string} />
      )}

      {/* Alternate languages */}
      {metadata.alternates?.languages &&
        Object.entries(metadata.alternates.languages).map(([locale, url]) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={typeof url === 'string' ? url : (url?.toString() ?? '')}
          />
        ))}

      {children}
    </Head>
  );
}

// Structured data component
export function StructuredData({ type, data }: { type: string; data: Record<string, unknown> }) {
  useStructuredData(type, data);

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }}
    />
  );
}

// Breadcrumbs component
export function Breadcrumbs({
  customBreadcrumbs,
  className = '',
  showStructuredData = true,
}: {
  customBreadcrumbs?: Array<{ name: string; url: string }>;
  className?: string;
  showStructuredData?: boolean;
}) {
  const { breadcrumbs, structuredData } = useBreadcrumbs(customBreadcrumbs);

  return (
    <>
      {showStructuredData && <StructuredData type="BreadcrumbList" data={structuredData} />}

      <nav className={`breadcrumbs ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.url} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-900" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <a href={crumb.url} className="transition-colors hover:text-blue-600">
                  {crumb.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Organization structured data
export function OrganizationStructuredData() {
  const organizationData = {
    name: 'BlackWoods Creative',
    url: 'https://blackwoodscreative.com',
    logo: 'https://blackwoodscreative.com/images/logo.png',
    description:
      'Professional visual storytelling agency specializing in filmmaking, photography, 3D visualization, and scene creation.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mohammedia',
      addressCountry: 'MA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+212-XXX-XXXXXX',
      contactType: 'customer service',
      areaServed: 'MA',
      availableLanguage: ['English', 'French', 'Arabic'],
    },
    sameAs: [
      'https://instagram.com/blackwoodscreative',
      'https://linkedin.com/company/blackwoodscreative',
    ],
    foundingDate: '2020',
    numberOfEmployees: '5-10',
    slogan: 'Transform your vision into compelling visual narratives',
  };

  return <StructuredData type="Organization" data={organizationData} />;
}

// Website structured data
export function WebsiteStructuredData() {
  const websiteData = {
    name: 'BlackWoods Creative',
    url: 'https://blackwoodscreative.com',
    description:
      'Professional visual storytelling services including filmmaking, photography, 3D visualization, and scene creation.',
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://blackwoodscreative.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return <StructuredData type="WebSite" data={websiteData} />;
}

// Local business structured data
export function LocalBusinessStructuredData() {
  const businessData = {
    name: 'BlackWoods Creative',
    address: 'Mohammedia, Morocco',
    city: 'Mohammedia',
    country: 'Morocco',
    phone: '+212-XXX-XXXXXX',
    businessType: 'Creative Agency',
  };

  const { structuredData } = useLocalSEO(businessData);

  return <StructuredData type="LocalBusiness" data={structuredData} />;
}

// Service structured data
export function ServiceStructuredData({
  serviceName,
  description,
  price,
}: {
  serviceName: string;
  description: string;
  price?: string;
}) {
  const serviceData = {
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
    serviceType: 'Creative Services',
    ...(price && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'USD',
      },
    }),
  };

  return <StructuredData type="Service" data={serviceData} />;
}

// Article structured data (for blog posts)
export function ArticleStructuredData({
  title,
  description,
  author,
  publishDate,
  modifiedDate,
  image,
  url,
}: {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
}) {
  const articleData = {
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BlackWoods Creative',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blackwoodscreative.com/images/logo.png',
      },
    },
    datePublished: publishDate,
    dateModified: modifiedDate ?? publishDate,
    mainEntityOfPage: url,
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
      },
    }),
  };

  return <StructuredData type="Article" data={articleData} />;
}

// FAQ structured data
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const faqData = {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <StructuredData type="FAQPage" data={faqData} />;
}

// Creative work structured data (for portfolio items)
export function CreativeWorkStructuredData({
  name,
  description,
  creator,
  dateCreated,
  image,
  genre,
}: {
  name: string;
  description: string;
  creator: string;
  dateCreated: string;
  image?: string;
  genre?: string;
}) {
  const creativeWorkData = {
    name,
    description,
    creator: {
      '@type': 'Organization',
      name: creator,
    },
    dateCreated,
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
      },
    }),
    ...(genre && { genre }),
  };

  return <StructuredData type="CreativeWork" data={creativeWorkData} />;
}

// SEO analytics component (for development)
export function SEOAnalytics({ showInProduction = false }: { showInProduction?: boolean }) {
  const [loadTime, setLoadTime] = useState<string>('');

  useEffect(() => {
    // Set load time only on client to prevent hydration mismatch
    setLoadTime(new Date().toLocaleTimeString());
  }, []);

  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-black p-4 text-xs text-white">
      <h4 className="mb-2 font-bold">SEO Debug Info</h4>
      <div className="space-y-1">
        <div>Environment: {process.env.NODE_ENV}</div>
        <div>Page loaded: {loadTime || 'Loading...'}</div>
        <div className="text-yellow-300">⚠️ Remove in production</div>
      </div>
    </div>
  );
}
