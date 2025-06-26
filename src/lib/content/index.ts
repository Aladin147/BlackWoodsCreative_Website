/**
 * Content Integration Infrastructure
 *
 * Centralized exports for the content management system
 */

// Import for internal use
import { logger } from '../utils/logger';

import {
  contentManager,
  Content,
  ContentStatus,
  PlaceholderConfig
} from './placeholder-system';

// Core system exports
export {
  ContentPlaceholderManager,
  contentManager,
  ContentUtils,
  type Content,
  type ContentType,
  type ContentStatus,
  type ContentMetadata,
  type BaseContent,
  type TextContent,
  type ImageContent,
  type VideoContent,
  type PortfolioContent,
  type TestimonialContent,
  type ServiceContent,
  type TeamContent,
  type BlogContent,
  type PageContent,
  type ComponentContent,
  type PlaceholderConfig,
  type ContentSource,
} from './placeholder-system';

// Import removed - now at top of file

// Hooks exports
export {
  useContent,
  useContentByType,
  useContentByStatus,
  useContentSearch,
  useContentStats,
  useTextContent,
  useImageContent,
  useVideoContent,
  usePortfolioContent,
  useTestimonialContent,
  useServiceContent,
  useTeamContent,
  useBlogContent,
  usePageContent,
  type UseContentOptions,
  type UseContentResult,
} from './hooks';

// Placeholder data exports
export {
  PlaceholderGenerators,
  initializePlaceholderContent,
} from './placeholder-data';

// Component exports
export {
  ContentRenderer,
  TextRenderer,
  ImageRenderer,
  VideoRenderer,
  PortfolioRenderer,
  TestimonialRenderer,
  ServiceRenderer,
  TeamRenderer,
} from '../../components/content/ContentRenderer';

// Migration utilities
export const ContentMigration = {
  // Export current content for backup
  exportContent: () => {
    return contentManager.export();
  },

  // Import content from backup
  importContent: (data: Record<string, Content>) => {
    contentManager.import(data);
  },

  // Migrate placeholder to real content
  migratePlaceholder: (id: string, realContent: Partial<Content>) => {
    const existing = contentManager.get(id);
    if (!existing) return false;

    const updated = {
      ...existing,
      ...realContent,
      status: 'published' as ContentStatus,
      lastUpdated: new Date(),
    } as Content;

    return contentManager.update(id, updated);
  },

  // Batch migrate multiple content items
  batchMigrate: (migrations: Array<{ id: string; content: Partial<Content> }>) => {
    const results = migrations.map(({ id, content }) => 
      ContentMigration.migratePlaceholder(id, content)
    );
    return results.every(result => result);
  },

  // Get migration status
  getMigrationStatus: () => {
    const all = contentManager.getAll();
    const placeholders = all.filter(content => content.status === 'placeholder');
    const published = all.filter(content => content.status === 'published');
    
    return {
      total: all.length,
      placeholders: placeholders.length,
      published: published.length,
      migrationProgress: published.length / all.length,
    };
  },
};

// Content validation utilities
export const ContentValidation = {
  // Validate content structure
  validateContent: (content: Content): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!content.id) errors.push('Missing content ID');
    if (!content.type) errors.push('Missing content type');
    if (!content.status) errors.push('Missing content status');
    if (!content.lastUpdated) errors.push('Missing last updated date');
    if (!content.version) errors.push('Missing version');

    // Type-specific validation
    switch (content.type) {
      case 'text':
        if (!content.content) errors.push('Text content is required');
        break;
      
      case 'image':
        if (!content.src) errors.push('Image source is required');
        if (!content.alt) errors.push('Image alt text is required');
        break;
      
      case 'portfolio':
        if (!content.title) errors.push('Portfolio title is required');
        if (!content.description) errors.push('Portfolio description is required');
        if (!content.category) errors.push('Portfolio category is required');
        break;
      
      case 'testimonial':
        if (!content.name) errors.push('Testimonial name is required');
        if (!content.content) errors.push('Testimonial content is required');
        if (!content.company) errors.push('Testimonial company is required');
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Validate all content
  validateAllContent: () => {
    const all = contentManager.getAll();
    const results = all.map(content => ({
      id: content.id,
      ...ContentValidation.validateContent(content),
    }));

    const invalid = results.filter(result => !result.valid);
    
    return {
      total: all.length,
      valid: results.length - invalid.length,
      invalid: invalid.length,
      errors: invalid,
    };
  },
};

// Content analytics utilities
export const ContentAnalytics = {
  // Get content statistics
  getStats: () => {
    const all = contentManager.getAll();
    
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    
    all.forEach(content => {
      byType[content.type] = (byType[content.type] ?? 0) + 1;
      byStatus[content.status] = (byStatus[content.status] ?? 0) + 1;
    });

    return {
      total: all.length,
      byType,
      byStatus,
      placeholderPercentage: (byStatus.placeholder ?? 0) / all.length,
      publishedPercentage: (byStatus.published ?? 0) / all.length,
    };
  },

  // Get content health score
  getHealthScore: () => {
    const stats = ContentAnalytics.getStats();
    const validation = ContentValidation.validateAllContent();
    
    let score = 100;
    
    // Deduct points for placeholders
    score -= (stats.placeholderPercentage * 30);
    
    // Deduct points for invalid content
    score -= ((validation.invalid / validation.total) * 40);
    
    // Deduct points for missing metadata
    const all = contentManager.getAll();
    const withoutMetadata = all.filter(content => !content.metadata).length;
    score -= ((withoutMetadata / all.length) * 20);
    
    return Math.max(0, Math.round(score));
  },

  // Get content recommendations
  getRecommendations: () => {
    const recommendations: string[] = [];
    const stats = ContentAnalytics.getStats();
    const validation = ContentValidation.validateAllContent();
    
    if (stats.placeholderPercentage > 0.5) {
      recommendations.push('High percentage of placeholder content - consider migrating to real content');
    }
    
    if (validation.invalid > 0) {
      recommendations.push(`${validation.invalid} content items have validation errors`);
    }
    
    const all = contentManager.getAll();
    const withoutMetadata = all.filter(content => !content.metadata).length;
    if (withoutMetadata > 0) {
      recommendations.push(`${withoutMetadata} content items missing metadata`);
    }
    
    if ((stats.byStatus.draft ?? 0) > 5) {
      recommendations.push('Multiple draft content items - consider reviewing and publishing');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Content system is healthy - no immediate actions needed');
    }
    
    return recommendations;
  },
};

// Development utilities
export const ContentDev = {
  // Log content system status
  logStatus: () => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const stats = ContentAnalytics.getStats();
    const health = ContentAnalytics.getHealthScore();
    const recommendations = ContentAnalytics.getRecommendations();
    
    logger.info('Content System Status', {
      totalContent: stats.total,
      byType: stats.byType,
      byStatus: stats.byStatus,
      healthScore: `${health}/100`,
      recommendations
    });
  },

  // Reset all content (development only)
  reset: () => {
    if (process.env.NODE_ENV !== 'development') {
      logger.warn('Content reset is only available in development mode');
      return;
    }

    contentManager.clear();
    logger.info('Content system reset');
  },

  // Seed with placeholder data
  seed: () => {
    if (process.env.NODE_ENV !== 'development') {
      logger.warn('Content seeding is only available in development mode');
      return;
    }

    // Initialize placeholder content (implementation would go here)
    logger.info('Content system seeded with placeholder data');
  },
};

// Initialize content system
export function initializeContentSystem(config?: Partial<PlaceholderConfig>) {
  // Update configuration if provided
  if (config) {
    contentManager.updateConfig(config);
  }

  // Initialize placeholder content in development
  if (process.env.NODE_ENV === 'development') {
    // Placeholder content initialization would go here
    ContentDev.logStatus();
  }

  logger.info('Content integration system initialized');
}

// Auto-initialize in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Initialize after a short delay to ensure everything is loaded
  setTimeout(() => {
    initializeContentSystem();
  }, 100);
}
