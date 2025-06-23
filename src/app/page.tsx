import { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { Footer } from '@/components/layout';
import { AboutSection, ContactSection } from '@/components/sections';
import { componentPreloader } from '@/lib/utils/bundle-optimization';
import { generateEnhancedOrganizationSchema, BLACKWOODS_BRAND_VARIATIONS } from '@/lib/utils/seo';

// Optimized loading component
const LoadingSection = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-bw-bg-primary px-6 py-32">
    <div className="text-center">
      <div className="mb-4 text-display-xl">{title}</div>
      <div className="text-body-xl">{subtitle}</div>
      <div className="mt-4 animate-pulse">
        <div className="mx-auto h-2 w-32 rounded bg-bw-accent-gold/20" />
      </div>
    </div>
  </div>
);

// Optimized dynamic imports with individual chunk splitting
const HeroSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.HeroSection })),
  {
    loading: () => (
      <LoadingSection title="BlackWoods Creative" subtitle="Crafting Visual Stories..." />
    ),
  }
);

const PortfolioSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.PortfolioSection })),
  {
    loading: () => (
      <LoadingSection title="Our Portfolio" subtitle="Showcasing our finest work..." />
    ),
  }
);

const VisionSection = dynamic(
  () => import('@/components/sections/VisionSection').then(mod => ({ default: mod.VisionSection })),
  {
    loading: () => (
      <LoadingSection title="Experience the Difference" subtitle="Discovering our vision..." />
    ),
  }
);

// Register components for intelligent preloading
if (typeof window !== 'undefined') {
  componentPreloader.register('HeroSection', () =>
    import('@/components/sections/HeroSection').then((module) => module)
  );
  componentPreloader.register('PortfolioSection', () =>
    import('@/components/sections/PortfolioSection').then((module) => module)
  );
  componentPreloader.register('VisionSection', () =>
    import('@/components/sections/VisionSection').then((module) => module)
  );
}

export const metadata: Metadata = {
  title: 'BlackWoods Creative | Morocco\'s Premier Creative Studio | Video, Photography & 3D',
  description:
    'BlackWoods Creative - Morocco\'s leading creative studio specializing in premium video production, professional photography, 3D visualization, and visual storytelling. Discover BlackWoods\' award-winning creative services.',
  keywords: [
    ...BLACKWOODS_BRAND_VARIATIONS,
    'Morocco creative studio',
    'Morocco video production',
    'Morocco photography',
    'Morocco 3D visualization',
    'creative studio Morocco',
    'visual storytelling Morocco',
    'premium creative services',
    'professional video production',
    'corporate video Morocco',
    'brand films Morocco',
    'commercial photography',
    '3D modeling Morocco',
    'architectural visualization',
    'product photography Morocco',
    'creative agency Morocco',
    'film production Morocco'
  ],
  openGraph: {
    title: 'BlackWoods Creative | Morocco\'s Premier Creative Studio',
    description: 'Discover BlackWoods Creative - Morocco\'s leading studio for video production, photography, and 3D visualization. Premium creative services that bring your vision to life.',
    url: 'https://blackwoodscreative.com',
    siteName: 'BlackWoods Creative',
    images: [
      {
        url: '/assets/images/og-blackwoods-creative.jpg',
        width: 1200,
        height: 630,
        alt: 'BlackWoods Creative - Morocco\'s Premier Creative Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackWoods Creative | Morocco\'s Premier Creative Studio',
    description: 'Discover BlackWoods Creative - Morocco\'s leading studio for video production, photography, and 3D visualization.',
    images: ['/assets/images/twitter-blackwoods-creative.jpg'],
    creator: '@blackwoodscreative',
    site: '@blackwoodscreative',
  },
  alternates: {
    canonical: 'https://blackwoodscreative.com',
  },
  other: {
    'brand-keywords': 'BlackWoods, BlackWood, BlackWoods Creative, BlackWoods Morocco',
    'service-keywords': 'video production, photography, 3D visualization, creative services',
    'location-keywords': 'Morocco, Mohammedia, Casablanca, Rabat',
  },
};

export default function HomePage() {
  return (
    <>
      {/* Enhanced Organization Schema for Misspelling SEO Strategy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateEnhancedOrganizationSchema({
          "@type": ["Organization", "LocalBusiness"],
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "50"
          }
        })}
      />

      <HeroSection />
      <main id="main-content" role="main" aria-label="Main content">
        <PortfolioSection />
        <VisionSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
