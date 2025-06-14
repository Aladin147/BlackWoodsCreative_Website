'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/lib/data/portfolio';
import { PortfolioCard } from '@/components/ui/PortfolioCard';
import {
  HoverMagnify,
  MagneticField
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
        {/* Deep Forest Haze Section Header */}
        <div className="text-center mb-20">
          <h2 className="mb-8 text-display-lg">
            Our <span className="text-bw-accent-gold">Portfolio</span>
          </h2>
          <p className="mx-auto max-w-3xl text-body-xl">
            Explore our diverse range of creative projects that showcase our expertise in visual storytelling and premium craftsmanship.
          </p>
        </div>

        {/* Deep Forest Haze Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-offset-2 focus:ring-offset-bw-bg-primary ${
                activeCategory === category
                  ? 'bg-bw-accent-gold text-bw-bg-primary'
                  : 'bg-transparent text-bw-text-primary hover:text-bw-accent-gold border border-bw-border-subtle hover:border-bw-accent-gold'
              }`}
              aria-pressed={activeCategory === category}
              aria-label={`Filter portfolio by ${category}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

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

        {/* View More Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Full Portfolio
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
