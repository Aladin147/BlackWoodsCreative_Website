'use client';

import { useState, useEffect, useCallback } from 'react';

import {
  getDeviceCapabilities,
  getOptimizationProfile,
  DeviceCapabilities,
  OptimizationProfile,
} from '@/lib/utils/device-capabilities';

// Helper function to determine screen size category
function getScreenSize(width: number): 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  if (width < 1280) return 'xl';
  return '2xl';
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  screenSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  hasHover: boolean;
  prefersReducedMotion: boolean;
  // Enhanced device information
  capabilities?: DeviceCapabilities;
  optimizationProfile?: OptimizationProfile | undefined;
}

interface AdaptiveConfig {
  magneticStrength: number;
  magneticDistance: number;
  animationDuration: number;
  enableParallax: boolean;
  enableMagnetic: boolean;
  enableComplexAnimations: boolean;
}

const defaultMobileConfig: AdaptiveConfig = {
  magneticStrength: 0.1, // Reduced for mobile
  magneticDistance: 60, // Smaller distance for touch
  animationDuration: 0.3, // Faster animations
  enableParallax: false, // Disabled for performance
  enableMagnetic: true, // Keep but reduced
  enableComplexAnimations: false,
};

const defaultTabletConfig: AdaptiveConfig = {
  magneticStrength: 0.15,
  magneticDistance: 80,
  animationDuration: 0.4,
  enableParallax: true,
  enableMagnetic: true,
  enableComplexAnimations: true,
};

const defaultDesktopConfig: AdaptiveConfig = {
  magneticStrength: 0.25,
  magneticDistance: 120,
  animationDuration: 0.6,
  enableParallax: true,
  enableMagnetic: true,
  enableComplexAnimations: true,
};

// ✅ Function to get adaptive config based on device info
function getAdaptiveConfig(deviceInfo: DeviceInfo): AdaptiveConfig {
  if (deviceInfo.isMobile) {
    return defaultMobileConfig;
  } else if (deviceInfo.isTablet) {
    return defaultTabletConfig;
  } else {
    return defaultDesktopConfig;
  }
}

// ✅ SSR-safe basic device detection fallback
function getBasicDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    // Return safe defaults for SSR
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      screenSize: 'xl' as const,
      orientation: 'landscape' as const,
      pixelRatio: 1,
      hasHover: true,
      prefersReducedMotion: false,
      optimizationProfile: undefined,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /tablet|ipad/i.test(userAgent) && !isMobile;
  const isDesktop = !isMobile && !isTablet;

  // Determine screen size based on window width
  const width = window.innerWidth;
  let screenSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  if (width < 640) screenSize = 'sm';
  else if (width < 768) screenSize = 'md';
  else if (width < 1024) screenSize = 'lg';
  else if (width < 1280) screenSize = 'xl';
  else screenSize = '2xl';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice: 'ontouchstart' in window,
    screenSize,
    orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
    pixelRatio: window.devicePixelRatio || 1,
    hasHover: window.matchMedia('(hover: hover)').matches,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    optimizationProfile: undefined,
  };
}

export function useDeviceAdaptation() {
  // ✅ SSR-safe: Use null initial state to prevent hydration mismatch
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [adaptiveConfig, setAdaptiveConfig] = useState<AdaptiveConfig>(defaultDesktopConfig);
  const [isHydrated, setIsHydrated] = useState(false);

  // ✅ Track hydration state and initialize device detection
  useEffect(() => {
    setIsHydrated(true);

    // ✅ Only run device detection after hydration
    const detectDevice = async () => {
      try {
        const capabilities = await getDeviceCapabilities();
        const profile = getOptimizationProfile();

        // Map capabilities to DeviceInfo structure
        const info: DeviceInfo = {
          isMobile: capabilities.display.width <= 768,
          isTablet: capabilities.display.width > 768 && capabilities.display.width <= 1024,
          isDesktop: capabilities.display.width > 1024,
          isTouchDevice: 'ontouchstart' in window,
          screenSize: getScreenSize(capabilities.display.width),
          orientation: capabilities.display.width > capabilities.display.height ? 'landscape' : 'portrait',
          pixelRatio: capabilities.display.pixelRatio,
          hasHover: window.matchMedia('(hover: hover)').matches,
          prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          capabilities,
          optimizationProfile: profile,
        };

        setDeviceInfo(info);
        setAdaptiveConfig(getAdaptiveConfig(info));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Device detection failed, using defaults:', error);
        // Fallback to basic detection
        const basicInfo = getBasicDeviceInfo();
        setDeviceInfo(basicInfo);
        setAdaptiveConfig(getAdaptiveConfig(basicInfo));
      }
    };

    detectDevice();
  }, []);

  const detectDevice = useCallback(() => {
    // ✅ Only run on client after hydration
    if (typeof window === 'undefined' || !isHydrated) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isTouchDevice =
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
    const pixelRatio = window.devicePixelRatio ?? 1;

    // Screen size detection
    let screenSize: DeviceInfo['screenSize'] = 'sm';
    if (width >= 1536) screenSize = '2xl';
    else if (width >= 1280) screenSize = 'xl';
    else if (width >= 1024) screenSize = 'lg';
    else if (width >= 768) screenSize = 'md';

    // Device type detection
    const isMobile =
      width < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = width >= 768 && width < 1024 && isTouchDevice;
    const isDesktop = width >= 1024 && !isTouchDevice;

    // Orientation detection
    const orientation = height > width ? 'portrait' : 'landscape';

    // Hover capability detection
    const hasHover =
      typeof window.matchMedia !== 'undefined' ? window.matchMedia('(hover: hover)').matches : true;

    // Motion preference detection
    const prefersReducedMotion =
      typeof window.matchMedia !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    // Enhanced device capabilities detection - temporarily disabled for debugging
    let capabilities: DeviceCapabilities | undefined;
    let optimizationProfile: OptimizationProfile | undefined;

    // Temporarily disable to isolate Chrome runtime error
    // try {
    //   capabilities = await getDeviceCapabilities();
    //   optimizationProfile = await getOptimizationProfile();
    // } catch {
    //   // Failed to detect device capabilities - logged internally
    // }

    const newDeviceInfo: DeviceInfo = {
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice,
      screenSize,
      orientation,
      pixelRatio,
      hasHover,
      prefersReducedMotion,
      ...(capabilities && { capabilities }),
      ...(optimizationProfile && { optimizationProfile }),
    };

    setDeviceInfo(newDeviceInfo);

    // Set adaptive config based on device and capabilities
    let config = defaultDesktopConfig;

    if (optimizationProfile) {
      // Use advanced optimization profile if available
      config = {
        magneticStrength: optimizationProfile.animations.magnetic
          ? optimizationProfile.animations.complexity === 'full'
            ? 0.25
            : optimizationProfile.animations.complexity === 'enhanced'
              ? 0.15
              : 0.1
          : 0,
        magneticDistance: optimizationProfile.animations.magnetic ? 120 : 0,
        animationDuration: optimizationProfile.animations.duration,
        enableParallax: optimizationProfile.animations.parallax,
        enableMagnetic: optimizationProfile.animations.magnetic,
        enableComplexAnimations: optimizationProfile.animations.complexity !== 'minimal',
      };
    } else {
      // Fallback to basic device detection
      if (isMobile) {
        config = defaultMobileConfig;
      } else if (isTablet) {
        config = defaultTabletConfig;
      }
    }

    // Apply motion preferences (always override optimization profile)
    if (prefersReducedMotion) {
      config = {
        ...config,
        magneticStrength: 0,
        animationDuration: 0.1,
        enableParallax: false,
        enableComplexAnimations: false,
        enableMagnetic: false,
      };
    }

    setAdaptiveConfig(config);
  }, [isHydrated]);

  useEffect(() => {
    detectDevice();

    // Only add event listeners in browser environment
    if (typeof window === 'undefined') return;

    const handleResize = () => detectDevice();
    const handleOrientationChange = () => setTimeout(detectDevice, 100);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [detectDevice]);

  const getAdaptiveMagneticProps = (baseStrength: number, baseDistance: number) => {
    if (!adaptiveConfig.enableMagnetic) {
      return { strength: 0, distance: 0 };
    }

    return {
      strength: baseStrength * (adaptiveConfig.magneticStrength / 0.25), // Normalize to desktop baseline
      distance: baseDistance * (adaptiveConfig.magneticDistance / 120), // Normalize to desktop baseline
    };
  };

  const getAdaptiveAnimationProps = (baseDuration: number) => {
    return {
      duration: baseDuration * (adaptiveConfig.animationDuration / 0.6), // Normalize to desktop baseline
      ease: deviceInfo?.isMobile ? 'easeOut' : [0.25, 0.46, 0.45, 0.94], // ✅ SSR-safe
    };
  };

  const shouldEnableFeature = (feature: keyof AdaptiveConfig) => {
    return adaptiveConfig[feature];
  };

  // ✅ Provide safe defaults when deviceInfo is null (during SSR/hydration)
  const safeDeviceInfo = deviceInfo ?? {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    screenSize: 'lg' as const,
    orientation: 'landscape' as const,
    pixelRatio: 1,
    hasHover: true,
    prefersReducedMotion: false,
  };

  return {
    deviceInfo: safeDeviceInfo,
    adaptiveConfig,
    getAdaptiveMagneticProps,
    getAdaptiveAnimationProps,
    shouldEnableFeature,
    isHydrated, // ✅ Expose hydration state
  };
}

// Hook for components to get device-adaptive magnetic field props
export function useAdaptiveMagnetic(baseStrength: number, baseDistance: number) {
  const { getAdaptiveMagneticProps, deviceInfo } = useDeviceAdaptation();

  const adaptiveProps = getAdaptiveMagneticProps(baseStrength, baseDistance);

  // For touch devices, we might want to use different interaction patterns
  const touchProps = deviceInfo?.isTouchDevice
    ? {
        ...adaptiveProps,
        // Add touch-specific enhancements
        tapStrength: adaptiveProps.strength * 1.5, // Stronger effect on tap
        tapDuration: 200, // Quick tap feedback
      }
    : adaptiveProps;

  return {
    ...touchProps,
    isAdaptive: true,
    deviceType: deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop',
  };
}

// Component for displaying device adaptation info (development only)
export function DeviceAdaptationMonitor(_props: { enabled?: boolean }) {
  // Temporarily return null to fix build - component disabled due to className corruption issues
  return null;
}
