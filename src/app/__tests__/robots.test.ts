/**
 * Robots.txt Tests
 *
 * Tests for the robots.txt generation and configuration
 */

import { MetadataRoute } from 'next';

import robots from '../robots';

describe('robots.txt', () => {
  let robotsConfig: MetadataRoute.Robots;

  beforeEach(() => {
    robotsConfig = robots();
  });

  describe('Basic Configuration', () => {
    it('returns a valid robots configuration object', () => {
      expect(robotsConfig).toBeDefined();
      expect(typeof robotsConfig).toBe('object');
    });

    it('includes rules property', () => {
      expect(robotsConfig.rules).toBeDefined();
      expect(typeof robotsConfig.rules).toBe('object');
    });

    it('includes sitemap property', () => {
      expect(robotsConfig.sitemap).toBeDefined();
      expect(typeof robotsConfig.sitemap).toBe('string');
    });

    it('includes host property', () => {
      expect(robotsConfig.host).toBeDefined();
      expect(typeof robotsConfig.host).toBe('string');
    });
  });

  describe('Rules Configuration', () => {
    it('allows all user agents by default', () => {
      expect((robotsConfig.rules as { userAgent: string }).userAgent).toBe('*');
    });

    it('allows root path by default', () => {
      expect((robotsConfig.rules as { allow: string }).allow).toBe('/');
    });

    it('disallows sensitive paths', () => {
      const disallowedPaths = (robotsConfig.rules as { disallow: string[] }).disallow;
      expect(Array.isArray(disallowedPaths)).toBe(true);
      expect(disallowedPaths).toContain('/api/');
      expect(disallowedPaths).toContain('/admin/');
      expect(disallowedPaths).toContain('/_next/');
      expect(disallowedPaths).toContain('/private/');
    });

    it('disallows all required sensitive paths', () => {
      const disallowedPaths = (robotsConfig.rules as { disallow: string[] }).disallow;
      const requiredDisallowed = ['/api/', '/admin/', '/_next/', '/private/'];
      
      requiredDisallowed.forEach(path => {
        expect(disallowedPaths).toContain(path);
      });
    });
  });

  describe('Sitemap Configuration', () => {
    it('includes correct sitemap URL', () => {
      expect(robotsConfig.sitemap).toBe('https://blackwoodscreative.com/sitemap.xml');
    });

    it('uses HTTPS protocol', () => {
      expect(robotsConfig.sitemap).toMatch(/^https:\/\//);
    });

    it('points to sitemap.xml file', () => {
      expect(robotsConfig.sitemap).toMatch(/\/sitemap\.xml$/);
    });

    it('uses correct domain', () => {
      expect(robotsConfig.sitemap).toContain('blackwoodscreative.com');
    });
  });

  describe('Host Configuration', () => {
    it('includes correct host URL', () => {
      expect(robotsConfig.host).toBe('https://blackwoodscreative.com');
    });

    it('uses HTTPS protocol for host', () => {
      expect(robotsConfig.host).toMatch(/^https:\/\//);
    });

    it('uses correct domain for host', () => {
      expect(robotsConfig.host).toContain('blackwoodscreative.com');
    });

    it('does not include trailing slash in host', () => {
      expect(robotsConfig.host).not.toMatch(/\/$/);
    });
  });

  describe('Security Considerations', () => {
    it('blocks API endpoints from crawling', () => {
      const disallowedPaths = (robotsConfig.rules as { disallow: string[] }).disallow;
      expect(disallowedPaths).toContain('/api/');
    });

    it('blocks admin areas from crawling', () => {
      const disallowedPaths = (robotsConfig.rules as { disallow: string[] }).disallow;
      expect(disallowedPaths).toContain('/admin/');
    });

    it('blocks Next.js internal paths from crawling', () => {
      const disallowedPaths = (robotsConfig.rules as { disallow: string[] }).disallow;
      expect(disallowedPaths).toContain('/_next/');
    });

    it('blocks private areas from crawling', () => {
      const disallowedPaths = (robotsConfig.rules as { disallow: string[] }).disallow;
      expect(disallowedPaths).toContain('/private/');
    });
  });

  describe('SEO Optimization', () => {
    it('allows crawling of main content', () => {
      expect((robotsConfig.rules as { allow: string }).allow).toBe('/');
    });

    it('provides sitemap for efficient crawling', () => {
      expect(robotsConfig.sitemap).toBeDefined();
      expect(robotsConfig.sitemap).toMatch(/sitemap\.xml/);
    });

    it('specifies host for canonical domain', () => {
      expect(robotsConfig.host).toBeDefined();
      expect(robotsConfig.host).toMatch(/blackwoodscreative\.com/);
    });
  });

  describe('Consistency Checks', () => {
    it('maintains consistent domain across sitemap and host', () => {
      const sitemap = robotsConfig.sitemap;
      const host = robotsConfig.host;
      if (sitemap && host && typeof sitemap === 'string' && typeof host === 'string') {
        const sitemapDomain = new URL(sitemap).hostname;
        const hostDomain = new URL(host).hostname;
        expect(sitemapDomain).toBe(hostDomain);
      }
    });

    it('uses consistent protocol (HTTPS) across all URLs', () => {
      expect(robotsConfig.sitemap).toMatch(/^https:/);
      expect(robotsConfig.host).toMatch(/^https:/);
    });

    it('generates consistent configuration across multiple calls', () => {
      const config1 = robots();
      const config2 = robots();
      expect(config1).toEqual(config2);
    });
  });

  describe('Format Validation', () => {
    it('follows Next.js MetadataRoute.Robots interface', () => {
      // Check required properties exist
      expect(robotsConfig).toHaveProperty('rules');
      expect(robotsConfig).toHaveProperty('sitemap');
      expect(robotsConfig).toHaveProperty('host');

      // Check rules structure
      expect(robotsConfig.rules).toHaveProperty('userAgent');
      expect(robotsConfig.rules).toHaveProperty('allow');
      expect(robotsConfig.rules).toHaveProperty('disallow');
    });

    it('has valid userAgent format', () => {
      const userAgent = (robotsConfig.rules as { userAgent: string }).userAgent;
      expect(typeof userAgent).toBe('string');
      expect(userAgent.length).toBeGreaterThan(0);
    });

    it('has valid allow format', () => {
      const allow = (robotsConfig.rules as { allow: string }).allow;
      expect(typeof allow).toBe('string');
      expect(allow).toMatch(/^\//);
    });

    it('has valid disallow format', () => {
      const disallowedPaths = (robotsConfig.rules as { disallow: string[] }).disallow;
      expect(Array.isArray(disallowedPaths)).toBe(true);
      
      if (Array.isArray(disallowedPaths)) {
        disallowedPaths.forEach(path => {
          expect(typeof path).toBe('string');
          expect(path).toMatch(/^\//);
        });
      }
    });
  });

  describe('Production Readiness', () => {
    it('uses production domain', () => {
      expect(robotsConfig.host).toContain('blackwoodscreative.com');
      expect(robotsConfig.sitemap).toContain('blackwoodscreative.com');
    });

    it('does not include development-specific paths', () => {
      const disallowedPaths = (robotsConfig.rules as { disallow: string[] }).disallow;

      // Should not include development-specific disallows
      expect(disallowedPaths).not.toContain('/dev/');
      expect(disallowedPaths).not.toContain('/test/');
      expect(disallowedPaths).not.toContain('/staging/');
    });

    it('includes all necessary production disallows', () => {
      const disallowedPaths = (robotsConfig.rules as { disallow: string[] }).disallow;
      const productionDisallows = ['/api/', '/admin/', '/_next/', '/private/'];
      
      productionDisallows.forEach(path => {
        expect(disallowedPaths).toContain(path);
      });
    });
  });

  describe('Error Handling', () => {
    it('handles function calls without errors', () => {
      expect(() => robots()).not.toThrow();
    });

    it('returns consistent results', () => {
      const results = Array.from({ length: 5 }, () => robots());
      const firstResult = results[0];
      
      results.forEach(result => {
        expect(result).toEqual(firstResult);
      });
    });
  });
});
