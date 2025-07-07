/**
 * Content Placeholder System
 *
 * Provides a flexible system for managing placeholder content that can be easily
 * replaced with real content when it becomes available. Supports multiple content
 * types, localization, and seamless content migration.
 */

import { ReactNode } from 'react';

// Base content types
export interface BaseContent {
  id: string;
  type: ContentType;
  status: ContentStatus;
  lastUpdated: Date;
  version: string;
  metadata?: ContentMetadata;
}

export type ContentType =
  | 'text'
  | 'image'
  | 'video'
  | 'portfolio'
  | 'testimonial'
  | 'service'
  | 'team'
  | 'blog'
  | 'page'
  | 'component';

export type ContentStatus =
  | 'placeholder'
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'archived';

export interface ContentMetadata {
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  locale?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  optimized?: boolean;
  optimizedAt?: string;
}

// Text content interface
export interface TextContent extends BaseContent {
  type: 'text';
  content: string | ReactNode;
  format?: 'plain' | 'markdown' | 'html' | 'rich';
  maxLength?: number;
  placeholder?: string;
}

// Image content interface
export interface ImageContent extends BaseContent {
  type: 'image';
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholder?: string;
  blurDataURL?: string;
  caption?: string;
  credit?: string;
  sizes?: string;
  priority?: boolean;
}

// Video content interface
export interface VideoContent extends BaseContent {
  type: 'video';
  src: string;
  poster?: string;
  duration?: string;
  format?: string;
  quality?: 'sd' | 'hd' | '4k';
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  placeholder?: string;
}

// Portfolio content interface
export interface PortfolioContent extends BaseContent {
  type: 'portfolio';
  title: string;
  description: string;
  category: string;
  images: ImageContent[];
  videos?: VideoContent[];
  client?: string;
  year: number;
  tags: string[];
  featured?: boolean;
  testimonial?: string;
}

// Testimonial content interface
export interface TestimonialContent extends BaseContent {
  type: 'testimonial';
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  image?: ImageContent;
  projectType?: string;
  featured?: boolean;
}

// Service content interface
export interface ServiceContent extends BaseContent {
  type: 'service';
  name: string;
  description: string;
  features: string[];
  pricing?: {
    startingPrice?: string;
    currency?: string;
    unit?: string;
  };
  icon?: string;
  category?: string;
  popular?: boolean;
}

// Team member content interface
export interface TeamContent extends BaseContent {
  type: 'team';
  name: string;
  role: string;
  bio: string;
  image?: ImageContent;
  social?: {
    linkedin?: string;
    instagram?: string;
    website?: string;
    email?: string;
  };
  skills?: string[];
  experience?: string;
}

// Blog content interface
export interface BlogContent extends BaseContent {
  type: 'blog';
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  readTime?: string;
  featuredImage?: ImageContent;
  category?: string;
  tags: string[];
  slug: string;
}

// Page content interface
export interface PageContent extends BaseContent {
  type: 'page';
  title: string;
  slug: string;
  content: (TextContent | ImageContent | VideoContent)[];
  template?: string;
  layout?: string;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: ImageContent;
  };
}

// Component content interface
export interface ComponentContent extends BaseContent {
  type: 'component';
  name: string;
  props: Record<string, unknown>;
  children?: ComponentContent[];
  template?: string;
}

// Union type for all content
export type Content =
  | TextContent
  | ImageContent
  | VideoContent
  | PortfolioContent
  | TestimonialContent
  | ServiceContent
  | TeamContent
  | BlogContent
  | PageContent
  | ComponentContent;

// Content placeholder configuration
export interface PlaceholderConfig {
  useRealContent?: boolean;
  fallbackToPlaceholder?: boolean;
  showPlaceholderIndicators?: boolean;
  locale?: string;
  environment?: 'development' | 'staging' | 'production' | 'test';
}

// Content source interface
export interface ContentSource {
  id: string;
  name: string;
  type: 'static' | 'cms' | 'api' | 'database';
  endpoint?: string;
  credentials?: Record<string, string>;
  cache?: {
    enabled: boolean;
    ttl: number;
  };
}

// Content manager class
export class ContentPlaceholderManager {
  private content: Map<string, Content> = new Map();
  private config: PlaceholderConfig;
  private sources: Map<string, ContentSource> = new Map();

  constructor(config: PlaceholderConfig = {}) {
    this.config = {
      useRealContent: process.env.NODE_ENV === 'production',
      fallbackToPlaceholder: true,
      showPlaceholderIndicators: process.env.NODE_ENV === 'development',
      locale: 'en',
      environment:
        (process.env.NODE_ENV as 'development' | 'staging' | 'production' | 'test') ??
        'development',
      ...config,
    };
  }

  // Register content
  register(content: Content): void {
    this.content.set(content.id, content);
  }

  // Register multiple content items
  registerBatch(contents: Content[]): void {
    contents.forEach(content => this.register(content));
  }

  // Get content by ID
  get<T extends Content>(id: string): T | null {
    return (this.content.get(id) as T) || null;
  }

  // Get content by type
  getByType<T extends Content>(type: ContentType): T[] {
    return Array.from(this.content.values()).filter(content => content.type === type) as T[];
  }

  // Get content by status
  getByStatus(status: ContentStatus): Content[] {
    return Array.from(this.content.values()).filter(content => content.status === status);
  }

  // Update content
  update(id: string, updates: Partial<Content>): boolean {
    const existing = this.content.get(id);
    if (!existing) return false;

    const updated = {
      ...existing,
      ...updates,
      lastUpdated: new Date(),
    } as Content;

    this.content.set(id, updated);
    return true;
  }

  // Delete content
  delete(id: string): boolean {
    return this.content.delete(id);
  }

  // Check if content exists
  exists(id: string): boolean {
    return this.content.has(id);
  }

  // Get all content
  getAll(): Content[] {
    return Array.from(this.content.values());
  }

  // Clear all content
  clear(): void {
    this.content.clear();
  }

  // Register content source
  registerSource(source: ContentSource): void {
    this.sources.set(source.id, source);
  }

  // Get content source
  getSource(id: string): ContentSource | null {
    return this.sources.get(id) ?? null;
  }

  // Export content for migration
  export(): Record<string, Content> {
    return Object.fromEntries(this.content.entries());
  }

  // Import content from migration
  import(data: Record<string, Content>): void {
    Object.entries(data).forEach(([id, content]) => {
      this.content.set(id, content);
    });
  }

  // Get configuration
  getConfig(): PlaceholderConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(updates: Partial<PlaceholderConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

// Global content manager instance
export const contentManager = new ContentPlaceholderManager();

// Utility functions for content management
export const ContentUtils = {
  // Create placeholder text content
  createTextPlaceholder: (
    id: string,
    placeholder: string,
    metadata?: ContentMetadata
  ): TextContent => ({
    id,
    type: 'text',
    status: 'placeholder',
    lastUpdated: new Date(),
    version: '1.0.0',
    content: placeholder,
    format: 'plain',
    placeholder,
    metadata: metadata ?? {
      title: `Text Content - ${id}`,
      description: `Placeholder text content for ${id}`,
      tags: ['placeholder', 'text'],
      priority: 'medium',
    },
  }),

  // Create placeholder image content
  createImagePlaceholder: (
    id: string,
    alt: string,
    metadata?: ContentMetadata,
    src?: string
  ): ImageContent => ({
    id,
    type: 'image',
    status: 'placeholder',
    lastUpdated: new Date(),
    version: '1.0.0',
    src:
      src ??
      `https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop&crop=center`,
    alt,
    placeholder:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==',
    metadata: metadata ?? {
      title: `Image Content - ${id}`,
      description: `Placeholder image content for ${id}`,
      tags: ['placeholder', 'image'],
      priority: 'medium',
    },
  }),

  // Validate content structure
  validateContent: (content: Content): boolean => {
    return !!(
      content.id &&
      content.type &&
      content.status &&
      content.lastUpdated &&
      content.version
    );
  },

  // Generate content ID - safe for SSR
  generateId: (type: ContentType, suffix?: string): string => {
    const timestamp = Date.now();

    // Use crypto.getRandomValues if available (client-side), fallback to deterministic approach
    let random: string;
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(4);
      crypto.getRandomValues(array);
      random = Array.from(array, byte => byte.toString(36)).join('').substring(0, 6);
    } else {
      // Deterministic fallback based on timestamp for SSR compatibility
      random = (timestamp % 1000000).toString(36).substring(0, 6);
    }

    return `${type}-${timestamp}-${random}${suffix ? `-${suffix}` : ''}`;
  },

  // Check if content is placeholder
  isPlaceholder: (content: Content): boolean => {
    return content.status === 'placeholder';
  },

  // Check if content is ready for production
  isProductionReady: (content: Content): boolean => {
    return content.status === 'published' || content.status === 'approved';
  },
};
