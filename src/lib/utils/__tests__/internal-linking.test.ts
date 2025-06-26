import { 
  generateBreadcrumbs, 
  getInternalLinksForPage, 
  getRelatedServicePages 
} from '../internal-linking';

describe('Internal Linking Utilities', () => {
  describe('generateBreadcrumbs', () => {
    it('generates breadcrumbs for homepage', () => {
      const breadcrumbs = generateBreadcrumbs('/');
      
      expect(breadcrumbs).toEqual([
        { name: 'Home', href: '/' }
      ]);
    });

    it('generates breadcrumbs for simple path', () => {
      const breadcrumbs = generateBreadcrumbs('/about');
      
      expect(breadcrumbs).toEqual([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' }
      ]);
    });

    it('generates breadcrumbs for nested path', () => {
      const breadcrumbs = generateBreadcrumbs('/about/our-story');
      
      expect(breadcrumbs).toEqual([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Our Story', href: '/about/our-story' }
      ]);
    });

    it('generates breadcrumbs for deep nested path', () => {
      const breadcrumbs = generateBreadcrumbs('/services/video-production-morocco');
      
      expect(breadcrumbs).toEqual([
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Video Production Morocco', href: '/services/video-production-morocco' }
      ]);
    });

    it('handles paths with trailing slash', () => {
      const breadcrumbs = generateBreadcrumbs('/about/');
      
      expect(breadcrumbs).toEqual([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' }
      ]);
    });

    it('converts kebab-case to title case', () => {
      const breadcrumbs = generateBreadcrumbs('/services/corporate-video-production-morocco');
      
      expect(breadcrumbs[2]?.name).toBe('Corporate Video Production Morocco');
    });

    it('handles empty segments gracefully', () => {
      const breadcrumbs = generateBreadcrumbs('//about//our-story//');
      
      expect(breadcrumbs).toEqual([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Our Story', href: '/about/our-story' }
      ]);
    });
  });

  describe('getInternalLinksForPage', () => {
    it('returns null for unknown pages', () => {
      const links = getInternalLinksForPage('/unknown-page');
      expect(links).toBeNull();
    });

    it('returns homepage linking strategy', () => {
      const links = getInternalLinksForPage('/');
      
      expect(links).toBeDefined();
      expect(links?.relatedPages).toBeDefined();
      expect(links?.contextualLinks).toBeDefined();
      expect(links?.callToActionLinks).toBeDefined();
    });

    it('returns about page linking strategy', () => {
      const links = getInternalLinksForPage('/about');
      
      expect(links).toBeDefined();
      expect(links?.relatedPages.length).toBeGreaterThan(0);
      
      // Should include links to about subpages
      const aboutLinks = links?.relatedPages.filter(link => 
        link.href.startsWith('/about/')
      );
      expect(aboutLinks?.length).toBeGreaterThan(0);
    });

    it('returns about subpage linking strategy', () => {
      const links = getInternalLinksForPage('/about/our-story');
      
      expect(links).toBeDefined();
      expect(links?.relatedPages.length).toBeGreaterThan(0);
      
      // Should include links to other about pages
      const relatedAboutLinks = links?.relatedPages.filter(link => 
        link.href.startsWith('/about/') && link.href !== '/about/our-story'
      );
      expect(relatedAboutLinks?.length).toBeGreaterThan(0);
    });

    it('returns services page linking strategy', () => {
      const links = getInternalLinksForPage('/services');
      
      expect(links).toBeDefined();
      expect(links?.relatedPages.length).toBeGreaterThan(0);
      
      // Should include links to individual services
      const serviceLinks = links?.relatedPages.filter(link => 
        link.href.startsWith('/services/')
      );
      expect(serviceLinks?.length).toBeGreaterThan(0);
    });

    it('returns service subpage linking strategy', () => {
      const links = getInternalLinksForPage('/services/video-production-morocco');
      
      expect(links).toBeDefined();
      expect(links?.relatedPages.length).toBeGreaterThan(0);
      
      // Should include links to other services
      const otherServiceLinks = links?.relatedPages.filter(link => 
        link.href.startsWith('/services/') && 
        link.href !== '/services/video-production-morocco'
      );
      expect(otherServiceLinks?.length).toBeGreaterThan(0);
    });

    it('returns portfolio page linking strategy', () => {
      const links = getInternalLinksForPage('/portfolio');
      
      expect(links).toBeDefined();
      expect(links?.relatedPages.length).toBeGreaterThan(0);
      
      // Should include links to services and contact
      const hasServicesLink = links?.relatedPages.some(link => 
        link.href === '/services'
      );
      expect(hasServicesLink).toBe(true);
    });

    it('returns contact page linking strategy', () => {
      const links = getInternalLinksForPage('/contact');
      
      expect(links).toBeDefined();
      expect(links?.relatedPages.length).toBeGreaterThan(0);
      
      // Should include links to services and portfolio
      const hasServicesLink = links?.relatedPages.some(link => 
        link.href === '/services'
      );
      const hasPortfolioLink = links?.relatedPages.some(link => 
        link.href === '/portfolio'
      );
      expect(hasServicesLink).toBe(true);
      expect(hasPortfolioLink).toBe(true);
    });

    it('includes call-to-action links for appropriate pages', () => {
      const aboutLinks = getInternalLinksForPage('/about');
      const serviceLinks = getInternalLinksForPage('/services/video-production-morocco');
      
      expect(aboutLinks?.callToActionLinks.length).toBeGreaterThan(0);
      expect(serviceLinks?.callToActionLinks.length).toBeGreaterThan(0);
      
      // CTA links should include contact
      const aboutHasContact = aboutLinks?.callToActionLinks.some(link => 
        link.href === '/contact'
      );
      expect(aboutHasContact).toBe(true);
    });

    it('assigns correct priority levels', () => {
      const links = getInternalLinksForPage('/about');
      
      expect(links).toBeDefined();
      
      // Should have high priority links
      const highPriorityLinks = links?.relatedPages.filter(link => 
        link.priority === 'high'
      );
      expect(highPriorityLinks?.length).toBeGreaterThan(0);
      
      // Should have medium priority links
      const mediumPriorityLinks = links?.relatedPages.filter(link => 
        link.priority === 'medium'
      );
      expect(mediumPriorityLinks?.length).toBeGreaterThan(0);
    });

    it('includes contextual information', () => {
      const links = getInternalLinksForPage('/about/team');
      
      expect(links).toBeDefined();
      
      // Links should have context information
      const contextualLinks = links?.contextualLinks.filter(link => 
        link.context
      );
      expect(contextualLinks?.length).toBeGreaterThan(0);
    });
  });

  describe('getRelatedServicePages', () => {
    it('returns related services for video production', () => {
      const relatedServices = getRelatedServicePages('video-production-morocco');
      
      expect(relatedServices.length).toBeGreaterThan(0);
      
      // Should not include the current service
      const includesCurrentService = relatedServices.some(service => 
        service.href === '/services/video-production-morocco'
      );
      expect(includesCurrentService).toBe(false);
      
      // Should include other services
      const hasOtherServices = relatedServices.some(service => 
        service.href.startsWith('/services/') && 
        service.href !== '/services/video-production-morocco'
      );
      expect(hasOtherServices).toBe(true);
    });

    it('returns related services for photography', () => {
      const relatedServices = getRelatedServicePages('photography');
      
      expect(relatedServices.length).toBeGreaterThan(0);
      
      // Should include video production and 3D visualization
      const hasVideoProduction = relatedServices.some(service => 
        service.href.includes('video-production')
      );
      const has3DVisualization = relatedServices.some(service => 
        service.href.includes('3d-visualization')
      );
      
      expect(hasVideoProduction).toBe(true);
      expect(has3DVisualization).toBe(true);
    });

    it('returns related services for 3D visualization', () => {
      const relatedServices = getRelatedServicePages('3d-visualization');
      
      expect(relatedServices.length).toBeGreaterThan(0);
      
      // Should include photography and video services
      const hasPhotography = relatedServices.some(service => 
        service.href.includes('photography')
      );
      expect(hasPhotography).toBe(true);
    });

    it('returns empty array for unknown service', () => {
      const relatedServices = getRelatedServicePages('unknown-service');
      expect(relatedServices).toEqual([]);
    });

    it('includes proper service descriptions', () => {
      const relatedServices = getRelatedServicePages('video-production-morocco');
      
      relatedServices.forEach(service => {
        expect(service.text).toBeDefined();
        expect(service.text.length).toBeGreaterThan(0);
        expect(service.description).toBeDefined();
        expect(service.description?.length).toBeGreaterThan(0);
        expect(service.href).toBeDefined();
        expect(service.href.startsWith('/services/')).toBe(true);
      });
    });

    it('limits number of related services appropriately', () => {
      const relatedServices = getRelatedServicePages('video-production-morocco');
      
      // Should return a reasonable number of related services (not too many)
      expect(relatedServices.length).toBeLessThanOrEqual(5);
      expect(relatedServices.length).toBeGreaterThan(0);
    });
  });

  describe('Link Quality and Consistency', () => {
    it('ensures all links have required properties', () => {
      const testPages = [
        '/',
        '/about',
        '/about/our-story',
        '/services',
        '/services/video-production-morocco',
        '/portfolio',
        '/contact'
      ];

      testPages.forEach(page => {
        const links = getInternalLinksForPage(page);
        if (links) {
          [...links.relatedPages, ...links.contextualLinks, ...links.callToActionLinks].forEach(link => {
            expect(link.href).toBeDefined();
            expect(link.text).toBeDefined();
            expect(link.href.length).toBeGreaterThan(0);
            expect(link.text.length).toBeGreaterThan(0);
          });
        }
      });
    });

    it('ensures no circular references in related links', () => {
      const links = getInternalLinksForPage('/about/our-story');
      
      if (links) {
        const hasCircularReference = links.relatedPages.some(link => 
          link.href === '/about/our-story'
        );
        expect(hasCircularReference).toBe(false);
      }
    });

    it('ensures consistent link formatting', () => {
      const links = getInternalLinksForPage('/services');
      
      if (links) {
        links.relatedPages.forEach(link => {
          // All hrefs should start with /
          expect(link.href.startsWith('/')).toBe(true);
          
          // No double slashes
          expect(link.href.includes('//')).toBe(false);
          
          // No trailing slashes (except root)
          if (link.href !== '/') {
            expect(link.href.endsWith('/')).toBe(false);
          }
        });
      }
    });
  });
});
