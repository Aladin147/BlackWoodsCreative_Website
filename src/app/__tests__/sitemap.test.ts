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
    expect(result.length).toBeGreaterThan(10); // Now has many more pages
  });

  it('includes the main homepage entry', () => {
    const result = sitemap();
    const homepage = result.find(entry => entry.url === siteConfig.url);

    expect(homepage).toBeDefined();
    expect(homepage?.priority).toBe(1.0);
    expect(homepage?.changeFrequency).toBe('weekly');
    expect(homepage?.lastModified).toBe('2024-01-01T00:00:00.000Z');
  });

  it('includes the portfolio page entry', () => {
    const result = sitemap();
    const portfolio = result.find(entry => entry.url === `${siteConfig.url}/portfolio`);

    expect(portfolio).toBeDefined();
    expect(portfolio?.priority).toBe(0.85);
    expect(portfolio?.changeFrequency).toBe('weekly');
  });

  it('includes the about page entry', () => {
    const result = sitemap();
    const about = result.find(entry => entry.url === `${siteConfig.url}/about`);

    expect(about).toBeDefined();
    expect(about?.priority).toBe(0.95);
    expect(about?.changeFrequency).toBe('monthly');
  });

  it('includes the contact page entry', () => {
    const result = sitemap();
    const contact = result.find(entry => entry.url === `${siteConfig.url}/contact`);

    expect(contact).toBeDefined();
    expect(contact?.priority).toBe(0.8);
    expect(contact?.changeFrequency).toBe('monthly');
  });

  it('uses current date for lastModified', () => {
    const testDate = new Date('2024-06-15T12:30:45.123Z');
    jest.setSystemTime(testDate);

    const result = sitemap();

    // Only homepage uses current date, others use calculated dates
    const homepage = result.find(entry => entry.url === siteConfig.url);
    expect(homepage?.lastModified).toBe(testDate.toISOString());

    // Other entries should have valid dates (not necessarily current date)
    result.forEach(entry => {
      expect(entry.lastModified).toBeDefined();
      expect(typeof entry.lastModified).toBe('string');
    });
  });

  it('has correct priority hierarchy', () => {
    const result = sitemap();

    const homepage = result.find(entry => entry.url === siteConfig.url);
    const portfolio = result.find(entry => entry.url === `${siteConfig.url}/portfolio`);
    const about = result.find(entry => entry.url === `${siteConfig.url}/about`);
    const contact = result.find(entry => entry.url === `${siteConfig.url}/contact`);

    expect(homepage?.priority).toBe(1.0); // Highest priority
    expect(about?.priority).toBe(0.95); // High brand priority
    expect(portfolio?.priority).toBe(0.85); // High showcase priority
    expect(contact?.priority).toBe(0.8); // Important conversion page
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
      expect(entry.url).toBe(result2[index]?.url);
      expect(entry.priority).toBe(result2[index]?.priority);
      expect(entry.changeFrequency).toBe(result2[index]?.changeFrequency);
    });
  });

  it('returns entries in correct priority order', () => {
    const result = sitemap();

    // Should be ordered by priority (highest first)
    expect(result[0]?.priority).toBe(1); // Homepage
    expect(result[1]?.priority).toBe(0.95); // About (high brand priority)
    expect(result[2]?.priority).toBe(0.9); // Services
    expect(result[3]?.priority).toBe(0.85); // Video production service
  });

  it('includes proper page entries (no anchor links)', () => {
    const result = sitemap();

    // Current sitemap doesn't include anchor links, only full pages
    const sectionEntries = result.filter(entry => entry.url.includes('#'));
    expect(sectionEntries).toHaveLength(0);

    // Instead, verify we have the main page entries
    const pageUrls = result.map(entry => entry.url);
    expect(pageUrls).toContain(`${siteConfig.url}/portfolio`);
    expect(pageUrls).toContain(`${siteConfig.url}/about`);
    expect(pageUrls).toContain(`${siteConfig.url}/contact`);
  });
});
