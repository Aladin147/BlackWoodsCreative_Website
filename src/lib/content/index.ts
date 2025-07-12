/**
 * Content Integration Infrastructure
 *
 * Centralized exports for the simplified content management system
 */

// Import for internal use
import { logger } from '../utils/logger';

import { MigrationHelper } from './migration-helper';
import { contentManager as legacyContentManager, type Content } from './placeholder-system';
import { initializeBasicContent } from './simple-content';

// SIMPLIFIED CONTENT SYSTEM (NEW)
// Export the new simplified content system
export {
  type ContentItem,
  type PortfolioItem,
  type TestimonialItem,
  type ServiceItem,
  type TeamMember,
  contentStore,
  ContentUtils,
  ContentMigration,
  initializeBasicContent,
} from './simple-content';

export {
  useContent,
  useContentByType,
  useTextContent,
  useImageContent,
  usePortfolioItems,
  usePortfolioItem,
  useTestimonials,
  useTestimonial,
  useServices,
  useService,
  useTeamMembers,
  useTeamMember,
  useContentStats,
  useContentSearch,
  usePortfolioByCategory,
  useFeaturedPortfolio,
  useContentManagement,
} from './simple-hooks';

export { MigrationHelper, DevUtils } from './migration-helper';

export {
  ContentPlaceholderManager,
  contentManager as legacyContentManager,
  ContentUtils as LegacyContentUtils,
  type Content as LegacyContent,
  type ContentType as LegacyContentType,
  type ContentStatus as LegacyContentStatus,
  type ContentMetadata as LegacyContentMetadata,
  type BaseContent as LegacyBaseContent,
  type TextContent as LegacyTextContent,
  type ImageContent as LegacyImageContent,
  type VideoContent as LegacyVideoContent,
  type PortfolioContent as LegacyPortfolioContent,
  type TestimonialContent as LegacyTestimonialContent,
  type ServiceContent as LegacyServiceContent,
  type TeamContent as LegacyTeamContent,
  type BlogContent as LegacyBlogContent,
  type PageContent as LegacyPageContent,
  type ComponentContent as LegacyComponentContent,
  type PlaceholderConfig as LegacyPlaceholderConfig,
  type ContentSource as LegacyContentSource,
} from './placeholder-system';

// SIMPLIFIED COMPONENT EXPORTS
export {
  TextRenderer,
  ImageRenderer,
  PortfolioGrid,
  TestimonialsGrid,
  ServicesGrid,
  TeamGrid,
  ContentRenderer,
} from '../../components/content/SimpleContentRenderer';

// LEGACY HOOKS (DEPRECATED - use simple hooks instead)
export {
  useContent as legacyUseContent,
  useContentByType as legacyUseContentByType,
  useContentByStatus as legacyUseContentByStatus,
  useContentSearch as legacyUseContentSearch,
  useContentStats as legacyUseContentStats,
  useTextContent as legacyUseTextContent,
  useImageContent as legacyUseImageContent,
  useVideoContent as legacyUseVideoContent,
  usePortfolioContent as legacyUsePortfolioContent,
  useTestimonialContent as legacyUseTestimonialContent,
  useServiceContent as legacyUseServiceContent,
  useTeamContent as legacyUseTeamContent,
  useBlogContent as legacyUseBlogContent,
  usePageContent as legacyUsePageContent,
  type UseContentOptions as LegacyUseContentOptions,
  type UseContentResult as LegacyUseContentResult,
} from './hooks';

// LEGACY PLACEHOLDER DATA (DEPRECATED)
export { PlaceholderGenerators, initializePlaceholderContent } from './placeholder-data';

// LEGACY COMPONENT EXPORTS (DEPRECATED)
export {
  ContentRenderer as LegacyContentRenderer,
  TextRenderer as LegacyTextRenderer,
  ImageRenderer as LegacyImageRenderer,
  VideoRenderer as LegacyVideoRenderer,
  PortfolioRenderer as LegacyPortfolioRenderer,
  TestimonialRenderer as LegacyTestimonialRenderer,
  ServiceRenderer as LegacyServiceRenderer,
  TeamRenderer as LegacyTeamRenderer,
} from '../../components/content/ContentRenderer';

// SIMPLIFIED CONTENT SYSTEM INITIALIZATION
export const ContentSystem = {
  // Initialize the simplified content system
  initialize: () => {
    logger.info('Initializing simplified content system');
    initializeBasicContent();

    if (process.env.NODE_ENV === 'development') {
      MigrationHelper.logContentStatus();
    }
  },

  // Get system status
  getStatus: () => {
    return MigrationHelper.getContentStats();
  },

  // Get readiness report
  getReadinessReport: () => {
    return MigrationHelper.getReadinessReport();
  },
};

// LEGACY CONTENT MIGRATION (DEPRECATED - use ContentMigration from simple-content instead)
export const LegacyContentMigration = {
  // Export current content for backup
  exportContent: () => {
    return legacyContentManager.export();
  },

  // Import content from backup
  importContent: (data: Record<string, Content>) => {
    legacyContentManager.import(data);
  },

  // Get migration status
  getMigrationStatus: () => {
    const all = legacyContentManager.getAll();
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

// SIMPLIFIED INITIALIZATION AND AUTO-SETUP
export function initializeContentSystem() {
  logger.info('Initializing simplified content system');
  ContentSystem.initialize();
}

// Auto-initialize in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Initialize after a short delay to ensure everything is loaded
  setTimeout(() => {
    initializeContentSystem();
  }, 100);
}
