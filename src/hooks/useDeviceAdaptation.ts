'use client';

import { useState, useEffect } from 'react';

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
  magneticDistance: 60,   // Smaller distance for touch
  animationDuration: 0.3, // Faster animations
  enableParallax: false,  // Disabled for performance
  enableMagnetic: true,   // Keep but reduced
  enableComplexAnimations: false
};

const defaultTabletConfig: AdaptiveConfig = {
  magneticStrength: 0.15,
  magneticDistance: 80,
  animationDuration: 0.4,
  enableParallax: true,
  enableMagnetic: true,
  enableComplexAnimations: true
};

const defaultDesktopConfig: AdaptiveConfig = {
  magneticStrength: 0.25,
  magneticDistance: 120,
  animationDuration: 0.6,
  enableParallax: true,
  enableMagnetic: true,
  enableComplexAnimations: true
};

export function useDeviceAdaptation() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    screenSize: 'lg',
    orientation: 'landscape',
    pixelRatio: 1,
    hasHover: true,
    prefersReducedMotion: false
  });

  const [adaptiveConfig, setAdaptiveConfig] = useState<AdaptiveConfig>(defaultDesktopConfig);

  const detectDevice = () => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const userAgent = navigator.userAgent;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const pixelRatio = window.devicePixelRatio || 1;

    // Screen size detection
    let screenSize: DeviceInfo['screenSize'] = 'sm';
    if (width >= 1536) screenSize = '2xl';
    else if (width >= 1280) screenSize = 'xl';
    else if (width >= 1024) screenSize = 'lg';
    else if (width >= 768) screenSize = 'md';

    // Device type detection
    const isMobile = width < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = width >= 768 && width < 1024 && isTouchDevice;
    const isDesktop = width >= 1024 && !isTouchDevice;

    // Orientation detection
    const orientation = height > width ? 'portrait' : 'landscape';

    // Hover capability detection
    const hasHover = window.matchMedia('(hover: hover)').matches;

    // Motion preference detection
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const newDeviceInfo: DeviceInfo = {
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice,
      screenSize,
      orientation,
      pixelRatio,
      hasHover,
      prefersReducedMotion
    };

    setDeviceInfo(newDeviceInfo);

    // Set adaptive config based on device
    let config = defaultDesktopConfig;
    if (isMobile) {
      config = defaultMobileConfig;
    } else if (isTablet) {
      config = defaultTabletConfig;
    }

    // Apply motion preferences
    if (prefersReducedMotion) {
      config = {
        ...config,
        magneticStrength: config.magneticStrength * 0.5,
        animationDuration: config.animationDuration * 0.5,
        enableParallax: false,
        enableComplexAnimations: false
      };
    }

    setAdaptiveConfig(config);
  };

  useEffect(() => {
    detectDevice();
    
    const handleResize = () => detectDevice();
    const handleOrientationChange = () => setTimeout(detectDevice, 100);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const getAdaptiveMagneticProps = (baseStrength: number, baseDistance: number) => {
    if (!adaptiveConfig.enableMagnetic) {
      return { strength: 0, distance: 0 };
    }

    return {
      strength: baseStrength * (adaptiveConfig.magneticStrength / 0.25), // Normalize to desktop baseline
      distance: baseDistance * (adaptiveConfig.magneticDistance / 120)   // Normalize to desktop baseline
    };
  };

  const getAdaptiveAnimationProps = (baseDuration: number) => {
    return {
      duration: baseDuration * (adaptiveConfig.animationDuration / 0.6), // Normalize to desktop baseline
      ease: deviceInfo.isMobile ? 'easeOut' : [0.25, 0.46, 0.45, 0.94]
    };
  };

  const shouldEnableFeature = (feature: keyof AdaptiveConfig) => {
    return adaptiveConfig[feature];
  };

  return {
    deviceInfo,
    adaptiveConfig,
    getAdaptiveMagneticProps,
    getAdaptiveAnimationProps,
    shouldEnableFeature
  };
}

// Hook for components to get device-adaptive magnetic field props
export function useAdaptiveMagnetic(baseStrength: number, baseDistance: number) {
  const { getAdaptiveMagneticProps, deviceInfo } = useDeviceAdaptation();
  
  const adaptiveProps = getAdaptiveMagneticProps(baseStrength, baseDistance);
  
  // For touch devices, we might want to use different interaction patterns
  const touchProps = deviceInfo.isTouchDevice ? {
    ...adaptiveProps,
    // Add touch-specific enhancements
    tapStrength: adaptiveProps.strength * 1.5, // Stronger effect on tap
    tapDuration: 200 // Quick tap feedback
  } : adaptiveProps;

  return {
    ...touchProps,
    isAdaptive: true,
    deviceType: deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop'
  };
}

// Component for displaying device adaptation info (development only)
export function DeviceAdaptationMonitor({ 
  enabled = process.env.NODE_ENV === 'development' 
}: { 
  enabled?: boolean;
}) {
  const { deviceInfo, adaptiveConfig } = useDeviceAdaptation();

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-bw-bg-primary/90 backdrop-blur-sm border border-bw-border-subtle rounded-lg p-3 text-xs font-mono">
      <div className="space-y-1">
        <div className="font-semibold text-bw-accent-gold">Device Adaptation</div>
        <div className="text-bw-text-secondary">
          Type: <span className="text-bw-text-primary">
            {deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}
          </span>
        </div>
        <div className="text-bw-text-secondary">
          Screen: <span className="text-bw-text-primary">{deviceInfo.screenSize}</span>
        </div>
        <div className="text-bw-text-secondary">
          Touch: <span className="text-bw-text-primary">{deviceInfo.isTouchDevice ? 'Yes' : 'No'}</span>
        </div>
        <div className="text-bw-text-secondary">
          Hover: <span className="text-bw-text-primary">{deviceInfo.hasHover ? 'Yes' : 'No'}</span>
        </div>
        <div className="text-bw-text-secondary">
          Magnetic: <span className="text-bw-text-primary">{adaptiveConfig.magneticStrength.toFixed(2)}</span>
        </div>
        <div className="text-bw-text-secondary">
          Distance: <span className="text-bw-text-primary">{adaptiveConfig.magneticDistance}px</span>
        </div>
        {deviceInfo.prefersReducedMotion && (
          <div className="text-yellow-400">Reduced Motion</div>
        )}
      </div>
    </div>
  );
}
