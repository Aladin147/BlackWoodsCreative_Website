'use client';

import { useEffect, useRef } from 'react';

interface AtmosphericParticlesProps {
  className?: string;
  count?: number;
}

export function AtmosphericParticles({ className = '', count = 50 }: AtmosphericParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Set mix-blend-mode style
    container.style.mixBlendMode = 'screen';

    // Start animation loop if count > 0
    if (count > 0) {
      const animate = () => {
        // Animation logic would go here
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 z-10 ${className}`}
    >
      {/* Atmospheric particles would be rendered here */}
    </div>
  );
}


