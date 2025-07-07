#!/usr/bin/env node

/**
 * Build Validation Script
 *
 * Validates the codebase for common issues that could cause build failures
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

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkSyntaxErrors(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Basic syntax checks
    const issues = [];

    // Check for unmatched brackets
    const openBrackets = (content.match(/\{/g) || []).length;
    const closeBrackets = (content.match(/\}/g) || []).length;
    if (openBrackets !== closeBrackets) {
      issues.push('Unmatched curly brackets');
    }

    // Check for unmatched parentheses
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      issues.push('Unmatched parentheses');
    }

    // Check for common TypeScript/React issues
    if (
      content.includes('export default function') &&
      !content.includes('export default function ')
    ) {
      issues.push('Possible export default function syntax issue');
    }

    // Check for missing semicolons in important places
    if (content.includes('import ') && !content.match(/import.*from.*['"];/)) {
      issues.push('Possible missing semicolon in import statement');
    }

    return issues;
  } catch (error) {
    return [`File read error: ${error.message}`];
  }
}

function validateSEOComponents() {
  log('\n🔍 Validating SEO Components...', 'blue');

  const seoComponentsDir = 'src/components/seo';
  const seoLibDir = 'src/lib/seo';

  const requiredFiles = [
    'src/components/seo/EnhancedSchemaMarkup.tsx',
    'src/components/seo/LocalSEOOptimizer.tsx',
    'src/components/seo/GoogleMyBusinessIntegration.tsx',
    'src/components/seo/SEOMonitoringDashboard.tsx',
    'src/components/seo/ContentOptimizationTool.tsx',
    'src/lib/seo/content-analyzer.ts',
    'src/lib/seo/image-seo-optimizer.ts',
    'src/lib/seo/multi-language-seo.ts',
    'src/app/sitemap-images.xml/route.ts',
  ];

  let allValid = true;

  requiredFiles.forEach(file => {
    if (checkFileExists(file)) {
      log(`✅ ${file}`, 'green');

      // Check for syntax issues
      const issues = checkSyntaxErrors(file);
      if (issues.length > 0) {
        log(`⚠️  Issues in ${file}:`, 'yellow');
        issues.forEach(issue => log(`   - ${issue}`, 'yellow'));
        allValid = false;
      }
    } else {
      log(`❌ Missing: ${file}`, 'red');
      allValid = false;
    }
  });

  return allValid;
}

function validatePackageJson() {
  log('\n📦 Validating package.json...', 'blue');

  if (!checkFileExists('package.json')) {
    log('❌ package.json not found', 'red');
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    // Check required scripts
    const requiredScripts = ['build', 'dev', 'lint', 'test'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

    if (missingScripts.length > 0) {
      log(`⚠️  Missing scripts: ${missingScripts.join(', ')}`, 'yellow');
    } else {
      log('✅ All required scripts present', 'green');
    }

    // Check for common dependencies
    const requiredDeps = ['next', 'react', 'react-dom'];
    const missingDeps = requiredDeps.filter(
      dep => !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
    );

    if (missingDeps.length > 0) {
      log(`❌ Missing dependencies: ${missingDeps.join(', ')}`, 'red');
      return false;
    } else {
      log('✅ Core dependencies present', 'green');
    }

    return true;
  } catch (error) {
    log(`❌ Error parsing package.json: ${error.message}`, 'red');
    return false;
  }
}

function validateNextConfig() {
  log('\n⚙️  Validating Next.js configuration...', 'blue');

  if (!checkFileExists('next.config.js')) {
    log('❌ next.config.js not found', 'red');
    return false;
  }

  try {
    const content = fs.readFileSync('next.config.js', 'utf8');

    // Check for syntax issues
    const issues = checkSyntaxErrors('next.config.js');
    if (issues.length > 0) {
      log('⚠️  Issues in next.config.js:', 'yellow');
      issues.forEach(issue => log(`   - ${issue}`, 'yellow'));
      return false;
    }

    log('✅ next.config.js syntax looks good', 'green');
    return true;
  } catch (error) {
    log(`❌ Error reading next.config.js: ${error.message}`, 'red');
    return false;
  }
}

function validateTSConfig() {
  log('\n🔧 Validating TypeScript configuration...', 'blue');

  if (!checkFileExists('tsconfig.json')) {
    log('❌ tsconfig.json not found', 'red');
    return false;
  }

  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

    // Check for essential compiler options
    const compilerOptions = tsconfig.compilerOptions || {};

    if (!compilerOptions.strict) {
      log('⚠️  TypeScript strict mode not enabled', 'yellow');
    }

    if (!compilerOptions.jsx) {
      log('❌ JSX not configured in TypeScript', 'red');
      return false;
    }

    log('✅ TypeScript configuration looks good', 'green');
    return true;
  } catch (error) {
    log(`❌ Error parsing tsconfig.json: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('🚀 Build Validation Starting...', 'blue');
  log('=====================================', 'blue');

  const validations = [
    validatePackageJson(),
    validateNextConfig(),
    validateTSConfig(),
    validateSEOComponents(),
  ];

  const allValid = validations.every(Boolean);

  log('\n📊 Validation Summary:', 'blue');
  log('=====================================', 'blue');

  if (allValid) {
    log('✅ All validations passed! Build should be stable.', 'green');
    process.exit(0);
  } else {
    log('❌ Some validations failed. Please fix the issues above.', 'red');
    process.exit(1);
  }
}

// Run validation
main();
