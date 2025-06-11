import { useState, useEffect, useCallback } from 'react';

interface ScrollProgressOptions {
  throttleMs?: number;
  element?: HTMLElement | null;
}

interface ScrollProgressReturn {
  scrollProgress: number;
  isScrolling: boolean;
  scrollDirection: 'up' | 'down' | null;
  scrollY: number;
  maxScroll: number;
}

export function useScrollProgress(options: ScrollProgressOptions = {}): ScrollProgressReturn {
  const { throttleMs = 16, element = null } = options;

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  const calculateProgress = useCallback(() => {
    let currentScrollY: number;
    let scrollHeight: number;
    let clientHeight: number;

    if (element) {
      currentScrollY = element.scrollTop;
      scrollHeight = element.scrollHeight;
      clientHeight = element.clientHeight;
    } else {
      currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = window.innerHeight;
    }

    const maxScrollValue = scrollHeight - clientHeight;
    const progress = maxScrollValue > 0 ? (currentScrollY / maxScrollValue) * 100 : 0;

    // Determine scroll direction
    const direction = currentScrollY > lastScrollY ? 'down' : currentScrollY < lastScrollY ? 'up' : null;

    setScrollY(currentScrollY);
    setMaxScroll(maxScrollValue);
    setScrollProgress(Math.min(100, Math.max(0, progress)));
    setScrollDirection(direction);
    setLastScrollY(currentScrollY);
  }, [element, lastScrollY]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let throttleId: NodeJS.Timeout;
    let isThrottled = false;

    const handleScroll = () => {
      setIsScrolling(true);

      // Clear existing timeout
      clearTimeout(timeoutId);

      // Throttle scroll calculations for performance
      if (!isThrottled) {
        calculateProgress();
        isThrottled = true;

        throttleId = setTimeout(() => {
          isThrottled = false;
        }, throttleMs);
      }

      // Set scrolling to false after a delay
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const target = element || window;
    target.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    calculateProgress();

    return () => {
      target.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
      clearTimeout(throttleId);
    };
  }, [element, throttleMs, calculateProgress]);

  return {
    scrollProgress,
    isScrolling,
    scrollDirection,
    scrollY,
    maxScroll,
  };
}

// Hook for scroll-based animations with easing
export function useScrollAnimation(options: ScrollProgressOptions & {
  startProgress?: number;
  endProgress?: number;
  easing?: (t: number) => number;
} = {}) {
  const { startProgress = 0, endProgress = 100, easing = (t: number) => t, ...scrollOptions } = options;
  const { scrollProgress } = useScrollProgress(scrollOptions);

  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (scrollProgress >= startProgress && scrollProgress <= endProgress) {
      const normalizedProgress = (scrollProgress - startProgress) / (endProgress - startProgress);
      const easedProgress = easing(Math.min(1, Math.max(0, normalizedProgress)));
      setAnimationProgress(easedProgress);
    } else if (scrollProgress < startProgress) {
      setAnimationProgress(0);
    } else if (scrollProgress > endProgress) {
      setAnimationProgress(1);
    }
  }, [scrollProgress, startProgress, endProgress, easing]);

  return {
    scrollProgress,
    animationProgress,
    isActive: scrollProgress >= startProgress && scrollProgress <= endProgress,
  };
}

// Hook for scroll-triggered effects
export function useScrollTrigger(options: ScrollProgressOptions & {
  triggerPoint?: number;
  triggerOnce?: boolean;
  onTrigger?: () => void;
  onUntrigger?: () => void;
} = {}) {
  const { triggerPoint = 50, triggerOnce = false, onTrigger, onUntrigger, ...scrollOptions } = options;
  const { scrollProgress } = useScrollProgress(scrollOptions);

  const [isTriggered, setIsTriggered] = useState(false);
  const [hasTriggeredOnce, setHasTriggeredOnce] = useState(false);

  useEffect(() => {
    const shouldTrigger = scrollProgress >= triggerPoint;

    if (shouldTrigger && !isTriggered && (!triggerOnce || !hasTriggeredOnce)) {
      setIsTriggered(true);
      setHasTriggeredOnce(true);
      onTrigger?.();
    } else if (!shouldTrigger && isTriggered && !triggerOnce) {
      setIsTriggered(false);
      onUntrigger?.();
    }
  }, [scrollProgress, triggerPoint, isTriggered, triggerOnce, hasTriggeredOnce, onTrigger, onUntrigger]);

  return {
    scrollProgress,
    isTriggered,
    hasTriggeredOnce,
  };
}

// Hook for parallax effects based on scroll
export function useParallaxScroll(options: ScrollProgressOptions & {
  speed?: number;
  direction?: 'up' | 'down';
} = {}) {
  const { speed = 0.5, direction = 'up', ...scrollOptions } = options;
  const { scrollY } = useScrollProgress(scrollOptions);

  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const offset = scrollY * speed * (direction === 'up' ? -1 : 1);
    setParallaxOffset(offset);
  }, [scrollY, speed, direction]);

  return {
    parallaxOffset,
    scrollY,
    transform: `translateY(${parallaxOffset}px)`,
  };
}

// Hook for scroll-based progress indicators
export function useScrollProgressIndicator(options: ScrollProgressOptions & {
  sections?: string[];
} = {}) {
  const { sections = [], ...scrollOptions } = options;
  const { scrollProgress } = useScrollProgress(scrollOptions);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (sections.length === 0) return;

    const sectionSize = 100 / sections.length;
    const currentSectionIndex = Math.floor(scrollProgress / sectionSize);
    const currentSection = sections[currentSectionIndex] || sections[sections.length - 1];

    setActiveSection(currentSection);

    // Calculate progress for each section
    const progress: Record<string, number> = {};
    sections.forEach((section, index) => {
      const sectionStart = index * sectionSize;
      const sectionEnd = (index + 1) * sectionSize;
      
      if (scrollProgress >= sectionStart && scrollProgress <= sectionEnd) {
        progress[section] = ((scrollProgress - sectionStart) / sectionSize) * 100;
      } else if (scrollProgress > sectionEnd) {
        progress[section] = 100;
      } else {
        progress[section] = 0;
      }
    });

    setSectionProgress(progress);
  }, [scrollProgress, sections]);

  return {
    scrollProgress,
    activeSection,
    sectionProgress,
    sections,
  };
}

// Hook for scroll performance monitoring
export function useScrollPerformance() {
  const [fps, setFps] = useState(60);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollEvents, setScrollEvents] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let eventCount = 0;
    let animationId: number;

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const currentFPS = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFps(currentFPS);
        setScrollEvents(eventCount);

        frameCount = 0;
        eventCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    const handleScroll = () => {
      eventCount++;
      setIsScrolling(true);

      setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return {
    fps,
    isScrolling,
    scrollEvents,
    isPerformant: fps >= 30,
  };
}
