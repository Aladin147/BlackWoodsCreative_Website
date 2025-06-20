'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';

import { useDeviceAdaptation } from '@/hooks/useDeviceAdaptation';

interface WebGLContextState {
  canvas: HTMLCanvasElement | null;
  gl: WebGLRenderingContext | null;
  isSupported: boolean;
  error: string | null;
}

// WebGL shader sources
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_intensity;
  
  varying vec2 v_texCoord;
  
  // Noise function
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  // Smooth noise
  float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // Aurora effect
  vec3 aurora(vec2 uv) {
    float time = u_time * 0.5;
    
    // Create flowing aurora bands
    float band1 = sin(uv.x * 3.0 + time) * 0.5 + 0.5;
    float band2 = sin(uv.x * 5.0 - time * 1.5) * 0.5 + 0.5;
    float band3 = sin(uv.x * 7.0 + time * 0.8) * 0.5 + 0.5;
    
    // Add noise for organic movement
    float noise1 = smoothNoise(uv * 4.0 + time * 0.3);
    float noise2 = smoothNoise(uv * 8.0 - time * 0.2);
    
    // Combine bands with noise
    float aurora = (band1 + band2 + band3) / 3.0;
    aurora *= noise1 * noise2;
    aurora = pow(aurora, 2.0);
    
    // Aurora colors (teal to green gradient)
    vec3 color1 = vec3(0.2, 0.8, 0.7); // Teal
    vec3 color2 = vec3(0.3, 0.9, 0.4); // Green
    vec3 color3 = vec3(0.8, 0.9, 0.3); // Gold
    
    vec3 finalColor = mix(color1, color2, sin(time + uv.x * 2.0) * 0.5 + 0.5);
    finalColor = mix(finalColor, color3, aurora * 0.3);
    
    return finalColor * aurora * u_intensity;
  }
  
  void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    
    // Create aurora effect
    vec3 color = aurora(uv);
    
    // Add mouse interaction
    float mouseDistance = distance(uv, mouse);
    float mouseEffect = 1.0 - smoothstep(0.0, 0.3, mouseDistance);
    color += mouseEffect * 0.2;
    
    // Add subtle vignette
    float vignette = 1.0 - distance(uv, vec2(0.5)) * 0.8;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function WebGLAuroraEffect({
  className = '',
  intensity = 0.5,
  interactive = true,
}: {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [webglState, setWebglState] = useState<WebGLContextState>({
    canvas: null,
    gl: null,
    isSupported: false,
    error: null,
  });

  const { deviceInfo, shouldEnableFeature } = useDeviceAdaptation();

  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }, []);

  const createProgram = useCallback(
    (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    },
    []
  );

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if WebGL is supported
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl || !(gl instanceof WebGLRenderingContext)) {
      setWebglState(prev => ({
        ...prev,
        error: 'WebGL not supported',
        isSupported: false,
      }));
      return;
    }

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      setWebglState(prev => ({
        ...prev,
        error: 'Failed to create shaders',
        isSupported: false,
      }));
      return;
    }

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      setWebglState(prev => ({
        ...prev,
        error: 'Failed to create program',
        isSupported: false,
      }));
      return;
    }

    // Set up geometry
    const positions = new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const intensityLocation = gl.getUniformLocation(program, 'u_intensity');

    // Set up attributes
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);

    gl.useProgram(program);

    setWebglState({
      canvas,
      gl,
      isSupported: true,
      error: null,
    });

    // Animation loop
    const animate = (time: number) => {
      if (!gl || !canvas) return;

      // Resize canvas if needed
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }

      // Set uniforms
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(intensityLocation, intensity);

      // Draw
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [createShader, createProgram, intensity]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!interactive || !webglState.canvas) return;

      const rect = webglState.canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: rect.height - (e.clientY - rect.top), // Flip Y coordinate
      };
    },
    [interactive, webglState.canvas]
  );

  useEffect(() => {
    // Enhanced device capability checking
    const canUseWebGL = () => {
      if (!shouldEnableFeature('enableComplexAnimations')) return false;

      // Check optimization profile if available
      if (deviceInfo.optimizationProfile) {
        return deviceInfo.optimizationProfile.rendering.webgl;
      }

      // Fallback to basic device detection
      return !deviceInfo.isMobile && deviceInfo.hasHover;
    };

    if (!canUseWebGL()) {
      return; // Skip WebGL based on device capabilities
    }

    initWebGL();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initWebGL, shouldEnableFeature, deviceInfo]);

  useEffect(() => {
    if (interactive && webglState.canvas) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
    return undefined;
  }, [interactive, webglState.canvas, handleMouseMove]);

  // Enhanced fallback for unsupported devices
  const shouldUseFallback = () => {
    if (!shouldEnableFeature('enableComplexAnimations') || !webglState.isSupported) return true;

    // Check optimization profile
    if (deviceInfo.optimizationProfile) {
      return !deviceInfo.optimizationProfile.rendering.webgl;
    }

    // Fallback to basic device detection
    return deviceInfo.isMobile;
  };

  if (shouldUseFallback()) {
    // Adaptive fallback based on device capabilities
    const animationDuration = deviceInfo.optimizationProfile?.animations.duration || 8;
    const shouldAnimate = deviceInfo.optimizationProfile?.animations.enabled !== false;

    return (
      <div className={`absolute inset-0 ${className}`}>
        {/* CSS fallback aurora effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-bw-aurora-teal/20 via-bw-aurora-green/15 to-bw-aurora-bright/10"
          animate={
            shouldAnimate
              ? {
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }
              : {}
          }
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

// Particle system using WebGL
export function WebGLParticleSystem({
  particleCount = 100,
  className = '',
}: {
  particleCount?: number;
  className?: string;
}) {
  const { deviceInfo, shouldEnableFeature } = useDeviceAdaptation();

  // Enhanced particle count adaptation based on device capabilities
  const getAdaptedParticleCount = () => {
    if (deviceInfo.optimizationProfile) {
      return deviceInfo.optimizationProfile.rendering.particleCount;
    }

    // Fallback to basic device detection
    if (deviceInfo.isMobile) return Math.min(particleCount, 30);
    if (deviceInfo.isTablet) return Math.min(particleCount, 60);
    return particleCount;
  };

  const adaptedParticleCount = getAdaptedParticleCount();

  // Enhanced feature checking
  const shouldRender = () => {
    if (!shouldEnableFeature('enableComplexAnimations')) return false;

    if (deviceInfo.optimizationProfile) {
      return deviceInfo.optimizationProfile.animations.particles;
    }

    return !deviceInfo.isMobile;
  };

  if (!shouldRender()) {
    return null;
  }

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* WebGL particle implementation would go here */}
      {/* For now, using CSS fallback */}
      {Array.from({ length: adaptedParticleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-bw-aurora-teal"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// WebGL-enhanced background for sections
export function WebGLEnhancedBackground({
  children,
  effectType = 'aurora',
  intensity = 0.5,
  className = '',
}: {
  children: React.ReactNode;
  effectType?: 'aurora' | 'particles' | 'both';
  intensity?: number;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* WebGL Effects Layer */}
      <div className="absolute inset-0 overflow-hidden">
        {(effectType === 'aurora' || effectType === 'both') && (
          <WebGLAuroraEffect intensity={intensity} />
        )}
        {(effectType === 'particles' || effectType === 'both') && (
          <WebGLParticleSystem particleCount={Math.round(100 * intensity)} />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
