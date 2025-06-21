// Navigation type definitions
export interface NavigationItem {
  name: string;
  href: string;
  description?: string;
  submenu?: NavigationItem[];
}

export const siteConfig = {
  name: 'BlackWoods Creative',
  description: 'Premium visual storytelling through filmmaking, photography, and 3D visualization.',
  url: 'https://blackwoodscreative.com',
  ogImage: '/assets/images/og-image.jpg',
  links: {
    email: 'hello@blackwoodscreative.com',
    phone: '+212 625 55 37 68',
    address: 'MFADEL Business Center, Building O, Floor 5. Mohammedia Morocco',
    instagram: 'https://instagram.com/blackwoodscreative',
    linkedin: 'https://linkedin.com/company/blackwoodscreative',
    github: 'https://github.com/blackwoods-creative',
  },
  services: [
    {
      id: 'film',
      name: 'Film Production',
      description: 'Cinematic storytelling that captivates audiences and drives results.',
      icon: 'FilmIcon',
    },
    {
      id: 'photography',
      name: 'Photography',
      description: 'Professional photography that captures moments and creates impact.',
      icon: 'CameraIcon',
    },
    {
      id: '3d',
      name: '3D Visualization',
      description: 'Stunning 3D models and visualizations that bring ideas to life.',
      icon: 'CubeIcon',
    },
    {
      id: 'scenes',
      name: 'Scene Creation',
      description: 'Immersive environments and scenes for any creative project.',
      icon: 'BuildingOfficeIcon',
    },
  ],
  navigation: [
    {
      name: 'Services',
      href: '/services',
      submenu: [
        {
          name: 'All Services',
          href: '/services',
          description: 'Complete overview of our services'
        },
        {
          name: 'Video Production',
          href: '/services/video-production-morocco',
          description: 'Professional video production in Morocco'
        },
        {
          name: 'Corporate Videos',
          href: '/services/corporate-video-production-morocco',
          description: 'Professional corporate video production'
        },
        {
          name: 'Photography',
          href: '/services/photography',
          description: 'Professional photography services'
        },
        {
          name: '3D Visualization',
          href: '/services/3d-visualization',
          description: '3D modeling and visualization'
        }
      ]
    },
    {
      name: 'About',
      href: '/about/our-story',
      submenu: [
        {
          name: 'Our Story',
          href: '/about/our-story',
          description: 'The BlackWoods Creative journey'
        },
        {
          name: 'Our Workflow',
          href: '/about/our-workflow',
          description: 'Our proven production process'
        },
        {
          name: 'Team',
          href: '/about/team',
          description: 'Meet our creative professionals'
        },
        {
          name: 'Location',
          href: '/about/location',
          description: 'Our facilities and equipment'
        }
      ]
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
    },
    {
      name: 'Contact',
      href: '/contact',
    },
  ],

  // Unified navigation - same structure for all pages with context-aware hrefs
  homeNavigation: [
    {
      name: 'Services',
      href: '/services',
      homeHref: '#portfolio', // On home page, scroll to portfolio section
      submenu: [
        {
          name: 'All Services',
          href: '/services',
          description: 'Complete overview of our services'
        },
        {
          name: 'Video Production',
          href: '/services/video-production-morocco',
          description: 'Professional video production in Morocco'
        },
        {
          name: 'Corporate Videos',
          href: '/services/corporate-video-production-morocco',
          description: 'Professional corporate video production'
        },
        {
          name: 'Photography',
          href: '/services/photography',
          description: 'Professional photography services'
        },
        {
          name: '3D Visualization',
          href: '/services/3d-visualization',
          description: '3D modeling and visualization'
        }
      ]
    },
    {
      name: 'About',
      href: '/about/our-story',
      homeHref: '#about', // On home page, scroll to about section
      submenu: [
        {
          name: 'Our Story',
          href: '/about/our-story',
          description: 'The BlackWoods Creative journey'
        },
        {
          name: 'Our Workflow',
          href: '/about/our-workflow',
          description: 'Our proven production process'
        },
        {
          name: 'Team',
          href: '/about/team',
          description: 'Meet our creative professionals'
        },
        {
          name: 'Location',
          href: '/about/location',
          description: 'Our facilities and equipment'
        }
      ]
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      homeHref: '#portfolio', // On home page, scroll to portfolio section
    },
    {
      name: 'Contact',
      href: '/contact',
      homeHref: '#contact', // On home page, scroll to contact section
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
