import { siteConfig } from '@/lib/constants/siteConfig';

import sitemap from '../sitemap';

// Mock the siteConfig
jest.mock('@/lib/constants/siteConfig', () => ({
  siteConfig: {
    url: 'https://blackwoodscreative.com',
  },
}));

describe('sitemap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date to ensure consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns a valid sitemap array', () => {
    const result = sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(4);
  });

  it('includes the main homepage entry', () => {
    const result = sitemap();
    const homepage = result.find(entry => entry.url === siteConfig.url);

    expect(homepage).toBeDefined();
    expect(homepage?.priority).toBe(1);
    expect(homepage?.changeFrequency).toBe('monthly');
    expect(homepage?.lastModified).toBe('2024-01-01T00:00:00.000Z');
  });

  it('includes the portfolio section entry', () => {
    const result = sitemap();
    const portfolio = result.find(entry => entry.url === `${siteConfig.url}/#portfolio`);

    expect(portfolio).toBeDefined();
    expect(portfolio?.priority).toBe(0.9);
    expect(portfolio?.changeFrequency).toBe('weekly');
    expect(portfolio?.lastModified).toBe('2024-01-01T00:00:00.000Z');
  });

  it('includes the about section entry', () => {
    const result = sitemap();
    const about = result.find(entry => entry.url === `${siteConfig.url}/#about`);

    expect(about).toBeDefined();
    expect(about?.priority).toBe(0.8);
    expect(about?.changeFrequency).toBe('monthly');
    expect(about?.lastModified).toBe('2024-01-01T00:00:00.000Z');
  });

  it('includes the contact section entry', () => {
    const result = sitemap();
    const contact = result.find(entry => entry.url === `${siteConfig.url}/#contact`);

    expect(contact).toBeDefined();
    expect(contact?.priority).toBe(0.7);
    expect(contact?.changeFrequency).toBe('monthly');
    expect(contact?.lastModified).toBe('2024-01-01T00:00:00.000Z');
  });

  it('uses current date for lastModified', () => {
    const testDate = new Date('2024-06-15T12:30:45.123Z');
    jest.setSystemTime(testDate);

    const result = sitemap();

    result.forEach(entry => {
      expect(entry.lastModified).toBe(testDate.toISOString());
    });
  });

  it('has correct priority hierarchy', () => {
    const result = sitemap();

    const homepage = result.find(entry => entry.url === siteConfig.url);
    const portfolio = result.find(entry => entry.url.includes('#portfolio'));
    const about = result.find(entry => entry.url.includes('#about'));
    const contact = result.find(entry => entry.url.includes('#contact'));

    expect(homepage?.priority).toBeGreaterThan(portfolio?.priority || 0);
    expect(portfolio?.priority).toBeGreaterThan(about?.priority || 0);
    expect(about?.priority).toBeGreaterThan(contact?.priority || 0);
  });

  it('uses correct base URL from siteConfig', () => {
    const result = sitemap();

    result.forEach(entry => {
      expect(entry.url).toContain(siteConfig.url);
    });
  });

  it('has valid changeFrequency values', () => {
    const result = sitemap();
    const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

    result.forEach(entry => {
      expect(validFrequencies).toContain(entry.changeFrequency);
    });
  });

  it('has valid priority values between 0 and 1', () => {
    const result = sitemap();

    result.forEach(entry => {
      expect(entry.priority).toBeGreaterThanOrEqual(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
    });
  });

  it('includes all required sitemap properties', () => {
    const result = sitemap();

    result.forEach(entry => {
      expect(entry).toHaveProperty('url');
      expect(entry).toHaveProperty('lastModified');
      expect(entry).toHaveProperty('changeFrequency');
      expect(entry).toHaveProperty('priority');
    });
  });

  it('generates valid ISO date strings', () => {
    const result = sitemap();

    result.forEach(entry => {
      if (entry.lastModified) {
        expect(() => new Date(entry.lastModified as string)).not.toThrow();
        expect(new Date(entry.lastModified).toISOString()).toBe(entry.lastModified);
      }
    });
  });

  it('handles different siteConfig URLs', () => {
    // This test verifies the sitemap uses the siteConfig.url
    // Since we've already mocked it to 'https://blackwoodscreative.com'
    // we'll verify it uses that URL consistently
    const result = sitemap();

    result.forEach(entry => {
      expect(entry.url).toContain('https://blackwoodscreative.com');
    });
  });

  it('maintains consistent structure across calls', () => {
    const result1 = sitemap();
    const result2 = sitemap();

    expect(result1.length).toBe(result2.length);

    result1.forEach((entry, index) => {
      expect(entry.url).toBe(result2[index].url);
      expect(entry.priority).toBe(result2[index].priority);
      expect(entry.changeFrequency).toBe(result2[index].changeFrequency);
    });
  });

  it('returns entries in correct priority order', () => {
    const result = sitemap();

    // Should be ordered by priority (highest first)
    expect(result[0].priority).toBe(1); // Homepage
    expect(result[1].priority).toBe(0.9); // Portfolio
    expect(result[2].priority).toBe(0.8); // About
    expect(result[3].priority).toBe(0.7); // Contact
  });

  it('includes proper anchor links for sections', () => {
    const result = sitemap();

    const sectionEntries = result.filter(entry => entry.url.includes('#'));

    expect(sectionEntries).toHaveLength(3);
    expect(sectionEntries.some(entry => entry.url.includes('#portfolio'))).toBe(true);
    expect(sectionEntries.some(entry => entry.url.includes('#about'))).toBe(true);
    expect(sectionEntries.some(entry => entry.url.includes('#contact'))).toBe(true);
  });
});
