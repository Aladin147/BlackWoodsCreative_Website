'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  hoverType: 'default' | 'button' | 'link' | 'portfolio' | 'text';
  scale: number;
}

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    hoverType: 'default',
    scale: 1,
  });

  // Smooth cursor movement with spring physics
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorScale = useMotionValue(1);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const smoothScale = useSpring(cursorScale, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      setCursorState(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      let hoverType: CursorState['hoverType'] = 'default';
      let scale = 1.5;

      // Determine cursor type based on element
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        hoverType = 'button';
        scale = 2;
      } else if (target.tagName === 'A' || target.closest('a')) {
        hoverType = 'link';
        scale = 1.8;
      } else if (target.closest('[data-cursor="portfolio"]')) {
        hoverType = 'portfolio';
        scale = 3;
      } else if (target.closest('h1, h2, h3, h4, h5, h6, p')) {
        hoverType = 'text';
        scale = 1.2;
      }

      cursorScale.set(scale);
      setCursorState(prev => ({
        ...prev,
        isHovering: true,
        hoverType,
        scale,
      }));
    };

    const handleMouseLeave = () => {
      cursorScale.set(1);
      setCursorState(prev => ({
        ...prev,
        isHovering: false,
        hoverType: 'default',
        scale: 1,
      }));
    };

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, [data-cursor], input, textarea, select'
    );

    document.addEventListener('mousemove', handleMouseMove);

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter as EventListener);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter as EventListener);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY, cursorScale]);

  // Hide default cursor on desktop
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        cursor: none !important;
      }
      @media (max-width: 768px) {
        * {
          cursor: auto !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Safe cleanup - check if style element still exists and has a parent
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Don't render on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        ref={cursorRef}
        data-testid="magnetic-cursor"
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          scale: smoothScale,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {/* Outer Ring */}
          <motion.div
            className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
              cursorState.hoverType === 'button'
                ? 'h-12 w-12 border-bw-accent-gold'
                : cursorState.hoverType === 'portfolio'
                  ? 'h-16 w-16 border-bw-accent-gold'
                  : cursorState.hoverType === 'link'
                    ? 'h-10 w-10 border-bw-text-primary'
                    : 'h-8 w-8 border-bw-text-primary'
            }`}
            animate={{
              rotate: cursorState.isHovering ? 180 : 0,
              scale: cursorState.isHovering ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Inner Dot */}
          <motion.div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
              cursorState.hoverType === 'button'
                ? 'h-2 w-2 bg-bw-accent-gold'
                : cursorState.hoverType === 'portfolio'
                  ? 'h-3 w-3 bg-bw-accent-gold'
                  : 'h-1 w-1 bg-bw-text-primary'
            }`}
            animate={{
              scale: cursorState.isHovering ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />

          {/* Hover Text */}
          {cursorState.isHovering && (
            <motion.div
              className="absolute left-1/2 top-full mt-4 -translate-x-1/2 whitespace-nowrap rounded bg-bw-black/80 px-2 py-1 text-xs text-bw-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {cursorState.hoverType === 'button' && 'Click'}
              {cursorState.hoverType === 'link' && 'Navigate'}
              {cursorState.hoverType === 'portfolio' && 'View Project'}
              {cursorState.hoverType === 'text' && 'Read'}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Cursor Trail */}
      <CursorTrail x={cursorState.x} y={cursorState.y} />
    </>
  );
}

interface CursorTrailProps {
  x: number;
  y: number;
}

function CursorTrail({ x, y }: CursorTrailProps) {
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const newPoint = { x, y, id: Date.now() };

    setTrail(prev => {
      const newTrail = [newPoint, ...prev.slice(0, 8)]; // Keep last 8 points
      return newTrail;
    });
  }, [x, y]);

  return (
    <>
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="pointer-events-none fixed left-0 top-0 z-[9998] h-2 w-2 rounded-full bg-bw-gold/30"
          style={{
            x: point.x - 4,
            y: point.y - 4,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{
            opacity: 0.8 - index * 0.1,
            scale: 1 - index * 0.1,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </>
  );
}
