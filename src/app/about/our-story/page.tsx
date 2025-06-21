import { Metadata } from 'next';

import { 
  ContentPageTemplate, 
  type ContentPageData, 
  type SEOMetadata 
} from '@/components/templates';

// SEO metadata optimized for entity recognition
const metadata: SEOMetadata = {
  title: 'Our Story | BlackWoods Creative - Morocco\'s Premier Visual Storytelling Company',
  description: 'Discover the story behind BlackWoods Creative, Morocco\'s leading video production and visual storytelling company. Founded in Mohammedia, serving clients across Morocco since 2019.',
  keywords: [
    'BlackWoods Creative story',
    'video production company Morocco history',
    'Mohammedia film production',
    'Morocco visual storytelling',
    'company history Morocco',
    'video production team Morocco',
    'BlackWoods Creative founding'
  ],
  canonicalUrl: '/about/our-story',
  openGraph: {
    title: 'Our Story | BlackWoods Creative - Morocco\'s Visual Storytelling Pioneers',
    description: 'The story of how BlackWoods Creative became Morocco\'s premier video production company, serving clients across Casablanca, Rabat, and beyond.',
    type: 'article'
  },
  structuredData: {
    '@type': 'AboutPage',
    'mainEntity': {
      '@type': 'Organization',
      'name': 'BlackWoods Creative',
      'foundingDate': '2019',
      'foundingLocation': {
        '@type': 'Place',
        'name': 'Mohammedia, Morocco'
      },
      'description': 'Morocco\'s premier video production and visual storytelling company',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Mohammedia',
        'addressCountry': 'Morocco'
      },
      'areaServed': ['Morocco', 'Casablanca', 'Rabat', 'Mohammedia', 'Marrakech'],
      'serviceType': ['Video Production', 'Photography', '3D Visualization', 'Brand Films'],
      'url': 'https://blackwoodscreative.com',
      'telephone': '+212 625 55 37 68',
      'email': 'hello@blackwoodscreative.com'
    }
  }
};

// Page content data
const pageData: ContentPageData = {
  hero: {
    title: 'Our Story',
    subtitle: 'The journey of Morocco\'s premier visual storytelling company',
    description: 'From a vision in Mohammedia to serving clients across Morocco, discover how BlackWoods Creative became the trusted partner for businesses seeking exceptional video content.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Our Story', href: '/about/our-story' }
    ]
  },
  sections: [
    {
      id: 'founding-story',
      type: 'text',
      data: {
        title: 'The Beginning',
        content: `
          <p>BlackWoods Creative was born from a simple yet powerful vision: to transform how businesses in Morocco tell their stories through compelling visual content. Founded in 2019 in Mohammedia, our journey began when our founder recognized the untapped potential for premium video production services in the Moroccan market.</p>
          
          <p>What started as a passion project quickly evolved into Morocco's most trusted video production company. Our founder's background in international filmmaking, combined with deep understanding of the local market, created the perfect foundation for building something truly special.</p>
          
          <p>From our first corporate video project to becoming the go-to partner for businesses across Casablanca, Rabat, and beyond, every step of our journey has been guided by one principle: exceptional quality that drives real results for our clients.</p>
        `,
        highlight: true
      },
      styling: {
        background: 'primary',
        spacing: 'normal',
        maxWidth: 'normal'
      }
    },
    {
      id: 'company-timeline',
      type: 'timeline',
      data: {
        title: 'Our Journey',
        events: [
          {
            year: '2019',
            title: 'BlackWoods Creative Founded',
            description: 'Established in Mohammedia with a vision to revolutionize video production in Morocco. First studio setup with professional equipment.',
            highlight: true
          },
          {
            year: '2020',
            title: 'First Major Corporate Clients',
            description: 'Secured partnerships with leading Moroccan businesses, establishing our reputation for quality and reliability in the corporate sector.'
          },
          {
            year: '2021',
            title: 'Expansion Across Morocco',
            description: 'Extended services to Casablanca, Rabat, and other major cities. Invested in advanced 4K production equipment and drone technology.'
          },
          {
            year: '2022',
            title: '3D Visualization Services Launch',
            description: 'Added cutting-edge 3D visualization and architectural rendering services, becoming a full-service visual content provider.'
          },
          {
            year: '2023',
            title: 'International Recognition',
            description: 'Received industry recognition for innovative video production techniques and exceptional client service standards.'
          },
          {
            year: '2024',
            title: 'AI-First Content Strategy',
            description: 'Pioneered AI-optimized content creation, helping clients dominate search results and digital presence.',
            highlight: true
          },
          {
            year: '2025',
            title: 'Market Leadership',
            description: 'Established as Morocco\'s premier video production company, serving 100+ satisfied clients with proven ROI results.',
            highlight: true
          }
        ]
      },
      styling: {
        background: 'secondary',
        spacing: 'loose'
      }
    },
    {
      id: 'mission-vision',
      type: 'text',
      data: {
        title: 'Our Mission & Vision',
        content: `
          <div class="grid md:grid-cols-2 gap-12">
            <div>
              <h3 class="text-2xl font-bold mb-4 text-bw-accent-gold">Our Mission</h3>
              <p>To empower businesses across Morocco with exceptional visual storytelling that drives real results. We combine cutting-edge technology with creative expertise to transform how companies communicate with their audiences.</p>
            </div>
            <div>
              <h3 class="text-2xl font-bold mb-4 text-bw-accent-gold">Our Vision</h3>
              <p>To be the definitive leader in visual content creation across North Africa, setting the standard for quality, innovation, and client success in the digital age.</p>
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
      id: 'core-values',
      type: 'values',
      data: {
        title: 'Our Core Values',
        description: 'The principles that guide everything we do at BlackWoods Creative',
        values: [
          {
            title: 'Excellence',
            description: 'We never compromise on quality. Every project receives our full attention and expertise, regardless of size or budget.',
            icon: 'StarIcon'
          },
          {
            title: 'Innovation',
            description: 'We stay ahead of industry trends, constantly investing in new technology and techniques to deliver cutting-edge results.',
            icon: 'RocketLaunchIcon'
          },
          {
            title: 'Collaboration',
            description: 'We work as true partners with our clients, ensuring their vision is realized while bringing our creative expertise to every project.',
            icon: 'HandRaisedIcon'
          },
          {
            title: 'Integrity',
            description: 'Transparent communication, honest timelines, and fair pricing. We build lasting relationships based on trust and reliability.',
            icon: 'ShieldCheckIcon'
          },
          {
            title: 'Local Expertise',
            description: 'Deep understanding of the Moroccan market, culture, and business landscape enables us to create content that truly resonates.',
            icon: 'GlobeAltIcon'
          },
          {
            title: 'Results-Driven',
            description: 'Every piece of content we create is designed with specific business objectives in mind, ensuring measurable impact for our clients.',
            icon: 'ArrowTrendingUpIcon'
          }
        ]
      },
      styling: {
        background: 'accent',
        spacing: 'loose'
      }
    },
    {
      id: 'morocco-expertise',
      type: 'text',
      data: {
        title: 'Why Morocco Chose Us',
        content: `
          <p>Our success in the Moroccan market isn't accidental. We've built our reputation on understanding the unique needs of businesses operating in Morocco's dynamic economy.</p>
          
          <p><strong>Local Market Knowledge:</strong> We understand the cultural nuances, business practices, and communication preferences that make content effective in Morocco.</p>
          
          <p><strong>Multilingual Capabilities:</strong> Our team produces content in Arabic, French, and English, ensuring your message reaches every segment of your target audience.</p>
          
          <p><strong>Strategic Location:</strong> Based in Mohammedia with easy access to Casablanca, Rabat, and other major business centers, we're perfectly positioned to serve clients across Morocco.</p>
          
          <p><strong>Proven Track Record:</strong> Over 100 successful projects with measurable results, from increased brand awareness to direct sales impact.</p>
        `,
        columns: 1
      },
      styling: {
        background: 'primary',
        spacing: 'normal',
        maxWidth: 'normal'
      }
    },
    {
      id: 'related-pages',
      type: 'text',
      data: {
        title: 'Learn More About BlackWoods Creative',
        content: `
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center p-6 bg-bw-border-subtle/10 rounded-2xl">
              <h4 class="font-bold mb-3">Our Workflow</h4>
              <p class="text-sm mb-4">Discover our proven process that delivers exceptional results</p>
              <a href="/about/our-workflow" class="btn-secondary">Learn Our Process</a>
            </div>
            <div class="text-center p-6 bg-bw-border-subtle/10 rounded-2xl">
              <h4 class="font-bold mb-3">Meet Our Team</h4>
              <p class="text-sm mb-4">Get to know the creative professionals behind our success</p>
              <a href="/about/team" class="btn-secondary">Meet the Team</a>
            </div>
            <div class="text-center p-6 bg-bw-border-subtle/10 rounded-2xl">
              <h4 class="font-bold mb-3">Our Facilities</h4>
              <p class="text-sm mb-4">Explore our state-of-the-art studio and equipment</p>
              <a href="/about/location" class="btn-secondary">Visit Our Studio</a>
            </div>
          </div>
        `
      },
      styling: {
        background: 'secondary',
        spacing: 'normal',
        maxWidth: 'wide'
      }
    },
    {
      id: 'call-to-action',
      type: 'cta',
      data: {
        title: 'Ready to Write Your Story?',
        description: 'Join the growing list of successful businesses that trust BlackWoods Creative with their visual storytelling needs.',
        text: 'Start Your Project',
        href: '#contact'
      },
      styling: {
        background: 'accent',
        spacing: 'normal'
      }
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

export default function OurStoryPage() {
  return (
    <ContentPageTemplate
      metadata={metadata}
      data={pageData}
    />
  );
}
