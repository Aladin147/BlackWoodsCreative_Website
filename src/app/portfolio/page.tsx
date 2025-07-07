import { Metadata } from 'next';

import {
  ContentPageTemplate,
  type ContentPageData,
  type SEOMetadata,
  generatePageMetadata,
} from '@/components/templates';

// SEO metadata
const seoMetadata: SEOMetadata = {
  title: 'Portfolio | BlackWoods Creative - Our Best Video Production Work in Morocco',
  description:
    "Explore BlackWoods Creative's portfolio of exceptional video production, photography, and 3D visualization projects. See our work for clients across Morocco.",
  keywords: [
    'BlackWoods Creative portfolio',
    'video production portfolio Morocco',
    'corporate video examples',
    'photography portfolio Morocco',
    '3D visualization examples',
    'creative work Morocco',
    'video production showcase',
  ],
  canonicalUrl: '/portfolio',
  openGraph: {
    title: 'Portfolio | BlackWoods Creative - Our Best Work in Morocco',
    description:
      'Discover our exceptional video production, photography, and 3D visualization work for clients across Morocco.',
    type: 'website',
  },
};

// Page content data
const pageData: ContentPageData = {
  hero: {
    title: 'Our Portfolio',
    subtitle: 'Showcasing exceptional visual storytelling across Morocco',
    description:
      'Explore our diverse portfolio of video production, photography, and 3D visualization projects that have helped businesses across Morocco achieve their goals.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Portfolio', href: '/portfolio' },
    ],
  },
  sections: [
    {
      id: 'portfolio-overview',
      type: 'text',
      data: {
        title: 'Our Creative Excellence',
        content: `
          <p>At BlackWoods Creative, every project is an opportunity to push creative boundaries while delivering measurable results for our clients. Our portfolio represents years of collaboration with businesses across Morocco, from startups to established enterprises.</p>
          
          <p>Each project showcases our commitment to quality, creativity, and strategic thinking that drives real business outcomes.</p>
        `,
        highlight: true,
      },
      styling: {
        background: 'primary',
        spacing: 'normal',
      },
    },
    {
      id: 'featured-projects',
      type: 'values',
      data: {
        title: 'Featured Projects',
        description:
          'Highlighting our most impactful work across different industries and services',
        values: [
          {
            title: 'Corporate Brand Films',
            description:
              'Cinematic brand storytelling for leading Moroccan companies. These films capture company culture, values, and vision while engaging audiences emotionally.',
            icon: 'FilmIcon',
          },
          {
            title: 'Product Launch Campaigns',
            description:
              'Complete visual campaigns for product launches, including video content, photography, and 3D visualizations that drive market success.',
            icon: 'RocketLaunchIcon',
          },
          {
            title: 'Executive Interviews',
            description:
              'Professional interview productions featuring C-level executives, thought leaders, and industry experts across Morocco.',
            icon: 'UserIcon',
          },
          {
            title: 'Architectural Visualizations',
            description:
              'Photorealistic 3D renderings and virtual tours for real estate developments and architectural projects throughout Morocco.',
            icon: 'CubeIcon',
          },
          {
            title: 'Event Documentation',
            description:
              'Comprehensive coverage of corporate events, conferences, and celebrations with both video and photography services.',
            icon: 'CameraIcon',
          },
          {
            title: 'Training & Educational Content',
            description:
              'Engaging educational videos and training materials that improve employee performance and knowledge retention.',
            icon: 'BriefcaseIcon',
          },
        ],
      },
      styling: {
        background: 'secondary',
        spacing: 'loose',
      },
    },
    {
      id: 'industries-served',
      type: 'text',
      data: {
        title: 'Industries We Serve',
        content: `
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Technology & Innovation</h3>
              <p class="mb-4">Software companies, tech startups, and innovation hubs across Morocco seeking to communicate complex solutions through compelling visual content.</p>
              
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Real Estate & Construction</h3>
              <p class="mb-4">Developers, architects, and construction companies using our 3D visualization and video services to showcase projects and attract investors.</p>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Manufacturing & Industry</h3>
              <p class="mb-4">Industrial companies documenting processes, showcasing capabilities, and creating training content for their workforce.</p>
              
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Healthcare & Education</h3>
              <p class="mb-4">Medical institutions and educational organizations creating informative content that educates and builds trust with their audiences.</p>
            </div>
          </div>
        `,
      },
      styling: {
        background: 'primary',
        spacing: 'normal',
        maxWidth: 'wide',
      },
    },
    {
      id: 'client-results',
      type: 'values',
      data: {
        title: 'Client Success Stories',
        description: 'Real results achieved through our visual content solutions',
        values: [
          {
            title: '300% Increase in Engagement',
            description:
              'A Casablanca tech company saw 300% higher engagement rates after implementing our video content strategy across their digital platforms.',
            icon: 'ArrowTrendingUpIcon',
          },
          {
            title: '50% Faster Sales Cycles',
            description:
              'A real estate developer in Rabat reduced their sales cycle by 50% using our 3D visualizations and virtual tour technology.',
            icon: 'RocketLaunchIcon',
          },
          {
            title: '85% Improved Brand Recognition',
            description:
              'A manufacturing company achieved 85% improvement in brand recognition after our comprehensive brand film and photography campaign.',
            icon: 'StarIcon',
          },
        ],
      },
      styling: {
        background: 'accent',
        spacing: 'normal',
      },
    },
    {
      id: 'portfolio-note',
      type: 'text',
      data: {
        title: 'View Our Complete Portfolio',
        content: `
          <p class="text-center">Due to client confidentiality agreements, many of our best projects cannot be displayed publicly. We'd be happy to share relevant case studies and examples during a consultation that align with your industry and project requirements.</p>
          
          <p class="text-center mt-6">
            <strong>Ready to see how we can help your business?</strong><br>
            Contact us for a personalized portfolio presentation and project consultation.
          </p>
        `,
        highlight: true,
      },
      styling: {
        background: 'secondary',
        spacing: 'normal',
      },
    },
    {
      id: 'call-to-action',
      type: 'cta',
      data: {
        title: 'Ready to Create Something Amazing?',
        description:
          "Let's discuss your project and show you how our creative expertise can help achieve your business objectives.",
        text: 'Start Your Project',
        href: '#contact',
      },
      styling: {
        background: 'accent',
        spacing: 'normal',
      },
    },
  ],
};

// Generate Next.js metadata using type-safe helper
export const metadata: Metadata = generatePageMetadata(seoMetadata);

export default function PortfolioPage() {
  return <ContentPageTemplate metadata={seoMetadata} data={pageData} />;
}
