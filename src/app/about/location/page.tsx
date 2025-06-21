import { Metadata } from 'next';

import { 
  ContentPageTemplate, 
  type ContentPageData, 
  type SEOMetadata 
} from '@/components/templates';

// SEO metadata for location page
const metadata: SEOMetadata = {
  title: 'Location & Facilities | BlackWoods Creative - Professional Studio in Mohammedia, Morocco',
  description: 'Visit BlackWoods Creative\'s state-of-the-art production facilities in Mohammedia, Morocco. Professional studio, equipment, and strategic location serving Casablanca, Rabat, and beyond.',
  keywords: [
    'BlackWoods Creative location',
    'video production studio Morocco',
    'Mohammedia production facilities',
    'professional studio Morocco',
    'video production equipment',
    'Morocco film studio',
    'Casablanca video production'
  ],
  canonicalUrl: '/about/location',
  openGraph: {
    title: 'Location & Facilities | BlackWoods Creative Professional Studio Morocco',
    description: 'State-of-the-art production facilities in Mohammedia, strategically located to serve all of Morocco.',
    type: 'website'
  },
  structuredData: {
    '@type': 'Place',
    'name': 'BlackWoods Creative Studio',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'MFADEL Business Center, Building O, Floor 5',
      'addressLocality': 'Mohammedia',
      'addressCountry': 'Morocco'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '33.6866',
      'longitude': '-7.3833'
    },
    'telephone': '+212 625 55 37 68',
    'url': 'https://blackwoodscreative.com',
    'description': 'Professional video production studio and facilities in Mohammedia, Morocco'
  }
};

// Page content data
const pageData: ContentPageData = {
  hero: {
    title: 'Location & Facilities',
    subtitle: 'State-of-the-art production facilities in the heart of Morocco',
    description: 'Our strategically located studio in Mohammedia provides the perfect base for serving clients across Morocco, with professional equipment and facilities that meet international standards.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Location', href: '/about/location' }
    ]
  },
  sections: [
    {
      id: 'location-overview',
      type: 'text',
      data: {
        title: 'Strategic Location in Morocco',
        content: `
          <p>BlackWoods Creative is strategically located in Mohammedia, providing optimal access to Morocco's major business centers while maintaining a professional, focused environment for creative work.</p>
          
          <p>Our location offers the perfect balance of accessibility and tranquility, allowing us to serve clients across Morocco efficiently while providing a distraction-free environment for high-quality content creation.</p>
        `,
        highlight: true
      },
      styling: {
        background: 'primary',
        spacing: 'normal'
      }
    },
    {
      id: 'studio-facilities',
      type: 'values',
      data: {
        title: 'Professional Studio Facilities',
        description: 'Comprehensive production facilities designed for exceptional content creation',
        values: [
          {
            title: 'Main Production Studio',
            description: 'Spacious 500m² studio with professional lighting grid, acoustic treatment, and flexible set configurations. Ideal for corporate interviews, product shoots, and controlled environment filming.',
            icon: 'FilmIcon'
          },
          {
            title: 'Post-Production Suites',
            description: 'Dedicated editing bays with high-performance workstations, color-calibrated monitors, and professional audio monitoring. Optimized for 4K/8K workflow and collaborative review sessions.',
            icon: 'CubeIcon'
          },
          {
            title: 'Equipment Storage',
            description: 'Climate-controlled storage for cameras, lenses, lighting, and audio equipment. Organized inventory system ensures quick setup and optimal equipment maintenance.',
            icon: 'BriefcaseIcon'
          },
          {
            title: 'Client Meeting Areas',
            description: 'Comfortable consultation spaces with presentation capabilities. Perfect for project planning, review sessions, and collaborative creative development.',
            icon: 'UserIcon'
          },
          {
            title: '3D Printing Lab',
            description: 'Advanced 3D printing and fabrication capabilities for custom props, prototypes, and specialized production elements. Supports both creative and technical project requirements.',
            icon: 'CubeIcon'
          },
          {
            title: 'Sound Recording Booth',
            description: 'Acoustically treated recording space for voice-overs, interviews, and audio production. Professional microphones and monitoring for broadcast-quality sound.',
            icon: 'SpeakerWaveIcon'
          }
        ]
      },
      styling: {
        background: 'secondary',
        spacing: 'loose'
      }
    },
    {
      id: 'equipment-specs',
      type: 'text',
      data: {
        title: 'Professional Equipment Inventory',
        content: `
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Camera Systems</h3>
              <ul class="space-y-2">
                <li>• Sony FX6 & FX9 Professional Cameras</li>
                <li>• 4K/8K Recording Capabilities</li>
                <li>• Full-Frame & Super 35 Sensors</li>
                <li>• Professional Cinema Lens Collection</li>
                <li>• Stabilization & Gimbal Systems</li>
              </ul>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Lighting Equipment</h3>
              <ul class="space-y-2">
                <li>• LED Panel Arrays (Bi-Color)</li>
                <li>• Tungsten & HMI Lighting Kits</li>
                <li>• Professional Grip Equipment</li>
                <li>• Softboxes & Diffusion Systems</li>
                <li>• Portable Location Lighting</li>
              </ul>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Audio Production</h3>
              <ul class="space-y-2">
                <li>• Wireless Microphone Systems</li>
                <li>• Professional Boom Equipment</li>
                <li>• Multi-Track Recording Devices</li>
                <li>• Studio Monitoring Systems</li>
                <li>• Field Audio Recording Kits</li>
              </ul>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Specialized Equipment</h3>
              <ul class="space-y-2">
                <li>• DJI Professional Drone Fleet</li>
                <li>• 3D Printing & Fabrication Tools</li>
                <li>• Motion Control Systems</li>
                <li>• Green Screen & Chroma Key Setup</li>
                <li>• Time-Lapse & Slow Motion Rigs</li>
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
      id: 'location-advantages',
      type: 'values',
      data: {
        title: 'Location Advantages',
        description: 'Why our Mohammedia location is perfect for serving all of Morocco',
        values: [
          {
            title: 'Central Morocco Access',
            description: 'Strategic location between Casablanca and Rabat, providing easy access to Morocco\'s major business centers within 30-45 minutes travel time.',
            icon: 'GlobeAltIcon'
          },
          {
            title: 'Transportation Hub',
            description: 'Close proximity to Mohammed V International Airport, major highways, and rail connections. Ideal for equipment transport and client accessibility.',
            icon: 'RocketLaunchIcon'
          },
          {
            title: 'Business Environment',
            description: 'Professional business district with modern infrastructure, reliable utilities, and supportive business services. Perfect for client meetings and operations.',
            icon: 'BriefcaseIcon'
          },
          {
            title: 'Diverse Locations',
            description: 'Access to varied filming locations: coastal areas, urban environments, industrial zones, and natural landscapes all within short distances.',
            icon: 'CameraIcon'
          }
        ]
      },
      styling: {
        background: 'accent',
        spacing: 'normal'
      }
    },
    {
      id: 'contact-info',
      type: 'text',
      data: {
        title: 'Visit Our Studio',
        content: `
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Studio Address</h3>
              <p class="mb-4">
                <strong>BlackWoods Creative</strong><br>
                MFADEL Business Center<br>
                Building O, Floor 5<br>
                Mohammedia, Morocco
              </p>
              <p class="mb-4">
                <strong>Phone:</strong> +212 625 55 37 68<br>
                <strong>Email:</strong> hello@blackwoodscreative.com
              </p>
            </div>
            <div>
              <h3 class="text-xl font-bold mb-4 text-bw-accent-gold">Studio Hours</h3>
              <p class="mb-4">
                <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM<br>
                <strong>Saturday:</strong> 10:00 AM - 4:00 PM<br>
                <strong>Sunday:</strong> By appointment only
              </p>
              <p class="text-sm text-bw-text-secondary">
                Extended hours available for production schedules and client needs.
              </p>
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
        title: 'Schedule a Studio Visit',
        description: 'Experience our facilities firsthand and discuss how our location and equipment can serve your project needs.',
        text: 'Contact Us',
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
export const metadata: Metadata = {
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

export default function LocationPage() {
  return (
    <ContentPageTemplate
      metadata={metadata}
      data={pageData}
    />
  );
}
