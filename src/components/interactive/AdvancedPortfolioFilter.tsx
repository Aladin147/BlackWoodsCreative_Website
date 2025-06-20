'use client';

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState, useMemo } from 'react';

import { useDeviceAdaptation } from '@/hooks/useDeviceAdaptation';

import { MagneticField } from './ParallaxContainer';

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
  className = '',
}: AdvancedPortfolioFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title' | 'category' | 'featured'>('featured');
  const { getAdaptiveMagneticProps } = useDeviceAdaptation();

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        item =>
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
    setActiveCategory(category);
  };

  const categoryButtonVariants = {
    inactive: {
      scale: 1,
      backgroundColor: 'transparent',
      color: 'var(--bw-text-secondary)',
      borderColor: 'var(--bw-border-subtle)',
    },
    active: {
      scale: 1.05,
      backgroundColor: 'var(--bw-accent-gold)',
      color: 'var(--bw-bg-primary)',
      borderColor: 'var(--bw-accent-gold)',
    },
    hover: {
      scale: 1.02,
      borderColor: 'var(--bw-accent-gold)',
      color: 'var(--bw-accent-gold)',
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      filter: 'blur(4px)',
    },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      filter: 'blur(4px)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Advanced Filter Controls */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative mx-auto max-w-md">
          <label htmlFor="portfolio-search" className="sr-only">
            Search portfolio projects
          </label>
          <MagneticField {...getAdaptiveMagneticProps(0.1, 80)}>
            <motion.input
              id="portfolio-search"
              type="text"
              placeholder="Search portfolio..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-bw-border-subtle bg-bw-border-subtle px-4 py-3 text-bw-text-primary placeholder-bw-text-secondary transition-all duration-300 focus:border-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold/20"
              whileFocus={{ scale: 1.02 }}
              data-cursor="input"
              aria-label="Search portfolio projects"
              aria-describedby="search-results-count"
            />
          </MagneticField>
        </div>

        {/* Category Filter Buttons */}
        <fieldset>
          <legend className="sr-only">Filter portfolio by category</legend>
          <LayoutGroup>
            <div
              className="flex flex-wrap justify-center gap-3"
              role="group"
              aria-label="Category filters"
            >
              {['All', ...categories].map(category => {
                const magneticProps = getAdaptiveMagneticProps(0.15, 100);

                return (
                  <MagneticField key={category} {...magneticProps}>
                    <motion.button
                      onClick={() => handleCategoryChange(category)}
                      className="relative rounded-full border-2 px-6 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-bw-accent-gold/50"
                      variants={categoryButtonVariants}
                      initial="inactive"
                      animate={activeCategory === category ? 'active' : 'inactive'}
                      whileHover="hover"
                      whileTap={{ scale: 0.95 }}
                      data-cursor="button"
                      layout
                      aria-pressed={activeCategory === category}
                      aria-label={`Filter by ${category} category`}
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
        </fieldset>

        {/* Sort Controls */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-bw-text-secondary">Sort by:</span>
          <div className="flex gap-2">
            {[
              { key: 'featured', label: 'Featured' },
              { key: 'title', label: 'Title' },
              { key: 'category', label: 'Category' },
            ].map(({ key, label }) => (
              <MagneticField key={key} {...getAdaptiveMagneticProps(0.1, 60)}>
                <motion.button
                  onClick={() => setSortBy(key as typeof sortBy)}
                  className={`rounded-md px-3 py-1 transition-all duration-300 ${
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
          id="search-results-count"
          className="text-center text-sm text-bw-text-secondary"
          key={filteredItems.length}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          role="status"
          aria-live="polite"
        >
          {filteredItems.length} {filteredItems.length === 1 ? 'project' : 'projects'} found
        </motion.div>
      </div>

      {/* Portfolio Grid with Advanced Animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeCategory}-${searchTerm}-${sortBy}`}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
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
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title} project in ${item.category} category`}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onItemClick?.(item);
                }
              }}
            >
              <MagneticField {...getAdaptiveMagneticProps(0.2, 120)}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-bw-border-subtle">
                  {/* Placeholder for image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-bw-aurora-teal/20 to-bw-aurora-green/20" />

                  {/* Featured Badge */}
                  {item.featured && (
                    <motion.div
                      className="absolute right-3 top-3 rounded-full bg-bw-accent-gold px-2 py-1 text-xs font-medium text-bw-bg-primary"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                    >
                      Featured
                    </motion.div>
                  )}

                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-bw-bg-primary/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div
                      className="text-center"
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="mb-2 text-lg font-semibold text-bw-text-primary">
                        {item.title}
                      </h3>
                      <p className="mb-3 text-sm text-bw-text-secondary">{item.category}</p>
                      <div className="flex flex-wrap justify-center gap-1">
                        {item.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="rounded-full bg-bw-accent-gold/20 px-2 py-1 text-xs text-bw-accent-gold"
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
          className="py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-2 text-lg text-bw-text-secondary">No projects found</div>
          <div className="text-sm text-bw-text-secondary">
            Try adjusting your search or filter criteria
          </div>
        </motion.div>
      )}
    </div>
  );
}
