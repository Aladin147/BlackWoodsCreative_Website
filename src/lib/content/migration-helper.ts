/**
 * Content System Migration Helper
 *
 * Utilities to help migrate from the complex content system to the simplified one
 */

import { logger } from '../utils/logger';

import {
  ContentItem,
  PortfolioItem,
  TestimonialItem,
  ServiceItem,
  contentStore,
  initializeBasicContent,
} from './simple-content';

// Migration utilities
export const MigrationHelper = {
  // Initialize the simplified content system
  initializeSimpleSystem: () => {
    logger.info('🔄 Initializing simplified content system...');
    initializeBasicContent();
    logger.info('✅ Simplified content system initialized');

    const stats = contentStore.getAll();
    logger.info(`📊 Created ${stats.length} placeholder content items:`);

    const byType: Record<string, number> = {};
    stats.forEach(item => {
      byType[item.type] = (byType[item.type] ?? 0) + 1;
    });

    Object.entries(byType).forEach(([type, count]) => {
      logger.info(`   - ${type}: ${count} items`);
    });
  },

  // Get current content statistics
  getContentStats: () => {
    const allContent = contentStore.getAll();
    const placeholders = allContent.filter(item => item.isPlaceholder);
    const realContent = allContent.filter(item => !item.isPlaceholder);

    const byType: Record<string, { total: number; placeholders: number; real: number }> = {};

    allContent.forEach(item => {
      byType[item.type] ??= { total: 0, placeholders: 0, real: 0 };
      const typeStats = byType[item.type];
      if (typeStats) {
        typeStats.total++;
        if (item.isPlaceholder) {
          typeStats.placeholders++;
        } else {
          typeStats.real++;
        }
      }
    });

    return {
      total: allContent.length,
      placeholders: placeholders.length,
      realContent: realContent.length,
      byType,
    };
  },

  // Log current content status
  logContentStatus: () => {
    const stats = MigrationHelper.getContentStats();

    logger.info('\n📊 Content System Status:');
    logger.info(`   Total items: ${stats.total}`);
    logger.info(`   Placeholders: ${stats.placeholders}`);
    logger.info(`   Real content: ${stats.realContent}`);
    logger.info('\n📋 By Type:');

    Object.entries(stats.byType).forEach(([type, counts]) => {
      logger.info(
        `   ${type}: ${counts.total} total (${counts.placeholders} placeholders, ${counts.real} real)`
      );
    });
  },

  // Create sample real content for testing
  createSampleRealContent: () => {
    logger.info('🎨 Creating sample real content...');

    // Replace some text content
    contentStore.update('hero-title', {
      title: 'BlackWoods Creative',
      content: "Morocco's Premier Visual Storytelling Studio",
      isPlaceholder: false,
      metadata: {
        seoTitle: "BlackWoods Creative - Morocco's Premier Visual Storytelling Studio",
        seoDescription:
          'Professional video production, photography, and 3D visualization services in Morocco',
        tags: ['video production', 'photography', '3d visualization', 'morocco'],
      },
    });

    contentStore.update('hero-subtitle', {
      content:
        'We craft compelling visual narratives that elevate your brand and connect with your audience through the power of professional filmmaking, photography, and 3D visualization.',
      isPlaceholder: false,
    });

    // Replace a portfolio item
    const portfolioItems = contentStore.getByType<PortfolioItem>('portfolio');
    if (portfolioItems.length > 0 && portfolioItems[0]) {
      contentStore.update(portfolioItems[0].id, {
        title: 'Corporate Brand Film - TechCorp Morocco',
        content:
          "A dynamic corporate brand film showcasing TechCorp's innovative approach to technology solutions in Morocco. This project combined cinematic storytelling with corporate messaging to create a compelling narrative.",
        client: 'TechCorp Morocco',
        year: 2024,
        featured: true,
        isPlaceholder: false,
        images: [
          'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center',
        ],
        metadata: {
          description: 'Corporate brand film for TechCorp Morocco',
          tags: ['corporate video', 'brand film', 'technology', 'morocco'],
          seoTitle: 'Corporate Brand Film - TechCorp Morocco | BlackWoods Creative',
          seoDescription:
            'Professional corporate brand film production for TechCorp Morocco by BlackWoods Creative',
        },
      });
    }

    // Replace a testimonial
    const testimonials = contentStore.getByType<TestimonialItem>('testimonial');
    if (testimonials.length > 0 && testimonials[0]) {
      contentStore.update(testimonials[0].id, {
        title: 'Outstanding Creative Partnership',
        content:
          'BlackWoods Creative exceeded our expectations with their professional approach and creative vision. The final video perfectly captured our brand essence and has significantly improved our marketing efforts.',
        author: 'Sarah Johnson',
        position: 'Marketing Director',
        company: 'TechCorp Morocco',
        rating: 5,
        isPlaceholder: false,
      });
    }

    // Replace a service
    const services = contentStore.getByType<ServiceItem>('service');
    if (services.length > 0 && services[0]) {
      contentStore.update(services[0].id, {
        title: 'Professional Video Production',
        content:
          'From concept to final cut, we provide comprehensive video production services including corporate films, commercials, documentaries, and promotional content.',
        features: [
          'Pre-production planning',
          'Professional cinematography',
          'Advanced post-production',
          'Color grading & sound design',
          'Multiple format delivery',
        ],
        icon: '🎬',
        isPlaceholder: false,
        metadata: {
          description: 'Professional video production services in Morocco',
          tags: ['video production', 'cinematography', 'post-production', 'morocco'],
          seoTitle: 'Professional Video Production Services Morocco | BlackWoods Creative',
          seoDescription:
            'Comprehensive video production services in Morocco including corporate films, commercials, and promotional content',
        },
      });
    }

    logger.info('✅ Sample real content created');
    MigrationHelper.logContentStatus();
  },

  // Export content for backup
  exportContent: () => {
    const content = contentStore.export();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `content-backup-${timestamp}.json`;

    logger.info(`💾 Exporting content to ${filename}`);

    // In a real implementation, this would save to file
    // For now, just return the data
    return {
      filename,
      data: content,
      stats: MigrationHelper.getContentStats(),
    };
  },

  // Import content from backup
  importContent: (data: Record<string, ContentItem>) => {
    logger.info('📥 Importing content...');
    contentStore.import(data);
    logger.info('✅ Content imported successfully');
    MigrationHelper.logContentStatus();
  },

  // Validate content structure
  validateContent: () => {
    const allContent = contentStore.getAll();
    const issues: string[] = [];

    allContent.forEach(item => {
      const itemId = item.id || 'unknown';
      if (!item.id) issues.push(`Item missing ID: ${JSON.stringify(item)}`);
      if (!item.type) issues.push(`Item ${itemId} missing type`);
      if (!item.title) issues.push(`Item ${itemId} missing title`);
      if (!item.content) issues.push(`Item ${itemId} missing content`);
      if (typeof item.isPlaceholder !== 'boolean') {
        issues.push(`Item ${itemId} has invalid isPlaceholder value`);
      }
    });

    if (issues.length === 0) {
      logger.info('✅ All content items are valid');
    } else {
      logger.warn('⚠️ Content validation issues found:');
      issues.forEach(issue => logger.warn(`   - ${issue}`));
    }

    return issues;
  },

  // Get content readiness report
  getReadinessReport: () => {
    const stats = MigrationHelper.getContentStats();
    const readinessPercentage = stats.total > 0 ? (stats.realContent / stats.total) * 100 : 0;

    const report = {
      readinessPercentage: Math.round(readinessPercentage),
      totalItems: stats.total,
      readyItems: stats.realContent,
      pendingItems: stats.placeholders,
      byType: stats.byType,
      recommendations: [] as string[],
    };

    // Generate recommendations
    if (readinessPercentage < 25) {
      report.recommendations.push(
        'Content system is in early stage - focus on creating core content first'
      );
    } else if (readinessPercentage < 50) {
      report.recommendations.push(
        'Good progress - continue replacing placeholder content with real content'
      );
    } else if (readinessPercentage < 75) {
      report.recommendations.push(
        'Content system is well developed - focus on quality and SEO optimization'
      );
    } else {
      report.recommendations.push('Content system is nearly ready for production');
    }

    Object.entries(stats.byType).forEach(([type, counts]) => {
      if (counts.placeholders > counts.real) {
        report.recommendations.push(
          `Focus on ${type} content - ${counts.placeholders} placeholders remaining`
        );
      }
    });

    return report;
  },

  // Clear all content (use with caution)
  clearAllContent: () => {
    logger.info('🗑️ Clearing all content...');
    contentStore.clear();
    logger.info('✅ All content cleared');
  },

  // Reset to initial state
  resetToInitialState: () => {
    logger.info('🔄 Resetting to initial state...');
    MigrationHelper.clearAllContent();
    MigrationHelper.initializeSimpleSystem();
    logger.info('✅ Reset complete');
  },
};

// Development utilities
export const DevUtils = {
  // Log all content IDs for reference
  logContentIds: () => {
    const allContent = contentStore.getAll();
    logger.info('\n📝 All Content IDs:');

    const byType: Record<string, string[]> = {};
    allContent.forEach(item => {
      byType[item.type] ??= [];
      const typeArray = byType[item.type];
      if (typeArray) {
        typeArray.push(item.id);
      }
    });

    Object.entries(byType).forEach(([type, ids]) => {
      logger.info(`\n${type.toUpperCase()}:`);
      ids.forEach(id => logger.info(`   - ${id}`));
    });
  },

  // Quick content lookup
  findContent: (query: string) => {
    const allContent = contentStore.getAll();
    const results = allContent.filter(
      item =>
        item.id.includes(query) ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase())
    );

    logger.info(`🔍 Search results for "${query}":`);
    results.forEach(item => {
      logger.info(`   - ${item.id}: ${item.title} (${item.type})`);
    });

    return results;
  },
};
