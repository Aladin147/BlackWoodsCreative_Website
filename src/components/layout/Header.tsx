'use client';

import { useState, useEffect } from 'react';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

import { MagneticField } from '@/components/interactive';
import { Logo } from '@/components/ui/Logo';
import { siteConfig, type NavigationItem } from '@/lib/constants/siteConfig';
import { cn, throttle } from '@/lib/utils';
import {
  handleNavigationClick,
  getNavigationItems,
  isNavigationActive,
  getCurrentPath,
} from '@/lib/utils/navigation';
// import { useUISounds } from '@/hooks/useAudioSystem'; // Temporarily disabled

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // const { playHoverSound, playClickSound } = useUISounds(); // Temporarily disabled

  // Handle scroll effect for header background with throttling
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation clicks
  const handleNavClick = (href: string) => {
    // playClickSound(); // Temporarily disabled
    handleNavigationClick(href, () => setIsMobileMenuOpen(false));
  };

  // Get appropriate navigation items based on current page
  const navigationItems = getNavigationItems(siteConfig.navigation, siteConfig.homeNavigation);
  const currentPath = getCurrentPath();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    // Only run in browser environment
    if (typeof document === 'undefined') return;

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    // Only run in browser environment
    if (typeof document === 'undefined') return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }

    return undefined;
  }, [openDropdown]);

  return (
    <>
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
                onClick={() => handleNavClick('/')}
                priority
                className="flex-shrink-0"
              />
            </MagneticField>

            {/* Desktop Navigation with Dropdown Support */}
            <nav
              id="navigation"
              className="hidden items-center space-x-8 md:flex"
              role="navigation"
              aria-label="Main navigation"
            >
              {navigationItems.map((item, index) => (
                <div key={item.name} className="relative" data-dropdown>
                  <MagneticField strength={0.15} distance={80}>
                    {item.submenu ? (
                      // Dropdown menu item
                      <motion.button
                        onClick={() =>
                          setOpenDropdown(openDropdown === item.name ? null : item.name)
                        }
                        onMouseEnter={() => setOpenDropdown(item.name)}
                        onMouseLeave={() => setOpenDropdown(null)}
                        aria-label={`${item.name} menu`}
                        aria-expanded={openDropdown === item.name}
                        className={`group relative flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 font-medium transition-colors duration-300 hover:text-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50 ${
                          isNavigationActive(item.href, currentPath)
                            ? 'text-bw-accent-gold'
                            : 'text-bw-text-primary/70'
                        }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.15 }}
                        whileHover={{ y: -1 }}
                        data-cursor="link"
                      >
                        {item.name}
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openDropdown === item.name ? 'rotate-180' : ''
                          }`}
                        />
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 bg-bw-accent-gold transition-all duration-300 group-hover:w-full ${
                            isNavigationActive(item.href, currentPath) ? 'w-full' : 'w-0'
                          }`}
                        />
                      </motion.button>
                    ) : (
                      // Regular menu item
                      <motion.button
                        onClick={() => handleNavClick(item.href)}
                        aria-label={`Navigate to ${item.name}`}
                        className={`group relative cursor-pointer rounded-md px-2 py-1 font-medium transition-colors duration-300 hover:text-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50 ${
                          isNavigationActive(item.href, currentPath)
                            ? 'text-bw-accent-gold'
                            : 'text-bw-text-primary/70'
                        }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.15 }}
                        whileHover={{ y: -1 }}
                        data-cursor="link"
                      >
                        {item.name}
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 bg-bw-accent-gold transition-all duration-300 group-hover:w-full ${
                            isNavigationActive(item.href, currentPath) ? 'w-full' : 'w-0'
                          }`}
                        />
                      </motion.button>
                    )}
                  </MagneticField>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.submenu && openDropdown === item.name && (
                      <motion.div
                        className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-bw-border-subtle bg-bw-bg-primary/95 shadow-lg backdrop-blur-md"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setOpenDropdown(item.name)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <div className="py-2">
                          {item.submenu.map((subItem: NavigationItem, subIndex: number) => (
                            <motion.button
                              key={subItem.name}
                              onClick={() => {
                                handleNavClick(subItem.href);
                                setOpenDropdown(null);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-bw-text-primary transition-colors duration-200 hover:bg-bw-accent-gold/10 hover:text-bw-accent-gold focus:bg-bw-accent-gold/10 focus:outline-none"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                            >
                              <div className="font-medium">{subItem.name}</div>
                              {subItem.description && (
                                <div className="mt-1 text-xs text-bw-text-secondary">
                                  {subItem.description}
                                </div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                  className="h-0.5 w-6 bg-bw-text-primary transition-all duration-300"
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 0 : -4,
                  }}
                />
                <motion.span
                  className="h-0.5 w-6 bg-bw-text-primary transition-all duration-300"
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                  }}
                />
                <motion.span
                  className="h-0.5 w-6 bg-bw-text-primary transition-all duration-300"
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
              className="absolute inset-0 bg-bw-bg-primary/95 backdrop-blur-md"
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
                className="flex max-h-[70vh] flex-col items-center space-y-6 overflow-y-auto"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {navigationItems.map((item, index) => (
                  <div key={item.name} className="flex flex-col items-center">
                    <motion.button
                      onClick={() => {
                        if (item.submenu) {
                          setOpenDropdown(openDropdown === item.name ? null : item.name);
                        } else {
                          handleNavClick(item.href);
                        }
                      }}
                      aria-label={item.submenu ? `${item.name} menu` : `Navigate to ${item.name}`}
                      className={`flex items-center gap-2 rounded-md px-4 py-2 font-display text-display-md transition-all duration-300 hover:text-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50 ${
                        isNavigationActive(item.href, currentPath)
                          ? 'text-bw-accent-gold'
                          : 'text-bw-text-primary'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                      {item.submenu && (
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openDropdown === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </motion.button>

                    {/* Mobile Submenu */}
                    <AnimatePresence>
                      {item.submenu && openDropdown === item.name && (
                        <motion.div
                          className="mt-4 flex flex-col items-center space-y-3"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.submenu.map((subItem: NavigationItem, subIndex: number) => (
                            <motion.button
                              key={subItem.name}
                              onClick={() => {
                                handleNavClick(subItem.href);
                                setOpenDropdown(null);
                              }}
                              className="rounded-md px-3 py-2 text-sm text-bw-text-secondary transition-colors duration-200 hover:text-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                            >
                              {subItem.name}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
