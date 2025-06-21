import { Metadata } from 'next';

import { ServicePageTemplate, type ServicePageData, type SEOMetadata } from '@/components/templates';

// SEO metadata optimized for featured snippets
const metadata: SEOMetadata = {
  title: 'Corporate Video Production Cost in Morocco | Pricing Guide 2024',
  description: 'Complete guide to corporate video production costs in Morocco. Professional pricing from 15,000 MAD to 100,000+ MAD. Get transparent quotes from BlackWoods Creative.',
  keywords: [
    'corporate video cost Morocco',
    'video production pricing Morocco',
    'corporate video rates Morocco',
    'video production budget Morocco',
    'business video cost Casablanca',
    'corporate film pricing Mohammedia',
    'video production quotes Morocco'
  ],
  featuredSnippet: {
    question: 'How much does a corporate video cost in Morocco?',
    answer: 'Corporate video production in Morocco costs between 15,000 MAD and 100,000+ MAD depending on complexity. Basic corporate videos start at 15,000 MAD, professional productions average 35,000 MAD, while premium multi-day shoots with advanced post-production can exceed 100,000 MAD.'
  },
  localBusiness: {
    service: 'Corporate Video Production',
    location: 'Morocco, Mohammedia, Casablanca',
    priceRange: '15,000 MAD - 100,000+ MAD'
  },
  canonicalUrl: '/services/corporate-video-pricing-morocco',
  openGraph: {
    title: 'Corporate Video Production Cost in Morocco | Pricing Guide 2024',
    description: 'Transparent corporate video pricing in Morocco. Professional rates from 15,000 MAD to 100,000+ MAD.',
    type: 'article'
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
    title: 'Corporate Video Production Pricing in Morocco',
    subtitle: 'Transparent, competitive rates for professional corporate video production',
    description: 'Get clear, upfront pricing for your corporate video project. From company profiles to training videos, we offer flexible packages to fit your budget and goals.',
    cta: {
      primary: { text: 'Get Custom Quote', href: '#contact' },
      secondary: { text: 'View Pricing Details', href: '#pricing' }
    }
  },
  featuredAnswer: {
    question: 'What factors determine corporate video production costs in Morocco?',
    answer: 'Corporate video production in Morocco costs between 15,000 MAD and 100,000+ MAD depending on complexity. Basic corporate videos start at 15,000 MAD, professional productions average 35,000 MAD, while premium multi-day shoots with advanced post-production can exceed 100,000 MAD.',
    details: [
      'Video length and complexity (2-10+ minutes)',
      'Number of shooting days and locations',
      'Crew size and equipment requirements',
      'Post-production needs (graphics, animation, color grading)',
      'Talent and voice-over requirements',
      'Delivery timeline and rush fees',
      'Usage rights and distribution needs'
    ]
  },
  pricing: {
    title: 'Corporate Video Pricing Packages',
    description: 'Choose the package that best fits your corporate video needs and budget',
    packages: [
      {
        name: 'Basic Corporate',
        price: '15,000 MAD',
        features: [
          'Half-day production (4 hours)',
          'Single location shooting',
          '1-2 camera setup',
          '2-3 minute final video',
          'Basic interviews & b-roll',
          'Simple graphics & titles',
          'HD 1080p delivery',
          '2 rounds of revisions'
        ]
      },
      {
        name: 'Professional Corporate',
        price: '35,000 MAD',
        popular: true,
        features: [
          'Full-day production (8 hours)',
          'Up to 2 locations',
          '3-4 camera setup',
          '5-7 minute final video',
          'Professional interviews',
          'Advanced motion graphics',
          '4K delivery + web versions',
          'Professional voice-over',
          'Unlimited revisions'
        ]
      },
      {
        name: 'Premium Corporate',
        price: '65,000 MAD',
        features: [
          '2-day production',
          'Multiple locations',
          'Full crew & equipment',
          '10+ minute final video',
          'Drone footage included',
          'Advanced post-production',
          'Custom animations',
          'Multi-language versions',
          'Rush delivery available'
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
      question: 'What\'s included in the base price for corporate video production?',
      answer: 'Base prices include pre-production planning, filming with professional equipment, basic post-production editing, and final delivery. Additional costs may apply for extra locations, talent, rush delivery, or advanced graphics.'
    },
    {
      question: 'How do you calculate pricing for multi-location corporate videos?',
      answer: 'Multi-location shoots add 3,000-8,000 MAD per additional location, depending on distance and setup complexity. We provide detailed quotes including travel time and equipment transport costs.'
    },
    {
      question: 'Do you offer payment plans for larger corporate video projects?',
      answer: 'Yes, we offer flexible payment terms for projects over 50,000 MAD. Typically 50% upfront, 25% at production start, and 25% upon final delivery.'
    },
    {
      question: 'What\'s the difference between HD and 4K pricing?',
      answer: '4K production adds approximately 20-30% to the base cost due to additional storage, processing time, and equipment requirements. We recommend 4K for large screen presentations and future-proofing.'
    },
    {
      question: 'Are there additional costs for corporate video distribution?',
      answer: 'Basic delivery includes standard formats for web and presentation use. Additional costs may apply for broadcast specifications, multiple language versions, or specialized distribution formats.'
    }
  ]
};

// Generate Next.js metadata
export const metadata_export: Metadata = {
  title: metadata.title,
  description: metadata.description,
  keywords: metadata.keywords,
  openGraph: {
    title: metadata.openGraph?.title,
    description: metadata.openGraph?.description,
    type: 'article',
    locale: 'en_US',
    siteName: 'BlackWoods Creative',
  },
  twitter: {
    card: 'summary_large_image',
    title: metadata.title,
    description: metadata.description,
  },
  alternates: {
    canonical: `https://blackwoodscreative.com${metadata.canonicalUrl}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function CorporateVideoPricingMoroccoPage() {
  return (
    <ServicePageTemplate
      metadata={metadata}
      data={pageData}
    />
  );
}
