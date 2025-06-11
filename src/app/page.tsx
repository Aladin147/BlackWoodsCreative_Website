import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import {
  AboutSection,
  ContactSection
} from '@/components/sections';
import { Footer } from '@/components/layout';

// Dynamically import heavy interactive sections
const HeroSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.HeroSection })),
  {
    loading: () => (
      <div className="h-screen bg-gradient-to-br from-bw-black via-bw-obsidian to-bw-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="text-display-xl text-gradient-gold font-display font-bold mb-4">
            BlackWoods Creative
          </div>
          <div className="text-body-xl text-bw-pearl">
            Loading...
          </div>
        </div>
      </div>
    )
  }
);

const PortfolioSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.PortfolioSection })),
  {
    loading: () => (
      <div className="bg-gradient-to-br from-bw-charcoal via-bw-dark-gray to-bw-charcoal px-6 py-32">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-8 text-display-lg text-bw-white">
            Our <span className="text-gradient-gold">Portfolio</span>
          </h2>
          <div className="text-bw-pearl">Loading portfolio...</div>
        </div>
      </div>
    )
  }
);

const VisionSection = dynamic(
  () => import('@/components/sections/VisionSection').then(mod => ({ default: mod.VisionSection })),
  {
    loading: () => (
      <div className="relative bg-bw-black min-h-screen flex items-center justify-center">
        <div className="text-center text-bw-white">
          <div className="text-display-xl font-display font-bold mb-4">
            Experience the Difference
          </div>
          <div className="text-bw-pearl">Loading vision...</div>
        </div>
      </div>
    )
  }
);

export const metadata: Metadata = {
  title: 'Home',
  description:
    'BlackWoods Creative - Premium visual storytelling through filmmaking, photography, and 3D visualization.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PortfolioSection />
      <VisionSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  );
}
