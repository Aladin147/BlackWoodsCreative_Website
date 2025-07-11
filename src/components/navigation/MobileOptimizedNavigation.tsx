/**
 * Mobile Optimized Navigation
 *
 * A simplified, mobile-first navigation component focused on usability
 */

'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Bars3Icon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';

import { useMobileDevice, MobileStyles, MobileInteractions } from '@/lib/utils/mobile-optimization';

interface MobileNavItem {
  href: string;
  label: string;
  isActive?: boolean;
}

const navigationItems: MobileNavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

export function MobileOptimizedNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const deviceInfo = useMobileDevice();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Don't render on desktop
  if (!deviceInfo.isMobile) {
    return null;
  }

  const isSubpage = pathname !== '/' && pathname && pathname.split('/').length > 2;
  const parentPath = isSubpage && pathname ? `/${pathname.split('/')[1]}` : '/';

  return (
    <>
      {/* Mobile Header */}
      <div
        className={`fixed left-0 right-0 top-0 z-40 border-b border-bw-border-subtle bg-bw-bg-primary/95 backdrop-blur-sm ${deviceInfo.hasNotch ? 'pt-safe-top' : ''}`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Back button for subpages */}
          {isSubpage && (
            <Link
              href={parentPath}
              className={`flex items-center gap-2 text-bw-text-secondary transition-colors hover:text-bw-accent-gold ${MobileStyles.touchTarget()}`}
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-sm">Back</span>
            </Link>
          )}

          {/* Logo/Brand */}
          <Link href="/" className="flex-1 text-center">
            <span className="text-lg font-semibold text-bw-text-primary">BlackWoods Creative</span>
          </Link>

          {/* Menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center text-bw-text-primary transition-colors hover:text-bw-accent-gold ${MobileStyles.touchTarget()} ${MobileInteractions.touchButton}`}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsOpen(false)}
          >
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-bw-bg-primary shadow-xl ${deviceInfo.hasNotch ? 'pt-safe-top' : ''}`}
              onClick={e => e.stopPropagation()}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between border-b border-bw-border-subtle p-4">
                <h2 className="text-lg font-semibold text-bw-text-primary">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-center text-bw-text-secondary transition-colors hover:text-bw-accent-gold ${MobileStyles.touchTarget()} ${MobileInteractions.touchButton}`}
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col p-4">
                {navigationItems.map(item => {
                  const isActive =
                    pathname === item.href || (item.href !== '/' && pathname && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center rounded-lg px-4 py-4 transition-colors ${MobileStyles.touchTarget()} ${MobileInteractions.touchButton} ${
                        isActive
                          ? 'border-l-4 border-bw-accent-gold bg-bw-accent-gold/10 text-bw-accent-gold'
                          : 'hover:bg-bw-bg-secondary text-bw-text-primary hover:text-bw-accent-gold'
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Contact Info */}
              <div className="mt-auto border-t border-bw-border-subtle p-4">
                <div className="space-y-3">
                  <a
                    href="tel:+212-XXX-XXXXXX"
                    className={`flex items-center gap-3 text-bw-text-secondary transition-colors hover:text-bw-accent-gold ${MobileStyles.touchTarget()}`}
                  >
                    <span className="text-sm">📞 Call Us</span>
                  </a>
                  <a
                    href="mailto:hello@blackwoodscreative.com"
                    className={`flex items-center gap-3 text-bw-text-secondary transition-colors hover:text-bw-accent-gold ${MobileStyles.touchTarget()}`}
                  >
                    <span className="text-sm">✉️ Email Us</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className={`h-16 ${deviceInfo.hasNotch ? 'pt-safe-top' : ''}`} />
    </>
  );
}

// Mobile-optimized breadcrumbs
export function MobileBreadcrumbs() {
  const pathname = usePathname();
  const deviceInfo = useMobileDevice();

  if (!deviceInfo.isMobile || pathname === '/' || !pathname) {
    return null;
  }

  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    ...pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const label = `${segment.charAt(0).toUpperCase()}${segment.slice(1).replace(/-/g, ' ')}`;
      return { href, label };
    }),
  ];

  return (
    <nav className="bg-bw-bg-secondary/50 px-4 py-2">
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            {index > 0 && <span className="mx-2 text-bw-text-secondary">/</span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-bw-text-secondary">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-bw-accent-gold hover:underline">
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

// Mobile-optimized footer navigation
export function MobileFooterNavigation() {
  const pathname = usePathname();
  const deviceInfo = useMobileDevice();

  if (!deviceInfo.isMobile) {
    return null;
  }

  const quickActions = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/portfolio', label: 'Work', icon: '🎨' },
    { href: '/services', label: 'Services', icon: '⚡' },
    { href: '/contact', label: 'Contact', icon: '📞' },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 border-t border-bw-border-subtle bg-bw-bg-primary/95 backdrop-blur-sm ${deviceInfo.hasNotch ? 'pb-safe-bottom' : ''}`}
    >
      <div className="flex items-center justify-around py-2">
        {quickActions.map(action => {
          const isActive =
            pathname === action.href || (action.href !== '/' && pathname && pathname.startsWith(action.href));

          return (
            <Link
              key={action.href}
              href={action.href}
              className={`flex flex-col items-center justify-center rounded-lg px-3 py-2 transition-colors ${MobileStyles.touchTarget()} ${MobileInteractions.touchButton} ${
                isActive
                  ? 'text-bw-accent-gold'
                  : 'text-bw-text-secondary hover:text-bw-accent-gold'
              }`}
            >
              <span className="mb-1 text-lg">{action.icon}</span>
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
