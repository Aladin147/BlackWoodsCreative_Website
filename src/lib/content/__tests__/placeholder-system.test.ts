/**
 * Content Placeholder System Tests
 */

import {
  ContentPlaceholderManager,
  ContentUtils,
  TextContent,
  PortfolioContent,
  TestimonialContent,
} from '../placeholder-system';

describe('ContentPlaceholderManager', () => {
  let manager: ContentPlaceholderManager;

  beforeEach(() => {
    manager = new ContentPlaceholderManager();
  });

  describe('Content Registration', () => {
    it('should register content successfully', () => {
      const textContent = ContentUtils.createTextPlaceholder('test-text', 'Test content', {
        title: 'Test Title',
      });

      manager.register(textContent);

      expect(manager.exists('test-text')).toBe(true);
      expect(manager.get('test-text')).toEqual(textContent);
    });

    it('should register multiple content items', () => {
      const contents = [
        ContentUtils.createTextPlaceholder('text-1', 'Content 1'),
        ContentUtils.createTextPlaceholder('text-2', 'Content 2'),
        ContentUtils.createImagePlaceholder('image-1', 'Alt text 1'),
      ];

      manager.registerBatch(contents);

      expect(manager.getAll()).toHaveLength(3);
      expect(manager.exists('text-1')).toBe(true);
      expect(manager.exists('text-2')).toBe(true);
      expect(manager.exists('image-1')).toBe(true);
    });
  });

  describe('Content Retrieval', () => {
    beforeEach(() => {
      const contents = [
        ContentUtils.createTextPlaceholder('text-1', 'Content 1'),
        ContentUtils.createImagePlaceholder('image-1', 'Alt text 1'),
        {
          id: 'portfolio-1',
          type: 'portfolio' as const,
          status: 'published' as const,
          lastUpdated: new Date(),
          version: '1.0.0',
          title: 'Test Portfolio',
          description: 'Test description',
          category: 'film',
          images: [],
          client: 'Test Client',
          year: 2024,
          tags: ['test'],
        } as PortfolioContent,
      ];

      manager.registerBatch(contents);
    });

    it('should get content by ID', () => {
      const content = manager.get('text-1');
      expect(content).toBeDefined();
      expect(content?.id).toBe('text-1');
    });

    it('should return null for non-existent content', () => {
      const content = manager.get('non-existent');
      expect(content).toBeNull();
    });

    it('should get content by type', () => {
      const textContents = manager.getByType('text');
      expect(textContents).toHaveLength(1);
      expect(textContents[0]?.id).toBe('text-1');

      const portfolioContents = manager.getByType('portfolio');
      expect(portfolioContents).toHaveLength(1);
      expect(portfolioContents[0]?.id).toBe('portfolio-1');
    });

    it('should get content by status', () => {
      const placeholders = manager.getByStatus('placeholder');
      expect(placeholders).toHaveLength(2); // text-1 and image-1

      const published = manager.getByStatus('published');
      expect(published).toHaveLength(1); // portfolio-1
    });
  });

  describe('Content Updates', () => {
    beforeEach(() => {
      const textContent = ContentUtils.createTextPlaceholder('test-text', 'Original content');
      manager.register(textContent);
    });

    it('should update existing content', () => {
      const success = manager.update('test-text', {
        content: 'Updated content',
        status: 'published',
      });

      expect(success).toBe(true);

      const updated = manager.get('test-text') as TextContent;
      expect(updated.content).toBe('Updated content');
      expect(updated.status).toBe('published');
      expect(updated.lastUpdated).toBeInstanceOf(Date);
    });

    it('should return false for non-existent content update', () => {
      const success = manager.update('non-existent', { status: 'published' });
      expect(success).toBe(false);
    });
  });

  describe('Content Deletion', () => {
    beforeEach(() => {
      const textContent = ContentUtils.createTextPlaceholder('test-text', 'Test content');
      manager.register(textContent);
    });

    it('should delete existing content', () => {
      expect(manager.exists('test-text')).toBe(true);

      const success = manager.delete('test-text');
      expect(success).toBe(true);
      expect(manager.exists('test-text')).toBe(false);
    });

    it('should return false for non-existent content deletion', () => {
      const success = manager.delete('non-existent');
      expect(success).toBe(false);
    });
  });

  describe('Content Export/Import', () => {
    it('should export and import content', () => {
      const contents = [
        ContentUtils.createTextPlaceholder('text-1', 'Content 1'),
        ContentUtils.createImagePlaceholder('image-1', 'Alt text 1'),
      ];

      manager.registerBatch(contents);

      const exported = manager.export();
      expect(Object.keys(exported)).toHaveLength(2);

      const newManager = new ContentPlaceholderManager();
      newManager.import(exported);

      expect(newManager.getAll()).toHaveLength(2);
      expect(newManager.exists('text-1')).toBe(true);
      expect(newManager.exists('image-1')).toBe(true);
    });
  });

  describe('Configuration Management', () => {
    it('should get and update configuration', () => {
      const config = manager.getConfig();
      expect(config).toBeDefined();
      expect(config.useRealContent).toBeDefined();

      manager.updateConfig({ useRealContent: true });
      const updatedConfig = manager.getConfig();
      expect(updatedConfig.useRealContent).toBe(true);
    });
  });
});

describe('ContentUtils', () => {
  describe('Content Creation', () => {
    it('should create text placeholder', () => {
      const textContent = ContentUtils.createTextPlaceholder('test-text', 'Test content', {
        title: 'Test Title',
      });

      expect(textContent.id).toBe('test-text');
      expect(textContent.type).toBe('text');
      expect(textContent.status).toBe('placeholder');
      expect(textContent.content).toBe('Test content');
      expect(textContent.placeholder).toBe('Test content');
      expect(textContent.metadata?.title).toBe('Test Title');
    });

    it('should create image placeholder', () => {
      const imageContent = ContentUtils.createImagePlaceholder('test-image', 'Test alt text', {
        title: 'Test Image',
      });

      expect(imageContent.id).toBe('test-image');
      expect(imageContent.type).toBe('image');
      expect(imageContent.status).toBe('placeholder');
      expect(imageContent.alt).toBe('Test alt text');
      expect(imageContent.src).toBeDefined();
      expect(imageContent.placeholder).toBeDefined();
      expect(imageContent.metadata?.title).toBe('Test Image');
    });
  });

  describe('Content Validation', () => {
    it('should validate valid content', () => {
      const validContent = ContentUtils.createTextPlaceholder('test', 'content');
      expect(ContentUtils.validateContent(validContent)).toBe(true);
    });

    it('should invalidate content missing required fields', () => {
      const invalidContent = {
        id: 'test',
        type: 'text' as const,
        // Missing required fields
      } as any;

      expect(ContentUtils.validateContent(invalidContent)).toBe(false);
    });
  });

  describe('Content Status Checks', () => {
    it('should identify placeholder content', () => {
      const placeholderContent = ContentUtils.createTextPlaceholder('test', 'content');
      expect(ContentUtils.isPlaceholder(placeholderContent)).toBe(true);

      const publishedContent = { ...placeholderContent, status: 'published' as const };
      expect(ContentUtils.isPlaceholder(publishedContent)).toBe(false);
    });

    it('should identify production-ready content', () => {
      const placeholderContent = ContentUtils.createTextPlaceholder('test', 'content');
      expect(ContentUtils.isProductionReady(placeholderContent)).toBe(false);

      const publishedContent = { ...placeholderContent, status: 'published' as const };
      expect(ContentUtils.isProductionReady(publishedContent)).toBe(true);

      const approvedContent = { ...placeholderContent, status: 'approved' as const };
      expect(ContentUtils.isProductionReady(approvedContent)).toBe(true);
    });
  });

  describe('ID Generation', () => {
    it('should generate unique IDs', () => {
      const id1 = ContentUtils.generateId('text');
      const id2 = ContentUtils.generateId('text');

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^text-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^text-\d+-[a-z0-9]+$/);
    });

    it('should generate IDs with suffix', () => {
      const id = ContentUtils.generateId('image', 'hero');
      expect(id).toMatch(/^image-\d+-[a-z0-9]+-hero$/);
    });
  });
});

describe('Content Integration', () => {
  let manager: ContentPlaceholderManager;

  beforeEach(() => {
    manager = new ContentPlaceholderManager();
  });

  it('should handle mixed content types', () => {
    const contents = [
      ContentUtils.createTextPlaceholder('hero-title', 'Welcome to BlackWoods'),
      ContentUtils.createImagePlaceholder('hero-image', 'Hero background'),
      {
        id: 'testimonial-1',
        type: 'testimonial' as const,
        status: 'placeholder' as const,
        lastUpdated: new Date(),
        version: '1.0.0',
        name: 'John Doe',
        company: 'Test Company',
        role: 'CEO',
        content: 'Great work!',
        rating: 5,
      } as TestimonialContent,
    ];

    manager.registerBatch(contents);

    expect(manager.getAll()).toHaveLength(3);
    expect(manager.getByType('text')).toHaveLength(1);
    expect(manager.getByType('image')).toHaveLength(1);
    expect(manager.getByType('testimonial')).toHaveLength(1);
  });

  it('should support content migration workflow', () => {
    // Start with placeholder
    const placeholder = ContentUtils.createTextPlaceholder('hero-title', 'Placeholder title');
    manager.register(placeholder);

    expect(ContentUtils.isPlaceholder(placeholder)).toBe(true);

    // Migrate to real content
    manager.update('hero-title', {
      content: 'Real hero title',
      status: 'published',
      metadata: {
        title: 'Hero Title',
        description: 'Main hero title for homepage',
        seoTitle: 'BlackWoods Creative - Premium Visual Storytelling',
      },
    });

    const updated = manager.get('hero-title');
    expect(updated?.status).toBe('published');
    expect(ContentUtils.isProductionReady(updated!)).toBe(true);
    expect((updated as TextContent).content).toBe('Real hero title');
  });

  it('should maintain content versioning', () => {
    const content = ContentUtils.createTextPlaceholder('test', 'v1 content');
    manager.register(content);

    // Update content
    manager.update('test', {
      content: 'v2 content',
      version: '2.0.0',
    });

    const updated = manager.get('test');
    expect(updated?.version).toBe('2.0.0');
    expect((updated as TextContent).content).toBe('v2 content');
  });
});
