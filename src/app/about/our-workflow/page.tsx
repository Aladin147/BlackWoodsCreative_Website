import { Metadata } from 'next';

import { 
  ContentPageTemplate, 
  type ContentPageData, 
  type SEOMetadata 
} from '@/components/templates';

// SEO metadata optimized for process and methodology searches
const metadata: SEOMetadata = {
  title: 'Our Workflow | BlackWoods Creative - Professional Video Production Process',
  description: 'Discover BlackWoods Creative\'s proven video production workflow. From concept to delivery, learn about our systematic approach that ensures exceptional results for every project in Morocco.',
  keywords: [
    'video production workflow Morocco',
    'film production process',
    'video production methodology',
    'professional video workflow',
    'BlackWoods Creative process',
    'video production steps Morocco',
    'corporate video workflow'
  ],
  canonicalUrl: '/about/our-workflow',
  openGraph: {
    title: 'Our Workflow | Professional Video Production Process in Morocco',
    description: 'Systematic, proven workflow that delivers exceptional video content. Quality standards and methodology that sets BlackWoods Creative apart.',
    type: 'article'
  },
  structuredData: {
    '@type': 'HowTo',
    'name': 'Professional Video Production Workflow',
    'description': 'BlackWoods Creative\'s systematic approach to video production',
    'totalTime': 'PT2W',
    'supply': [
      'Professional 4K/8K cameras',
      'Advanced lighting equipment',
      'Professional audio recording',
      'Drone technology',
      'Post-production software'
    ],
    'tool': [
      'Sony FX6 cameras',
      'DJI drones',
      'Adobe Creative Suite',
      'DaVinci Resolve',
      'Professional lighting kits'
    ]
  }
};

// Page content data
const pageData: ContentPageData = {
  hero: {
    title: 'Our Workflow',
    subtitle: 'The systematic approach that delivers exceptional results',
    description: 'Every great video starts with a great process. Discover the proven methodology that has made BlackWoods Creative Morocco\'s most trusted video production partner.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Our Workflow', href: '/about/our-workflow' }
    ]
  },
  sections: [
    {
      id: 'workflow-overview',
      type: 'text',
      data: {
        title: 'Our Proven Process',
        content: `
          <p>At BlackWoods Creative, we believe that exceptional video content is the result of exceptional process. Our workflow has been refined through hundreds of successful projects, ensuring that every client receives the same high standard of service and results.</p>
          
          <p>Our systematic approach combines creative excellence with operational efficiency, delivering projects on time, on budget, and beyond expectations. From initial consultation to final delivery, every step is designed to maximize value and minimize stress for our clients.</p>
        `,
        highlight: true
      },
      styling: {
        background: 'primary',
        spacing: 'normal'
      }
    },
    {
      id: 'detailed-process',
      type: 'timeline',
      data: {
        title: 'Step-by-Step Process',
        events: [
          {
            year: '01',
            title: 'Discovery & Strategy',
            description: 'We begin with an in-depth consultation to understand your objectives, target audience, brand guidelines, and success metrics. This foundation ensures every creative decision aligns with your business goals.',
            highlight: true
          },
          {
            year: '02',
            title: 'Concept Development',
            description: 'Our creative team develops multiple concept options, complete with visual references, tone guidelines, and strategic rationale. We collaborate closely to refine the concept until it perfectly captures your vision.'
          },
          {
            year: '03',
            title: 'Pre-Production Planning',
            description: 'Detailed planning phase including script development, storyboarding, location scouting, casting, equipment selection, and scheduling. Every detail is confirmed before production begins.'
          },
          {
            year: '04',
            title: 'Production Execution',
            description: 'Professional filming with our experienced crew using state-of-the-art equipment. We maintain the highest quality standards while ensuring minimal disruption to your business operations.'
          },
          {
            year: '05',
            title: 'Post-Production',
            description: 'Expert editing, color grading, sound design, and motion graphics. We provide regular updates and incorporate your feedback throughout the post-production process.'
          },
          {
            year: '06',
            title: 'Review & Refinement',
            description: 'Structured review process with multiple revision rounds. We ensure the final product exceeds your expectations and meets all technical specifications.'
          },
          {
            year: '07',
            title: 'Delivery & Support',
            description: 'Final delivery in all required formats, complete with usage guidelines and ongoing support. We provide training on content distribution and optimization strategies.',
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
      id: 'quality-standards',
      type: 'values',
      data: {
        title: 'Our Quality Standards',
        description: 'The principles that ensure consistent excellence in every project',
        values: [
          {
            title: 'Technical Excellence',
            description: 'Professional-grade equipment, proper lighting, crystal-clear audio, and meticulous attention to technical details.',
            icon: '🎥'
          },
          {
            title: 'Creative Innovation',
            description: 'Fresh perspectives, creative problem-solving, and innovative approaches that make your content stand out.',
            icon: '💡'
          },
          {
            title: 'Brand Consistency',
            description: 'Every element aligns with your brand guidelines, ensuring consistent messaging across all touchpoints.',
            icon: '🎨'
          },
          {
            title: 'Deadline Reliability',
            description: 'Rigorous project management ensures on-time delivery without compromising quality standards.',
            icon: '⏰'
          },
          {
            title: 'Client Collaboration',
            description: 'Regular communication, transparent progress updates, and collaborative decision-making throughout the process.',
            icon: '🤝'
          },
          {
            title: 'Results Focus',
            description: 'Every creative decision is evaluated against your business objectives and success metrics.',
            icon: '🎯'
          }
        ]
      },
      styling: {
        background: 'accent',
        spacing: 'normal'
      }
    },
    {
      id: 'technology-equipment',
      type: 'text',
      data: {
        title: 'Technology & Equipment',
        content: `
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-bold mb-4">Camera Systems</h3>
              <ul class="space-y-2">
                <li>• Sony FX6 & FX9 professional cameras</li>
                <li>• 4K/8K recording capabilities</li>
                <li>• Full-frame and Super 35 sensors</li>
                <li>• Professional lens collection</li>
              </ul>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4">Audio Equipment</h3>
              <ul class="space-y-2">
                <li>• Wireless microphone systems</li>
                <li>• Professional boom operators</li>
                <li>• Multi-track recording capabilities</li>
                <li>• Studio-quality audio processing</li>
              </ul>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4">Lighting & Grip</h3>
              <ul class="space-y-2">
                <li>• LED and tungsten lighting kits</li>
                <li>• Professional grip equipment</li>
                <li>• Stabilization systems</li>
                <li>• Drone cinematography</li>
              </ul>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4">Post-Production</h3>
              <ul class="space-y-2">
                <li>• Adobe Creative Suite</li>
                <li>• DaVinci Resolve color grading</li>
                <li>• Pro Tools audio mixing</li>
                <li>• Motion graphics and animation</li>
              </ul>
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
      id: 'client-collaboration',
      type: 'text',
      data: {
        title: 'Client Collaboration Model',
        content: `
          <p>We believe the best results come from true partnership. Our collaborative approach ensures your expertise and our creative skills combine to create something exceptional.</p>
          
          <p><strong>Regular Check-ins:</strong> Scheduled progress updates at every major milestone, ensuring you're always informed and involved in key decisions.</p>
          
          <p><strong>Transparent Communication:</strong> Direct access to project managers and creative leads, with clear timelines and expectations set from day one.</p>
          
          <p><strong>Flexible Feedback:</strong> Structured review processes that accommodate your schedule and decision-making requirements.</p>
          
          <p><strong>Strategic Guidance:</strong> We don't just execute your vision – we contribute strategic insights to help you achieve better results.</p>
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
        title: 'Experience Our Process',
        description: 'Ready to see how our proven workflow can transform your next video project? Let\'s discuss your objectives and show you exactly how we\'ll bring your vision to life.',
        text: 'Start Your Project',
        href: '/contact'
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

export default function OurWorkflowPage() {
  return (
    <ContentPageTemplate
      metadata={metadata}
      data={pageData}
    />
  );
}
