'use client';

import React from 'react';

import { GoogleAnalytics, CookieConsentBanner } from '@/components/analytics/GoogleAnalytics';
import DevelopmentMonitors from '@/components/development/DevelopmentMonitors';
import { ClientOnlyInteractives } from '@/components/interactive/ClientOnlyInteractives';
import { ContextAwareBreadcrumbs } from '@/components/layout/ContextAwareBreadcrumbs';
import { Header } from '@/components/layout/Header';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { CoreWebVitalsOptimizer } from '@/components/optimization/CoreWebVitalsOptimizer';
import { AnimationProviders } from '@/components/providers/AnimationProviders';
import { ThemeProvider } from '@/context/ThemeContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side wrapper for all client components and providers
 * This component handles the server/client boundary for all client-side functionality
 * preventing webpack module loading issues in Next.js 15
 */
export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <AnimationProviders>
        <div>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bw-accent-gold focus:px-4 focus:py-2 focus:font-medium focus:text-bw-bg-primary"
          >
            Skip to main content
          </a>
          <CoreWebVitalsOptimizer />
          {/* Client-only interactive components */}
          <ClientOnlyInteractives />
          <ScrollProgress />
          <Header />

          {/* Context-Aware Breadcrumb Navigation */}
          <ContextAwareBreadcrumbs />

          <main id="main-content" className="relative">
            {children}
          </main>
          <DevelopmentMonitors />

          {/* Analytics and Business Features */}
          <GoogleAnalytics />
          <CookieConsentBanner />
        </div>
      </AnimationProviders>
    </ThemeProvider>
  );
}
