'use client';

import { ChevronLeftIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MagneticField, ScrollReveal } from '@/components/interactive';
import { getInternalLinksForPage } from '@/lib/utils/internal-linking';

interface PageNavigationProps {
  className?: string;
  showPrevNext?: boolean;
  showRelated?: boolean;
  maxRelated?: number;
}

interface PageInfo {
  path: string;
  title: string;
  description: string;
}

// Define page sequences for prev/next navigation
const PAGE_SEQUENCES = {
  about: [
    { path: '/about', title: 'About BlackWoods', description: 'Our story and mission' },
    { path: '/about/our-story', title: 'Our Story', description: 'How BlackWoods began' },
    { path: '/about/team', title: 'Our Team', description: 'Meet the creative minds' },
    { path: '/about/our-workflow', title: 'Our Workflow', description: 'How we work' },
    { path: '/about/location', title: 'Our Location', description: 'Visit our studio' }
  ],
  services: [
    { path: '/services', title: 'All Services', description: 'Complete service overview' },
    { path: '/services/video-production-morocco', title: 'Video Production', description: 'Professional video services' },
    { path: '/services/corporate-video-production-morocco', title: 'Corporate Videos', description: 'Business video solutions' },
    { path: '/services/photography', title: 'Photography', description: 'Professional photography' },
    { path: '/services/3d-visualization', title: '3D Visualization', description: 'Stunning 3D rendering' }
  ]
};

export function PageNavigation({ 
  className = '',
  showPrevNext = true,
  showRelated = true,
  maxRelated = 3
}: PageNavigationProps) {
  const pathname = usePathname();
  
  // Don't show on homepage
  if (pathname === '/') return null;
  
  const { prevPage, nextPage } = getPrevNextPages(pathname);
  const relatedLinks = getInternalLinksForPage(pathname);
  
  return (
    <nav className={`border-t border-bw-border-subtle bg-bw-bg-secondary ${className}`} aria-label="Page navigation">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Previous/Next Navigation */}
        {showPrevNext && (prevPage ?? nextPage) && (
          <div className="mb-8">
            <ScrollReveal>
              <div className="flex items-center justify-between">
                {/* Previous Page */}
                {prevPage ? (
                  <MagneticField strength={0.2} distance={100}>
                    <Link
                      href={prevPage.path}
                      className="group flex items-center space-x-3 rounded-lg border border-bw-border-subtle bg-bw-bg-primary p-4 transition-all duration-300 hover:border-bw-accent-gold hover:shadow-lg"
                    >
                      <ChevronLeftIcon className="h-5 w-5 text-bw-text-secondary transition-colors group-hover:text-bw-accent-gold" />
                      <div className="text-left">
                        <div className="text-sm text-bw-text-secondary">Previous</div>
                        <div className="font-medium text-bw-text-primary group-hover:text-bw-accent-gold transition-colors">
                          {prevPage.title}
                        </div>
                        <div className="text-sm text-bw-text-secondary">{prevPage.description}</div>
                      </div>
                    </Link>
                  </MagneticField>
                ) : (
                  <div /> // Spacer
                )}
                
                {/* Home Link */}
                <MagneticField strength={0.3} distance={80}>
                  <Link
                    href="/"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-bw-border-subtle bg-bw-bg-primary text-bw-text-secondary transition-all duration-300 hover:border-bw-accent-gold hover:bg-bw-accent-gold hover:text-bw-bg-primary"
                    aria-label="Go to homepage"
                  >
                    <HomeIcon className="h-5 w-5" />
                  </Link>
                </MagneticField>
                
                {/* Next Page */}
                {nextPage ? (
                  <MagneticField strength={0.2} distance={100}>
                    <Link
                      href={nextPage.path}
                      className="group flex items-center space-x-3 rounded-lg border border-bw-border-subtle bg-bw-bg-primary p-4 transition-all duration-300 hover:border-bw-accent-gold hover:shadow-lg"
                    >
                      <div className="text-right">
                        <div className="text-sm text-bw-text-secondary">Next</div>
                        <div className="font-medium text-bw-text-primary group-hover:text-bw-accent-gold transition-colors">
                          {nextPage.title}
                        </div>
                        <div className="text-sm text-bw-text-secondary">{nextPage.description}</div>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-bw-text-secondary transition-colors group-hover:text-bw-accent-gold" />
                    </Link>
                  </MagneticField>
                ) : (
                  <div /> // Spacer
                )}
              </div>
            </ScrollReveal>
          </div>
        )}
        
        {/* Related Links */}
        {showRelated && relatedLinks && relatedLinks.relatedPages.length > 0 && (
          <div>
            <ScrollReveal delay={0.2}>
              <h3 className="mb-4 font-display text-display-sm text-bw-text-primary">
                Related Pages
              </h3>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedLinks.relatedPages.slice(0, maxRelated).map((link, index) => (
                <ScrollReveal key={link.href} delay={0.3 + index * 0.1}>
                  <MagneticField strength={0.15} distance={80}>
                    <Link
                      href={link.href}
                      className="group block rounded-lg border border-bw-border-subtle bg-bw-bg-primary p-4 transition-all duration-300 hover:border-bw-accent-gold hover:shadow-lg"
                    >
                      <h4 className="font-medium text-bw-text-primary group-hover:text-bw-accent-gold transition-colors">
                        {link.text}
                      </h4>
                      {link.description && (
                        <p className="mt-1 text-sm text-bw-text-secondary">
                          {link.description}
                        </p>
                      )}
                    </Link>
                  </MagneticField>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Utility function to get previous and next pages
function getPrevNextPages(currentPath: string): { prevPage?: PageInfo | undefined; nextPage?: PageInfo | undefined } {
  // Determine which sequence this page belongs to
  let sequence: PageInfo[] = [];
  
  if (currentPath.startsWith('/about')) {
    sequence = PAGE_SEQUENCES.about;
  } else if (currentPath.startsWith('/services')) {
    sequence = PAGE_SEQUENCES.services;
  }
  
  if (sequence.length === 0) return { prevPage: undefined, nextPage: undefined };

  const currentIndex = sequence.findIndex(page => page.path === currentPath);

  if (currentIndex === -1) return { prevPage: undefined, nextPage: undefined };

  return {
    prevPage: currentIndex > 0 ? sequence[currentIndex - 1] : undefined,
    nextPage: currentIndex < sequence.length - 1 ? sequence[currentIndex + 1] : undefined
  };
}

// Compact version for mobile or sidebar use
export function CompactPageNavigation({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  
  if (pathname === '/') return null;
  
  const { prevPage, nextPage } = getPrevNextPages(pathname);
  
  if (!prevPage && !nextPage) return null;
  
  return (
    <nav className={`flex items-center justify-between ${className}`} aria-label="Compact page navigation">
      {prevPage ? (
        <Link
          href={prevPage.path}
          className="flex items-center space-x-2 text-sm text-bw-text-secondary transition-colors hover:text-bw-accent-gold"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>{prevPage.title}</span>
        </Link>
      ) : (
        <div />
      )}
      
      {nextPage ? (
        <Link
          href={nextPage.path}
          className="flex items-center space-x-2 text-sm text-bw-text-secondary transition-colors hover:text-bw-accent-gold"
        >
          <span>{nextPage.title}</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

// Section navigation for long pages
export function SectionNavigation({ 
  sections,
  className = ''
}: { 
  sections: Array<{ id: string; title: string; }>;
  className?: string;
}) {
  return (
    <nav className={`sticky top-24 ${className}`} aria-label="Section navigation">
      <div className="rounded-lg border border-bw-border-subtle bg-bw-bg-secondary p-4">
        <h4 className="mb-3 text-sm font-medium text-bw-text-primary">On this page</h4>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block text-sm text-bw-text-secondary transition-colors hover:text-bw-accent-gold"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
