import { Metadata } from 'next';

import { 
  ContentPageTemplate, 
  type ContentPageData, 
  type SEOMetadata 
} from '@/components/templates';

// SEO metadata for team page
const metadata: SEOMetadata = {
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
      id: 'leadership-team',
      type: 'values',
      data: {
        title: 'Leadership Team',
        description: 'The visionaries and leaders who guide BlackWoods Creative\'s strategic direction',
        values: [
          {
            title: 'Aladin A.',
            description: 'CEO & Director of Photography | 3D Artist\n\nLeads BlackWoods Creative\'s vision and strategic direction while bringing exceptional cinematography expertise to every project. Combines business acumen with artistic excellence to deliver results that exceed client expectations.',
            icon: 'UserIcon'
          },
          {
            title: 'Dora A.',
            description: 'General Manager\n\nOversees daily operations and ensures seamless project execution across all departments. Brings organizational excellence and client relationship management expertise to maintain BlackWoods Creative\'s reputation for reliability and quality.',
            icon: 'BriefcaseIcon'
          }
        ]
      },
      styling: {
        background: 'secondary',
        spacing: 'normal'
      }
    },
    {
      id: 'creative-team',
      type: 'values',
      data: {
        title: 'Creative Department',
        description: 'The artistic minds who bring your vision to life with exceptional creativity and technical skill',
        values: [
          {
            title: 'Hichem Sabri',
            description: 'Movie Director | La9atat Media Manager\n\nBrings cinematic storytelling expertise and directorial vision to every project. Specializes in creating compelling narratives that engage audiences and drive action, with extensive experience in both commercial and artistic filmmaking.',
            icon: 'FilmIcon'
          },
          {
            title: 'Karim Saja',
            description: 'Expert Photographer | Editor | Image Technician\n\nMaster of visual storytelling through photography and post-production. Combines technical precision with artistic vision to create stunning imagery that enhances brand presence and marketing effectiveness.',
            icon: 'CameraIcon'
          }
        ]
      },
      styling: {
        background: 'primary',
        spacing: 'normal'
      }
    },
    {
      id: 'technical-team',
      type: 'values',
      data: {
        title: 'Technical & Production',
        description: 'The technical experts who ensure flawless execution and innovative solutions',
        values: [
          {
            title: 'Ibrahim Moufassih',
            description: 'Studio Manager | 3D Print Expert | Stage Manager\n\nEnsures seamless production operations and brings cutting-edge 3D printing and fabrication capabilities. Manages studio logistics and stage coordination to deliver projects on time and within budget.',
            icon: 'CubeIcon'
          },
          {
            title: 'Zyad Sobhi',
            description: 'Sound Department Manager\n\nSpecializes in audio production, sound design, and acoustic engineering. Ensures crystal-clear audio quality and immersive sound experiences that enhance the impact of every video production.',
            icon: 'SpeakerWaveIcon'
          }
        ]
      },
      styling: {
        background: 'accent',
        spacing: 'normal'
      }
    },
    {
      id: 'business-development',
      type: 'values',
      data: {
        title: 'Business Development',
        description: 'The relationship builders who connect with clients and drive business growth',
        values: [
          {
            title: 'Zineb Ammar',
            description: 'Sales Department\n\nBuilds lasting client relationships and identifies opportunities for businesses to leverage visual content for growth. Combines market knowledge with consultative approach to ensure clients achieve their objectives through strategic video content.',
            icon: 'ChartBarIcon'
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
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Diverse Expertise</h3>
              <p>Our team spans multiple disciplines - from cinematography and photography to 3D visualization and sound design. This diversity enables us to handle complex projects with in-house expertise.</p>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Local Market Knowledge</h3>
              <p>Deep understanding of Moroccan business culture, consumer preferences, and market dynamics ensures content that truly resonates with your target audience.</p>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">International Standards</h3>
              <p>Our team brings experience from international projects while maintaining the personal touch and cultural sensitivity that makes content effective in Morocco.</p>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Collaborative Approach</h3>
              <p>We work as true partners with our clients, ensuring your vision is realized while bringing our expertise to enhance the final result.</p>
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

export default function TeamPage() {
  return (
    <ContentPageTemplate
      metadata={metadata}
      data={pageData}
    />
  );
}
