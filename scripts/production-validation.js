#!/usr/bin/env node

/**
 * Production Environment Validation Script
 *
 * Comprehensive validation of production readiness including:
 * - Environment variables
 * - Build configuration
 * - Security settings
 * - Performance optimization
 * - Deployment readiness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color logging utility
const colors = {
  reset: '\x1b[0m',
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

// Validation results tracking
const validationResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: [],
};

function addResult(type, message, details = '') {
  validationResults[type]++;
  if (type === 'failed' || type === 'warnings') {
    validationResults.issues.push({ type, message, details });
  }
}

// Environment Variables Validation
function validateEnvironmentVariables() {
  log('\n🔧 Validating Environment Variables...', 'blue');

  // Load environment variables from .env.local if it exists
  const envLocalPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value && !key.startsWith('#')) {
        process.env[key.trim()] = value.trim().replace(/"/g, '');
      }
    });
    log('✅ Loaded environment variables from .env.local', 'green');
  }

  const requiredEnvVars = ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_SITE_NAME'];

  const optionalEnvVars = [
    'FORMSPREE_FORM_ID',
    'FORMSPREE_MASTER_KEY',
    'FORMSPREE_READONLY_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'NEXT_PUBLIC_GA_ID',
    'VERCEL_ANALYTICS_ID',
  ];

  let allRequired = true;

  // Check required environment variables
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      log(`❌ Missing required environment variable: ${envVar}`, 'red');
      addResult('failed', `Missing required environment variable: ${envVar}`);
      allRequired = false;
    } else {
      log(`✅ ${envVar}: Set`, 'green');
      addResult('passed', `Environment variable ${envVar} is set`);
    }
  });

  // Check optional environment variables
  optionalEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      log(`⚠️  Optional environment variable not set: ${envVar}`, 'yellow');
      addResult('warnings', `Optional environment variable not set: ${envVar}`);
    } else {
      log(`✅ ${envVar}: Set`, 'green');
      addResult('passed', `Optional environment variable ${envVar} is set`);
    }
  });

  // Validate environment variable formats
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_SITE_URL);
      log('✅ NEXT_PUBLIC_SITE_URL is a valid URL', 'green');
      addResult('passed', 'NEXT_PUBLIC_SITE_URL format is valid');
    } catch (error) {
      log('❌ NEXT_PUBLIC_SITE_URL is not a valid URL', 'red');
      addResult('failed', 'NEXT_PUBLIC_SITE_URL format is invalid');
      allRequired = false;
    }
  }

  return allRequired;
}

// Build Configuration Validation
function validateBuildConfiguration() {
  log('\n🏗️  Validating Build Configuration...', 'blue');

  let buildValid = true;

  // Check Next.js configuration
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    log('✅ next.config.js exists', 'green');
    addResult('passed', 'Next.js configuration file exists');

    try {
      const nextConfig = require(nextConfigPath);

      // Check production optimizations
      if (nextConfig.swcMinify) {
        log('✅ SWC minification enabled', 'green');
        addResult('passed', 'SWC minification is enabled');
      } else {
        log('⚠️  SWC minification not enabled', 'yellow');
        addResult('warnings', 'SWC minification not enabled');
      }

      if (nextConfig.compress) {
        log('✅ Compression enabled', 'green');
        addResult('passed', 'Compression is enabled');
      } else {
        log('⚠️  Compression not enabled', 'yellow');
        addResult('warnings', 'Compression not enabled');
      }

      if (nextConfig.poweredByHeader === false) {
        log('✅ X-Powered-By header disabled', 'green');
        addResult('passed', 'X-Powered-By header is disabled');
      } else {
        log('⚠️  X-Powered-By header not disabled', 'yellow');
        addResult('warnings', 'X-Powered-By header not disabled');
      }
    } catch (error) {
      log('❌ Error reading next.config.js', 'red');
      addResult('failed', 'Error reading Next.js configuration');
      buildValid = false;
    }
  } else {
    log('❌ next.config.js not found', 'red');
    addResult('failed', 'Next.js configuration file not found');
    buildValid = false;
  }

  // Check TypeScript configuration
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsConfigPath)) {
    log('✅ tsconfig.json exists', 'green');
    addResult('passed', 'TypeScript configuration exists');
  } else {
    log('❌ tsconfig.json not found', 'red');
    addResult('failed', 'TypeScript configuration not found');
    buildValid = false;
  }

  return buildValid;
}

// Security Configuration Validation
function validateSecurityConfiguration() {
  log('\n🔒 Validating Security Configuration...', 'blue');

  let securityValid = true;

  // Check middleware exists
  const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
  if (fs.existsSync(middlewarePath)) {
    log('✅ Security middleware exists', 'green');
    addResult('passed', 'Security middleware file exists');

    try {
      const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');

      // Check for security features
      if (middlewareContent.includes('withSecurityHeaders')) {
        log('✅ Security headers middleware configured', 'green');
        addResult('passed', 'Security headers middleware is configured');
      } else {
        log('⚠️  Security headers middleware not found', 'yellow');
        addResult('warnings', 'Security headers middleware not found');
      }

      if (middlewareContent.includes('Ratelimit')) {
        log('✅ Rate limiting configured', 'green');
        addResult('passed', 'Rate limiting is configured');
      } else {
        log('⚠️  Rate limiting not configured', 'yellow');
        addResult('warnings', 'Rate limiting not configured');
      }

      if (middlewareContent.includes('generateCSRFToken')) {
        log('✅ CSRF protection configured', 'green');
        addResult('passed', 'CSRF protection is configured');
      } else {
        log('⚠️  CSRF protection not found', 'yellow');
        addResult('warnings', 'CSRF protection not found');
      }
    } catch (error) {
      log('❌ Error reading middleware file', 'red');
      addResult('failed', 'Error reading security middleware');
      securityValid = false;
    }
  } else {
    log('❌ Security middleware not found', 'red');
    addResult('failed', 'Security middleware file not found');
    securityValid = false;
  }

  return securityValid;
}

// Performance Validation
function validatePerformance() {
  log('\n⚡ Validating Performance Configuration...', 'blue');

  let performanceValid = true;

  // Check if build exists
  const buildDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(buildDir)) {
    log('✅ Production build exists', 'green');
    addResult('passed', 'Production build directory exists');

    // Check bundle sizes
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      log('✅ Static assets directory exists', 'green');
      addResult('passed', 'Static assets directory exists');
    } else {
      log('⚠️  Static assets directory not found', 'yellow');
      addResult('warnings', 'Static assets directory not found');
    }
  } else {
    log('❌ Production build not found - run "npm run build" first', 'red');
    addResult('failed', 'Production build not found');
    performanceValid = false;
  }

  // Check performance budget configuration
  const performanceBudgetPath = path.join(
    process.cwd(),
    'src',
    'lib',
    'config',
    'performance-budgets.ts'
  );
  if (fs.existsSync(performanceBudgetPath)) {
    log('✅ Performance budgets configured', 'green');
    addResult('passed', 'Performance budgets are configured');
  } else {
    log('⚠️  Performance budgets not configured', 'yellow');
    addResult('warnings', 'Performance budgets not configured');
  }

  return performanceValid;
}

// Deployment Readiness Validation
function validateDeploymentReadiness() {
  log('\n🚀 Validating Deployment Readiness...', 'blue');

  let deploymentReady = true;

  // Check package.json scripts
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const requiredScripts = ['build', 'start', 'dev'];
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        log(`✅ Script "${script}" exists`, 'green');
        addResult('passed', `Required script "${script}" exists`);
      } else {
        log(`❌ Script "${script}" missing`, 'red');
        addResult('failed', `Required script "${script}" missing`);
        deploymentReady = false;
      }
    });
  } else {
    log('❌ package.json not found', 'red');
    addResult('failed', 'package.json not found');
    deploymentReady = false;
  }

  // Check deployment configuration files
  const deploymentConfigs = [
    { file: 'vercel.json', platform: 'Vercel' },
    { file: 'netlify.toml', platform: 'Netlify' },
    { file: 'Dockerfile', platform: 'Docker' },
  ];

  let hasDeploymentConfig = false;
  deploymentConfigs.forEach(config => {
    if (fs.existsSync(path.join(process.cwd(), config.file))) {
      log(`✅ ${config.platform} deployment config found`, 'green');
      addResult('passed', `${config.platform} deployment configuration exists`);
      hasDeploymentConfig = true;
    }
  });

  if (!hasDeploymentConfig) {
    log('⚠️  No deployment configuration found', 'yellow');
    addResult('warnings', 'No deployment configuration found');
  }

  return deploymentReady;
}

// Test Production Build
function testProductionBuild() {
  log('\n🧪 Testing Production Build...', 'blue');

  try {
    log('Running production build test...', 'cyan');
    execSync('npm run build', { stdio: 'pipe' });
    log('✅ Production build successful', 'green');
    addResult('passed', 'Production build completed successfully');
    return true;
  } catch (error) {
    log('❌ Production build failed', 'red');
    addResult('failed', 'Production build failed', error.message);
    return false;
  }
}

// Generate Production Readiness Report
function generateReport() {
  log('\n📊 Production Readiness Report', 'magenta');
  log('=====================================', 'magenta');

  const total = validationResults.passed + validationResults.failed + validationResults.warnings;
  const successRate = ((validationResults.passed / total) * 100).toFixed(1);

  log(`✅ Passed: ${validationResults.passed}`, 'green');
  log(`❌ Failed: ${validationResults.failed}`, 'red');
  log(`⚠️  Warnings: ${validationResults.warnings}`, 'yellow');
  log(`📈 Success Rate: ${successRate}%`, 'cyan');

  if (validationResults.failed === 0) {
    log('\n🎉 Production Ready!', 'green');
    log('The application is ready for production deployment.', 'green');
  } else {
    log('\n🔧 Issues Found', 'red');
    log('Please address the following issues before deployment:', 'red');

    validationResults.issues.forEach(issue => {
      if (issue.type === 'failed') {
        log(`❌ ${issue.message}`, 'red');
        if (issue.details) {
          log(`   Details: ${issue.details}`, 'red');
        }
      }
    });
  }

  if (validationResults.warnings > 0) {
    log('\n⚠️  Warnings (Optional Improvements):', 'yellow');
    validationResults.issues.forEach(issue => {
      if (issue.type === 'warnings') {
        log(`⚠️  ${issue.message}`, 'yellow');
      }
    });
  }
}

// Main validation function
function main() {
  log('🚀 Production Environment Validation', 'blue');
  log('=====================================', 'blue');

  const validations = [
    validateEnvironmentVariables(),
    validateBuildConfiguration(),
    validateSecurityConfiguration(),
    validatePerformance(),
    validateDeploymentReadiness(),
    testProductionBuild(),
  ];

  const allValid = validations.every(Boolean);

  generateReport();

  // Exit with appropriate code
  process.exit(validationResults.failed === 0 ? 0 : 1);
}

// Run validation
if (require.main === module) {
  main();
}

module.exports = {
  validateEnvironmentVariables,
  validateBuildConfiguration,
  validateSecurityConfiguration,
  validatePerformance,
  validateDeploymentReadiness,
  testProductionBuild,
};
