#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function optimizeImages() {
  log('🖼️  Starting Image Optimization...', 'bright');
  log('==========================================', 'blue');

  const inputDir = 'public/assets/icons';
  const outputDir = 'public/assets/icons/optimized';

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Get list of PNG files to optimize
    const files = fs
      .readdirSync(inputDir)
      .filter(file => file.endsWith('.png') && !file.includes('optimized'));

    if (files.length === 0) {
      log('ℹ️  No PNG files found to optimize', 'yellow');
      return;
    }

    log(`📊 Found ${files.length} images to optimize:`, 'cyan');
    files.forEach(file => log(`  • ${file}`));

    let totalOriginalSize = 0;
    let totalWebpSize = 0;
    let totalAvifSize = 0;

    // Calculate original sizes
    files.forEach(file => {
      const filePath = path.join(inputDir, file);
      const stats = fs.statSync(filePath);
      totalOriginalSize += stats.size;
    });

    log('\n🔄 Converting to WebP format...', 'blue');

    // Convert to WebP using Sharp
    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace('.png', '.webp'));

      await sharp(inputPath).webp({ quality: 85, effort: 6 }).toFile(outputPath);

      const stats = fs.statSync(outputPath);
      totalWebpSize += stats.size;
    }

    log('🔄 Converting to AVIF format...', 'blue');

    // Convert to AVIF using Sharp
    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace('.png', '.avif'));

      await sharp(inputPath).avif({ quality: 80, effort: 6 }).toFile(outputPath);

      const stats = fs.statSync(outputPath);
      totalAvifSize += stats.size;
    }

    // Generate optimization report
    log('\n📊 Optimization Results:', 'bright');
    log('==========================================', 'blue');
    log(`Original PNG files: ${formatBytes(totalOriginalSize)}`, 'cyan');
    log(`WebP files: ${formatBytes(totalWebpSize)}`, 'cyan');
    log(`AVIF files: ${formatBytes(totalAvifSize)}`, 'cyan');

    const webpSavings = (((totalOriginalSize - totalWebpSize) / totalOriginalSize) * 100).toFixed(
      1
    );
    const avifSavings = (((totalOriginalSize - totalAvifSize) / totalOriginalSize) * 100).toFixed(
      1
    );

    log(`\n💾 Space Savings:`, 'green');
    log(
      `  WebP: ${webpSavings}% smaller (${formatBytes(totalOriginalSize - totalWebpSize)} saved)`,
      'green'
    );
    log(
      `  AVIF: ${avifSavings}% smaller (${formatBytes(totalOriginalSize - totalAvifSize)} saved)`,
      'green'
    );

    // Generate usage recommendations
    log('\n💡 Usage Recommendations:', 'yellow');
    log('  1. Use AVIF for modern browsers (Chrome 85+, Firefox 93+)', 'yellow');
    log('  2. Use WebP as fallback for older browsers', 'yellow');
    log('  3. Keep PNG as final fallback for legacy browsers', 'yellow');
    log('  4. Implement picture element with multiple sources', 'yellow');

    // Generate example code
    log('\n📝 Example Implementation:', 'cyan');
    log(
      `
<picture>
  <source srcSet="/assets/icons/optimized/logo.avif" type="image/avif" />
  <source srcSet="/assets/icons/optimized/logo.webp" type="image/webp" />
  <img src="/assets/icons/logo.png" alt="Logo" />
</picture>
    `.trim(),
      'cyan'
    );

    log('\n✅ Image optimization completed successfully!', 'green');
  } catch (error) {
    log(`\n❌ Error during optimization: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the optimization
optimizeImages().catch(error => {
  log(`❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
