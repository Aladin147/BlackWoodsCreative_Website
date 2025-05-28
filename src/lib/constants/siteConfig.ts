export const siteConfig = {
  name: 'BlackWoods Creative',
  description: 'Premium visual storytelling through filmmaking, photography, and 3D visualization.',
  url: 'https://blackwoodscreative.com',
  ogImage: '/assets/images/og-image.jpg',
  links: {
    email: 'hello@blackwoodscreative.com',
    phone: '+1 (555) 123-4567', // Placeholder - awaiting actual contact details
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
