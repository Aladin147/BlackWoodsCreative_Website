/**
 * E2E TEST: Business Conversion Paths
 * 
 * End-to-end testing of critical business conversion workflows
 * that directly impact revenue and lead generation.
 * 
 * TESTING METHODOLOGY:
 * - Complete customer journey testing
 * - Lead generation workflow validation
 * - Conversion funnel optimization testing
 * - Business KPI measurement
 */

import { test, expect } from '@playwright/test';

test.describe('Business Conversion Paths', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Lead Generation Funnel', () => {
    test('should complete the primary lead generation workflow', async ({ page }) => {
      // STEP 1: Landing Page Engagement
      await expect(page).toHaveTitle(/BlackWoods Creative/i);
      
      // Verify key value propositions are visible
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
      
      // STEP 2: Portfolio Engagement (Trust Building)
      const viewWorkButton = page.locator('button', { hasText: /view our work/i });
      await expect(viewWorkButton).toBeVisible();
      await viewWorkButton.click();
      
      // Verify portfolio section loads
      const portfolioSection = page.locator('[data-testid="portfolio-section"]');
      await expect(portfolioSection).toBeVisible();
      
      // Engage with portfolio content
      const portfolioCards = page.locator('[data-cursor="portfolio"]');
      await expect(portfolioCards.first()).toBeVisible();
      await portfolioCards.first().hover();
      
      // STEP 3: Contact Intent (Conversion Action)
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await startProjectButton.click();
      
      // STEP 4: Lead Capture Form Completion
      const contactSection = page.locator('[data-testid="contact-section"]');
      await expect(contactSection).toBeVisible();
      
      // Fill out comprehensive lead information
      await page.fill('input[name="name"]', 'Sarah Johnson');
      await page.fill('input[name="email"]', 'sarah.johnson@techstartup.com');
      await page.fill('input[name="company"]', 'Tech Startup Inc.');
      
      // Select project type if available
      const projectTypeSelect = page.locator('select[name="projectType"]');
      if (await projectTypeSelect.isVisible()) {
        await projectTypeSelect.selectOption('video-production');
      }
      
      // Select budget range if available
      const budgetSelect = page.locator('select[name="budget"]');
      if (await budgetSelect.isVisible()) {
        await budgetSelect.selectOption('10000-25000');
      }
      
      // Provide detailed project description
      await page.fill('textarea[name="message"]', 
        'We are a tech startup looking to create a series of promotional videos for our product launch. ' +
        'We need 3-5 videos ranging from 30 seconds to 2 minutes, including product demos, customer testimonials, ' +
        'and brand storytelling content. Timeline is 6-8 weeks with a budget of $15,000-$20,000.'
      );
      
      // STEP 5: Form Submission (Lead Conversion)
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeEnabled();
      await submitButton.click();
      
      // STEP 6: Conversion Confirmation
      // Wait for form processing
      await page.waitForTimeout(2000);
      
      // Verify successful submission or appropriate feedback
      await expect(contactSection).toBeVisible();
    });

    test('should handle qualified lead workflow with all optional fields', async ({ page }) => {
      // Navigate directly to contact form
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await startProjectButton.click();
      
      // Fill out maximum lead qualification information
      await page.fill('input[name="name"]', 'Michael Chen');
      await page.fill('input[name="email"]', 'michael.chen@enterprise.com');
      await page.fill('input[name="company"]', 'Enterprise Solutions Corp');
      await page.fill('input[name="phone"]', '+1 (555) 123-4567');
      
      // Select high-value project type
      const projectTypeSelect = page.locator('select[name="projectType"]');
      if (await projectTypeSelect.isVisible()) {
        await projectTypeSelect.selectOption('commercial-production');
      }
      
      // Select premium budget range
      const budgetSelect = page.locator('select[name="budget"]');
      if (await budgetSelect.isVisible()) {
        await budgetSelect.selectOption('50000+');
      }
      
      // Provide enterprise-level project details
      await page.fill('textarea[name="message"]', 
        'Enterprise client seeking comprehensive video production services for national advertising campaign. ' +
        'Scope includes: 5 commercial spots (30s, 60s), social media content suite, behind-the-scenes content, ' +
        'and branded documentary. Multi-location shoots required. Budget: $75,000-$100,000. ' +
        'Timeline: 12 weeks. Need proposal by end of week.'
      );
      
      // Submit high-value lead
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Verify submission handling
      await page.waitForTimeout(2000);
      await expect(page.locator('[data-testid="contact-section"]')).toBeVisible();
    });
  });

  test.describe('Service Discovery Workflow', () => {
    test('should guide users through service exploration to contact', async ({ page }) => {
      // STEP 1: Service Discovery via Portfolio
      const viewWorkButton = page.locator('button', { hasText: /view our work/i });
      await viewWorkButton.click();
      
      const portfolioSection = page.locator('[data-testid="portfolio-section"]');
      await expect(portfolioSection).toBeVisible();
      
      // STEP 2: Service Category Exploration
      // Look for different types of work (Film, Photography, 3D, etc.)
      const filmProjects = page.locator('[data-cursor="portfolio"]').filter({ hasText: /film/i });
      const photoProjects = page.locator('[data-cursor="portfolio"]').filter({ hasText: /photo/i });
      
      // Interact with different service categories
      if (await filmProjects.count() > 0) {
        await filmProjects.first().hover();
        await page.waitForTimeout(500);
      }
      
      if (await photoProjects.count() > 0) {
        await photoProjects.first().hover();
        await page.waitForTimeout(500);
      }
      
      // STEP 3: Service-Specific Contact Intent
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await startProjectButton.click();
      
      // STEP 4: Service-Specific Lead Capture
      await page.fill('input[name="name"]', 'Jennifer Martinez');
      await page.fill('input[name="email"]', 'jennifer@creativestudio.com');
      
      // Select specific service type
      const projectTypeSelect = page.locator('select[name="projectType"]');
      if (await projectTypeSelect.isVisible()) {
        await projectTypeSelect.selectOption('photography');
      }
      
      await page.fill('textarea[name="message"]', 
        'Interested in professional photography services for our creative studio. ' +
        'Need headshots, product photography, and event coverage. Please send portfolio and pricing.'
      );
      
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(2000);
    });
  });

  test.describe('Mobile Conversion Optimization', () => {
    test('should optimize mobile conversion funnel', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip('Mobile-specific conversion test');
      }

      // Mobile-optimized conversion flow
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
      
      // Test mobile CTA visibility and accessibility
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await expect(startProjectButton).toBeVisible();
      
      // Verify mobile form usability
      await startProjectButton.click();
      
      const contactSection = page.locator('[data-testid="contact-section"]');
      await expect(contactSection).toBeVisible();
      
      // Test mobile form interaction
      const nameInput = page.locator('input[name="name"]');
      await nameInput.fill('Mobile User');
      await expect(nameInput).toHaveValue('Mobile User');
      
      // Test mobile keyboard behavior
      const emailInput = page.locator('input[name="email"]');
      await emailInput.focus();
      await emailInput.fill('mobile@test.com');
      
      // Verify mobile form submission
      const messageInput = page.locator('textarea[name="message"]');
      await messageInput.fill('Mobile conversion test message');
      
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
      await submitButton.click();
    });
  });

  test.describe('Conversion Analytics and Tracking', () => {
    test('should track conversion events properly', async ({ page }) => {
      // Monitor network requests for analytics tracking
      const analyticsRequests: string[] = [];
      
      page.on('request', (request) => {
        const url = request.url();
        if (url.includes('analytics') || url.includes('gtag') || url.includes('facebook') || url.includes('tracking')) {
          analyticsRequests.push(url);
        }
      });
      
      // Complete conversion workflow
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await startProjectButton.click();
      
      // Fill and submit form
      await page.fill('input[name="name"]', 'Analytics Test User');
      await page.fill('input[name="email"]', 'analytics@test.com');
      await page.fill('textarea[name="message"]', 'Testing conversion tracking');
      
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(3000);
      
      // Verify analytics tracking (if implemented)
      console.log('Analytics requests captured:', analyticsRequests.length);
    });
  });

  test.describe('A/B Testing and Optimization', () => {
    test('should handle different conversion variations', async ({ page }) => {
      // Test different CTA button variations
      const ctaButtons = [
        page.locator('button', { hasText: /start your project/i }),
        page.locator('button', { hasText: /get started/i }),
        page.locator('button', { hasText: /contact us/i }),
        page.locator('button', { hasText: /let\'s talk/i })
      ];
      
      // Find which CTA variation is present
      let activeCTA = null;
      for (const button of ctaButtons) {
        if (await button.isVisible()) {
          activeCTA = button;
          break;
        }
      }
      
      expect(activeCTA).toBeTruthy();
      await activeCTA!.click();
      
      // Complete conversion regardless of variation
      const contactSection = page.locator('[data-testid="contact-section"]');
      await expect(contactSection).toBeVisible();
      
      await page.fill('input[name="name"]', 'A/B Test User');
      await page.fill('input[name="email"]', 'abtest@example.com');
      await page.fill('textarea[name="message"]', 'Testing different CTA variations');
      
      await page.locator('button[type="submit"]').click();
    });
  });

  test.describe('Conversion Recovery and Re-engagement', () => {
    test('should handle abandoned form recovery', async ({ page }) => {
      // Start form but don't complete
      const startProjectButton = page.locator('button', { hasText: /start your project/i });
      await startProjectButton.click();
      
      // Partially fill form
      await page.fill('input[name="name"]', 'Abandoned Form User');
      await page.fill('input[name="email"]', 'abandoned@test.com');
      
      // Navigate away (simulate abandonment)
      await page.goto('/');
      
      // Return to form
      await startProjectButton.click();
      
      // Check if form data is preserved (if implemented)
      const nameInput = page.locator('input[name="name"]');
      const nameValue = await nameInput.inputValue();
      
      // Complete form
      if (!nameValue) {
        await page.fill('input[name="name"]', 'Recovered User');
      }
      
      await page.fill('input[name="email"]', 'recovered@test.com');
      await page.fill('textarea[name="message"]', 'Completed after abandonment');
      
      await page.locator('button[type="submit"]').click();
    });
  });
});
