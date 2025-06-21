import { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/constants/siteConfig';

// Enhanced sitemap with SEO-optimized priorities and dynamic dates
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const currentDate = new Date().toISOString();

  // Different modification dates for different content types
  const recentUpdate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 1 week ago
  const monthlyUpdate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 1 month ago

  return [
    // ===== HOMEPAGE - HIGHEST PRIORITY =====
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // ===== BRAND-FOCUSED PAGES - HIGH PRIORITY =====
    {
      url: `${baseUrl}/about`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.95, // High priority for brand page
    },

    // ===== SERVICES PAGES - BUSINESS CRITICAL =====
    {
      url: `${baseUrl}/services`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/video-production-morocco`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.85, // High-value service page
    },
    {
      url: `${baseUrl}/services/corporate-video-production-morocco`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.85, // High-value service page
    },
    {
      url: `${baseUrl}/services/photography`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.85, // High-value service page
    },
    {
      url: `${baseUrl}/services/3d-visualization`,
      lastModified: recentUpdate,
      changeFrequency: 'monthly',
      priority: 0.85, // High-value service page
    },

    // ===== SOLUTIONS PAGE - BUSINESS FOCUSED =====
    {
      url: `${baseUrl}/solutions`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // ===== ABOUT SECTION PAGES - BRAND BUILDING =====
    {
      url: `${baseUrl}/about/our-story`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.75, // Important brand story page
    },
    {
      url: `${baseUrl}/about/team`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.7, // Team information
    },
    {
      url: `${baseUrl}/about/our-workflow`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.65, // Process information
    },
    {
      url: `${baseUrl}/about/location`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6, // Location information
    },
    // ===== PORTFOLIO & CONTACT - CONVERSION PAGES =====
    {
      url: `${baseUrl}/portfolio`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly', // Updated frequently with new work
      priority: 0.85, // High priority for showcasing work
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.8, // Important conversion page
    },
  ];
}
