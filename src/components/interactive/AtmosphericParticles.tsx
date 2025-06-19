'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useDeviceAdaptation } from '@/hooks/useDeviceAdaptation';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  life: number;
  maxLife: number;
}

interface AtmosphericParticlesProps {
  count?: number;
  className?: string;
}

export function AtmosphericParticles({ count = 60, className = '' }: AtmosphericParticlesProps) {
  const { deviceInfo } = useDeviceAdaptation();
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  // Adaptive particle count based on device capabilities
  const getAdaptiveParticleCount = useCallback(() => {
    if (deviceInfo.optimizationProfile) {
      return Math.min(count, deviceInfo.optimizationProfile.rendering.particleCount);
    }

    // Fallback to basic device detection
    if (deviceInfo.isMobile) return Math.min(count, 20);
    if (deviceInfo.isTablet) return Math.min(count, 40);
    return count;
  }, [count, deviceInfo.optimizationProfile, deviceInfo.isMobile, deviceInfo.isTablet]);

  // Check if particles should be enabled
  const shouldEnableParticles = useCallback(() => {
    if (deviceInfo.prefersReducedMotion) return false;

    if (deviceInfo.optimizationProfile) {
      return deviceInfo.optimizationProfile.animations.particles;
    }

    return !deviceInfo.isMobile;
  }, [deviceInfo.prefersReducedMotion, deviceInfo.optimizationProfile, deviceInfo.isMobile]);

  useEffect(() => {
    const shouldEnable = shouldEnableParticles();
    const adaptiveCount = getAdaptiveParticleCount();

    if (!containerRef.current || !shouldEnable) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Initialize particles - AUTHENTIC THEME GUIDE SPECIFICATION
    // Small 2px x 2px divs, border-radius: 50%, background-color: $accent-gold, with varying opacities
    particlesRef.current = Array.from({ length: adaptiveCount }, (_, i) => ({
      id: i,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.3, // Slower, more organic movement
      vy: (Math.random() - 0.5) * 0.2, // Slower vertical drift
      opacity: Math.random() * 0.6 + 0.2, // Varying opacities as specified
      size: 2, // Exactly 2px as specified in theme guide
      life: 0,
      maxLife: Math.random() * 500 + 300, // Longer life for subtle effect
    }));

    // Create particle elements - AUTHENTIC THEME GUIDE SPECIFICATION with adaptive performance
    const useGPUAcceleration = deviceInfo.capabilities?.performance.graphics !== 'low';

    particlesRef.current.forEach((particle) => {
      const element = document.createElement('div');
      element.className = 'absolute rounded-full pointer-events-none';

      // Adaptive styling based on device capabilities
      if (useGPUAcceleration) {
        element.style.cssText = `
          width: ${particle.size}px;
          height: ${particle.size}px;
          background-color: var(--bw-accent-gold);
          border-radius: 50%;
          opacity: ${particle.opacity};
          transform: translate3d(${particle.x}px, ${particle.y}px, 0);
          will-change: transform, opacity;
        `;
      } else {
        element.style.cssText = `
          width: ${particle.size}px;
          height: ${particle.size}px;
          background-color: var(--bw-accent-gold);
          border-radius: 50%;
          opacity: ${particle.opacity};
          transform: translate(${particle.x}px, ${particle.y}px);
          transition: opacity 0.5s ease-out;
        `;
      }

      element.setAttribute('data-particle-id', particle.id.toString());
      container.appendChild(element);
    });

    // Animation loop
    const animate = () => {
      const rect = container.getBoundingClientRect();
      
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 1;

        // Boundary wrapping
        if (particle.x < -10) particle.x = rect.width + 10;
        if (particle.x > rect.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = rect.height + 10;
        if (particle.y > rect.height + 10) particle.y = -10;

        // Fade in/out based on life
        const lifeFactor = particle.life / particle.maxLife;
        if (lifeFactor < 0.1) {
          particle.opacity = (lifeFactor / 0.1) * 0.6;
        } else if (lifeFactor > 0.9) {
          particle.opacity = ((1 - lifeFactor) / 0.1) * 0.6;
        }

        // Reset particle when life ends
        if (particle.life >= particle.maxLife) {
          particle.x = Math.random() * rect.width;
          particle.y = Math.random() * rect.height;
          particle.vx = (Math.random() - 0.5) * 0.5;
          particle.vy = (Math.random() - 0.5) * 0.3;
          particle.life = 0;
          particle.maxLife = Math.random() * 300 + 200;
        }

        // Update DOM element with GPU acceleration
        const element = container.querySelector(`[data-particle-id="${particle.id}"]`) as HTMLElement;
        if (element) {
          element.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0)`;
          element.style.opacity = particle.opacity.toString();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Remove particle elements
      container.querySelectorAll('[data-particle-id]').forEach(el => el.remove());
    };
  }, [count, getAdaptiveParticleCount, shouldEnableParticles, deviceInfo.capabilities?.performance.graphics]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-10 ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
