'use client';

import { useEffect, useRef, useState } from 'react';

import { useIsHydrated } from './SSRSafeWrapper';

interface AtmosphericParticlesProps {
  className?: string;
  count?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export function AtmosphericParticles({ className = '', count = 50 }: AtmosphericParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const isHydrated = useIsHydrated();
  const [_dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  const createParticle = (width: number, height: number): Particle => {
    const colors = ['#0f3530', '#1e4a38', '#2e6b5e', '#c3a358']; // Deep forest haze colors
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#0f3530',
      life: 0,
      maxLife: Math.random() * 300 + 200,
    };
  };

  useEffect(() => {
    // ✅ Only run after hydration
    if (!isHydrated || !containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set up canvas dimensions
    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;

      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });

      // Initialize particles
      particlesRef.current = Array.from({ length: count }, () => createParticle(width, height));
    };

    updateDimensions();

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      const { width, height } = canvas;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Update opacity based on life
        const lifeRatio = particle.life / particle.maxLife;
        particle.opacity = Math.max(0, 0.8 * (1 - lifeRatio));

        // Reset particle if it's too old
        if (particle.life >= particle.maxLife) {
          // Ensure index is within bounds before assignment
          if (index >= 0 && index < particlesRef.current.length) {
            // Safe array assignment with bounds checking
            const particles = particlesRef.current;
            if (particles && Array.isArray(particles) && index < particles.length) {
              particles[index] = createParticle(width, height);
            }
          }
          return;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => updateDimensions();
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [count, isHydrated]);

  // ✅ Don't render during SSR
  if (!isHydrated) return null;

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 z-10 ${className}`}
      suppressHydrationWarning
      style={{ mixBlendMode: 'screen' }}
    >
      <canvas ref={canvasRef} className="h-full w-full" style={{ mixBlendMode: 'screen' }} />
    </div>
  );
}
