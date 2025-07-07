#!/usr/bin/env node

/**
 * Hash Collection Script for CSP Compliance
 * Automates the collection of Framer Motion style hashes for production CSP
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  hashFilePath: path.join(__dirname, '../src/lib/utils/csp-hashes.json'),
  testTimeout: 30000, // 30 seconds
  collectionDelay: 5000, // 5 seconds to let animations run
  devServerPort: 3000,
  testPages: ['/', '/about', '/services', '/portfolio', '/contact'],
};

class HashCollectionRunner {
  constructor() {
    this.collectedHashes = new Set();
    this.stats = {
      startTime: Date.now(),
      pagesVisited: 0,
      hashesCollected: 0,
      errors: [],
    };
  }

  /**
   * Main execution function
   */
  async run() {
    console.log('🚀 Starting Framer Motion hash collection...\n');

    try {
      // Check if development server is running
      await this.checkDevServer();

      // Install dependencies if needed
      await this.ensureDependencies();

      // Run hash collection
      await this.collectHashes();

      // Save results
      await this.saveResults();

      // Display summary
      this.displaySummary();
    } catch (error) {
      console.error('❌ Hash collection failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Check if development server is running
   */
  async checkDevServer() {
    console.log('🔍 Checking development server...');

    try {
      const response = await fetch(`http://localhost:${CONFIG.devServerPort}`);
      if (response.ok) {
        console.log('✅ Development server is running\n');
        return;
      }
    } catch (error) {
      // Server not running
    }

    console.log('⚠️  Development server not detected');
    console.log('Please start the development server with: npm run dev\n');
    throw new Error('Development server required for hash collection');
  }

  /**
   * Ensure required dependencies are installed
   */
  async ensureDependencies() {
    console.log('📦 Checking dependencies...');

    const requiredPackages = ['puppeteer'];
    const missingPackages = [];

    for (const pkg of requiredPackages) {
      try {
        require.resolve(pkg);
      } catch (error) {
        missingPackages.push(pkg);
      }
    }

    if (missingPackages.length > 0) {
      console.log(`📥 Installing missing dependencies: ${missingPackages.join(', ')}`);
      execSync(`npm install --save-dev ${missingPackages.join(' ')}`, { stdio: 'inherit' });
    }

    console.log('✅ Dependencies ready\n');
  }

  /**
   * Collect hashes using Puppeteer
   */
  async collectHashes() {
    console.log('🎭 Starting browser automation...');

    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      devtools: true,
      args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
    });

    try {
      const page = await browser.newPage();

      // Enable console logging
      page.on('console', msg => {
        if (msg.text().includes('Collected new hash')) {
          console.log(`  📝 ${msg.text()}`);
        }
      });

      // Collect hashes from each page
      for (const pagePath of CONFIG.testPages) {
        await this.collectFromPage(page, pagePath);
      }

      // Extract collected hashes from browser storage
      await this.extractHashesFromBrowser(page);
    } finally {
      await browser.close();
    }
  }

  /**
   * Collect hashes from a specific page
   */
  async collectFromPage(page, pagePath) {
    const url = `http://localhost:${CONFIG.devServerPort}${pagePath}`;
    console.log(`🌐 Visiting: ${url}`);

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: CONFIG.testTimeout });
      this.stats.pagesVisited++;

      // Start hash collection
      await page.evaluate(() => {
        if (window.startHashCollection) {
          window.startHashCollection();
        }
      });

      // Trigger various interactions to capture animation hashes
      await this.triggerInteractions(page);

      // Wait for animations to complete
      await page.waitForTimeout(CONFIG.collectionDelay);

      console.log(`  ✅ Completed: ${pagePath}`);
    } catch (error) {
      console.log(`  ❌ Error on ${pagePath}: ${error.message}`);
      this.stats.errors.push({ page: pagePath, error: error.message });
    }
  }

  /**
   * Trigger various interactions to capture animation states
   */
  async triggerInteractions(page) {
    try {
      // Hover over interactive elements
      const hoverSelectors = [
        'button',
        'a',
        '[data-motion-component]',
        '.btn-primary',
        '.btn-secondary',
        '.magnetic-field',
      ];

      for (const selector of hoverSelectors) {
        const elements = await page.$$(selector);
        for (let i = 0; i < Math.min(elements.length, 5); i++) {
          try {
            await elements[i].hover();
            await page.waitForTimeout(200);
          } catch (error) {
            // Ignore hover errors
          }
        }
      }

      // Scroll to trigger scroll animations
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await page.waitForTimeout(1000);

      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1000);

      // Click on interactive elements
      const clickSelectors = [
        'button:not([type="submit"])',
        '.portfolio-filter button',
        '.nav-toggle',
      ];

      for (const selector of clickSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            await element.click();
            await page.waitForTimeout(500);
          }
        } catch (error) {
          // Ignore click errors
        }
      }
    } catch (error) {
      console.log(`    ⚠️ Interaction error: ${error.message}`);
    }
  }

  /**
   * Extract collected hashes from browser localStorage
   */
  async extractHashesFromBrowser(page) {
    console.log('📊 Extracting collected hashes...');

    const hashes = await page.evaluate(() => {
      const storageKey = 'framer-motion-hashes';
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        try {
          const data = JSON.parse(stored);
          return Object.values(data.hashes || {}).map(hashData => hashData.hash);
        } catch (error) {
          console.error('Failed to parse stored hashes:', error);
          return [];
        }
      }

      return [];
    });

    hashes.forEach(hash => this.collectedHashes.add(hash));
    this.stats.hashesCollected = this.collectedHashes.size;

    console.log(`  📝 Extracted ${hashes.length} hashes from browser storage`);
  }

  /**
   * Save collected hashes to file
   */
  async saveResults() {
    console.log('💾 Saving results...');

    // Load existing hash data
    let hashData = {
      version: '1.0.0',
      lastUpdated: 0,
      description: 'Automatically collected CSP hashes for Framer Motion styles',
      hashes: { common: [], collected: [], manual: [] },
      components: {},
      stats: { totalCollected: 0, lastCollectionRun: 0, collectionDuration: 0 },
    };

    if (fs.existsSync(CONFIG.hashFilePath)) {
      try {
        const fileContent = fs.readFileSync(CONFIG.hashFilePath, 'utf-8');
        hashData = JSON.parse(fileContent);
      } catch (error) {
        console.warn('Failed to load existing hash data, using defaults');
      }
    }

    // Update with new hashes
    const newHashes = Array.from(this.collectedHashes).filter(
      hash =>
        !hashData.hashes.collected.includes(`'${hash}'`) &&
        !hashData.hashes.common.includes(`'${hash}'`)
    );

    hashData.hashes.collected.push(...newHashes.map(hash => `'${hash}'`));
    hashData.lastUpdated = Date.now();
    hashData.stats.totalCollected = hashData.hashes.collected.length;
    hashData.stats.lastCollectionRun = Date.now();
    hashData.stats.collectionDuration = Date.now() - this.stats.startTime;

    // Save to file
    fs.writeFileSync(CONFIG.hashFilePath, JSON.stringify(hashData, null, 2));

    console.log(`  ✅ Saved ${newHashes.length} new hashes to ${CONFIG.hashFilePath}`);
  }

  /**
   * Display collection summary
   */
  displaySummary() {
    const duration = Date.now() - this.stats.startTime;

    console.log('\n📋 Collection Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`⏱️  Duration: ${Math.round(duration / 1000)}s`);
    console.log(`🌐 Pages visited: ${this.stats.pagesVisited}/${CONFIG.testPages.length}`);
    console.log(`📝 Hashes collected: ${this.stats.hashesCollected}`);
    console.log(`❌ Errors: ${this.stats.errors.length}`);

    if (this.stats.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      this.stats.errors.forEach(({ page, error }) => {
        console.log(`   ${page}: ${error}`);
      });
    }

    console.log('\n🎉 Hash collection completed!');
    console.log('💡 Next steps:');
    console.log('   1. Review collected hashes in csp-hashes.json');
    console.log('   2. Test the website with updated CSP');
    console.log('   3. Deploy with new hash configuration');
  }
}

// Run the script
if (require.main === module) {
  const runner = new HashCollectionRunner();
  runner.run().catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = HashCollectionRunner;
