import React from 'react';

export const TextReveal = ({ text, className }: { text: string; className?: string }) => (
  <div className={className} data-testid="text-reveal">{text}</div>
);

export const ParallaxLayer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className} data-testid="parallax-layer">{children}</div>
);

export const MagneticField = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className} data-testid="magnetic-field">{children}</div>
);

export const ScrollReveal = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className} data-testid="scroll-reveal">{children}</div>
);

export const WebGLEnhancedBackground = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className} data-testid="webgl-enhanced-background">{children}</div>
);
