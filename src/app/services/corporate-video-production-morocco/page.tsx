import { Metadata } from 'next';

import { ServicePageTemplate, type ServicePageData, type SEOMetadata, generatePageMetadata } from '@/components/templates';

// SEO metadata optimized for featured snippets
const seoMetadata: SEOMetadata = {
  title: 'Corporate Video Production in Morocco | Professional Services',
  description: 'Professional corporate video production services in Morocco. Custom solutions for businesses across Casablanca, Rabat, and Mohammedia. Contact BlackWoods Creative for consultation.',
  keywords: [
    'corporate video production Morocco',
    'business video services Morocco',
    'corporate film production Morocco',
    'professional video Morocco',
    'company video Casablanca',
    'corporate videography Mohammedia',
    'business video consultation Morocco'
  ],
  featuredSnippet: {
    question: 'What factors determine corporate video production costs in Morocco?',
    answer: 'Corporate video production costs in Morocco depend on several key factors: video length and complexity, number of shooting locations, crew size and equipment needs, post-production requirements, timeline, and specific business objectives. Professional consultation helps determine the best approach for your budget.'
  },
  localBusiness: {
    service: 'Corporate Video Production',
    location: 'Morocco, Mohammedia, Casablanca'
  },
  canonicalUrl: '/services/corporate-video-production-morocco',
  openGraph: {
    title: 'Corporate Video Production in Morocco | Professional Services',
    description: 'Professional corporate video production services in Morocco. Custom solutions for businesses.',
    type: 'service'
  },
  structuredData: {
    '@type': 'Article',
    'headline': 'Corporate Video Production Cost in Morocco | Pricing Guide 2024',
    'description': 'Complete guide to corporate video production costs in Morocco',
    'author': {
      '@type': 'Organization',
      'name': 'BlackWoods Creative'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'BlackWoods Creative',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://blackwoodscreative.com/logo.png'
      }
    },
    'mainEntity': {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How much does a corporate video cost in Morocco?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Corporate video production in Morocco costs between 15,000 MAD and 100,000+ MAD depending on complexity. Basic corporate videos start at 15,000 MAD, professional productions average 35,000 MAD, while premium multi-day shoots with advanced post-production can exceed 100,000 MAD.'
          }
        }
      ]
    }
  }
};

// Page content data
const pageData: ServicePageData = {
  hero: {
    title: 'Corporate Video Production in Morocco',
    subtitle: 'Professional video solutions that elevate your business communication',
    description: 'Transform your corporate messaging with compelling video content. From company profiles to training videos, we create professional videos that engage your audience and drive results.',
    cta: {
      primary: { text: 'Get Custom Quote', href: '#contact' },
      secondary: { text: 'View Our Services', href: '#services' }
    }
  },
  featuredAnswer: {
    question: 'What factors determine corporate video production costs in Morocco?',
    answer: 'Corporate video production costs in Morocco depend on several key factors: video length and complexity, number of shooting locations, crew size and equipment needs, post-production requirements, timeline, and specific business objectives. Professional consultation helps determine the best approach for your budget.',
    details: [
      'Video length and complexity requirements',
      'Number of shooting days and locations needed',
      'Crew size and professional equipment specifications',
      'Post-production needs (graphics, animation, color grading)',
      'Talent requirements and voice-over services',
      'Project timeline and delivery schedule',
      'Usage rights and distribution requirements',
      'Custom consultation to optimize your investment'
    ]
  },
  services: {
    title: 'Corporate Video Solutions',
    description: 'Comprehensive video services designed to meet your business communication needs',
    offerings: [
      {
        name: 'Company Profile Videos',
        features: [
          'Executive interviews and messaging',
          'Company culture showcase',
          'Facility and team highlights',
          'Brand story development',
          'Professional presentation quality',
          'Multi-platform optimization'
        ]
      },
      {
        name: 'Training & Educational',
        popular: true,
        features: [
          'Employee training modules',
          'Safety and compliance videos',
          'Product demonstration guides',
          'Onboarding content',
          'Interactive learning materials',
          'Multi-language support available'
        ]
      },
      {
        name: 'Marketing & Promotional',
        features: [
          'Product launch campaigns',
          'Service explanations',
          'Customer testimonials',
          'Event documentation',
          'Social media content',
          'Brand awareness campaigns'
        ]
      }
    ]
  },
  process: {
    title: 'Corporate Video Production Process',
    steps: [
      {
        number: '01',
        title: 'Consultation & Quote',
        description: 'We discuss your objectives, target audience, and provide a detailed quote based on your specific needs.'
      },
      {
        number: '02',
        title: 'Script & Storyboard',
        description: 'Professional script writing and visual planning to ensure your message is clear and engaging.'
      },
      {
        number: '03',
        title: 'Production Day',
        description: 'Professional filming with experienced crew, quality equipment, and minimal disruption to your business.'
      },
      {
        number: '04',
        title: 'Post & Delivery',
        description: 'Expert editing, graphics, and final delivery in all required formats for your distribution needs.'
      }
    ]
  },
  faq: [
    {
      question: 'What\'s included in corporate video production services?',
      answer: 'Our corporate video production includes comprehensive pre-production planning, professional filming with high-quality equipment, expert post-production editing, and final delivery in your preferred formats. We handle everything from concept development to final delivery.'
    },
    {
      question: 'How do you handle multi-location corporate video shoots?',
      answer: 'We have extensive experience with multi-location productions across Morocco. Our team coordinates logistics, equipment transport, and scheduling to ensure seamless production across different sites while maintaining consistent quality and messaging.'
    },
    {
      question: 'Do you provide consultation for corporate video strategy?',
      answer: 'Yes, we offer comprehensive consultation services to help you develop an effective video strategy. We work with you to understand your objectives, target audience, and desired outcomes to create the most impactful video content for your business.'
    },
    {
      question: 'What\'s the difference between HD and 4K production?',
      answer: '4K production offers superior image quality and future-proofing for your content. We recommend 4K for large screen presentations, detailed product showcases, and content that may be repurposed across multiple platforms. We\'ll help you choose the best format for your specific needs.'
    },
    {
      question: 'How do you ensure corporate video content aligns with our brand?',
      answer: 'We begin every project with a thorough brand consultation to understand your visual identity, messaging, and corporate standards. Our team works closely with your marketing department to ensure all content maintains brand consistency and professional quality.'
    }
  ]
};

// Generate Next.js metadata using type-safe helper
export const metadata: Metadata = generatePageMetadata(seoMetadata);

export default function CorporateVideoPricingMoroccoPage() {
  return (
    <ServicePageTemplate
      metadata={seoMetadata}
      data={pageData}
    />
  );
}
