'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowUpIcon,
  CameraIcon,
  BriefcaseIcon,
  FilmIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import { MagneticField, ScrollReveal } from '@/components/interactive';


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

const quickLinks = [
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
  { name: 'Services', href: '#portfolio' },
];

const services = [
  'Brand Films',
  'Product Photography',
  '3D Visualization',
  'Scene Creation',
];

export function Footer({ className }: FooterProps) {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className={`bg-bw-bg-primary border-t border-bw-border-subtle ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info with Magnetic Effects */}
          <ScrollReveal direction="up" distance={40} delay={0.1}>
            <MagneticField strength={0.1} distance={150}>
              <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-bold text-bw-text-primary mb-4">
              BlackWoods Creative
            </h3>
            <p className="text-bw-text-secondary mb-6 leading-relaxed">
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
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-bw-text-secondary">
                <MapPinIcon className="h-5 w-5 text-bw-accent-gold" />
                <span className="text-sm">MFADEL Business Center, Building O, Floor 5. Mohammedia Morocco</span>
              </div>
            </div>
              </div>
            </MagneticField>
          </ScrollReveal>

          {/* Quick Links with Magnetic Effects */}
          <ScrollReveal direction="up" distance={40} delay={0.2}>
            <div>
              <h4 className="font-semibold text-bw-text-primary mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <motion.li key={link.name}>
                    <MagneticField strength={0.1} distance={80}>
                      <motion.button
                        onClick={() => handleNavClick(link.href)}
                        className="text-bw-text-secondary hover:text-bw-accent-gold transition-colors duration-300 text-sm cursor-pointer"
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
              <h4 className="font-semibold text-bw-text-primary mb-4">Services</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <motion.li
                    key={service}
                    className="text-bw-text-secondary text-sm hover:text-bw-accent-gold transition-colors duration-300 cursor-default"
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
              <h4 className="font-semibold text-bw-text-primary mb-4">Follow Us</h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <MagneticField key={social.name} strength={0.3} distance={100}>
                    <motion.a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${social.name} (opens in new tab)`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-bw-border-subtle text-bw-text-secondary hover:bg-bw-accent-gold hover:text-bw-bg-primary focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50 transition-all duration-300 cursor-pointer"
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
                <label htmlFor="newsletter-email" className="text-bw-text-secondary text-sm mb-3 block">
                  Stay updated with our latest work
                </label>
                <div className="flex gap-2">
                  <MagneticField strength={0.05} distance={60}>
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="Your email"
                      aria-label="Email address for newsletter subscription"
                      className="flex-1 px-3 py-2 bg-bw-border-subtle border border-bw-border-subtle rounded-md text-bw-text-primary text-sm focus:outline-none focus:border-bw-accent-gold focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50 transition-all duration-300"
                    />
                  </MagneticField>
                  <MagneticField strength={0.2} distance={80}>
                    <motion.button
                      type="submit"
                      aria-label="Subscribe to newsletter"
                      className="px-4 py-2 bg-bw-accent-gold text-bw-bg-primary rounded-md text-sm font-medium hover:bg-bw-accent-gold/80 focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50 transition-all duration-300 cursor-pointer"
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
          <div className="border-t border-bw-border-subtle pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-bw-text-secondary text-sm">
              © {new Date().getFullYear()} BlackWoods Creative. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <MagneticField strength={0.1} distance={60}>
                <button
                  onClick={() => handleNavClick('#')}
                  className="text-bw-text-secondary hover:text-bw-text-primary text-sm transition-colors duration-300 cursor-pointer"
                  data-cursor="link"
                >
                  Privacy Policy
                </button>
              </MagneticField>
              <MagneticField strength={0.1} distance={60}>
                <button
                  onClick={() => handleNavClick('#')}
                  className="text-bw-text-secondary hover:text-bw-text-primary text-sm transition-colors duration-300 cursor-pointer"
                  data-cursor="link"
                >
                  Terms of Service
                </button>
              </MagneticField>

              {/* Back to Top with Enhanced Magnetic Effect */}
              <MagneticField strength={0.4} distance={120}>
                <motion.button
                  onClick={handleScrollToTop}
                  aria-label="Scroll back to top of page"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-bw-border-subtle text-bw-text-secondary hover:bg-bw-accent-gold hover:text-bw-bg-primary focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50 transition-all duration-300 cursor-pointer"
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
