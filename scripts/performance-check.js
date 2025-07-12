#!/usr/bin/env node

/**
 * Performance Check Script
 *
 * Comprehensive performance analysis and optimization recommendations
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Performance budgets
const PERFORMANCE_BUDGETS = {
  production: {
    bundleSize: 500 * 1024, // 500KB
    vendorSize: 800 * 1024, // 800KB
    totalSize: 1.5 * 1024 * 1024, // 1.5MB
    gzippedSize: 400 * 1024, // 400KB
  },
  development: {
    bundleSize: 1 * 1024 * 1024, // 1MB
    vendorSize: 1.5 * 1024 * 1024, // 1.5MB
    totalSize: 3 * 1024 * 1024, // 3MB
    gzippedSize: 800 * 1024, // 800KB
  },
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function checkBundleSize() {
  log('\n📦 Checking Bundle Size...', 'blue');

  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');

  if (!fs.existsSync(buildDir)) {
    log('❌ Build directory not found. Run "npm run build" first.', 'red');
    return false;
  }

  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  let violations = [];

  // Check JavaScript bundles
  if (fs.existsSync(path.join(staticDir, 'chunks'))) {
    const chunksDir = path.join(staticDir, 'chunks');
    const files = fs.readdirSync(chunksDir, { recursive: true });

    files.forEach(file => {
      if (typeof file === 'string' && file.endsWith('.js')) {
        const filePath = path.join(chunksDir, file);
        const stats = fs.statSync(filePath);
        jsSize += stats.size;
        totalSize += stats.size;
      }
    });
  }

  // Check CSS files
  if (fs.existsSync(path.join(staticDir, 'css'))) {
    const cssDir = path.join(staticDir, 'css');
    const files = fs.readdirSync(cssDir);

    files.forEach(file => {
      if (file.endsWith('.css')) {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        cssSize += stats.size;
        totalSize += stats.size;
      }
    });
  }

  const budget =
    PERFORMANCE_BUDGETS[process.env.NODE_ENV === 'production' ? 'production' : 'development'];

  log(`📊 Bundle Analysis:`, 'cyan');
  log(`  JavaScript: ${formatBytes(jsSize)}`);
  log(`  CSS: ${formatBytes(cssSize)}`);
  log(`  Total: ${formatBytes(totalSize)}`);

  // Check against budgets
  if (jsSize > budget.bundleSize) {
    violations.push(
      `JavaScript bundle (${formatBytes(jsSize)}) exceeds budget (${formatBytes(budget.bundleSize)})`
    );
  }

  if (totalSize > budget.totalSize) {
    violations.push(
      `Total bundle (${formatBytes(totalSize)}) exceeds budget (${formatBytes(budget.totalSize)})`
    );
  }

  if (violations.length > 0) {
    log('\n⚠️  Budget Violations:', 'yellow');
    violations.forEach(violation => log(`  • ${violation}`, 'red'));
    return false;
  } else {
    log('\n✅ All bundle size budgets passed!', 'green');
    return true;
  }
}

function checkImageOptimization() {
  log('\n🖼️  Checking Image Optimization...', 'blue');

  const publicDir = path.join(process.cwd(), 'public');
  let totalImages = 0;
  let largeImages = [];
  let unoptimizedFormats = [];

  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir, { withFileTypes: true });

    files.forEach(file => {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.isFile()) {
        const ext = path.extname(file.name).toLowerCase();

        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'].includes(ext)) {
          totalImages++;
          const stats = fs.statSync(fullPath);

          // Check for large images (>500KB)
          if (stats.size > 500 * 1024) {
            largeImages.push({
              path: path.relative(process.cwd(), fullPath),
              size: formatBytes(stats.size),
            });
          }

          // Check for unoptimized formats
          if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            unoptimizedFormats.push({
              path: path.relative(process.cwd(), fullPath),
              format: ext,
              size: formatBytes(stats.size),
            });
          }
        }
      }
    });
  }

  scanDirectory(publicDir);

  log(`📊 Image Analysis:`, 'cyan');
  log(`  Total images: ${totalImages}`);
  log(`  Large images (>500KB): ${largeImages.length}`);
  log(`  Unoptimized formats: ${unoptimizedFormats.length}`);

  let hasIssues = false;

  if (largeImages.length > 0) {
    log('\n⚠️  Large Images Found:', 'yellow');
    largeImages.slice(0, 5).forEach(img => {
      log(`  • ${img.path} (${img.size})`, 'red');
    });
    if (largeImages.length > 5) {
      log(`  • ... and ${largeImages.length - 5} more`, 'red');
    }
    hasIssues = true;
  }

  if (unoptimizedFormats.length > 0) {
    log('\n💡 Optimization Opportunities:', 'yellow');
    log(`  • Consider converting ${unoptimizedFormats.length} images to WebP/AVIF format`);
    hasIssues = true;
  }

  if (!hasIssues) {
    log('\n✅ Image optimization looks good!', 'green');
  }

  return !hasIssues;
}

function generateRecommendations() {
  log('\n💡 Performance Optimization Recommendations:', 'magenta');

  const recommendations = [
    'Use dynamic imports for non-critical components',
    'Implement component preloading based on user interaction',
    'Consider splitting large dependencies into separate chunks',
    'Optimize images using WebP/AVIF formats',
    'Implement proper lazy loading for below-the-fold content',
    'Use Next.js Image component for automatic optimization',
    'Consider implementing a service worker for caching',
    'Monitor Core Web Vitals in production',
  ];

  recommendations.forEach((rec, index) => {
    log(`  ${index + 1}. ${rec}`, 'cyan');
  });
}

function main() {
  log('🚀 Performance Check Starting...', 'bright');
  log('==========================================', 'blue');

  const checks = [checkBundleSize(), checkImageOptimization()];

  const allPassed = checks.every(Boolean);

  log('\n📊 Performance Check Summary:', 'bright');
  log('==========================================', 'blue');

  if (allPassed) {
    log('✅ All performance checks passed!', 'green');
    log('🎉 Your application is well optimized.', 'green');
  } else {
    log('⚠️  Some performance issues found.', 'yellow');
    log('📋 Review the recommendations below.', 'yellow');
  }

  generateRecommendations();

  process.exit(allPassed ? 0 : 1);
}

// Run the performance check
main();
