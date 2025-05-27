import { test, expect } from '@playwright/test';

test.describe('BlackWoods Creative Website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check if the main heading is visible
    await expect(page.getByText('BlackWoods Creative')).toBeVisible();
    await expect(page.getByText('Crafting Visual Stories That Captivate and Convert')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Test navigation links
    await page.getByText('Portfolio').first().click();
    await expect(page.locator('#portfolio')).toBeInViewport();

    await page.getByText('About').first().click();
    await expect(page.locator('#about')).toBeInViewport();

    await page.getByText('Contact').first().click();
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('should display portfolio section correctly', async ({ page }) => {
    await page.getByText('Portfolio').first().click();
    
    // Check portfolio section is visible
    await expect(page.getByText('Our Portfolio')).toBeVisible();
    
    // Check portfolio filters
    await expect(page.getByText('All')).toBeVisible();
    await expect(page.getByText('Film')).toBeVisible();
    await expect(page.getByText('Photography')).toBeVisible();
    
    // Check portfolio items are displayed
    await expect(page.locator('[data-testid="portfolio-card"]').first()).toBeVisible();
  });

  test('should filter portfolio items', async ({ page }) => {
    await page.getByText('Portfolio').first().click();
    
    // Click on Film filter
    await page.getByRole('button', { name: 'Filter portfolio by Film' }).click();
    
    // Wait for animation to complete
    await page.waitForTimeout(500);
    
    // Check that film projects are visible
    await expect(page.getByText('Brand Film')).toBeVisible();
  });

  test('should display contact form', async ({ page }) => {
    await page.getByText('Contact').first().click();
    
    // Check contact form elements
    await expect(page.getByLabelText('Full Name')).toBeVisible();
    await expect(page.getByLabelText('Email Address')).toBeVisible();
    await expect(page.getByLabelText('Project Details')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  });

  test('should validate contact form', async ({ page }) => {
    await page.getByText('Contact').first().click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for validation errors
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Project details are required')).toBeVisible();
  });

  test('should submit contact form with valid data', async ({ page }) => {
    await page.getByText('Contact').first().click();
    
    // Fill out the form
    await page.getByLabelText('Full Name').fill('John Doe');
    await page.getByLabelText('Email Address').fill('john@example.com');
    await page.getByLabelText('Project Details').fill('This is a test project with enough detail to pass validation.');
    
    // Submit the form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for loading state
    await expect(page.getByText('Sending')).toBeVisible();
    
    // Check for success message
    await expect(page.getByText('Message Sent Successfully')).toBeVisible({ timeout: 5000 });
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile menu button is visible
    await expect(page.getByLabelText('Toggle mobile menu')).toBeVisible();
    
    // Open mobile menu
    await page.getByLabelText('Toggle mobile menu').click();
    
    // Check mobile navigation is visible
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    
    // Test mobile navigation
    await page.getByText('Portfolio').nth(1).click(); // Mobile menu link
    await expect(page.locator('#portfolio')).toBeInViewport();
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('BlackWoods Creative');
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
    
    // Check for proper button labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      // Button should have either aria-label or text content
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }
  });

  test('should load images properly', async ({ page }) => {
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check that portfolio images are loaded
    const portfolioImages = page.locator('#portfolio img');
    const imageCount = await portfolioImages.count();
    
    expect(imageCount).toBeGreaterThan(0);
    
    // Check that at least one image has loaded
    const firstImage = portfolioImages.first();
    await expect(firstImage).toBeVisible();
  });

  test('should handle scroll interactions', async ({ page }) => {
    // Test scroll to portfolio
    await page.getByText('View Our Work').click();
    await expect(page.locator('#portfolio')).toBeInViewport();
    
    // Test scroll indicator
    await page.locator('text=Scroll to explore').click();
    await expect(page.locator('#portfolio')).toBeInViewport();
  });

  test('should maintain performance standards', async ({ page }) => {
    // Navigate to the page and wait for it to load
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads within reasonable time
    const navigationStart = await page.evaluate(() => performance.timing.navigationStart);
    const loadComplete = await page.evaluate(() => performance.timing.loadEventEnd);
    const loadTime = loadComplete - navigationStart;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Test with network failures
    await page.route('**/*', route => {
      if (route.request().url().includes('images.unsplash.com')) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    await page.reload();
    
    // Page should still be functional even if some images fail to load
    await expect(page.getByText('BlackWoods Creative')).toBeVisible();
    await expect(page.getByText('Portfolio')).toBeVisible();
  });
});
