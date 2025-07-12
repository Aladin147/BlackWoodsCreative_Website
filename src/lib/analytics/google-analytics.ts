/**
 * Simplified Google Analytics Integration
 *
 * A practical implementation of Google Analytics 4 for business tracking
 */

import { logger } from '../utils/logger';

// Google Analytics configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Check if GA is enabled
export const isGAEnabled = (): boolean => {
  return Boolean(GA_TRACKING_ID && typeof window !== 'undefined');
};

// Initialize Google Analytics
export const initGA = (): void => {
  if (!isGAEnabled()) {
    if (process.env.NODE_ENV === 'development') {
      logger.info('Google Analytics not initialized - missing GA_ID or running server-side');
    }
    return;
  }

  try {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    if (process.env.NODE_ENV === 'development') {
      logger.info('Google Analytics initialized', { trackingId: GA_TRACKING_ID });
    }
  } catch (error) {
    logger.warn('Failed to initialize Google Analytics', { error });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string): void => {
  if (!isGAEnabled()) return;

  try {
    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_title: title ?? document.title,
        page_location: url,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      logger.debug('GA: Page view tracked', { url, title });
    }
  } catch (error) {
    logger.warn('Failed to track page view', { error, url });
  }
};

// Track events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
): void => {
  if (!isGAEnabled()) return;

  try {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      logger.debug('GA: Event tracked', { action, category, label, value });
    }
  } catch (error) {
    logger.warn('Failed to track event', { error, action, category });
  }
};

// Track business-specific events
export const BusinessTracking = {
  // Track contact form interactions
  trackContactForm: (action: 'start' | 'submit' | 'success' | 'error', details?: string) => {
    trackEvent(action, 'contact_form', details);
  },

  // Track portfolio interactions
  trackPortfolio: (action: 'view' | 'click' | 'filter', item?: string) => {
    trackEvent(action, 'portfolio', item);
  },

  // Track service page interactions
  trackService: (action: 'view' | 'inquiry', service?: string) => {
    trackEvent(action, 'services', service);
  },

  // Track lead generation
  trackLead: (source: 'contact_form' | 'phone_call' | 'email', value?: number) => {
    trackEvent('lead_generated', 'leads', source, value);
  },

  // Track business conversions
  trackConversion: (type: 'quote_request' | 'consultation' | 'project_inquiry', value?: number) => {
    trackEvent('conversion', 'business', type, value);
  },

  // Track user engagement
  trackEngagement: (action: 'scroll' | 'time_on_page' | 'video_play', value?: number) => {
    trackEvent(action, 'engagement', undefined, value);
  },
};

// Enhanced tracking for business insights
export const BusinessInsights = {
  // Track user journey through the site
  trackUserJourney: (step: string, page: string) => {
    trackEvent('user_journey', 'navigation', `${step}_${page}`);
  },

  // Track content performance
  trackContentPerformance: (
    contentType: 'blog' | 'portfolio' | 'service',
    contentId: string,
    action: 'view' | 'share' | 'download'
  ) => {
    trackEvent(`content_${action}`, contentType, contentId);
  },

  // Track business goals
  trackBusinessGoal: (
    goal: 'newsletter_signup' | 'quote_request' | 'phone_click' | 'email_click'
  ) => {
    trackEvent('business_goal', 'conversions', goal);
  },
};

// Consent management (GDPR compliance)
export const ConsentManager = {
  // Check if user has given consent
  hasConsent: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('ga_consent') === 'granted';
  },

  // Grant consent
  grantConsent: (): void => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('ga_consent', 'granted');

    if (isGAEnabled() && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }

    // Initialize GA if not already done
    if (!window.gtag) {
      initGA();
    }
  },

  // Deny consent
  denyConsent: (): void => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('ga_consent', 'denied');

    if (isGAEnabled() && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  },

  // Initialize consent (call this on page load)
  initConsent: (): void => {
    if (!isGAEnabled()) return;

    // Set default consent state
    if (window.gtag) {
      window.gtag('consent', 'default', {
        analytics_storage: 'denied',
      });
    }

    // Check if user has previously given consent
    if (ConsentManager.hasConsent()) {
      ConsentManager.grantConsent();
    }
  },
};

// Development utilities
export const GADevUtils = {
  // Log current GA status
  logStatus: () => {
    if (process.env.NODE_ENV !== 'development') return;

    logger.info('Google Analytics Status', {
      enabled: isGAEnabled(),
      trackingId: GA_TRACKING_ID,
      consent: ConsentManager.hasConsent(),
      initialized: Boolean(window.gtag),
    });
  },

  // Test event tracking
  testTracking: () => {
    if (process.env.NODE_ENV !== 'development') return;

    trackEvent('test_event', 'development', 'ga_test');
    logger.info('Test event sent to Google Analytics');
  },
};

// Type declarations for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
