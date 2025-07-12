'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

import { MagneticField } from '@/components/interactive';
import { generateBreadcrumbs } from '@/lib/utils/internal-linking';

interface BreadcrumbsProps {
  className?: string;
  showHome?: boolean;
  maxItems?: number;
  variant?: 'default' | 'enhanced' | 'minimal';
  showCurrentPage?: boolean;
}

export function Breadcrumbs({
  className = '',
  showHome = true,
  maxItems = 5,
  variant = 'default',
  showCurrentPage = true,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Don't show breadcrumbs on homepage
  if (pathname === '/' || !pathname) return null;

  const breadcrumbs = generateBreadcrumbs(pathname);

  // Limit breadcrumbs if needed
  const displayBreadcrumbs =
    breadcrumbs.length > maxItems
      ? [
          breadcrumbs[0] ?? { name: 'Home', href: '/' }, // Always show home
          { name: '...', href: '#' }, // Ellipsis
          ...breadcrumbs.slice(-2), // Show last 2 items
        ]
      : breadcrumbs;

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
      .filter(crumb => crumb)
      .map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `https://blackwoodscreative.com${crumb.href}`,
      })),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb navigation"
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        <ol className="flex items-center space-x-2">
          {displayBreadcrumbs.map((crumb, index) => {
            if (!crumb) return null;

            const isLast = index === displayBreadcrumbs.length - 1;
            const isEllipsis = crumb.name === '...';
            const isHome = crumb.href === '/';

            return (
              <li key={`${crumb.href}-${index}`} className="flex items-center">
                {index > 0 && (
                  <ChevronRightIcon
                    className="mx-2 h-4 w-4 text-bw-text-secondary"
                    aria-hidden="true"
                  />
                )}

                {isEllipsis ? (
                  <span className="text-bw-text-secondary">...</span>
                ) : isLast && showCurrentPage ? (
                  <span className="font-medium text-bw-text-primary" aria-current="page">
                    {isHome && showHome ? (
                      <HomeIcon className="h-4 w-4" aria-label="Home" />
                    ) : (
                      crumb.name
                    )}
                  </span>
                ) : !isLast ? (
                  variant === 'enhanced' ? (
                    <MagneticField strength={0.1} distance={60}>
                      <Link
                        href={crumb.href}
                        className="text-bw-text-secondary transition-all duration-200 hover:scale-105 hover:text-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50"
                        aria-label={isHome ? 'Go to homepage' : `Go to ${crumb.name}`}
                      >
                        {isHome && showHome ? (
                          <HomeIcon className="h-4 w-4" aria-label="Home" />
                        ) : (
                          crumb.name
                        )}
                      </Link>
                    </MagneticField>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-bw-text-secondary transition-colors duration-200 hover:text-bw-accent-gold focus:outline-none focus:ring-2 focus:ring-bw-accent-gold focus:ring-opacity-50"
                      aria-label={isHome ? 'Go to homepage' : `Go to ${crumb.name}`}
                    >
                      {isHome && showHome ? (
                        <HomeIcon className="h-4 w-4" aria-label="Home" />
                      ) : (
                        crumb.name
                      )}
                    </Link>
                  )
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

// Compact breadcrumb variant for mobile
export function CompactBreadcrumbs({ className = '' }: { className?: string }) {
  const pathname = usePathname();

  if (pathname === '/' || !pathname) return null;

  const breadcrumbs = generateBreadcrumbs(pathname);
  // Safe array access with bounds checking
  const currentPage = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : null;
  const parentPage = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

  if (!currentPage) return null;

  return (
    <nav
      aria-label="Compact breadcrumb navigation"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      {parentPage && (
        <>
          <Link
            href={parentPage.href}
            className="text-bw-text-secondary transition-colors duration-200 hover:text-bw-accent-gold"
          >
            {parentPage.name}
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-bw-text-secondary" />
        </>
      )}
      <span className="font-medium text-bw-text-primary" aria-current="page">
        {currentPage.name}
      </span>
    </nav>
  );
}

// Breadcrumb component with custom styling for specific sections
export function StyledBreadcrumbs({
  className = '',
  variant = 'default',
}: {
  className?: string;
  variant?: 'default' | 'minimal' | 'accent';
}) {
  const pathname = usePathname();

  if (pathname === '/' || !pathname) return null;

  const breadcrumbs = generateBreadcrumbs(pathname);

  const variantStyles = {
    default: 'text-bw-text-secondary',
    minimal: 'text-bw-text-secondary/70',
    accent: 'text-bw-accent-gold/80',
  };

  const linkStyles = {
    default: 'hover:text-bw-accent-gold',
    minimal: 'hover:text-bw-text-primary',
    accent: 'hover:text-bw-accent-gold',
  };

  return (
    <nav
      aria-label="Styled breadcrumb navigation"
      className={`flex items-center space-x-1 text-sm ${variantStyles[variant] ?? variantStyles.default} ${className}`}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isHome = crumb.href === '/';

          return (
            <li key={`${crumb.href}-${index}`} className="flex items-center">
              {index > 0 && <span className="mx-1 text-xs">/</span>}

              {isLast ? (
                <span className="font-medium text-bw-text-primary">
                  {isHome ? <HomeIcon className="h-4 w-4" aria-label="Home" /> : crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className={`transition-colors duration-200 ${linkStyles[variant] ?? linkStyles.default} focus:outline-none focus:ring-1 focus:ring-bw-accent-gold focus:ring-opacity-50`}
                >
                  {isHome ? <HomeIcon className="h-4 w-4" aria-label="Home" /> : crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
