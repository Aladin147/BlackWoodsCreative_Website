import type { Metadata } from 'next';
import { Inter, Urbanist, JetBrains_Mono } from 'next/font/google';
import { headers } from 'next/headers';

import { GoogleAnalytics, CookieConsentBanner } from '@/components/analytics/GoogleAnalytics';
import DevelopmentMonitors from '@/components/development/DevelopmentMonitors';
// Test direct imports to bypass barrel export issues
import { AtmosphericParticles } from '@/components/interactive/AtmosphericParticles';
import { MagneticCursor } from '@/components/interactive/MagneticCursor';
import { Header, ScrollProgress } from '@/components/layout';
import { ContextAwareBreadcrumbs } from '@/components/layout/ContextAwareBreadcrumbs';
import { CoreWebVitalsOptimizer } from '@/components/optimization/CoreWebVitalsOptimizer';
import { SimpleStructuredData } from '@/components/seo/SimpleStructuredData';
import { ThemeProvider } from '@/context/ThemeContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
});

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'], // Include Black (900) for maximum impact
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'BlackWoods Creative | Premium Visual Storytelling',
    template: '%s | BlackWoods Creative',
  },
  description:
    'BlackWoods Creative specializes in filmmaking, photography, cinema, arts, 3D printing, and scene creation. Professional visual storytelling that captivates and converts.',
  keywords: [
    'filmmaking',
    'photography',
    'creative agency',
    '3D visualization',
    'scene creation',
    'video production',
    'visual storytelling',
  ],
  authors: [{ name: 'BlackWoods Creative' }],
  creator: 'BlackWoods Creative',
  publisher: 'BlackWoods Creative',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://blackwoodscreative.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blackwoodscreative.com',
    title: 'BlackWoods Creative | Premium Visual Storytelling',
    description:
      'Professional filmmaking, photography, and 3D visualization services. Crafting visual stories that captivate and convert.',
    siteName: 'BlackWoods Creative',
    images: [
      {
        url: '/assets/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BlackWoods Creative - Visual Storytelling',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackWoods Creative | Premium Visual Storytelling',
    description:
      'Professional filmmaking, photography, and 3D visualization services. Crafting visual stories that captivate and convert.',
    images: ['/assets/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE ?? '',
  },
  icons: {
    // Google Search Results Optimized Favicon Configuration
    icon: [
      // Primary favicon.ico in site root for Google search results
      {
        url: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // Modern SVG favicon for scalable display
      {
        url: '/assets/icons/favicon.svg',
        type: 'image/svg+xml',
      },
      // Standard PNG sizes for optimal display
      {
        url: '/assets/icons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/assets/icons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/assets/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/assets/icons/favicon.svg',
        color: '#D4AF37',
      },
      {
        rel: 'manifest',
        url: '/manifest.json',
      },
    ],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Get nonce and CSRF token from middleware headers
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') ?? undefined;
  const csrfToken = headersList.get('x-csrf-token') ?? undefined;

  return (
    <html lang="en" className={`${inter.variable} ${urbanist.variable} ${jetbrains.variable}`}>
      <head>
        {nonce && <meta name="csp-nonce" content={nonce} />}
        {csrfToken && <meta name="csrf-token" content={csrfToken} />}
        <SimpleStructuredData metadata={metadata} />
      </head>
      <body className="bg-bw-bg-primary font-primary text-bw-text-primary antialiased transition-colors duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
        <ThemeProvider>
          <div>
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bw-accent-gold focus:px-4 focus:py-2 focus:font-medium focus:text-bw-bg-primary"
            >
              Skip to main content
            </a>
            <CoreWebVitalsOptimizer />
            <AtmosphericParticles />
            <MagneticCursor />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
