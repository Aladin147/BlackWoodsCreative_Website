'use client';

import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowUpIcon,
  CameraIcon,
  BriefcaseIcon,
  FilmIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react';

import { MagneticField, ScrollReveal } from '@/components/interactive';
import { siteConfig } from '@/lib/constants/siteConfig';
import { handleNavigationClick, getNavigationItems } from '@/lib/utils/navigation';

interface FooterProps {
  className?: string;
}

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/blackwoodscreative',
    icon: CameraIcon,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/blackwoodscreative',
    icon: BriefcaseIcon,
  },
  {
    name: 'Vimeo',
    href: 'https://vimeo.com/blackwoodscreative',
    icon: FilmIcon,
  },
  {
    name: 'Behance',
    href: 'https://behance.net/blackwoodscreative',
    icon: PaintBrushIcon,
  },
];

// Use unified navigation for consistency
const getQuickLinks = () => {
  const navigationItems = getNavigationItems(siteConfig.navigation, siteConfig.homeNavigation);
  return navigationItems.map((item: any) => ({
    name: item.name,
    href: item.href
  }));
};

const services = ['Brand Films', 'Product Photography', '3D Visualization', 'Scene Creation'];

export function Footer({ className }: FooterProps) {
  const quickLinks = getQuickLinks();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      handleNavigationClick(href);
    }
  };

  return (
    <footer className={`border-t border-bw-border-subtle bg-bw-bg-primary ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info with Magnetic Effects */}
          <ScrollReveal direction="up" distance={40} delay={0.1}>
            <MagneticField strength={0.1} distance={150}>
              <div className="lg:col-span-1">
                <h3 className="mb-4 font-display text-display-md text-bw-text-primary">
                  BlackWoods Creative
                </h3>
                <p className="mb-6 text-body-xl text-bw-text-secondary">
                  Premium visual storytelling through filmmaking, photography, and 3D visualization.
                  Creating compelling narratives that captivate and convert.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-bw-text-secondary">
                    <EnvelopeIcon className="h-5 w-5 text-bw-accent-gold" />
                    <span className="text-sm">hello@blackwoodscreative.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-bw-text-secondary">
                    <PhoneIcon className="h-5 w-5 text-bw-accent-gold" />
                    <span className="text-sm">+212 625 55 37 68</span>
                  </div>
                  <div className="flex items-center gap-3 text-bw-text-secondary">
                    <MapPinIcon className="h-5 w-5 text-bw-accent-gold" />
                    <span className="text-sm">
                      MFADEL Business Center, Building O, Floor 5. Mohammedia Morocco
                    </span>
                  </div>
                </div>
              </div>
            </MagneticField>
          </ScrollReveal>

          {/* Quick Links with Magnetic Effects */}
          <ScrollReveal direction="up" distance={40} delay={0.2}>
            <div>
              <h4 className="mb-4 font-semibold text-bw-text-primary">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map(link => (
                  <motion.li key={link.name}>
                    <MagneticField strength={0.1} distance={80}>
                      <motion.button
                        onClick={() => handleNavClick(link.href)}
                        className="cursor-pointer text-sm text-bw-text-secondary transition-colors duration-300 hover:text-bw-accent-gold"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                        data-cursor="link"
                      >
                        {link.name}
                      </motion.button>
                    </MagneticField>
                  </motion.li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Services with Enhanced Styling */}
          <ScrollReveal direction="up" distance={40} delay={0.3}>
            <div>
              <h4 className="mb-4 font-semibold text-bw-text-primary">Services</h4>
              <ul className="space-y-3">
                {services.map(service => (
                  <motion.li
                    key={service}
                    className="cursor-default text-sm text-bw-text-secondary transition-colors duration-300 hover:text-bw-accent-gold"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {service}
                  </motion.li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Social Links with Magnetic Effects */}
          <ScrollReveal direction="up" distance={40} delay={0.4}>
            <div>
              <h4 className="mb-4 font-semibold text-bw-text-primary">Follow Us</h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map(social => (
                  <MagneticField key={social.name} strength={0.3} distance={100}>
                    <motion.a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${social.name} (opens in new tab)`}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-bw-border-subtle text-bw-text-secondary transition-all duration-300 hover:bg-bw-accent-gold hover:text-bw-bg-primary focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      title={social.name}
                      data-cursor="link"
                    >
                      <social.icon className="h-5 w-5" aria-hidden="true" />
                    </motion.a>
                  </MagneticField>
                ))}
              </div>

              {/* Newsletter Signup with Magnetic Effects */}
              <div className="mt-6">
                <label
                  htmlFor="newsletter-email"
                  className="mb-3 block text-sm text-bw-text-secondary"
                >
                  Stay updated with our latest work
                </label>
                <div className="flex gap-2">
                  <MagneticField strength={0.05} distance={60}>
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="Your email"
                      aria-label="Email address for newsletter subscription"
                      className="flex-1 rounded-md border border-bw-border-subtle bg-bw-border-subtle px-3 py-2 text-sm text-bw-text-primary transition-all duration-300 focus:border-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50"
                    />
                  </MagneticField>
                  <MagneticField strength={0.2} distance={80}>
                    <motion.button
                      type="submit"
                      aria-label="Subscribe to newsletter"
                      className="cursor-pointer rounded-md bg-bw-accent-gold px-4 py-2 text-sm font-medium text-bw-bg-primary transition-all duration-300 hover:bg-bw-accent-gold/80 focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-cursor="button"
                    >
                      Subscribe
                    </motion.button>
                  </MagneticField>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Bar with Magnetic Effects */}
        <ScrollReveal direction="up" distance={30} delay={0.5}>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-bw-border-subtle pt-8 md:flex-row">
            <div className="text-sm text-bw-text-secondary">
              © {new Date().getFullYear()} BlackWoods Creative. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              {/* Back to Top with Enhanced Magnetic Effect */}
              <MagneticField strength={0.4} distance={120}>
                <motion.button
                  onClick={handleScrollToTop}
                  aria-label="Scroll back to top of page"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-bw-border-subtle text-bw-text-secondary transition-all duration-300 hover:bg-bw-accent-gold hover:text-bw-bg-primary focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title="Back to top"
                  data-cursor="button"
                >
                  <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </MagneticField>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
