import { renderHook, act, waitFor } from '@testing-library/react';

import { getOptimizationProfile, getDeviceCapabilities } from '@/lib/utils/device-capabilities';

import { useDeviceAdaptation } from '../useDeviceAdaptation';

// Mock the device capabilities module
jest.mock('@/lib/utils/device-capabilities', () => ({
  getOptimizationProfile: jest.fn(),
  getDeviceCapabilities: jest.fn(),
}));

const mockGetOptimizationProfile = getOptimizationProfile as jest.MockedFunction<typeof getOptimizationProfile>;
const mockGetDeviceCapabilities = getDeviceCapabilities as jest.MockedFunction<typeof getDeviceCapabilities>;

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Mock window.navigator
const mockNavigator = (
  userAgent: string,
  connection?: { effectiveType?: string; downlink?: number }
) => {
  Object.defineProperty(window, 'navigator', {
    writable: true,
    value: {
      userAgent,
      connection,
      onLine: true,
    },
  });
};

// Mock window.screen
const mockScreen = (width: number, height: number) => {
  Object.defineProperty(window, 'screen', {
    writable: true,
    value: {
      width,
      height,
      availWidth: width,
      availHeight: height,
    },
  });
};

describe('useDeviceAdaptation', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default device capabilities mocks (will be overridden in specific tests)
    mockGetOptimizationProfile.mockReturnValue({
      animations: {
        enabled: true,
        complexity: 'enhanced',
        duration: 0.4,
        easing: 'ease-in-out',
        parallax: true,
        magnetic: true,
        particles: false,
      },
      rendering: {
        webgl: false,
        particleCount: 50,
        textureQuality: 'medium',
        shadowQuality: 'medium',
        antialiasing: false,
      },
      loading: {
        imageQuality: 'medium',
        lazyLoading: true,
        preloading: true,
        bundleSplitting: true,
      },
      network: {
        compression: true,
        caching: true,
        prefetch: true,
        serviceWorker: false,
      },
    });
    mockGetDeviceCapabilities.mockReturnValue({
      cpu: { cores: 4, architecture: 'x64', performance: 'medium' },
      gpu: { vendor: 'unknown', renderer: 'unknown', webglSupported: false, webgl2Supported: false, maxTextureSize: 0, performance: 'low' },
      memory: { deviceMemory: 4, jsHeapSizeLimit: 2147483648, performance: 'medium' },
      network: { effectiveType: '4g', downlink: 10, rtt: 100, saveData: false },
      display: { width: 1920, height: 1080, pixelRatio: 1, colorDepth: 24, refreshRate: 60, hdr: false },
      features: {
        webgl: false,
        webgl2: false,
        webassembly: true,
        serviceWorker: false,
        intersectionObserver: true,
        resizeObserver: true,
        performanceObserver: true,
        webAnimations: true,
        cssCustomProperties: true,
        cssGrid: true,
        cssFlexbox: true,
      },
      performance: { overall: 'medium', graphics: 'low', computation: 'medium', memory: 'medium' },
      preferences: { reducedMotion: false, reducedData: false, highContrast: false, darkMode: false },
    });

    // Reset to default desktop setup
    mockMatchMedia(false);
    mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    mockScreen(1920, 1080);
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1920 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1080 });
    Object.defineProperty(window, 'devicePixelRatio', { writable: true, configurable: true, value: 1 });
  });

  describe('Device Detection', () => {
    it('detects desktop device correctly', async () => {
      const { result } = renderHook(() => useDeviceAdaptation());

      // Wait for the useEffect to run and update the device info
      await waitFor(() => {
        expect(result.current.deviceInfo.screenSize).toBe('2xl');
      });

      expect(result.current.deviceInfo.isMobile).toBe(false);
      expect(result.current.deviceInfo.isTablet).toBe(false);
      expect(result.current.deviceInfo.isDesktop).toBe(true);
      expect(result.current.deviceInfo.screenSize).toBe('2xl');
    });

    it('detects mobile device correctly', async () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
      mockScreen(375, 812);
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 812 });

      const { result } = renderHook(() => useDeviceAdaptation());

      // Wait for the useEffect to run and update the device info
      await waitFor(() => {
        expect(result.current.deviceInfo.isMobile).toBe(true);
      });

      expect(result.current.deviceInfo.isMobile).toBe(true);
      expect(result.current.deviceInfo.isTablet).toBe(false);
      expect(result.current.deviceInfo.isDesktop).toBe(false);
      expect(result.current.deviceInfo.screenSize).toBe('sm');
    });

    it('detects tablet device correctly', async () => {
      // Use a generic tablet user agent that doesn't match mobile patterns
      mockNavigator('Mozilla/5.0 (compatible; Tablet; rv:14.0)', undefined);
      mockScreen(768, 1024);
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1024 });
      Object.defineProperty(window, 'ontouchstart', { value: true, configurable: true });
      Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, writable: true, configurable: true });

      const { result } = renderHook(() => useDeviceAdaptation());

      // Wait for the useEffect to run and update the device info
      await waitFor(() => {
        expect(result.current.deviceInfo.isTablet).toBe(true);
      });

      // Generic tablet should be detected as tablet
      expect(result.current.deviceInfo.isMobile).toBe(false);
      expect(result.current.deviceInfo.isTablet).toBe(true);
      expect(result.current.deviceInfo.isDesktop).toBe(false);
      expect(result.current.deviceInfo.screenSize).toBe('md');
    });
  });

  describe('Screen Size Detection', () => {
    it('detects large screen correctly', async () => {
      mockScreen(1920, 1080);
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1920 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1080 });

      const { result } = renderHook(() => useDeviceAdaptation());

      await waitFor(() => {
        expect(result.current.deviceInfo.screenSize).toBe('2xl');
      });

      expect(result.current.deviceInfo.screenSize).toBe('2xl');
      expect(result.current.deviceInfo.pixelRatio).toBe(1);
    });

    it('detects small screen correctly', async () => {
      mockScreen(375, 812);
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 812 });

      const { result } = renderHook(() => useDeviceAdaptation());

      await waitFor(() => {
        expect(result.current.deviceInfo.screenSize).toBe('sm');
      });

      expect(result.current.deviceInfo.screenSize).toBe('sm');
    });

    it('detects medium screen correctly', async () => {
      mockScreen(768, 1024);
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1024 });

      const { result } = renderHook(() => useDeviceAdaptation());

      await waitFor(() => {
        expect(result.current.deviceInfo.screenSize).toBe('md');
      });

      expect(result.current.deviceInfo.screenSize).toBe('md');
    });
  });

  describe('Orientation Detection', () => {
    it('detects landscape orientation', () => {
      mockScreen(1920, 1080);
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 });
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 1080 });

      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.deviceInfo.orientation).toBe('landscape');
    });

    it('detects portrait orientation', async () => {
      mockScreen(375, 812);
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 812 });

      const { result } = renderHook(() => useDeviceAdaptation());

      await waitFor(() => {
        expect(result.current.deviceInfo.orientation).toBe('portrait');
      });

      expect(result.current.deviceInfo.orientation).toBe('portrait');
    });

    it('detects touch capability', async () => {
      Object.defineProperty(window, 'ontouchstart', { value: true, configurable: true });
      Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, writable: true, configurable: true });

      const { result } = renderHook(() => useDeviceAdaptation());

      await waitFor(() => {
        expect(result.current.deviceInfo.isTouchDevice).toBe(true);
      });

      expect(result.current.deviceInfo.isTouchDevice).toBe(true);
    });
  });

  describe('Adaptive Configuration', () => {
    it('returns mobile config for mobile devices', async () => {
      // Mock mobile device capabilities - force fallback to simple device detection
      mockGetOptimizationProfile.mockImplementation(() => {
        throw new Error('Device capabilities not available');
      });
      mockGetDeviceCapabilities.mockImplementation(() => {
        throw new Error('Device capabilities not available');
      });

      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
      mockScreen(375, 812);
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 812 });

      const { result } = renderHook(() => useDeviceAdaptation());

      await waitFor(() => {
        expect(result.current.adaptiveConfig.magneticStrength).toBe(0.1);
      });

      expect(result.current.adaptiveConfig.magneticStrength).toBe(0.1);
      expect(result.current.adaptiveConfig.enableParallax).toBe(false);
      expect(result.current.adaptiveConfig.enableComplexAnimations).toBe(false);
    });

    it('returns tablet config for tablet devices', async () => {
      // Mock tablet device capabilities - force fallback to simple device detection
      mockGetOptimizationProfile.mockImplementation(() => {
        throw new Error('Device capabilities not available');
      });
      mockGetDeviceCapabilities.mockImplementation(() => {
        throw new Error('Device capabilities not available');
      });

      // Use a generic tablet user agent that doesn't match mobile patterns
      mockNavigator('Mozilla/5.0 (compatible; Tablet; rv:14.0)');
      mockScreen(768, 1024);
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1024 });
      Object.defineProperty(window, 'ontouchstart', { value: true, configurable: true });
      Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, writable: true, configurable: true });

      const { result } = renderHook(() => useDeviceAdaptation());

      await waitFor(() => {
        expect(result.current.adaptiveConfig.magneticStrength).toBe(0.15);
      });

      // Generic tablet should get tablet config
      expect(result.current.adaptiveConfig.magneticStrength).toBe(0.15);
      expect(result.current.adaptiveConfig.enableParallax).toBe(true);
      expect(result.current.adaptiveConfig.enableComplexAnimations).toBe(true);
    });

    it('returns desktop config for desktop devices', () => {
      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.adaptiveConfig.magneticStrength).toBe(0.25);
      expect(result.current.adaptiveConfig.enableParallax).toBe(true);
      expect(result.current.adaptiveConfig.enableComplexAnimations).toBe(true);
    });

    it('handles reduced motion preference', async () => {
      mockMatchMedia(true); // prefers-reduced-motion: reduce

      const { result } = renderHook(() => useDeviceAdaptation());

      await waitFor(() => {
        expect(result.current.adaptiveConfig.enableParallax).toBe(false);
      });

      expect(result.current.adaptiveConfig.enableParallax).toBe(false);
      expect(result.current.adaptiveConfig.enableComplexAnimations).toBe(false);
    });
  });

  describe('Feature Detection', () => {
    it('enables features for desktop devices', () => {
      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.shouldEnableFeature('enableParallax')).toBe(true);
      expect(result.current.shouldEnableFeature('enableComplexAnimations')).toBe(true);
      expect(result.current.shouldEnableFeature('enableMagnetic')).toBe(true);
    });

    it('disables features for mobile devices', async () => {
      // Mock mobile device capabilities - force fallback to simple device detection
      mockGetOptimizationProfile.mockImplementation(() => {
        throw new Error('Device capabilities not available');
      });
      mockGetDeviceCapabilities.mockImplementation(() => {
        throw new Error('Device capabilities not available');
      });

      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
      mockScreen(375, 812);
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 812 });

      const { result } = renderHook(() => useDeviceAdaptation());

      await waitFor(() => {
        expect(result.current.shouldEnableFeature('enableParallax')).toBe(false);
      });

      expect(result.current.shouldEnableFeature('enableParallax')).toBe(false);
      expect(result.current.shouldEnableFeature('enableComplexAnimations')).toBe(false);
      expect(result.current.shouldEnableFeature('enableMagnetic')).toBe(true);
    });

    it('handles unknown features gracefully', () => {
      const { result } = renderHook(() => useDeviceAdaptation());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(result.current.shouldEnableFeature('unknownFeature' as any)).toBe(undefined);
    });
  });

  describe('Resize Handling', () => {
    it('updates screen size on window resize', async () => {
      // Set up desktop environment first
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      mockScreen(1280, 720);
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1280 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 720 });

      // Ensure no touch support for desktop
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).ontouchstart;
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 0,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useDeviceAdaptation());

      // Wait for initial detection
      await waitFor(() => {
        expect(result.current.deviceInfo.screenSize).toBe('xl');
      });

      // Initial state should have large screen
      expect(result.current.deviceInfo.screenSize).toBe('xl');

      // Simulate resize to mobile
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 812 });

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Wait for resize detection
      await waitFor(() => {
        expect(result.current.deviceInfo.screenSize).toBe('sm');
      });

      // Should update screen size to small
      expect(result.current.deviceInfo.screenSize).toBe('sm');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing navigator gracefully', () => {
      const originalNavigator = global.navigator;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (global as any).navigator;

      expect(() => {
        renderHook(() => useDeviceAdaptation());
      }).not.toThrow(); // Hook should handle missing navigator gracefully now

      global.navigator = originalNavigator;
    });

    it('handles missing screen gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).screen;

      expect(() => {
        renderHook(() => useDeviceAdaptation());
      }).not.toThrow();
    });

    it('handles missing matchMedia gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).matchMedia;

      expect(() => {
        renderHook(() => useDeviceAdaptation());
      }).not.toThrow();
    });
  });
});
