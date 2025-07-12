/**
 * PLAYWRIGHT GLOBAL TEARDOWN
 * 
 * Global teardown for E2E tests including cleanup,
 * report generation, and resource disposal.
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(_config: FullConfig) {
  console.log('🧹 Starting E2E Test Global Teardown...');

  try {
    // Perform cleanup tasks here
    // - Clear test data
    // - Reset database state
    // - Clean up temporary files
    // - Generate final reports

    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown;
