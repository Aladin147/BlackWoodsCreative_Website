import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display the main heading', async ({ page }) => {
    await page.goto('/');

    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText('BlackWoods Creative');

    // Check if the page title is correct
    await expect(page).toHaveTitle(/BlackWoods Creative/);

    // Check if the hero section is visible
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have working navigation buttons', async ({ page }) => {
    await page.goto('/');

    // Check if the CTA buttons are present
    await expect(page.locator('button:has-text("View Our Work")')).toBeVisible();
    await expect(page.locator('button:has-text("Start Your Project")')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if content is still visible on mobile
    await expect(page.locator('h1')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Check if content is visible on desktop
    await expect(page.locator('h1')).toBeVisible();
  });
});
