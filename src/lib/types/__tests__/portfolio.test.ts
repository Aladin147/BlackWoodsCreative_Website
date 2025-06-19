import { PortfolioProject, PortfolioCategory } from '../portfolio';

describe('Portfolio Types', () => {
  describe('PortfolioProject', () => {
    it('should define a valid PortfolioProject interface', () => {
      const project: PortfolioProject = {
        id: 'project-1',
        title: 'Test Project',
        description: 'A test project description',
        category: 'Film',
        type: 'video',
        image: '/images/project-1.jpg',
        video: '/videos/project-1.mp4',
        tags: ['cinematic', 'commercial'],
        client: 'Test Client',
        year: 2024,
        featured: true,
        duration: '2:30',
        dimensions: '1920x1080',
        software: ['After Effects', 'Premiere Pro'],
      };

      expect(project.id).toBe('project-1');
      expect(project.title).toBe('Test Project');
      expect(project.description).toBe('A test project description');
      expect(project.category).toBe('Film');
      expect(project.type).toBe('video');
      expect(project.image).toBe('/images/project-1.jpg');
      expect(project.video).toBe('/videos/project-1.mp4');
      expect(project.tags).toEqual(['cinematic', 'commercial']);
      expect(project.client).toBe('Test Client');
      expect(project.year).toBe(2024);
      expect(project.featured).toBe(true);
      expect(project.duration).toBe('2:30');
      expect(project.dimensions).toBe('1920x1080');
      expect(project.software).toEqual(['After Effects', 'Premiere Pro']);
    });

    it('should allow minimal PortfolioProject with required fields only', () => {
      const minimalProject: PortfolioProject = {
        id: 'minimal-1',
        title: 'Minimal Project',
        description: 'Minimal description',
        category: 'Photography',
        type: 'image',
        image: '/images/minimal.jpg',
      };

      expect(minimalProject.id).toBe('minimal-1');
      expect(minimalProject.title).toBe('Minimal Project');
      expect(minimalProject.description).toBe('Minimal description');
      expect(minimalProject.category).toBe('Photography');
      expect(minimalProject.type).toBe('image');
      expect(minimalProject.image).toBe('/images/minimal.jpg');
      expect(minimalProject.video).toBeUndefined();
      expect(minimalProject.tags).toBeUndefined();
      expect(minimalProject.client).toBeUndefined();
      expect(minimalProject.year).toBeUndefined();
      expect(minimalProject.featured).toBeUndefined();
      expect(minimalProject.duration).toBeUndefined();
      expect(minimalProject.dimensions).toBeUndefined();
      expect(minimalProject.software).toBeUndefined();
    });

    it('should support all valid category types', () => {
      const categories: PortfolioProject['category'][] = [
        'Film',
        'Photography',
        '3D Visualization',
        'Scene Creation',
      ];

      categories.forEach((category) => {
        const project: PortfolioProject = {
          id: `project-${category}`,
          title: `${category} Project`,
          description: `A ${category} project`,
          category,
          type: 'image',
          image: '/images/test.jpg',
        };

        expect(project.category).toBe(category);
      });
    });

    it('should support all valid type values', () => {
      const types: PortfolioProject['type'][] = ['image', 'video'];

      types.forEach((type) => {
        const project: PortfolioProject = {
          id: `project-${type}`,
          title: `${type} Project`,
          description: `A ${type} project`,
          category: 'Film',
          type,
          image: '/images/test.jpg',
        };

        expect(project.type).toBe(type);
      });
    });

    it('should handle arrays for tags and software', () => {
      const project: PortfolioProject = {
        id: 'array-test',
        title: 'Array Test',
        description: 'Testing arrays',
        category: '3D Visualization',
        type: 'image',
        image: '/images/test.jpg',
        tags: ['tag1', 'tag2', 'tag3'],
        software: ['Blender', 'Maya', 'Cinema 4D'],
      };

      expect(Array.isArray(project.tags)).toBe(true);
      expect(project.tags).toHaveLength(3);
      expect(project.tags).toContain('tag1');
      expect(project.tags).toContain('tag2');
      expect(project.tags).toContain('tag3');

      expect(Array.isArray(project.software)).toBe(true);
      expect(project.software).toHaveLength(3);
      expect(project.software).toContain('Blender');
      expect(project.software).toContain('Maya');
      expect(project.software).toContain('Cinema 4D');
    });

    it('should handle empty arrays for tags and software', () => {
      const project: PortfolioProject = {
        id: 'empty-arrays',
        title: 'Empty Arrays',
        description: 'Testing empty arrays',
        category: 'Scene Creation',
        type: 'video',
        image: '/images/test.jpg',
        tags: [],
        software: [],
      };

      expect(Array.isArray(project.tags)).toBe(true);
      expect(project.tags).toHaveLength(0);
      expect(Array.isArray(project.software)).toBe(true);
      expect(project.software).toHaveLength(0);
    });

    it('should handle boolean featured flag', () => {
      const featuredProject: PortfolioProject = {
        id: 'featured',
        title: 'Featured Project',
        description: 'A featured project',
        category: 'Film',
        type: 'video',
        image: '/images/featured.jpg',
        featured: true,
      };

      const nonFeaturedProject: PortfolioProject = {
        id: 'non-featured',
        title: 'Non-Featured Project',
        description: 'A non-featured project',
        category: 'Photography',
        type: 'image',
        image: '/images/non-featured.jpg',
        featured: false,
      };

      expect(featuredProject.featured).toBe(true);
      expect(nonFeaturedProject.featured).toBe(false);
    });

    it('should handle numeric year field', () => {
      const project: PortfolioProject = {
        id: 'year-test',
        title: 'Year Test',
        description: 'Testing year field',
        category: 'Photography',
        type: 'image',
        image: '/images/test.jpg',
        year: 2023,
      };

      expect(typeof project.year).toBe('number');
      expect(project.year).toBe(2023);
    });
  });

  describe('PortfolioCategory', () => {
    it('should define a valid PortfolioCategory interface', () => {
      const category: PortfolioCategory = {
        id: 'film',
        name: 'Film',
        description: 'Cinematic video productions',
        icon: 'film-icon',
        count: 15,
      };

      expect(category.id).toBe('film');
      expect(category.name).toBe('Film');
      expect(category.description).toBe('Cinematic video productions');
      expect(category.icon).toBe('film-icon');
      expect(category.count).toBe(15);
    });

    it('should handle all required fields', () => {
      const category: PortfolioCategory = {
        id: 'photography',
        name: 'Photography',
        description: 'Professional photography services',
        icon: 'camera-icon',
        count: 8,
      };

      expect(typeof category.id).toBe('string');
      expect(typeof category.name).toBe('string');
      expect(typeof category.description).toBe('string');
      expect(typeof category.icon).toBe('string');
      expect(typeof category.count).toBe('number');
    });

    it('should handle zero count', () => {
      const category: PortfolioCategory = {
        id: 'empty-category',
        name: 'Empty Category',
        description: 'A category with no projects',
        icon: 'empty-icon',
        count: 0,
      };

      expect(category.count).toBe(0);
    });

    it('should handle large count numbers', () => {
      const category: PortfolioCategory = {
        id: 'large-category',
        name: 'Large Category',
        description: 'A category with many projects',
        icon: 'large-icon',
        count: 999,
      };

      expect(category.count).toBe(999);
    });

    it('should support different category types', () => {
      const categories: PortfolioCategory[] = [
        {
          id: 'film',
          name: 'Film',
          description: 'Video productions',
          icon: 'film',
          count: 10,
        },
        {
          id: 'photography',
          name: 'Photography',
          description: 'Photo shoots',
          icon: 'camera',
          count: 20,
        },
        {
          id: '3d-visualization',
          name: '3D Visualization',
          description: '3D renders and animations',
          icon: 'cube',
          count: 5,
        },
        {
          id: 'scene-creation',
          name: 'Scene Creation',
          description: 'Environment and scene design',
          icon: 'scene',
          count: 8,
        },
      ];

      expect(categories).toHaveLength(4);
      categories.forEach((category) => {
        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
        expect(typeof category.description).toBe('string');
        expect(typeof category.icon).toBe('string');
        expect(typeof category.count).toBe('number');
        expect(category.count).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Type Compatibility', () => {
    it('should allow PortfolioProject category to match PortfolioCategory name', () => {
      const category: PortfolioCategory = {
        id: 'film',
        name: 'Film',
        description: 'Video productions',
        icon: 'film',
        count: 5,
      };

      const project: PortfolioProject = {
        id: 'project-1',
        title: 'Test Project',
        description: 'A test project',
        category: 'Film', // Should match category.name
        type: 'video',
        image: '/images/test.jpg',
      };

      expect(project.category).toBe(category.name);
    });

    it('should support all project categories as category names', () => {
      const projectCategories: PortfolioProject['category'][] = [
        'Film',
        'Photography',
        '3D Visualization',
        'Scene Creation',
      ];

      const portfolioCategories: PortfolioCategory[] = projectCategories.map((name, index) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description: `${name} projects`,
        icon: `${name.toLowerCase()}-icon`,
        count: index + 1,
      }));

      expect(portfolioCategories).toHaveLength(4);
      portfolioCategories.forEach((category, index) => {
        expect(category.name).toBe(projectCategories[index]);
      });
    });
  });
});
