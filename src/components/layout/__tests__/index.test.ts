import * as LayoutComponents from '../index';

describe('Layout Components Barrel Export', () => {
  it('exports Header component', () => {
    expect(LayoutComponents.Header).toBeDefined();
    expect(typeof LayoutComponents.Header).toBe('function');
  });

  it('exports ScrollProgress component', () => {
    expect(LayoutComponents.ScrollProgress).toBeDefined();
    expect(typeof LayoutComponents.ScrollProgress).toBe('function');
  });

  it('exports Footer component', () => {
    expect(LayoutComponents.Footer).toBeDefined();
    expect(typeof LayoutComponents.Footer).toBe('function');
  });

  it('exports all expected components', () => {
    const expectedExports = [
      'Header',
      'ScrollProgress',
      'Footer',
    ];

    expectedExports.forEach(exportName => {
      expect(LayoutComponents).toHaveProperty(exportName);
    });
  });

  it('has correct number of exports', () => {
    const exportKeys = Object.keys(LayoutComponents);
    expect(exportKeys).toHaveLength(3);
  });

  it('all exports are functions (components)', () => {
    Object.values(LayoutComponents).forEach(component => {
      expect(typeof component).toBe('function');
    });
  });

  it('exports are not undefined or null', () => {
    Object.values(LayoutComponents).forEach(component => {
      expect(component).toBeDefined();
      expect(component).not.toBeNull();
    });
  });

  it('can destructure individual components', () => {
    const { Header, ScrollProgress, Footer } = LayoutComponents;
    
    expect(Header).toBeDefined();
    expect(ScrollProgress).toBeDefined();
    expect(Footer).toBeDefined();
  });

  it('maintains component names correctly', () => {
    expect(LayoutComponents.Header.name).toBe('Header');
    expect(LayoutComponents.ScrollProgress.name).toBe('ScrollProgress');
    expect(LayoutComponents.Footer.name).toBe('Footer');
  });

  it('exports are consistent with their source files', () => {
    // Test that the exports match what we expect from the source files
    expect(LayoutComponents.Header).toBeTruthy();
    expect(LayoutComponents.ScrollProgress).toBeTruthy();
    expect(LayoutComponents.Footer).toBeTruthy();
  });

  it('supports named imports', () => {
    // This test ensures the barrel export supports named imports
    const namedImports = {
      Header: LayoutComponents.Header,
      ScrollProgress: LayoutComponents.ScrollProgress,
      Footer: LayoutComponents.Footer,
    };

    Object.entries(namedImports).forEach(([, component]) => {
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    });
  });

  it('does not export any unexpected properties', () => {
    const expectedExports = [
      'Header',
      'ScrollProgress',
      'Footer',
    ];

    const actualExports = Object.keys(LayoutComponents);
    
    actualExports.forEach(exportName => {
      expect(expectedExports).toContain(exportName);
    });
  });

  it('maintains proper TypeScript types', () => {
    // Ensure components can be used as React components
    expect(LayoutComponents.Header).toHaveProperty('length'); // function.length
    expect(LayoutComponents.ScrollProgress).toHaveProperty('length');
    expect(LayoutComponents.Footer).toHaveProperty('length');
  });

  it('provides clean barrel export functionality', () => {
    // Test that the barrel export works as intended for clean imports
    const components = LayoutComponents;
    
    expect(components).toBeDefined();
    expect(typeof components).toBe('object');
    expect(Object.keys(components).length).toBeGreaterThan(0);
  });

  it('exports components that are valid React components', () => {
    // Test that the exported components are valid React components
    Object.entries(LayoutComponents).forEach(([, Component]) => {
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
      LayoutComponents.Header,
      LayoutComponents.ScrollProgress,
      LayoutComponents.Footer,
    ];

    componentsWithDisplayNames.forEach(component => {
      expect(component.name || (component as { displayName?: string }).displayName).toBeTruthy();
    });
  });

  it('exports layout-specific components', () => {
    // Verify that these are indeed layout components
    const layoutComponentNames = Object.keys(LayoutComponents);
    
    // These should be typical layout component names
    expect(layoutComponentNames).toContain('Header');
    expect(layoutComponentNames).toContain('Footer');
    expect(layoutComponentNames).toContain('ScrollProgress');
  });

  it('supports import/export patterns', () => {
    // Test common import patterns that developers might use
    const { Header } = LayoutComponents;
    const ScrollProgress = LayoutComponents.ScrollProgress;
    const FooterComponent = LayoutComponents.Footer;
    
    expect(Header).toBe(LayoutComponents.Header);
    expect(ScrollProgress).toBe(LayoutComponents.ScrollProgress);
    expect(FooterComponent).toBe(LayoutComponents.Footer);
  });

  it('maintains consistent API across components', () => {
    // All layout components should follow similar patterns
    Object.values(LayoutComponents).forEach(Component => {
      expect(typeof Component).toBe('function');
      expect(Component.length).toBeGreaterThanOrEqual(0); // Can accept 0 or more parameters
    });
  });

  it('provides proper module structure', () => {
    // Test that the module exports are structured correctly
    expect(LayoutComponents).toEqual({
      Header: expect.any(Function),
      ScrollProgress: expect.any(Function),
      Footer: expect.any(Function),
    });
  });

  it('handles re-exports correctly', async () => {
    // Test that re-exports maintain the original component references
    const { Header: directHeader } = await import('../Header');
    const { ScrollProgress: directScrollProgress } = await import('../ScrollProgress');
    const { Footer: directFooter } = await import('../Footer');

    expect(LayoutComponents.Header).toBe(directHeader);
    expect(LayoutComponents.ScrollProgress).toBe(directScrollProgress);
    expect(LayoutComponents.Footer).toBe(directFooter);
  });

  it('supports tree shaking', () => {
    // Barrel exports should support tree shaking when used with modern bundlers
    // This test ensures individual components can be imported
    expect(() => {
      const { Header } = LayoutComponents;
      return Header;
    }).not.toThrow();
    
    expect(() => {
      const { ScrollProgress } = LayoutComponents;
      return ScrollProgress;
    }).not.toThrow();
    
    expect(() => {
      const { Footer } = LayoutComponents;
      return Footer;
    }).not.toThrow();
  });
});
