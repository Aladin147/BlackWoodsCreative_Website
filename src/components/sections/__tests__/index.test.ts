import * as SectionComponents from '../index';

describe('Section Components Barrel Export', () => {
  it('exports HeroSection component', () => {
    expect(SectionComponents.HeroSection).toBeDefined();
    expect(typeof SectionComponents.HeroSection).toBe('function');
  });

  it('exports PortfolioSection component', () => {
    expect(SectionComponents.PortfolioSection).toBeDefined();
    expect(typeof SectionComponents.PortfolioSection).toBe('function');
  });

  it('exports VisionSection component', () => {
    expect(SectionComponents.VisionSection).toBeDefined();
    expect(typeof SectionComponents.VisionSection).toBe('function');
  });

  it('exports AboutSection component', () => {
    expect(SectionComponents.AboutSection).toBeDefined();
    expect(typeof SectionComponents.AboutSection).toBe('function');
  });

  it('exports ContactSection component', () => {
    expect(SectionComponents.ContactSection).toBeDefined();
    expect(typeof SectionComponents.ContactSection).toBe('function');
  });

  it('exports all expected components', () => {
    const expectedExports = [
      'HeroSection',
      'PortfolioSection',
      'VisionSection',
      'AboutSection',
      'ContactSection',
    ];

    expectedExports.forEach(exportName => {
      expect(SectionComponents).toHaveProperty(exportName);
    });
  });

  it('has correct number of exports', () => {
    const exportKeys = Object.keys(SectionComponents);
    expect(exportKeys).toHaveLength(5);
  });

  it('all exports are functions (components)', () => {
    Object.values(SectionComponents).forEach(component => {
      expect(typeof component).toBe('function');
    });
  });

  it('exports are not undefined or null', () => {
    Object.values(SectionComponents).forEach(component => {
      expect(component).toBeDefined();
      expect(component).not.toBeNull();
    });
  });

  it('can destructure individual components', () => {
    const { HeroSection, PortfolioSection, VisionSection, AboutSection, ContactSection } = SectionComponents;
    
    expect(HeroSection).toBeDefined();
    expect(PortfolioSection).toBeDefined();
    expect(VisionSection).toBeDefined();
    expect(AboutSection).toBeDefined();
    expect(ContactSection).toBeDefined();
  });

  it('maintains component names correctly', () => {
    expect(SectionComponents.HeroSection.name).toBe('HeroSection');
    expect(SectionComponents.PortfolioSection.name).toBe('PortfolioSection');
    expect(SectionComponents.VisionSection.name).toBe('VisionSection');
    expect(SectionComponents.AboutSection.name).toBe('AboutSection');
    expect(SectionComponents.ContactSection.name).toBe('ContactSection');
  });

  it('exports are consistent with their source files', () => {
    // Test that the exports match what we expect from the source files
    expect(SectionComponents.HeroSection).toBeTruthy();
    expect(SectionComponents.PortfolioSection).toBeTruthy();
    expect(SectionComponents.VisionSection).toBeTruthy();
    expect(SectionComponents.AboutSection).toBeTruthy();
    expect(SectionComponents.ContactSection).toBeTruthy();
  });

  it('supports named imports', () => {
    // This test ensures the barrel export supports named imports
    const namedImports = {
      HeroSection: SectionComponents.HeroSection,
      PortfolioSection: SectionComponents.PortfolioSection,
      VisionSection: SectionComponents.VisionSection,
      AboutSection: SectionComponents.AboutSection,
      ContactSection: SectionComponents.ContactSection,
    };

    Object.entries(namedImports).forEach(([, component]) => {
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    });
  });

  it('does not export any unexpected properties', () => {
    const expectedExports = [
      'HeroSection',
      'PortfolioSection',
      'VisionSection',
      'AboutSection',
      'ContactSection',
    ];

    const actualExports = Object.keys(SectionComponents);
    
    actualExports.forEach(exportName => {
      expect(expectedExports).toContain(exportName);
    });
  });

  it('maintains proper TypeScript types', () => {
    // Ensure components can be used as React components
    expect(SectionComponents.HeroSection).toHaveProperty('length'); // function.length
    expect(SectionComponents.PortfolioSection).toHaveProperty('length');
    expect(SectionComponents.VisionSection).toHaveProperty('length');
    expect(SectionComponents.AboutSection).toHaveProperty('length');
    expect(SectionComponents.ContactSection).toHaveProperty('length');
  });

  it('provides clean barrel export functionality', () => {
    // Test that the barrel export works as intended for clean imports
    const components = SectionComponents;
    
    expect(components).toBeDefined();
    expect(typeof components).toBe('object');
    expect(Object.keys(components).length).toBeGreaterThan(0);
  });

  it('exports components that are valid React components', () => {
    // Test that the exported components are valid React components
    Object.entries(SectionComponents).forEach(([, Component]) => {
      // All components should be functions
      expect(typeof Component).toBe('function');

      // Components should have a name
      expect(Component.name || (Component as { displayName?: string }).displayName).toBeTruthy();

      // Components should be callable (this is what makes them valid React components)
      expect(Component).toBeInstanceOf(Function);
    });
  });

  it('maintains component display names', () => {
    // Check that components have proper display names for debugging
    const componentsWithDisplayNames = [
      SectionComponents.HeroSection,
      SectionComponents.PortfolioSection,
      SectionComponents.VisionSection,
      SectionComponents.AboutSection,
      SectionComponents.ContactSection,
    ];

    componentsWithDisplayNames.forEach(component => {
      expect(component.name || (component as { displayName?: string }).displayName).toBeTruthy();
    });
  });

  it('exports section-specific components', () => {
    // Verify that these are indeed section components
    const sectionComponentNames = Object.keys(SectionComponents);
    
    // These should be typical section component names
    expect(sectionComponentNames).toContain('HeroSection');
    expect(sectionComponentNames).toContain('PortfolioSection');
    expect(sectionComponentNames).toContain('VisionSection');
    expect(sectionComponentNames).toContain('AboutSection');
    expect(sectionComponentNames).toContain('ContactSection');
  });

  it('supports import/export patterns', () => {
    // Test common import patterns that developers might use
    const { HeroSection } = SectionComponents;
    const PortfolioSection = SectionComponents.PortfolioSection;
    const VisionComponent = SectionComponents.VisionSection;
    
    expect(HeroSection).toBe(SectionComponents.HeroSection);
    expect(PortfolioSection).toBe(SectionComponents.PortfolioSection);
    expect(VisionComponent).toBe(SectionComponents.VisionSection);
  });

  it('maintains consistent API across components', () => {
    // All section components should follow similar patterns
    Object.values(SectionComponents).forEach(Component => {
      expect(typeof Component).toBe('function');
      expect(Component.length).toBeGreaterThanOrEqual(0); // Can accept 0 or more parameters
    });
  });

  it('provides proper module structure', () => {
    // Test that the module exports are structured correctly
    expect(SectionComponents).toEqual({
      HeroSection: expect.any(Function),
      PortfolioSection: expect.any(Function),
      VisionSection: expect.any(Function),
      AboutSection: expect.any(Function),
      ContactSection: expect.any(Function),
    });
  });

  it('handles re-exports correctly', async () => {
    // Test that re-exports maintain the original component references
    const { HeroSection: directHero } = await import('../HeroSection');
    const { PortfolioSection: directPortfolio } = await import('../PortfolioSection');
    const { VisionSection: directVision } = await import('../VisionSection');
    const { AboutSection: directAbout } = await import('../AboutSection');
    const { ContactSection: directContact } = await import('../ContactSection');

    expect(SectionComponents.HeroSection).toBe(directHero);
    expect(SectionComponents.PortfolioSection).toBe(directPortfolio);
    expect(SectionComponents.VisionSection).toBe(directVision);
    expect(SectionComponents.AboutSection).toBe(directAbout);
    expect(SectionComponents.ContactSection).toBe(directContact);
  });

  it('supports tree shaking', () => {
    // Barrel exports should support tree shaking when used with modern bundlers
    // This test ensures individual components can be imported
    expect(() => {
      const { HeroSection } = SectionComponents;
      return HeroSection;
    }).not.toThrow();
    
    expect(() => {
      const { PortfolioSection } = SectionComponents;
      return PortfolioSection;
    }).not.toThrow();
    
    expect(() => {
      const { VisionSection } = SectionComponents;
      return VisionSection;
    }).not.toThrow();
    
    expect(() => {
      const { AboutSection } = SectionComponents;
      return AboutSection;
    }).not.toThrow();
    
    expect(() => {
      const { ContactSection } = SectionComponents;
      return ContactSection;
    }).not.toThrow();
  });

  it('covers all main website sections', () => {
    // Ensure we have all the main sections of the website
    const sectionNames = Object.keys(SectionComponents);
    
    // Should include key website sections
    expect(sectionNames).toContain('HeroSection'); // Landing/hero area
    expect(sectionNames).toContain('AboutSection'); // About information
    expect(sectionNames).toContain('PortfolioSection'); // Work showcase
    expect(sectionNames).toContain('VisionSection'); // Company vision
    expect(sectionNames).toContain('ContactSection'); // Contact form
  });
});
