'use client';

// Minimal test component to isolate the issue
interface AtmosphericParticlesProps {
  className?: string;
}

export function AtmosphericParticles({ className = '' }: AtmosphericParticlesProps) {
  return (
    <div className={`pointer-events-none fixed inset-0 z-10 ${className}`}>
      {/* Minimal test component */}
    </div>
  );
}


