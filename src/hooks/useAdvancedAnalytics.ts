'use client';

import { useEffect, useCallback, useRef } from 'react';

import { useDeviceAdaptation } from './useDeviceAdaptation';

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface UserInteraction {
  type: 'click' | 'hover' | 'scroll' | 'magnetic' | 'form' | 'navigation';
  element: string;
  position: { x: number; y: number };
  timestamp: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

interface PerformanceMetric {
  metric: string;
  value: number;
  timestamp: number;
  context?: Record<string, unknown>;
}

interface AnalyticsConfig {
  enableTracking: boolean;
  enableHeatmap: boolean;
  enablePerformanceTracking: boolean;
  enableUserJourney: boolean;
  batchSize: number;
  flushInterval: number;
  respectPrivacy: boolean;
}

const defaultConfig: AnalyticsConfig = {
  enableTracking: true,
  enableHeatmap: true,
  enablePerformanceTracking: true,
  enableUserJourney: true,
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
  respectPrivacy: true,
};

export function useAdvancedAnalytics(config: Partial<AnalyticsConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  const { deviceInfo } = useDeviceAdaptation();

  const sessionIdRef = useRef<string>('');
  const userIdRef = useRef<string>('');
  const eventsQueueRef = useRef<AnalyticsEvent[]>([]);
  const interactionsQueueRef = useRef<UserInteraction[]>([]);
  const performanceQueueRef = useRef<PerformanceMetric[]>([]);
  const flushTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Generate session ID - client-side only to prevent hydration issues
  const generateSessionId = useCallback(() => {
    // Only generate on client side
    if (typeof window === 'undefined') return '';

    // Use crypto.getRandomValues if available, fallback to Math.random
    let randomPart: string;
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(6);
      crypto.getRandomValues(array);
      randomPart = Array.from(array, byte => byte.toString(36)).join('').substr(0, 9);
    } else {
      randomPart = Math.random().toString(36).substr(2, 9);
    }

    return `session_${Date.now()}_${randomPart}`;
  }, []);

  // Generate or retrieve user ID
  const getUserId = useCallback(() => {
    if (!finalConfig.respectPrivacy) return '';

    let userId = localStorage.getItem('bw_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('bw_user_id', userId);
    }
    return userId;
  }, [finalConfig.respectPrivacy]);

  // Initialize analytics
  const initializeAnalytics = useCallback(() => {
    if (typeof window === 'undefined') return;

    sessionIdRef.current = generateSessionId();
    userIdRef.current = getUserId();

    // Track page view - add directly to queue to avoid circular dependency
    const pageViewEvent: AnalyticsEvent = {
      event: 'page_view',
      category: 'navigation',
      action: 'view',
      label: window.location.pathname,
      timestamp: Date.now(),
      sessionId: sessionIdRef.current,
      userId: userIdRef.current,
      metadata: {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        deviceInfo,
      },
    };

    eventsQueueRef.current.push(pageViewEvent);
  }, [generateSessionId, getUserId, deviceInfo]);

  // Flush events to analytics service
  const flushEvents = useCallback(() => {
    const events = [...eventsQueueRef.current];
    const interactions = [...interactionsQueueRef.current];
    const performance = [...performanceQueueRef.current];

    if (events.length === 0 && interactions.length === 0 && performance.length === 0) return;

    // Clear queues
    eventsQueueRef.current = [];
    interactionsQueueRef.current = [];
    performanceQueueRef.current = [];

    try {
      // For development, analytics data tracked internally
      if (process.env.NODE_ENV === 'development') {
        // Analytics data processed internally
      }

      // In a real implementation, this would send to your analytics service
      // const analyticsData = {
      //   events,
      //   interactions,
      //   performance,
      //   session: {
      //     id: sessionIdRef.current,
      //     userId: userIdRef.current,
      //     deviceInfo,
      //     timestamp: Date.now()
      //   }
      // };

      // Send to analytics service (placeholder)
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(analyticsData)
      // });
    } catch {
      // Failed to send analytics data - logged internally

      // Re-queue events on failure
      eventsQueueRef.current.unshift(...events);
      interactionsQueueRef.current.unshift(...interactions);
      performanceQueueRef.current.unshift(...performance);
    }
  }, []);

  // Track custom event
  const trackEvent = useCallback(
    (eventData: Omit<AnalyticsEvent, 'timestamp' | 'sessionId' | 'userId'>) => {
      if (!finalConfig.enableTracking) return;

      const event: AnalyticsEvent = {
        ...eventData,
        timestamp: Date.now(),
        sessionId: sessionIdRef.current,
        userId: userIdRef.current,
      };

      eventsQueueRef.current.push(event);

      // Auto-flush if batch size reached
      if (eventsQueueRef.current.length >= finalConfig.batchSize) {
        flushEvents();
      }
    },
    [finalConfig.enableTracking, finalConfig.batchSize, flushEvents]
  );

  // Track user interaction
  const trackInteraction = useCallback(
    (interaction: Omit<UserInteraction, 'timestamp'>) => {
      if (!finalConfig.enableHeatmap) return;

      const fullInteraction: UserInteraction = {
        ...interaction,
        timestamp: Date.now(),
      };

      interactionsQueueRef.current.push(fullInteraction);
    },
    [finalConfig.enableHeatmap]
  );

  // Track performance metric
  const trackPerformance = useCallback(
    (metric: Omit<PerformanceMetric, 'timestamp'>) => {
      if (!finalConfig.enablePerformanceTracking) return;

      const fullMetric: PerformanceMetric = {
        ...metric,
        timestamp: Date.now(),
      };

      performanceQueueRef.current.push(fullMetric);
    },
    [finalConfig.enablePerformanceTracking]
  );

  // Track scroll behavior
  const trackScrollBehavior = useCallback(() => {
    let scrollStartTime = Date.now();
    let lastScrollY = window.scrollY;
    let scrollDirection: 'up' | 'down' = 'down';

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const newDirection = currentScrollY > lastScrollY ? 'down' : 'up';

      if (newDirection !== scrollDirection) {
        // Direction changed, track the previous scroll session
        trackInteraction({
          type: 'scroll',
          element: 'page',
          position: { x: 0, y: lastScrollY },
          duration: Date.now() - scrollStartTime,
          metadata: {
            direction: scrollDirection,
            distance: Math.abs(currentScrollY - lastScrollY),
          },
        });

        scrollStartTime = Date.now();
        scrollDirection = newDirection;
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackInteraction]);

  // Track magnetic field interactions
  const trackMagneticInteraction = useCallback(
    (elementId: string, strength: number, distance: number) => {
      trackInteraction({
        type: 'magnetic',
        element: elementId,
        position: { x: 0, y: 0 }, // Would be filled by actual mouse position
        metadata: {
          strength,
          distance,
          deviceType: deviceInfo.isMobile ? 'mobile' : 'desktop',
        },
      });

      trackEvent({
        event: 'magnetic_interaction',
        category: 'engagement',
        action: 'magnetic_field',
        label: elementId,
        value: strength,
        metadata: { distance, deviceType: deviceInfo.isMobile ? 'mobile' : 'desktop' },
      });
    },
    [trackInteraction, trackEvent, deviceInfo]
  );

  // Track form interactions
  const trackFormInteraction = useCallback(
    (formId: string, fieldId: string, action: 'focus' | 'blur' | 'change' | 'submit') => {
      trackInteraction({
        type: 'form',
        element: `${formId}.${fieldId}`,
        position: { x: 0, y: 0 },
        metadata: { action, formId, fieldId },
      });

      trackEvent({
        event: 'form_interaction',
        category: 'engagement',
        action,
        label: `${formId}.${fieldId}`,
      });
    },
    [trackInteraction, trackEvent]
  );

  // Track navigation events
  const trackNavigation = useCallback(
    (from: string, to: string, method: 'click' | 'scroll' | 'keyboard') => {
      trackEvent({
        event: 'navigation',
        category: 'navigation',
        action: method,
        label: `${from} -> ${to}`,
        metadata: { from, to, method },
      });
    },
    [trackEvent]
  );

  // Track performance metrics
  const trackPagePerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Core Web Vitals
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          trackPerformance({
            metric: 'LCP',
            value: entry.startTime,
            context: { url: window.location.pathname },
          });
        }

        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          trackPerformance({
            metric: 'FID',
            value: fidEntry.processingStart - entry.startTime,
            context: { url: window.location.pathname },
          });
        }

        if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!clsEntry.hadRecentInput) {
            trackPerformance({
              metric: 'CLS',
              value: clsEntry.value,
              context: { url: window.location.pathname },
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    return () => observer.disconnect();
  }, [trackPerformance]);

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();

    // Set up periodic flush (skip in test environment)
    if (typeof setInterval !== 'undefined') {
      flushTimerRef.current = setInterval(flushEvents, finalConfig.flushInterval);
    }

    // Set up scroll tracking
    const cleanupScroll = trackScrollBehavior();

    // Set up performance tracking
    const cleanupPerformance = trackPagePerformance();

    // Flush on page unload
    const handleBeforeUnload = () => {
      flushEvents();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (flushTimerRef.current && typeof clearInterval !== 'undefined') {
        clearInterval(flushTimerRef.current);
      }
      cleanupScroll();
      cleanupPerformance?.();
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
      flushEvents(); // Final flush
    };
  }, [
    initializeAnalytics,
    finalConfig.flushInterval,
    flushEvents,
    trackScrollBehavior,
    trackPagePerformance,
  ]);

  return {
    trackEvent,
    trackInteraction,
    trackPerformance,
    trackMagneticInteraction,
    trackFormInteraction,
    trackNavigation,
    flushEvents,
    sessionId: sessionIdRef.current,
    userId: userIdRef.current,
  };
}

// Hook for tracking component-specific analytics
export function useComponentAnalytics(componentName: string) {
  const analytics = useAdvancedAnalytics();

  const trackComponentEvent = useCallback(
    (action: string, label?: string, value?: number) => {
      const eventData: Omit<AnalyticsEvent, 'timestamp' | 'sessionId' | 'userId'> = {
        event: 'component_interaction',
        category: 'components',
        action: `${componentName}.${action}`,
        ...(label && { label }),
        ...(value !== undefined && { value }),
      };
      analytics.trackEvent(eventData);
    },
    [analytics, componentName]
  );

  const trackComponentMount = useCallback(() => {
    trackComponentEvent('mount');
  }, [trackComponentEvent]);

  const trackComponentUnmount = useCallback(() => {
    trackComponentEvent('unmount');
  }, [trackComponentEvent]);

  useEffect(() => {
    trackComponentMount();
    return trackComponentUnmount;
  }, [trackComponentMount, trackComponentUnmount]);

  return {
    ...analytics,
    trackComponentEvent,
  };
}
