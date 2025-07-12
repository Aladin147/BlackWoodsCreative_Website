import { Crimson_Text, Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import { headers } from 'next/headers';

import type { Metadata } from 'next';

import { ClientProviders } from '@/components/providers/ClientProviders';
import { SimpleStructuredData } from '@/components/seo/SimpleStructuredData';

import '../styles/globals-enhanced.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  variable: '--font-secondary',
  display: 'swap',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-accent',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
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
    <html
      lang="en"
      className={`${inter.variable} ${crimsonText.variable} ${playfairDisplay.variable} ${jetbrains.variable}`}
    >
      <head>
        {nonce && <meta name="csp-nonce" content={nonce} />}
        {csrfToken && <meta name="csrf-token" content={csrfToken} />}
        <SimpleStructuredData metadata={metadata} />
      </head>
      <body className="bg-background-primary font-secondary text-text-primary antialiased transition-colors duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
