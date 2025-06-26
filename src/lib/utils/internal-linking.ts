/**
 * Internal Linking Utilities for SEO Optimization
 * Strategic cross-page linking to improve search engine crawling and user navigation
 */

export interface InternalLink {
  href: string;
  text: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  context: string; // Where this link makes sense to appear
}

export interface PageLinkingStrategy {
  page: string;
  relatedPages: InternalLink[];
  contextualLinks: InternalLink[];
  callToActionLinks: InternalLink[];
}

// ===== STRATEGIC INTERNAL LINKING MATRIX =====

export const INTERNAL_LINKING_STRATEGY: PageLinkingStrategy[] = [
  // Homepage linking strategy
  {
    page: '/',
    relatedPages: [
      {
        href: '/about',
        text: 'About BlackWoods Creative',
        description: 'Discover our story and mission',
        priority: 'high',
        context: 'hero-section'
      },
      {
        href: '/services',
        text: 'Our Services',
        description: 'Explore our complete service offerings',
        priority: 'high',
        context: 'services-overview'
      },
      {
        href: '/portfolio',
        text: 'View Our Portfolio',
        description: 'See our latest creative work',
        priority: 'high',
        context: 'portfolio-section'
      }
    ],
    contextualLinks: [
      {
        href: '/services/video-production-morocco',
        text: 'Video Production Services',
        description: 'Professional video production in Morocco',
        priority: 'medium',
        context: 'services-mention'
      },
      {
        href: '/services/photography',
        text: 'Photography Services',
        description: 'Commercial and artistic photography',
        priority: 'medium',
        context: 'services-mention'
      }
    ],
    callToActionLinks: [
      {
        href: '/contact',
        text: 'Start Your Project',
        description: 'Get in touch to begin your creative journey',
        priority: 'high',
        context: 'cta-section'
      }
    ]
  },

  // About page linking strategy
  {
    page: '/about',
    relatedPages: [
      {
        href: '/about/our-story',
        text: 'Our Story',
        description: 'Learn about BlackWoods Creative journey',
        priority: 'high',
        context: 'story-section'
      },
      {
        href: '/about/team',
        text: 'Meet Our Team',
        description: 'Get to know the creative minds behind BlackWoods',
        priority: 'high',
        context: 'team-section'
      },
      {
        href: '/about/our-workflow',
        text: 'Our Workflow',
        description: 'Discover how we bring ideas to life',
        priority: 'medium',
        context: 'process-section'
      }
    ],
    contextualLinks: [
      {
        href: '/services',
        text: 'Explore Our Services',
        description: 'See what we can create for you',
        priority: 'high',
        context: 'services-reference'
      },
      {
        href: '/portfolio',
        text: 'View Our Work',
        description: 'See examples of our creative projects',
        priority: 'medium',
        context: 'work-examples'
      }
    ],
    callToActionLinks: [
      {
        href: '/contact',
        text: 'Work With Us',
        description: 'Ready to start your project?',
        priority: 'high',
        context: 'cta-section'
      }
    ]
  },

  // Services page linking strategy
  {
    page: '/services',
    relatedPages: [
      {
        href: '/services/video-production-morocco',
        text: 'Video Production',
        description: 'Professional video production services',
        priority: 'high',
        context: 'service-grid'
      },
      {
        href: '/services/photography',
        text: 'Photography',
        description: 'Commercial and artistic photography',
        priority: 'high',
        context: 'service-grid'
      },
      {
        href: '/services/3d-visualization',
        text: '3D Visualization',
        description: 'Stunning 3D modeling and rendering',
        priority: 'high',
        context: 'service-grid'
      },
      {
        href: '/services/corporate-video-production-morocco',
        text: 'Corporate Videos',
        description: 'Professional corporate video production',
        priority: 'medium',
        context: 'service-grid'
      }
    ],
    contextualLinks: [
      {
        href: '/portfolio',
        text: 'See Our Work',
        description: 'Examples of our creative projects',
        priority: 'high',
        context: 'work-examples'
      },
      {
        href: '/about/our-workflow',
        text: 'Our Process',
        description: 'How we deliver exceptional results',
        priority: 'medium',
        context: 'process-reference'
      }
    ],
    callToActionLinks: [
      {
        href: '/contact',
        text: 'Get a Quote',
        description: 'Request a custom quote for your project',
        priority: 'high',
        context: 'cta-section'
      }
    ]
  },

  // Portfolio page linking strategy
  {
    page: '/portfolio',
    relatedPages: [
      {
        href: '/services',
        text: 'Our Services',
        description: 'Learn about our service offerings',
        priority: 'high',
        context: 'service-reference'
      },
      {
        href: '/about/team',
        text: 'Meet the Team',
        description: 'The creative minds behind these projects',
        priority: 'medium',
        context: 'team-reference'
      }
    ],
    contextualLinks: [
      {
        href: '/services/video-production-morocco',
        text: 'Video Production Services',
        description: 'Learn more about our video capabilities',
        priority: 'medium',
        context: 'video-projects'
      },
      {
        href: '/services/photography',
        text: 'Photography Services',
        description: 'Discover our photography expertise',
        priority: 'medium',
        context: 'photo-projects'
      }
    ],
    callToActionLinks: [
      {
        href: '/contact',
        text: 'Start Your Project',
        description: 'Ready to create something amazing?',
        priority: 'high',
        context: 'cta-section'
      }
    ]
  },

  // Contact page linking strategy
  {
    page: '/contact',
    relatedPages: [
      {
        href: '/services',
        text: 'View Our Services',
        description: 'Explore what we can do for you',
        priority: 'high',
        context: 'services-reference'
      },
      {
        href: '/portfolio',
        text: 'See Our Work',
        description: 'Get inspired by our previous projects',
        priority: 'medium',
        context: 'portfolio-reference'
      },
      {
        href: '/about/location',
        text: 'Visit Our Studio',
        description: 'Find us in Mohammedia, Morocco',
        priority: 'medium',
        context: 'location-reference'
      }
    ],
    contextualLinks: [
      {
        href: '/about/our-workflow',
        text: 'Our Process',
        description: 'Learn how we work with clients',
        priority: 'low',
        context: 'process-reference'
      }
    ],
    callToActionLinks: []
  },

  // About subpage linking strategies
  {
    page: '/about/our-story',
    relatedPages: [
      {
        href: '/about/team',
        text: 'Meet Our Team',
        description: 'The creative minds behind BlackWoods',
        priority: 'high',
        context: 'about-section'
      },
      {
        href: '/about/our-workflow',
        text: 'Our Workflow',
        description: 'How we bring projects to life',
        priority: 'medium',
        context: 'about-section'
      },
      {
        href: '/about/location',
        text: 'Our Location',
        description: 'Visit our studio in Morocco',
        priority: 'medium',
        context: 'about-section'
      }
    ],
    contextualLinks: [
      {
        href: '/services',
        text: 'Our Services',
        description: 'What we can do for you',
        priority: 'medium',
        context: 'services-reference'
      }
    ],
    callToActionLinks: [
      {
        href: '/contact',
        text: 'Get In Touch',
        description: 'Start your project with us',
        priority: 'high',
        context: 'contact-cta'
      }
    ]
  },

  // About team page linking strategy
  {
    page: '/about/team',
    relatedPages: [
      {
        href: '/about/our-story',
        text: 'Our Story',
        description: 'Learn about BlackWoods Creative journey',
        priority: 'high',
        context: 'about-section'
      },
      {
        href: '/about/our-workflow',
        text: 'Our Workflow',
        description: 'How we bring projects to life',
        priority: 'medium',
        context: 'about-section'
      }
    ],
    contextualLinks: [
      {
        href: '/portfolio',
        text: 'View Our Work',
        description: 'See what our team has created',
        priority: 'medium',
        context: 'portfolio-reference'
      },
      {
        href: '/services',
        text: 'Our Services',
        description: 'What our team can do for you',
        priority: 'medium',
        context: 'services-reference'
      }
    ],
    callToActionLinks: [
      {
        href: '/contact',
        text: 'Work With Us',
        description: 'Start your project with our team',
        priority: 'high',
        context: 'contact-cta'
      }
    ]
  },

  // Service subpage linking strategies
  {
    page: '/services/video-production-morocco',
    relatedPages: [
      {
        href: '/services/corporate-video-production-morocco',
        text: 'Corporate Videos',
        description: 'Professional corporate video production',
        priority: 'high',
        context: 'related-services'
      },
      {
        href: '/services/photography',
        text: 'Photography',
        description: 'Commercial and artistic photography',
        priority: 'medium',
        context: 'related-services'
      },
      {
        href: '/services/3d-visualization',
        text: '3D Visualization',
        description: 'Stunning 3D modeling and rendering',
        priority: 'medium',
        context: 'related-services'
      }
    ],
    contextualLinks: [
      {
        href: '/portfolio',
        text: 'View Our Work',
        description: 'See our video production portfolio',
        priority: 'medium',
        context: 'portfolio-reference'
      }
    ],
    callToActionLinks: [
      {
        href: '/contact',
        text: 'Start Your Project',
        description: 'Get a quote for your video project',
        priority: 'high',
        context: 'contact-cta'
      }
    ]
  }
];

// ===== UTILITY FUNCTIONS =====

/**
 * Get internal links for a specific page
 */
export function getInternalLinksForPage(pagePath: string): PageLinkingStrategy | null {
  return INTERNAL_LINKING_STRATEGY.find(strategy => strategy.page === pagePath) ?? null;
}

/**
 * Get contextual links based on content context
 */
export function getContextualLinks(pagePath: string, context: string): InternalLink[] {
  const strategy = getInternalLinksForPage(pagePath);
  if (!strategy) return [];

  return [
    ...strategy.relatedPages,
    ...strategy.contextualLinks,
    ...strategy.callToActionLinks
  ].filter(link => link.context === context);
}

/**
 * Get high-priority links for a page (for main navigation areas)
 */
export function getHighPriorityLinks(pagePath: string): InternalLink[] {
  const strategy = getInternalLinksForPage(pagePath);
  if (!strategy) return [];

  return [
    ...strategy.relatedPages,
    ...strategy.contextualLinks,
    ...strategy.callToActionLinks
  ].filter(link => link.priority === 'high');
}

/**
 * Generate breadcrumb navigation for SEO
 */
export function generateBreadcrumbs(pathname: string): Array<{ name: string; href: string }> {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', href: '/' }];

  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += `/${segment}`;

    // Convert segment to readable name
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      name,
      href: currentPath
    });
  });

  return breadcrumbs;
}

/**
 * Get related service pages for cross-linking
 */
export function getRelatedServicePages(currentService: string): InternalLink[] {
  const allServices = [
    {
      href: '/services/video-production-morocco',
      text: 'Video Production',
      description: 'Professional video production services',
      priority: 'medium' as const,
      context: 'related-services'
    },
    {
      href: '/services/photography',
      text: 'Photography',
      description: 'Commercial and artistic photography',
      priority: 'medium' as const,
      context: 'related-services'
    },
    {
      href: '/services/3d-visualization',
      text: '3D Visualization',
      description: 'Stunning 3D modeling and rendering',
      priority: 'medium' as const,
      context: 'related-services'
    },
    {
      href: '/services/corporate-video-production-morocco',
      text: 'Corporate Videos',
      description: 'Professional corporate video production',
      priority: 'medium' as const,
      context: 'related-services'
    }
  ];

  // Handle both service slug and full href
  const currentServiceHref = currentService.startsWith('/services/')
    ? currentService
    : `/services/${currentService}`;

  // Filter out current service and return empty array for unknown services
  const filteredServices = allServices.filter(service => service.href !== currentServiceHref);

  // If no services were filtered out, it means the current service doesn't exist
  if (filteredServices.length === allServices.length && !allServices.some(s => s.href === currentServiceHref)) {
    return [];
  }

  return filteredServices;
}
