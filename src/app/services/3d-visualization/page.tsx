import { Metadata } from 'next';

import {
  ServicePageTemplate,
  type ServicePageData,
  type SEOMetadata,
  generatePageMetadata
} from '@/components/templates';

// SEO metadata
const seoMetadata: SEOMetadata = {
  title: '3D Visualization Services Morocco | BlackWoods Creative',
  description: 'Professional 3D visualization and rendering services in Morocco. Architectural visualization, product rendering, and 3D modeling. Serving Casablanca, Rabat, Mohammedia.',
  keywords: [
    '3D visualization Morocco',
    'architectural rendering Casablanca',
    '3D modeling Morocco',
    'product visualization Rabat',
    '3D animation Mohammedia',
    'architectural visualization Morocco',
    '3D rendering services'
  ],
  canonicalUrl: '/services/3d-visualization',
  openGraph: {
    title: '3D Visualization Services | BlackWoods Creative Morocco',
    description: 'Expert 3D visualization and rendering services for architecture, products, and marketing in Morocco.',
    type: 'service'
  }
};

// Page content data
const pageData: ServicePageData = {
  hero: {
    title: '3D Visualization Services',
    subtitle: 'Transform concepts into photorealistic visuals',
    description: 'Professional 3D modeling, rendering, and visualization services that bring your ideas to life with stunning detail and accuracy.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: '3D Visualization', href: '/services/3d-visualization' }
    ],
    cta: {
      primary: {
        text: 'Get 3D Quote',
        href: '#contact'
      },
      secondary: {
        text: 'View 3D Portfolio',
        href: '#portfolio'
      }
    }
  },
  services: [
    {
      title: 'Architectural Visualization',
      description: 'Photorealistic 3D renderings of buildings, interiors, and developments that help clients visualize projects before construction.',
      features: [
        'Exterior building renderings',
        'Interior design visualization',
        'Virtual walkthroughs',
        'Development presentations'
      ],
      benefits: [
        'Enhanced project presentations',
        'Improved client communication',
        'Faster design approvals',
        'Reduced construction risks'
      ]
    },
    {
      title: 'Product Visualization',
      description: 'Detailed 3D models and renderings of products for marketing, prototyping, and manufacturing purposes.',
      features: [
        'Product 3D modeling',
        'Technical illustrations',
        'Marketing renderings',
        'Interactive 3D presentations'
      ],
      benefits: [
        'Cost-effective product photography',
        'Unlimited viewing angles',
        'Perfect lighting conditions',
        'Easy design modifications'
      ]
    },
    {
      title: '3D Animation & Motion Graphics',
      description: 'Dynamic 3D animations that showcase products, processes, or architectural spaces in engaging motion.',
      features: [
        'Product demonstration animations',
        'Architectural flythrough',
        'Process visualization',
        'Motion graphics integration'
      ],
      benefits: [
        'Engaging marketing content',
        'Complex concept explanation',
        'Enhanced user engagement',
        'Professional presentation materials'
      ]
    }
  ],
  process: [
    {
      step: 1,
      title: 'Concept & Requirements',
      description: 'We analyze your project requirements, reference materials, and desired visual outcomes.'
    },
    {
      step: 2,
      title: '3D Modeling',
      description: 'Creating detailed 3D models with accurate proportions, materials, and textures.'
    },
    {
      step: 3,
      title: 'Lighting & Rendering',
      description: 'Professional lighting setup and high-quality rendering for photorealistic results.'
    },
    {
      step: 4,
      title: 'Post-Production & Delivery',
      description: 'Final touches, color correction, and delivery in all required formats and resolutions.'
    }
  ],
  featuredAnswer: {
    question: 'What is 3D visualization and how can it benefit my business?',
    answer: '3D visualization creates photorealistic digital representations of products, buildings, or concepts before they exist physically. It helps businesses reduce costs, improve communication, accelerate approvals, and create compelling marketing materials that drive sales and engagement.',
    details: [
      'Reduce prototyping and photography costs by up to 80%',
      'Visualize products and spaces before manufacturing or construction',
      'Create unlimited marketing materials from a single 3D model',
      'Improve client communication and project approval rates'
    ]
  }
};

// Generate Next.js metadata using type-safe helper
export const metadata: Metadata = generatePageMetadata(seoMetadata);

export default function ThreeDVisualizationPage() {
  return (
    <ServicePageTemplate
      metadata={seoMetadata}
      data={pageData}
    />
  );
}
