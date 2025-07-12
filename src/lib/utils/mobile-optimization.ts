/**
 * Mobile Optimization Utilities
 *
 * Practical mobile optimization utilities focused on real-world mobile usage patterns
 */

import { useEffect, useState } from 'react';

// Mobile device detection
export interface MobileDeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation: 'portrait' | 'landscape';
  hasNotch: boolean;
  supportsHover: boolean;
  touchPoints: number;
  pixelRatio: number;
}

// Mobile breakpoints (mobile-first approach)
export const MOBILE_BREAKPOINTS = {
  xs: 320, // Small phones
  sm: 375, // Standard phones
  md: 414, // Large phones
  lg: 768, // Tablets
  xl: 1024, // Large tablets/small laptops
} as const;

// Touch target sizes (following Apple and Google guidelines)
export const TOUCH_TARGETS = {
  minimum: 44, // Minimum touch target size
  comfortable: 48, // Comfortable touch target size
  large: 56, // Large touch target size
  spacing: 8, // Minimum spacing between touch targets
} as const;

// Mobile-optimized animation settings
export const MOBILE_ANIMATIONS = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  },
} as const;

// Mobile device detection hook
export function useMobileDevice(): MobileDeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<MobileDeviceInfo>({
    isMobile: false,
    isTablet: false,
    isIOS: false,
    isAndroid: false,
    screenSize: 'lg',
    orientation: 'landscape',
    hasNotch: false,
    supportsHover: true,
    touchPoints: 0,
    pixelRatio: 1,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const { userAgent } = navigator;

      // Device type detection
      const isMobile = width < MOBILE_BREAKPOINTS.lg;
      const isTablet = width >= MOBILE_BREAKPOINTS.lg && width < MOBILE_BREAKPOINTS.xl;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);

      // Screen size detection
      let screenSize: MobileDeviceInfo['screenSize'] = 'xs';
      if (width >= MOBILE_BREAKPOINTS.xl) screenSize = 'xl';
      else if (width >= MOBILE_BREAKPOINTS.lg) screenSize = 'lg';
      else if (width >= MOBILE_BREAKPOINTS.md) screenSize = 'md';
      else if (width >= MOBILE_BREAKPOINTS.sm) screenSize = 'sm';

      // Orientation detection
      const orientation = height > width ? 'portrait' : 'landscape';

      // Notch detection (approximate)
      const hasNotch =
        isIOS &&
        ((width === 375 && height === 812) || // iPhone X, XS, 11 Pro
          (width === 414 && height === 896) || // iPhone XR, 11, XS Max, 11 Pro Max
          (width === 390 && height === 844) || // iPhone 12, 12 Pro
          (width === 428 && height === 926)); // iPhone 12 Pro Max

      // Hover support detection
      const supportsHover = window.matchMedia('(hover: hover)').matches;

      // Touch points detection
      const touchPoints = navigator.maxTouchPoints || 0;

      // Pixel ratio
      const pixelRatio = window.devicePixelRatio || 1;

      setDeviceInfo({
        isMobile,
        isTablet,
        isIOS,
        isAndroid,
        screenSize,
        orientation,
        hasNotch,
        supportsHover,
        touchPoints,
        pixelRatio,
      });
    };

    detectDevice();

    const handleResize = () => detectDevice();
    const handleOrientationChange = () => {
      // Delay to allow for orientation change to complete
      setTimeout(detectDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
}

// Mobile-optimized CSS classes generator
export const MobileStyles = {
  // Touch target classes
  touchTarget: (size: keyof typeof TOUCH_TARGETS = 'comfortable') =>
    `min-h-[${TOUCH_TARGETS[size] ?? TOUCH_TARGETS.comfortable}px] min-w-[${TOUCH_TARGETS[size] ?? TOUCH_TARGETS.comfortable}px]`,

  // Safe area classes for devices with notches
  safeArea: {
    top: 'pt-safe-top',
    bottom: 'pb-safe-bottom',
    left: 'pl-safe-left',
    right: 'pr-safe-right',
    all: 'p-safe',
  },

  // Mobile-first responsive classes
  responsive: {
    hideOnMobile: 'hidden lg:block',
    showOnMobile: 'block lg:hidden',
    mobileOnly: 'lg:hidden',
    tabletUp: 'hidden lg:block',
    mobileStack: 'flex flex-col lg:flex-row',
    mobileCenter: 'text-center lg:text-left',
  },

  // Mobile-optimized spacing
  spacing: {
    mobile: 'p-4 lg:p-6',
    mobileX: 'px-4 lg:px-6',
    mobileY: 'py-4 lg:py-6',
    section: 'py-8 lg:py-16',
  },

  // Mobile-optimized typography
  typography: {
    heading: 'text-2xl lg:text-4xl',
    subheading: 'text-lg lg:text-xl',
    body: 'text-base lg:text-lg',
    small: 'text-sm lg:text-base',
  },
};

// Mobile interaction utilities
export const MobileInteractions = {
  // Prevent zoom on input focus (iOS)
  preventZoom: {
    fontSize: '16px', // Prevents zoom on iOS
  },

  // Touch-friendly button styles
  touchButton: 'active:scale-95 transition-transform duration-150',

  // Swipe gesture detection
  detectSwipe: (
    element: HTMLElement,
    onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void,
    threshold = 50
  ) => {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        startX = touch.clientX;
        startY = touch.clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (touch) {
        endX = touch.clientX;
        endY = touch.clientY;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (Math.abs(deltaX) > threshold) {
            onSwipe(deltaX > 0 ? 'right' : 'left');
          }
        } else {
          // Vertical swipe
          if (Math.abs(deltaY) > threshold) {
            onSwipe(deltaY > 0 ? 'down' : 'up');
          }
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  },
};

// Mobile performance utilities
export const MobilePerformance = {
  // Reduce motion for mobile devices
  shouldReduceMotion: (deviceInfo: MobileDeviceInfo): boolean => {
    // Reduce motion on older/slower devices
    if (deviceInfo.pixelRatio < 2) return true;

    // Check user preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return false;
  },

  // Optimize images for mobile
  getMobileImageSizes: (deviceInfo: MobileDeviceInfo): string => {
    if (deviceInfo.screenSize === 'xs') return '320px';
    if (deviceInfo.screenSize === 'sm') return '375px';
    if (deviceInfo.screenSize === 'md') return '414px';
    if (deviceInfo.screenSize === 'lg') return '768px';
    return '1024px';
  },

  // Lazy loading threshold for mobile
  getLazyLoadingThreshold: (deviceInfo: MobileDeviceInfo): string => {
    // Load images closer to viewport on mobile for better UX
    return deviceInfo.isMobile ? '100px' : '200px';
  },
};

// Mobile form optimization
export const MobileForm = {
  // Input types for better mobile keyboards
  inputTypes: {
    email: 'email',
    phone: 'tel',
    number: 'number',
    url: 'url',
    search: 'search',
  },

  // Mobile-optimized input attributes
  mobileInputProps: {
    autoComplete: 'on',
    autoCapitalize: 'off',
    autoCorrect: 'off',
    spellCheck: false,
    style: { fontSize: '16px' }, // Prevents zoom on iOS
  },

  // Form validation for mobile
  validateMobileForm: (formData: Record<string, string>): string[] => {
    const errors: string[] = [];

    // Check required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        errors.push(`${key} is required`);
      }
    });

    // Validate email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate phone (basic)
    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      errors.push('Please enter a valid phone number');
    }

    return errors;
  },
};

// Export utility functions
export const MobileUtils = {
  // Check if device is mobile
  isMobileDevice: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINTS.lg;
  },

  // Get viewport height accounting for mobile browser UI
  getViewportHeight: (): number => {
    if (typeof window === 'undefined') return 0;
    return window.visualViewport?.height ?? window.innerHeight;
  },

  // Scroll to element with mobile-optimized behavior
  scrollToElement: (element: HTMLElement, offset = 0): void => {
    const elementTop = element.offsetTop - offset;
    const isMobile = MobileUtils.isMobileDevice();

    window.scrollTo({
      top: elementTop,
      behavior: isMobile ? 'auto' : 'smooth', // Instant scroll on mobile for better performance
    });
  },
};
