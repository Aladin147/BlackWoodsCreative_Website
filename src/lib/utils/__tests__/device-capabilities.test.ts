/**
 * @jest-environment node
 */
import { deviceCapabilityDetector, getDeviceCapabilities, getOptimizationProfile } from '../device-capabilities';

// Mock browser APIs
const mockNavigator = {
  hardwareConcurrency: 8,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  deviceMemory: 8,
};

const mockPerformance = {
  now: jest.fn(() => Date.now()),
  memory: {
    jsHeapSizeLimit: 4294967296, // 4GB
  },
};

const mockScreen = {
  colorDepth: 24,
};

const mockWindow = {
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 2,
  matchMedia: jest.fn((query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? false : true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
};

const mockDocument = {
  createElement: jest.fn((tagName: string) => {
    if (tagName === 'canvas') {
      return {
        getContext: jest.fn((type: string) => {
          if (type === 'webgl' || type === 'experimental-webgl') {
            return {
              getParameter: jest.fn((param: any) => {
                if (param === 'MAX_TEXTURE_SIZE') return 4096;
                return 'MockGPU';
              }),
              getExtension: jest.fn(() => ({
                UNMASKED_VENDOR_WEBGL: 'NVIDIA Corporation',
                UNMASKED_RENDERER_WEBGL: 'NVIDIA GeForce RTX 3080',
              })),
            };
          }
          if (type === 'webgl2') {
            return {}; // WebGL2 supported
          }
          return null;
        }),
      };
    }
    return {
      style: {},
      animate: jest.fn(),
    };
  }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const mockCSS = {
  supports: jest.fn(() => true),
};

// Apply mocks
Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true,
});

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
});

Object.defineProperty(global, 'screen', {
  value: mockScreen,
  writable: true,
});

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
});

Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true,
});

Object.defineProperty(global, 'CSS', {
  value: mockCSS,
  writable: true,
});

Object.defineProperty(global, 'WebAssembly', {
  value: {},
  writable: true,
});

describe('Device Capabilities Detection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset singleton instance
    (deviceCapabilityDetector as any).capabilities = null;
    (deviceCapabilityDetector as any).profile = null;
  });

  describe('getDeviceCapabilities', () => {
    it('detects high-performance desktop capabilities', async () => {
      const capabilities = await getDeviceCapabilities();

      expect(capabilities).toBeDefined();
      expect(capabilities.cpu.cores).toBe(8);
      expect(capabilities.cpu.performance).toBe('high');
      expect(capabilities.gpu.webglSupported).toBe(true);
      expect(capabilities.gpu.webgl2Supported).toBe(true);
      expect(capabilities.memory.deviceMemory).toBe(8);
      expect(capabilities.memory.performance).toBe('high');
      expect(capabilities.performance.overall).toBe('high');
    });

    it('detects display capabilities correctly', async () => {
      const capabilities = await getDeviceCapabilities();

      expect(capabilities.display.width).toBe(1920);
      expect(capabilities.display.height).toBe(1080);
      expect(capabilities.display.pixelRatio).toBe(2);
      expect(capabilities.display.colorDepth).toBe(24);
    });

    it('detects feature support correctly', async () => {
      const capabilities = await getDeviceCapabilities();

      expect(capabilities.features.webgl).toBe(true);
      expect(capabilities.features.webgl2).toBe(true);
      expect(capabilities.features.webassembly).toBe(true);
      expect(capabilities.features.cssCustomProperties).toBe(true);
      expect(capabilities.features.cssGrid).toBe(true);
      expect(capabilities.features.cssFlexbox).toBe(true);
    });

    it('detects user preferences correctly', async () => {
      const capabilities = await getDeviceCapabilities();

      expect(capabilities.preferences.reducedMotion).toBe(false);
      expect(capabilities.preferences.reducedData).toBe(true); // Based on mock
      expect(capabilities.preferences.highContrast).toBe(true); // Based on mock
      expect(capabilities.preferences.darkMode).toBe(true); // Based on mock
    });

    it('handles low-performance devices', async () => {
      // Mock low-performance device
      Object.defineProperty(global, 'navigator', {
        value: { ...mockNavigator, hardwareConcurrency: 2, deviceMemory: 2 },
        writable: true,
      });

      // Mock slow CPU benchmark
      mockPerformance.now.mockReturnValueOnce(0).mockReturnValueOnce(100);

      const capabilities = await getDeviceCapabilities();

      expect(capabilities.cpu.performance).toBe('low');
      expect(capabilities.memory.performance).toBe('low');
      expect(capabilities.performance.overall).toBe('low');
    });

    it('handles devices without WebGL support', async () => {
      // Mock no WebGL support
      const mockDocumentNoWebGL = {
        createElement: jest.fn(() => ({
          getContext: jest.fn(() => null),
        })),
      };

      Object.defineProperty(global, 'document', {
        value: mockDocumentNoWebGL,
        writable: true,
      });

      const capabilities = await getDeviceCapabilities();

      expect(capabilities.gpu.webglSupported).toBe(false);
      expect(capabilities.gpu.webgl2Supported).toBe(false);
      expect(capabilities.gpu.performance).toBe('low');
    });

    it('returns server-side defaults when window is undefined', async () => {
      // Mock server-side environment
      const originalWindow = global.window;
      delete (global as any).window;

      const capabilities = await getDeviceCapabilities();

      expect(capabilities.cpu.cores).toBe(4);
      expect(capabilities.gpu.webglSupported).toBe(false);
      expect(capabilities.performance.overall).toBe('medium');

      // Restore window
      (global as any).window = originalWindow;
    });
  });

  describe('getOptimizationProfile', () => {
    it('generates high-performance profile for capable devices', async () => {
      const profile = await getOptimizationProfile();

      expect(profile).toBeDefined();
      expect(profile.animations.enabled).toBe(true);
      expect(profile.animations.complexity).toBe('full');
      expect(profile.animations.parallax).toBe(true);
      expect(profile.animations.magnetic).toBe(true);
      expect(profile.animations.particles).toBe(true);
      expect(profile.rendering.webgl).toBe(true);
      expect(profile.rendering.particleCount).toBe(100);
      expect(profile.rendering.textureQuality).toBe('high');
    });

    it('generates reduced profile for low-performance devices', async () => {
      // Mock low-performance device
      Object.defineProperty(global, 'navigator', {
        value: { ...mockNavigator, hardwareConcurrency: 2, deviceMemory: 2 },
        writable: true,
      });

      // Reset singleton to force re-detection
      (deviceCapabilityDetector as any).capabilities = null;
      (deviceCapabilityDetector as any).profile = null;

      const profile = await getOptimizationProfile();

      expect(profile.animations.complexity).toBe('basic');
      expect(profile.animations.parallax).toBe(false);
      expect(profile.animations.magnetic).toBe(false);
      expect(profile.animations.particles).toBe(false);
      expect(profile.rendering.webgl).toBe(false);
      expect(profile.rendering.particleCount).toBe(20);
    });

    it('respects reduced motion preferences', async () => {
      // Mock reduced motion preference
      mockWindow.matchMedia.mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      // Reset singleton to force re-detection
      (deviceCapabilityDetector as any).capabilities = null;
      (deviceCapabilityDetector as any).profile = null;

      const profile = await getOptimizationProfile();

      expect(profile.animations.enabled).toBe(false);
      expect(profile.animations.complexity).toBe('minimal');
      expect(profile.animations.parallax).toBe(false);
      expect(profile.animations.magnetic).toBe(false);
      expect(profile.animations.particles).toBe(false);
    });

    it('adjusts settings for slow network connections', async () => {
      // Mock slow network
      Object.defineProperty(global, 'navigator', {
        value: {
          ...mockNavigator,
          connection: {
            effectiveType: '2g',
            saveData: true,
            downlink: 0.5,
            rtt: 500,
          },
        },
        writable: true,
      });

      // Reset singleton to force re-detection
      (deviceCapabilityDetector as any).capabilities = null;
      (deviceCapabilityDetector as any).profile = null;

      const profile = await getOptimizationProfile();

      expect(profile.loading.imageQuality).toBe('low');
      expect(profile.loading.preloading).toBe(false);
      expect(profile.network.prefetch).toBe(false);
    });
  });

  describe('singleton behavior', () => {
    it('returns the same capabilities on subsequent calls', async () => {
      const capabilities1 = await getDeviceCapabilities();
      const capabilities2 = await getDeviceCapabilities();

      expect(capabilities1).toBe(capabilities2);
    });

    it('returns the same profile on subsequent calls', async () => {
      const profile1 = await getOptimizationProfile();
      const profile2 = await getOptimizationProfile();

      expect(profile1).toBe(profile2);
    });
  });
});
