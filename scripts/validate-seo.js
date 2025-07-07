#!/usr/bin/env node

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

function checkSEOFiles() {
  log('🔍 SEO Files Validation', 'bright');
  log('==========================================', 'blue');

  const seoFiles = [
    { path: 'src/app/sitemap.ts', name: 'Main Sitemap' },
    { path: 'src/app/sitemap-images.xml/route.ts', name: 'Image Sitemap' },
    { path: 'src/app/robots.ts', name: 'Robots.txt' },
    { path: 'public/robots.txt', name: 'Static Robots.txt' },
    { path: 'src/components/seo/index.ts', name: 'SEO Components' },
    { path: 'src/lib/seo/index.ts', name: 'SEO Library' },
  ];

  let allFilesExist = true;

  seoFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      log(`✅ ${file.name}: Found`, 'green');
    } else {
      log(`❌ ${file.name}: Missing`, 'red');
      allFilesExist = false;
    }
  });

  return allFilesExist;
}

function validateSitemapStructure() {
  log('\n🗺️  Sitemap Structure Validation', 'bright');
  log('==========================================', 'blue');

  try {
    // Check main sitemap
    const sitemapPath = 'src/app/sitemap.ts';
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      
      // Check for required elements
      const checks = [
        { pattern: /priority:\s*1\.0/, name: 'Homepage priority' },
        { pattern: /changeFrequency:\s*['"]weekly['"]/, name: 'Change frequency' },
        { pattern: /lastModified/, name: 'Last modified dates' },
        { pattern: /services/, name: 'Services pages' },
        { pattern: /about/, name: 'About page' },
        { pattern: /portfolio/, name: 'Portfolio page' },
        { pattern: /contact/, name: 'Contact page' },
      ];

      checks.forEach(check => {
        if (check.pattern.test(sitemapContent)) {
          log(`✅ ${check.name}: Found`, 'green');
        } else {
          log(`⚠️  ${check.name}: Missing or incorrect`, 'yellow');
        }
      });
    }

    // Check image sitemap
    const imageSitemapPath = 'src/app/sitemap-images.xml/route.ts';
    if (fs.existsSync(imageSitemapPath)) {
      const imageSitemapContent = fs.readFileSync(imageSitemapPath, 'utf8');
      
      const imageChecks = [
        { pattern: /portfolioImages/, name: 'Portfolio images' },
        { pattern: /serviceImages/, name: 'Service images' },
        { pattern: /caption/, name: 'Image captions' },
        { pattern: /location/, name: 'Geo-location data' },
        { pattern: /Morocco/, name: 'Morocco-specific content' },
      ];

      imageChecks.forEach(check => {
        if (check.pattern.test(imageSitemapContent)) {
          log(`✅ Image ${check.name}: Found`, 'green');
        } else {
          log(`⚠️  Image ${check.name}: Missing`, 'yellow');
        }
      });
    }

  } catch (error) {
    log(`❌ Error validating sitemap: ${error.message}`, 'red');
    return false;
  }

  return true;
}

function validateRobotsConfiguration() {
  log('\n🤖 Robots.txt Validation', 'bright');
  log('==========================================', 'blue');

  try {
    // Check Next.js robots.ts
    const robotsPath = 'src/app/robots.ts';
    if (fs.existsSync(robotsPath)) {
      const robotsContent = fs.readFileSync(robotsPath, 'utf8');
      
      const robotsChecks = [
        { pattern: /userAgent:\s*['*']/, name: 'User agent wildcard' },
        { pattern: /allow:\s*['/']/, name: 'Allow root' },
        { pattern: /disallow.*api/, name: 'Disallow API routes' },
        { pattern: /sitemap.*sitemap\.xml/, name: 'Sitemap reference' },
        { pattern: /blackwoodscreative\.com/, name: 'Correct domain' },
      ];

      robotsChecks.forEach(check => {
        if (check.pattern.test(robotsContent)) {
          log(`✅ ${check.name}: Configured`, 'green');
        } else {
          log(`⚠️  ${check.name}: Missing or incorrect`, 'yellow');
        }
      });
    }

    // Check static robots.txt
    const staticRobotsPath = 'public/robots.txt';
    if (fs.existsSync(staticRobotsPath)) {
      log(`✅ Static robots.txt: Found (fallback)`, 'green');
    }

  } catch (error) {
    log(`❌ Error validating robots.txt: ${error.message}`, 'red');
    return false;
  }

  return true;
}

function validateSEOComponents() {
  log('\n🧩 SEO Components Validation', 'bright');
  log('==========================================', 'blue');

  const componentChecks = [
    { path: 'src/components/seo/EnhancedSchemaMarkup.tsx', name: 'Enhanced Schema Markup' },
    { path: 'src/components/seo/LocalSEOOptimizer.tsx', name: 'Local SEO Optimizer' },
    { path: 'src/components/seo/GoogleMyBusinessIntegration.tsx', name: 'Google My Business' },
    { path: 'src/components/seo/SEOMonitoringDashboard.tsx', name: 'SEO Monitoring Dashboard' },
    { path: 'src/components/seo/ContentOptimizationTool.tsx', name: 'Content Optimization Tool' },
  ];

  let allComponentsExist = true;

  componentChecks.forEach(component => {
    if (fs.existsSync(component.path)) {
      log(`✅ ${component.name}: Available`, 'green');
    } else {
      log(`❌ ${component.name}: Missing`, 'red');
      allComponentsExist = false;
    }
  });

  return allComponentsExist;
}

function generateSEOReport() {
  log('\n📊 SEO Implementation Report', 'bright');
  log('==========================================', 'blue');

  const report = {
    sitemaps: {
      main: fs.existsSync('src/app/sitemap.ts'),
      images: fs.existsSync('src/app/sitemap-images.xml/route.ts'),
    },
    robots: {
      dynamic: fs.existsSync('src/app/robots.ts'),
      static: fs.existsSync('public/robots.txt'),
    },
    components: {
      schema: fs.existsSync('src/components/seo/EnhancedSchemaMarkup.tsx'),
      local: fs.existsSync('src/components/seo/LocalSEOOptimizer.tsx'),
      gmb: fs.existsSync('src/components/seo/GoogleMyBusinessIntegration.tsx'),
      monitoring: fs.existsSync('src/components/seo/SEOMonitoringDashboard.tsx'),
    },
    library: {
      core: fs.existsSync('src/lib/seo/index.ts'),
      optimization: fs.existsSync('src/lib/seo/optimization.ts'),
      analytics: fs.existsSync('src/lib/seo/content-analyzer.ts'),
    },
  };

  // Calculate completion percentage
  const totalChecks = Object.values(report).reduce((total, category) => {
    return total + Object.keys(category).length;
  }, 0);

  const passedChecks = Object.values(report).reduce((total, category) => {
    return total + Object.values(category).filter(Boolean).length;
  }, 0);

  const completionPercentage = ((passedChecks / totalChecks) * 100).toFixed(1);

  log(`\n📈 SEO Implementation Status: ${completionPercentage}%`, 'cyan');
  
  if (completionPercentage >= 90) {
    log('🎉 Excellent! SEO implementation is comprehensive', 'green');
  } else if (completionPercentage >= 75) {
    log('👍 Good! Most SEO components are in place', 'yellow');
  } else {
    log('⚠️  SEO implementation needs attention', 'red');
  }

  // Next steps
  log('\n🚀 Next Steps for Google Search Console:', 'bright');
  log('1. Submit sitemap: https://blackwoodscreative.com/sitemap.xml', 'cyan');
  log('2. Submit image sitemap: https://blackwoodscreative.com/sitemap-images.xml', 'cyan');
  log('3. Verify robots.txt: https://blackwoodscreative.com/robots.txt', 'cyan');
  log('4. Monitor Core Web Vitals and indexing status', 'cyan');
  log('5. Set up performance tracking and alerts', 'cyan');

  return report;
}

function main() {
  log('🚀 SEO Validation Starting...', 'bright');
  log('==========================================', 'blue');

  const results = {
    files: checkSEOFiles(),
    sitemap: validateSitemapStructure(),
    robots: validateRobotsConfiguration(),
    components: validateSEOComponents(),
  };

  const report = generateSEOReport();

  const allPassed = Object.values(results).every(Boolean);

  log('\n📊 SEO Validation Summary:', 'bright');
  log('==========================================', 'blue');

  if (allPassed) {
    log('✅ All SEO validations passed!', 'green');
    log('🎯 Ready for Google Search Console submission', 'green');
  } else {
    log('⚠️  Some SEO issues found - review above', 'yellow');
  }

  process.exit(allPassed ? 0 : 1);
}

// Run the validation
main();
