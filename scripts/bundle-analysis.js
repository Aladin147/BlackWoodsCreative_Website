#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes webpack bundle output and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(process.cwd(), '.next');
    this.analyzeDir = path.join(this.buildDir, 'analyze');
    this.thresholds = {
      SMALL: 50 * 1024, // 50KB
      MEDIUM: 200 * 1024, // 200KB
      LARGE: 500 * 1024, // 500KB
      HUGE: 1024 * 1024, // 1MB
    };
  }

  // Run bundle analysis
  async analyze() {
    console.log('🔍 Starting bundle analysis...\n');

    try {
      // Run Next.js build with analyzer
      console.log('📦 Building with bundle analyzer...');
      execSync('npm run analyze', { stdio: 'inherit' });

      // Parse build output
      const buildStats = this.parseBuildOutput();

      // Generate recommendations
      const recommendations = this.generateRecommendations(buildStats);

      // Create report
      this.generateReport(buildStats, recommendations);

      console.log('\n✅ Bundle analysis complete!');
      console.log(`📊 Report saved to: ${path.join(this.analyzeDir, 'bundle-report.json')}`);
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
      process.exit(1);
    }
  }

  // Parse Next.js build output
  parseBuildOutput() {
    const buildOutputPath = path.join(this.buildDir, 'build-manifest.json');

    if (!fs.existsSync(buildOutputPath)) {
      throw new Error('Build manifest not found. Run build first.');
    }

    const manifest = JSON.parse(fs.readFileSync(buildOutputPath, 'utf8'));

    // Extract bundle information
    const stats = {
      pages: {},
      chunks: {},
      totalSize: 0,
      gzippedSize: 0,
      timestamp: new Date().toISOString(),
    };

    // Analyze pages
    Object.entries(manifest.pages).forEach(([page, files]) => {
      const pageSize = this.calculatePageSize(files);
      stats.pages[page] = {
        files,
        size: pageSize,
        sizeFormatted: this.formatBytes(pageSize),
      };
      stats.totalSize += pageSize;
    });

    // Estimate gzipped size (typically 30-40% of original)
    stats.gzippedSize = Math.round(stats.totalSize * 0.35);

    return stats;
  }

  // Calculate page size from file list
  calculatePageSize(files) {
    let totalSize = 0;

    files.forEach(file => {
      const filePath = path.join(this.buildDir, 'static', file);
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        totalSize += stat.size;
      }
    });

    return totalSize;
  }

  // Generate optimization recommendations
  generateRecommendations(stats) {
    const recommendations = [];

    // Check total bundle size
    if (stats.totalSize > this.thresholds.HUGE) {
      recommendations.push({
        type: 'critical',
        message: 'Total bundle size exceeds 1MB - implement aggressive code splitting',
        impact: 'high',
      });
    } else if (stats.totalSize > this.thresholds.LARGE) {
      recommendations.push({
        type: 'warning',
        message: 'Bundle size is large - consider additional optimizations',
        impact: 'medium',
      });
    }

    // Check individual pages
    Object.entries(stats.pages).forEach(([page, data]) => {
      if (data.size > this.thresholds.MEDIUM) {
        recommendations.push({
          type: 'warning',
          message: `Page "${page}" is large (${data.sizeFormatted}) - consider lazy loading`,
          impact: 'medium',
        });
      }
    });

    // Check compression ratio
    const compressionRatio = stats.gzippedSize / stats.totalSize;
    if (compressionRatio > 0.4) {
      recommendations.push({
        type: 'info',
        message: 'Compression ratio could be improved - check for duplicate code',
        impact: 'low',
      });
    }

    // Add general recommendations
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        message: 'Bundle size is well optimized',
        impact: 'none',
      });
    }

    // Add specific optimization suggestions
    recommendations.push({
      type: 'info',
      message: 'Consider implementing preloading for critical components',
      impact: 'low',
    });

    recommendations.push({
      type: 'info',
      message: 'Use dynamic imports for non-critical features',
      impact: 'medium',
    });

    return recommendations;
  }

  // Generate comprehensive report
  generateReport(stats, recommendations) {
    const report = {
      analysis: {
        timestamp: stats.timestamp,
        totalSize: stats.totalSize,
        totalSizeFormatted: this.formatBytes(stats.totalSize),
        gzippedSize: stats.gzippedSize,
        gzippedSizeFormatted: this.formatBytes(stats.gzippedSize),
        compressionRatio: `${((stats.gzippedSize / stats.totalSize) * 100).toFixed(1)}%`,
        pageCount: Object.keys(stats.pages).length,
      },
      pages: stats.pages,
      recommendations: recommendations,
      thresholds: {
        small: this.formatBytes(this.thresholds.SMALL),
        medium: this.formatBytes(this.thresholds.MEDIUM),
        large: this.formatBytes(this.thresholds.LARGE),
        huge: this.formatBytes(this.thresholds.HUGE),
      },
      optimizationTips: [
        'Use dynamic imports for components that are not immediately visible',
        'Implement component preloading based on user interaction',
        'Consider splitting large dependencies into separate chunks',
        'Use Next.js Image component for optimized image loading',
        'Enable gzip/brotli compression on your server',
        'Remove unused dependencies and dead code',
        'Use tree shaking to eliminate unused exports',
      ],
    };

    // Save report
    if (!fs.existsSync(this.analyzeDir)) {
      fs.mkdirSync(this.analyzeDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(this.analyzeDir, 'bundle-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Print summary to console
    this.printSummary(report);
  }

  // Print analysis summary
  printSummary(report) {
    console.log('\n📊 Bundle Analysis Summary');
    console.log('═'.repeat(50));
    console.log(`Total Size: ${report.analysis.totalSizeFormatted}`);
    console.log(
      `Gzipped: ${report.analysis.gzippedSizeFormatted} (${report.analysis.compressionRatio})`
    );
    console.log(`Pages: ${report.analysis.pageCount}`);

    console.log('\n📄 Page Sizes:');
    Object.entries(report.pages).forEach(([page, data]) => {
      const status = data.size > this.thresholds.MEDIUM ? '⚠️' : '✅';
      console.log(`  ${status} ${page}: ${data.sizeFormatted}`);
    });

    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => {
      const icon =
        {
          critical: '🔴',
          warning: '🟡',
          info: '🔵',
          success: '🟢',
        }[rec.type] || '📝';
      console.log(`  ${icon} ${rec.message}`);
    });

    console.log('\n🎯 Optimization Tips:');
    report.optimizationTips.slice(0, 3).forEach(tip => {
      console.log(`  • ${tip}`);
    });
  }

  // Format bytes to human readable
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = BundleAnalyzer;
