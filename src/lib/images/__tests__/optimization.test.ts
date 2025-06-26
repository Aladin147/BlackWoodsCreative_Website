/**
 * Image Optimization Tests
 */

import { ImageOptimizer, QUALITY_PRESETS, IMAGE_BREAKPOINTS } from '../optimization';

// Mock global Image constructor
global.Image = class {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';
  
  constructor() {
    // Simulate successful image load after a short delay
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 10);
  }
} as any;

// Mock document.createElement for canvas
global.document = {
  createElement: jest.fn((tagName: string) => {
    if (tagName === 'canvas') {
      return {
        width: 0,
        height: 0,
        getContext: jest.fn(() => ({
          createLinearGradient: jest.fn(() => ({
            addColorStop: jest.fn(),
          })),
          fillRect: jest.fn(),
          set fillStyle(_value: any) {
            // Empty setter for test mock - no implementation needed
          },
        })),
        toDataURL: jest.fn(() => 'data:image/jpeg;base64,test'),
      };
    }
    return {};
  }),
} as any;

// Mock window for browser environment checks
Object.defineProperty(global, 'window', {
  value: {
    document: global.document,
  },
  writable: true,
});

describe('ImageOptimizer', () => {
  let optimizer: ImageOptimizer;

  beforeEach(() => {
    optimizer = ImageOptimizer.getInstance();
    optimizer.clearCache();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ImageOptimizer.getInstance();
      const instance2 = ImageOptimizer.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('URL Generation', () => {
    it('should generate optimized URL for internal images', () => {
      const src = '/images/test.jpg';
      const optimizedUrl = optimizer.generateOptimizedUrl(src, 800, 600, {
        quality: QUALITY_PRESETS.high,
        format: 'webp',
      });

      expect(optimizedUrl).toContain('/_next/image');
      expect(optimizedUrl).toContain('w=800');
      expect(optimizedUrl).toContain('h=600');
      expect(optimizedUrl).toContain('q=85');
      expect(optimizedUrl).toContain('f=webp');
    });

    it('should handle external URLs', () => {
      const src = 'https://example.com/image.jpg';
      const optimizedUrl = optimizer.generateOptimizedUrl(src, 800);

      expect(optimizedUrl).toBe(src); // External URLs returned as-is for basic implementation
    });

    it('should handle Unsplash URLs with optimization parameters', () => {
      const src = 'https://images.unsplash.com/photo-123456789';
      const optimizedUrl = optimizer.generateOptimizedUrl(src, 800, 600, {
        quality: QUALITY_PRESETS.medium,
        format: 'webp',
      });

      expect(optimizedUrl).toContain('w=800');
      expect(optimizedUrl).toContain('h=600');
      expect(optimizedUrl).toContain('q=75');
      expect(optimizedUrl).toContain('fm=webp');
    });

    it('should return original URL when unoptimized flag is set', () => {
      const src = '/images/test.jpg';
      const optimizedUrl = optimizer.generateOptimizedUrl(src, 800, 600, {
        unoptimized: true,
      });

      expect(optimizedUrl).toBe(src);
    });
  });

  describe('Responsive Images', () => {
    it('should generate responsive sizes string', () => {
      const sizes = optimizer.generateSizes();
      
      expect(sizes).toContain('(max-width:');
      expect(sizes).toContain('px)');
      expect(typeof sizes).toBe('string');
    });

    it('should generate responsive sizes with custom breakpoints', () => {
      const customBreakpoints = { sm: 640 as const, lg: 1024 as const };
      const sizes = optimizer.generateSizes(customBreakpoints);

      expect(sizes).toContain('640px');
      expect(sizes).toContain('1024px');
    });

    it('should generate srcSet for multiple widths', () => {
      const src = '/images/test.jpg';
      const widths = [400, 800, 1200];
      const srcSet = optimizer.generateSrcSet(src, widths);

      expect(srcSet).toContain('400w');
      expect(srcSet).toContain('800w');
      expect(srcSet).toContain('1200w');
      expect(srcSet.split(',').length).toBe(3);
    });
  });

  describe('Image Preloading', () => {
    it('should preload images successfully', async () => {
      const src = '/images/test.jpg';
      
      const result = await optimizer.preloadImage(src);
      expect(result).toBe(src);
    });

    it('should cache preload promises', async () => {
      const src = '/images/test.jpg';
      
      const promise1 = optimizer.preloadImage(src);
      const promise2 = optimizer.preloadImage(src);
      
      expect(promise1).toBe(promise2);
      
      await promise1;
      await promise2;
    });

    it('should handle preload failures', async () => {
      // Mock Image to simulate error
      const originalImage = global.Image;
      global.Image = class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src = '';
        
        constructor() {
          setTimeout(() => {
            if (this.onerror) this.onerror();
          }, 10);
        }
      } as any;

      const src = '/images/nonexistent.jpg';
      
      await expect(optimizer.preloadImage(src)).rejects.toThrow();
      
      // Restore original Image
      global.Image = originalImage;
    });
  });

  describe('Blur Placeholder Generation', () => {
    it('should generate blur placeholder data URL', () => {
      const placeholder = optimizer.generateBlurPlaceholder(10, 10);
      
      expect(placeholder).toMatch(/^data:image\/jpeg;base64,/);
    });

    it('should handle different dimensions', () => {
      const placeholder1 = optimizer.generateBlurPlaceholder(5, 5);
      const placeholder2 = optimizer.generateBlurPlaceholder(20, 20);
      
      expect(placeholder1).toBeDefined();
      expect(placeholder2).toBeDefined();
      expect(typeof placeholder1).toBe('string');
      expect(typeof placeholder2).toBe('string');
    });
  });

  describe('Cache Management', () => {
    it('should track cache statistics', async () => {
      const src1 = '/images/test1.jpg';
      const src2 = '/images/test2.jpg';
      
      await optimizer.preloadImage(src1);
      await optimizer.preloadImage(src2);
      
      const stats = optimizer.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.keys.length).toBeGreaterThan(0);
    });

    it('should clear cache', async () => {
      const src = '/images/test.jpg';
      await optimizer.preloadImage(src);
      
      let stats = optimizer.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
      
      optimizer.clearCache();
      stats = optimizer.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });
});

describe('Image Optimization Constants', () => {
  describe('QUALITY_PRESETS', () => {
    it('should have valid quality values', () => {
      expect(QUALITY_PRESETS.low).toBe(60);
      expect(QUALITY_PRESETS.medium).toBe(75);
      expect(QUALITY_PRESETS.high).toBe(85);
      expect(QUALITY_PRESETS.max).toBe(95);
    });

    it('should have quality values in ascending order', () => {
      expect(QUALITY_PRESETS.low).toBeLessThan(QUALITY_PRESETS.medium);
      expect(QUALITY_PRESETS.medium).toBeLessThan(QUALITY_PRESETS.high);
      expect(QUALITY_PRESETS.high).toBeLessThan(QUALITY_PRESETS.max);
    });
  });

  describe('IMAGE_BREAKPOINTS', () => {
    it('should have standard breakpoint values', () => {
      expect(IMAGE_BREAKPOINTS.xs).toBe(320);
      expect(IMAGE_BREAKPOINTS.sm).toBe(640);
      expect(IMAGE_BREAKPOINTS.md).toBe(768);
      expect(IMAGE_BREAKPOINTS.lg).toBe(1024);
      expect(IMAGE_BREAKPOINTS.xl).toBe(1280);
      expect(IMAGE_BREAKPOINTS['2xl']).toBe(1536);
    });

    it('should have breakpoints in ascending order', () => {
      const values = Object.values(IMAGE_BREAKPOINTS);
      for (let i = 1; i < values.length; i++) {
        const currentValue = values[i];
        const previousValue = values[i - 1];
        if (currentValue !== undefined && previousValue !== undefined) {
          expect(currentValue).toBeGreaterThan(previousValue);
        }
      }
    });
  });
});

describe('Image Optimization Integration', () => {
  let optimizer: ImageOptimizer;

  beforeEach(() => {
    optimizer = ImageOptimizer.getInstance();
    optimizer.clearCache();
  });

  it('should handle multiple image formats', () => {
    const formats = ['jpeg', 'png', 'webp', 'avif'];
    
    formats.forEach(format => {
      const url = optimizer.generateOptimizedUrl('/test.jpg', 800, 600, {
        format: format as any,
      });
      
      expect(url).toContain(`f=${format}`);
    });
  });

  it('should handle auto format selection', () => {
    const url = optimizer.generateOptimizedUrl('/test.jpg', 800, 600, {
      format: 'auto',
    });
    
    // Auto format should not add format parameter
    expect(url).not.toContain('f=auto');
  });

  it('should generate different URLs for different parameters', () => {
    const baseUrl = '/images/test.jpg';
    
    const url1 = optimizer.generateOptimizedUrl(baseUrl, 400, 300, { quality: 60 });
    const url2 = optimizer.generateOptimizedUrl(baseUrl, 800, 600, { quality: 90 });
    
    expect(url1).not.toBe(url2);
    expect(url1).toContain('w=400');
    expect(url1).toContain('h=300');
    expect(url1).toContain('q=60');
    expect(url2).toContain('w=800');
    expect(url2).toContain('h=600');
    expect(url2).toContain('q=90');
  });

  it('should handle missing height parameter', () => {
    const url = optimizer.generateOptimizedUrl('/test.jpg', 800);
    
    expect(url).toContain('w=800');
    expect(url).not.toContain('h=');
  });

  it('should handle edge cases gracefully', () => {
    // Empty source
    expect(() => optimizer.generateOptimizedUrl('', 800)).not.toThrow();
    
    // Zero dimensions
    expect(() => optimizer.generateOptimizedUrl('/test.jpg', 0)).not.toThrow();
    
    // Negative dimensions
    expect(() => optimizer.generateOptimizedUrl('/test.jpg', -100)).not.toThrow();
  });
});
