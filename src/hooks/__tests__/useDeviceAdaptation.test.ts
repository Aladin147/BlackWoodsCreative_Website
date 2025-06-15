import { renderHook, act } from '@testing-library/react';
import { useDeviceAdaptation } from '../useDeviceAdaptation';

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
const mockNavigator = (userAgent: string, connection?: any) => {
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
    // Reset to default desktop setup
    mockMatchMedia(false);
    mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    mockScreen(1920, 1080);
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 1080 });
  });

  describe('Device Detection', () => {
    it('detects desktop device correctly', () => {
      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.deviceInfo.isMobile).toBe(false);
      expect(result.current.deviceInfo.isTablet).toBe(false);
      expect(result.current.deviceInfo.isDesktop).toBe(true);
      expect(result.current.deviceInfo.screenSize).toBe('xl');
    });

    it('detects mobile device correctly', () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
      mockScreen(375, 812);
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 });

      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.deviceInfo.isMobile).toBe(true);
      expect(result.current.deviceInfo.isTablet).toBe(false);
      expect(result.current.deviceInfo.isDesktop).toBe(false);
      expect(result.current.deviceInfo.screenSize).toBe('sm');
    });

    it('detects tablet device correctly', () => {
      mockNavigator('Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)');
      mockScreen(768, 1024);
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 768 });
      Object.defineProperty(window, 'ontouchstart', { value: true });

      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.deviceInfo.isMobile).toBe(false);
      expect(result.current.deviceInfo.isTablet).toBe(true);
      expect(result.current.deviceInfo.isDesktop).toBe(false);
      expect(result.current.deviceInfo.screenSize).toBe('md');
    });
  });

  describe('Screen Size Detection', () => {
    it('detects large screen correctly', () => {
      mockScreen(1920, 1080);
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 });

      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.deviceInfo.screenSize).toBe('xl');
      expect(result.current.deviceInfo.pixelRatio).toBe(1);
    });

    it('detects small screen correctly', () => {
      mockScreen(375, 812);
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 });

      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.deviceInfo.screenSize).toBe('sm');
    });

    it('detects medium screen correctly', () => {
      mockScreen(768, 1024);
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 768 });

      const { result } = renderHook(() => useDeviceAdaptation());

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

    it('detects portrait orientation', () => {
      mockScreen(375, 812);
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 });
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 812 });

      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.deviceInfo.orientation).toBe('portrait');
    });

    it('detects touch capability', () => {
      Object.defineProperty(window, 'ontouchstart', { value: true });
      Object.defineProperty(navigator, 'maxTouchPoints', { value: 5 });

      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.deviceInfo.isTouchDevice).toBe(true);
    });
  });

  describe('Adaptive Configuration', () => {
    it('returns mobile config for mobile devices', () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
      mockScreen(375, 812);
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 });

      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.adaptiveConfig.magneticStrength).toBe(0.1);
      expect(result.current.adaptiveConfig.enableParallax).toBe(false);
      expect(result.current.adaptiveConfig.enableComplexAnimations).toBe(false);
    });

    it('returns tablet config for tablet devices', () => {
      mockNavigator('Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)');
      mockScreen(768, 1024);
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 768 });
      Object.defineProperty(window, 'ontouchstart', { value: true });

      const { result } = renderHook(() => useDeviceAdaptation());

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

    it('handles reduced motion preference', () => {
      mockMatchMedia(true); // prefers-reduced-motion: reduce

      const { result } = renderHook(() => useDeviceAdaptation());

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

    it('disables features for mobile devices', () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
      mockScreen(375, 812);
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 });

      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.shouldEnableFeature('enableParallax')).toBe(false);
      expect(result.current.shouldEnableFeature('enableComplexAnimations')).toBe(false);
      expect(result.current.shouldEnableFeature('enableMagnetic')).toBe(true);
    });

    it('handles unknown features gracefully', () => {
      const { result } = renderHook(() => useDeviceAdaptation());

      expect(result.current.shouldEnableFeature('unknownFeature' as any)).toBe(undefined);
    });
  });

  describe('Resize Handling', () => {
    it('updates device info on window resize', () => {
      const { result } = renderHook(() => useDeviceAdaptation());

      // Initial desktop state
      expect(result.current.deviceInfo.type).toBe('desktop');

      // Simulate resize to mobile
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 });
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 812 });

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Should still be desktop because user agent hasn't changed
      // (resize alone doesn't change device type detection)
      expect(result.current.deviceInfo.type).toBe('desktop');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing navigator gracefully', () => {
      delete (window as any).navigator;

      expect(() => {
        renderHook(() => useDeviceAdaptation());
      }).not.toThrow();
    });

    it('handles missing screen gracefully', () => {
      delete (window as any).screen;

      expect(() => {
        renderHook(() => useDeviceAdaptation());
      }).not.toThrow();
    });

    it('handles missing matchMedia gracefully', () => {
      delete (window as any).matchMedia;

      expect(() => {
        renderHook(() => useDeviceAdaptation());
      }).not.toThrow();
    });
  });
});
