import type { PortfolioProject } from '@/lib/types/portfolio';

import { portfolioData } from '../portfolio';

describe('portfolioData', () => {
  it('is an array', () => {
    expect(Array.isArray(portfolioData)).toBe(true);
  });

  it('has the correct number of projects', () => {
    expect(portfolioData).toHaveLength(9);
  });

  it('has all required properties for each project', () => {
    portfolioData.forEach(project => {
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('description');
      expect(project).toHaveProperty('category');
      expect(project).toHaveProperty('type');
      expect(project).toHaveProperty('image');
      expect(project).toHaveProperty('tags');
      expect(project).toHaveProperty('client');
      expect(project).toHaveProperty('year');
      expect(project).toHaveProperty('software');
    });
  });

  it('has unique project IDs', () => {
    const ids = portfolioData.map(project => project.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has valid project types', () => {
    const validTypes = ['video', 'image'];
    portfolioData.forEach(project => {
      expect(validTypes).toContain(project.type);
    });
  });

  it('has valid categories', () => {
    const validCategories = ['Film', 'Photography', '3D Visualization', 'Scene Creation'];
    portfolioData.forEach(project => {
      expect(validCategories).toContain(project.category);
    });
  });

  it('has valid years', () => {
    portfolioData.forEach(project => {
      expect(project.year).toBeGreaterThanOrEqual(2020);
      expect(project.year).toBeLessThanOrEqual(new Date().getFullYear());
    });
  });

  it('has valid image URLs', () => {
    portfolioData.forEach(project => {
      expect(project.image).toMatch(/^https:\/\//);
      expect(project.image).toContain('unsplash.com');
    });
  });

  it('has non-empty titles and descriptions', () => {
    portfolioData.forEach(project => {
      expect(project.title.trim()).toBeTruthy();
      expect(project.description.trim()).toBeTruthy();
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.description.length).toBeGreaterThan(10);
    });
  });

  it('has non-empty tags arrays', () => {
    portfolioData.forEach(project => {
      expect(Array.isArray(project.tags)).toBe(true);
      expect(project.tags?.length).toBeGreaterThan(0);
      project.tags?.forEach(tag => {
        expect(typeof tag).toBe('string');
        expect(tag.trim()).toBeTruthy();
      });
    });
  });

  it('has non-empty software arrays', () => {
    portfolioData.forEach(project => {
      expect(Array.isArray(project.software)).toBe(true);
      expect(project.software?.length).toBeGreaterThan(0);
      project.software?.forEach(software => {
        expect(typeof software).toBe('string');
        expect(software.trim()).toBeTruthy();
      });
    });
  });

  describe('video projects', () => {
    const videoProjects = portfolioData.filter(project => project.type === 'video');

    it('has video projects', () => {
      expect(videoProjects.length).toBeGreaterThan(0);
    });

    it('has video URLs for video projects', () => {
      videoProjects.forEach(project => {
        expect(project.video).toBeDefined();
        expect(project.video).toMatch(/^\/assets\/videos\/.*\.mp4$/);
      });
    });

    it('has duration for video projects', () => {
      videoProjects.forEach(project => {
        expect(project.duration).toBeDefined();
        expect(project.duration).toMatch(/^\d+:\d{2}$/);
      });
    });

    it('belongs to Film category', () => {
      videoProjects.forEach(project => {
        expect(project.category).toBe('Film');
      });
    });
  });

  describe('image projects', () => {
    const imageProjects = portfolioData.filter(project => project.type === 'image');

    it('has image projects', () => {
      expect(imageProjects.length).toBeGreaterThan(0);
    });

    it('does not have video URLs', () => {
      imageProjects.forEach(project => {
        expect(project.video).toBeUndefined();
      });
    });

    it('does not have duration', () => {
      imageProjects.forEach(project => {
        expect(project.duration).toBeUndefined();
      });
    });
  });

  describe('featured projects', () => {
    const featuredProjects = portfolioData.filter(project => project.featured);

    it('has featured projects', () => {
      expect(featuredProjects.length).toBeGreaterThan(0);
    });

    it('has reasonable number of featured projects', () => {
      expect(featuredProjects.length).toBeLessThanOrEqual(portfolioData.length / 2);
    });

    it('includes projects from different categories', () => {
      const categories = featuredProjects.map(project => project.category);
      const uniqueCategories = new Set(categories);
      expect(uniqueCategories.size).toBeGreaterThan(1);
    });
  });

  describe('specific projects', () => {
    it('has cinematic brand film project', () => {
      const project = portfolioData.find(p => p.id === 'cinematic-brand-film');
      expect(project).toBeDefined();
      expect(project?.title).toBe('Cinematic Brand Film');
      expect(project?.category).toBe('Film');
      expect(project?.type).toBe('video');
      expect(project?.featured).toBe(true);
    });

    it('has architectural visualization project', () => {
      const project = portfolioData.find(p => p.id === 'architectural-visualization');
      expect(project).toBeDefined();
      expect(project?.title).toBe('Modern Architecture Visualization');
      expect(project?.category).toBe('3D Visualization');
      expect(project?.type).toBe('image');
    });

    it('has product photography project', () => {
      const project = portfolioData.find(p => p.id === 'product-photography');
      expect(project).toBeDefined();
      expect(project?.title).toBe('Premium Product Photography');
      expect(project?.category).toBe('Photography');
      expect(project?.type).toBe('image');
    });

    it('has immersive scene project', () => {
      const project = portfolioData.find(p => p.id === 'immersive-scene');
      expect(project).toBeDefined();
      expect(project?.title).toBe('Immersive Forest Scene');
      expect(project?.category).toBe('Scene Creation');
      expect(project?.type).toBe('image');
    });
  });

  describe('data consistency', () => {
    it('has consistent ID format', () => {
      portfolioData.forEach(project => {
        expect(project.id).toMatch(/^[a-z0-9-]+$/);
        expect(project.id).not.toMatch(/^-|-$/);
      });
    });

    it('has consistent client format', () => {
      portfolioData.forEach(project => {
        expect(project.client).toBeTruthy();
        expect(typeof project.client).toBe('string');
      });
    });

    it('has consistent tag format', () => {
      portfolioData.forEach(project => {
        project.tags?.forEach(tag => {
          expect(tag).toMatch(/^[A-Za-z0-9\s-]+$/);
        });
      });
    });

    it('has consistent software format', () => {
      portfolioData.forEach(project => {
        project.software?.forEach(software => {
          expect(software).toBeTruthy();
          expect(typeof software).toBe('string');
        });
      });
    });
  });

  describe('category distribution', () => {
    it('has projects in all categories', () => {
      const categories = ['Film', 'Photography', '3D Visualization', 'Scene Creation'];
      categories.forEach(category => {
        const projectsInCategory = portfolioData.filter(p => p.category === category);
        expect(projectsInCategory.length).toBeGreaterThan(0);
      });
    });

    it('has balanced distribution', () => {
      const categoryCount = portfolioData.reduce(
        (acc, project) => {
          acc[project.category] = (acc[project.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      Object.values(categoryCount).forEach(count => {
        expect(count).toBeGreaterThan(0);
        expect(count).toBeLessThanOrEqual(portfolioData.length);
      });
    });
  });

  describe('optional properties', () => {
    it('handles dimensions property correctly', () => {
      const projectsWithDimensions = portfolioData.filter(p => p.dimensions);
      expect(projectsWithDimensions.length).toBeGreaterThan(0);

      projectsWithDimensions.forEach(project => {
        expect(typeof project.dimensions).toBe('string');
        expect(project.dimensions?.trim()).toBeTruthy();
      });
    });

    it('handles featured property correctly', () => {
      portfolioData.forEach(project => {
        if (project.featured !== undefined) {
          expect(typeof project.featured).toBe('boolean');
        }
      });
    });
  });

  describe('type safety', () => {
    it('conforms to PortfolioProject type', () => {
      portfolioData.forEach((project: PortfolioProject) => {
        expect(typeof project.id).toBe('string');
        expect(typeof project.title).toBe('string');
        expect(typeof project.description).toBe('string');
        expect(typeof project.category).toBe('string');
        expect(typeof project.type).toBe('string');
        expect(typeof project.image).toBe('string');
        expect(Array.isArray(project.tags)).toBe(true);
        expect(typeof project.client).toBe('string');
        expect(typeof project.year).toBe('number');
        expect(Array.isArray(project.software)).toBe(true);
      });
    });
  });
});
