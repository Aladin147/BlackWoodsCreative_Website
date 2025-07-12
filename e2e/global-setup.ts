/**
 * PLAYWRIGHT GLOBAL SETUP
 * 
 * Global setup for E2E tests including authentication,
 * database seeding, and environment preparation.
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E Test Global Setup...');

  // Create a browser instance for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the development server to be ready
    const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
    console.log(`📡 Checking if server is ready at ${baseURL}...`);
    
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    console.log('✅ Development server is ready');

    // Perform any additional setup tasks here
    // - Authentication setup
    // - Database seeding
    // - Cache warming
    // - Test data preparation

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
