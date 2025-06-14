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
  StaggeredGrid
} from '@/components/interactive';

interface PortfolioSectionProps {
  className?: string;
}

const categories = ['All', 'Film', 'Photography', '3D Visualization', 'Scene Creation'];

export function PortfolioSection({ className }: PortfolioSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = portfolioData.filter(
    project => activeCategory === 'All' || project.category === activeCategory
  );

  return (
    <section id="portfolio" className={`bg-bw-bg-primary px-6 py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {/* Advanced Section Header with Parallax */}
        <ScrollReveal className="text-center mb-20" direction="up" distance={80} delay={0.2}>
          <ParallaxText speed={0.2}>
            <h2 className="mb-8 text-display-lg">
              Our <span className="text-bw-accent-gold">Portfolio</span>
            </h2>
          </ParallaxText>
          <ScrollReveal direction="up" distance={40} delay={0.4}>
            <p className="mx-auto max-w-3xl text-body-xl">
              Explore our diverse range of creative projects that showcase our expertise in visual storytelling and premium craftsmanship.
            </p>
          </ScrollReveal>
        </ScrollReveal>

        {/* Advanced Category Filter with Magnetic Effects */}
        <StaggeredGrid className="flex flex-wrap justify-center gap-4 mb-12" staggerDelay={0.1}>
          {categories.map((category, index) => (
            <MagneticField key={category} strength={0.2} distance={100}>
              <motion.button
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-offset-2 focus:ring-offset-bw-bg-primary cursor-pointer ${
                  activeCategory === category
                    ? 'bg-bw-accent-gold text-bw-bg-primary shadow-lg'
                    : 'bg-transparent text-bw-text-primary hover:text-bw-accent-gold border border-bw-border-subtle hover:border-bw-accent-gold hover:shadow-md'
                }`}
                aria-pressed={activeCategory === category}
                aria-label={`Filter portfolio by ${category}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-cursor="button"
              >
                {category}
              </motion.button>
            </MagneticField>
          ))}
        </StaggeredGrid>

        {/* Enhanced Portfolio Grid with Magnetic Effects */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
          role="region"
          aria-label={`Portfolio projects filtered by ${activeCategory}`}
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={`${activeCategory}-${project.id}`}
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -50 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                layout
              >
                <MagneticField strength={0.2}>
                  <HoverMagnify scale={1.03}>
                    <div data-cursor="portfolio">
                      <PortfolioCard project={project} data-testid="portfolio-card" />
                    </div>
                  </HoverMagnify>
                </MagneticField>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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
