import { Metadata } from 'next';
import {
  HeroSection,
  PortfolioSection,
  AdvancedShowcase,
  AboutSection,
  ContactSection
} from '@/components/sections';
import { Footer } from '@/components/layout';

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
      <AdvancedShowcase />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  );
}
