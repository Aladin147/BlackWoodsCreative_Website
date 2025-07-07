/**
 * Security Vulnerability Scanner
 *
 * Tools for scanning and validating security vulnerabilities and best practices
 */

// Security vulnerability severity levels
export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Security scan result
export interface SecurityScanResult {
  passed: boolean;
  score: number;
  vulnerabilities: SecurityVulnerability[];
  warnings: SecurityWarning[];
  recommendations: string[];
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
  };
}

// Security vulnerability
export interface SecurityVulnerability {
  id: string;
  title: string;
  description: string;
  severity: SecuritySeverity;
  category: SecurityCategory;
  cwe?: string; // Common Weakness Enumeration
  cvss?: number; // Common Vulnerability Scoring System
  affected: string[];
  fix: string;
  references: string[];
}

// Security warning
export interface SecurityWarning {
  id: string;
  title: string;
  description: string;
  category: SecurityCategory;
  suggestion: string;
  references: string[];
}

// Security categories
export type SecurityCategory =
  | 'dependency'
  | 'configuration'
  | 'authentication'
  | 'authorization'
  | 'input-validation'
  | 'output-encoding'
  | 'cryptography'
  | 'session-management'
  | 'error-handling'
  | 'logging'
  | 'file-upload'
  | 'cors'
  | 'csp'
  | 'headers'
  | 'https'
  | 'xss'
  | 'csrf'
  | 'injection';

// Security configuration
export interface SecurityConfig {
  checkDependencies: boolean;
  checkConfiguration: boolean;
  checkHeaders: boolean;
  checkCORS: boolean;
  checkCSP: boolean;
  checkHTTPS: boolean;
  checkXSS: boolean;
  checkCSRF: boolean;
  checkInjection: boolean;
  checkAuthentication: boolean;
  checkAuthorization: boolean;
  checkCryptography: boolean;
  checkErrorHandling: boolean;
  checkLogging: boolean;
  severityThreshold: SecuritySeverity;
}

// Package.json structure for security analysis
export interface PackageJsonStructure {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  [key: string]: unknown;
}

// Next.js configuration structure for security analysis
export interface NextConfigStructure {
  reactStrictMode?: boolean;
  swcMinify?: boolean;
  productionBrowserSourceMaps?: boolean;
  headers?: () => Array<{
    source: string;
    headers: Array<{ key: string; value: string }>;
  }>;
  redirects?: Array<{
    source: string;
    destination?: string;
    has?: Array<{ type: string; key: string; value?: string }>;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

// Default security configuration
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  checkDependencies: true,
  checkConfiguration: true,
  checkHeaders: true,
  checkCORS: true,
  checkCSP: true,
  checkHTTPS: true,
  checkXSS: true,
  checkCSRF: true,
  checkInjection: true,
  checkAuthentication: true,
  checkAuthorization: true,
  checkCryptography: true,
  checkErrorHandling: true,
  checkLogging: true,
  severityThreshold: 'medium',
};

// Security scanner
export class SecurityScanner {
  private static instance: SecurityScanner;
  private config: SecurityConfig;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
  }

  static getInstance(config?: Partial<SecurityConfig>): SecurityScanner {
    if (!SecurityScanner.instance) {
      SecurityScanner.instance = new SecurityScanner(config);
    }
    return SecurityScanner.instance;
  }

  // Run comprehensive security scan
  async scanSecurity(
    packageJson?: PackageJsonStructure,
    nextConfig?: NextConfigStructure,
    headers?: Record<string, string>,
    environment?: Record<string, string>
  ): Promise<SecurityScanResult> {
    const vulnerabilities: SecurityVulnerability[] = [];
    const warnings: SecurityWarning[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // Check dependencies
    if (this.config.checkDependencies && packageJson) {
      const depResults = await this.checkDependencies(packageJson);
      vulnerabilities.push(...depResults.vulnerabilities);
      warnings.push(...depResults.warnings);
      totalChecks += depResults.totalChecks;
      passedChecks += depResults.passedChecks;
    }

    // Check configuration
    if (this.config.checkConfiguration && nextConfig) {
      const configResults = this.checkConfiguration(nextConfig);
      vulnerabilities.push(...configResults.vulnerabilities);
      warnings.push(...configResults.warnings);
      totalChecks += configResults.totalChecks;
      passedChecks += configResults.passedChecks;
    }

    // Check security headers
    if (this.config.checkHeaders && headers) {
      const headerResults = this.checkSecurityHeaders(headers);
      vulnerabilities.push(...headerResults.vulnerabilities);
      warnings.push(...headerResults.warnings);
      totalChecks += headerResults.totalChecks;
      passedChecks += headerResults.passedChecks;
    }

    // Check environment variables
    if (environment) {
      const envResults = this.checkEnvironmentSecurity(environment);
      vulnerabilities.push(...envResults.vulnerabilities);
      warnings.push(...envResults.warnings);
      totalChecks += envResults.totalChecks;
      passedChecks += envResults.passedChecks;
    }

    // Calculate score and summary
    const summary = this.calculateSummary(vulnerabilities, warnings, totalChecks, passedChecks);
    const score = this.calculateSecurityScore(vulnerabilities, totalChecks, passedChecks);
    const passed = this.determinePassStatus(vulnerabilities);
    const recommendations = this.generateRecommendations(vulnerabilities);

    return {
      passed,
      score,
      vulnerabilities,
      warnings,
      recommendations,
      summary,
    };
  }

  // Check dependency vulnerabilities
  private checkDependencies(packageJson: PackageJsonStructure): {
    vulnerabilities: SecurityVulnerability[];
    warnings: SecurityWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const vulnerabilities: SecurityVulnerability[] = [];
    const warnings: SecurityWarning[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Mock vulnerability database (in real implementation, this would query actual vulnerability databases)
    const knownVulnerabilities = [
      {
        package: 'lodash',
        versions: ['<4.17.21'],
        vulnerability: {
          id: 'CVE-2021-23337',
          title: 'Command Injection in lodash',
          description:
            'lodash versions prior to 4.17.21 are vulnerable to Command Injection via template.',
          severity: 'high' as SecuritySeverity,
          cwe: 'CWE-77',
          cvss: 7.2,
        },
      },
      {
        package: 'axios',
        versions: ['<0.21.2'],
        vulnerability: {
          id: 'CVE-2021-3749',
          title: 'Regular Expression Denial of Service in axios',
          description: 'axios is vulnerable to Inefficient Regular Expression Complexity.',
          severity: 'medium' as SecuritySeverity,
          cwe: 'CWE-1333',
          cvss: 5.3,
        },
      },
    ];

    // Check each dependency
    Object.entries(dependencies).forEach(([packageName, version]) => {
      totalChecks++;

      const vulnMatch = knownVulnerabilities.find(v => v.package === packageName);
      if (vulnMatch) {
        // Simplified version checking (in real implementation, use semver)
        const isVulnerable = true; // Mock: assume vulnerable for demo

        if (isVulnerable) {
          vulnerabilities.push({
            id: vulnMatch.vulnerability.id,
            title: vulnMatch.vulnerability.title,
            description: vulnMatch.vulnerability.description,
            severity: vulnMatch.vulnerability.severity,
            category: 'dependency',
            cwe: vulnMatch.vulnerability.cwe,
            cvss: vulnMatch.vulnerability.cvss,
            affected: [`${packageName}@${version}`],
            fix: `Update ${packageName} to a secure version`,
            references: [
              `https://nvd.nist.gov/vuln/detail/${vulnMatch.vulnerability.id}`,
              `https://www.npmjs.com/package/${packageName}`,
            ],
          });
        } else {
          passedChecks++;
        }
      } else {
        passedChecks++;
      }
    });

    return { vulnerabilities, warnings, totalChecks, passedChecks };
  }

  // Check configuration security
  private checkConfiguration(nextConfig: NextConfigStructure): {
    vulnerabilities: SecurityVulnerability[];
    warnings: SecurityWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const vulnerabilities: SecurityVulnerability[] = [];
    const warnings: SecurityWarning[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // Check if source maps are disabled in production
    totalChecks++;
    if (nextConfig.productionBrowserSourceMaps === true) {
      vulnerabilities.push({
        id: 'NEXT-001',
        title: 'Source Maps Enabled in Production',
        description: 'Source maps are enabled in production, which can expose source code.',
        severity: 'medium',
        category: 'configuration',
        affected: ['next.config.js'],
        fix: 'Set productionBrowserSourceMaps to false in production',
        references: ['https://nextjs.org/docs/api-reference/next.config.js/source-maps'],
      });
    } else {
      passedChecks++;
    }

    // Check for secure headers configuration
    totalChecks++;
    if (!nextConfig.headers || !Array.isArray(nextConfig.headers)) {
      warnings.push({
        id: 'NEXT-002',
        title: 'Missing Security Headers Configuration',
        description: 'No security headers are configured in Next.js config.',
        category: 'configuration',
        suggestion: 'Configure security headers in next.config.js',
        references: ['https://nextjs.org/docs/api-reference/next.config.js/headers'],
      });
    } else {
      passedChecks++;
    }

    // Check for HTTPS redirect
    totalChecks++;
    if (
      !nextConfig.redirects?.some(
        r =>
          r.source === '/' && r.has?.some(h => h.type === 'header' && h.key === 'x-forwarded-proto')
      )
    ) {
      warnings.push({
        id: 'NEXT-003',
        title: 'Missing HTTPS Redirect',
        description: 'No HTTPS redirect is configured.',
        category: 'configuration',
        suggestion: 'Configure HTTPS redirects in next.config.js',
        references: ['https://nextjs.org/docs/api-reference/next.config.js/redirects'],
      });
    } else {
      passedChecks++;
    }

    return { vulnerabilities, warnings, totalChecks, passedChecks };
  }

  // Check security headers
  private checkSecurityHeaders(headers: Record<string, string>): {
    vulnerabilities: SecurityVulnerability[];
    warnings: SecurityWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const vulnerabilities: SecurityVulnerability[] = [];
    const warnings: SecurityWarning[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // Required security headers
    const requiredHeaders = [
      {
        name: 'X-Frame-Options',
        values: ['DENY', 'SAMEORIGIN'],
        severity: 'high' as SecuritySeverity,
        description: 'Prevents clickjacking attacks',
      },
      {
        name: 'X-Content-Type-Options',
        values: ['nosniff'],
        severity: 'medium' as SecuritySeverity,
        description: 'Prevents MIME type sniffing',
      },
      {
        name: 'X-XSS-Protection',
        values: ['1; mode=block'],
        severity: 'medium' as SecuritySeverity,
        description: 'Enables XSS filtering',
      },
      {
        name: 'Strict-Transport-Security',
        values: ['max-age='],
        severity: 'high' as SecuritySeverity,
        description: 'Enforces HTTPS connections',
      },
      {
        name: 'Content-Security-Policy',
        values: ['default-src'],
        severity: 'high' as SecuritySeverity,
        description: 'Prevents XSS and injection attacks',
      },
    ];

    requiredHeaders.forEach(header => {
      totalChecks++;
      const headerValue = headers[header.name] ?? headers[header.name.toLowerCase()];

      if (!headerValue) {
        vulnerabilities.push({
          id: `HEADER-${header.name.replace(/[^A-Z]/g, '')}`,
          title: `Missing ${header.name} Header`,
          description: `The ${header.name} header is missing. ${header.description}.`,
          severity: header.severity,
          category: 'headers',
          affected: ['HTTP Response Headers'],
          fix: `Add ${header.name} header with appropriate value`,
          references: [
            'https://owasp.org/www-project-secure-headers/',
            'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers',
          ],
        });
      } else if (!header.values.some(value => headerValue.includes(value))) {
        warnings.push({
          id: `HEADER-${header.name.replace(/[^A-Z]/g, '')}-VALUE`,
          title: `Weak ${header.name} Header Value`,
          description: `The ${header.name} header value may not be optimal.`,
          category: 'headers',
          suggestion: `Review and strengthen ${header.name} header value`,
          references: ['https://owasp.org/www-project-secure-headers/'],
        });
        passedChecks++;
      } else {
        passedChecks++;
      }
    });

    return { vulnerabilities, warnings, totalChecks, passedChecks };
  }

  // Check environment security
  private checkEnvironmentSecurity(environment: Record<string, string>): {
    vulnerabilities: SecurityVulnerability[];
    warnings: SecurityWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const vulnerabilities: SecurityVulnerability[] = [];
    const warnings: SecurityWarning[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // Check for exposed secrets
    const sensitivePatterns = [
      { pattern: /password/i, name: 'Password' },
      { pattern: /secret/i, name: 'Secret' },
      { pattern: /key/i, name: 'API Key' },
      { pattern: /token/i, name: 'Token' },
      { pattern: /auth/i, name: 'Authentication' },
    ];

    Object.entries(environment).forEach(([key, value]) => {
      totalChecks++;

      const sensitiveMatch = sensitivePatterns.find(p => p.pattern.test(key));
      if (sensitiveMatch && value && value.length > 0) {
        // Check if it looks like a real secret (not a placeholder)
        const placeholderPatterns = [
          'your-secret-here',
          'placeholder',
          'placeholder-key',
          'your-key-here',
          'example',
          'test',
        ];

        const isPlaceholder =
          placeholderPatterns.some(pattern =>
            value.toLowerCase().includes(pattern.toLowerCase())
          ) || value.startsWith('$');

        if (!isPlaceholder) {
          vulnerabilities.push({
            id: 'ENV-001',
            title: `Exposed ${sensitiveMatch.name} in Environment`,
            description: `Environment variable ${key} appears to contain sensitive information.`,
            severity: 'high',
            category: 'configuration',
            affected: [key],
            fix: 'Use secure secret management and avoid committing secrets to version control',
            references: [
              'https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure',
              'https://12factor.net/config',
            ],
          });
        } else {
          passedChecks++;
        }
      } else {
        passedChecks++;
      }
    });

    return { vulnerabilities, warnings, totalChecks, passedChecks };
  }

  // Calculate security summary
  private calculateSummary(
    vulnerabilities: SecurityVulnerability[],
    warnings: SecurityWarning[],
    totalChecks: number,
    passedChecks: number
  ) {
    return {
      totalChecks,
      passedChecks,
      failedChecks: vulnerabilities.length,
      warningChecks: warnings.length,
      criticalIssues: vulnerabilities.filter(v => v.severity === 'critical').length,
      highIssues: vulnerabilities.filter(v => v.severity === 'high').length,
      mediumIssues: vulnerabilities.filter(v => v.severity === 'medium').length,
      lowIssues: vulnerabilities.filter(v => v.severity === 'low').length,
    };
  }

  // Calculate security score
  private calculateSecurityScore(
    vulnerabilities: SecurityVulnerability[],
    totalChecks: number,
    passedChecks: number
  ): number {
    if (totalChecks === 0) return 100;

    let score = (passedChecks / totalChecks) * 100;

    // Deduct additional points for severity
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  // Determine pass status
  private determinePassStatus(vulnerabilities: SecurityVulnerability[]): boolean {
    const severityLevels = ['critical', 'high', 'medium', 'low', 'info'];
    const thresholdIndex = severityLevels.indexOf(this.config.severityThreshold);

    return !vulnerabilities.some(vuln => severityLevels.indexOf(vuln.severity) <= thresholdIndex);
  }

  // Generate security recommendations
  private generateRecommendations(vulnerabilities: SecurityVulnerability[]): string[] {
    const recommendations: string[] = [];

    const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical');
    const highVulns = vulnerabilities.filter(v => v.severity === 'high');

    if (criticalVulns.length > 0) {
      recommendations.push('🚨 Address critical security vulnerabilities immediately');
      recommendations.push('Consider blocking deployment until critical issues are resolved');
    }

    if (highVulns.length > 0) {
      recommendations.push('⚠️ Fix high-severity security issues before deployment');
      recommendations.push('Implement security monitoring and alerting');
    }

    const depVulns = vulnerabilities.filter(v => v.category === 'dependency');
    if (depVulns.length > 0) {
      recommendations.push('📦 Update vulnerable dependencies to secure versions');
      recommendations.push('Consider using automated dependency scanning tools');
    }

    const headerVulns = vulnerabilities.filter(v => v.category === 'headers');
    if (headerVulns.length > 0) {
      recommendations.push('🔒 Configure proper security headers');
      recommendations.push('Implement Content Security Policy (CSP)');
    }

    if (vulnerabilities.length === 0) {
      recommendations.push('✅ Excellent! No security vulnerabilities found');
      recommendations.push('Continue regular security monitoring and updates');
    }

    return recommendations;
  }

  // Update configuration
  updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // Get current configuration
  getConfig(): SecurityConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const securityScanner = SecurityScanner.getInstance();

// Security scanning utilities
export const SecurityUtils = {
  // Format CVSS score
  formatCVSS: (score: number): { rating: string; color: string } => {
    if (score >= 9.0) return { rating: 'Critical', color: '#dc2626' };
    if (score >= 7.0) return { rating: 'High', color: '#ea580c' };
    if (score >= 4.0) return { rating: 'Medium', color: '#ca8a04' };
    if (score >= 0.1) return { rating: 'Low', color: '#16a34a' };
    return { rating: 'None', color: '#6b7280' };
  },

  // Get severity color
  getSeverityColor: (severity: SecuritySeverity): string => {
    switch (severity) {
      case 'critical':
        return '#dc2626'; // red-600
      case 'high':
        return '#ea580c'; // orange-600
      case 'medium':
        return '#ca8a04'; // yellow-600
      case 'low':
        return '#16a34a'; // green-600
      case 'info':
        return '#3b82f6'; // blue-500
      default:
        return '#6b7280'; // gray-500
    }
  },

  // Generate security report
  generateSecurityReport: (result: SecurityScanResult): string => {
    const { passed, score, vulnerabilities, warnings, summary } = result;

    let report = `# Security Scan Report\n\n`;
    report += `**Status:** ${passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `**Security Score:** ${score.toFixed(1)}%\n\n`;

    report += `## Summary\n`;
    report += `- Total Checks: ${summary.totalChecks}\n`;
    report += `- Passed: ${summary.passedChecks}\n`;
    report += `- Failed: ${summary.failedChecks}\n`;
    report += `- Warnings: ${summary.warningChecks}\n`;
    report += `- Critical Issues: ${summary.criticalIssues}\n`;
    report += `- High Issues: ${summary.highIssues}\n`;
    report += `- Medium Issues: ${summary.mediumIssues}\n`;
    report += `- Low Issues: ${summary.lowIssues}\n\n`;

    if (vulnerabilities.length > 0) {
      report += `## Vulnerabilities\n`;
      vulnerabilities.forEach((vuln, index) => {
        report += `### ${index + 1}. ${vuln.title}\n`;
        report += `**ID:** ${vuln.id}\n`;
        report += `**Severity:** ${vuln.severity.toUpperCase()}\n`;
        report += `**Category:** ${vuln.category}\n`;
        if (vuln.cvss) report += `**CVSS Score:** ${vuln.cvss}\n`;
        if (vuln.cwe) report += `**CWE:** ${vuln.cwe}\n`;
        report += `**Description:** ${vuln.description}\n`;
        report += `**Affected:** ${vuln.affected.join(', ')}\n`;
        report += `**Fix:** ${vuln.fix}\n`;
        report += `**References:**\n`;
        vuln.references.forEach(ref => (report += `- ${ref}\n`));
        report += `\n`;
      });
    }

    if (warnings.length > 0) {
      report += `## Warnings\n`;
      warnings.forEach((warning, index) => {
        report += `### ${index + 1}. ${warning.title}\n`;
        report += `**ID:** ${warning.id}\n`;
        report += `**Category:** ${warning.category}\n`;
        report += `**Description:** ${warning.description}\n`;
        report += `**Suggestion:** ${warning.suggestion}\n`;
        report += `**References:**\n`;
        warning.references.forEach(ref => (report += `- ${ref}\n`));
        report += `\n`;
      });
    }

    return report;
  },

  // Mock package.json for testing
  generateMockPackageJson: (
    overrides: Partial<PackageJsonStructure> = {}
  ): PackageJsonStructure => {
    const defaultPackageJson = {
      name: 'test-app',
      version: '1.0.0',
      dependencies: {
        next: '^13.0.0',
        react: '^18.0.0',
        'react-dom': '^18.0.0',
        lodash: '^4.17.20', // Vulnerable version for testing
      },
      devDependencies: {
        typescript: '^4.9.0',
        eslint: '^8.0.0',
        jest: '^29.0.0',
        axios: '^0.21.1', // Vulnerable version for testing
      },
    };

    return { ...defaultPackageJson, ...overrides };
  },

  // Mock Next.js config for testing
  generateMockNextConfig: (overrides: Partial<NextConfigStructure> = {}): NextConfigStructure => {
    const defaultConfig = {
      reactStrictMode: true,
      swcMinify: true,
      productionBrowserSourceMaps: false,
      headers: () => [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
          ],
        },
      ],
    };

    return { ...defaultConfig, ...overrides };
  },

  // Mock security headers for testing
  generateMockHeaders: (overrides: Record<string, string> = {}): Record<string, string> => {
    const defaultHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'",
    };

    return { ...defaultHeaders, ...overrides };
  },

  // Mock environment variables for testing
  generateMockEnvironment: (overrides: Record<string, string> = {}): Record<string, string> => {
    const defaultEnv = {
      NODE_ENV: 'production',
      NEXT_PUBLIC_API_URL: 'https://api.example.com',
      DATABASE_URL: 'postgresql://user:password@localhost:5432/db',
      JWT_SECRET: 'your-secret-here',
      API_KEY: 'placeholder-key',
    };

    return { ...defaultEnv, ...overrides };
  },

  // Validate security configuration
  validateSecurityConfig: (
    config: Partial<SecurityConfig>
  ): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check severity threshold
    if (config.severityThreshold) {
      const validSeverities: SecuritySeverity[] = ['critical', 'high', 'medium', 'low', 'info'];
      if (!validSeverities.includes(config.severityThreshold)) {
        errors.push(
          'Invalid severity threshold. Must be one of: critical, high, medium, low, info'
        );
      }
    }

    // Check boolean flags
    const booleanFlags = [
      'checkDependencies',
      'checkConfiguration',
      'checkHeaders',
      'checkCORS',
      'checkCSP',
      'checkHTTPS',
      'checkXSS',
      'checkCSRF',
      'checkInjection',
      'checkAuthentication',
      'checkAuthorization',
      'checkCryptography',
      'checkErrorHandling',
      'checkLogging',
    ];

    booleanFlags.forEach(flag => {
      if (
        config[flag as keyof SecurityConfig] !== undefined &&
        typeof config[flag as keyof SecurityConfig] !== 'boolean'
      ) {
        errors.push(`${flag} must be a boolean value`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Check if vulnerability is exploitable
  isExploitable: (vulnerability: SecurityVulnerability): boolean => {
    // High and critical vulnerabilities are considered exploitable
    return vulnerability.severity === 'critical' || vulnerability.severity === 'high';
  },

  // Get security grade
  getSecurityGrade: (score: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  },

  // Calculate risk score
  calculateRiskScore: (vulnerabilities: SecurityVulnerability[]): number => {
    let riskScore = 0;

    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical':
          riskScore += 10;
          break;
        case 'high':
          riskScore += 7;
          break;
        case 'medium':
          riskScore += 4;
          break;
        case 'low':
          riskScore += 1;
          break;
        case 'info':
          riskScore += 0;
          break;
      }
    });

    return riskScore;
  },

  // Group vulnerabilities by category
  groupVulnerabilitiesByCategory: (
    vulnerabilities: SecurityVulnerability[]
  ): Record<SecurityCategory, SecurityVulnerability[]> => {
    const grouped: Record<string, SecurityVulnerability[]> = {};

    vulnerabilities.forEach(vuln => {
      grouped[vuln.category] ??= [];
      const categoryArray = grouped[vuln.category];
      if (categoryArray) {
        categoryArray.push(vuln);
      }
    });

    return grouped as Record<SecurityCategory, SecurityVulnerability[]>;
  },

  // Get top vulnerabilities by severity
  getTopVulnerabilities: (
    vulnerabilities: SecurityVulnerability[],
    limit = 5
  ): SecurityVulnerability[] => {
    const severityOrder: Record<SecuritySeverity, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    };

    return vulnerabilities
      .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity])
      .slice(0, limit);
  },

  // Check if deployment should be blocked
  shouldBlockDeployment: (result: SecurityScanResult): boolean => {
    return result.summary.criticalIssues > 0 || result.summary.highIssues > 2;
  },

  // Generate security checklist
  generateSecurityChecklist: (): Array<{ category: string; items: string[] }> => {
    return [
      {
        category: 'Dependencies',
        items: [
          'All dependencies are up to date',
          'No known vulnerabilities in dependencies',
          'Dependency scanning is automated',
          'Lock files are committed to version control',
        ],
      },
      {
        category: 'Configuration',
        items: [
          'Source maps are disabled in production',
          'Debug mode is disabled in production',
          "Error messages don't expose sensitive information",
          'Secure headers are configured',
        ],
      },
      {
        category: 'Authentication & Authorization',
        items: [
          'Strong authentication mechanisms are in place',
          'Authorization checks are implemented',
          'Session management is secure',
          'Password policies are enforced',
        ],
      },
      {
        category: 'Data Protection',
        items: [
          'Sensitive data is encrypted at rest',
          'Data transmission uses HTTPS',
          'Input validation is implemented',
          'Output encoding prevents XSS',
        ],
      },
      {
        category: 'Infrastructure',
        items: [
          'Security headers are configured',
          'CORS policy is restrictive',
          'CSP is implemented',
          'Rate limiting is in place',
        ],
      },
    ];
  },
};
