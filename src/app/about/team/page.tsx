import { Metadata } from 'next';

import {
  ContentPageTemplate,
  type ContentPageData,
  type SEOMetadata,
  generatePageMetadata
} from '@/components/templates';

// SEO metadata for team page
const seoMetadata: SEOMetadata = {
  title: 'Our Team | BlackWoods Creative - Meet Morocco\'s Premier Visual Storytelling Professionals',
  description: 'Meet the talented team behind BlackWoods Creative. Expert filmmakers, photographers, and 3D artists serving clients across Morocco with exceptional visual content.',
  keywords: [
    'BlackWoods Creative team',
    'video production team Morocco',
    'professional filmmakers Morocco',
    'photography team Mohammedia',
    '3D artists Morocco',
    'creative professionals Morocco',
    'video production crew'
  ],
  canonicalUrl: '/about/team',
  openGraph: {
    title: 'Our Team | BlackWoods Creative - Morocco\'s Visual Storytelling Experts',
    description: 'Meet the creative professionals who make BlackWoods Creative Morocco\'s premier video production company.',
    type: 'website'
  },
  structuredData: {
    '@type': 'AboutPage',
    'mainEntity': {
      '@type': 'Organization',
      'name': 'BlackWoods Creative',
      'employee': [
        {
          '@type': 'Person',
          'name': 'Aladin A.',
          'jobTitle': 'CEO & Director of Photography',
          'worksFor': {
            '@type': 'Organization',
            'name': 'BlackWoods Creative'
          }
        },
        {
          '@type': 'Person',
          'name': 'Hichem Sabri',
          'jobTitle': 'Movie Director & La9atat Media Manager',
          'worksFor': {
            '@type': 'Organization',
            'name': 'BlackWoods Creative'
          }
        },
        {
          '@type': 'Person',
          'name': 'Ibrahim Moufassih',
          'jobTitle': 'Studio Manager & 3D Print Expert',
          'worksFor': {
            '@type': 'Organization',
            'name': 'BlackWoods Creative'
          }
        }
      ]
    }
  }
};

// Page content data
const pageData: ContentPageData = {
  hero: {
    title: 'Our Team',
    subtitle: 'Meet the creative professionals behind Morocco\'s premier visual storytelling company',
    description: 'Our diverse team of experts combines international experience with deep local knowledge to deliver exceptional visual content that drives results for businesses across Morocco.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/about/team' }
    ]
  },
  sections: [
    {
      id: 'team-overview',
      type: 'text',
      data: {
        title: 'Expertise That Drives Results',
        content: `
          <p>At BlackWoods Creative, our success comes from the exceptional talent and dedication of our team. Each member brings unique expertise and passion to every project, ensuring that our clients receive not just high-quality content, but strategic solutions that drive real business results.</p>
          
          <p>Our team combines years of international experience with deep understanding of the Moroccan market, creating content that resonates locally while meeting global standards of excellence.</p>
        `,
        highlight: true
      },
      styling: {
        background: 'primary',
        spacing: 'normal'
      }
    },
    {
      id: 'our-team',
      type: 'values',
      data: {
        title: 'Our Team',
        description: 'Meet the talented professionals who make BlackWoods Creative exceptional',
        values: [
          {
            title: 'Aladin A.',
            description: 'CEO & Director of Photography | 3D Artist\n\nLeads BlackWoods Creative\'s vision and strategic direction while bringing exceptional cinematography expertise to every project. Combines business acumen with artistic excellence to deliver results that exceed client expectations.',
            icon: 'UserIcon'
          },
          {
            title: 'Hichem Sabri',
            description: 'Movie Director | La9atat Media Manager\n\nBrings cinematic storytelling expertise and directorial vision to every project. Specializes in creating compelling narratives that engage audiences and drive action, with extensive experience in both commercial and artistic filmmaking.',
            icon: 'FilmIcon'
          },
          {
            title: 'Ibrahim Moufassih',
            description: 'Studio Manager | 3D Print Expert | Stage Manager\n\nEnsures seamless production operations and brings cutting-edge 3D printing and fabrication capabilities. Manages studio logistics and stage coordination to deliver projects on time and within budget.',
            icon: 'CubeIcon'
          },
          {
            title: 'Karim Saja',
            description: 'Expert Photographer | Editor | Image Technician\n\nMaster of visual storytelling through photography and post-production. Combines technical precision with artistic vision to create stunning imagery that enhances brand presence and marketing effectiveness.',
            icon: 'CameraIcon'
          },
          {
            title: 'Dora A.',
            description: 'General Manager\n\nOversees daily operations and ensures seamless project execution across all departments. Brings organizational excellence and client relationship management expertise to maintain BlackWoods Creative\'s reputation for reliability and quality.',
            icon: 'BriefcaseIcon'
          },
          {
            title: 'Zineb Ammar',
            description: 'Sales Department\n\nBuilds lasting client relationships and identifies opportunities for businesses to leverage visual content for growth. Combines market knowledge with consultative approach to ensure clients achieve their objectives through strategic video content.',
            icon: 'ChartBarIcon'
          },
          {
            title: 'Zyad Sobhi',
            description: 'Sound Department Manager\n\nSpecializes in audio production, sound design, and acoustic engineering. Ensures crystal-clear audio quality and immersive sound experiences that enhance the impact of every video production.',
            icon: 'SpeakerWaveIcon'
          }
        ]
      },
      styling: {
        background: 'secondary',
        spacing: 'normal'
      }
    },
    {
      id: 'team-values',
      type: 'text',
      data: {
        title: 'What Makes Our Team Special',
        content: `
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Collaborative Excellence</h3>
              <p>Every team member contributes their unique expertise as equals, creating a collaborative environment where the best ideas rise to the top, regardless of hierarchy.</p>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Diverse Expertise</h3>
              <p>Our team spans multiple disciplines - from cinematography and photography to 3D visualization and sound design. This diversity enables us to handle complex projects with in-house expertise.</p>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Local Market Knowledge</h3>
              <p>Deep understanding of Moroccan business culture, consumer preferences, and market dynamics ensures content that truly resonates with your target audience.</p>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Unified Vision</h3>
              <p>We work as one cohesive team with shared goals, ensuring seamless collaboration and consistent quality across every aspect of your project.</p>
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
      id: 'call-to-action',
      type: 'cta',
      data: {
        title: 'Ready to Work with Our Team?',
        description: 'Experience the difference that comes from working with Morocco\'s most talented and dedicated visual content professionals.',
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

// Generate Next.js metadata using type-safe helper
export const metadata: Metadata = generatePageMetadata(seoMetadata);

export default function TeamPage() {
  return (
    <ContentPageTemplate
      metadata={seoMetadata}
      data={pageData}
    />
  );
}
