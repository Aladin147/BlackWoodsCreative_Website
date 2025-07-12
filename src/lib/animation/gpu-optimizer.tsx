/**
 * GPU Acceleration Optimizer for Enhanced Animation Performance
 * Provides intelligent GPU layer management and hardware acceleration
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface GPULayerConfig {
  enableCompositing: boolean;
  enableWillChange: boolean;
  enableTransform3D: boolean;
  enableBackfaceVisibility: boolean;
  enablePerspective: boolean;
}

const defaultGPUConfig: GPULayerConfig = {
  enableCompositing: true,
  enableWillChange: true,
  enableTransform3D: true,
  enableBackfaceVisibility: true,
  enablePerspective: false,
};

// GPU capability detection
class GPUCapabilityDetector {
  private static instance: GPUCapabilityDetector;
  private capabilities: {
    hasHardwareAcceleration: boolean;
    maxTextureSize: number;
    supportsWebGL: boolean;
    supportsWebGL2: boolean;
    gpuTier: 'low' | 'medium' | 'high';
  } | null = null;

  static getInstance(): GPUCapabilityDetector {
    if (!GPUCapabilityDetector.instance) {
      GPUCapabilityDetector.instance = new GPUCapabilityDetector();
    }
    return GPUCapabilityDetector.instance;
  }

  detectCapabilities() {
    if (this.capabilities) return this.capabilities;

    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    const gl2 = canvas.getContext('webgl2');

    const supportsWebGL = !!gl;
    const supportsWebGL2 = !!gl2;

    let maxTextureSize = 0;
    let hasHardwareAcceleration = false;

    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

      // Check for hardware acceleration
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        hasHardwareAcceleration =
          !renderer.includes('SwiftShader') && !renderer.includes('Software');
      }
    }

    // Determine GPU tier based on capabilities
    let gpuTier: 'low' | 'medium' | 'high' = 'low';
    if (supportsWebGL2 && hasHardwareAcceleration && maxTextureSize >= 4096) {
      gpuTier = 'high';
    } else if (supportsWebGL && hasHardwareAcceleration && maxTextureSize >= 2048) {
      gpuTier = 'medium';
    }

    this.capabilities = {
      hasHardwareAcceleration,
      maxTextureSize,
      supportsWebGL,
      supportsWebGL2,
      gpuTier,
    };

    return this.capabilities;
  }

  getCapabilities() {
    return this.capabilities;
  }
}

// GPU layer manager
class GPULayerManager {
  private static instance: GPULayerManager;
  private activeLayers: Set<HTMLElement> = new Set();
  private layerConfig: GPULayerConfig = defaultGPUConfig;
  private maxLayers = 20; // Limit concurrent GPU layers

  static getInstance(): GPULayerManager {
    if (!GPULayerManager.instance) {
      GPULayerManager.instance = new GPULayerManager();
    }
    return GPULayerManager.instance;
  }

  setConfig(config: Partial<GPULayerConfig>) {
    this.layerConfig = { ...this.layerConfig, ...config };
  }

  enableGPULayer(element: HTMLElement, priority = 5): boolean {
    // Check if we've reached the maximum number of GPU layers
    if (this.activeLayers.size >= this.maxLayers && priority < 7) {
      return false;
    }

    // Remove lowest priority layer if at capacity
    if (this.activeLayers.size >= this.maxLayers) {
      this.removeLowestPriorityLayer();
    }

    this.activeLayers.add(element);
    this.applyGPUOptimizations(element);

    // Store priority as data attribute for later reference
    element.dataset.gpuPriority = priority.toString();

    return true;
  }

  disableGPULayer(element: HTMLElement) {
    this.activeLayers.delete(element);
    this.removeGPUOptimizations(element);
    delete element.dataset.gpuPriority;
  }

  private removeLowestPriorityLayer() {
    let lowestPriority = Infinity;
    let lowestElement: HTMLElement | null = null;

    this.activeLayers.forEach(element => {
      const priority = parseInt(element.dataset.gpuPriority ?? '5', 10);
      if (priority < lowestPriority) {
        lowestPriority = priority;
        lowestElement = element;
      }
    });

    if (lowestElement) {
      this.disableGPULayer(lowestElement);
    }
  }

  private applyGPUOptimizations(element: HTMLElement) {
    const { style } = element;

    if (this.layerConfig.enableTransform3D) {
      // Force GPU layer creation
      style.transform = style.transform ?? 'translateZ(0)';
    }

    if (this.layerConfig.enableWillChange) {
      style.willChange = 'transform, opacity';
    }

    if (this.layerConfig.enableBackfaceVisibility) {
      style.backfaceVisibility = 'hidden';
    }

    if (this.layerConfig.enableCompositing) {
      // Enable hardware compositing
      style.isolation = 'isolate';
    }

    if (this.layerConfig.enablePerspective) {
      style.perspective = '1000px';
    }

    // Additional optimizations - vendor-specific CSS properties
    (style as CSSStyleDeclaration & {
      webkitFontSmoothing?: string;
      mozOsxFontSmoothing?: string;
    }).webkitFontSmoothing = 'antialiased';
    (style as CSSStyleDeclaration & {
      webkitFontSmoothing?: string;
      mozOsxFontSmoothing?: string;
    }).mozOsxFontSmoothing = 'grayscale';
  }

  private removeGPUOptimizations(element: HTMLElement) {
    const { style } = element;

    // Reset will-change
    style.willChange = 'auto';

    // Remove transform if it was only translateZ(0)
    if (style.transform === 'translateZ(0)') {
      style.transform = '';
    }

    // Reset other properties
    style.backfaceVisibility = '';
    style.isolation = '';
    style.perspective = '';
    (style as CSSStyleDeclaration & {
      webkitFontSmoothing?: string;
      mozOsxFontSmoothing?: string;
    }).webkitFontSmoothing = '';
    (style as CSSStyleDeclaration & {
      webkitFontSmoothing?: string;
      mozOsxFontSmoothing?: string;
    }).mozOsxFontSmoothing = '';
  }

  getActiveLayerCount(): number {
    return this.activeLayers.size;
  }
}

// Hook for GPU-optimized animations
export function useGPUOptimization(priority = 5, config?: Partial<GPULayerConfig>) {
  const elementRef = useRef<HTMLElement>(null);
  const gpuManager = GPULayerManager.getInstance();

  useEffect(() => {
    if (config) {
      gpuManager.setConfig(config);
    }
  }, [config, gpuManager]);

  const enableGPU = useCallback(() => {
    if (elementRef.current) {
      return gpuManager.enableGPULayer(elementRef.current, priority);
    }
    return false;
  }, [gpuManager, priority]);

  const disableGPU = useCallback(() => {
    if (elementRef.current) {
      gpuManager.disableGPULayer(elementRef.current);
    }
  }, [gpuManager]);

  useEffect(() => {
    const enabled = enableGPU();

    return () => {
      if (enabled) {
        disableGPU();
      }
    };
  }, [enableGPU, disableGPU]);

  return {
    ref: elementRef,
    enableGPU,
    disableGPU,
    activeLayerCount: gpuManager.getActiveLayerCount(),
  };
}

// GPU-optimized motion component
interface GPUMotionProps {
  children: React.ReactNode;
  priority?: number;
  config?: Partial<GPULayerConfig>;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export function GPUMotion({
  children,
  priority = 5,
  config,
  className = '',
  style = {},
  ...props
}: GPUMotionProps) {
  const { ref: gpuRef } = useGPUOptimization(priority, config);
  const combinedRef = React.useRef<HTMLDivElement>(null);

  // Combine refs using callback pattern
  const setRefs = React.useCallback((node: HTMLDivElement | null) => {
    // Use Object.defineProperty to bypass readonly restriction
    Object.defineProperty(combinedRef, 'current', {
      value: node,
      writable: true,
      configurable: true
    });

    // Set the GPU ref if it exists and has a current property
    if (gpuRef && typeof gpuRef === 'object' && 'current' in gpuRef) {
      Object.defineProperty(gpuRef, 'current', {
        value: node,
        writable: true,
        configurable: true
      });
    }
  }, [gpuRef]);

  const enhancedStyle = {
    ...style,
    // Ensure transform context exists for GPU acceleration
    transform: style.transform ?? 'translateZ(0)',
  };

  return (
    <div ref={setRefs} className={className} style={enhancedStyle} {...props}>
      {children}
    </div>
  );
}

// Hook to detect GPU capabilities
export function useGPUCapabilities() {
  const [capabilities, setCapabilities] = React.useState<{
    hasHardwareAcceleration: boolean;
    maxTextureSize: number;
    supportsWebGL: boolean;
    supportsWebGL2: boolean;
    gpuTier: 'low' | 'medium' | 'high';
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const detector = GPUCapabilityDetector.getInstance();

    const caps = detector.detectCapabilities();
    if (caps) {
      setCapabilities(caps);
      setIsLoading(false);
    }
  }, []);

  return { capabilities, isLoading };
}

// Performance-aware GPU layer hook
export function useAdaptiveGPULayer(baseConfig: Partial<GPULayerConfig> = {}) {
  const { capabilities } = useGPUCapabilities();
  const [adaptedConfig, setAdaptedConfig] = React.useState<GPULayerConfig>(defaultGPUConfig);

  React.useEffect(() => {
    if (!capabilities) return;

    let config = { ...defaultGPUConfig, ...baseConfig };

    // Adapt configuration based on GPU capabilities
    if (capabilities.gpuTier === 'low') {
      config = {
        ...config,
        enableCompositing: false,
        enablePerspective: false,
        enableWillChange: false,
      };
    } else if (capabilities.gpuTier === 'medium') {
      config = {
        ...config,
        enablePerspective: false,
      };
    }

    // Disable GPU optimizations if no hardware acceleration
    if (!capabilities.hasHardwareAcceleration) {
      config = {
        enableCompositing: false,
        enableWillChange: false,
        enableTransform3D: false,
        enableBackfaceVisibility: false,
        enablePerspective: false,
      };
    }

    setAdaptedConfig(config);
  }, [capabilities, baseConfig]);

  return adaptedConfig;
}

// Export GPU manager instance for direct access
export const gpuLayerManager = GPULayerManager.getInstance();
export const gpuCapabilityDetector = GPUCapabilityDetector.getInstance();
