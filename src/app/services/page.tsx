import { Metadata } from 'next';

import {
  ContentPageTemplate,
  type ContentPageData,
  type SEOMetadata,
  generatePageMetadata
} from '@/components/templates';

// SEO metadata for comprehensive services overview
const seoMetadata: SEOMetadata = {
  title: 'Services | BlackWoods Creative - Video Production, Photography & 3D Visualization Morocco',
  description: 'Comprehensive visual content services in Morocco. Professional video production, photography, 3D visualization, and brand films. Serving Casablanca, Rabat, Mohammedia and beyond.',
  keywords: [
    'video production services Morocco',
    'photography services Morocco',
    '3D visualization Morocco',
    'brand film production',
    'corporate video Morocco',
    'visual content services',
    'BlackWoods Creative services'
  ],
  canonicalUrl: '/services',
  openGraph: {
    title: 'Professional Visual Content Services | BlackWoods Creative Morocco',
    description: 'Complete visual storytelling solutions: video production, photography, 3D visualization. Morocco\'s premier creative agency.',
    type: 'website'
  },
  structuredData: {
    '@type': 'Service',
    'provider': {
      '@type': 'Organization',
      'name': 'BlackWoods Creative',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Mohammedia',
        'addressCountry': 'Morocco'
      }
    },
    'serviceType': 'Visual Content Production',
    'areaServed': ['Morocco', 'Casablanca', 'Rabat', 'Mohammedia'],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Visual Content Services',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Video Production',
            'description': 'Professional video production services including corporate videos, brand films, and commercial content'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Photography',
            'description': 'Professional photography services for products, corporate events, and brand imagery'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': '3D Visualization',
            'description': 'Advanced 3D modeling, rendering, and architectural visualization services'
          }
        }
      ]
    }
  }
};

// Page content data
const pageData: ContentPageData = {
  hero: {
    title: 'Our Services',
    subtitle: 'Comprehensive visual content solutions for modern businesses',
    description: 'From concept to completion, we provide end-to-end visual storytelling services that drive results. Discover how our expertise can transform your brand\'s communication.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' }
    ]
  },
  sections: [
    {
      id: 'services-overview',
      type: 'text',
      data: {
        title: 'Complete Visual Storytelling Solutions',
        content: `
          <p>At BlackWoods Creative, we understand that every business has a unique story to tell. Our comprehensive suite of visual content services is designed to help you communicate that story effectively, whether you're reaching customers, training employees, or building brand awareness.</p>
          
          <p>Based in Mohammedia and serving clients across Morocco, we combine international production standards with deep local market knowledge to deliver content that resonates with your audience and drives measurable results.</p>
        `,
        highlight: true
      },
      styling: {
        background: 'primary',
        spacing: 'normal'
      }
    },
    {
      id: 'core-services',
      type: 'values',
      data: {
        title: 'Our Core Services',
        description: 'Professional visual content services tailored to your business needs',
        values: [
          {
            title: 'Video Production',
            description: 'From corporate videos to brand films, we create compelling video content that engages audiences and drives action. Professional equipment, experienced crew, and proven results.',
            icon: 'FilmIcon'
          },
          {
            title: 'Photography',
            description: 'Professional photography services for products, corporate events, team portraits, and brand imagery. High-quality visuals that enhance your professional image.',
            icon: 'CameraIcon'
          },
          {
            title: '3D Visualization',
            description: 'Advanced 3D modeling, rendering, and architectural visualization. Transform concepts into photorealistic visuals for presentations, marketing, and development.',
            icon: 'CubeIcon'
          },
          {
            title: 'Brand Films',
            description: 'Cinematic brand storytelling that captures your company\'s essence and values. Emotional connections that build lasting customer relationships.',
            icon: 'StarIcon'
          },
          {
            title: 'Corporate Training',
            description: 'Educational and training videos that improve employee engagement and knowledge retention. Clear, professional content for internal communications.',
            icon: 'BriefcaseIcon'
          },
          {
            title: 'Digital Marketing',
            description: 'Social media content, promotional videos, and digital campaigns optimized for online platforms and audience engagement.',
            icon: 'ChartBarIcon'
          }
        ]
      },
      styling: {
        background: 'secondary',
        spacing: 'loose'
      }
    },
    {
      id: 'detailed-services',
      type: 'text',
      data: {
        title: 'Detailed Service Offerings',
        content: `
          <div class="space-y-12">
            <div>
              <h3 class="text-2xl font-bold mb-4 text-bw-accent-gold">Video Production Services</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold mb-2">Corporate Videos</h4>
                  <ul class="space-y-1 text-sm">
                    <li>• Company profile videos</li>
                    <li>• Executive interviews</li>
                    <li>• Training and educational content</li>
                    <li>• Internal communications</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold mb-2">Commercial Content</h4>
                  <ul class="space-y-1 text-sm">
                    <li>• Product launch videos</li>
                    <li>• Brand commercials</li>
                    <li>• Customer testimonials</li>
                    <li>• Event documentation</li>
                  </ul>
                </div>
              </div>
              <p class="mt-4"><a href="/services/video-production-morocco" class="text-bw-accent-gold hover:underline">Learn more about our video production services →</a></p>
            </div>
            
            <div>
              <h3 class="text-2xl font-bold mb-4 text-bw-accent-gold">Photography Services</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold mb-2">Corporate Photography</h4>
                  <ul class="space-y-1 text-sm">
                    <li>• Professional headshots</li>
                    <li>• Team photography</li>
                    <li>• Office and facility tours</li>
                    <li>• Corporate event coverage</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold mb-2">Product & Commercial</h4>
                  <ul class="space-y-1 text-sm">
                    <li>• Product photography</li>
                    <li>• Lifestyle and brand imagery</li>
                    <li>• Architectural photography</li>
                    <li>• Marketing campaign visuals</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-2xl font-bold mb-4 text-bw-accent-gold">3D Visualization</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold mb-2">Architectural Visualization</h4>
                  <ul class="space-y-1 text-sm">
                    <li>• 3D building renderings</li>
                    <li>• Interior design visualization</li>
                    <li>• Virtual walkthroughs</li>
                    <li>• Development presentations</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold mb-2">Product Visualization</h4>
                  <ul class="space-y-1 text-sm">
                    <li>• Product 3D modeling</li>
                    <li>• Technical illustrations</li>
                    <li>• Animation and motion graphics</li>
                    <li>• Interactive presentations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `
      },
      styling: {
        background: 'primary',
        spacing: 'normal',
        maxWidth: 'wide'
      }
    },
    {
      id: 'why-choose-us',
      type: 'text',
      data: {
        title: 'Why Choose BlackWoods Creative',
        content: `
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="text-4xl mb-4">🏆</div>
              <h4 class="font-bold mb-2">Proven Excellence</h4>
              <p class="text-sm">100+ successful projects with measurable results for businesses across Morocco.</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-4">🇲🇦</div>
              <h4 class="font-bold mb-2">Local Expertise</h4>
              <p class="text-sm">Deep understanding of Moroccan market, culture, and business landscape.</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-4">🚀</div>
              <h4 class="font-bold mb-2">Cutting-Edge Technology</h4>
              <p class="text-sm">Latest equipment and techniques ensuring professional, future-proof content.</p>
            </div>
          </div>
        `
      },
      styling: {
        background: 'accent',
        spacing: 'normal'
      }
    },
    {
      id: 'service-areas',
      type: 'text',
      data: {
        title: 'Service Areas',
        content: `
          <p>Based in Mohammedia, we proudly serve clients throughout Morocco:</p>
          
          <div class="grid md:grid-cols-2 gap-8 mt-6">
            <div>
              <h4 class="font-bold mb-3">Primary Service Areas</h4>
              <ul class="space-y-2">
                <li>• <strong>Mohammedia</strong> - Our home base with full studio facilities</li>
                <li>• <strong>Casablanca</strong> - Morocco's economic capital</li>
                <li>• <strong>Rabat</strong> - Government and institutional clients</li>
                <li>• <strong>Salé</strong> - Extended Rabat metropolitan area</li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold mb-3">Extended Coverage</h4>
              <ul class="space-y-2">
                <li>• <strong>Marrakech</strong> - Tourism and hospitality sector</li>
                <li>• <strong>Fez</strong> - Cultural and educational institutions</li>
                <li>• <strong>Tangier</strong> - International business hub</li>
                <li>• <strong>Agadir</strong> - Coastal business centers</li>
              </ul>
            </div>
          </div>
        `
      },
      styling: {
        background: 'secondary',
        spacing: 'normal'
      }
    },
    {
      id: 'call-to-action',
      type: 'cta',
      data: {
        title: 'Ready to Transform Your Visual Content?',
        description: 'Let\'s discuss your project and show you how our services can help achieve your business objectives. Get a custom consultation and detailed proposal.',
        text: 'Get Started Today',
        href: '/contact'
      },
      styling: {
        background: 'accent',
        spacing: 'normal'
      }
    }
  ]
};

// Generate Next.js metadata using type-safe helper
export const metadata: Metadata = generatePageMetadata(seoMetadata);

export default function ServicesPage() {
  return (
    <ContentPageTemplate
      metadata={seoMetadata}
      data={pageData}
    />
  );
}
