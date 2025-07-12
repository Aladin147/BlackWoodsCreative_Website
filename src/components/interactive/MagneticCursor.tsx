'use client';

import { useEffect, useRef, useState } from 'react';

import { motion, useMotionValue, useSpring } from 'framer-motion';

import { useIsHydrated } from './SSRSafeWrapper';

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  hoverType: 'default' | 'button' | 'link' | 'portfolio' | 'text';
  scale: number;
}

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHydrated = useIsHydrated();

  // ✅ SSR-safe: Only initialize state after hydration
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

  // ✅ Check if mobile device
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // ✅ Only run after hydration and in browser environment
    if (!isHydrated || typeof window === 'undefined') return;

    // Check if mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(mobile || window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      setCursorState(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      const cursorType = target.getAttribute('data-cursor') ?? 'default';

      setCursorState(prev => ({
        ...prev,
        isHovering: true,
        hoverType: cursorType as CursorState['hoverType'],
        scale: cursorType === 'button' ? 1.5 : cursorType === 'portfolio' ? 2 : 1.2,
      }));

      cursorScale.set(cursorState.scale);
    };

    const handleMouseLeave = () => {
      setCursorState(prev => ({
        ...prev,
        isHovering: false,
        hoverType: 'default',
        scale: 1,
      }));

      cursorScale.set(1);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('[data-cursor]');
    interactiveElements.forEach(element => {
      (element as HTMLElement).addEventListener('mouseenter', handleMouseEnter as EventListener);
      (element as HTMLElement).addEventListener('mouseleave', handleMouseLeave as EventListener);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);

      interactiveElements.forEach(element => {
        (element as HTMLElement).removeEventListener(
          'mouseenter',
          handleMouseEnter as EventListener
        );
        (element as HTMLElement).removeEventListener(
          'mouseleave',
          handleMouseLeave as EventListener
        );
      });
    };
  }, [isHydrated, cursorX, cursorY, cursorScale, cursorState.scale]);

  // ✅ Don't render during SSR or on mobile
  if (!isHydrated || isMobile) return null;

  return (
    <div suppressHydrationWarning>
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
            className={`absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
              cursorState.hoverType === 'button' || cursorState.hoverType === 'portfolio'
                ? 'bg-bw-accent-gold'
                : 'bg-bw-text-primary'
            }`}
            animate={{
              scale: cursorState.isHovering ? 0.5 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
