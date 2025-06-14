'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { MagneticField } from './ParallaxContainer';
import { useDeviceAdaptation } from '@/hooks/useDeviceAdaptation';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  tags: string[];
  featured?: boolean;
}

interface AdvancedPortfolioFilterProps {
  items: PortfolioItem[];
  categories: string[];
  onItemClick?: (item: PortfolioItem) => void;
  className?: string;
}

export function AdvancedPortfolioFilter({
  items,
  categories,
  onItemClick,
  className = ''
}: AdvancedPortfolioFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title' | 'category' | 'featured'>('featured');
  const [isAnimating, setIsAnimating] = useState(false);
  const { getAdaptiveMagneticProps, deviceInfo } = useDeviceAdaptation();

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, activeCategory, searchTerm, sortBy]);

  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;
    
    setIsAnimating(true);
    setActiveCategory(category);
    
    // Reset animation flag after transition
    setTimeout(() => setIsAnimating(false), 600);
  };

  const categoryButtonVariants = {
    inactive: {
      scale: 1,
      backgroundColor: 'transparent',
      color: 'var(--bw-text-secondary)',
      borderColor: 'var(--bw-border-subtle)'
    },
    active: {
      scale: 1.05,
      backgroundColor: 'var(--bw-accent-gold)',
      color: 'var(--bw-bg-primary)',
      borderColor: 'var(--bw-accent-gold)'
    },
    hover: {
      scale: 1.02,
      borderColor: 'var(--bw-accent-gold)',
      color: 'var(--bw-accent-gold)'
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      filter: 'blur(4px)'
    },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }),
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      filter: 'blur(4px)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Advanced Filter Controls */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <MagneticField {...getAdaptiveMagneticProps(0.1, 80)}>
            <motion.input
              type="text"
              placeholder="Search portfolio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-bw-border-subtle border border-bw-border-subtle rounded-full text-bw-text-primary placeholder-bw-text-secondary focus:outline-none focus:border-bw-accent-gold focus:ring-2 focus:ring-bw-accent-gold/20 transition-all duration-300"
              whileFocus={{ scale: 1.02 }}
              data-cursor="input"
            />
          </MagneticField>
        </div>

        {/* Category Filter Buttons */}
        <LayoutGroup>
          <div className="flex flex-wrap justify-center gap-3">
            {['All', ...categories].map((category) => {
              const magneticProps = getAdaptiveMagneticProps(0.15, 100);
              
              return (
                <MagneticField key={category} {...magneticProps}>
                  <motion.button
                    onClick={() => handleCategoryChange(category)}
                    className="relative px-6 py-3 rounded-full border-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-bw-accent-gold/50"
                    variants={categoryButtonVariants}
                    initial="inactive"
                    animate={activeCategory === category ? 'active' : 'inactive'}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    data-cursor="button"
                    layout
                  >
                    {category}
                    {activeCategory === category && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-bw-accent-gold"
                        layoutId="activeCategory"
                        style={{ zIndex: -1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      />
                    )}
                  </motion.button>
                </MagneticField>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Sort Controls */}
        <div className="flex justify-center items-center gap-4 text-sm">
          <span className="text-bw-text-secondary">Sort by:</span>
          <div className="flex gap-2">
            {[
              { key: 'featured', label: 'Featured' },
              { key: 'title', label: 'Title' },
              { key: 'category', label: 'Category' }
            ].map(({ key, label }) => (
              <MagneticField key={key} {...getAdaptiveMagneticProps(0.1, 60)}>
                <motion.button
                  onClick={() => setSortBy(key as typeof sortBy)}
                  className={`px-3 py-1 rounded-md transition-all duration-300 ${
                    sortBy === key
                      ? 'bg-bw-accent-gold text-bw-bg-primary'
                      : 'text-bw-text-secondary hover:text-bw-accent-gold'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-cursor="button"
                >
                  {label}
                </motion.button>
              </MagneticField>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <motion.div
          className="text-center text-bw-text-secondary text-sm"
          key={filteredItems.length}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredItems.length} {filteredItems.length === 1 ? 'project' : 'projects'} found
        </motion.div>
      </div>

      {/* Portfolio Grid with Advanced Animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeCategory}-${searchTerm}-${sortBy}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              variants={itemVariants}
              layout
              className="group cursor-pointer"
              onClick={() => onItemClick?.(item)}
              data-cursor="portfolio"
            >
              <MagneticField {...getAdaptiveMagneticProps(0.2, 120)}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-bw-border-subtle">
                  {/* Placeholder for image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-bw-aurora-teal/20 to-bw-aurora-green/20" />
                  
                  {/* Featured Badge */}
                  {item.featured && (
                    <motion.div
                      className="absolute top-3 right-3 px-2 py-1 bg-bw-accent-gold text-bw-bg-primary text-xs font-medium rounded-full"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                    >
                      Featured
                    </motion.div>
                  )}
                  
                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-bw-bg-primary/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div
                      className="text-center"
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-bw-text-primary mb-2">
                        {item.title}
                      </h3>
                      <p className="text-bw-text-secondary text-sm mb-3">
                        {item.category}
                      </p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-bw-accent-gold/20 text-bw-accent-gold text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </MagneticField>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-bw-text-secondary text-lg mb-2">No projects found</div>
          <div className="text-bw-text-secondary text-sm">
            Try adjusting your search or filter criteria
          </div>
        </motion.div>
      )}
    </div>
  );
}
