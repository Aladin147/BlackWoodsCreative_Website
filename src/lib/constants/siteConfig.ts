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
      name: 'Portfolio',
      href: '#portfolio',
    },
    {
      name: 'About',
      href: '#about',
    },
    {
      name: 'Contact',
      href: '#contact',
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
