'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MagneticField, ScrollReveal } from '@/components/interactive';
import {
  getInternalLinksForPage,
  getRelatedServicePages,
  InternalLink,
} from '@/lib/utils/internal-linking';

interface RelatedLinksProps {
  className?: string;
  title?: string;
  maxLinks?: number;
  context?: string;
  variant?: 'default' | 'compact' | 'grid';
}

export function RelatedLinks({
  className = '',
  title = 'Related Pages',
  maxLinks = 4,
  context,
  variant = 'default',
}: RelatedLinksProps) {
  const pathname = usePathname();
  const linkingStrategy = getInternalLinksForPage(pathname);

  if (!linkingStrategy) return null;

  // Get links based on context or use all high-priority links
  let links: InternalLink[] = [];

  if (context) {
    links = [
      ...linkingStrategy.relatedPages,
      ...linkingStrategy.contextualLinks,
      ...linkingStrategy.callToActionLinks,
    ].filter(link => link.context === context);
  } else {
    links = [
      ...linkingStrategy.relatedPages.filter(link => link.priority === 'high'),
      ...linkingStrategy.contextualLinks.filter(link => link.priority === 'high'),
      ...linkingStrategy.callToActionLinks,
    ];
  }

  // Limit number of links
  const displayLinks = links.slice(0, maxLinks);

  if (displayLinks.length === 0) return null;

  const renderLink = (link: InternalLink, index: number) => (
    <ScrollReveal key={link.href} delay={index * 0.1}>
      <MagneticField strength={0.2} distance={100}>
        <Link
          href={link.href}
          className="bg-bw-bg-secondary group block rounded-lg border border-bw-border-subtle p-4 transition-all duration-300 hover:border-bw-accent-gold hover:bg-bw-bg-primary hover:shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-bw-text-primary transition-colors duration-300 group-hover:text-bw-accent-gold">
                {link.text}
              </h4>
              {link.description && (
                <p className="mt-1 text-sm text-bw-text-secondary">{link.description}</p>
              )}
            </div>
            <ArrowRightIcon className="ml-2 h-4 w-4 text-bw-text-secondary transition-all duration-300 group-hover:translate-x-1 group-hover:text-bw-accent-gold" />
          </div>
        </Link>
      </MagneticField>
    </ScrollReveal>
  );

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <h3 className="text-sm font-medium text-bw-text-primary">{title}</h3>
        <div className="space-y-1">
          {displayLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-bw-text-secondary transition-colors duration-200 hover:text-bw-accent-gold"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={className}>
        <ScrollReveal>
          <h3 className="mb-6 font-display text-display-md text-bw-text-primary">{title}</h3>
        </ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayLinks.map(renderLink)}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ScrollReveal>
        <h3 className="text-display-sm mb-4 font-display text-bw-text-primary">{title}</h3>
      </ScrollReveal>
      <div className="space-y-3">{displayLinks.map(renderLink)}</div>
    </div>
  );
}

// Service-specific related links component
export function RelatedServiceLinks({
  className = '',
  currentService,
  title = 'Other Services',
}: {
  className?: string;
  currentService: string;
  title?: string;
}) {
  const relatedServices = getRelatedServicePages(currentService);

  if (relatedServices.length === 0) return null;

  return (
    <div className={className}>
      <ScrollReveal>
        <h3 className="mb-6 font-display text-display-md text-bw-text-primary">{title}</h3>
      </ScrollReveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedServices.map((service, index) => (
          <ScrollReveal key={service.href} delay={index * 0.1}>
            <MagneticField strength={0.2} distance={100}>
              <Link
                href={service.href}
                className="bg-bw-bg-secondary group block rounded-lg border border-bw-border-subtle p-6 transition-all duration-300 hover:border-bw-accent-gold hover:bg-bw-bg-primary hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-bw-text-primary transition-colors duration-300 group-hover:text-bw-accent-gold">
                      {service.text}
                    </h4>
                    <p className="mt-2 text-sm text-bw-text-secondary">{service.description}</p>
                  </div>
                  <ArrowRightIcon className="ml-4 h-5 w-5 text-bw-text-secondary transition-all duration-300 group-hover:translate-x-1 group-hover:text-bw-accent-gold" />
                </div>
              </Link>
            </MagneticField>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

// Call-to-action links component
export function CTALinks({
  className = '',
  title = 'Ready to Get Started?',
}: {
  className?: string;
  title?: string;
}) {
  const pathname = usePathname();
  const linkingStrategy = getInternalLinksForPage(pathname);

  if (!linkingStrategy || linkingStrategy.callToActionLinks.length === 0) return null;

  return (
    <div className={`text-center ${className}`}>
      <ScrollReveal>
        <h3 className="mb-6 font-display text-display-md text-bw-text-primary">{title}</h3>
      </ScrollReveal>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        {linkingStrategy.callToActionLinks.map((link, index) => (
          <ScrollReveal key={link.href} delay={index * 0.2}>
            <MagneticField strength={0.3} distance={120}>
              <Link href={link.href} className="btn-primary inline-flex items-center">
                {link.text}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </MagneticField>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

// Contextual navigation component for specific sections
export function ContextualNavigation({
  context,
  className = '',
}: {
  context: string;
  className?: string;
}) {
  const pathname = usePathname();
  const linkingStrategy = getInternalLinksForPage(pathname);

  if (!linkingStrategy) return null;

  const contextualLinks = [
    ...linkingStrategy.relatedPages,
    ...linkingStrategy.contextualLinks,
  ].filter(link => link.context === context);

  if (contextualLinks.length === 0) return null;

  return (
    <nav
      className={`inline-flex items-center space-x-4 ${className}`}
      aria-label="Contextual navigation"
    >
      {contextualLinks.map((link, index) => (
        <motion.div
          key={link.href}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={link.href}
            className="text-sm text-bw-text-secondary transition-colors duration-200 hover:text-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50"
          >
            {link.text}
          </Link>
        </motion.div>
      ))}
    </nav>
  );
}
