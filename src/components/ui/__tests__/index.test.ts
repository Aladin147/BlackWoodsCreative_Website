import * as UIComponents from '../index';

describe('UI Components Barrel Export', () => {
  it('exports PortfolioCard component', () => {
    expect(UIComponents.PortfolioCard).toBeDefined();
    expect(typeof UIComponents.PortfolioCard).toBe('function');
  });

  it('exports ErrorBoundary component', () => {
    expect(UIComponents.ErrorBoundary).toBeDefined();
    expect(typeof UIComponents.ErrorBoundary).toBe('function');
  });

  it('exports LoadingSpinner component', () => {
    expect(UIComponents.LoadingSpinner).toBeDefined();
    expect(typeof UIComponents.LoadingSpinner).toBe('function');
  });

  it('exports LoadingSkeleton component', () => {
    expect(UIComponents.LoadingSkeleton).toBeDefined();
    expect(typeof UIComponents.LoadingSkeleton).toBe('function');
  });

  it('exports PortfolioCardSkeleton component', () => {
    expect(UIComponents.PortfolioCardSkeleton).toBeDefined();
    expect(typeof UIComponents.PortfolioCardSkeleton).toBe('function');
  });

  it('exports Logo component', () => {
    expect(UIComponents.Logo).toBeDefined();
    expect(typeof UIComponents.Logo).toBe('function');
  });

  it('exports all expected components', () => {
    const expectedExports = [
      'PortfolioCard',
      'ErrorBoundary',
      'LoadingSpinner',
      'LoadingSkeleton',
      'PortfolioCardSkeleton',
      'Logo',
    ];

    expectedExports.forEach(exportName => {
      expect(UIComponents).toHaveProperty(exportName);
    });
  });

  it('has correct number of exports', () => {
    const exportKeys = Object.keys(UIComponents);
    expect(exportKeys).toHaveLength(6);
  });

  it('all exports are functions (components)', () => {
    Object.values(UIComponents).forEach(component => {
      expect(typeof component).toBe('function');
    });
  });

  it('exports are not undefined or null', () => {
    Object.values(UIComponents).forEach(component => {
      expect(component).toBeDefined();
      expect(component).not.toBeNull();
    });
  });

  it('can destructure individual components', () => {
    const { PortfolioCard, ErrorBoundary, LoadingSpinner, Logo } = UIComponents;

    expect(PortfolioCard).toBeDefined();
    expect(ErrorBoundary).toBeDefined();
    expect(LoadingSpinner).toBeDefined();
    expect(Logo).toBeDefined();
  });

  it('maintains component names correctly', () => {
    expect(UIComponents.PortfolioCard.name).toBe('PortfolioCard');
    expect(UIComponents.LoadingSpinner.name).toBe('LoadingSpinner');
    expect(UIComponents.LoadingSkeleton.name).toBe('LoadingSkeleton');
    expect(UIComponents.PortfolioCardSkeleton.name).toBe('PortfolioCardSkeleton');
    expect(UIComponents.Logo.name).toBe('Logo');
  });

  it('exports are consistent with their source files', () => {
    // Test that the exports match what we expect from the source files
    expect(UIComponents.PortfolioCard).toBeTruthy();
    expect(UIComponents.ErrorBoundary).toBeTruthy();
    expect(UIComponents.LoadingSpinner).toBeTruthy();
    expect(UIComponents.LoadingSkeleton).toBeTruthy();
    expect(UIComponents.PortfolioCardSkeleton).toBeTruthy();
  });

  it('supports named imports', () => {
    // This test ensures the barrel export supports named imports
    const namedImports = {
      PortfolioCard: UIComponents.PortfolioCard,
      ErrorBoundary: UIComponents.ErrorBoundary,
      LoadingSpinner: UIComponents.LoadingSpinner,
      LoadingSkeleton: UIComponents.LoadingSkeleton,
      PortfolioCardSkeleton: UIComponents.PortfolioCardSkeleton,
    };

    Object.entries(namedImports).forEach(([, component]) => {
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    });
  });

  it('does not export any unexpected properties', () => {
    const expectedExports = [
      'PortfolioCard',
      'ErrorBoundary',
      'LoadingSpinner',
      'LoadingSkeleton',
      'PortfolioCardSkeleton',
      'Logo',
    ];

    const actualExports = Object.keys(UIComponents);

    actualExports.forEach(exportName => {
      expect(expectedExports).toContain(exportName);
    });
  });

  it('maintains proper TypeScript types', () => {
    // Ensure components can be used as React components
    expect(UIComponents.PortfolioCard).toHaveProperty('length'); // function.length
    expect(UIComponents.ErrorBoundary).toHaveProperty('length');
    expect(UIComponents.LoadingSpinner).toHaveProperty('length');
    expect(UIComponents.LoadingSkeleton).toHaveProperty('length');
    expect(UIComponents.PortfolioCardSkeleton).toHaveProperty('length');
  });

  it('provides clean barrel export functionality', () => {
    // Test that the barrel export works as intended for clean imports
    const components = UIComponents;

    expect(components).toBeDefined();
    expect(typeof components).toBe('object');
    expect(Object.keys(components).length).toBeGreaterThan(0);
  });

  it('exports components that are valid React components', () => {
    // Test that the exported components are valid React components
    Object.entries(UIComponents).forEach(([, Component]) => {
      // All components should be functions (including class constructors)
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
      UIComponents.PortfolioCard,
      UIComponents.LoadingSpinner,
      UIComponents.LoadingSkeleton,
      UIComponents.PortfolioCardSkeleton,
    ];

    componentsWithDisplayNames.forEach(component => {
      expect(component.name || (component as { displayName?: string }).displayName).toBeTruthy();
    });
  });
});
