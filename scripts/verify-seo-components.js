#!/usr/bin/env node

/**
 * SEO Components Verification Script
 *
 * Manually verifies that SEO components can be imported and have correct exports
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkExports(filePath, expectedExports) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const missingExports = [];

    expectedExports.forEach(exportName => {
      // Check for export function, export const, or export class
      const exportPattern = new RegExp(`export\\s+(function|const|class)\\s+${exportName}`, 'g');
      const namedExportPattern = new RegExp(`export\\s+\\{[^}]*${exportName}[^}]*\\}`, 'g');

      if (!exportPattern.test(content) && !namedExportPattern.test(content)) {
        missingExports.push(exportName);
      }
    });

    return missingExports;
  } catch (error) {
    return [`Error reading file: ${error.message}`];
  }
}

function verifySchemaComponents() {
  log('\n🔍 Verifying Enhanced Schema Markup Components...', 'blue');

  const filePath = 'src/components/seo/EnhancedSchemaMarkup.tsx';
  const expectedExports = [
    'FAQSchema',
    'ServiceSchema',
    'ReviewSchema',
    'BreadcrumbSchema',
    'EnhancedLocalBusinessSchema',
    'CreativeWorkSchema',
  ];

  const missingExports = checkExports(filePath, expectedExports);

  if (missingExports.length === 0) {
    log('✅ All Enhanced Schema Markup exports found', 'green');
    return true;
  } else {
    log(`❌ Missing exports in ${filePath}:`, 'red');
    missingExports.forEach(exp => log(`   - ${exp}`, 'red'));
    return false;
  }
}

function verifyLocalSEOComponents() {
  log('\n🔍 Verifying Local SEO Optimizer Components...', 'blue');

  const filePath = 'src/components/seo/LocalSEOOptimizer.tsx';
  const expectedExports = [
    'MoroccoLocalBusinessSchema',
    'HreflangTags',
    'MoroccoFAQSchema',
    'LocalBusinessReviewsSchema',
    'ServiceAreaSchema',
  ];

  const missingExports = checkExports(filePath, expectedExports);

  if (missingExports.length === 0) {
    log('✅ All Local SEO Optimizer exports found', 'green');
    return true;
  } else {
    log(`❌ Missing exports in ${filePath}:`, 'red');
    missingExports.forEach(exp => log(`   - ${exp}`, 'red'));
    return false;
  }
}

function verifyGMBComponents() {
  log('\n🔍 Verifying Google My Business Components...', 'blue');

  const filePath = 'src/components/seo/GoogleMyBusinessIntegration.tsx';
  const expectedExports = ['GoogleMyBusinessSchema', 'GoogleMyBusinessPostsSchema', 'NAPData'];

  const missingExports = checkExports(filePath, expectedExports);

  if (missingExports.length === 0) {
    log('✅ All Google My Business exports found', 'green');
    return true;
  } else {
    log(`❌ Missing exports in ${filePath}:`, 'red');
    missingExports.forEach(exp => log(`   - ${exp}`, 'red'));
    return false;
  }
}

function verifyDashboardComponents() {
  log('\n🔍 Verifying Dashboard Components...', 'blue');

  const components = [
    {
      file: 'src/components/seo/SEOMonitoringDashboard.tsx',
      exports: ['SEOMonitoringDashboard'],
    },
    {
      file: 'src/components/seo/ContentOptimizationTool.tsx',
      exports: ['ContentOptimizationTool'],
    },
  ];

  let allValid = true;

  components.forEach(({ file, exports }) => {
    const missingExports = checkExports(file, exports);

    if (missingExports.length === 0) {
      log(`✅ ${path.basename(file)} exports found`, 'green');
    } else {
      log(`❌ Missing exports in ${file}:`, 'red');
      missingExports.forEach(exp => log(`   - ${exp}`, 'red'));
      allValid = false;
    }
  });

  return allValid;
}

function verifySEOLibraries() {
  log('\n🔍 Verifying SEO Library Functions...', 'blue');

  const libraries = [
    {
      file: 'src/lib/seo/content-analyzer.ts',
      exports: ['SEOContentAnalyzer', 'MOROCCO_KEYWORDS'],
    },
    {
      file: 'src/lib/seo/image-seo-optimizer.ts',
      exports: ['ImageSEOOptimizer', 'imageSEOOptimizer', 'optimizePortfolioImage'],
    },
    {
      file: 'src/lib/seo/multi-language-seo.ts',
      exports: ['SUPPORTED_LANGUAGES', 'generateHreflangTags', 'getTranslation'],
    },
  ];

  let allValid = true;

  libraries.forEach(({ file, exports }) => {
    const missingExports = checkExports(file, exports);

    if (missingExports.length === 0) {
      log(`✅ ${path.basename(file)} exports found`, 'green');
    } else {
      log(`❌ Missing exports in ${file}:`, 'red');
      missingExports.forEach(exp => log(`   - ${exp}`, 'red'));
      allValid = false;
    }
  });

  return allValid;
}

function verifyIndexExports() {
  log('\n🔍 Verifying SEO Index Exports...', 'blue');

  const indexFile = 'src/components/seo/index.ts';

  if (!fs.existsSync(indexFile)) {
    log('❌ SEO index file not found', 'red');
    return false;
  }

  const content = fs.readFileSync(indexFile, 'utf8');

  // Check for key exports
  const keyExports = [
    'FAQSchema',
    'MoroccoLocalBusinessSchema',
    'GoogleMyBusinessSchema',
    'SEOMonitoringDashboard',
    'ContentOptimizationTool',
  ];

  const missingExports = keyExports.filter(exportName => {
    return !content.includes(exportName);
  });

  if (missingExports.length === 0) {
    log('✅ All key exports found in index file', 'green');
    return true;
  } else {
    log('❌ Missing exports in index file:', 'red');
    missingExports.forEach(exp => log(`   - ${exp}`, 'red'));
    return false;
  }
}

function main() {
  log('🚀 SEO Components Verification Starting...', 'blue');
  log('==========================================', 'blue');

  const verifications = [
    verifySchemaComponents(),
    verifyLocalSEOComponents(),
    verifyGMBComponents(),
    verifyDashboardComponents(),
    verifySEOLibraries(),
    verifyIndexExports(),
  ];

  const allValid = verifications.every(Boolean);

  log('\n📊 Verification Summary:', 'blue');
  log('==========================================', 'blue');

  if (allValid) {
    log('✅ All SEO components verified successfully!', 'green');
    log('🎉 Components are ready for production use.', 'green');
    process.exit(0);
  } else {
    log('❌ Some components have issues. Please fix the problems above.', 'red');
    process.exit(1);
  }
}

// Run verification
main();
