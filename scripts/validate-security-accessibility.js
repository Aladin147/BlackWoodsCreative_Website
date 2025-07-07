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

function validateSecurityImplementation() {
  log('🔒 Security Implementation Validation', 'bright');
  log('==========================================', 'blue');

  const securityChecks = [
    {
      name: 'Content Security Policy (CSP)',
      path: 'src/lib/utils/security.ts',
      patterns: [
        /buildCSP/,
        /Content-Security-Policy/,
        /script-src/,
        /style-src/,
        /img-src/,
        /connect-src/,
      ],
    },
    {
      name: 'CSRF Protection',
      path: 'src/lib/utils/security.ts',
      patterns: [
        /generateCSRFToken/,
        /verifyCSRFToken/,
        /withCSRFProtection/,
      ],
    },
    {
      name: 'Rate Limiting',
      path: 'src/middleware.ts',
      patterns: [
        /Ratelimit/,
        /rateLimiters/,
        /slidingWindow/,
      ],
    },
    {
      name: 'Security Headers',
      path: 'src/lib/utils/security.ts',
      patterns: [
        /X-Content-Type-Options/,
        /X-Frame-Options/,
        /X-XSS-Protection/,
        /Strict-Transport-Security/,
        /Referrer-Policy/,
      ],
    },
    {
      name: 'Input Sanitization',
      path: 'src/lib/utils/sanitize.ts',
      patterns: [
        /sanitizeFormData/,
        /sanitizeInput/,
      ],
    },
  ];

  let securityScore = 0;
  const maxSecurityScore = securityChecks.length;

  securityChecks.forEach(check => {
    if (fs.existsSync(check.path)) {
      const content = fs.readFileSync(check.path, 'utf8');
      const allPatternsFound = check.patterns.every(pattern => pattern.test(content));
      
      if (allPatternsFound) {
        log(`✅ ${check.name}: Implemented`, 'green');
        securityScore++;
      } else {
        log(`⚠️  ${check.name}: Partially implemented`, 'yellow');
      }
    } else {
      log(`❌ ${check.name}: Missing file`, 'red');
    }
  });

  return { score: securityScore, maxScore: maxSecurityScore };
}

function validateAccessibilityImplementation() {
  log('\n♿ Accessibility Implementation Validation', 'bright');
  log('==========================================', 'blue');

  const accessibilityChecks = [
    {
      name: 'Color Contrast Utilities',
      path: 'src/lib/utils/accessibility.ts',
      patterns: [
        /getContrastRatio/,
        /meetsContrastRequirement/,
        /WCAG/,
      ],
    },
    {
      name: 'Focus Management',
      path: 'src/lib/utils/accessibility.ts',
      patterns: [
        /FocusManager/,
        /trapFocus/,
        /restoreFocus/,
      ],
    },
    {
      name: 'Screen Reader Support',
      path: 'src/lib/utils/accessibility.ts',
      patterns: [
        /announceToScreenReader/,
        /aria-live/,
        /aria-label/,
      ],
    },
    {
      name: 'Keyboard Navigation',
      path: 'src/lib/utils/accessibility.ts',
      patterns: [
        /handleKeyboardNavigation/,
        /tabindex/,
        /keydown/,
      ],
    },
    {
      name: 'Accessibility Audit Tools',
      path: 'src/lib/testing/accessibility-audit.ts',
      patterns: [
        /AccessibilityAuditor/,
        /auditPage/,
        /checkImages/,
        /checkForms/,
      ],
    },
  ];

  let accessibilityScore = 0;
  const maxAccessibilityScore = accessibilityChecks.length;

  accessibilityChecks.forEach(check => {
    if (fs.existsSync(check.path)) {
      const content = fs.readFileSync(check.path, 'utf8');
      const allPatternsFound = check.patterns.every(pattern => pattern.test(content));
      
      if (allPatternsFound) {
        log(`✅ ${check.name}: Implemented`, 'green');
        accessibilityScore++;
      } else {
        log(`⚠️  ${check.name}: Partially implemented`, 'yellow');
      }
    } else {
      log(`❌ ${check.name}: Missing file`, 'red');
    }
  });

  return { score: accessibilityScore, maxScore: maxAccessibilityScore };
}

function validateMiddlewareConfiguration() {
  log('\n⚙️  Middleware Configuration Validation', 'bright');
  log('==========================================', 'blue');

  const middlewarePath = 'src/middleware.ts';
  
  if (!fs.existsSync(middlewarePath)) {
    log('❌ Middleware file missing', 'red');
    return { score: 0, maxScore: 1 };
  }

  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  
  const middlewareChecks = [
    { pattern: /generateNonce/, name: 'Nonce generation' },
    { pattern: /withSecurityHeaders/, name: 'Security headers' },
    { pattern: /rateLimiters/, name: 'Rate limiting' },
    { pattern: /x-nonce/, name: 'Nonce header setting' },
    { pattern: /ip.*getClientIP/, name: 'IP extraction' },
  ];

  let middlewareScore = 0;
  
  middlewareChecks.forEach(check => {
    if (check.pattern.test(middlewareContent)) {
      log(`✅ ${check.name}: Configured`, 'green');
      middlewareScore++;
    } else {
      log(`⚠️  ${check.name}: Missing or incomplete`, 'yellow');
    }
  });

  return { score: middlewareScore, maxScore: middlewareChecks.length };
}

function validateAPISecurityMeasures() {
  log('\n🛡️  API Security Measures Validation', 'bright');
  log('==========================================', 'blue');

  const apiRoutes = [
    'src/app/api/contact/route.ts',
    'src/app/api/csrf-token/route.ts',
    'src/app/api/csp-report/route.ts',
  ];

  let apiSecurityScore = 0;
  const maxApiSecurityScore = apiRoutes.length;

  apiRoutes.forEach(routePath => {
    if (fs.existsSync(routePath)) {
      const content = fs.readFileSync(routePath, 'utf8');
      
      const hasSecurityMeasures = [
        /sanitize/i,
        /validate/i,
        /rate.*limit/i,
        /csrf/i,
      ].some(pattern => pattern.test(content));

      if (hasSecurityMeasures) {
        log(`✅ ${path.basename(routePath)}: Security measures implemented`, 'green');
        apiSecurityScore++;
      } else {
        log(`⚠️  ${path.basename(routePath)}: Limited security measures`, 'yellow');
      }
    } else {
      log(`❌ ${path.basename(routePath)}: Missing`, 'red');
    }
  });

  return { score: apiSecurityScore, maxScore: maxApiSecurityScore };
}

function generateComplianceReport() {
  log('\n📊 Security & Accessibility Compliance Report', 'bright');
  log('==========================================', 'blue');

  const securityResult = validateSecurityImplementation();
  const accessibilityResult = validateAccessibilityImplementation();
  const middlewareResult = validateMiddlewareConfiguration();
  const apiSecurityResult = validateAPISecurityMeasures();

  const totalScore = securityResult.score + accessibilityResult.score + 
                    middlewareResult.score + apiSecurityResult.score;
  const maxTotalScore = securityResult.maxScore + accessibilityResult.maxScore + 
                       middlewareResult.maxScore + apiSecurityResult.maxScore;

  const compliancePercentage = ((totalScore / maxTotalScore) * 100).toFixed(1);

  log(`\n📈 Overall Compliance Score: ${compliancePercentage}%`, 'cyan');
  log(`📊 Security Score: ${securityResult.score}/${securityResult.maxScore}`, 'cyan');
  log(`♿ Accessibility Score: ${accessibilityResult.score}/${accessibilityResult.maxScore}`, 'cyan');
  log(`⚙️  Middleware Score: ${middlewareResult.score}/${middlewareResult.maxScore}`, 'cyan');
  log(`🛡️  API Security Score: ${apiSecurityResult.score}/${apiSecurityResult.maxScore}`, 'cyan');

  // Compliance assessment
  if (compliancePercentage >= 90) {
    log('\n🎉 Excellent! High security and accessibility compliance', 'green');
  } else if (compliancePercentage >= 75) {
    log('\n👍 Good compliance level with room for improvement', 'yellow');
  } else {
    log('\n⚠️  Compliance needs significant improvement', 'red');
  }

  // Recommendations
  log('\n💡 Security & Accessibility Recommendations:', 'bright');
  log('1. Regularly update dependencies for security patches', 'cyan');
  log('2. Conduct periodic accessibility audits with real users', 'cyan');
  log('3. Monitor CSP violations and adjust policies as needed', 'cyan');
  log('4. Test with screen readers and keyboard-only navigation', 'cyan');
  log('5. Implement automated security and accessibility testing in CI/CD', 'cyan');

  return {
    totalScore,
    maxTotalScore,
    compliancePercentage: parseFloat(compliancePercentage),
    security: securityResult,
    accessibility: accessibilityResult,
    middleware: middlewareResult,
    apiSecurity: apiSecurityResult,
  };
}

function main() {
  log('🚀 Security & Accessibility Validation Starting...', 'bright');
  log('==========================================', 'blue');

  const report = generateComplianceReport();

  log('\n📊 Validation Summary:', 'bright');
  log('==========================================', 'blue');

  const passed = report.compliancePercentage >= 80;

  if (passed) {
    log('✅ Security and accessibility validation passed!', 'green');
    log('🎯 Ready for production deployment', 'green');
  } else {
    log('⚠️  Security and accessibility need attention', 'yellow');
    log('📋 Review recommendations above', 'yellow');
  }

  process.exit(passed ? 0 : 1);
}

// Run the validation
main();
