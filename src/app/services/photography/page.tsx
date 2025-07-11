import { Metadata } from 'next';

import {
  ServicePageTemplate,
  type ServicePageData,
  type SEOMetadata,
  generatePageMetadata,
} from '@/components/templates';

// SEO metadata
const seoMetadata: SEOMetadata = {
  title: 'Professional Photography Services Morocco | BlackWoods Creative',
  description:
    'Professional photography services in Morocco. Corporate headshots, product photography, event coverage, and brand imagery. Serving Casablanca, Rabat, Mohammedia.',
  keywords: [
    'professional photography Morocco',
    'corporate photography Casablanca',
    'product photography Morocco',
    'event photography Rabat',
    'brand photography Mohammedia',
    'business photography Morocco',
    'commercial photography',
  ],
  canonicalUrl: '/services/photography',
  openGraph: {
    title: 'Professional Photography Services | BlackWoods Creative Morocco',
    description:
      'Expert photography services for businesses across Morocco. Corporate, product, and event photography.',
    type: 'service',
  },
};

// Page content data
const pageData: ServicePageData = {
  hero: {
    title: 'Professional Photography Services',
    subtitle: "Capturing your brand's essence through expert photography",
    description:
      'From corporate headshots to product photography, we create stunning visuals that enhance your professional image and drive business results.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Photography', href: '/services/photography' },
    ],
    cta: {
      primary: {
        text: 'Get Photography Quote',
        href: '#contact',
      },
      secondary: {
        text: 'View Portfolio',
        href: '#portfolio',
      },
    },
  },
  services: [
    {
      title: 'Corporate Photography',
      description:
        "Professional headshots, team photos, and corporate event coverage that reflects your company's professionalism.",
      features: [
        'Executive headshots',
        'Team photography',
        'Corporate event coverage',
        'Office and facility photography',
      ],
      benefits: [
        'Enhanced professional image',
        'Consistent brand representation',
        'High-quality marketing materials',
        'Improved online presence',
      ],
    },
    {
      title: 'Product Photography',
      description:
        'Showcase your products with stunning photography that drives sales and enhances your brand appeal.',
      features: [
        'E-commerce product shots',
        'Lifestyle product photography',
        'Technical product documentation',
        'Creative product campaigns',
      ],
      benefits: [
        'Increased online sales',
        'Professional product catalogs',
        'Enhanced brand perception',
        'Competitive market advantage',
      ],
    },
    {
      title: 'Event Photography',
      description:
        'Comprehensive event coverage that captures the energy and importance of your business occasions.',
      features: [
        'Conference photography',
        'Corporate event coverage',
        'Product launch documentation',
        'Award ceremony photography',
      ],
      benefits: [
        'Professional event documentation',
        'Marketing content creation',
        'Social media assets',
        'Historical business records',
      ],
    },
  ],
  process: [
    {
      step: 1,
      title: 'Consultation & Planning',
      description:
        'We discuss your photography needs, brand guidelines, and desired outcomes to plan the perfect shoot.',
    },
    {
      step: 2,
      title: 'Pre-Production Setup',
      description:
        'Location scouting, lighting setup, and equipment preparation to ensure optimal shooting conditions.',
    },
    {
      step: 3,
      title: 'Professional Photography',
      description:
        'Expert photography session with professional direction and multiple shot variations.',
    },
    {
      step: 4,
      title: 'Post-Production & Delivery',
      description:
        'Professional editing, color correction, and delivery in all required formats and resolutions.',
    },
  ],
  featuredAnswer: {
    question: 'What makes professional photography essential for business success?',
    answer:
      'Professional photography creates a powerful first impression, builds trust with customers, and significantly impacts purchasing decisions. High-quality visuals can increase engagement by up to 650% and directly influence conversion rates across all marketing channels.',
    details: [
      'Increase customer trust and credibility by 73%',
      'Boost social media engagement by up to 650%',
      'Improve website conversion rates by 40%',
      'Create consistent brand image across all platforms',
    ],
  },
};

// Generate Next.js metadata using type-safe helper
export const metadata: Metadata = generatePageMetadata(seoMetadata);

export default function PhotographyPage() {
  return <ServicePageTemplate metadata={seoMetadata} data={pageData} />;
}
