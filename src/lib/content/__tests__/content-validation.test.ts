/**
 * Content Management System Validation Tests
 * 
 * Comprehensive tests to validate the content management system
 * is ready for real content population and production use.
 */

import { MigrationHelper } from '../migration-helper';
import { contentStore, ContentUtils, ContentMigration, initializeBasicContent, PortfolioItem } from '../simple-content';

describe('Content Management System Validation', () => {
  beforeEach(() => {
    // Reset content systems
    contentStore.clear();
  });

  describe('System Initialization', () => {
    it('should initialize content system successfully', () => {
      expect(() => initializeBasicContent()).not.toThrow();

      const allContent = contentStore.getAll();
      expect(allContent.length).toBeGreaterThan(0);
    });

    it('should provide system status information', () => {
      initializeBasicContent();

      const stats = MigrationHelper.getContentStats();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('placeholders');
      expect(stats).toHaveProperty('realContent');
      expect(stats).toHaveProperty('byType');
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBeGreaterThan(0);
    });

    it('should generate content statistics', () => {
      initializeBasicContent();

      const stats = MigrationHelper.getContentStats();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.placeholders).toBeGreaterThan(0);
      expect(Object.keys(stats.byType).length).toBeGreaterThan(0);
    });
  });

  describe('Content Store Operations', () => {
    it('should add and retrieve content items', () => {
      const textContent = ContentUtils.createText(
        'test-content',
        'Test Title',
        'Test content body'
      );

      contentStore.add(textContent);
      
      const retrieved = contentStore.get('test-content');
      expect(retrieved).toEqual(textContent);
      expect(retrieved?.isPlaceholder).toBe(true);
    });

    it('should update existing content', () => {
      const textContent = ContentUtils.createText(
        'test-content',
        'Original Title',
        'Original content'
      );

      contentStore.add(textContent);
      
      const success = contentStore.update('test-content', {
        title: 'Updated Title',
        content: 'Updated content',
        isPlaceholder: false
      });

      expect(success).toBe(true);
      
      const updated = contentStore.get('test-content');
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.content).toBe('Updated content');
      expect(updated?.isPlaceholder).toBe(false);
    });

    it('should handle content removal', () => {
      const textContent = ContentUtils.createText(
        'test-content',
        'Test Title',
        'Test content'
      );

      contentStore.add(textContent);
      expect(contentStore.get('test-content')).toBeTruthy();
      
      const success = contentStore.remove('test-content');
      expect(success).toBe(true);
      expect(contentStore.get('test-content')).toBeNull();
    });

    it('should list content by type', () => {
      const textContent = ContentUtils.createText('text-1', 'Text 1', 'Content 1');
      const portfolioContent = ContentUtils.createPortfolio(
        'portfolio-1',
        'Portfolio 1',
        'Portfolio content',
        'film'
      );

      contentStore.add(textContent);
      contentStore.add(portfolioContent);

      const textItems = contentStore.getByType('text');
      const portfolioItems = contentStore.getByType('portfolio');

      expect(textItems).toHaveLength(1);
      expect(portfolioItems).toHaveLength(1);
      expect(textItems[0]?.id).toBe('text-1');
      expect(portfolioItems[0]?.id).toBe('portfolio-1');
    });
  });

  describe('Content Migration Workflow', () => {
    it('should support placeholder to real content migration', () => {
      // Start with placeholder content
      const placeholder = ContentUtils.createText(
        'hero-title',
        'Placeholder Title',
        'Placeholder content'
      );

      contentStore.add(placeholder);
      expect(contentStore.get('hero-title')?.isPlaceholder).toBe(true);

      // Migrate to real content
      const migrationSuccess = ContentMigration.replaceContent('hero-title', {
        title: 'BlackWoods Creative - Premium Visual Storytelling',
        content: 'Crafting compelling visual narratives that resonate with your audience'
      });

      expect(migrationSuccess).toBe(true);

      const migrated = contentStore.get('hero-title');
      expect(migrated?.isPlaceholder).toBe(false);
      expect(migrated?.title).toBe('BlackWoods Creative - Premium Visual Storytelling');
    });

    it('should handle bulk content migration', () => {
      const placeholder1 = ContentUtils.createText('text-1', 'Title 1', 'Content 1');
      const placeholder2 = ContentUtils.createText('text-2', 'Title 2', 'Content 2');

      contentStore.add(placeholder1);
      contentStore.add(placeholder2);

      // Bulk migrate
      const successCount = ContentMigration.bulkReplace({
        'text-1': { title: 'Updated Title 1', content: 'Updated Content 1' },
        'text-2': { title: 'Updated Title 2', content: 'Updated Content 2' }
      });

      expect(successCount).toBe(2);

      const updated1 = contentStore.get('text-1');
      const updated2 = contentStore.get('text-2');

      expect(updated1?.isPlaceholder).toBe(false);
      expect(updated2?.isPlaceholder).toBe(false);
      expect(updated1?.title).toBe('Updated Title 1');
      expect(updated2?.title).toBe('Updated Title 2');
    });

    it('should get placeholder and real content lists', () => {
      const placeholder = ContentUtils.createText('placeholder', 'Placeholder', 'Content', true);
      const realContent = ContentUtils.createText('real', 'Real', 'Content', false);

      contentStore.add(placeholder);
      contentStore.add(realContent);

      const placeholders = ContentMigration.getPlaceholders();
      const realItems = ContentMigration.getRealContent();

      expect(placeholders).toHaveLength(1);
      expect(realItems).toHaveLength(1);
      expect(placeholders[0]?.id).toBe('placeholder');
      expect(realItems[0]?.id).toBe('real');
    });
  });

  describe('Content Validation', () => {
    it('should identify placeholder vs real content', () => {
      const placeholder = ContentUtils.createText(
        'placeholder',
        'Placeholder Title',
        'Placeholder content',
        true
      );

      const realContent = ContentUtils.createText(
        'real',
        'Real Title',
        'Real content',
        false
      );

      expect(ContentUtils.isPlaceholder(placeholder)).toBe(true);
      expect(ContentUtils.isPlaceholder(realContent)).toBe(false);
    });

    it('should mark content as real', () => {
      const placeholder = ContentUtils.createText(
        'placeholder',
        'Placeholder Title',
        'Placeholder content',
        true
      );

      expect(placeholder.isPlaceholder).toBe(true);

      const realContent = ContentUtils.markAsReal(placeholder);
      expect(realContent.isPlaceholder).toBe(false);
      expect(realContent.title).toBe(placeholder.title);
      expect(realContent.content).toBe(placeholder.content);
    });

    it('should generate unique IDs', () => {
      const id1 = ContentUtils.generateId('test');
      const id2 = ContentUtils.generateId('test');

      expect(id1).toMatch(/^test-\d+-[a-z0-9]{6}$/);
      expect(id2).toMatch(/^test-\d+-[a-z0-9]{6}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('Content Categories and Types', () => {
    it('should handle all content types correctly', () => {
      const textContent = ContentUtils.createText('text-1', 'Text', 'Content');
      const imageContent = ContentUtils.createImage('image-1', 'Image', '/image.jpg', 'Alt text');
      const portfolioContent = ContentUtils.createPortfolio('portfolio-1', 'Portfolio', 'Description', 'film');
      const testimonialContent = ContentUtils.createTestimonial('testimonial-1', 'Client', 'Great work!', 'Company');
      const serviceContent = ContentUtils.createService('service-1', 'Service', 'Description');
      const teamContent = ContentUtils.createTeamMember('team-1', 'John Doe', 'Developer', 'Bio');

      const contents = [textContent, imageContent, portfolioContent, testimonialContent, serviceContent, teamContent];
      
      contents.forEach(content => {
        contentStore.add(content);
        expect(contentStore.get(content.id)).toEqual(content);
      });

      expect(contentStore.getByType('text')).toHaveLength(1);
      expect(contentStore.getByType('image')).toHaveLength(1);
      expect(contentStore.getByType('portfolio')).toHaveLength(1);
      expect(contentStore.getByType('testimonial')).toHaveLength(1);
      expect(contentStore.getByType('service')).toHaveLength(1);
      expect(contentStore.getByType('team')).toHaveLength(1);
    });

    it('should categorize portfolio content correctly', () => {
      const filmPortfolio = ContentUtils.createPortfolio('film-1', 'Film Project', 'Description', 'film');
      const photoPortfolio = ContentUtils.createPortfolio('photo-1', 'Photo Project', 'Description', 'photography');
      const threeDPortfolio = ContentUtils.createPortfolio('3d-1', '3D Project', 'Description', '3d');
      const scenePortfolio = ContentUtils.createPortfolio('scene-1', 'Scene Project', 'Description', 'scenes');

      [filmPortfolio, photoPortfolio, threeDPortfolio, scenePortfolio].forEach(content => {
        contentStore.add(content);
      });

      const portfolioItems = contentStore.getByType('portfolio');
      expect(portfolioItems).toHaveLength(4);

      const categories = portfolioItems.map(item => (item as PortfolioItem).category);
      expect(categories).toContain('film');
      expect(categories).toContain('photography');
      expect(categories).toContain('3d');
      expect(categories).toContain('scenes');
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent content gracefully', () => {
      expect(contentStore.get('non-existent')).toBeNull();
      expect(contentStore.update('non-existent', { title: 'New Title' })).toBe(false);
      expect(contentStore.remove('non-existent')).toBe(false);
    });

    it('should handle invalid content types', () => {
      expect(contentStore.getByType('invalid-type' as any)).toHaveLength(0);
    });

    it('should handle migration errors gracefully', () => {
      // Try to migrate non-existent content
      const result = ContentMigration.replaceContent('non-existent', {
        title: 'Title',
        content: 'Content'
      });

      expect(result).toBe(false);
    });
  });
});
