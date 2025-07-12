/**
 * Enhanced Image Sitemap for Google Search Console
 *
 * Provides detailed image information for better search visibility
 * and image search optimization
 */

import { NextRequest, NextResponse } from 'next/server';

import { siteConfig } from '@/lib/constants/siteConfig';

// Portfolio images with SEO data
const portfolioImages = [
  {
    url: '/images/portfolio/film/corporate-video-casablanca.jpg',
    caption: 'Corporate video production in Casablanca, Morocco by BlackWoods Creative',
    title: 'Corporate Video Production Casablanca',
    location: 'Casablanca, Morocco',
  },
  {
    url: '/images/portfolio/photography/product-photography-morocco.jpg',
    caption: 'Professional product photography services in Morocco by BlackWoods Creative',
    title: 'Product Photography Morocco',
    location: 'Morocco',
  },
  {
    url: '/images/portfolio/3d/architectural-visualization-rabat.jpg',
    caption: '3D architectural visualization project in Rabat, Morocco by BlackWoods Creative',
    title: 'Architectural Visualization Rabat',
    location: 'Rabat, Morocco',
  },
  {
    url: '/images/portfolio/film/brand-film-marrakech.jpg',
    caption: 'Brand film production in Marrakech, Morocco by BlackWoods Creative',
    title: 'Brand Film Production Marrakech',
    location: 'Marrakech, Morocco',
  },
  {
    url: '/images/portfolio/photography/corporate-photography-mohammedia.jpg',
    caption: 'Corporate photography services in Mohammedia, Morocco by BlackWoods Creative',
    title: 'Corporate Photography Mohammedia',
    location: 'Mohammedia, Morocco',
  },
];

// Service page images
const serviceImages = [
  {
    url: '/images/services/video-production-morocco-hero.jpg',
    caption: 'Professional video production services across Morocco by BlackWoods Creative',
    title: 'Video Production Morocco Services',
    location: 'Morocco',
  },
  {
    url: '/images/services/photography-services-morocco.jpg',
    caption: 'Comprehensive photography services in Morocco by BlackWoods Creative',
    title: 'Photography Services Morocco',
    location: 'Morocco',
  },
  {
    url: '/images/services/3d-visualization-morocco.jpg',
    caption: '3D visualization and architectural rendering services in Morocco',
    title: '3D Visualization Morocco',
    location: 'Morocco',
  },
];

// Team images
const teamImages = [
  {
    url: '/images/team/creative-director-morocco.jpg',
    caption: 'Creative Director at BlackWoods Creative Morocco',
    title: 'Creative Director BlackWoods Creative',
    location: 'Mohammedia, Morocco',
  },
  {
    url: '/images/team/video-production-team-morocco.jpg',
    caption: 'Professional video production team at BlackWoods Creative Morocco',
    title: 'Video Production Team Morocco',
    location: 'Morocco',
  },
];

function generateImageSitemap() {
  const baseUrl = siteConfig.url;
  const currentDate = new Date().toISOString();

  // Combine all images
  const allImages = [
    ...portfolioImages.map(img => ({ ...img, page: '/portfolio' })),
    ...serviceImages.map(img => ({ ...img, page: '/services' })),
    ...teamImages.map(img => ({ ...img, page: '/about/team' })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allImages
  .map(
    image => `
  <url>
    <loc>${baseUrl}${image.page}</loc>
    <lastmod>${currentDate}</lastmod>
    <image:image>
      <image:loc>${baseUrl}${image.url}</image:loc>
      <image:caption>${image.caption}</image:caption>
      <image:title>${image.title}</image:title>
      <image:geo_location>${image.location}</image:geo_location>
    </image:image>
  </url>`
  )
  .join('')}
</urlset>`;

  return sitemap;
}

export function GET(_request: NextRequest) {
  try {
    const sitemap = generateImageSitemap();

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200', // 24 hours cache
      },
    });
  } catch (error) {
    console.error('Error generating image sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
