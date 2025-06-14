'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/lib/data/portfolio';
import { PortfolioCard } from '@/components/ui/PortfolioCard';
import {
  HoverMagnify,
  MagneticField,
  ScrollReveal,
  ParallaxText,
  StaggeredGrid,
  AdvancedPortfolioFilter
} from '@/components/interactive';

interface PortfolioSectionProps {
  className?: string;
}

const categories = ['All', 'Film', 'Photography', '3D Visualization', 'Scene Creation'];

export function PortfolioSection({ className }: PortfolioSectionProps) {
  // Convert portfolio data to AdvancedPortfolioFilter format
  const portfolioItems = portfolioData.map(project => ({
    id: project.id,
    title: project.title,
    category: project.category,
    image: project.image,
    tags: project.tags || [project.category],
    featured: project.featured || false
  }));

  const handleItemClick = (item: any) => {
    // Handle portfolio item click - could open modal, navigate, etc.
    console.log('Portfolio item clicked:', item);
  };

  return (
    <section id="portfolio" className={`bg-bw-bg-primary px-6 py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {/* Advanced Section Header with Parallax */}
        <ScrollReveal className="text-center mb-20" direction="up" distance={80} delay={0.2}>
          <ParallaxText speed={0.2}>
            <h2 className="mb-8 text-heading-2 font-display">
              Our <span className="text-bw-accent-gold">Portfolio</span>
            </h2>
          </ParallaxText>
          <ScrollReveal direction="up" distance={40} delay={0.4}>
            <p className="mx-auto max-w-3xl text-body-text font-primary opacity-85">
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
