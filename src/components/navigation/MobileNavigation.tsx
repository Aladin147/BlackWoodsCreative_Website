'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ArrowLeftIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';

import { MagneticField } from '@/components/interactive';
import { CompactBreadcrumbs } from '@/components/seo/Breadcrumbs';
import { useMobileNavigation, useNavigationContext } from '@/hooks/useNavigationContext';

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className = '' }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mobileConfig = useMobileNavigation();
  const context = useNavigationContext();

  return (
    <div className={`lg:hidden ${className}`}>
      {/* Mobile Header Bar */}
      <div className="flex items-center justify-between border-b border-bw-border-subtle bg-bw-bg-primary px-4 py-3">
        {/* Back Button for Subpages */}
        {mobileConfig.showBackButton && (
          <MagneticField strength={0.2} distance={60}>
            <Link
              href={mobileConfig.backButtonHref}
              className="flex items-center space-x-2 text-sm text-bw-text-secondary transition-colors hover:text-bw-accent-gold"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </MagneticField>
        )}

        {/* Compact Breadcrumbs */}
        {mobileConfig.showCompactBreadcrumbs && (
          <div className="flex-1 px-4">
            <CompactBreadcrumbs />
          </div>
        )}

        {/* Menu Toggle */}
        <MagneticField strength={0.3} distance={80}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-bw-bg-secondary flex h-10 w-10 items-center justify-center rounded-lg border border-bw-border-subtle text-bw-text-primary transition-all duration-300 hover:border-bw-accent-gold hover:bg-bw-accent-gold hover:text-bw-bg-primary"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </MagneticField>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 bg-bw-bg-primary shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex h-full flex-col">
                {/* Menu Header */}
                <div className="flex items-center justify-between border-b border-bw-border-subtle p-4">
                  <h3 className="text-display-sm font-display text-bw-text-primary">Navigation</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-bw-text-secondary transition-colors hover:text-bw-accent-gold"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Current Page Info */}
                  <div className="bg-bw-bg-secondary mb-6 rounded-lg p-4">
                    <div className="text-sm text-bw-text-secondary">Current page</div>
                    <div className="font-medium text-bw-text-primary">
                      {getCurrentPageTitle(context.currentPath)}
                    </div>
                  </div>

                  {/* Related Links */}
                  {mobileConfig.showRelatedInSidebar && context.relatedLinks.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-3 text-sm font-medium text-bw-text-primary">
                        Related Pages
                      </h4>
                      <div className="space-y-2">
                        {context.relatedLinks.slice(0, mobileConfig.maxRelatedMobile).map(link => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block rounded-lg border border-bw-border-subtle bg-bw-bg-primary p-3 text-sm transition-all duration-300 hover:border-bw-accent-gold hover:bg-bw-accent-gold/5"
                          >
                            <div className="font-medium text-bw-text-primary">{link.text}</div>
                            {link.description && (
                              <div className="mt-1 text-xs text-bw-text-secondary">
                                {link.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-bw-text-primary">Quick Actions</h4>
                    <div className="space-y-2">
                      <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg bg-bw-accent-gold/10 p-3 text-sm font-medium text-bw-accent-gold transition-colors hover:bg-bw-accent-gold/20"
                      >
                        Go to Homepage
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg border border-bw-border-subtle p-3 text-sm font-medium text-bw-text-primary transition-all duration-300 hover:border-bw-accent-gold hover:bg-bw-accent-gold/5"
                      >
                        Contact Us
                      </Link>
                      <Link
                        href="/portfolio"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg border border-bw-border-subtle p-3 text-sm font-medium text-bw-text-primary transition-all duration-300 hover:border-bw-accent-gold hover:bg-bw-accent-gold/5"
                      >
                        View Portfolio
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Utility function to get readable page title
function getCurrentPageTitle(pathname: string): string {
  if (pathname === '/') return 'Homepage';

  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment) return 'Page';

  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Floating action button for mobile navigation
export function MobileNavigationFAB({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const context = useNavigationContext();

  // Only show on subpages
  if (!context.isSubpage) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-40 lg:hidden ${className}`}>
      <MagneticField strength={0.4} distance={100}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-bw-accent-gold text-bw-bg-primary shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          aria-label="Open navigation menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </MagneticField>

      {/* Quick menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 w-64 rounded-lg border border-bw-border-subtle bg-bw-bg-primary p-4 shadow-xl"
          >
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg bg-bw-accent-gold/10 p-3 text-sm font-medium text-bw-accent-gold"
              >
                Homepage
              </Link>
              {context.parentPath && (
                <Link
                  href={context.parentPath}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg border border-bw-border-subtle p-3 text-sm font-medium text-bw-text-primary"
                >
                  Back to {context.pageType === 'about' ? 'About' : 'Services'}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
