import React from 'react';

import {
  createOptimizedLazyComponent,
  ComponentPreloader,
  BundleOptimizer,
  TreeShakingUtils,
  bundleOptimizer,
  componentPreloader,
} from '../bundle-optimization';

// Mock dynamic import
const mockImport = jest.fn();
const mockComponent = () => React.createElement('div', null, 'Test Component');

// Mock console methods
const originalConsole = console;
beforeAll(() => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    group: jest.fn(),
    groupEnd: jest.fn(),
  };
});

afterAll(() => {
  global.console = originalConsole;
});

describe('Bundle Optimization Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockImport.mockClear();
  });

  describe('createOptimizedLazyComponent', () => {
    it('creates a lazy component with retry logic', async () => {
      const importFn = jest.fn().mockResolvedValue({ default: mockComponent });

      const LazyComponent = createOptimizedLazyComponent(importFn, {
        retryCount: 2,
        retryDelay: 100,
        chunkName: 'test-chunk',
      });

      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent.preload).toBe('function');
    });

    it('retries failed imports', async () => {
      const importFn = jest
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ default: mockComponent });

      const LazyComponent = createOptimizedLazyComponent(importFn, {
        retryCount: 3,
        retryDelay: 10,
      });

      await LazyComponent.preload();

      expect(importFn).toHaveBeenCalledTimes(2);
    });

    it('fails after max retry attempts', async () => {
      const importFn = jest.fn().mockRejectedValue(new Error('Persistent error'));

      const LazyComponent = createOptimizedLazyComponent(importFn, {
        retryCount: 2,
        retryDelay: 10,
      });

      await expect(LazyComponent.preload()).rejects.toThrow('Persistent error');
      expect(importFn).toHaveBeenCalledTimes(2);
    });

    it('logs successful chunk loads in development', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const importFn = jest.fn().mockResolvedValue({ default: mockComponent });

      const LazyComponent = createOptimizedLazyComponent(importFn, {
        chunkName: 'test-chunk',
      });

      await LazyComponent.preload();

      expect(console.log).toHaveBeenCalledWith('✅ Loaded chunk: test-chunk');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('ComponentPreloader', () => {
    let preloader: ComponentPreloader;

    beforeEach(() => {
      preloader = ComponentPreloader.getInstance();
      // Clear internal state
      (preloader as any).preloadQueue.clear();
      (preloader as any).preloadedComponents.clear();
    });

    it('is a singleton', () => {
      const instance1 = ComponentPreloader.getInstance();
      const instance2 = ComponentPreloader.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('registers components for preloading', () => {
      const preloadFn = jest.fn().mockResolvedValue(undefined);

      preloader.register('TestComponent', preloadFn);

      expect((preloader as any).preloadQueue.has('TestComponent')).toBe(true);
    });

    it('preloads registered components', async () => {
      const preloadFn = jest.fn().mockResolvedValue(undefined);

      preloader.register('TestComponent', preloadFn);
      await preloader.preload('TestComponent');

      expect(preloadFn).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('✅ Preloaded component: TestComponent');
    });

    it('does not preload the same component twice', async () => {
      const preloadFn = jest.fn().mockResolvedValue(undefined);

      preloader.register('TestComponent', preloadFn);
      await preloader.preload('TestComponent');
      await preloader.preload('TestComponent');

      expect(preloadFn).toHaveBeenCalledTimes(1);
    });

    it('warns when trying to preload unregistered component', async () => {
      await preloader.preload('UnregisteredComponent');

      expect(console.warn).toHaveBeenCalledWith(
        'Component UnregisteredComponent not registered for preloading'
      );
    });

    it('handles preload errors gracefully', async () => {
      const preloadFn = jest.fn().mockRejectedValue(new Error('Preload failed'));

      preloader.register('FailingComponent', preloadFn);
      await preloader.preload('FailingComponent');

      expect(console.error).toHaveBeenCalledWith(
        'Failed to preload component FailingComponent:',
        expect.any(Error)
      );
    });

    it('preloads critical components', async () => {
      const heroPreload = jest.fn().mockResolvedValue(undefined);
      const portfolioPreload = jest.fn().mockResolvedValue(undefined);
      const contactPreload = jest.fn().mockResolvedValue(undefined);

      preloader.register('HeroSection', heroPreload);
      preloader.register('PortfolioSection', portfolioPreload);
      preloader.register('ContactSection', contactPreload);

      await preloader.preloadCritical();

      expect(heroPreload).toHaveBeenCalledTimes(1);
      expect(portfolioPreload).toHaveBeenCalledTimes(1);
      expect(contactPreload).toHaveBeenCalledTimes(1);
    });
  });

  describe('BundleOptimizer', () => {
    it('analyzes bundle performance', () => {
      const analysis = BundleOptimizer.analyzeBundlePerformance();

      expect(analysis).toHaveProperty('totalSize');
      expect(analysis).toHaveProperty('gzippedSize');
      expect(analysis).toHaveProperty('chunks');
      expect(analysis).toHaveProperty('duplicates');
      expect(analysis).toHaveProperty('recommendations');

      expect(Array.isArray(analysis.chunks)).toBe(true);
      expect(Array.isArray(analysis.duplicates)).toBe(true);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });

    it('generates recommendations for large bundles', () => {
      const analysis = BundleOptimizer.analyzeBundlePerformance();

      expect(analysis.recommendations.length).toBeGreaterThan(0);
      expect(
        analysis.recommendations.some(
          rec => rec.includes('code splitting') || rec.includes('optimized')
        )
      ).toBe(true);
    });

    it('monitors bundle size in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      BundleOptimizer.monitorBundleSize();

      expect(console.group).toHaveBeenCalledWith('📦 Bundle Size Monitor');
      expect(console.groupEnd).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });

    it('does not monitor in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      BundleOptimizer.monitorBundleSize();

      expect(console.group).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('TreeShakingUtils', () => {
    it('marks functions for tree shaking', () => {
      const testFn = () => 'test';

      const result1 = TreeShakingUtils.markForTreeShaking(testFn, true);
      const result2 = TreeShakingUtils.markForTreeShaking(testFn, false);

      expect(result1).toBe(testFn);

      // In test environment, should return the function regardless
      // In production with used=false, it would return undefined
      expect(result2).toBeDefined();
    });

    it('handles conditional imports', async () => {
      const importFn = jest.fn().mockResolvedValue('imported');

      const result1 = await TreeShakingUtils.conditionalImport(true, importFn);
      const result2 = await TreeShakingUtils.conditionalImport(false, importFn);

      expect(result1).toBe('imported');
      expect(result2).toBe(null);
      expect(importFn).toHaveBeenCalledTimes(1);
    });

    it('handles development-only code', () => {
      const originalEnv = process.env.NODE_ENV;

      process.env.NODE_ENV = 'development';
      const devResult = TreeShakingUtils.devOnly('dev-code');

      process.env.NODE_ENV = 'production';
      const prodResult = TreeShakingUtils.devOnly('dev-code');

      expect(devResult).toBe('dev-code');
      expect(prodResult).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });

    it('handles production-only code', () => {
      const originalEnv = process.env.NODE_ENV;

      process.env.NODE_ENV = 'production';
      const prodResult = TreeShakingUtils.prodOnly('prod-code');

      process.env.NODE_ENV = 'development';
      const devResult = TreeShakingUtils.prodOnly('prod-code');

      expect(prodResult).toBe('prod-code');
      expect(devResult).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Exported instances', () => {
    it('exports bundleOptimizer instance', () => {
      expect(bundleOptimizer).toBe(BundleOptimizer);
    });

    it('exports componentPreloader instance', () => {
      expect(componentPreloader).toBeInstanceOf(ComponentPreloader);
    });
  });
});
