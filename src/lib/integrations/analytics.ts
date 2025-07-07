/**
 * Analytics Integration
 * 
 * Comprehensive analytics integration for Google Analytics 4 and Vercel Analytics
 */

// Analytics configuration
export const ANALYTICS_CONFIG = {
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_ID,
    enabled: Boolean(process.env.NEXT_PUBLIC_GA_ID),
  },
  vercelAnalytics: {
    enabled: Boolean(process.env.VERCEL_ANALYTICS_ID),
  },
} as const;

// Google Analytics 4 types
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface GAPageView {
  page_title: string;
  page_location: string;
  page_path: string;
}

export interface GACustomEvent {
  event_name: string;
  event_parameters?: Record<string, unknown>;
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Initialize Google Analytics
export function initializeGoogleAnalytics(): void {
  if (!ANALYTICS_CONFIG.googleAnalytics.enabled || !ANALYTICS_CONFIG.googleAnalytics.measurementId) {
    // Google Analytics not configured - silent return in production
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer ?? [];

  // Define gtag function
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Initialize with current date
  window.gtag?.('js', new Date());

  // Configure Google Analytics
  window.gtag?.('config', ANALYTICS_CONFIG.googleAnalytics.measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  // Google Analytics initialized successfully
}

// Track page views
export function trackPageView(url: string, title?: string): void {
  if (!ANALYTICS_CONFIG.googleAnalytics.enabled || typeof window === 'undefined') {
    return;
  }

  const measurementId = ANALYTICS_CONFIG.googleAnalytics.measurementId;
  if (measurementId) {
    window.gtag?.('config', measurementId, {
      page_path: url,
      page_title: title ?? document.title,
      page_location: window.location.origin + url,
    });
  }
}

// Track custom events
export function trackEvent(event: GAEvent): void {
  if (!ANALYTICS_CONFIG.googleAnalytics.enabled || typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
  });
}

// Track custom events with parameters
export function trackCustomEvent(event: GACustomEvent): void {
  if (!ANALYTICS_CONFIG.googleAnalytics.enabled || typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', event.event_name, event.event_parameters);
}

// Predefined event tracking functions
export const analytics = {
  // Contact form events
  contactFormStart: () => trackEvent({
    action: 'form_start',
    category: 'contact',
    label: 'contact_form',
  }),

  contactFormSubmit: () => trackEvent({
    action: 'form_submit',
    category: 'contact',
    label: 'contact_form',
  }),

  contactFormSuccess: () => trackEvent({
    action: 'form_success',
    category: 'contact',
    label: 'contact_form',
  }),

  contactFormError: (error: string) => trackEvent({
    action: 'form_error',
    category: 'contact',
    label: error,
  }),

  // Navigation events
  navigationClick: (destination: string) => trackEvent({
    action: 'navigation_click',
    category: 'navigation',
    label: destination,
  }),

  // Portfolio events
  portfolioView: (projectId: string) => trackEvent({
    action: 'portfolio_view',
    category: 'portfolio',
    label: projectId,
  }),

  portfolioImageClick: (projectId: string, imageIndex: number) => trackEvent({
    action: 'portfolio_image_click',
    category: 'portfolio',
    label: projectId,
    value: imageIndex,
  }),

  // Service events
  serviceView: (serviceName: string) => trackEvent({
    action: 'service_view',
    category: 'services',
    label: serviceName,
  }),

  serviceInquiry: (serviceName: string) => trackEvent({
    action: 'service_inquiry',
    category: 'services',
    label: serviceName,
  }),

  // Download events
  downloadBrochure: () => trackEvent({
    action: 'download',
    category: 'engagement',
    label: 'brochure',
  }),

  downloadPortfolio: () => trackEvent({
    action: 'download',
    category: 'engagement',
    label: 'portfolio',
  }),

  // Social media events
  socialMediaClick: (platform: string) => trackEvent({
    action: 'social_click',
    category: 'social_media',
    label: platform,
  }),

  // Video events
  videoPlay: (videoId: string) => trackEvent({
    action: 'video_play',
    category: 'video',
    label: videoId,
  }),

  videoPause: (videoId: string) => trackEvent({
    action: 'video_pause',
    category: 'video',
    label: videoId,
  }),

  videoComplete: (videoId: string) => trackEvent({
    action: 'video_complete',
    category: 'video',
    label: videoId,
  }),

  // Search events
  siteSearch: (searchTerm: string) => trackEvent({
    action: 'search',
    category: 'site_search',
    label: searchTerm,
  }),

  // Error events
  pageError: (errorType: string, page: string) => trackEvent({
    action: 'page_error',
    category: 'errors',
    label: `${errorType}_${page}`,
  }),

  // Performance events
  performanceMetric: (metric: string, value: number) => trackEvent({
    action: 'performance_metric',
    category: 'performance',
    label: metric,
    value: Math.round(value),
  }),
};

// Enhanced ecommerce tracking (for future use)
export function trackPurchase(transactionId: string, value: number, currency = 'MAD'): void {
  if (!ANALYTICS_CONFIG.googleAnalytics.enabled || typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
  });
}

// User engagement tracking
export function trackEngagement(engagementTime: number): void {
  if (!ANALYTICS_CONFIG.googleAnalytics.enabled || typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', 'user_engagement', {
    engagement_time_msec: engagementTime,
  });
}

// Consent management
export function updateAnalyticsConsent(granted: boolean): void {
  if (!ANALYTICS_CONFIG.googleAnalytics.enabled || typeof window === 'undefined') {
    return;
  }

  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied', // Always deny ad storage for privacy
  });
}

// Get Google Analytics script URL
export function getGoogleAnalyticsScriptUrl(): string | null {
  if (!ANALYTICS_CONFIG.googleAnalytics.measurementId) {
    return null;
  }
  
  return `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.googleAnalytics.measurementId}`;
}

// Validate analytics configuration
export function validateAnalyticsConfig(): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!ANALYTICS_CONFIG.googleAnalytics.measurementId) {
    issues.push('Google Analytics Measurement ID is not configured');
  } else if (!ANALYTICS_CONFIG.googleAnalytics.measurementId.startsWith('G-')) {
    issues.push('Google Analytics Measurement ID format is invalid (should start with G-)');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

// Export configuration status
export const isGoogleAnalyticsConfigured = ANALYTICS_CONFIG.googleAnalytics.enabled;
export const isVercelAnalyticsConfigured = ANALYTICS_CONFIG.vercelAnalytics.enabled;

// Default export
const analyticsModule = {
  initializeGoogleAnalytics,
  trackPageView,
  trackEvent,
  trackCustomEvent,
  analytics,
  trackPurchase,
  trackEngagement,
  updateAnalyticsConsent,
  getGoogleAnalyticsScriptUrl,
  validateAnalyticsConfig,
  isGoogleAnalyticsConfigured,
  isVercelAnalyticsConfigured,
  ANALYTICS_CONFIG,
};

export default analyticsModule;
