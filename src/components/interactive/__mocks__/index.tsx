import React from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
}

interface ComponentProps {
  children: React.ReactNode;
  className?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({ text, className }) => (
  <div className={className} data-testid="text-reveal">
    {text}
  </div>
);

export const ParallaxLayer: React.FC<ComponentProps> = ({ children, className }) => (
  <div className={className} data-testid="parallax-layer">
    {children}
  </div>
);

export const MagneticField: React.FC<ComponentProps> = ({ children, className }) => (
  <div className={className} data-testid="magnetic-field">
    {children}
  </div>
);

export const ScrollReveal: React.FC<ComponentProps> = ({ children, className }) => (
  <div className={className} data-testid="scroll-reveal">
    {children}
  </div>
);

export const WebGLEnhancedBackground: React.FC<ComponentProps> = ({ children, className }) => (
  <div className={className} data-testid="webgl-enhanced-background">
    {children}
  </div>
);
