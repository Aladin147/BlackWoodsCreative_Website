/**
 * Navigation utilities for handling different types of navigation
 * Supports both hash-based navigation (for home page sections) and page navigation
 */

/**
 * Navigate to a URL or hash section
 * @param href - The href to navigate to (can be hash or full URL)
 * @param offset - Offset for scroll positioning (default: 80px for fixed header)
 */
export function navigateTo(href: string, offset = 80): void {
  // Handle hash-based navigation (for sections on current page)
  if (href.startsWith('#')) {
    const element = document.querySelector(href);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    return;
  }

  // Handle external links
  if (href.startsWith('http')) {
    window.open(href, '_blank', 'noopener,noreferrer');
    return;
  }

  // Handle internal page navigation
  if (href.startsWith('/')) {
    // Use window.location for now (can be upgraded to Next.js router later)
    window.location.href = href;
    return;
  }

  // Fallback for any other cases
}

/**
 * Check if we're currently on the home page
 */
export function isHomePage(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/';
}

/**
 * Get the appropriate navigation items with context-aware hrefs
 * @param navigation - Main navigation config
 * @param homeNavigation - Home page specific navigation (kept for backward compatibility)
 */
export function getNavigationItems(navigation: readonly any[], _homeNavigation: readonly any[]): readonly any[] {
  // Always use proper page navigation - no more hash-based navigation
  // This ensures all navigation links go to actual pages
  return navigation.map((item: any) => ({
    ...item,
    href: item.href, // Always use the page href, never homeHref
    submenu: item.submenu ? item.submenu.map((subItem: any) => ({
      ...subItem,
      // Submenu items always use page hrefs
    })) : undefined
  }));
}

/**
 * Handle navigation click with proper routing
 * @param href - The href to navigate to
 * @param closeMenu - Optional callback to close mobile menu
 */
export function handleNavigationClick(href: string, closeMenu?: () => void): void {
  navigateTo(href);
  if (closeMenu) {
    closeMenu();
  }
}

/**
 * Scroll to top of page
 */
export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

/**
 * Get the current page path for active navigation highlighting
 */
export function getCurrentPath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
}

/**
 * Check if a navigation item is currently active
 * @param href - The navigation href
 * @param currentPath - Current page path
 */
export function isNavigationActive(href: string, currentPath: string): boolean {
  // For hash links, check if we're on home page
  if (href.startsWith('#')) {
    return currentPath === '/';
  }
  
  // For page links, check exact match or if current path starts with href
  if (href === '/') {
    return currentPath === '/';
  }
  
  return currentPath.startsWith(href);
}

/**
 * Get portfolio URL based on current context
 * If on home page, scroll to portfolio section
 * If on other pages, navigate to home page portfolio section
 */
export function getPortfolioUrl(): string {
  return isHomePage() ? '#portfolio' : '/#portfolio';
}

/**
 * Get contact URL based on current context
 * If on home page, scroll to contact section
 * If on other pages, navigate to home page contact section
 */
export function getContactUrl(): string {
  return isHomePage() ? '#contact' : '/#contact';
}

/**
 * Navigate to portfolio section
 */
export function navigateToPortfolio(): void {
  const portfolioUrl = getPortfolioUrl();
  if (portfolioUrl.startsWith('#')) {
    navigateTo(portfolioUrl);
  } else {
    window.location.href = portfolioUrl;
  }
}

/**
 * Navigate to contact section
 */
export function navigateToContact(): void {
  const contactUrl = getContactUrl();
  if (contactUrl.startsWith('#')) {
    navigateTo(contactUrl);
  } else {
    window.location.href = contactUrl;
  }
}
