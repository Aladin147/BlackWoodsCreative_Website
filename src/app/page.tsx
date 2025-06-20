import { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { Footer } from '@/components/layout';
import { AboutSection, ContactSection } from '@/components/sections';
import { componentPreloader } from '@/lib/utils/bundle-optimization';

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
    import('@/components/sections/HeroSection').then(() => {})
  );
  componentPreloader.register('PortfolioSection', () =>
    import('@/components/sections/PortfolioSection').then(() => {})
  );
  componentPreloader.register('VisionSection', () =>
    import('@/components/sections/VisionSection').then(() => {})
  );
}

export const metadata: Metadata = {
  title: 'Home',
  description:
    'BlackWoods Creative - Premium visual storytelling through filmmaking, photography, and 3D visualization.',
};

export default function HomePage() {
  return (
    <>
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
