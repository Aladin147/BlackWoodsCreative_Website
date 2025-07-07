/**
 * SEO Components Tests
 *
 * Basic tests to ensure new SEO components render without errors
 */

import { render } from '@testing-library/react';

import { FAQSchema, ServiceSchema, BreadcrumbSchema } from '../EnhancedSchemaMarkup';
import { GoogleMyBusinessSchema } from '../GoogleMyBusinessIntegration';
import {
  MoroccoLocalBusinessSchema,
  MoroccoFAQSchema,
  LocalBusinessReviewsSchema,
} from '../LocalSEOOptimizer';

// Mock siteConfig
jest.mock('@/lib/constants/siteConfig', () => ({
  siteConfig: {
    name: 'BlackWoods Creative',
    url: 'https://blackwoodscreative.com',
    description: 'Test description',
    services: [
      { name: 'Video Production', description: 'Test service' },
      { name: 'Photography', description: 'Test service' },
    ],
    links: {
      phone: '+212625553768',
      email: 'hello@blackwoodscreative.com',
      instagram: 'https://instagram.com/test',
      linkedin: 'https://linkedin.com/test',
      github: 'https://github.com/test',
    },
  },
}));

describe('SEO Schema Components', () => {
  test('MoroccoLocalBusinessSchema renders without errors', () => {
    const { container } = render(<MoroccoLocalBusinessSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script?.textContent ?? '{}');
    expect(schemaData['@type']).toContain('LocalBusiness');
    expect(schemaData.name).toBe('BlackWoods Creative');
  });

  test('MoroccoFAQSchema renders without errors', () => {
    const { container } = render(<MoroccoFAQSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script?.textContent ?? '{}');
    expect(schemaData['@type']).toBe('FAQPage');
    expect(schemaData.mainEntity).toBeInstanceOf(Array);
  });

  test('LocalBusinessReviewsSchema renders without errors', () => {
    const { container } = render(<LocalBusinessReviewsSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script?.textContent ?? '{}');
    expect(schemaData['@type']).toBe('Organization');
    expect(schemaData.aggregateRating).toBeDefined();
  });

  test('GoogleMyBusinessSchema renders without errors', () => {
    const { container } = render(<GoogleMyBusinessSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script?.textContent ?? '{}');
    expect(schemaData['@type']).toContain('LocalBusiness');
    expect(schemaData.address).toBeDefined();
  });

  test('FAQSchema renders with provided data', () => {
    const testFAQs = [
      {
        question: 'Test question?',
        answer: 'Test answer.',
      },
    ];

    const { container } = render(<FAQSchema faqs={testFAQs} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script?.textContent ?? '{}');
    expect(schemaData['@type']).toBe('FAQPage');
    expect(schemaData.mainEntity).toHaveLength(1);
    expect(schemaData.mainEntity[0].name).toBe('Test question?');
  });

  test('ServiceSchema renders with provided data', () => {
    const { container } = render(
      <ServiceSchema
        serviceName="Video Production Morocco"
        description="Test service description"
        serviceType="Video Production"
        areaServed={['Morocco', 'Casablanca']}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script?.textContent ?? '{}');
    expect(schemaData['@type']).toBe('Service');
    expect(schemaData.name).toBe('Video Production Morocco');
    expect(schemaData.areaServed).toHaveLength(2);
  });

  test('BreadcrumbSchema renders with provided data', () => {
    const testBreadcrumbs = [
      { name: 'Home', url: 'https://example.com' },
      { name: 'Services', url: 'https://example.com/services' },
    ];

    const { container } = render(<BreadcrumbSchema items={testBreadcrumbs} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script?.textContent ?? '{}');
    expect(schemaData['@type']).toBe('BreadcrumbList');
    expect(schemaData.itemListElement).toHaveLength(2);
  });
});

describe('SEO Utility Functions', () => {
  test('Schema components handle empty data gracefully', () => {
    const { container } = render(<FAQSchema faqs={[]} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script?.textContent ?? '{}');
    expect(schemaData.mainEntity).toHaveLength(0);
  });

  test('ServiceSchema handles minimal data', () => {
    const { container } = render(
      <ServiceSchema
        serviceName="Test Service"
        description="Test description"
        serviceType="Test"
        areaServed={[]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const schemaData = JSON.parse(script?.textContent ?? '{}');
    expect(schemaData.name).toBe('Test Service');
    expect(schemaData.areaServed).toHaveLength(0);
  });
});
