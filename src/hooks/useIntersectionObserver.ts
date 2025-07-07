import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
  triggerOnce?: boolean;
}

interface IntersectionObserverEntry {
  isIntersecting: boolean;
  intersectionRatio: number;
  boundingClientRect: DOMRectReadOnly;
  intersectionRect: DOMRectReadOnly;
  rootBounds: DOMRectReadOnly | null;
  target: Element;
  time: number;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLElement | null>, IntersectionObserverEntry | null] {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    triggerOnce = false,
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !element) return;

    if (triggerOnce && hasTriggered) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setEntry(entry);

        if (triggerOnce && entry.isIntersecting) {
          setHasTriggered(true);
        }
      }
    }, observerParams);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen, triggerOnce, hasTriggered]);

  return [elementRef, entry];
}

// Hook for multiple elements
export function useIntersectionObserverMultiple(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0.1, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

  const [entries, setEntries] = useState<Map<Element, IntersectionObserverEntry>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = (element: Element) => {
    observerRef.current ??= new IntersectionObserver(
      observedEntries => {
        setEntries(prev => {
          const newEntries = new Map(prev);
          observedEntries.forEach(entry => {
            if (freezeOnceVisible && prev.get(entry.target)?.isIntersecting) {
              return; // Keep frozen state
            }
            newEntries.set(entry.target, entry);
          });
          return newEntries;
        });
      },
      { threshold, root, rootMargin }
    );

    observerRef.current.observe(element);
  };

  const unobserve = (element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
      setEntries(prev => {
        const newEntries = new Map(prev);
        newEntries.delete(element);
        return newEntries;
      });
    }
  };

  const disconnect = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      setEntries(new Map());
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return { entries, observe, unobserve, disconnect };
}

// Hook for scroll-based animations with performance optimization
export function useScrollAnimation(
  options: UseIntersectionObserverOptions & {
    animationDelay?: number;
    reduceMotion?: boolean;
  } = {}
) {
  const { animationDelay = 0, reduceMotion = false, ...intersectionOptions } = options;
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
    ...intersectionOptions,
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || prefersReducedMotion) {
      setShouldAnimate(true);
      return undefined;
    }

    if (entry?.isIntersecting) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, animationDelay);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [entry?.isIntersecting, animationDelay, reduceMotion]);

  return {
    ref,
    isVisible: entry?.isIntersecting ?? false,
    shouldAnimate,
    intersectionRatio: entry?.intersectionRatio ?? 0,
  };
}

// Hook for lazy loading with performance optimization
export function useLazyLoad(options: UseIntersectionObserverOptions = {}) {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    rootMargin: '50px',
    triggerOnce: true,
    ...options,
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entry?.isIntersecting && !isLoaded && !isLoading) {
      setIsLoading(true);

      // Simulate loading delay for smooth UX
      const timer = setTimeout(() => {
        setIsLoaded(true);
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [entry?.isIntersecting, isLoaded, isLoading]);

  return {
    ref,
    isVisible: entry?.isIntersecting ?? false,
    isLoaded,
    isLoading,
    shouldLoad: entry?.isIntersecting ?? false,
  };
}

// Hook for viewport-based effects
export function useViewportEffect(
  callback: (entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {}
) {
  const [ref, entry] = useIntersectionObserver(options);

  useEffect(() => {
    if (entry) {
      callback(entry);
    }
  }, [entry, callback]);

  return ref;
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const currentFPS = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFps(currentFPS);
        setIsLowPerformance(currentFPS < 30);

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return { fps, isLowPerformance };
}
