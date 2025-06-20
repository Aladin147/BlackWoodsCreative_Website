import { siteConfig } from '@/lib/constants/siteConfig';

import { generateSEO, generateStructuredData, generatePortfolioStructuredData } from '../seo';

// Mock the siteConfig
jest.mock('@/lib/constants/siteConfig', () => ({
  siteConfig: {
    name: 'BlackWoods Creative',
    description:
      'Premium visual storytelling through filmmaking, photography, and 3D visualization.',
    url: 'https://blackwoodscreative.com',
    ogImage: '/assets/images/og-image.jpg',
    links: {
      email: 'hello@blackwoodscreative.com',
      phone: '+1-555-0123',
      instagram: 'https://instagram.com/blackwoodscreative',
      linkedin: 'https://linkedin.com/company/blackwoodscreative',
    },
    services: [
      {
        name: 'Filmmaking',
        description: 'Professional video production and cinematography',
      },
      {
        name: 'Photography',
        description: 'Commercial and artistic photography services',
      },
      {
        name: '3D Visualization',
        description: 'Advanced 3D modeling and rendering',
      },
    ],
  },
}));

describe('generateSEO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates basic SEO metadata with defaults', () => {
    const result = generateSEO();

    expect(result.title).toBe(siteConfig.name);
    expect(result.description).toBe(siteConfig.description);
    expect(result.openGraph?.title).toBe(siteConfig.name);
    expect(result.openGraph?.description).toBe(siteConfig.description);
    expect(result.openGraph?.url).toBe(siteConfig.url);
    expect(result.openGraph?.siteName).toBe(siteConfig.name);
  });

  it('generates SEO metadata with custom title', () => {
    const customTitle = 'About Us';
    const result = generateSEO({ title: customTitle });

    expect(result.title).toBe(`${customTitle} | ${siteConfig.name}`);
    expect(result.openGraph?.title).toBe(`${customTitle} | ${siteConfig.name}`);
  });

  it('generates SEO metadata with custom description', () => {
    const customDescription = 'Custom description for this page';
    const result = generateSEO({ description: customDescription });

    expect(result.description).toBe(customDescription);
    expect(result.openGraph?.description).toBe(customDescription);
    expect(result.twitter?.description).toBe(customDescription);
  });

  it('handles absolute URLs correctly', () => {
    const absoluteUrl = 'https://example.com/page';
    const result = generateSEO({ url: absoluteUrl });

    expect(result.openGraph?.url).toBe(absoluteUrl);
    expect(result.alternates?.canonical).toBe(absoluteUrl);
  });

  it('handles relative URLs correctly', () => {
    const relativeUrl = '/about';
    const result = generateSEO({ url: relativeUrl });

    expect(result.openGraph?.url).toBe(`${siteConfig.url}${relativeUrl}`);
    expect(result.alternates?.canonical).toBe(`${siteConfig.url}${relativeUrl}`);
  });

  it('handles absolute image URLs correctly', () => {
    const absoluteImage = 'https://example.com/image.jpg';
    const result = generateSEO({ image: absoluteImage });

    const ogImages = result.openGraph?.images;
    const twitterImages = result.twitter?.images;
    expect(
      Array.isArray(ogImages)
        ? (ogImages[0] as { url?: string })?.url
        : (ogImages as { url?: string })?.url
    ).toBe(absoluteImage);
    expect(Array.isArray(twitterImages) ? twitterImages[0] : twitterImages).toBe(absoluteImage);
  });

  it('handles relative image URLs correctly', () => {
    const relativeImage = '/images/custom.jpg';
    const result = generateSEO({ image: relativeImage });

    const ogImages = result.openGraph?.images;
    const twitterImages = result.twitter?.images;
    expect(
      Array.isArray(ogImages)
        ? (ogImages[0] as { url?: string })?.url
        : (ogImages as { url?: string })?.url
    ).toBe(`${siteConfig.url}${relativeImage}`);
    expect(Array.isArray(twitterImages) ? twitterImages[0] : twitterImages).toBe(
      `${siteConfig.url}${relativeImage}`
    );
  });

  it('sets correct OpenGraph type', () => {
    const websiteResult = generateSEO({ type: 'website' });
    const articleResult = generateSEO({ type: 'article' });

    expect((websiteResult.openGraph as { type?: string })?.type).toBe('website');
    expect((articleResult.openGraph as { type?: string })?.type).toBe('article');
  });

  it('includes published and modified times for articles', () => {
    const publishedTime = '2024-01-01T00:00:00.000Z';
    const modifiedTime = '2024-01-02T00:00:00.000Z';

    const result = generateSEO({
      type: 'article',
      publishedTime,
      modifiedTime,
    });

    expect((result.openGraph as { publishedTime?: string })?.publishedTime).toBe(publishedTime);
    expect((result.openGraph as { modifiedTime?: string })?.modifiedTime).toBe(modifiedTime);
  });

  it('excludes published and modified times when not provided', () => {
    const result = generateSEO({ type: 'article' });

    expect((result.openGraph as { publishedTime?: string })?.publishedTime).toBeUndefined();
    expect((result.openGraph as { modifiedTime?: string })?.modifiedTime).toBeUndefined();
  });

  it('includes proper Twitter metadata', () => {
    const result = generateSEO();

    expect((result.twitter as { card?: string })?.card).toBe('summary_large_image');
    expect(result.twitter?.creator).toBe('@blackwoodscreative');
    expect(result.twitter?.title).toBe(siteConfig.name);
    expect(result.twitter?.description).toBe(siteConfig.description);
  });

  it('includes proper robots metadata', () => {
    const result = generateSEO();

    const robots = result.robots as {
      index?: boolean;
      follow?: boolean;
      googleBot?: Record<string, unknown>;
    };
    expect(robots?.index).toBe(true);
    expect(robots?.follow).toBe(true);
    expect(robots?.googleBot?.index).toBe(true);
    expect(robots?.googleBot?.follow).toBe(true);
    expect(robots?.googleBot?.['max-video-preview']).toBe(-1);
    expect(robots?.googleBot?.['max-image-preview']).toBe('large');
    expect(robots?.googleBot?.['max-snippet']).toBe(-1);
  });

  it('includes proper image metadata', () => {
    const result = generateSEO();

    const ogImages = result.openGraph?.images;
    type ImageProps = { width?: number; height?: number; alt?: string };
    expect(
      Array.isArray(ogImages) ? (ogImages[0] as ImageProps)?.width : (ogImages as ImageProps)?.width
    ).toBe(1200);
    expect(
      Array.isArray(ogImages)
        ? (ogImages[0] as ImageProps)?.height
        : (ogImages as ImageProps)?.height
    ).toBe(630);
    expect(
      Array.isArray(ogImages) ? (ogImages[0] as ImageProps)?.alt : (ogImages as ImageProps)?.alt
    ).toBe(siteConfig.name);
  });

  it('includes proper locale', () => {
    const result = generateSEO();

    expect(result.openGraph?.locale).toBe('en_US');
  });
});

describe('generateStructuredData', () => {
  it('generates valid organization structured data', () => {
    const result = generateStructuredData();

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('Organization');
    expect(result.name).toBe(siteConfig.name);
    expect(result.description).toBe(siteConfig.description);
    expect(result.url).toBe(siteConfig.url);
  });

  it('includes contact information', () => {
    const result = generateStructuredData();

    expect(result.contactPoint['@type']).toBe('ContactPoint');
    expect(result.contactPoint.email).toBe(siteConfig.links.email);
    expect(result.contactPoint.telephone).toBe(siteConfig.links.phone);
    expect(result.contactPoint.contactType).toBe('customer service');
  });

  it('includes social media links', () => {
    const result = generateStructuredData();

    expect(result.sameAs).toContain(siteConfig.links.instagram);
    expect(result.sameAs).toContain(siteConfig.links.linkedin);
  });

  it('includes company information', () => {
    const result = generateStructuredData();

    expect(result.foundingDate).toBe('2020');
    expect(result.numberOfEmployees).toBe('5-10');
    expect(result.industry).toBe('Creative Services');
  });

  it('includes founder information', () => {
    const result = generateStructuredData();

    expect(result.founder['@type']).toBe('Person');
    expect(result.founder.name).toBe('BlackWoods Creative Team');
  });

  it('includes address information', () => {
    const result = generateStructuredData();

    expect(result.address['@type']).toBe('PostalAddress');
    expect(result.address.addressCountry).toBe('US');
  });

  it('includes services information', () => {
    const result = generateStructuredData();

    expect(Array.isArray(result.services)).toBe(true);
    expect(result.services).toHaveLength(siteConfig.services.length);

    result.services.forEach(
      (service: { '@type': string; name: string; description: string }, index: number) => {
        expect(service['@type']).toBe('Service');
        expect(service.name).toBe(siteConfig.services[index].name);
        expect(service.description).toBe(siteConfig.services[index].description);
      }
    );
  });

  it('includes logo URL', () => {
    const result = generateStructuredData();

    expect(result.logo).toBe(`${siteConfig.url}/logo.png`);
  });
});

describe('generatePortfolioStructuredData', () => {
  const mockProjects = [
    {
      title: 'Project 1',
      description: 'Description 1',
      image: '/images/project1.jpg',
      year: 2023,
      category: 'Filmmaking',
      tags: ['video', 'production'],
    },
    {
      title: 'Project 2',
      description: 'Description 2',
      image: '/images/project2.jpg',
      category: 'Photography',
    },
  ];

  it('generates valid portfolio structured data', () => {
    const result = generatePortfolioStructuredData(mockProjects);

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('CreativeWork');
    expect(result.name).toBe('BlackWoods Creative Portfolio');
    expect(result.description).toContain('Professional portfolio');
  });

  it('includes creator information', () => {
    const result = generatePortfolioStructuredData(mockProjects);

    expect(result.creator['@type']).toBe('Organization');
    expect(result.creator.name).toBe(siteConfig.name);
  });

  it('includes work examples', () => {
    const result = generatePortfolioStructuredData(mockProjects);

    expect(Array.isArray(result.workExample)).toBe(true);
    expect(result.workExample).toHaveLength(mockProjects.length);
  });

  it('maps project data correctly', () => {
    const result = generatePortfolioStructuredData(mockProjects);

    result.workExample.forEach(
      (
        work: {
          '@type': string;
          name: string;
          description: string;
          image: string;
          genre: string;
          creator: { '@type': string; name: string };
        },
        index: number
      ) => {
        const project = mockProjects[index];

        expect(work['@type']).toBe('CreativeWork');
        expect(work.name).toBe(project.title);
        expect(work.description).toBe(project.description);
        expect(work.image).toBe(project.image);
        expect(work.genre).toBe(project.category);
        expect(work.creator['@type']).toBe('Organization');
        expect(work.creator.name).toBe(siteConfig.name);
      }
    );
  });

  it('handles optional project fields', () => {
    const result = generatePortfolioStructuredData(mockProjects);

    // First project has year and tags
    expect(result.workExample[0].dateCreated).toBe('2023');
    expect(result.workExample[0].keywords).toBe('video, production');

    // Second project doesn't have year and tags
    expect(result.workExample[1].dateCreated).toBeUndefined();
    expect(result.workExample[1].keywords).toBeUndefined();
  });

  it('handles empty projects array', () => {
    const result = generatePortfolioStructuredData([]);

    expect(result.workExample).toHaveLength(0);
    expect(Array.isArray(result.workExample)).toBe(true);
  });

  it('handles projects without optional fields', () => {
    const minimalProjects = [
      {
        title: 'Minimal Project',
        description: 'Minimal description',
        image: '/minimal.jpg',
        category: 'Design',
      },
    ];

    const result = generatePortfolioStructuredData(minimalProjects);

    expect(result.workExample[0].dateCreated).toBeUndefined();
    expect(result.workExample[0].keywords).toBeUndefined();
    expect(result.workExample[0].name).toBe('Minimal Project');
  });
});
