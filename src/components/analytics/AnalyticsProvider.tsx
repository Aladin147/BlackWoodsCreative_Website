/**
 * Analytics Provider Component
 * 
 * Provides analytics integration for Google Analytics and Vercel Analytics
 */

'use client';

// Optional Vercel Analytics - disabled until packages are installed
// TODO: Install @vercel/analytics and @vercel/speed-insights packages
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

import {
  initializeGoogleAnalytics,
  trackPageView,
  getGoogleAnalyticsScriptUrl,
  isGoogleAnalyticsConfigured,
  isVercelAnalyticsConfigured,
  ANALYTICS_CONFIG,
} from '@/lib/integrations/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();

  // Track page views on route changes
  useEffect(() => {
    if (isGoogleAnalyticsConfigured) {
      // Use window.location.search instead of useSearchParams for Next.js 15 compatibility
      const searchString = typeof window !== 'undefined' ? window.location.search : '';
      const url = pathname + searchString;
      trackPageView(url);
    }
  }, [pathname]);

  // Initialize Google Analytics on mount
  useEffect(() => {
    if (isGoogleAnalyticsConfigured && typeof window !== 'undefined') {
      // Small delay to ensure gtag is loaded
      const timer = setTimeout(() => {
        initializeGoogleAnalytics();
      }, 100);

      return () => clearTimeout(timer);
    }

    // Return undefined for the case where the condition is not met
    return undefined;
  }, []);

  const googleAnalyticsScriptUrl = getGoogleAnalyticsScriptUrl();

  return (
    <>
      {/* Google Analytics Scripts */}
      {isGoogleAnalyticsConfigured && googleAnalyticsScriptUrl && (
        <>
          <Script
            src={googleAnalyticsScriptUrl}
            strategy="afterInteractive"
            async
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('consent', 'default', {
                  analytics_storage: 'granted',
                  ad_storage: 'denied',
                  wait_for_update: 500,
                });
                gtag('config', '${ANALYTICS_CONFIG.googleAnalytics.measurementId}', {
                  page_title: document.title,
                  page_location: window.location.href,
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false,
                });
              `,
            }}
          />
        </>
      )}

      {/* Vercel Analytics - disabled until packages are installed */}
      {/* TODO: Install @vercel/analytics and @vercel/speed-insights packages */}
      {/* {isVercelAnalyticsConfigured && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )} */}

      {children}
    </>
  );
}

// Hook for analytics tracking
export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (isGoogleAnalyticsConfigured && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties);
    }
  };

  const trackPageView = (url: string, title?: string) => {
    if (isGoogleAnalyticsConfigured && typeof window !== 'undefined' && window.gtag) {
      const measurementId = ANALYTICS_CONFIG.googleAnalytics.measurementId;
      if (measurementId) {
        window.gtag('config', measurementId, {
          page_path: url,
          page_title: title ?? document.title,
          page_location: window.location.origin + url,
        });
      }
    }
  };

  return {
    trackEvent,
    trackPageView,
    isConfigured: isGoogleAnalyticsConfigured || isVercelAnalyticsConfigured,
  };
}

// Analytics status component for debugging
export function AnalyticsStatus() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>GA4: {isGoogleAnalyticsConfigured ? '✅' : '❌'}</div>
      <div>Vercel: {isVercelAnalyticsConfigured ? '✅' : '❌'}</div>
      {isGoogleAnalyticsConfigured && (
        <div>ID: {ANALYTICS_CONFIG.googleAnalytics.measurementId}</div>
      )}
    </div>
  );
}

export default AnalyticsProvider;
