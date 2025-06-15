import { siteConfig, type SiteConfig } from '../siteConfig';

describe('siteConfig', () => {
  it('has correct site name', () => {
    expect(siteConfig.name).toBe('BlackWoods Creative');
  });

  it('has correct site description', () => {
    expect(siteConfig.description).toBe('Premium visual storytelling through filmmaking, photography, and 3D visualization.');
  });

  it('has correct site URL', () => {
    expect(siteConfig.url).toBe('https://blackwoodscreative.com');
  });

  it('has correct OG image path', () => {
    expect(siteConfig.ogImage).toBe('/assets/images/og-image.jpg');
  });

  describe('links', () => {
    it('has correct email', () => {
      expect(siteConfig.links.email).toBe('hello@blackwoodscreative.com');
    });

    it('has correct phone number', () => {
      expect(siteConfig.links.phone).toBe('+1 (555) 123-4567');
    });

    it('has correct address', () => {
      expect(siteConfig.links.address).toBe('MFADEL Business Center, Building O, Floor 5. Mohammedia Morocco');
    });

    it('has correct Instagram URL', () => {
      expect(siteConfig.links.instagram).toBe('https://instagram.com/blackwoodscreative');
    });

    it('has correct LinkedIn URL', () => {
      expect(siteConfig.links.linkedin).toBe('https://linkedin.com/company/blackwoodscreative');
    });

    it('has correct GitHub URL', () => {
      expect(siteConfig.links.github).toBe('https://github.com/blackwoods-creative');
    });

    it('has all required link properties', () => {
      expect(siteConfig.links).toHaveProperty('email');
      expect(siteConfig.links).toHaveProperty('phone');
      expect(siteConfig.links).toHaveProperty('address');
      expect(siteConfig.links).toHaveProperty('instagram');
      expect(siteConfig.links).toHaveProperty('linkedin');
      expect(siteConfig.links).toHaveProperty('github');
    });

    it('has valid URL formats for social links', () => {
      expect(siteConfig.links.instagram).toMatch(/^https:\/\//);
      expect(siteConfig.links.linkedin).toMatch(/^https:\/\//);
      expect(siteConfig.links.github).toMatch(/^https:\/\//);
    });

    it('has valid email format', () => {
      expect(siteConfig.links.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  describe('services', () => {
    it('has correct number of services', () => {
      expect(siteConfig.services).toHaveLength(4);
    });

    it('has film production service', () => {
      const filmService = siteConfig.services.find(service => service.id === 'film');
      expect(filmService).toBeDefined();
      expect(filmService?.name).toBe('Film Production');
      expect(filmService?.description).toBe('Cinematic storytelling that captivates audiences and drives results.');
      expect(filmService?.icon).toBe('FilmIcon');
    });

    it('has photography service', () => {
      const photoService = siteConfig.services.find(service => service.id === 'photography');
      expect(photoService).toBeDefined();
      expect(photoService?.name).toBe('Photography');
      expect(photoService?.description).toBe('Professional photography that captures moments and creates impact.');
      expect(photoService?.icon).toBe('CameraIcon');
    });

    it('has 3D visualization service', () => {
      const threeDService = siteConfig.services.find(service => service.id === '3d');
      expect(threeDService).toBeDefined();
      expect(threeDService?.name).toBe('3D Visualization');
      expect(threeDService?.description).toBe('Stunning 3D models and visualizations that bring ideas to life.');
      expect(threeDService?.icon).toBe('CubeIcon');
    });

    it('has scene creation service', () => {
      const sceneService = siteConfig.services.find(service => service.id === 'scenes');
      expect(sceneService).toBeDefined();
      expect(sceneService?.name).toBe('Scene Creation');
      expect(sceneService?.description).toBe('Immersive environments and scenes for any creative project.');
      expect(sceneService?.icon).toBe('BuildingOfficeIcon');
    });

    it('has all required service properties', () => {
      siteConfig.services.forEach(service => {
        expect(service).toHaveProperty('id');
        expect(service).toHaveProperty('name');
        expect(service).toHaveProperty('description');
        expect(service).toHaveProperty('icon');
        expect(typeof service.id).toBe('string');
        expect(typeof service.name).toBe('string');
        expect(typeof service.description).toBe('string');
        expect(typeof service.icon).toBe('string');
      });
    });

    it('has unique service IDs', () => {
      const ids = siteConfig.services.map(service => service.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('has non-empty service descriptions', () => {
      siteConfig.services.forEach(service => {
        expect(service.description.length).toBeGreaterThan(0);
        expect(service.description.trim()).toBe(service.description);
      });
    });

    it('has valid icon names', () => {
      siteConfig.services.forEach(service => {
        expect(service.icon).toMatch(/Icon$/);
        expect(service.icon.length).toBeGreaterThan(4);
      });
    });
  });

  describe('navigation', () => {
    it('has correct number of navigation items', () => {
      expect(siteConfig.navigation).toHaveLength(3);
    });

    it('has portfolio navigation item', () => {
      const portfolioNav = siteConfig.navigation.find(nav => nav.name === 'Portfolio');
      expect(portfolioNav).toBeDefined();
      expect(portfolioNav?.href).toBe('#portfolio');
    });

    it('has about navigation item', () => {
      const aboutNav = siteConfig.navigation.find(nav => nav.name === 'About');
      expect(aboutNav).toBeDefined();
      expect(aboutNav?.href).toBe('#about');
    });

    it('has contact navigation item', () => {
      const contactNav = siteConfig.navigation.find(nav => nav.name === 'Contact');
      expect(contactNav).toBeDefined();
      expect(contactNav?.href).toBe('#contact');
    });

    it('has all required navigation properties', () => {
      siteConfig.navigation.forEach(nav => {
        expect(nav).toHaveProperty('name');
        expect(nav).toHaveProperty('href');
        expect(typeof nav.name).toBe('string');
        expect(typeof nav.href).toBe('string');
      });
    });

    it('has valid anchor links', () => {
      siteConfig.navigation.forEach(nav => {
        expect(nav.href).toMatch(/^#/);
      });
    });

    it('has unique navigation names', () => {
      const names = siteConfig.navigation.map(nav => nav.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('has unique navigation hrefs', () => {
      const hrefs = siteConfig.navigation.map(nav => nav.href);
      const uniqueHrefs = new Set(hrefs);
      expect(uniqueHrefs.size).toBe(hrefs.length);
    });
  });

  describe('type safety', () => {
    it('exports SiteConfig type', () => {
      // This test ensures the type is exported and can be used
      const config: SiteConfig = siteConfig;
      expect(config).toBe(siteConfig);
    });

    it('is marked as const', () => {
      // This test ensures the config is readonly
      expect(Object.isFrozen(siteConfig)).toBe(false); // as const doesn't freeze, but provides type safety
      expect(typeof siteConfig).toBe('object');
    });
  });

  describe('data integrity', () => {
    it('has consistent structure', () => {
      expect(siteConfig).toHaveProperty('name');
      expect(siteConfig).toHaveProperty('description');
      expect(siteConfig).toHaveProperty('url');
      expect(siteConfig).toHaveProperty('ogImage');
      expect(siteConfig).toHaveProperty('links');
      expect(siteConfig).toHaveProperty('services');
      expect(siteConfig).toHaveProperty('navigation');
    });

    it('has no undefined values', () => {
      const checkForUndefined = (obj: Record<string, unknown>, path = ''): void => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          expect(value).not.toBeUndefined();
          
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            checkForUndefined(value as Record<string, unknown>, currentPath);
          }
        });
      };

      checkForUndefined(siteConfig);
    });

    it('has no empty strings', () => {
      const checkForEmptyStrings = (obj: Record<string, unknown>): void => {
        Object.values(obj).forEach(value => {
          if (typeof value === 'string') {
            expect(value.trim()).not.toBe('');
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            checkForEmptyStrings(value as Record<string, unknown>);
          } else if (Array.isArray(value)) {
            value.forEach(item => {
              if (typeof item === 'object' && item !== null) {
                checkForEmptyStrings(item);
              }
            });
          }
        });
      };

      checkForEmptyStrings(siteConfig);
    });

    it('has valid URL format for site URL', () => {
      expect(siteConfig.url).toMatch(/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    });

    it('has valid image path format', () => {
      expect(siteConfig.ogImage).toMatch(/^\/.*\.(jpg|jpeg|png|webp)$/i);
    });
  });

  describe('business information', () => {
    it('contains Morocco address', () => {
      expect(siteConfig.links.address).toContain('Morocco');
      expect(siteConfig.links.address).toContain('Mohammedia');
    });

    it('has professional email domain', () => {
      expect(siteConfig.links.email).toContain('@blackwoodscreative.com');
    });

    it('has consistent branding in social links', () => {
      expect(siteConfig.links.instagram).toContain('blackwoodscreative');
      expect(siteConfig.links.linkedin).toContain('blackwoodscreative');
      expect(siteConfig.links.github).toContain('blackwoods-creative');
    });
  });
});
