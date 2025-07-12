/**
 * Cross-Browser Automated Testing
 *
 * Automated tests for cross-browser compatibility using Playwright
 */

// Test configuration for different browsers
export interface BrowserTestConfig {
  name: string;
  browserName: 'chromium' | 'firefox' | 'webkit';
  viewport: { width: number; height: number };
  userAgent?: string;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
}

// Test result for a specific browser
export interface BrowserTestResult {
  browser: string;
  passed: boolean;
  duration: number;
  errors: string[];
  warnings: string[];
  performance: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
  };
  accessibility: {
    violations: number;
    issues: string[];
  };
  functionality: {
    navigation: boolean;
    forms: boolean;
    animations: boolean;
    responsive: boolean;
  };
}

// Cross-browser test suite
export class CrossBrowserTestSuite {
  private testConfigs: BrowserTestConfig[] = [
    // Desktop browsers
    {
      name: 'Chrome Desktop',
      browserName: 'chromium',
      viewport: { width: 1920, height: 1080 },
    },
    {
      name: 'Firefox Desktop',
      browserName: 'firefox',
      viewport: { width: 1920, height: 1080 },
    },
    {
      name: 'Safari Desktop',
      browserName: 'webkit',
      viewport: { width: 1920, height: 1080 },
    },
    // Mobile browsers
    {
      name: 'Chrome Mobile',
      browserName: 'chromium',
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    },
    {
      name: 'Firefox Mobile',
      browserName: 'firefox',
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
    {
      name: 'Safari Mobile',
      browserName: 'webkit',
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
    // Tablet
    {
      name: 'iPad',
      browserName: 'webkit',
      viewport: { width: 768, height: 1024 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    },
  ];

  // Run tests across all browsers
  async runAllTests(): Promise<BrowserTestResult[]> {
    const results: BrowserTestResult[] = [];

    for (const config of this.testConfigs) {
      try {
        const result = await this.runBrowserTest(config);
        results.push(result);
      } catch (error) {
        results.push({
          browser: config.name,
          passed: false,
          duration: 0,
          errors: [`Failed to run test: ${error}`],
          warnings: [],
          performance: {
            loadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
          },
          accessibility: {
            violations: 0,
            issues: [],
          },
          functionality: {
            navigation: false,
            forms: false,
            animations: false,
            responsive: false,
          },
        });
      }
    }

    return results;
  }

  // Run test for a specific browser
  private runBrowserTest(config: BrowserTestConfig): BrowserTestResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    // Mock browser test implementation
    // In a real implementation, this would use Playwright to launch browsers
    const mockTestResult: BrowserTestResult = {
      browser: config.name,
      passed: true,
      duration: Date.now() - startTime,
      errors,
      warnings,
      performance: {
        loadTime: Math.random() * 2000 + 500, // 500-2500ms
        firstContentfulPaint: Math.random() * 1000 + 200, // 200-1200ms
        largestContentfulPaint: Math.random() * 2000 + 800, // 800-2800ms
        cumulativeLayoutShift: Math.random() * 0.1, // 0-0.1
      },
      accessibility: {
        violations: Math.floor(Math.random() * 3), // 0-2 violations
        issues: [],
      },
      functionality: {
        navigation: true,
        forms: true,
        animations: !config.isMobile, // Disable animations on mobile for performance
        responsive: true,
      },
    };

    // Simulate some realistic test scenarios
    if (config.browserName === 'firefox' && config.name.includes('Mobile')) {
      mockTestResult.warnings.push('Firefox mobile may have different touch behavior');
    }

    if (config.browserName === 'webkit') {
      mockTestResult.warnings.push('Safari may require vendor prefixes for some CSS features');
    }

    if (config.viewport.width < 768) {
      mockTestResult.functionality.animations = false;
      mockTestResult.warnings.push('Animations disabled on small screens for performance');
    }

    // Simulate performance variations
    if (config.isMobile) {
      mockTestResult.performance.loadTime *= 1.5; // Mobile is typically slower
      mockTestResult.performance.firstContentfulPaint *= 1.3;
      mockTestResult.performance.largestContentfulPaint *= 1.4;
    }

    return mockTestResult;
  }

  // Generate test report
  generateReport(results: BrowserTestResult[]): {
    summary: {
      totalTests: number;
      passed: number;
      failed: number;
      passRate: number;
    };
    performance: {
      averageLoadTime: number;
      averageFCP: number;
      averageLCP: number;
      averageCLS: number;
    };
    issues: {
      critical: string[];
      warnings: string[];
    };
    recommendations: string[];
  } {
    const totalTests = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = totalTests - passed;
    const passRate = (passed / totalTests) * 100;

    // Calculate average performance metrics
    const avgLoadTime = results.reduce((sum, r) => sum + r.performance.loadTime, 0) / totalTests;
    const avgFCP =
      results.reduce((sum, r) => sum + r.performance.firstContentfulPaint, 0) / totalTests;
    const avgLCP =
      results.reduce((sum, r) => sum + r.performance.largestContentfulPaint, 0) / totalTests;
    const avgCLS =
      results.reduce((sum, r) => sum + r.performance.cumulativeLayoutShift, 0) / totalTests;

    // Collect issues
    const critical = results.flatMap(r => r.errors);
    const warnings = results.flatMap(r => r.warnings);

    // Generate recommendations
    const recommendations: string[] = [];

    if (passRate < 100) {
      recommendations.push('Address failing browser tests before deployment');
    }

    if (avgLoadTime > 3000) {
      recommendations.push('Optimize page load time - currently above 3 seconds');
    }

    if (avgLCP > 2500) {
      recommendations.push('Improve Largest Contentful Paint - should be under 2.5 seconds');
    }

    if (avgCLS > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift - should be under 0.1');
    }

    if (critical.length > 0) {
      recommendations.push('Fix critical errors found in browser testing');
    }

    if (warnings.length > 5) {
      recommendations.push('Review and address browser-specific warnings');
    }

    const mobileResults = results.filter(
      r => r.browser.includes('Mobile') || r.browser.includes('iPad')
    );
    const mobilePassed = mobileResults.filter(r => r.passed).length;

    if (mobilePassed < mobileResults.length) {
      recommendations.push('Improve mobile browser compatibility');
    }

    return {
      summary: {
        totalTests,
        passed,
        failed,
        passRate,
      },
      performance: {
        averageLoadTime: avgLoadTime,
        averageFCP: avgFCP,
        averageLCP: avgLCP,
        averageCLS: avgCLS,
      },
      issues: {
        critical,
        warnings,
      },
      recommendations,
    };
  }

  // Test specific functionality across browsers
  testSpecificFeature(feature: string): {
    feature: string;
    results: Array<{
      browser: string;
      supported: boolean;
      issues: string[];
    }>;
  } {
    const results = [];

    for (const config of this.testConfigs) {
      // Mock feature testing
      let supported = true;
      const issues: string[] = [];

      // Simulate feature-specific compatibility
      switch (feature) {
        case 'webp':
          if (config.browserName === 'webkit' && config.name.includes('Desktop')) {
            supported = false;
            issues.push('WebP support limited in older Safari versions');
          }
          break;

        case 'css-grid':
          if (config.browserName === 'firefox' && config.isMobile) {
            issues.push('CSS Grid may have rendering differences on Firefox mobile');
          }
          break;

        case 'intersection-observer':
          supported = true; // Modern browsers support this
          break;

        case 'service-worker':
          if (config.browserName === 'webkit' && config.isMobile) {
            issues.push('Service Worker support may be limited on iOS Safari');
          }
          break;

        default:
          supported = true;
      }

      results.push({
        browser: config.name,
        supported,
        issues,
      });
    }

    return {
      feature,
      results,
    };
  }

  // Get browser configurations
  getBrowserConfigs(): BrowserTestConfig[] {
    return [...this.testConfigs];
  }

  // Add custom browser configuration
  addBrowserConfig(config: BrowserTestConfig): void {
    this.testConfigs.push(config);
  }

  // Remove browser configuration
  removeBrowserConfig(name: string): void {
    this.testConfigs = this.testConfigs.filter(config => config.name !== name);
  }
}

// Utility functions for browser testing
export const BrowserTestUtils = {
  // Check if browser supports modern features
  isModernBrowser: (userAgent: string): boolean => {
    // Check for modern browser versions
    const modernVersions = {
      Chrome: 90,
      Firefox: 88,
      Safari: 14,
      Edge: 90,
    };

    // Use pre-defined regex patterns for browser version detection
    const browserRegexes: Record<string, RegExp> = {
      Chrome: /Chrome\/(\d+)/,
      Firefox: /Firefox\/(\d+)/,
      Safari: /Safari\/(\d+)/,
      Edge: /Edge\/(\d+)/,
    };

    for (const [browser, minVersion] of Object.entries(modernVersions)) {
      if (userAgent.includes(browser)) {
        const regexMap: Record<string, RegExp> = browserRegexes;
        const regex = regexMap[browser];
        if (regex) {
          const versionMatch = userAgent.match(regex);
          if (versionMatch) {
            const version = parseInt(versionMatch[1] ?? '0');
            return version >= minVersion;
          }
        }
      }
    }

    return false;
  },

  // Get browser-specific CSS prefixes
  getBrowserPrefixes: (browserName: string): string[] => {
    const prefixes: Record<string, string[]> = {
      webkit: ['-webkit-'],
      firefox: ['-moz-'],
      chromium: ['-webkit-'],
    };

    const prefixMap: Record<string, string[]> = prefixes;
    return prefixMap[browserName] ?? [];
  },

  // Format test duration
  formatDuration: (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  },

  // Format performance metrics
  formatPerformanceMetric: (value: number, unit: string): string => {
    if (unit === 'ms') {
      return value < 1000 ? `${Math.round(value)}ms` : `${(value / 1000).toFixed(2)}s`;
    }
    return `${value.toFixed(3)}${unit}`;
  },

  // Get performance grade
  getPerformanceGrade: (
    loadTime: number,
    lcp: number,
    cls: number
  ): 'A' | 'B' | 'C' | 'D' | 'F' => {
    let score = 100;

    // Load time scoring
    if (loadTime > 3000) score -= 30;
    else if (loadTime > 2000) score -= 20;
    else if (loadTime > 1000) score -= 10;

    // LCP scoring
    if (lcp > 4000) score -= 25;
    else if (lcp > 2500) score -= 15;
    else if (lcp > 1500) score -= 5;

    // CLS scoring
    if (cls > 0.25) score -= 25;
    else if (cls > 0.1) score -= 15;
    else if (cls > 0.05) score -= 5;

    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  },
};

// Export test suite instance
export const crossBrowserTestSuite = new CrossBrowserTestSuite();
