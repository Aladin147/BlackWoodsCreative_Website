'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/lib/constants/siteConfig';
import { cn, scrollToElement, throttle } from '@/lib/utils';

import { MagneticField } from '@/components/interactive';
// import { useUISounds } from '@/hooks/useAudioSystem'; // Temporarily disabled

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const { playHoverSound, playClickSound } = useUISounds(); // Temporarily disabled

  // Handle scroll effect for header background with throttling
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scroll to sections
  const handleNavClick = (href: string) => {
    // playClickSound(); // Temporarily disabled
    scrollToElement(href, 80); // 80px offset for fixed header
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Skip Links for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>

      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-bw-bg-primary/95 backdrop-blur-md border-b border-bw-border-subtle'
            : 'bg-transparent',
          className
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo with Magnetic Effect */}
            <MagneticField strength={0.2} distance={100}>
              <motion.div
                className="flex-shrink-0 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  onClick={() => handleNavClick('#hero')}
                  className="text-bw-text-primary hover:text-bw-accent-gold transition-colors duration-300 cursor-pointer"
                  data-cursor="button"
                  aria-label="BlackWoods Creative - Go to homepage"
                  title="BlackWoods Creative - Go to homepage"
                >
                  <span className="text-display-lg font-display text-bw-accent-gold">
                    BlackWoods Creative
                  </span>
                </button>
              </motion.div>
            </MagneticField>

            {/* Desktop Navigation with Magnetic Effects */}
            <nav id="navigation" className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              {siteConfig.navigation.map((item, index) => (
                <MagneticField key={item.name} strength={0.15} distance={80}>
                  <motion.button
                    onClick={() => handleNavClick(item.href)}
                    aria-label={`Navigate to ${item.name} section`}
                    className="text-bw-text-primary/70 hover:text-bw-accent-gold font-medium transition-colors duration-300 relative group focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50 rounded-md px-2 py-1 cursor-pointer"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.15 }}
                    whileHover={{ y: -1 }}
                    data-cursor="link"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-bw-accent-gold transition-all duration-300 group-hover:w-full" />
                  </motion.button>
                </MagneticField>
              ))}
            </nav>



            {/* Mobile Menu Button with Magnetic Effect */}
            <MagneticField strength={0.2} distance={70}>
              <motion.button
                className="md:hidden relative w-6 h-6 flex flex-col justify-center items-center focus:outline-none focus:ring-2 focus:ring-bw-gold focus:ring-opacity-50 rounded-md p-2 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.98 }}
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                data-cursor="button"
            >
                <motion.span
                  className="w-6 h-0.5 bg-bw-black dark:bg-bw-white transition-all duration-300"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 0 : -4,
                }}
              />
                <motion.span
                  className="w-6 h-0.5 bg-bw-black dark:bg-bw-white transition-all duration-300"
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
              />
                <motion.span
                  className="w-6 h-0.5 bg-bw-black dark:bg-bw-white transition-all duration-300"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? 0 : 4,
                }}
              />
              </motion.button>
            </MagneticField>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-bw-white/90 dark:bg-bw-black/90 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              id="mobile-menu"
              className="relative flex flex-col items-center justify-center h-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <nav className="flex flex-col items-center space-y-8" role="navigation" aria-label="Mobile navigation">
                {siteConfig.navigation.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    aria-label={`Navigate to ${item.name} section`}
                    className="text-bw-black dark:text-bw-white text-display-md font-display hover:text-bw-gold focus:outline-none focus:ring-2 focus:ring-bw-gold focus:ring-opacity-50 rounded-md px-4 py-2 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.button>
                ))}


              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
