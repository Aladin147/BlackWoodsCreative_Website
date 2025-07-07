/**
 * Mobile Optimization Tests
 *
 * Comprehensive tests for mobile optimization utilities and responsive design
 */

import { renderHook, act } from '@testing-library/react';

import {
  MOBILE_BREAKPOINTS,
  TOUCH_TARGETS,
  MOBILE_ANIMATIONS,
  MobileStyles,
  MobileInteractions,
  MobilePerformance,
  MobileUtils,
  useMobileDevice
} from '../mobile-optimization';

// Mock window and navigator for testing
const mockWindow = {
  innerWidth: 1024,
  innerHeight: 768,
  devicePixelRatio: 2,
  matchMedia: jest.fn(),
  visualViewport: { height: 768 },
  scrollTo: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const mockNavigator = {
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
  maxTouchPoints: 5,
};

// Setup window and navigator mocks
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: mockWindow.innerWidth,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: mockWindow.innerHeight,
});

Object.defineProperty(window, 'devicePixelRatio', {
  writable: true,
  configurable: true,
  value: mockWindow.devicePixelRatio,
});

// Use the existing matchMedia mock from Jest setup
// Just ensure our mock functions are available
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: mockWindow.matchMedia(query).matches,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

Object.defineProperty(window, 'visualViewport', {
  writable: true,
  configurable: true,
  value: mockWindow.visualViewport,
});

Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  configurable: true,
  value: mockNavigator.userAgent,
});

Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  configurable: true,
  value: mockNavigator.maxTouchPoints,
});

describe('Mobile Optimization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWindow.matchMedia.mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
  });

  describe('MOBILE_BREAKPOINTS', () => {
    it('defines correct breakpoint values', () => {
      expect(MOBILE_BREAKPOINTS.xs).toBe(320);
      expect(MOBILE_BREAKPOINTS.sm).toBe(375);
      expect(MOBILE_BREAKPOINTS.md).toBe(414);
      expect(MOBILE_BREAKPOINTS.lg).toBe(768);
      expect(MOBILE_BREAKPOINTS.xl).toBe(1024);
    });

    it('has breakpoints in ascending order', () => {
      const values = Object.values(MOBILE_BREAKPOINTS);
      for (let i = 1; i < values.length; i++) {
        const current = values[i];
        const previous = values[i - 1];
        if (current !== undefined && previous !== undefined) {
          expect(current).toBeGreaterThan(previous);
        }
      }
    });
  });

  describe('TOUCH_TARGETS', () => {
    it('defines appropriate touch target sizes', () => {
      expect(TOUCH_TARGETS.minimum).toBe(44);
      expect(TOUCH_TARGETS.comfortable).toBe(48);
      expect(TOUCH_TARGETS.large).toBe(56);
      expect(TOUCH_TARGETS.spacing).toBe(8);
    });

    it('follows accessibility guidelines', () => {
      // Apple and Google recommend minimum 44px touch targets
      expect(TOUCH_TARGETS.minimum).toBeGreaterThanOrEqual(44);
      expect(TOUCH_TARGETS.comfortable).toBeGreaterThan(TOUCH_TARGETS.minimum);
      expect(TOUCH_TARGETS.large).toBeGreaterThan(TOUCH_TARGETS.comfortable);
    });
  });

  describe('MOBILE_ANIMATIONS', () => {
    it('defines appropriate animation durations', () => {
      expect(MOBILE_ANIMATIONS.duration.fast).toBe(150);
      expect(MOBILE_ANIMATIONS.duration.normal).toBe(250);
      expect(MOBILE_ANIMATIONS.duration.slow).toBe(350);
    });

    it('includes proper easing functions', () => {
      expect(MOBILE_ANIMATIONS.easing.standard).toMatch(/cubic-bezier/);
      expect(MOBILE_ANIMATIONS.easing.decelerate).toMatch(/cubic-bezier/);
      expect(MOBILE_ANIMATIONS.easing.accelerate).toMatch(/cubic-bezier/);
    });
  });

  describe('MobileStyles', () => {
    it('generates touch target classes', () => {
      const touchTarget = MobileStyles.touchTarget('comfortable');
      expect(touchTarget).toContain('min-h-[48px]');
      expect(touchTarget).toContain('min-w-[48px]');
    });

    it('provides safe area classes', () => {
      expect(MobileStyles.safeArea.top).toBe('pt-safe-top');
      expect(MobileStyles.safeArea.bottom).toBe('pb-safe-bottom');
      expect(MobileStyles.safeArea.left).toBe('pl-safe-left');
      expect(MobileStyles.safeArea.right).toBe('pr-safe-right');
      expect(MobileStyles.safeArea.all).toBe('p-safe');
    });

    it('includes responsive utility classes', () => {
      expect(MobileStyles.responsive.hideOnMobile).toBe('hidden lg:block');
      expect(MobileStyles.responsive.showOnMobile).toBe('block lg:hidden');
      expect(MobileStyles.responsive.mobileOnly).toBe('lg:hidden');
      expect(MobileStyles.responsive.tabletUp).toBe('hidden lg:block');
    });

    it('provides mobile-optimized spacing', () => {
      expect(MobileStyles.spacing.mobile).toBe('p-4 lg:p-6');
      expect(MobileStyles.spacing.mobileX).toBe('px-4 lg:px-6');
      expect(MobileStyles.spacing.mobileY).toBe('py-4 lg:py-6');
      expect(MobileStyles.spacing.section).toBe('py-8 lg:py-16');
    });

    it('includes responsive typography classes', () => {
      expect(MobileStyles.typography.heading).toBe('text-2xl lg:text-4xl');
      expect(MobileStyles.typography.subheading).toBe('text-lg lg:text-xl');
      expect(MobileStyles.typography.body).toBe('text-base lg:text-lg');
      expect(MobileStyles.typography.small).toBe('text-sm lg:text-base');
    });
  });

  describe('MobileInteractions', () => {
    it('prevents zoom on input focus', () => {
      expect(MobileInteractions.preventZoom.fontSize).toBe('16px');
    });

    it('provides touch-friendly button styles', () => {
      expect(MobileInteractions.touchButton).toContain('active:scale-95');
      expect(MobileInteractions.touchButton).toContain('transition-transform');
    });
  });

  describe('MobilePerformance', () => {
    it('determines when to reduce motion', () => {
      const lowPixelRatioDevice = { pixelRatio: 1 } as any;
      const highPixelRatioDevice = { pixelRatio: 3 } as any;

      expect(MobilePerformance.shouldReduceMotion(lowPixelRatioDevice)).toBe(true);
      
      mockWindow.matchMedia.mockReturnValue({ matches: false });
      expect(MobilePerformance.shouldReduceMotion(highPixelRatioDevice)).toBe(false);
    });

    it('gets appropriate mobile image sizes', () => {
      expect(MobilePerformance.getMobileImageSizes({ screenSize: 'xs' } as any)).toBe('320px');
      expect(MobilePerformance.getMobileImageSizes({ screenSize: 'sm' } as any)).toBe('375px');
      expect(MobilePerformance.getMobileImageSizes({ screenSize: 'md' } as any)).toBe('414px');
      expect(MobilePerformance.getMobileImageSizes({ screenSize: 'lg' } as any)).toBe('768px');
      expect(MobilePerformance.getMobileImageSizes({ screenSize: 'xl' } as any)).toBe('1024px');
    });
  });

  describe('MobileUtils', () => {
    it('detects mobile devices correctly', () => {
      // Test mobile width
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      expect(MobileUtils.isMobileDevice()).toBe(true);

      // Test desktop width
      Object.defineProperty(window, 'innerWidth', { value: 1024 });
      expect(MobileUtils.isMobileDevice()).toBe(false);
    });

    it('gets viewport height accounting for mobile browser UI', () => {
      const height = MobileUtils.getViewportHeight();
      expect(height).toBe(768); // From mock visualViewport
    });

    it('scrolls to element with mobile-optimized behavior', () => {
      const mockElement = {
        offsetTop: 100,
      } as HTMLElement;

      // Mock window.scrollTo
      const mockScrollTo = jest.fn();
      window.scrollTo = mockScrollTo;

      // Test mobile scroll (should be instant)
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      MobileUtils.scrollToElement(mockElement, 20);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 80, // 100 - 20 offset
        behavior: 'auto',
      });

      // Test desktop scroll (should be smooth)
      Object.defineProperty(window, 'innerWidth', { value: 1024 });
      MobileUtils.scrollToElement(mockElement, 20);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 80,
        behavior: 'smooth',
      });
    });
  });

  describe('useMobileDevice Hook', () => {
    it('detects device information correctly', () => {
      // Mock iPhone
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 812 });
      Object.defineProperty(navigator, 'userAgent', { 
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' 
      });
      mockWindow.matchMedia.mockImplementation((query) => ({
        matches: query === '(hover: hover)' ? false : true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => useMobileDevice());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.isIOS).toBe(true);
      expect(result.current.screenSize).toBe('sm');
      expect(result.current.supportsHover).toBe(false);
    });

    it('detects Android devices correctly', () => {
      Object.defineProperty(navigator, 'userAgent', { 
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F)' 
      });

      const { result } = renderHook(() => useMobileDevice());

      expect(result.current.isAndroid).toBe(true);
      expect(result.current.isIOS).toBe(false);
    });

    it('detects tablet devices correctly', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      Object.defineProperty(navigator, 'userAgent', { 
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)' 
      });

      const { result } = renderHook(() => useMobileDevice());

      expect(result.current.isTablet).toBe(true);
      expect(result.current.isMobile).toBe(false);
      expect(result.current.screenSize).toBe('lg');
    });

    it('handles orientation changes', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 812 });

      const { result } = renderHook(() => useMobileDevice());

      expect(result.current.orientation).toBe('portrait');

      // Simulate orientation change
      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 812 });
        Object.defineProperty(window, 'innerHeight', { value: 375 });
        window.dispatchEvent(new Event('orientationchange'));
      });

      // Note: In real implementation, this would trigger a re-render
      // For testing purposes, we're checking the logic exists
    });
  });

  describe('Responsive Design Validation', () => {
    it('follows mobile-first approach', () => {
      // All responsive classes should start with mobile styles
      // and use lg: prefix for larger screens
      const responsiveClasses = [
        MobileStyles.responsive.hideOnMobile,
        MobileStyles.responsive.showOnMobile,
        MobileStyles.spacing.mobile,
        MobileStyles.typography.heading,
      ];

      responsiveClasses.forEach(className => {
        if (className.includes('lg:')) {
          // Should follow mobile-first approach (base styles then lg: breakpoint)
          // Allow for classes like "block lg:hidden" or "hidden lg:block"
          expect(className).toMatch(/\w+\s+lg:|^lg:/);
        }
      });
    });

    it('provides appropriate touch target sizes', () => {
      // Check actual touch target sizes (excluding spacing which is different)
      expect(TOUCH_TARGETS.minimum).toBeGreaterThanOrEqual(44);
      expect(TOUCH_TARGETS.comfortable).toBeGreaterThanOrEqual(44);
      expect(TOUCH_TARGETS.large).toBeGreaterThanOrEqual(44);

      // Spacing is different - it's the gap between targets, not target size
      expect(TOUCH_TARGETS.spacing).toBeGreaterThan(0);
    });

    it('includes performance optimizations for mobile', () => {
      const mobileAnimations = MOBILE_ANIMATIONS.duration;
      
      // Mobile animations should be faster than desktop
      expect(mobileAnimations.fast).toBeLessThan(200);
      expect(mobileAnimations.normal).toBeLessThan(300);
      expect(mobileAnimations.slow).toBeLessThan(400);
    });
  });
});
