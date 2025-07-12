/**
 * Google Analytics Component
 *
 * Simple component to integrate Google Analytics with the website
 */

'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import {
  initGA,
  trackPageView,
  ConsentManager,
  GADevUtils,
} from '@/lib/analytics/google-analytics';

interface GoogleAnalyticsProps {
  trackingId?: string;
}

export function GoogleAnalytics({ trackingId: _trackingId }: GoogleAnalyticsProps) {
  const pathname = usePathname();

  // Initialize GA on mount
  useEffect(() => {
    // Initialize consent management
    ConsentManager.initConsent();

    // Initialize GA
    initGA();

    // Log status in development
    if (process.env.NODE_ENV === 'development') {
      GADevUtils.logStatus();
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (pathname) {
      trackPageView(window.location.href, document.title);
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
}

// Cookie consent banner component
export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner if consent hasn't been given
    const hasConsent = ConsentManager.hasConsent();
    const hasDeclined = localStorage.getItem('ga_consent') === 'denied';

    if (!hasConsent && !hasDeclined) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    ConsentManager.grantConsent();
    setShowBanner(false);
  };

  const handleDecline = () => {
    ConsentManager.denyConsent();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="bg-bw-bg-secondary fixed bottom-0 left-0 right-0 z-50 border-t border-bw-border-subtle p-4 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-sm text-bw-text-secondary">
          <p>
            We use cookies to improve your experience and analyze website traffic. By accepting, you
            agree to our use of analytics cookies.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="hover:bg-bw-bg-tertiary rounded-lg border border-bw-border-subtle px-4 py-2 text-sm transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-bw-accent-gold px-4 py-2 text-sm text-black transition-colors hover:bg-bw-accent-gold/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for tracking business events
export function useBusinessTracking() {
  return {
    // Track contact form events
    trackContactForm: (action: 'start' | 'submit' | 'success' | 'error', details?: string) => {
      import('@/lib/analytics/google-analytics').then(({ BusinessTracking }) => {
        BusinessTracking.trackContactForm(action, details);
      });
    },

    // Track portfolio interactions
    trackPortfolio: (action: 'view' | 'click' | 'filter', item?: string) => {
      import('@/lib/analytics/google-analytics').then(({ BusinessTracking }) => {
        BusinessTracking.trackPortfolio(action, item);
      });
    },

    // Track service interactions
    trackService: (action: 'view' | 'inquiry', service?: string) => {
      import('@/lib/analytics/google-analytics').then(({ BusinessTracking }) => {
        BusinessTracking.trackService(action, service);
      });
    },

    // Track lead generation
    trackLead: (source: 'contact_form' | 'phone_call' | 'email', value?: number) => {
      import('@/lib/analytics/google-analytics').then(({ BusinessTracking }) => {
        BusinessTracking.trackLead(source, value);
      });
    },

    // Track conversions
    trackConversion: (
      type: 'quote_request' | 'consultation' | 'project_inquiry',
      value?: number
    ) => {
      import('@/lib/analytics/google-analytics').then(({ BusinessTracking }) => {
        BusinessTracking.trackConversion(type, value);
      });
    },

    // Track business goals
    trackBusinessGoal: (
      goal: 'newsletter_signup' | 'quote_request' | 'phone_click' | 'email_click'
    ) => {
      import('@/lib/analytics/google-analytics').then(({ BusinessInsights }) => {
        BusinessInsights.trackBusinessGoal(goal);
      });
    },
  };
}

// Component for tracking specific business interactions
export function BusinessTracker({
  children,
  event,
  category,
  label,
}: {
  children: React.ReactNode;
  event: string;
  category: string;
  label?: string;
}) {
  const handleClick = () => {
    import('@/lib/analytics/google-analytics').then(({ trackEvent }) => {
      trackEvent(event, category, label);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  return (
    <div onClick={handleClick} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
      {children}
    </div>
  );
}
