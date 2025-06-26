/**
 * Placeholder Data Generators
 * 
 * Generates realistic placeholder content for development and testing
 */

import { logger } from '../utils/logger';

import {
  TextContent,
  ImageContent,
  VideoContent,
  PortfolioContent,
  TestimonialContent,
  ServiceContent,
  TeamContent,
  BlogContent,
  ContentUtils,
  contentManager,
} from './placeholder-system';

// Placeholder text samples
const PLACEHOLDER_TEXTS = {
  short: [
    'Professional visual storytelling',
    'Creative excellence delivered',
    'Innovative design solutions',
    'Captivating visual experiences',
    'Premium content creation',
  ],
  medium: [
    'At BlackWoods Creative, we specialize in transforming ideas into compelling visual narratives that resonate with your audience.',
    'Our team combines technical expertise with creative vision to deliver exceptional results that exceed expectations.',
    'From concept to completion, we provide comprehensive visual solutions tailored to your unique brand story.',
    'Experience the difference that professional visual storytelling can make for your business and brand.',
  ],
  long: [
    'BlackWoods Creative is a premier visual storytelling agency dedicated to crafting exceptional content that drives results. Our comprehensive suite of services includes filmmaking, photography, 3D visualization, and scene creation. Based in Mohammedia, Morocco, we serve clients worldwide with international production standards and local market expertise.',
    'Our approach combines cutting-edge technology with artistic vision to create content that not only looks stunning but also achieves your business objectives. Whether you need a corporate brand film, architectural visualization, or immersive scene creation, our team has the expertise to bring your vision to life.',
  ],
};

// Placeholder image URLs (using Unsplash for consistency)
const PLACEHOLDER_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=800&fit=crop&crop=center',
  portfolio: [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center',
  ],
  team: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  ],
  testimonials: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  ],
};

// Placeholder data generators
export const PlaceholderGenerators = {
  // Generate text content
  text: (id: string, length: 'short' | 'medium' | 'long' = 'medium'): TextContent => {
    const texts = PLACEHOLDER_TEXTS[length];
    const content = texts[Math.floor(Math.random() * texts.length)] ?? texts[0] ?? 'Placeholder text content';

    return ContentUtils.createTextPlaceholder(id, content, {
      title: `Text Content - ${id}`,
      description: `Placeholder text content for ${id}`,
      tags: ['placeholder', 'text', length],
      priority: 'medium',
    });
  },

  // Generate image content
  image: (id: string, category: 'hero' | 'portfolio' | 'team' | 'testimonials' = 'portfolio'): ImageContent => {
    let src: string;
    
    if (category === 'hero') {
      src = PLACEHOLDER_IMAGES.hero;
    } else {
      const images = PLACEHOLDER_IMAGES[category];
      src = images[Math.floor(Math.random() * images.length)] ?? images[0] ?? '/placeholder-image.jpg';
    }

    return ContentUtils.createImagePlaceholder(id, `Placeholder image for ${id}`, {
      title: `Image Content - ${id}`,
      description: `Placeholder image content for ${id}`,
      tags: ['placeholder', 'image', category],
      category,
      priority: 'medium',
    }, src);
  },

  // Generate video content
  video: (id: string): VideoContent => ({
    id,
    type: 'video',
    status: 'placeholder',
    lastUpdated: new Date(),
    version: '1.0.0',
    src: '/assets/videos/placeholder.mp4',
    poster: PLACEHOLDER_IMAGES.hero,
    duration: '2:30',
    format: 'mp4',
    quality: 'hd',
    autoplay: false,
    muted: true,
    controls: true,
    placeholder: 'Video content coming soon...',
    metadata: {
      title: `Video Content - ${id}`,
      description: `Placeholder video content for ${id}`,
      tags: ['placeholder', 'video'],
      priority: 'medium',
    },
  }),

  // Generate portfolio content
  portfolio: (id: string, category: 'film' | 'photography' | '3d' | 'scenes' = 'film'): PortfolioContent => {
    const titles = {
      film: ['Cinematic Brand Film', 'Corporate Documentary', 'Music Video Production', 'Commercial Spot'],
      photography: ['Executive Portraits', 'Architectural Photography', 'Event Coverage', 'Product Photography'],
      '3d': ['Architectural Visualization', 'Product Rendering', 'Character Modeling', 'Environment Design'],
      scenes: ['Fantasy Environment', 'Urban Landscape', 'Interior Design', 'Atmospheric Scene'],
    };

    const categoryTitles = titles[category] ?? titles.film;
    const title = categoryTitles[Math.floor(Math.random() * categoryTitles.length)] ?? 'Portfolio Item';
    
    return {
      id,
      type: 'portfolio',
      status: 'placeholder',
      lastUpdated: new Date(),
      version: '1.0.0',
      title,
      description: PLACEHOLDER_TEXTS.medium[Math.floor(Math.random() * PLACEHOLDER_TEXTS.medium.length)] ?? 'Portfolio description',
      category,
      images: [
        PlaceholderGenerators.image(`${id}-image-1`, 'portfolio'),
        PlaceholderGenerators.image(`${id}-image-2`, 'portfolio'),
      ],
      client: 'Client Name',
      year: 2024,
      tags: ['placeholder', category, 'portfolio'],
      featured: Math.random() > 0.7,
      metadata: {
        title: `Portfolio - ${title}`,
        description: `Placeholder portfolio content for ${category}`,
        tags: ['placeholder', 'portfolio', category],
        category,
        priority: 'high',
      },
    };
  },

  // Generate testimonial content
  testimonial: (id: string): TestimonialContent => {
    const names = ['Sarah Chen', 'Michael Rodriguez', 'Emma Thompson', 'David Park', 'Lisa Anderson'];
    const companies = ['TechCorp Industries', 'Design Studio', 'Innovation Labs', 'Creative Agency', 'Media Group'];
    const roles = ['Marketing Director', 'Creative Director', 'Brand Manager', 'CEO', 'Project Manager'];
    const contents = [
      'BlackWoods Creative exceeded our expectations with their exceptional work. The attention to detail and creative vision was outstanding.',
      'Working with BlackWoods Creative was a fantastic experience. They delivered exactly what we needed and more.',
      'The team at BlackWoods Creative is incredibly talented and professional. Highly recommended for any visual project.',
      'Outstanding quality and service. BlackWoods Creative transformed our vision into reality with remarkable skill.',
    ];

    return {
      id,
      type: 'testimonial',
      status: 'placeholder',
      lastUpdated: new Date(),
      version: '1.0.0',
      name: names[Math.floor(Math.random() * names.length)] ?? 'Client Name',
      company: companies[Math.floor(Math.random() * companies.length)] ?? 'Company Name',
      role: roles[Math.floor(Math.random() * roles.length)] ?? 'Client Role',
      content: contents[Math.floor(Math.random() * contents.length)] ?? 'Great testimonial content',
      rating: 5,
      image: PlaceholderGenerators.image(`${id}-image`, 'testimonials'),
      projectType: 'Visual Content',
      featured: Math.random() > 0.5,
      metadata: {
        title: `Testimonial - ${id}`,
        description: 'Placeholder testimonial content',
        tags: ['placeholder', 'testimonial'],
        priority: 'medium',
      },
    };
  },

  // Generate service content
  service: (id: string): ServiceContent => {
    const services = [
      {
        name: 'Filmmaking',
        description: 'Professional video production services including corporate films, documentaries, and commercials.',
        features: ['Script Development', 'Cinematography', 'Post-Production', 'Color Grading'],
        icon: '🎬',
      },
      {
        name: 'Photography',
        description: 'High-quality photography services for corporate, architectural, and commercial needs.',
        features: ['Studio Photography', 'On-Location Shoots', 'Photo Editing', 'Digital Delivery'],
        icon: '📸',
      },
      {
        name: '3D Visualization',
        description: 'Photorealistic 3D rendering and visualization for architecture and product design.',
        features: ['3D Modeling', 'Rendering', 'Animation', 'Virtual Tours'],
        icon: '🎨',
      },
      {
        name: 'Scene Creation',
        description: 'Immersive environment design for games, VR experiences, and film production.',
        features: ['Environment Design', 'Lighting Setup', 'Asset Creation', 'Optimization'],
        icon: '🌟',
      },
    ];

    const service = services[Math.floor(Math.random() * services.length)] ?? services[0] ?? {
      name: 'Service Name',
      description: 'Service description',
      features: ['Feature 1', 'Feature 2'],
      icon: '🎬'
    };

    return {
      id,
      type: 'service',
      status: 'placeholder',
      lastUpdated: new Date(),
      version: '1.0.0',
      name: service.name,
      description: service.description,
      features: service.features,
      pricing: {
        startingPrice: 'Contact for Quote',
        currency: 'USD',
        unit: 'project',
      },
      icon: service.icon,
      category: 'Visual Services',
      popular: Math.random() > 0.6,
      metadata: {
        title: `Service - ${service.name}`,
        description: service.description,
        tags: ['placeholder', 'service', service.name.toLowerCase()],
        priority: 'high',
      },
    };
  },

  // Generate team content
  team: (id: string): TeamContent => {
    const members = [
      {
        name: 'Alex Johnson',
        role: 'Creative Director',
        bio: 'Visionary leader with 10+ years of experience in visual storytelling and brand development.',
        skills: ['Creative Direction', 'Brand Strategy', 'Team Leadership'],
      },
      {
        name: 'Maria Garcia',
        role: 'Lead Cinematographer',
        bio: 'Award-winning cinematographer specializing in corporate and documentary filmmaking.',
        skills: ['Cinematography', 'Lighting', 'Camera Operation'],
      },
      {
        name: 'James Chen',
        role: '3D Artist',
        bio: 'Expert 3D artist with expertise in architectural visualization and product rendering.',
        skills: ['3D Modeling', 'Rendering', 'Animation'],
      },
      {
        name: 'Sophie Martin',
        role: 'Photographer',
        bio: 'Professional photographer with a keen eye for composition and lighting.',
        skills: ['Photography', 'Photo Editing', 'Studio Lighting'],
      },
    ];

    const member = members[Math.floor(Math.random() * members.length)] ?? members[0] ?? {
      name: 'Team Member',
      role: 'Team Role',
      bio: 'Team member bio',
      skills: ['Skill 1', 'Skill 2']
    };

    return {
      id,
      type: 'team',
      status: 'placeholder',
      lastUpdated: new Date(),
      version: '1.0.0',
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: PlaceholderGenerators.image(`${id}-image`, 'team'),
      social: {
        linkedin: '#',
        instagram: '#',
        website: '#',
      },
      skills: member.skills,
      experience: '5+ years',
      metadata: {
        title: `Team Member - ${member.name}`,
        description: `${member.role} at BlackWoods Creative`,
        tags: ['placeholder', 'team', member.role.toLowerCase()],
        priority: 'medium',
      },
    };
  },

  // Generate blog content
  blog: (id: string): BlogContent => {
    const titles = [
      'The Future of Visual Storytelling',
      'Behind the Scenes: Creating Cinematic Content',
      '3D Visualization Trends in 2024',
      'Photography Tips for Better Brand Content',
      'The Art of Scene Creation',
    ];

    const title = titles[Math.floor(Math.random() * titles.length)] ?? 'Blog Post Title';

    return {
      id,
      type: 'blog',
      status: 'placeholder',
      lastUpdated: new Date(),
      version: '1.0.0',
      title,
      excerpt: PLACEHOLDER_TEXTS.medium[Math.floor(Math.random() * PLACEHOLDER_TEXTS.medium.length)] ?? 'Blog excerpt',
      content: PLACEHOLDER_TEXTS.long[Math.floor(Math.random() * PLACEHOLDER_TEXTS.long.length)] ?? 'Blog content',
      author: 'BlackWoods Creative Team',
      publishDate: new Date(),
      readTime: '5 min read',
      featuredImage: PlaceholderGenerators.image(`${id}-featured`, 'portfolio'),
      category: 'Insights',
      tags: ['visual storytelling', 'creative process', 'industry trends'],
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      metadata: {
        title: `Blog Post - ${title}`,
        description: 'Placeholder blog content',
        tags: ['placeholder', 'blog', 'content'],
        priority: 'medium',
      },
    };
  },
};

// Initialize placeholder content
export function initializePlaceholderContent(): void {
  // Generate portfolio items
  const portfolioCategories: Array<'film' | 'photography' | '3d' | 'scenes'> = ['film', 'photography', '3d', 'scenes'];
  portfolioCategories.forEach(category => {
    for (let i = 1; i <= 3; i++) {
      const portfolio = PlaceholderGenerators.portfolio(`portfolio-${category}-${i}`, category);
      contentManager.register(portfolio);
    }
  });

  // Generate testimonials
  for (let i = 1; i <= 6; i++) {
    const testimonial = PlaceholderGenerators.testimonial(`testimonial-${i}`);
    contentManager.register(testimonial);
  }

  // Generate services
  for (let i = 1; i <= 4; i++) {
    const service = PlaceholderGenerators.service(`service-${i}`);
    contentManager.register(service);
  }

  // Generate team members
  for (let i = 1; i <= 4; i++) {
    const team = PlaceholderGenerators.team(`team-${i}`);
    contentManager.register(team);
  }

  // Generate blog posts
  for (let i = 1; i <= 5; i++) {
    const blog = PlaceholderGenerators.blog(`blog-${i}`);
    contentManager.register(blog);
  }

  // Generate text content
  const textContents = [
    { id: 'hero-title', length: 'short' as const },
    { id: 'hero-subtitle', length: 'medium' as const },
    { id: 'about-description', length: 'long' as const },
    { id: 'vision-statement', length: 'medium' as const },
  ];

  textContents.forEach(({ id, length }) => {
    const text = PlaceholderGenerators.text(id, length);
    contentManager.register(text);
  });

  if (process.env.NODE_ENV === 'development') {
    logger.info('Placeholder content initialized');
  }
}
