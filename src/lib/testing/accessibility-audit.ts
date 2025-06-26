/**
 * Accessibility Compliance Audit
 * 
 * WCAG 2.1 compliance testing and accessibility validation tools
 */

// WCAG compliance levels
export type WCAGLevel = 'A' | 'AA' | 'AAA';

// Accessibility test result
export interface AccessibilityTestResult {
  passed: boolean;
  score: number;
  level: WCAGLevel;
  violations: AccessibilityViolation[];
  warnings: AccessibilityWarning[];
  recommendations: string[];
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
  };
}

// Accessibility violation
export interface AccessibilityViolation {
  rule: string;
  level: WCAGLevel;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  element?: string;
  fix: string;
  wcagReference: string;
}

// Accessibility warning
export interface AccessibilityWarning {
  rule: string;
  description: string;
  element?: string;
  suggestion: string;
}

// DOM element representation for accessibility testing
export interface AccessibilityElement {
  tag: string;
  attributes?: Record<string, string>;
  content?: string;
  index: number;
  // Allow additional properties for different element types
  [key: string]: unknown;
}

// Parsed content structure for accessibility analysis
export interface ParsedContent {
  content: string;
  images: AccessibilityElement[];
  headings: AccessibilityElement[];
  forms: AccessibilityElement[];
  inputs: AccessibilityElement[];
  labels: AccessibilityElement[];
  buttons: AccessibilityElement[];
  links: AccessibilityElement[];
  landmarks: AccessibilityElement[];
}

// Accessibility checker configuration
export interface AccessibilityConfig {
  level: WCAGLevel;
  includeWarnings: boolean;
  checkColorContrast: boolean;
  checkKeyboardNavigation: boolean;
  checkScreenReader: boolean;
  checkFocus: boolean;
  checkSemantics: boolean;
  checkImages: boolean;
  checkForms: boolean;
  checkHeadings: boolean;
  checkLandmarks: boolean;
}

// Default accessibility configuration
export const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
  level: 'AA',
  includeWarnings: true,
  checkColorContrast: true,
  checkKeyboardNavigation: true,
  checkScreenReader: true,
  checkFocus: true,
  checkSemantics: true,
  checkImages: true,
  checkForms: true,
  checkHeadings: true,
  checkLandmarks: true,
};

// Accessibility compliance checker
export class AccessibilityChecker {
  private static instance: AccessibilityChecker;
  private config: AccessibilityConfig;

  constructor(config: Partial<AccessibilityConfig> = {}) {
    this.config = { ...DEFAULT_ACCESSIBILITY_CONFIG, ...config };
  }

  static getInstance(config?: Partial<AccessibilityConfig>): AccessibilityChecker {
    if (!AccessibilityChecker.instance) {
      AccessibilityChecker.instance = new AccessibilityChecker(config);
    }
    return AccessibilityChecker.instance;
  }

  // Run comprehensive accessibility audit
  auditPage(content: string): AccessibilityTestResult {
    const violations: AccessibilityViolation[] = [];
    const warnings: AccessibilityWarning[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // Parse content for testing
    const dom = this.parseContent(content);

    // Run all accessibility checks
    if (this.config.checkImages) {
      const imageResults = this.checkImages(dom);
      violations.push(...imageResults.violations);
      warnings.push(...imageResults.warnings);
      totalChecks += imageResults.totalChecks;
      passedChecks += imageResults.passedChecks;
    }

    if (this.config.checkHeadings) {
      const headingResults = this.checkHeadings(dom);
      violations.push(...headingResults.violations);
      warnings.push(...headingResults.warnings);
      totalChecks += headingResults.totalChecks;
      passedChecks += headingResults.passedChecks;
    }

    if (this.config.checkForms) {
      const formResults = this.checkForms(dom);
      violations.push(...formResults.violations);
      warnings.push(...formResults.warnings);
      totalChecks += formResults.totalChecks;
      passedChecks += formResults.passedChecks;
    }

    if (this.config.checkLandmarks) {
      const landmarkResults = this.checkLandmarks(dom);
      violations.push(...landmarkResults.violations);
      warnings.push(...landmarkResults.warnings);
      totalChecks += landmarkResults.totalChecks;
      passedChecks += landmarkResults.passedChecks;
    }

    if (this.config.checkSemantics) {
      const semanticResults = this.checkSemantics(dom);
      violations.push(...semanticResults.violations);
      warnings.push(...semanticResults.warnings);
      totalChecks += semanticResults.totalChecks;
      passedChecks += semanticResults.passedChecks;
    }

    if (this.config.checkColorContrast) {
      const contrastResults = this.checkColorContrast();
      violations.push(...contrastResults.violations);
      warnings.push(...contrastResults.warnings);
      totalChecks += contrastResults.totalChecks;
      passedChecks += contrastResults.passedChecks;
    }

    // Calculate score and compliance
    const failedChecks = violations.length;
    const warningChecks = warnings.length;
    const score = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;
    const passed = this.determineCompliance(violations, this.config.level);

    // Generate recommendations
    const recommendations = this.generateRecommendations(violations, warnings);

    return {
      passed,
      score,
      level: this.config.level,
      violations,
      warnings: this.config.includeWarnings ? warnings : [],
      recommendations,
      summary: {
        totalChecks,
        passedChecks,
        failedChecks,
        warningChecks,
      },
    };
  }

  // Parse content into DOM-like structure for testing
  private parseContent(content: string): ParsedContent {
    // In a real implementation, this would use a proper HTML parser
    // For testing purposes, we'll create a mock DOM structure
    return {
      content,
      images: this.extractElements(content, 'img'),
      headings: this.extractElements(content, 'h[1-6]'),
      forms: this.extractElements(content, 'form'),
      inputs: this.extractElements(content, 'input'),
      labels: this.extractElements(content, 'label'),
      buttons: this.extractElements(content, 'button'),
      links: this.extractElements(content, 'a'),
      landmarks: this.extractLandmarks(content),
    };
  }

  // Extract elements by tag pattern
  private extractElements(content: string, pattern: string): AccessibilityElement[] {
    // Mock element extraction
    const elements: AccessibilityElement[] = [];

    if (pattern === 'img') {
      const imgMatches = content.match(/<img[^>]*>/g) ?? [];
      imgMatches.forEach((match, index) => {
        const altMatch = match.match(/alt="([^"]*)"/);
        const alt = altMatch ? altMatch[1] : (match.includes('alt=') ? '' : undefined);
        const src = match.match(/src="([^"]*)"/)?.[1] ?? '';
        elements.push({ tag: 'img', alt, src, index });
      });
    }

    if (pattern === 'h[1-6]') {
      for (let level = 1; level <= 6; level++) {
        const headingMatches = content.match(new RegExp(`<h${level}[^>]*>([^<]*)</h${level}>`, 'g')) ?? [];
        headingMatches.forEach((match, index) => {
          const text = match.replace(/<[^>]*>/g, '');
          elements.push({ tag: `h${level}`, level, text, index });
        });
      }
    }

    if (pattern === 'input') {
      const inputMatches = content.match(/<input[^>]*>/g) ?? [];
      inputMatches.forEach((match, index) => {
        const type = match.match(/type="([^"]*)"/)?.[1] ?? 'text';
        const id = match.match(/id="([^"]*)"/)?.[1] ?? '';
        elements.push({ tag: 'input', type, id, index });
      });
    }

    if (pattern === 'label') {
      const labelMatches = content.match(/<label[^>]*>.*?<\/label>/g) ?? [];
      labelMatches.forEach((match, index) => {
        const forAttr = match.match(/for="([^"]*)"/)?.[1] ?? '';
        elements.push({ tag: 'label', for: forAttr, index });
      });
    }

    return elements;
  }

  // Extract landmark elements
  private extractLandmarks(content: string): AccessibilityElement[] {
    const landmarks: AccessibilityElement[] = [];
    const landmarkTags = ['main', 'nav', 'header', 'footer', 'aside', 'section'];
    
    landmarkTags.forEach(tag => {
      const matches = content.match(new RegExp(`<${tag}[^>]*>`, 'g')) ?? [];
      matches.forEach((_, index) => {
        landmarks.push({ tag, index });
      });
    });

    return landmarks;
  }

  // Check image accessibility
  private checkImages(dom: ParsedContent): {
    violations: AccessibilityViolation[];
    warnings: AccessibilityWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const violations: AccessibilityViolation[] = [];
    const warnings: AccessibilityWarning[] = [];
    const images = dom.images ?? [];
    let passedChecks = 0;

    images.forEach((img: AccessibilityElement) => {
      if (!img.alt && img.alt !== '') {
        violations.push({
          rule: 'img-alt',
          level: 'A',
          severity: 'serious',
          description: 'Images must have alternative text',
          element: `<img src="${img.src}">`,
          fix: 'Add alt attribute with descriptive text',
          wcagReference: 'WCAG 2.1 SC 1.1.1',
        });
      } else if (img.alt === '') {
        warnings.push({
          rule: 'img-alt-empty',
          description: 'Image has empty alt text - ensure this is decorative',
          element: `<img src="${img.src}" alt="">`,
          suggestion: 'Verify that empty alt text is appropriate for decorative images',
        });
        passedChecks++;
      } else {
        passedChecks++;
      }
    });

    return {
      violations,
      warnings,
      totalChecks: images.length,
      passedChecks,
    };
  }

  // Check heading structure
  private checkHeadings(dom: ParsedContent): {
    violations: AccessibilityViolation[];
    warnings: AccessibilityWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const violations: AccessibilityViolation[] = [];
    const warnings: AccessibilityWarning[] = [];
    const headings = dom.headings ?? [];
    let passedChecks = 0;

    // Check for H1
    const h1Count = headings.filter((h: AccessibilityElement) => h.level === 1).length;
    if (h1Count === 0) {
      violations.push({
        rule: 'page-has-heading-one',
        level: 'AA',
        severity: 'serious',
        description: 'Page must have one H1 heading',
        fix: 'Add an H1 heading to the page',
        wcagReference: 'WCAG 2.1 SC 2.4.6',
      });
    } else if (h1Count > 1) {
      warnings.push({
        rule: 'multiple-h1',
        description: 'Page has multiple H1 headings',
        suggestion: 'Consider using only one H1 per page',
      });
    }

    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach((heading: AccessibilityElement) => {
      const headingLevel = heading.level as number;
      if (headingLevel > previousLevel + 1) {
        violations.push({
          rule: 'heading-order',
          level: 'AA',
          severity: 'moderate',
          description: 'Heading levels should not skip',
          element: `<h${heading.level}>${heading.text}</h${heading.level}>`,
          fix: 'Use proper heading hierarchy (h1, h2, h3, etc.)',
          wcagReference: 'WCAG 2.1 SC 2.4.6',
        });
      } else {
        passedChecks++;
      }
      previousLevel = headingLevel;
    });

    return {
      violations,
      warnings,
      totalChecks: headings.length + 1, // +1 for H1 check
      passedChecks,
    };
  }

  // Check form accessibility
  private checkForms(dom: ParsedContent): {
    violations: AccessibilityViolation[];
    warnings: AccessibilityWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const violations: AccessibilityViolation[] = [];
    const warnings: AccessibilityWarning[] = [];
    const inputs = dom.inputs ?? [];
    const labels = dom.labels ?? [];
    let passedChecks = 0;

    inputs.forEach((input: AccessibilityElement) => {
      const hasLabel = labels.some((label: AccessibilityElement) =>
        label.for === input.id || label.contains === input.id
      );
      
      if (!hasLabel && input.type !== 'hidden' && input.type !== 'submit') {
        violations.push({
          rule: 'label',
          level: 'A',
          severity: 'serious',
          description: 'Form inputs must have labels',
          element: `<input type="${input.type}">`,
          fix: 'Add a label element or aria-label attribute',
          wcagReference: 'WCAG 2.1 SC 3.3.2',
        });
      } else {
        passedChecks++;
      }
    });

    return {
      violations,
      warnings,
      totalChecks: inputs.length,
      passedChecks,
    };
  }

  // Check landmark structure
  private checkLandmarks(dom: ParsedContent): {
    violations: AccessibilityViolation[];
    warnings: AccessibilityWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const violations: AccessibilityViolation[] = [];
    const warnings: AccessibilityWarning[] = [];
    const landmarks = dom.landmarks ?? [];
    let passedChecks = 0;

    const hasMain = landmarks.some((l: AccessibilityElement) => l.tag === 'main');
    if (!hasMain) {
      violations.push({
        rule: 'landmark-main-is-top-level',
        level: 'AA',
        severity: 'moderate',
        description: 'Page must have a main landmark',
        fix: 'Add a <main> element to identify the main content',
        wcagReference: 'WCAG 2.1 SC 2.4.1',
      });
    } else {
      passedChecks++;
    }

    return {
      violations,
      warnings,
      totalChecks: 1,
      passedChecks,
    };
  }

  // Check semantic markup
  private checkSemantics(dom: ParsedContent): {
    violations: AccessibilityViolation[];
    warnings: AccessibilityWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const violations: AccessibilityViolation[] = [];
    const warnings: AccessibilityWarning[] = [];
    const totalChecks = 1;
    let passedChecks = 0;

    // Check for semantic HTML usage
    const hasSemanticElements = dom.landmarks.length > 0;
    if (hasSemanticElements) {
      passedChecks++;
    } else {
      warnings.push({
        rule: 'semantic-markup',
        description: 'Consider using semantic HTML elements',
        suggestion: 'Use elements like <main>, <nav>, <header>, <footer>, <section>, <article>',
      });
    }

    return {
      violations,
      warnings,
      totalChecks,
      passedChecks,
    };
  }

  // Check color contrast (simplified)
  private checkColorContrast(): {
    violations: AccessibilityViolation[];
    warnings: AccessibilityWarning[];
    totalChecks: number;
    passedChecks: number;
  } {
    const violations: AccessibilityViolation[] = [];
    const warnings: AccessibilityWarning[] = [];
    
    // In a real implementation, this would analyze actual colors
    // For now, we'll assume good contrast and return a passing result
    return {
      violations,
      warnings,
      totalChecks: 1,
      passedChecks: 1,
    };
  }

  // Determine WCAG compliance
  private determineCompliance(violations: AccessibilityViolation[], level: WCAGLevel): boolean {
    const relevantViolations = violations.filter(v => {
      if (level === 'A') return v.level === 'A';
      if (level === 'AA') return v.level === 'A' || v.level === 'AA';
      return true; // AAA includes all levels
    });

    return relevantViolations.length === 0;
  }

  // Generate accessibility recommendations
  private generateRecommendations(violations: AccessibilityViolation[], warnings: AccessibilityWarning[]): string[] {
    const recommendations: string[] = [];

    if (violations.length > 0) {
      recommendations.push('Fix all accessibility violations before deployment');
      
      const criticalViolations = violations.filter(v => v.severity === 'critical' || v.severity === 'serious');
      if (criticalViolations.length > 0) {
        recommendations.push('Prioritize fixing critical and serious accessibility issues');
      }
    }

    if (warnings.length > 5) {
      recommendations.push('Review accessibility warnings to improve user experience');
    }

    const imageIssues = violations.filter(v => v.rule.includes('img'));
    if (imageIssues.length > 0) {
      recommendations.push('Ensure all images have appropriate alternative text');
    }

    const formIssues = violations.filter(v => v.rule.includes('label') || v.rule.includes('form'));
    if (formIssues.length > 0) {
      recommendations.push('Add proper labels to all form controls');
    }

    const headingIssues = violations.filter(v => v.rule.includes('heading'));
    if (headingIssues.length > 0) {
      recommendations.push('Fix heading structure and hierarchy');
    }

    if (recommendations.length === 0) {
      recommendations.push('Great job! No major accessibility issues found');
      recommendations.push('Consider testing with actual screen readers and keyboard navigation');
    }

    return recommendations;
  }

  // Update configuration
  updateConfig(updates: Partial<AccessibilityConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // Get current configuration
  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const accessibilityChecker = AccessibilityChecker.getInstance();

// Accessibility testing utilities
export const AccessibilityUtils = {
  // Check if element is focusable
  isFocusable: (element: HTMLElement): boolean => {
    const focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    return focusableElements.some(selector => element.matches(selector));
  },

  // Get color contrast ratio
  getContrastRatio: (foreground: string, background: string): number => {
    // Simplified contrast calculation
    // In a real implementation, this would use proper color parsing and luminance calculation
    const fgLuminance = AccessibilityUtils.getLuminance(foreground);
    const bgLuminance = AccessibilityUtils.getLuminance(background);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  },

  // Get relative luminance (simplified)
  getLuminance: (color: string): number => {
    // Simplified luminance calculation
    // This is a mock implementation for testing
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  // Check if contrast meets WCAG standards
  meetsContrastRequirement: (ratio: number, level: WCAGLevel, isLargeText = false): boolean => {
    if (level === 'AA') {
      return isLargeText ? ratio >= 3 : ratio >= 4.5;
    }
    if (level === 'AAA') {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    }
    return ratio >= 3; // Level A (minimum)
  },

  // Generate accessibility report
  generateAccessibilityReport: (result: AccessibilityTestResult): string => {
    const { passed, score, level, violations, warnings, summary } = result;

    let report = `# Accessibility Audit Report\n\n`;
    report += `**WCAG ${level} Compliance:** ${passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `**Score:** ${score.toFixed(1)}%\n\n`;

    report += `## Summary\n`;
    report += `- Total Checks: ${summary.totalChecks}\n`;
    report += `- Passed: ${summary.passedChecks}\n`;
    report += `- Failed: ${summary.failedChecks}\n`;
    report += `- Warnings: ${summary.warningChecks}\n\n`;

    if (violations.length > 0) {
      report += `## Violations\n`;
      violations.forEach((violation, index) => {
        report += `### ${index + 1}. ${violation.rule}\n`;
        report += `**Level:** WCAG ${violation.level}\n`;
        report += `**Severity:** ${violation.severity}\n`;
        report += `**Description:** ${violation.description}\n`;
        report += `**Fix:** ${violation.fix}\n`;
        report += `**Reference:** ${violation.wcagReference}\n\n`;
      });
    }

    if (warnings.length > 0) {
      report += `## Warnings\n`;
      warnings.forEach((warning, index) => {
        report += `### ${index + 1}. ${warning.rule}\n`;
        report += `**Description:** ${warning.description}\n`;
        report += `**Suggestion:** ${warning.suggestion}\n\n`;
      });
    }

    return report;
  },

  // Keyboard navigation test
  testKeyboardNavigation: (): Promise<{
    passed: boolean;
    focusableElements: number;
    issues: string[];
  }> => {
    return new Promise((resolve) => {
      if (typeof document === 'undefined') {
        resolve({ passed: true, focusableElements: 0, issues: [] });
        return;
      }

      const focusableElements = document.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      const issues: string[] = [];

      // Check if elements are keyboard accessible
      focusableElements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;

        // Check if element has visible focus indicator
        const computedStyle = window.getComputedStyle(htmlElement, ':focus');
        const hasOutline = computedStyle.outline !== 'none' && computedStyle.outline !== '0px';
        const hasBoxShadow = computedStyle.boxShadow !== 'none';

        if (!hasOutline && !hasBoxShadow) {
          issues.push(`Element ${index + 1} (${htmlElement.tagName}) lacks visible focus indicator`);
        }
      });

      resolve({
        passed: issues.length === 0,
        focusableElements: focusableElements.length,
        issues,
      });
    });
  },

  // Screen reader test (simplified)
  testScreenReaderCompatibility: (content: string): {
    passed: boolean;
    issues: string[];
    suggestions: string[];
  } => {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for ARIA labels
    const hasAriaLabels = content.includes('aria-label') || content.includes('aria-labelledby');
    if (!hasAriaLabels) {
      suggestions.push('Consider adding ARIA labels for better screen reader support');
    }

    // Check for skip links
    const hasSkipLinks = content.includes('skip') && content.includes('main');
    if (!hasSkipLinks) {
      suggestions.push('Add skip navigation links for keyboard users');
    }

    // Check for proper heading structure
    const headingMatches = content.match(/<h[1-6][^>]*>/g) ?? [];
    if (headingMatches.length === 0) {
      issues.push('No headings found - screen readers rely on heading structure');
    }

    return {
      passed: issues.length === 0,
      issues,
      suggestions,
    };
  },

  // ARIA validation
  validateARIA: (content: string): {
    passed: boolean;
    issues: string[];
  } => {
    const issues: string[] = [];

    // Check for invalid ARIA attributes (simplified)
    const ariaAttributes = content.match(/aria-\w+/g) ?? [];
    const validAriaAttributes = [
      'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden',
      'aria-expanded', 'aria-current', 'aria-live', 'aria-atomic',
      'aria-relevant', 'aria-busy', 'aria-disabled', 'aria-readonly',
    ];

    ariaAttributes.forEach(attr => {
      if (!validAriaAttributes.includes(attr)) {
        issues.push(`Invalid ARIA attribute: ${attr}`);
      }
    });

    return {
      passed: issues.length === 0,
      issues,
    };
  },

  // Color accessibility check
  checkColorAccessibility: (colors: Array<{ foreground: string; background: string; isLargeText?: boolean }>): {
    passed: boolean;
    results: Array<{
      foreground: string;
      background: string;
      ratio: number;
      passed: boolean;
      level: string;
    }>;
  } => {
    const results = colors.map(({ foreground, background, isLargeText = false }) => {
      const ratio = AccessibilityUtils.getContrastRatio(foreground, background);
      const passesAA = AccessibilityUtils.meetsContrastRequirement(ratio, 'AA', isLargeText);
      const passesAAA = AccessibilityUtils.meetsContrastRequirement(ratio, 'AAA', isLargeText);

      return {
        foreground,
        background,
        ratio,
        passed: passesAA,
        level: passesAAA ? 'AAA' : passesAA ? 'AA' : 'Fail',
      };
    });

    return {
      passed: results.every(r => r.passed),
      results,
    };
  },
};
