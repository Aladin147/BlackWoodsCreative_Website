import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { Header, ScrollProgress } from '@/components/layout';
import { MagneticCursor } from '@/components/interactive';
import './globals.css';

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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="bg-bw-black font-primary text-bw-white antialiased">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-bw-gold focus:text-bw-black focus:rounded-md focus:font-medium"
        >
          Skip to main content
        </a>
        <MagneticCursor />
        <ScrollProgress />
        <Header />
        <main id="main-content" className="relative" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
