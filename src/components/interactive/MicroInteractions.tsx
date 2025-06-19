'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAnimationConfig } from '@/hooks/useReducedMotion';

interface HoverMagnifyProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function HoverMagnify({ children, scale = 1.02, className = '' }: HoverMagnifyProps) {
  const animationConfig = useAnimationConfig();

  return (
    <motion.div
      className={className}
      whileHover={{ scale: animationConfig.scale.hover * scale }}
      transition={{ duration: animationConfig.duration.normal, ease: [0.25, 0.46, 0.45, 0.94] }}
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

export function TiltCard({ children, maxTilt = 8, className = '' }: TiltCardProps) {
  const animationConfig = useAnimationConfig();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [
    animationConfig.disableAnimations ? 0 : maxTilt,
    animationConfig.disableAnimations ? 0 : -maxTilt
  ]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [
    animationConfig.disableAnimations ? 0 : -maxTilt,
    animationConfig.disableAnimations ? 0 : maxTilt
  ]));

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || animationConfig.disableAnimations) return;

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
        rotateX: animationConfig.disableAnimations ? 0 : rotateX,
        rotateY: animationConfig.disableAnimations ? 0 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: animationConfig.scale.hover }}
      transition={{ duration: animationConfig.duration.slow, ease: [0.25, 0.46, 0.45, 0.94] }}
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
  const animationConfig = useAnimationConfig();

  return (
    <motion.div
      className={className}
      animate={animationConfig.disableAnimations ? {} : {
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: frequency,
        repeat: animationConfig.disableAnimations ? 0 : Infinity,
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
  intensity = 0.3,
  duration = 2,
  className = ''
}: PulseGlowProps) {
  const animationConfig = useAnimationConfig();

  return (
    <motion.div
      className={className}
      animate={animationConfig.disableAnimations ? {} : {
        boxShadow: [
          `0 0 20px rgba(195, 163, 88, ${intensity})`,
          `0 0 40px rgba(195, 163, 88, ${intensity * 2})`,
          `0 0 20px rgba(195, 163, 88, ${intensity})`,
        ],
      }}
      transition={{
        duration,
        repeat: animationConfig.disableAnimations ? 0 : Infinity,
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
  'aria-label'?: string;
  title?: string;
}

export function MorphingButton({
  children,
  hoverChildren,
  className = '',
  onClick,
  'aria-label': ariaLabel,
  title
}: MorphingButtonProps) {
  const animationConfig = useAnimationConfig();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: animationConfig.scale.tap }}
      transition={{ duration: animationConfig.duration.normal, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-label={ariaLabel}
      title={title}
    >
      <motion.div
        animate={{ y: animationConfig.disableAnimations ? 0 : (isHovered ? -40 : 0) }}
        transition={{ duration: animationConfig.duration.normal, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>

      {hoverChildren && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: animationConfig.disableAnimations ? 40 : (isHovered ? 0 : 40) }}
          transition={{ duration: animationConfig.duration.normal, ease: [0.25, 0.46, 0.45, 0.94] }}
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

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: number;
}

export function GlitchText({ text, className = '', intensity = 0.5 }: GlitchTextProps) {
  const glitchOffset = intensity * 4; // Scale the glitch effect based on intensity

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        x: [0, -glitchOffset, glitchOffset, 0],
        textShadow: [
          '0 0 0 transparent',
          `${glitchOffset}px 0 0 #ff0000, -${glitchOffset}px 0 0 #00ffff`,
          '0 0 0 transparent'
        ]
      }}
      transition={{
        duration: 0.2,
        repeat: Infinity,
        repeatDelay: 2,
        ease: 'easeInOut'
      }}
    >
      {text}
    </motion.div>
  );
}

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export function TypewriterText({ text, className = '', speed = 50 }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-5 bg-current ml-1"
      />
    </span>
  );
}
