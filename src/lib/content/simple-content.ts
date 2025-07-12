/**
 * Simplified Content Management System
 *
 * A streamlined approach to content management that focuses on practical needs
 * rather than complex abstractions. Designed for easy content population.
 */

// Simple content types
export interface SimpleContent {
  id: string;
  type: 'text' | 'image' | 'portfolio' | 'testimonial' | 'service' | 'team';
  title: string;
  content: string;
  image?: string;
  alt?: string;
  isPlaceholder: boolean;
  metadata?: {
    description?: string;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
  };
}

// Portfolio specific content
export interface PortfolioItem extends SimpleContent {
  type: 'portfolio';
  category: 'film' | 'photography' | '3d' | 'scenes';
  client?: string;
  year?: number;
  featured?: boolean;
  images?: string[];
}

// Testimonial specific content
export interface TestimonialItem extends SimpleContent {
  type: 'testimonial';
  author: string;
  position?: string;
  company?: string;
  rating?: number;
}

// Service specific content
export interface ServiceItem extends SimpleContent {
  type: 'service';
  features?: string[];
  icon?: string;
}

// Team specific content
export interface TeamMember extends SimpleContent {
  type: 'team';
  position: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

// Union type for all content
export type ContentItem =
  | SimpleContent
  | PortfolioItem
  | TestimonialItem
  | ServiceItem
  | TeamMember;

// Simple content store
class SimpleContentStore {
  private content: Map<string, ContentItem> = new Map();

  // Add content
  add(item: ContentItem): void {
    this.content.set(item.id, item);
  }

  // Get content by ID
  get(id: string): ContentItem | null {
    return this.content.get(id) ?? null;
  }

  // Get content by type
  getByType<T extends ContentItem>(type: string): T[] {
    return Array.from(this.content.values()).filter(item => item.type === type) as T[];
  }

  // Update content
  update(id: string, updates: Partial<ContentItem>): boolean {
    const existing = this.content.get(id);
    if (!existing) return false;

    const updated = { ...existing, ...updates };
    this.content.set(id, updated);
    return true;
  }

  // Remove content
  remove(id: string): boolean {
    return this.content.delete(id);
  }

  // Get all content
  getAll(): ContentItem[] {
    return Array.from(this.content.values());
  }

  // Clear all content
  clear(): void {
    this.content.clear();
  }

  // Export content for backup
  export(): Record<string, ContentItem> {
    return Object.fromEntries(this.content.entries());
  }

  // Import content from backup
  import(data: Record<string, ContentItem>): void {
    this.content.clear();
    Object.entries(data).forEach(([id, item]) => {
      this.content.set(id, item);
    });
  }
}

// Global content store instance
export const contentStore = new SimpleContentStore();

// Utility functions
export const ContentUtils = {
  // Create text content
  createText: (
    id: string,
    title: string,
    content: string,
    isPlaceholder = true
  ): SimpleContent => ({
    id,
    type: 'text',
    title,
    content,
    isPlaceholder,
  }),

  // Create image content
  createImage: (
    id: string,
    title: string,
    image: string,
    alt: string,
    isPlaceholder = true
  ): SimpleContent => ({
    id,
    type: 'image',
    title,
    content: alt,
    image,
    alt,
    isPlaceholder,
  }),

  // Create portfolio item
  createPortfolio: (
    id: string,
    title: string,
    content: string,
    category: 'film' | 'photography' | '3d' | 'scenes',
    isPlaceholder = true
  ): PortfolioItem => ({
    id,
    type: 'portfolio',
    title,
    content,
    category,
    isPlaceholder,
  }),

  // Create testimonial
  createTestimonial: (
    id: string,
    title: string,
    content: string,
    author: string,
    isPlaceholder = true
  ): TestimonialItem => ({
    id,
    type: 'testimonial',
    title,
    content,
    author,
    isPlaceholder,
  }),

  // Create service
  createService: (
    id: string,
    title: string,
    content: string,
    isPlaceholder = true
  ): ServiceItem => ({
    id,
    type: 'service',
    title,
    content,
    isPlaceholder,
  }),

  // Create team member
  createTeamMember: (
    id: string,
    title: string,
    content: string,
    position: string,
    isPlaceholder = true
  ): TeamMember => ({
    id,
    type: 'team',
    title,
    content,
    position,
    isPlaceholder,
  }),

  // Check if content is placeholder
  isPlaceholder: (item: ContentItem): boolean => item.isPlaceholder,

  // Mark content as real
  markAsReal: (item: ContentItem): ContentItem => ({
    ...item,
    isPlaceholder: false,
  }),

  // Generate simple ID - SSR-safe
  generateId: (prefix: string): string => {
    const timestamp = Date.now();

    // Use crypto.getRandomValues if available (client-side), fallback to deterministic approach
    let random: string;
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(4);
      crypto.getRandomValues(array);
      random = Array.from(array, byte => byte.toString(36))
        .join('')
        .substring(0, 6);
    } else {
      // Deterministic fallback based on timestamp for SSR compatibility
      random = (timestamp % 1000000).toString(36).substring(0, 6);
    }

    return `${prefix}-${timestamp}-${random}`;
  },
};

// Initialize with basic placeholder content
export function initializeBasicContent(): void {
  // Clear existing content
  contentStore.clear();

  // Add basic text content
  contentStore.add(
    ContentUtils.createText(
      'hero-title',
      'Hero Title',
      'BlackWoods Creative - Premium Visual Storytelling'
    )
  );

  contentStore.add(
    ContentUtils.createText(
      'hero-subtitle',
      'Hero Subtitle',
      'Crafting compelling visual narratives that resonate with your audience'
    )
  );

  // Add basic portfolio items
  const portfolioCategories: Array<'film' | 'photography' | '3d' | 'scenes'> = [
    'film',
    'photography',
    '3d',
    'scenes',
  ];
  portfolioCategories.forEach((category, index) => {
    contentStore.add(
      ContentUtils.createPortfolio(
        `portfolio-${category}-${index + 1}`,
        `${category.charAt(0).toUpperCase() + category.slice(1)} Project ${index + 1}`,
        `Professional ${category} project showcasing our expertise`,
        category
      )
    );
  });

  // Add basic testimonials
  for (let i = 1; i <= 3; i++) {
    contentStore.add(
      ContentUtils.createTestimonial(
        `testimonial-${i}`,
        'Client Testimonial',
        'BlackWoods Creative delivered exceptional results that exceeded our expectations.',
        `Client ${i}`
      )
    );
  }

  // Add basic services
  const services = ['Video Production', 'Photography', '3D Visualization', 'Creative Consulting'];
  services.forEach((service, index) => {
    contentStore.add(
      ContentUtils.createService(
        `service-${index + 1}`,
        service,
        `Professional ${service.toLowerCase()} services tailored to your needs`
      )
    );
  });

  // Add basic team members
  for (let i = 1; i <= 3; i++) {
    contentStore.add(
      ContentUtils.createTeamMember(
        `team-${i}`,
        `Team Member ${i}`,
        'Experienced creative professional dedicated to delivering exceptional results',
        'Creative Director'
      )
    );
  }
}

// Content migration utilities
export const ContentMigration = {
  // Replace placeholder with real content
  replaceContent: (id: string, newContent: Partial<ContentItem>): boolean => {
    const existing = contentStore.get(id);
    if (!existing) return false;

    const updated = {
      ...existing,
      ...newContent,
      isPlaceholder: false,
    };

    return contentStore.update(id, updated);
  },

  // Bulk replace content
  bulkReplace: (updates: Record<string, Partial<ContentItem>>): number => {
    let successCount = 0;
    Object.entries(updates).forEach(([id, update]) => {
      if (ContentMigration.replaceContent(id, update)) {
        successCount++;
      }
    });
    return successCount;
  },

  // Get placeholder content list
  getPlaceholders: (): ContentItem[] => {
    return contentStore.getAll().filter(item => item.isPlaceholder);
  },

  // Get real content list
  getRealContent: (): ContentItem[] => {
    return contentStore.getAll().filter(item => !item.isPlaceholder);
  },
};
