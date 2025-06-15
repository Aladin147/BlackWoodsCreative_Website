'use client';

import { motion } from 'framer-motion';
import { portfolioData } from '@/lib/data/portfolio';
import type { PortfolioProject } from '@/lib/types/portfolio';
import {
  MagneticField,
  ScrollReveal,
  ParallaxText,
  AdvancedPortfolioFilter
} from '@/components/interactive';

interface PortfolioSectionProps {
  className?: string;
}

// Use the AdvancedPortfolioFilter's expected interface
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  tags: string[];
  featured?: boolean;
}

const categories = ['All', 'Film', 'Photography', '3D Visualization', 'Scene Creation'];

export function PortfolioSection({ className }: PortfolioSectionProps) {
  // Convert portfolio data to AdvancedPortfolioFilter format
  const portfolioItems: PortfolioItem[] = portfolioData.map((project: PortfolioProject) => ({
    id: project.id,
    title: project.title,
    category: project.category,
    image: project.image,
    tags: project.tags ?? [project.category],
    featured: project.featured ?? false
  }));

  const handleItemClick = (item: PortfolioItem) => {
    // Handle portfolio item click - could open modal, navigate, etc.
    // Portfolio item interaction tracked
  };

  return (
    <section id="portfolio" className={`bg-bw-bg-primary px-6 py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {/* Advanced Section Header with Parallax */}
        <ScrollReveal className="text-center mb-20" direction="up" distance={80} delay={0.2}>
          <ParallaxText speed={0.2}>
            <h2 className="mb-8 text-display-lg font-display">
              Our <span className="text-bw-accent-gold">Portfolio</span>
            </h2>
          </ParallaxText>
          <ScrollReveal direction="up" distance={40} delay={0.4}>
            <p className="mx-auto max-w-3xl text-body-xl font-primary">
              Explore our diverse range of creative projects that showcase our expertise in visual storytelling and premium craftsmanship.
            </p>
          </ScrollReveal>
        </ScrollReveal>

        {/* Advanced Portfolio Filter System */}
        <AdvancedPortfolioFilter
          items={portfolioItems}
          categories={categories.slice(1)} // Remove 'All' as it's handled internally
          onItemClick={handleItemClick}
          className="mb-16"
        />

        {/* Advanced View More Button with Magnetic Effect */}
        <ScrollReveal className="text-center mt-16" direction="up" distance={30} delay={0.4}>
          <MagneticField strength={0.3} distance={120}>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-cursor="button"
            >
              View Full Portfolio
            </motion.button>
          </MagneticField>
        </ScrollReveal>
      </div>
    </section>
  );
}
