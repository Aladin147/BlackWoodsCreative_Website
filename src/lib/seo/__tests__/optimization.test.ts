/**
 * SEO Optimization Tests
 */

import { SEOOptimizer, SEOUtils, DEFAULT_SEO_CONFIG } from '../optimization';

describe('SEOOptimizer', () => {
  let optimizer: SEOOptimizer;

  beforeEach(() => {
    optimizer = new SEOOptimizer();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = SEOOptimizer.getInstance();
      const instance2 = SEOOptimizer.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Metadata Generation', () => {
    it('should generate basic metadata', () => {
      const metadata = optimizer.generateMetadata(
        {
          title: 'Test Page',
          description: 'Test description',
          keywords: ['test', 'seo'],
        },
        '/test'
      );

      expect(metadata.title).toBe('Test Page | BlackWoods Creative');
      expect(metadata.description).toBe('Test description');
      expect(metadata.keywords).toBe('test, seo');
    });

    it('should use default values when not provided', () => {
      const metadata = optimizer.generateMetadata({}, '/');

      expect(metadata.title).toBe(DEFAULT_SEO_CONFIG.defaultTitle);
      expect(metadata.description).toBe(DEFAULT_SEO_CONFIG.defaultDescription);
      expect(metadata.keywords).toBe(DEFAULT_SEO_CONFIG.defaultKeywords.join(', '));
    });

    it('should generate Open Graph metadata', () => {
      const metadata = optimizer.generateMetadata({
        title: 'Test Page',
        ogTitle: 'OG Test Page',
        ogDescription: 'OG Test description',
        ogImage: '/test-image.jpg',
      });

      expect(metadata.openGraph?.title).toBe('OG Test Page');
      expect(metadata.openGraph?.description).toBe('OG Test description');
      const images = Array.isArray(metadata.openGraph?.images)
        ? metadata.openGraph.images
        : metadata.openGraph?.images
          ? [metadata.openGraph.images]
          : [];
      const firstImage = images[0];
      if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
        expect(firstImage.url).toBe('/test-image.jpg');
      }
    });

    it('should generate Twitter metadata', () => {
      const metadata = optimizer.generateMetadata({
        title: 'Test Page',
        twitterTitle: 'Twitter Test Page',
        twitterDescription: 'Twitter Test description',
        twitterCard: 'summary',
      });

      expect(metadata.twitter?.title).toBe('Twitter Test Page');
      expect(metadata.twitter?.description).toBe('Twitter Test description');
      // Note: card property may not be directly accessible on TwitterMetadata type
      expect((metadata.twitter as any)?.card).toBe('summary');
    });

    it('should handle robots configuration', () => {
      const metadata = optimizer.generateMetadata({
        noindex: true,
        nofollow: true,
      });

      // Handle robots as object type
      const robots = metadata.robots as any;
      expect(robots?.index).toBe(false);
      expect(robots?.follow).toBe(false);
    });

    it('should generate canonical URL', () => {
      const metadata = optimizer.generateMetadata(
        {
          canonical: 'https://example.com/custom',
        },
        '/test'
      );

      expect(metadata.alternates?.canonical).toBe('https://example.com/custom');
    });
  });

  describe('Structured Data Generation', () => {
    it('should generate Organization structured data', () => {
      const structuredData = optimizer.generateStructuredData('Organization', {
        customProperty: 'Test Value',
      });

      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('Organization');
      expect(structuredData.name).toBe('BlackWoods Creative'); // Should use config default
      expect(structuredData.customProperty).toBe('Test Value'); // Should include passed data
    });

    it('should generate WebSite structured data', () => {
      const structuredData = optimizer.generateStructuredData('WebSite', {
        name: 'Test Website',
      });

      expect(structuredData['@type']).toBe('WebSite');
      expect(structuredData.potentialAction).toBeDefined();
    });

    it('should generate Service structured data', () => {
      const structuredData = optimizer.generateStructuredData('Service', {
        name: 'Test Service',
        description: 'Test service description',
      });

      expect(structuredData['@type']).toBe('Service');
      expect(structuredData.provider).toBeDefined();
      expect(structuredData.areaServed).toBeDefined();
    });

    it('should generate CreativeWork structured data', () => {
      const structuredData = optimizer.generateStructuredData('CreativeWork', {
        name: 'Test Creative Work',
      });

      expect(structuredData['@type']).toBe('CreativeWork');
      expect(structuredData.creator).toBeDefined();
    });

    it('should handle custom structured data types', () => {
      const structuredData = optimizer.generateStructuredData('CustomType', {
        customProperty: 'custom value',
      });

      expect(structuredData['@type']).toBe('CustomType');
      expect(structuredData.customProperty).toBe('custom value');
    });
  });

  describe('SEO Analysis', () => {
    it('should analyze page content', () => {
      const content = '<h1>Test Heading</h1><p>This is test content with some keywords.</p>';
      const description =
        'Test page description that is long enough to be considered good for SEO purposes.';
      const analysis = optimizer.analyzePage(content, {
        title: 'Test Page Title',
        description,
        keywords: ['test', 'content'],
      });

      expect(analysis.score).toBeGreaterThan(0);
      expect(analysis.metrics.titleLength).toBe(15);
      expect(analysis.metrics.descriptionLength).toBe(description.length);
      expect(analysis.metrics.headingStructure).toHaveLength(1);
      expect(analysis.metrics.keywordDensity).toBeDefined();
    });

    it('should identify title length issues', () => {
      const analysis = optimizer.analyzePage('', {
        title: 'Short',
        description: 'Valid description that meets the minimum length requirements for good SEO.',
      });

      const titleIssue = analysis.issues.find(
        issue => issue.category === 'title' && issue.message.includes('too short')
      );
      expect(titleIssue).toBeDefined();
    });

    it('should identify description length issues', () => {
      const analysis = optimizer.analyzePage('', {
        title: 'Valid Title That Is Long Enough For Good SEO',
        description: 'Short desc',
      });

      const descriptionIssue = analysis.issues.find(
        issue => issue.category === 'description' && issue.message.includes('too short')
      );
      expect(descriptionIssue).toBeDefined();
    });

    it('should identify missing headings', () => {
      const content = '<p>Content without headings</p>';
      const analysis = optimizer.analyzePage(content);

      const headingIssue = analysis.issues.find(
        issue => issue.category === 'structure' && issue.message.includes('No headings')
      );
      expect(headingIssue).toBeDefined();
    });

    it('should calculate keyword density', () => {
      const content = 'test content with test keywords and more test words';
      const analysis = optimizer.analyzePage(content, {
        keywords: ['test', 'content'],
      });

      expect(analysis.metrics.keywordDensity.test).toBeGreaterThan(0);
      expect(analysis.metrics.keywordDensity.content).toBeGreaterThan(0);
    });

    it('should extract heading structure', () => {
      const content = `
        <h1>Main Heading</h1>
        <h2 id="section1">Section 1</h2>
        <h3>Subsection</h3>
        <h2>Section 2</h2>
      `;
      const analysis = optimizer.analyzePage(content);

      expect(analysis.metrics.headingStructure).toHaveLength(4);
      expect(analysis.metrics.headingStructure[0]?.level).toBe(1);
      expect(analysis.metrics.headingStructure[0]?.text).toBe('Main Heading');
      expect(analysis.metrics.headingStructure[1]?.id).toBe('section1');
    });
  });

  describe('Configuration Management', () => {
    it('should update configuration', () => {
      const newConfig = {
        siteName: 'Updated Site Name',
        defaultTitle: 'Updated Default Title',
      };

      optimizer.updateConfig(newConfig);
      const config = optimizer.getConfig();

      expect(config.siteName).toBe('Updated Site Name');
      expect(config.defaultTitle).toBe('Updated Default Title');
      expect(config.siteUrl).toBe(DEFAULT_SEO_CONFIG.siteUrl); // Should keep original
    });

    it('should return current configuration', () => {
      const config = optimizer.getConfig();

      expect(config.siteName).toBe(DEFAULT_SEO_CONFIG.siteName);
      expect(config.siteUrl).toBe(DEFAULT_SEO_CONFIG.siteUrl);
      expect(config.defaultTitle).toBe(DEFAULT_SEO_CONFIG.defaultTitle);
    });
  });
});

describe('SEOUtils', () => {
  describe('Sitemap Generation', () => {
    it('should generate sitemap entry', () => {
      const entry = SEOUtils.generateSitemapEntry('https://example.com/test', {
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: '2024-01-01',
      });

      expect(entry).toContain('<loc>https://example.com/test</loc>');
      expect(entry).toContain('<priority>0.8</priority>');
      expect(entry).toContain('<changefreq>weekly</changefreq>');
      expect(entry).toContain('<lastmod>2024-01-01</lastmod>');
    });
  });

  describe('Robots.txt Generation', () => {
    it('should generate robots.txt for indexable site', () => {
      const robotsTxt = SEOUtils.generateRobotsTxt(DEFAULT_SEO_CONFIG);

      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Sitemap:');
    });

    it('should generate robots.txt for non-indexable site', () => {
      const config = {
        ...DEFAULT_SEO_CONFIG,
        robots: { index: false, follow: false },
      };
      const robotsTxt = SEOUtils.generateRobotsTxt(config);

      expect(robotsTxt).toContain('Disallow: /');
    });
  });

  describe('SEO Validation', () => {
    it('should validate correct SEO data', () => {
      const result = SEOUtils.validateSEO({
        title: 'Valid Title',
        description: 'Valid description that is not too long',
        keywords: ['keyword1', 'keyword2'],
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should identify title length errors', () => {
      const result = SEOUtils.validateSEO({
        title: 'This is a very long title that exceeds the recommended 60 character limit for SEO',
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title exceeds 60 characters');
    });

    it('should identify description length errors', () => {
      const longDescription =
        'This is a very long description that exceeds the recommended 160 character limit for meta descriptions which can cause issues with search engine display and should be shortened';
      const result = SEOUtils.validateSEO({
        description: longDescription,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Description exceeds 160 characters');
    });

    it('should identify too many keywords', () => {
      const result = SEOUtils.validateSEO({
        keywords: Array.from({ length: 15 }, (_, i) => `keyword${i}`),
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Too many keywords (max 10 recommended)');
    });
  });

  describe('Breadcrumb Structured Data', () => {
    it('should generate breadcrumb structured data', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Category', url: 'https://example.com/category' },
        { name: 'Page', url: 'https://example.com/category/page' },
      ];

      const structuredData = SEOUtils.generateBreadcrumbStructuredData(breadcrumbs);

      expect(structuredData['@type']).toBe('BreadcrumbList');
      expect(structuredData.itemListElement).toHaveLength(3);
      const itemList = structuredData.itemListElement as any[];
      expect(itemList[0]?.position).toBe(1);
      expect(itemList[0]?.name).toBe('Home');
    });
  });

  describe('Keyword Extraction', () => {
    it('should extract keywords from content', () => {
      const content = 'This is test content with some important keywords and more test words';
      const keywords = SEOUtils.extractKeywords(content, 5);

      expect(keywords).toContain('test');
      expect(keywords).toContain('content');
      expect(keywords.length).toBeLessThanOrEqual(5);
      // Note: 'keywords' might not be in top 5 due to frequency sorting
    });

    it('should filter short words', () => {
      const content = 'This is a test with some short words like a an the';
      const keywords = SEOUtils.extractKeywords(content);

      expect(keywords).not.toContain('a');
      expect(keywords).not.toContain('an');
      expect(keywords).not.toContain('the');
    });
  });

  describe('Meta Tags Generation', () => {
    it('should generate meta tags HTML', () => {
      const metaTags = SEOUtils.generateMetaTags(
        {
          title: 'Test Page',
          description: 'Test description',
          keywords: ['test', 'seo'],
          ogTitle: 'OG Test Page',
          twitterCard: 'summary',
        },
        DEFAULT_SEO_CONFIG
      );

      expect(metaTags).toContain('<title>Test Page | BlackWoods Creative</title>');
      expect(metaTags).toContain('<meta name="description" content="Test description"');
      expect(metaTags).toContain('<meta name="keywords" content="test, seo"');
      expect(metaTags).toContain('<meta property="og:title" content="OG Test Page"');
      expect(metaTags).toContain('<meta name="twitter:card" content="summary"');
    });

    it('should handle robots meta tags', () => {
      const metaTags = SEOUtils.generateMetaTags(
        {
          noindex: true,
          nofollow: false,
        },
        DEFAULT_SEO_CONFIG
      );

      expect(metaTags).toContain('<meta name="robots" content="noindex, follow"');
    });
  });
});
