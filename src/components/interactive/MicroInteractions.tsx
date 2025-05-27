'use client';

import { useState, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HoverMagnifyProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function HoverMagnify({ children, scale = 1.05, className = '' }: HoverMagnifyProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={className}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number;
  className?: string;
}

export function TiltCard({ children, maxTilt = 15, className = '' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]));

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  amplitude?: number;
  frequency?: number;
  className?: string;
}

export function FloatingElement({ 
  children, 
  amplitude = 10, 
  frequency = 2,
  className = '' 
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: frequency,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

interface PulseGlowProps {
  children: ReactNode;
  color?: string;
  intensity?: number;
  duration?: number;
  className?: string;
}

export function PulseGlow({ 
  children, 
  color = 'bw-gold',
  intensity = 0.3,
  duration = 2,
  className = '' 
}: PulseGlowProps) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 20px rgba(212, 175, 55, ${intensity})`,
          `0 0 40px rgba(212, 175, 55, ${intensity * 2})`,
          `0 0 20px rgba(212, 175, 55, ${intensity})`,
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

interface MorphingButtonProps {
  children: ReactNode;
  hoverChildren?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MorphingButton({ 
  children, 
  hoverChildren, 
  className = '',
  onClick 
}: MorphingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={{ y: isHovered ? -40 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
      
      {hoverChildren && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: isHovered ? 0 : 40 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {hoverChildren}
        </motion.div>
      )}
    </motion.button>
  );
}

interface RippleEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function RippleEffect({ children, className = '', color = 'rgba(212, 175, 55, 0.3)' }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ 
            width: 300, 
            height: 300, 
            opacity: 0,
            x: -150,
            y: -150,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

interface StaggeredRevealProps {
  children: ReactNode[];
  delay?: number;
  className?: string;
}

export function StaggeredReveal({ children, delay = 0.1, className = '' }: StaggeredRevealProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: index * delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className = '', delay = 0.05 }: TextRevealProps) {
  const words = text.split(' ');

  return (
    <div className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-2">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: (wordIndex * word.length + charIndex) * delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  );
}
