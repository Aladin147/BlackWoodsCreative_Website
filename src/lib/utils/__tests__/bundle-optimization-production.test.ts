// Production mode bundle optimization validation tests
import {
  createOptimizedLazyComponent,
  ComponentPreloader,
  BundleOptimizer,
  TreeShakingUtils,
  bundleOptimizer,
  componentPreloader
} from '../bundle-optimization';

// Store original NODE_ENV
const originalNodeEnv = process.env.NODE_ENV;

// Mock console methods
const mockConsoleLog = jest.fn();
const mockConsoleGroup = jest.fn();
const mockConsoleGroupEnd = jest.fn();

describe('Bundle Optimization - Production Mode', () => {
  beforeEach(() => {
    // Mock NODE_ENV for production mode
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // Reset module cache to ensure environment change takes effect
    jest.resetModules();

    jest.clearAllMocks();

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(mockConsoleLog);
    jest.spyOn(console, 'group').mockImplementation(mockConsoleGroup);
    jest.spyOn(console, 'groupEnd').mockImplementation(mockConsoleGroupEnd);
  });

  afterEach(() => {
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;

    // Reset module cache to ensure environment change takes effect
    jest.resetModules();

    // Restore console methods
    jest.restoreAllMocks();
  });

  describe('Optimized Lazy Component Loading', () => {
    it('should not log chunk loading in production mode', async () => {
      const mockComponent = { default: () => 'Test Component' };
      const mockImportFn = jest.fn().mockResolvedValue(mockComponent);

      const LazyComponent = createOptimizedLazyComponent(
        mockImportFn,
        { chunkName: 'TestChunk', retryCount: 3, retryDelay: 100 }
      );

      // Simulate component loading
      await LazyComponent.preload();

      // Should not log in production
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });

    it('should handle component loading with retries in production', async () => {
      let attemptCount = 0;
      const mockImportFn = jest.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({ default: () => 'Retry Component' });
      });

      const LazyComponent = createOptimizedLazyComponent(
        mockImportFn,
        { chunkName: 'RetryChunk', retryCount: 3, retryDelay: 10 }
      );

      // Should eventually succeed after retries
      await LazyComponent.preload();
      expect(attemptCount).toBe(3);
    });

    it('should fail gracefully after max retries', async () => {
      const mockImportFn = jest.fn().mockRejectedValue(new Error('Persistent error'));

      const LazyComponent = createOptimizedLazyComponent(
        mockImportFn,
        { chunkName: 'FailChunk', retryCount: 2, retryDelay: 10 }
      );

      // Should fail after retries
      await expect(LazyComponent.preload()).rejects.toThrow('Persistent error');
      // Should be called at least twice (initial + retries)
      expect(mockImportFn.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Component Preloader in Production', () => {
    it('should not log preloading in production mode', async () => {
      const preloader = ComponentPreloader.getInstance();
      const mockPreloadFn = jest.fn().mockResolvedValue({ default: () => 'Preloaded' });

      preloader.register('TestComponent', mockPreloadFn);
      await preloader.preload('TestComponent');

      // Should not log in production
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });

    it('should handle preloading errors gracefully in production', async () => {
      const preloader = ComponentPreloader.getInstance();
      const mockPreloadFn = jest.fn().mockRejectedValue(new Error('Preload failed'));

      preloader.register('ErrorComponent', mockPreloadFn);
      
      // Should not throw, just fail silently
      await expect(preloader.preload('ErrorComponent')).resolves.not.toThrow();
    });

    it('should handle unregistered component preloading', async () => {
      const preloader = ComponentPreloader.getInstance();
      
      // Should handle gracefully
      await expect(preloader.preload('UnregisteredComponent')).resolves.not.toThrow();
    });

    it('should track preloaded components correctly', async () => {
      const preloader = ComponentPreloader.getInstance();
      const mockPreloadFn = jest.fn().mockResolvedValue({ default: () => 'Tracked' });

      preloader.register('TrackedComponent', mockPreloadFn);
      await preloader.preload('TrackedComponent');

      // Should not preload again
      await preloader.preload('TrackedComponent');
      expect(mockPreloadFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Bundle Size Monitoring in Production', () => {
    it('should not log bundle monitoring in production mode', () => {
      const result = BundleOptimizer.monitorBundleSize();

      // Should not log in production
      expect(mockConsoleGroup).not.toHaveBeenCalled();
      expect(mockConsoleLog).not.toHaveBeenCalled();
      expect(mockConsoleGroupEnd).not.toHaveBeenCalled();

      // Should return undefined in production
      expect(result).toBeUndefined();
    });

    it('should analyze bundle performance correctly', () => {
      const analysis = BundleOptimizer.analyzeBundlePerformance();

      expect(analysis).toHaveProperty('totalSize');
      expect(analysis).toHaveProperty('gzippedSize');
      expect(analysis).toHaveProperty('chunks');
      expect(analysis).toHaveProperty('recommendations');

      expect(typeof analysis.totalSize).toBe('number');
      expect(typeof analysis.gzippedSize).toBe('number');
      expect(Array.isArray(analysis.chunks)).toBe(true);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });

    it('should provide performance recommendations', () => {
      const analysis = BundleOptimizer.analyzeBundlePerformance();

      // Should have meaningful recommendations
      expect(analysis.recommendations.length).toBeGreaterThan(0);
      
      // Recommendations should be strings
      analysis.recommendations.forEach(recommendation => {
        expect(typeof recommendation).toBe('string');
        expect(recommendation.length).toBeGreaterThan(0);
      });
    });

    it('should calculate bundle metrics accurately', () => {
      const analysis = BundleOptimizer.analyzeBundlePerformance();

      // Gzipped size should be smaller than total size
      expect(analysis.gzippedSize).toBeLessThanOrEqual(analysis.totalSize);

      // Should have reasonable size values
      expect(analysis.totalSize).toBeGreaterThan(0);
      expect(analysis.gzippedSize).toBeGreaterThan(0);
    });
  });

  describe('Production Bundle Optimization Features', () => {
    it('should handle production-only code correctly', () => {
      // Verify environment is set correctly
      expect(process.env.NODE_ENV).toBe('production');

      // Test the tree shaking utilities directly
      const prodValue = TreeShakingUtils.prodOnly('production-feature');
      const devValue = TreeShakingUtils.devOnly('development-feature');

      // In production, prodOnly should return value, devOnly should return undefined
      expect(prodValue).toBe('production-feature');
      expect(devValue).toBeUndefined();
    });

    it('should optimize imports for production', () => {
      // Test that optimization utilities work correctly
      expect(bundleOptimizer).toBeDefined();
      expect(componentPreloader).toBeDefined();

      expect(typeof TreeShakingUtils.prodOnly).toBe('function');
      expect(typeof TreeShakingUtils.devOnly).toBe('function');
    });

    it('should handle concurrent component loading', async () => {
      const mockComponents = Array.from({ length: 10 }, (_, i) => ({
        name: `Component${i}`,
        importFn: jest.fn().mockResolvedValue({ default: () => `Component ${i}` })
      }));

      const lazyComponents = mockComponents.map(({ importFn, name }) =>
        createOptimizedLazyComponent(importFn, { chunkName: name })
      );

      // Load all components concurrently
      await Promise.all(
        lazyComponents.map(component => component.preload())
      );

      // All should load successfully
      expect(lazyComponents).toHaveLength(10);
      mockComponents.forEach((mock, _i) => {
        expect(mock.importFn).toHaveBeenCalled();
      });
    });

    it('should maintain performance under load', async () => {
      const startTime = performance.now();

      // Create and load many components
      const componentPromises = Array.from({ length: 100 }, (_, i) => {
        const mockImportFn = jest.fn().mockResolvedValue({
          default: () => `LoadTest${i}`
        });
        const LazyComponent = createOptimizedLazyComponent(mockImportFn, { chunkName: `LoadTest${i}` });
        return LazyComponent.preload();
      });

      await Promise.all(componentPromises);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed import functions', () => {
      const malformedImportFn = null as any;

      expect(() => {
        createOptimizedLazyComponent(malformedImportFn, { chunkName: 'MalformedChunk' });
      }).not.toThrow();
    });

    it('should handle network timeouts gracefully', async () => {
      const timeoutImportFn = jest.fn().mockImplementation(
        () => new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 50)
        )
      );

      const LazyComponent = createOptimizedLazyComponent(
        timeoutImportFn,
        { chunkName: 'TimeoutChunk', retryCount: 1, retryDelay: 10 }
      );

      await expect(LazyComponent.preload()).rejects.toThrow('Timeout');
    });

    it('should handle memory pressure scenarios', () => {
      // Simulate memory pressure by creating many components
      const components = Array.from({ length: 1000 }, (_, i) => {
        const mockImportFn = jest.fn().mockResolvedValue({
          default: () => `MemoryTest${i}`
        });
        return createOptimizedLazyComponent(mockImportFn, { chunkName: `MemoryTest${i}` });
      });

      // Should not throw or cause memory issues
      expect(components).toHaveLength(1000);
      expect(() => {
        components.forEach(component => {
          expect(component).toBeDefined();
        });
      }).not.toThrow();
    });
  });

  describe('Bundle Analysis Validation', () => {
    it('should provide accurate bundle size estimates', () => {
      const analysis = BundleOptimizer.analyzeBundlePerformance();

      // Should have realistic size estimates
      expect(analysis.totalSize).toBeGreaterThan(1000); // At least 1KB
      expect(analysis.totalSize).toBeLessThan(10000000); // Less than 10MB
      
      expect(analysis.gzippedSize).toBeGreaterThan(500); // At least 0.5KB
      expect(analysis.gzippedSize).toBeLessThan(analysis.totalSize);
    });

    it('should identify optimization opportunities', () => {
      const analysis = BundleOptimizer.analyzeBundlePerformance();

      // Should provide actionable recommendations
      const hasOptimizationRecommendations = analysis.recommendations.some(rec =>
        rec.includes('optimize') || 
        rec.includes('reduce') || 
        rec.includes('split') ||
        rec.includes('lazy')
      );

      expect(hasOptimizationRecommendations).toBe(true);
    });
  });
});
