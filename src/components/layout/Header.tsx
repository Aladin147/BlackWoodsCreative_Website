'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import { MagneticField } from '@/components/interactive';
import { Logo } from '@/components/ui/Logo';
import { siteConfig } from '@/lib/constants/siteConfig';
import { cn, scrollToElement, throttle } from '@/lib/utils';
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
          'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
          isScrolled
            ? 'border-b border-bw-border-subtle bg-bw-bg-primary/95 backdrop-blur-md'
            : 'bg-transparent',
          className
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo with Magnetic Effect */}
            <MagneticField strength={0.2} distance={100}>
              <Logo
                size="lg"
                onClick={() => handleNavClick('#hero')}
                priority={true}
                className="flex-shrink-0"
              />
            </MagneticField>

            {/* Desktop Navigation with Magnetic Effects */}
            <nav
              id="navigation"
              className="hidden items-center space-x-8 md:flex"
              role="navigation"
              aria-label="Main navigation"
            >
              {siteConfig.navigation.map((item, index) => (
                <MagneticField key={item.name} strength={0.15} distance={80}>
                  <motion.button
                    onClick={() => handleNavClick(item.href)}
                    aria-label={`Navigate to ${item.name} section`}
                    className="group relative cursor-pointer rounded-md px-2 py-1 font-medium text-bw-text-primary/70 transition-colors duration-300 hover:text-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.15 }}
                    whileHover={{ y: -1 }}
                    data-cursor="link"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-bw-accent-gold transition-all duration-300 group-hover:w-full" />
                  </motion.button>
                </MagneticField>
              ))}
            </nav>

            {/* Mobile Menu Button with Magnetic Effect */}
            <MagneticField strength={0.2} distance={70}>
              <motion.button
                className="relative flex h-6 w-6 cursor-pointer flex-col items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-bw-gold focus:ring-opacity-50 md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.98 }}
                aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                data-cursor="button"
              >
                <motion.span
                  className="h-0.5 w-6 bg-bw-black transition-all duration-300 dark:bg-bw-white"
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 0 : -4,
                  }}
                />
                <motion.span
                  className="h-0.5 w-6 bg-bw-black transition-all duration-300 dark:bg-bw-white"
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                  }}
                />
                <motion.span
                  className="h-0.5 w-6 bg-bw-black transition-all duration-300 dark:bg-bw-white"
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
              className="absolute inset-0 bg-bw-white/90 backdrop-blur-md dark:bg-bw-black/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              id="mobile-menu"
              className="relative flex h-full flex-col items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <nav
                className="flex flex-col items-center space-y-8"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {siteConfig.navigation.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    aria-label={`Navigate to ${item.name} section`}
                    className="rounded-md px-4 py-2 font-display text-display-md text-bw-black transition-all duration-300 hover:text-bw-gold focus:outline-none focus:ring-2 focus:ring-bw-gold focus:ring-opacity-50 dark:text-bw-white"
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
