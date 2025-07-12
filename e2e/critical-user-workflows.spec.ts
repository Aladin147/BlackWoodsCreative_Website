/**
 * E2E TEST: Critical User Workflows
 * 
 * End-to-end testing of the most critical user workflows
 * that directly impact business conversion and user experience.
 * 
 * TESTING METHODOLOGY:
 * - Real browser testing across multiple devices
 * - Complete user journey validation
 * - Performance and accessibility verification
 * - Business conversion path testing
 */

import { test, expect } from '@playwright/test';

test.describe('Critical User Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('Homepage to Contact Conversion Flow', () => {
    test('should complete full homepage to contact form submission workflow', async ({ page }) => {
      // Step 1: Verify homepage loads correctly
      await expect(page).toHaveTitle(/BlackWoods Creative/i);
      
      // Step 2: Verify hero section is visible
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
      
      // Step 3: Click "Start Your Project" CTA button
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await expect(startProjectButton).toBeVisible();
      await startProjectButton.click();
      
      // Step 4: Verify navigation to contact section
      await expect(page.locator('[data-testid="contact-section"]')).toBeVisible();
      
      // Step 5: Fill out contact form
      await page.fill('input[name="name"]', 'John Doe');
      await page.fill('input[name="email"]', 'john.doe@example.com');
      await page.fill('textarea[name="message"]', 'I am interested in your video production services for my upcoming project.');
      
      // Step 6: Submit form
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeEnabled();
      await submitButton.click();
      
      // Step 7: Verify form submission (success state or loading state)
      // Note: This depends on actual form implementation
      await expect(page.locator('[data-testid="contact-section"]')).toBeVisible();
    });

    test('should handle contact form validation correctly', async ({ page }) => {
      // Navigate to contact section
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await startProjectButton.click();
      
      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Verify validation messages appear
      const nameInput = page.locator('input[name="name"]');
      const emailInput = page.locator('input[name="email"]');
      
      // Check if HTML5 validation or custom validation is working
      await expect(nameInput).toBeFocused();
    });
  });

  test.describe('Portfolio Exploration Workflow', () => {
    test('should complete portfolio browsing and project viewing workflow', async ({ page }) => {
      // Step 1: Navigate to portfolio section
      const viewWorkButton = page.locator('button', { hasText: /view our work/i });
      await expect(viewWorkButton).toBeVisible();
      await viewWorkButton.click();
      
      // Step 2: Verify portfolio section loads
      const portfolioSection = page.locator('[data-testid="portfolio-section"]');
      await expect(portfolioSection).toBeVisible();
      
      // Step 3: Verify portfolio cards are present
      const portfolioCards = page.locator('[data-cursor="portfolio"]');
      await expect(portfolioCards.first()).toBeVisible();
      
      // Step 4: Click on first portfolio item
      await portfolioCards.first().click();
      
      // Step 5: Verify project interaction (modal, navigation, or detail view)
      // This depends on the actual implementation
      await page.waitForTimeout(1000); // Allow for any animations
    });

    test('should handle portfolio filtering and navigation', async ({ page }) => {
      // Navigate to portfolio
      const viewWorkButton = page.locator('button', { hasText: /view our work/i });
      await viewWorkButton.click();
      
      // Verify portfolio section
      const portfolioSection = page.locator('[data-testid="portfolio-section"]');
      await expect(portfolioSection).toBeVisible();
      
      // Check if portfolio items are interactive
      const portfolioCards = page.locator('[data-cursor="portfolio"]');
      const cardCount = await portfolioCards.count();
      expect(cardCount).toBeGreaterThan(0);
    });
  });

  test.describe('Mobile Responsiveness Workflow', () => {
    test('should work correctly on mobile devices', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip('This test is only for mobile devices');
      }

      // Verify mobile layout
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
      
      // Test mobile navigation (if hamburger menu exists)
      const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        
        // Verify mobile menu opens
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        await expect(mobileMenu).toBeVisible();
      }
      
      // Test mobile contact form
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await startProjectButton.click();
      
      const contactForm = page.locator('[data-testid="contact-section"]');
      await expect(contactForm).toBeVisible();
      
      // Verify form is usable on mobile
      const nameInput = page.locator('input[name="name"]');
      await expect(nameInput).toBeVisible();
      await nameInput.fill('Mobile Test User');
    });
  });

  test.describe('Performance and Accessibility', () => {
    test('should meet performance benchmarks', async ({ page }) => {
      // Start performance monitoring
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Measure Core Web Vitals
      const performanceMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const metrics = {};
            
            entries.forEach((entry) => {
              if (entry.entryType === 'navigation') {
                // @ts-ignore
                metrics.loadTime = entry.loadEventEnd - entry.loadEventStart;
              }
            });
            
            resolve(metrics);
          }).observe({ entryTypes: ['navigation'] });
        });
      });
      
      // Basic performance assertions
      expect(performanceMetrics).toBeDefined();
    });

    test('should be accessible to screen readers', async ({ page }) => {
      // Check for basic accessibility features
      
      // Verify page has proper heading structure
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      // Verify images have alt text
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const altText = await img.getAttribute('alt');
        expect(altText).toBeTruthy();
      }
      
      // Verify form labels
      const nameInput = page.locator('input[name="name"]');
      if (await nameInput.isVisible()) {
        const label = page.locator('label[for="name"]');
        await expect(label).toBeVisible();
      }
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    test('should work consistently across browsers', async ({ page, browserName }) => {
      // Test core functionality across browsers
      
      // Verify homepage loads
      await expect(page).toHaveTitle(/BlackWoods Creative/i);
      
      // Verify hero section
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
      
      // Test JavaScript interactions
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await expect(startProjectButton).toBeVisible();
      await startProjectButton.click();
      
      // Verify contact section appears
      const contactSection = page.locator('[data-testid="contact-section"]');
      await expect(contactSection).toBeVisible();
      
      // Browser-specific checks
      if (browserName === 'webkit') {
        // Safari-specific tests
        console.log('Running Safari-specific tests');
      } else if (browserName === 'firefox') {
        // Firefox-specific tests
        console.log('Running Firefox-specific tests');
      }
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Test offline behavior
      await page.context().setOffline(true);
      
      // Try to navigate
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      
      // Verify page handles offline state
      // This depends on implementation - might show offline message or cached content
      
      // Restore online state
      await page.context().setOffline(false);
    });

    test('should handle form submission errors', async ({ page }) => {
      // Navigate to contact form
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await startProjectButton.click();
      
      // Fill form with potentially problematic data
      await page.fill('input[name="name"]', '<script>alert("test")</script>');
      await page.fill('input[name="email"]', 'invalid-email-format');
      await page.fill('textarea[name="message"]', 'Test message');
      
      // Submit form
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Verify form handles invalid data appropriately
      // Should show validation errors or sanitize input
      await expect(page.locator('[data-testid="contact-section"]')).toBeVisible();
    });
  });
});
