import { Metadata } from 'next';

import { ServicePageTemplate, type ServicePageData, type SEOMetadata } from '@/components/templates';

// SEO metadata optimized for featured snippets
const metadata: SEOMetadata = {
  title: 'Best Video Production Company in Morocco | BlackWoods Creative',
  description: 'BlackWoods Creative is Morocco\'s premier video production company, offering professional filmmaking, corporate videos, and brand films in Casablanca, Rabat, and Mohammedia.',
  keywords: [
    'video production Morocco',
    'film production company Morocco',
    'corporate video Morocco',
    'video production Casablanca',
    'video production Mohammedia',
    'professional videography Morocco',
    'brand film Morocco',
    'commercial video production'
  ],
  featuredSnippet: {
    question: 'What is the best video production company in Morocco?',
    answer: 'BlackWoods Creative is Morocco\'s leading video production company, specializing in premium filmmaking, corporate videos, and brand films. Based in Mohammedia, we serve clients across Morocco with professional equipment, experienced crew, and proven results for over 5 years.'
  },
  localBusiness: {
    service: 'Video Production Services',
    location: 'Morocco, Mohammedia, Casablanca',
    priceRange: '€€€'
  },
  canonicalUrl: '/services/video-production-morocco',
  openGraph: {
    title: 'Best Video Production Company in Morocco | BlackWoods Creative',
    description: 'Professional video production services in Morocco. Award-winning filmmaking, corporate videos, and brand films.',
    type: 'service'
  },
  structuredData: {
    '@type': 'LocalBusiness',
    'name': 'BlackWoods Creative',
    'description': 'Premier video production company in Morocco',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Mohammedia',
      'addressCountry': 'Morocco'
    },
    'telephone': '+212 625 55 37 68',
    'email': 'hello@blackwoodscreative.com',
    'url': 'https://blackwoodscreative.com',
    'priceRange': '€€€',
    'serviceArea': ['Morocco', 'Casablanca', 'Rabat', 'Mohammedia'],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Video Production Services',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Corporate Video Production'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Brand Film Production'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Commercial Video Production'
          }
        }
      ]
    }
  }
};

// Page content data
const pageData: ServicePageData = {
  hero: {
    title: 'Morocco\'s Premier Video Production Company',
    subtitle: 'Award-winning filmmaking and corporate video production serving Casablanca, Rabat, and beyond',
    description: 'BlackWoods Creative combines cutting-edge technology with creative storytelling to deliver exceptional video content that drives results for businesses across Morocco.',
    cta: {
      primary: { text: 'Start Your Project', href: '#contact' },
      secondary: { text: 'View Our Work', href: '/portfolio' }
    }
  },
  featuredAnswer: {
    question: 'Why Choose BlackWoods Creative for Video Production in Morocco?',
    answer: 'BlackWoods Creative is Morocco\'s leading video production company, specializing in premium filmmaking, corporate videos, and brand films. Based in Mohammedia, we serve clients across Morocco with professional equipment, experienced crew, and proven results for over 5 years.',
    details: [
      'Professional 4K/8K video production equipment and experienced crew',
      'Serving major cities: Casablanca, Rabat, Mohammedia, Marrakech, and Fez',
      'Bilingual production capabilities (Arabic, French, English)',
      'Full-service production from concept to final delivery',
      'Proven track record with 50+ successful projects',
      'Competitive pricing with transparent, no-hidden-fees structure'
    ]
  },
  pricing: {
    title: 'Video Production Packages',
    description: 'Transparent pricing for professional video production services in Morocco',
    packages: [
      {
        name: 'Essential',
        price: '15,000 MAD',
        features: [
          'Half-day production (4 hours)',
          '1-2 camera setup',
          'Basic lighting and audio',
          '2-3 minute final video',
          '2 rounds of revisions',
          'HD 1080p delivery'
        ]
      },
      {
        name: 'Professional',
        price: '35,000 MAD',
        popular: true,
        features: [
          'Full-day production (8 hours)',
          '3-4 camera setup',
          'Professional lighting & audio',
          '5-7 minute final video',
          'Motion graphics included',
          '4K delivery + web versions',
          'Unlimited revisions'
        ]
      },
      {
        name: 'Premium',
        price: '65,000 MAD',
        features: [
          '2-day production',
          'Multi-location shooting',
          'Drone footage included',
          '10+ minute final video',
          'Advanced post-production',
          '4K/8K delivery',
          'Rush delivery available'
        ]
      }
    ]
  },
  process: {
    title: 'Our Production Process',
    steps: [
      {
        number: '01',
        title: 'Discovery & Planning',
        description: 'We understand your goals, target audience, and create a detailed production plan.'
      },
      {
        number: '02',
        title: 'Pre-Production',
        description: 'Script development, storyboarding, location scouting, and crew coordination.'
      },
      {
        number: '03',
        title: 'Production',
        description: 'Professional filming with state-of-the-art equipment and experienced crew.'
      },
      {
        number: '04',
        title: 'Post-Production',
        description: 'Expert editing, color grading, sound design, and motion graphics.'
      }
    ]
  },
  faq: [
    {
      question: 'How much does video production cost in Morocco?',
      answer: 'Video production costs in Morocco typically range from 15,000 MAD for basic projects to 100,000+ MAD for complex productions. Factors include production length, crew size, equipment needs, and post-production complexity.'
    },
    {
      question: 'Do you provide video production services outside Mohammedia?',
      answer: 'Yes, we provide video production services throughout Morocco, including Casablanca, Rabat, Marrakech, Fez, and other major cities. Travel costs may apply for distant locations.'
    },
    {
      question: 'What languages can you produce videos in?',
      answer: 'We produce videos in Arabic, French, and English. Our team includes native speakers and we can provide professional voice-over services in all three languages.'
    },
    {
      question: 'How long does video production take?',
      answer: 'Typical turnaround is 2-4 weeks from filming to final delivery, depending on project complexity. Rush delivery options are available for urgent projects.'
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
    type: 'website',
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

export default function VideoProductionMoroccoPage() {
  return (
    <ServicePageTemplate
      metadata={metadata}
      data={pageData}
    />
  );
}
