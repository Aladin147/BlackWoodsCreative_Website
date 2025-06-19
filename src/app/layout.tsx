import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { Header, ScrollProgress } from '@/components/layout';
import { StructuredData } from '@/components/seo/StructuredData';
import { ThemeProvider } from '@/context/ThemeContext';
import { headers } from 'next/headers';
import dynamic from 'next/dynamic';
import './globals.css';

// Optimized dynamic imports with retry logic and preloading
const MagneticCursor = dynamic(
  () => import('@/components/interactive').then(mod => ({ default: mod.MagneticCursor })),
  {
    ssr: false,
    loading: () => null
  }
);

const AtmosphericParticles = dynamic(
  () => import('@/components/interactive').then(mod => ({ default: mod.AtmosphericParticles })),
  {
    ssr: false,
    loading: () => null
  }
);

// Performance monitoring (production only, smaller bundle)
const PerformanceReporter = dynamic(
  () => {
    if (process.env.NODE_ENV !== 'production') {
      return Promise.resolve({ default: () => null });
    }
    return import('@/lib/utils/performance-monitor').then(mod => ({
      default: function PerformanceReporter() {
        if (typeof window !== 'undefined') {
          const monitor = mod.getPerformanceMonitor();
          // Report metrics after page load
          setTimeout(() => monitor.reportMetrics(), 3000);
        }
        return null;
      }
    }));
  },
  { ssr: false }
);

// Development monitoring components (development only)
const DevelopmentMonitors = dynamic(
  () => {
    if (process.env.NODE_ENV !== 'development') {
      return Promise.resolve({ default: () => null });
    }
    return Promise.all([
      import('@/hooks/useAnimationPerformance'),
      import('@/hooks/useDeviceAdaptation')
    ]).then(([animMod, deviceMod]) => ({
      default: function DevelopmentMonitors() {
        const AnimationMonitor = animMod.AnimationPerformanceMonitor;
        const DeviceMonitor = deviceMod.DeviceAdaptationMonitor;
        return (
          <>
            <AnimationMonitor />
            <DeviceMonitor />
          </>
        );
      }
    }));
  },
  { ssr: false }
);

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
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
    google: process.env.GOOGLE_VERIFICATION_CODE || '',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Get nonce and CSRF token from middleware headers
  const headersList = headers();
  const nonce = headersList.get('x-nonce') || undefined;
  const csrfToken = headersList.get('x-csrf-token') || undefined;

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <head>
        {nonce && <meta name="csp-nonce" content={nonce} />}
        {csrfToken && <meta name="csrf-token" content={csrfToken} />}
      </head>
      <body className="bg-bw-bg-primary text-bw-text-primary font-primary antialiased transition-colors duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
        <ThemeProvider>
          <div>
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-bw-accent-gold focus:text-bw-bg-primary focus:rounded-md focus:font-medium"
            >
              Skip to main content
            </a>
            <AtmosphericParticles />
            <MagneticCursor />
            <ScrollProgress />
            <Header />
            <main id="main-content" className="relative" role="main">
              {children}
            </main>
            <PerformanceReporter />
            <DevelopmentMonitors />
          </div>
        </ThemeProvider>
      </body>
      <StructuredData metadata={metadata} />
    </html>
  );
}
