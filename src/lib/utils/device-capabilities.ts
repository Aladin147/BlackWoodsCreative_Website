// Advanced device capability detection and optimization system
export interface DeviceCapabilities {
  // Hardware capabilities
  cpu: {
    cores: number;
    architecture: string;
    performance: 'low' | 'medium' | 'high';
  };
  gpu: {
    vendor: string;
    renderer: string;
    webglSupported: boolean;
    webgl2Supported: boolean;
    maxTextureSize: number;
    performance: 'low' | 'medium' | 'high';
  };
  memory: {
    deviceMemory: number; // GB
    jsHeapSizeLimit: number; // bytes
    performance: 'low' | 'medium' | 'high';
  };
  network: {
    effectiveType: '2g' | '3g' | '4g' | 'unknown';
    downlink: number; // Mbps
    rtt: number; // ms
    saveData: boolean;
  };
  display: {
    width: number;
    height: number;
    pixelRatio: number;
    colorDepth: number;
    refreshRate: number;
    hdr: boolean;
  };
  // Feature support
  features: {
    webgl: boolean;
    webgl2: boolean;
    webassembly: boolean;
    serviceWorker: boolean;
    intersectionObserver: boolean;
    resizeObserver: boolean;
    performanceObserver: boolean;
    webAnimations: boolean;
    cssCustomProperties: boolean;
    cssGrid: boolean;
    cssFlexbox: boolean;
  };
  // Performance characteristics
  performance: {
    overall: 'low' | 'medium' | 'high';
    graphics: 'low' | 'medium' | 'high';
    computation: 'low' | 'medium' | 'high';
    memory: 'low' | 'medium' | 'high';
  };
  // User preferences
  preferences: {
    reducedMotion: boolean;
    reducedData: boolean;
    highContrast: boolean;
    darkMode: boolean;
  };
}

export interface OptimizationProfile {
  // Animation settings
  animations: {
    enabled: boolean;
    complexity: 'minimal' | 'basic' | 'enhanced' | 'full';
    duration: number;
    easing: string;
    parallax: boolean;
    magnetic: boolean;
    particles: boolean;
  };
  // Rendering settings
  rendering: {
    webgl: boolean;
    particleCount: number;
    textureQuality: 'low' | 'medium' | 'high';
    shadowQuality: 'none' | 'low' | 'medium' | 'high';
    antialiasing: boolean;
  };
  // Loading strategies
  loading: {
    imageQuality: 'low' | 'medium' | 'high';
    lazyLoading: boolean;
    preloading: boolean;
    bundleSplitting: boolean;
  };
  // Network optimizations
  network: {
    compression: boolean;
    caching: boolean;
    prefetch: boolean;
    serviceWorker: boolean;
  };
}

class DeviceCapabilityDetector {
  private static instance: DeviceCapabilityDetector;
  private capabilities: DeviceCapabilities | null = null;
  private profile: OptimizationProfile | null = null;

  static getInstance(): DeviceCapabilityDetector {
    if (!DeviceCapabilityDetector.instance) {
      DeviceCapabilityDetector.instance = new DeviceCapabilityDetector();
    }
    return DeviceCapabilityDetector.instance;
  }

  async detectCapabilities(): Promise<DeviceCapabilities> {
    if (this.capabilities) {
      return this.capabilities;
    }

    if (typeof window === 'undefined') {
      return this.getServerSideDefaults();
    }

    const capabilities: DeviceCapabilities = {
      cpu: await this.detectCPU(),
      gpu: await this.detectGPU(),
      memory: this.detectMemory(),
      network: this.detectNetwork(),
      display: this.detectDisplay(),
      features: this.detectFeatures(),
      performance: { overall: 'medium', graphics: 'medium', computation: 'medium', memory: 'medium' },
      preferences: this.detectPreferences(),
    };

    // Calculate overall performance scores
    capabilities.performance = this.calculatePerformanceScores(capabilities);

    this.capabilities = capabilities;
    return capabilities;
  }

  private async detectCPU() {
    const cores = navigator.hardwareConcurrency || 4;

    // Estimate CPU performance based on cores and user agent
    let cpuPerformance: 'low' | 'medium' | 'high' = 'medium';
    if (cores <= 2) cpuPerformance = 'low';
    else if (cores >= 8) cpuPerformance = 'high';

    // Simple CPU benchmark
    const startTime = performance.now();
    let benchmarkResult = 0;
    for (let i = 0; i < 100000; i++) {
      benchmarkResult += Math.sqrt(i);
    }
    const benchmarkTime = performance.now() - startTime;

    // Use the result to prevent optimization
    if (benchmarkResult < 0) console.log('Benchmark result:', benchmarkResult);

    if (benchmarkTime > 50) cpuPerformance = 'low';
    else if (benchmarkTime < 20) cpuPerformance = 'high';

    return {
      cores,
      architecture: this.detectArchitecture(),
      performance: cpuPerformance,
    };
  }

  private async detectGPU() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    const gl2 = canvas.getContext('webgl2');

    if (!gl) {
      return {
        vendor: 'unknown',
        renderer: 'unknown',
        webglSupported: false,
        webgl2Supported: false,
        maxTextureSize: 0,
        performance: 'low' as const,
      };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info') as {
      UNMASKED_VENDOR_WEBGL: number;
      UNMASKED_RENDERER_WEBGL: number;
    } | null;
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    // Estimate GPU performance based on renderer
    let gpuPerformance: 'low' | 'medium' | 'high' = 'medium';
    const rendererStr = renderer.toLowerCase();

    if (rendererStr.includes('intel') && rendererStr.includes('hd')) {
      gpuPerformance = 'low';
    } else if (rendererStr.includes('nvidia') || rendererStr.includes('amd') || rendererStr.includes('radeon')) {
      gpuPerformance = 'high';
    }

    return {
      vendor,
      renderer,
      webglSupported: true,
      webgl2Supported: !!gl2,
      maxTextureSize,
      performance: gpuPerformance,
    };
  }

  private detectMemory() {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const perf = performance as Performance & { memory?: { jsHeapSizeLimit: number } };
    
    const deviceMemory = nav.deviceMemory || 4; // Default to 4GB
    const jsHeapSizeLimit = perf.memory?.jsHeapSizeLimit || 2147483648; // 2GB default

    let memoryPerformance: 'low' | 'medium' | 'high' = 'medium';
    if (deviceMemory <= 2) memoryPerformance = 'low';
    else if (deviceMemory >= 8) memoryPerformance = 'high';

    return {
      deviceMemory,
      jsHeapSizeLimit,
      performance: memoryPerformance,
    };
  }

  private detectNetwork() {
    const nav = navigator as Navigator & {
      connection?: {
        effectiveType: '2g' | '3g' | '4g' | 'unknown';
        downlink: number;
        rtt: number;
        saveData: boolean;
      };
      mozConnection?: {
        effectiveType: '2g' | '3g' | '4g' | 'unknown';
        downlink: number;
        rtt: number;
        saveData: boolean;
      };
      webkitConnection?: {
        effectiveType: '2g' | '3g' | '4g' | 'unknown';
        downlink: number;
        rtt: number;
        saveData: boolean;
      };
    };
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    return {
      effectiveType: connection?.effectiveType || '4g',
      downlink: connection?.downlink || 10,
      rtt: connection?.rtt || 100,
      saveData: connection?.saveData || false,
    };
  }

  private detectDisplay() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      colorDepth: screen.colorDepth || 24,
      refreshRate: 60, // Default, hard to detect accurately
      hdr: window.matchMedia('(dynamic-range: high)').matches,
    };
  }

  private detectFeatures() {
    return {
      webgl: !!document.createElement('canvas').getContext('webgl'),
      webgl2: !!document.createElement('canvas').getContext('webgl2'),
      webassembly: typeof WebAssembly !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator,
      intersectionObserver: 'IntersectionObserver' in window,
      resizeObserver: 'ResizeObserver' in window,
      performanceObserver: 'PerformanceObserver' in window,
      webAnimations: 'animate' in document.createElement('div'),
      cssCustomProperties: CSS.supports('color', 'var(--test)'),
      cssGrid: CSS.supports('display', 'grid'),
      cssFlexbox: CSS.supports('display', 'flex'),
    };
  }

  private detectPreferences() {
    return {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      reducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    };
  }

  private detectArchitecture(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('ARM') || userAgent.includes('arm')) return 'ARM';
    if (userAgent.includes('x86_64') || userAgent.includes('x64')) return 'x64';
    if (userAgent.includes('x86')) return 'x86';
    return 'unknown';
  }

  private calculatePerformanceScores(capabilities: DeviceCapabilities) {
    // Calculate graphics performance
    let graphics: 'low' | 'medium' | 'high' = 'low';
    if (capabilities.gpu.webglSupported && capabilities.gpu.performance === 'high') {
      graphics = 'high';
    } else if (capabilities.gpu.webglSupported) {
      graphics = 'medium';
    }

    // Calculate computation performance
    const computation = capabilities.cpu.performance;

    // Calculate memory performance
    const memory = capabilities.memory.performance;

    // Calculate overall performance
    const scores = [graphics, computation, memory];
    const highCount = scores.filter(s => s === 'high').length;
    const lowCount = scores.filter(s => s === 'low').length;

    let overall: 'low' | 'medium' | 'high' = 'medium';
    if (lowCount >= 2) overall = 'low';
    else if (highCount >= 2) overall = 'high';

    return { overall, graphics, computation, memory };
  }

  private getServerSideDefaults(): DeviceCapabilities {
    return {
      cpu: { cores: 4, architecture: 'unknown', performance: 'medium' },
      gpu: { vendor: 'unknown', renderer: 'unknown', webglSupported: false, webgl2Supported: false, maxTextureSize: 0, performance: 'medium' },
      memory: { deviceMemory: 4, jsHeapSizeLimit: 2147483648, performance: 'medium' },
      network: { effectiveType: '4g', downlink: 10, rtt: 100, saveData: false },
      display: { width: 1920, height: 1080, pixelRatio: 1, colorDepth: 24, refreshRate: 60, hdr: false },
      features: { webgl: false, webgl2: false, webassembly: false, serviceWorker: false, intersectionObserver: false, resizeObserver: false, performanceObserver: false, webAnimations: false, cssCustomProperties: false, cssGrid: false, cssFlexbox: false },
      performance: { overall: 'medium', graphics: 'medium', computation: 'medium', memory: 'medium' },
      preferences: { reducedMotion: false, reducedData: false, highContrast: false, darkMode: false },
    };
  }

  generateOptimizationProfile(capabilities: DeviceCapabilities): OptimizationProfile {
    if (this.profile) {
      return this.profile;
    }

    const profile: OptimizationProfile = {
      animations: this.getAnimationSettings(capabilities),
      rendering: this.getRenderingSettings(capabilities),
      loading: this.getLoadingSettings(capabilities),
      network: this.getNetworkSettings(capabilities),
    };

    this.profile = profile;
    return profile;
  }

  private getAnimationSettings(capabilities: DeviceCapabilities) {
    const { performance, preferences } = capabilities;
    
    if (preferences.reducedMotion) {
      return {
        enabled: false,
        complexity: 'minimal' as const,
        duration: 0.1,
        easing: 'linear',
        parallax: false,
        magnetic: false,
        particles: false,
      };
    }

    if (performance.overall === 'low') {
      return {
        enabled: true,
        complexity: 'basic' as const,
        duration: 0.3,
        easing: 'ease-out',
        parallax: false,
        magnetic: false,
        particles: false,
      };
    }

    if (performance.overall === 'high') {
      return {
        enabled: true,
        complexity: 'full' as const,
        duration: 0.6,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        parallax: true,
        magnetic: true,
        particles: true,
      };
    }

    return {
      enabled: true,
      complexity: 'enhanced' as const,
      duration: 0.4,
      easing: 'ease-in-out',
      parallax: true,
      magnetic: true,
      particles: false,
    };
  }

  private getRenderingSettings(capabilities: DeviceCapabilities) {
    const { gpu, performance } = capabilities;

    const shadowQuality: 'none' | 'low' | 'medium' | 'high' =
      performance.graphics === 'high' ? 'high' :
      performance.graphics === 'medium' ? 'medium' : 'none';

    return {
      webgl: gpu.webglSupported && performance.graphics !== 'low',
      particleCount: performance.overall === 'high' ? 100 : performance.overall === 'medium' ? 50 : 20,
      textureQuality: performance.graphics,
      shadowQuality,
      antialiasing: performance.graphics === 'high',
    };
  }

  private getLoadingSettings(capabilities: DeviceCapabilities) {
    const { network, memory } = capabilities;

    const imageQuality: 'low' | 'medium' | 'high' =
      network.saveData ? 'low' :
      memory.performance === 'high' ? 'high' : 'medium';

    return {
      imageQuality,
      lazyLoading: true,
      preloading: network.effectiveType === '4g' && !network.saveData,
      bundleSplitting: memory.performance !== 'low',
    };
  }

  private getNetworkSettings(capabilities: DeviceCapabilities) {
    const { network } = capabilities;

    return {
      compression: true,
      caching: true,
      prefetch: network.effectiveType === '4g' && !network.saveData,
      serviceWorker: capabilities.features.serviceWorker,
    };
  }
}

// Export singleton instance
export const deviceCapabilityDetector = DeviceCapabilityDetector.getInstance();

// Utility functions
export async function getDeviceCapabilities(): Promise<DeviceCapabilities> {
  return deviceCapabilityDetector.detectCapabilities();
}

export async function getOptimizationProfile(): Promise<OptimizationProfile> {
  const capabilities = await getDeviceCapabilities();
  return deviceCapabilityDetector.generateOptimizationProfile(capabilities);
}
