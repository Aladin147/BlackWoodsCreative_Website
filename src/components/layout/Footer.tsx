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
    <footer className={`bg-bw-black border-t border-bw-dark-gray ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-2xl font-bold text-bw-white mb-4">
              BlackWoods Creative
            </h3>
            <p className="text-bw-light-gray mb-6 leading-relaxed">
              Premium visual storytelling through filmmaking, photography, and 3D visualization.
              Creating compelling narratives that captivate and convert.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-bw-light-gray">
                <EnvelopeIcon className="h-5 w-5 text-bw-gold" />
                <span className="text-sm">hello@blackwoodscreative.com</span>
              </div>
              <div className="flex items-center gap-3 text-bw-light-gray">
                <PhoneIcon className="h-5 w-5 text-bw-gold" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-bw-light-gray">
                <MapPinIcon className="h-5 w-5 text-bw-gold" />
                <span className="text-sm">MFADEL Business Center, Building O, Floor 5. Mohammedia Morocco</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-bw-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li key={link.name}>
                  <motion.button
                    onClick={() => handleNavClick(link.href)}
                    className="text-bw-light-gray hover:text-bw-gold transition-colors duration-300 text-sm"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-bw-white mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="text-bw-light-gray text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-bw-white mb-4">Follow Us</h4>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.name} (opens in new tab)`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-bw-dark-gray text-bw-light-gray hover:bg-bw-gold hover:text-bw-black focus:outline-none focus:ring-2 focus:ring-bw-gold focus:ring-opacity-50 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.name}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <label htmlFor="newsletter-email" className="text-bw-light-gray text-sm mb-3 block">
                Stay updated with our latest work
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Your email"
                  aria-label="Email address for newsletter subscription"
                  className="flex-1 px-3 py-2 bg-bw-dark-gray border border-bw-medium-gray rounded-md text-bw-white text-sm focus:outline-none focus:border-bw-gold focus:ring-2 focus:ring-bw-gold focus:ring-opacity-50 transition-all duration-300"
                />
                <motion.button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-4 py-2 bg-bw-gold text-bw-black rounded-md text-sm font-medium hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-bw-gold focus:ring-opacity-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-bw-dark-gray pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-bw-light-gray text-sm">
            © {new Date().getFullYear()} BlackWoods Creative. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('#')}
              className="text-bw-light-gray hover:text-bw-white text-sm transition-colors duration-300"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavClick('#')}
              className="text-bw-light-gray hover:text-bw-white text-sm transition-colors duration-300"
            >
              Terms of Service
            </button>

            {/* Back to Top */}
            <motion.button
              onClick={handleScrollToTop}
              aria-label="Scroll back to top of page"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-bw-dark-gray text-bw-light-gray hover:bg-bw-gold hover:text-bw-black focus:outline-none focus:ring-2 focus:ring-bw-gold focus:ring-opacity-50 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title="Back to top"
            >
              <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
