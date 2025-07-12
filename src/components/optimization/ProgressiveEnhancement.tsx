'use client';

import { ReactNode, ReactElement, useEffect, useState } from 'react';

import { useDeviceAdaptation } from '@/hooks/useDeviceAdaptation';
import { OptimizationProfile } from '@/lib/utils/device-capabilities';

interface ProgressiveEnhancementProps {
  children: ReactNode;
  fallback?: ReactNode;
  feature: 'webgl' | 'animations' | 'particles' | 'parallax' | 'magnetic' | 'complex-animations';
  minPerformance?: 'low' | 'medium' | 'high';
  className?: string;
}

interface ConditionalRenderProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

// Progressive enhancement wrapper component
export function ProgressiveEnhancement({
  children,
  fallback = null,
  feature,
  minPerformance = 'low',
  className = '',
}: ProgressiveEnhancementProps) {
  const { deviceInfo } = useDeviceAdaptation();
  const [shouldRender, setShouldRender] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFeatureSupport = () => {
      if (!deviceInfo.capabilities || !deviceInfo.optimizationProfile) {
        // Fallback to basic device detection
        setShouldRender(getBasicFeatureSupport(feature, deviceInfo));
        setIsLoading(false);
        return;
      }

      const { capabilities, optimizationProfile } = deviceInfo;

      // Check performance requirements
      const performanceLevels = { low: 0, medium: 1, high: 2 } as const;
      const requiredLevel = performanceLevels[minPerformance] ?? performanceLevels.low;
      const deviceLevel = performanceLevels[capabilities.performance.overall] ?? performanceLevels.low;

      if (deviceLevel < requiredLevel) {
        setShouldRender(false);
        setIsLoading(false);
        return;
      }

      // Check feature-specific support
      const featureSupported = checkAdvancedFeatureSupport(
        feature,
        capabilities,
        optimizationProfile
      );
      setShouldRender(featureSupported);
      setIsLoading(false);
    };

    checkFeatureSupport();
  }, [deviceInfo, feature, minPerformance]);

  if (isLoading) {
    return (
      <div className={`progressive-enhancement-loading ${className}`}>
        {fallback ?? <div className="h-4 w-full animate-pulse rounded bg-gray-200" />}
      </div>
    );
  }

  return (
    <ConditionalRender condition={shouldRender} fallback={fallback}>
      {children}
    </ConditionalRender>
  );
}

// Conditional rendering component
function ConditionalRender({ condition, children, fallback }: ConditionalRenderProps): ReactElement {
  if (!condition) {
    return (fallback as ReactElement) ?? <div />;
  }
  return children as ReactElement;
}

// Feature support detection functions
function getBasicFeatureSupport(
  feature: string,
  deviceInfo: { isMobile: boolean; hasHover: boolean; prefersReducedMotion: boolean }
): boolean {
  switch (feature) {
    case 'webgl':
      return !deviceInfo.isMobile && deviceInfo.hasHover;
    case 'animations':
      return !deviceInfo.prefersReducedMotion;
    case 'particles':
      return !deviceInfo.isMobile && !deviceInfo.prefersReducedMotion;
    case 'parallax':
      return !deviceInfo.isMobile && deviceInfo.hasHover && !deviceInfo.prefersReducedMotion;
    case 'magnetic':
      return deviceInfo.hasHover && !deviceInfo.prefersReducedMotion;
    case 'complex-animations':
      return !deviceInfo.isMobile && !deviceInfo.prefersReducedMotion;
    default:
      return true;
  }
}

function checkAdvancedFeatureSupport(
  feature: string,
  capabilities: { features: { webgl: boolean } },
  profile: OptimizationProfile
): boolean {
  switch (feature) {
    case 'webgl':
      return profile.rendering.webgl && capabilities.features.webgl;
    case 'animations':
      return profile.animations.enabled;
    case 'particles':
      return profile.animations.particles && profile.rendering.particleCount > 0;
    case 'parallax':
      return profile.animations.parallax;
    case 'magnetic':
      return profile.animations.magnetic;
    case 'complex-animations':
      return (
        profile.animations.complexity === 'enhanced' || profile.animations.complexity === 'full'
      );
    default:
      return true;
  }
}

// Specialized progressive enhancement components
export function WebGLEnhancement({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProgressiveEnhancement feature="webgl" minPerformance="medium" fallback={fallback}>
      {children}
    </ProgressiveEnhancement>
  );
}

export function AnimationEnhancement({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProgressiveEnhancement feature="animations" fallback={fallback}>
      {children}
    </ProgressiveEnhancement>
  );
}

export function ParticleEnhancement({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProgressiveEnhancement feature="particles" minPerformance="medium" fallback={fallback}>
      {children}
    </ProgressiveEnhancement>
  );
}

export function ParallaxEnhancement({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProgressiveEnhancement feature="parallax" fallback={fallback}>
      {children}
    </ProgressiveEnhancement>
  );
}

export function MagneticEnhancement({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProgressiveEnhancement feature="magnetic" fallback={fallback}>
      {children}
    </ProgressiveEnhancement>
  );
}

export function ComplexAnimationEnhancement({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProgressiveEnhancement
      feature="complex-animations"
      minPerformance="medium"
      fallback={fallback}
    >
      {children}
    </ProgressiveEnhancement>
  );
}

// Performance-aware image component
interface AdaptiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function AdaptiveImage({
  src,
  alt,
  className,
  width,
  height,
  priority,
}: AdaptiveImageProps) {
  const { deviceInfo } = useDeviceAdaptation();
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    if (!deviceInfo.optimizationProfile) {
      setImageSrc(src);
      return;
    }

    const { loading } = deviceInfo.optimizationProfile;

    // Adjust image quality based on device capabilities
    if (loading.imageQuality === 'low') {
      // Add quality parameter for low-quality images
      const url = new URL(src, window.location.origin);
      url.searchParams.set('q', '60');
      url.searchParams.set('w', Math.min(width ?? 800, 800).toString());
      setImageSrc(url.toString());
    } else if (loading.imageQuality === 'medium') {
      const url = new URL(src, window.location.origin);
      url.searchParams.set('q', '80');
      setImageSrc(url.toString());
    } else {
      setImageSrc(src);
    }
  }, [src, deviceInfo.optimizationProfile, width]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

// Performance-aware video component
interface AdaptiveVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function AdaptiveVideo({
  src,
  poster,
  className,
  autoPlay,
  muted,
  loop,
}: AdaptiveVideoProps) {
  const { deviceInfo } = useDeviceAdaptation();
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  useEffect(() => {
    if (!deviceInfo.capabilities) {
      setShouldAutoPlay(autoPlay ?? false);
      return;
    }

    const { network, preferences } = deviceInfo.capabilities;

    // Disable autoplay on slow connections or when data saving is preferred
    if (network.saveData || network.effectiveType === '2g' || network.effectiveType === '3g') {
      setShouldAutoPlay(false);
    } else if (preferences.reducedMotion) {
      setShouldAutoPlay(false);
    } else {
      setShouldAutoPlay(autoPlay ?? false);
    }
  }, [deviceInfo.capabilities, autoPlay]);

  return (
    <video
      src={src}
      poster={poster}
      className={className}
      autoPlay={shouldAutoPlay}
      muted={muted}
      loop={loop}
      playsInline
      preload={deviceInfo.capabilities?.network.saveData ? 'none' : 'metadata'}
    >
      <track kind="captions" srcLang="en" label="English captions" />
    </video>
  );
}

// Device capability context for debugging
export function DeviceCapabilityDebugger() {
  const { deviceInfo } = useDeviceAdaptation();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-black/80 p-4 text-xs text-white">
      <h3 className="mb-2 font-bold">Device Capabilities</h3>
      <div className="space-y-1">
        <div>
          Type: {deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}
        </div>
        <div>Screen: {deviceInfo.screenSize}</div>
        <div>Performance: {deviceInfo.capabilities?.performance.overall ?? 'Unknown'}</div>
        <div>WebGL: {deviceInfo.capabilities?.features.webgl ? 'Yes' : 'No'}</div>
        <div>Reduced Motion: {deviceInfo.prefersReducedMotion ? 'Yes' : 'No'}</div>
        {deviceInfo.optimizationProfile && (
          <div>
            <div>Animation Complexity: {deviceInfo.optimizationProfile.animations.complexity}</div>
            <div>Particles: {deviceInfo.optimizationProfile.rendering.particleCount}</div>
          </div>
        )}
      </div>
    </div>
  );
}
