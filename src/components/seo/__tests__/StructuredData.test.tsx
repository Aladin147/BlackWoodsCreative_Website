import { render } from '@testing-library/react';
import type { Metadata } from 'next';
import React from 'react';

import { StructuredData } from '../StructuredData';

// Mock siteConfig
jest.mock('@/lib/constants/siteConfig', () => ({
  siteConfig: {
    name: 'BlackWoods Creative',
    description:
      'Premium visual storytelling through filmmaking, photography, and 3D visualization.',
    url: 'https://blackwoodscreative.com',
    ogImage: '/assets/images/og-image.jpg',
  },
}));

describe('StructuredData', () => {
  const defaultMetadata: Metadata = {
    title: 'Test Page Title',
    description: 'Test page description',
  };

  it('renders without crashing', () => {
    render(<StructuredData metadata={defaultMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it('generates correct JSON-LD structure', () => {
    render(<StructuredData metadata={defaultMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Test Page Title',
      description: 'Test page description',
      url: 'https://blackwoodscreative.com',
      logo: 'https://blackwoodscreative.com/assets/images/og-image.jpg',
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
    });
  });

  it('uses siteConfig name when metadata title is missing', () => {
    const metadataWithoutTitle: Metadata = {
      description: 'Test page description',
    };

    render(<StructuredData metadata={metadataWithoutTitle} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.name).toBe('BlackWoods Creative');
  });

  it('uses siteConfig description when metadata description is missing', () => {
    const metadataWithoutDescription: Metadata = {
      title: 'Test Page Title',
    };

    render(<StructuredData metadata={metadataWithoutDescription} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.description).toBe(
      'Premium visual storytelling through filmmaking, photography, and 3D visualization.'
    );
  });

  it('handles string title correctly', () => {
    const metadataWithStringTitle: Metadata = {
      title: 'Simple String Title',
      description: 'Test description',
    };

    render(<StructuredData metadata={metadataWithStringTitle} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.name).toBe('Simple String Title');
  });

  it('handles object title correctly', () => {
    const metadataWithObjectTitle: Metadata = {
      title: {
        default: 'Default Title',
        template: '%s | BlackWoods Creative',
      },
      description: 'Test description',
    };

    render(<StructuredData metadata={metadataWithObjectTitle} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.name).toBe('[object Object]'); // toString() behavior
  });

  it('includes all required schema.org properties', () => {
    render(<StructuredData metadata={defaultMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd).toHaveProperty('@context', 'https://schema.org');
    expect(jsonLd).toHaveProperty('@type', 'Organization');
    expect(jsonLd).toHaveProperty('name');
    expect(jsonLd).toHaveProperty('description');
    expect(jsonLd).toHaveProperty('url');
    expect(jsonLd).toHaveProperty('logo');
    expect(jsonLd).toHaveProperty('sameAs');
    expect(jsonLd).toHaveProperty('contactPoint');
  });

  it('includes correct social media links', () => {
    render(<StructuredData metadata={defaultMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.sameAs).toEqual([
      'https://www.facebook.com/blackwoodscreative',
      'https://www.instagram.com/blackwoodscreative',
      'https://www.linkedin.com/company/blackwoodscreative',
      'https://twitter.com/blackwoodscreative',
    ]);
    expect(jsonLd.sameAs).toHaveLength(4);
  });

  it('includes correct contact point information', () => {
    render(<StructuredData metadata={defaultMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.contactPoint).toEqual({
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'Customer Service',
    });
  });

  it('generates valid JSON', () => {
    render(<StructuredData metadata={defaultMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonContent = script?.innerHTML || '';

    expect(() => JSON.parse(jsonContent)).not.toThrow();
  });

  it('uses correct MIME type for script tag', () => {
    render(<StructuredData metadata={defaultMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toHaveAttribute('type', 'application/ld+json');
  });

  it('constructs logo URL correctly', () => {
    render(<StructuredData metadata={defaultMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.logo).toBe('https://blackwoodscreative.com/assets/images/og-image.jpg');
  });

  it('uses siteConfig URL correctly', () => {
    render(<StructuredData metadata={defaultMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.url).toBe('https://blackwoodscreative.com');
  });

  it('handles empty metadata gracefully', () => {
    const emptyMetadata: Metadata = {};

    render(<StructuredData metadata={emptyMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.name).toBe('BlackWoods Creative');
    expect(jsonLd.description).toBe(
      'Premium visual storytelling through filmmaking, photography, and 3D visualization.'
    );
  });

  it('handles null metadata properties gracefully', () => {
    const nullMetadata: Metadata = {
      title: null,
      description: null,
    };

    render(<StructuredData metadata={nullMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.name).toBe('BlackWoods Creative');
    expect(jsonLd.description).toBe(
      'Premium visual storytelling through filmmaking, photography, and 3D visualization.'
    );
  });

  it('handles undefined metadata properties gracefully', () => {
    const undefinedMetadata: Metadata = {
      title: undefined,
      description: undefined,
    };

    render(<StructuredData metadata={undefinedMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.name).toBe('BlackWoods Creative');
    expect(jsonLd.description).toBe(
      'Premium visual storytelling through filmmaking, photography, and 3D visualization.'
    );
  });

  it('renders only one script tag', () => {
    render(<StructuredData metadata={defaultMetadata} />);

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
  });

  it('does not include any other HTML elements', () => {
    const { container } = render(<StructuredData metadata={defaultMetadata} />);

    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild?.tagName).toBe('SCRIPT');
  });

  it('maintains consistent JSON structure across renders', () => {
    const { rerender } = render(<StructuredData metadata={defaultMetadata} />);

    const firstScript = document.querySelector('script[type="application/ld+json"]');
    const firstJsonLd = JSON.parse(firstScript?.innerHTML || '{}');

    rerender(<StructuredData metadata={defaultMetadata} />);

    const secondScript = document.querySelector('script[type="application/ld+json"]');
    const secondJsonLd = JSON.parse(secondScript?.innerHTML || '{}');

    expect(firstJsonLd).toEqual(secondJsonLd);
  });

  it('updates when metadata changes', () => {
    const { rerender } = render(<StructuredData metadata={defaultMetadata} />);

    const newMetadata: Metadata = {
      title: 'Updated Title',
      description: 'Updated description',
    };

    rerender(<StructuredData metadata={newMetadata} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonLd = JSON.parse(script?.innerHTML || '{}');

    expect(jsonLd.name).toBe('Updated Title');
    expect(jsonLd.description).toBe('Updated description');
  });

  it('escapes special characters in JSON correctly', () => {
    const metadataWithSpecialChars: Metadata = {
      title: 'Title with "quotes" and \\backslashes\\',
      description: 'Description with <tags> and & symbols',
    };

    render(<StructuredData metadata={metadataWithSpecialChars} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    const jsonContent = script?.innerHTML || '';

    expect(() => JSON.parse(jsonContent)).not.toThrow();

    const jsonLd = JSON.parse(jsonContent);
    expect(jsonLd.name).toBe('Title with "quotes" and \\backslashes\\');
    expect(jsonLd.description).toBe('Description with <tags> and & symbols');
  });
});
