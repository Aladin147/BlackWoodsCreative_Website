/**
 * Accessibility Audit Tests
 */

import { AccessibilityChecker, AccessibilityUtils } from '../accessibility-audit';

describe('AccessibilityChecker', () => {
  let checker: AccessibilityChecker;

  beforeEach(() => {
    checker = new AccessibilityChecker();
  });

  describe('Configuration', () => {
    it('should use default configuration', () => {
      const config = checker.getConfig();
      expect(config.level).toBe('AA');
      expect(config.includeWarnings).toBe(true);
      expect(config.checkImages).toBe(true);
    });

    it('should allow configuration updates', () => {
      checker.updateConfig({ level: 'AAA', checkColorContrast: false });
      const config = checker.getConfig();
      
      expect(config.level).toBe('AAA');
      expect(config.checkColorContrast).toBe(false);
      expect(config.checkImages).toBe(true); // Should keep other defaults
    });
  });

  describe('Image Accessibility', () => {
    it('should pass for images with alt text', async () => {
      const content = '<img src="test.jpg" alt="Test image description">';
      const result = await checker.auditPage(content);
      
      const imageViolations = result.violations.filter(v => v.rule === 'img-alt');
      expect(imageViolations).toHaveLength(0);
    });

    it('should fail for images without alt text', async () => {
      const content = '<img src="test.jpg">';
      const result = await checker.auditPage(content);
      
      const imageViolations = result.violations.filter(v => v.rule === 'img-alt');
      expect(imageViolations).toHaveLength(1);
      expect(imageViolations[0]?.severity).toBe('serious');
      expect(imageViolations[0]?.level).toBe('A');
    });

    it('should warn for images with empty alt text', async () => {
      const content = '<img src="test.jpg" alt="">';
      const result = await checker.auditPage(content);
      
      const imageWarnings = result.warnings.filter(w => w.rule === 'img-alt-empty');
      expect(imageWarnings).toHaveLength(1);
    });
  });

  describe('Heading Structure', () => {
    it('should pass for proper heading hierarchy', async () => {
      const content = '<h1>Main Title</h1><h2>Section</h2><h3>Subsection</h3>';
      const result = await checker.auditPage(content);
      
      const headingViolations = result.violations.filter(v => v.rule.includes('heading'));
      expect(headingViolations).toHaveLength(0);
    });

    it('should fail when missing H1', async () => {
      const content = '<h2>Section</h2><h3>Subsection</h3>';
      const result = await checker.auditPage(content);
      
      const h1Violations = result.violations.filter(v => v.rule === 'page-has-heading-one');
      expect(h1Violations).toHaveLength(1);
      expect(h1Violations[0]?.level).toBe('AA');
    });

    it('should fail for skipped heading levels', async () => {
      const content = '<h1>Main Title</h1><h3>Skipped H2</h3>';
      const result = await checker.auditPage(content);
      
      const orderViolations = result.violations.filter(v => v.rule === 'heading-order');
      expect(orderViolations).toHaveLength(1);
      expect(orderViolations[0]?.severity).toBe('moderate');
    });

    it('should warn for multiple H1 headings', async () => {
      const content = '<h1>First Title</h1><h1>Second Title</h1>';
      const result = await checker.auditPage(content);
      
      const multipleH1Warnings = result.warnings.filter(w => w.rule === 'multiple-h1');
      expect(multipleH1Warnings).toHaveLength(1);
    });
  });

  describe('Form Accessibility', () => {
    it('should pass for forms with proper labels', async () => {
      const content = '<form><label for="name">Name:</label><input type="text" id="name"></form>';
      const result = await checker.auditPage(content);
      
      const labelViolations = result.violations.filter(v => v.rule === 'label');
      expect(labelViolations).toHaveLength(0);
    });

    it('should fail for inputs without labels', async () => {
      const content = '<form><input type="text" placeholder="Enter name"></form>';
      const result = await checker.auditPage(content);
      
      const labelViolations = result.violations.filter(v => v.rule === 'label');
      expect(labelViolations).toHaveLength(1);
      expect(labelViolations[0]?.level).toBe('A');
    });

    it('should ignore hidden and submit inputs', async () => {
      const content = '<form><input type="hidden" value="token"><input type="submit" value="Submit"></form>';
      const result = await checker.auditPage(content);
      
      const labelViolations = result.violations.filter(v => v.rule === 'label');
      expect(labelViolations).toHaveLength(0);
    });
  });

  describe('Landmark Structure', () => {
    it('should pass when main landmark is present', async () => {
      const content = '<main><h1>Main Content</h1></main>';
      const result = await checker.auditPage(content);
      
      const landmarkViolations = result.violations.filter(v => v.rule === 'landmark-main-is-top-level');
      expect(landmarkViolations).toHaveLength(0);
    });

    it('should fail when main landmark is missing', async () => {
      const content = '<div><h1>Content</h1></div>';
      const result = await checker.auditPage(content);
      
      const landmarkViolations = result.violations.filter(v => v.rule === 'landmark-main-is-top-level');
      expect(landmarkViolations).toHaveLength(1);
      expect(landmarkViolations[0]?.level).toBe('AA');
    });
  });

  describe('WCAG Compliance', () => {
    it('should determine Level A compliance', async () => {
      checker.updateConfig({ level: 'A' });
      const content = '<main><h1>Title</h1><img src="test.jpg" alt="Test"></main>';
      const result = await checker.auditPage(content);
      
      expect(result.level).toBe('A');
      expect(result.passed).toBe(true);
    });

    it('should determine Level AA compliance', async () => {
      checker.updateConfig({ level: 'AA' });
      const content = '<main><h1>Title</h1><img src="test.jpg" alt="Test"></main>';
      const result = await checker.auditPage(content);
      
      expect(result.level).toBe('AA');
      expect(result.passed).toBe(true);
    });

    it('should fail compliance when violations exist', async () => {
      const content = '<div><img src="test.jpg"></div>'; // Missing main, missing alt
      const result = await checker.auditPage(content);
      
      expect(result.passed).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });
  });

  describe('Score Calculation', () => {
    it('should calculate correct score', async () => {
      const content = '<main><h1>Title</h1><img src="test.jpg" alt="Test"></main>';
      const result = await checker.auditPage(content);
      
      expect(result.score).toBeGreaterThan(80);
      expect(result.summary.totalChecks).toBeGreaterThan(0);
      expect(result.summary.passedChecks).toBeGreaterThan(0);
    });
  });

  describe('Recommendations', () => {
    it('should generate appropriate recommendations', async () => {
      const content = '<div><img src="test.jpg"></div>'; // Multiple issues
      const result = await checker.auditPage(content);
      
      expect(result.recommendations).toContain('Fix all accessibility violations before deployment');
      expect(result.recommendations.some(r => r.includes('image'))).toBe(true);
    });

    it('should provide positive feedback for good accessibility', async () => {
      const content = '<main><h1>Title</h1><img src="test.jpg" alt="Test"></main>';
      const result = await checker.auditPage(content);
      
      if (result.violations.length === 0) {
        expect(result.recommendations).toContain('Great job! No major accessibility issues found');
      }
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = AccessibilityChecker.getInstance();
      const instance2 = AccessibilityChecker.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
});

describe('AccessibilityUtils', () => {
  describe('Focusable Elements', () => {
    it('should identify focusable elements', () => {
      // Mock DOM elements
      const button = document.createElement('button');
      const disabledButton = document.createElement('button');
      disabledButton.disabled = true;
      const link = document.createElement('a');
      link.href = '#';
      const div = document.createElement('div');
      
      expect(AccessibilityUtils.isFocusable(button)).toBe(true);
      expect(AccessibilityUtils.isFocusable(disabledButton)).toBe(false);
      expect(AccessibilityUtils.isFocusable(link)).toBe(true);
      expect(AccessibilityUtils.isFocusable(div)).toBe(false);
    });
  });

  describe('Color Contrast', () => {
    it('should calculate contrast ratio', () => {
      const ratio = AccessibilityUtils.getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeGreaterThan(1);
    });

    it('should validate WCAG contrast requirements', () => {
      expect(AccessibilityUtils.meetsContrastRequirement(4.5, 'AA', false)).toBe(true);
      expect(AccessibilityUtils.meetsContrastRequirement(3.0, 'AA', false)).toBe(false);
      expect(AccessibilityUtils.meetsContrastRequirement(3.0, 'AA', true)).toBe(true);
      expect(AccessibilityUtils.meetsContrastRequirement(7.0, 'AAA', false)).toBe(true);
    });

    it('should check color accessibility', () => {
      const colors = [
        { foreground: '#000000', background: '#ffffff' }, // High contrast
        { foreground: '#888888', background: '#999999' }, // Low contrast
      ];
      
      const result = AccessibilityUtils.checkColorAccessibility(colors);
      expect(result.results).toHaveLength(2);
      expect(result.results[0]?.passed).toBe(true);
      expect(result.results[1]?.passed).toBe(false);
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('should test screen reader compatibility', () => {
      const goodContent = '<main><h1>Title</h1><a href="#main" aria-label="Skip to main">Skip</a></main>';
      const result = AccessibilityUtils.testScreenReaderCompatibility(goodContent);
      
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should identify screen reader issues', () => {
      const poorContent = '<div>Content without headings</div>';
      const result = AccessibilityUtils.testScreenReaderCompatibility(poorContent);
      
      expect(result.passed).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe('ARIA Validation', () => {
    it('should validate ARIA attributes', () => {
      const validContent = '<button aria-label="Close dialog">X</button>';
      const result = AccessibilityUtils.validateARIA(validContent);
      
      expect(result.passed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should identify invalid ARIA attributes', () => {
      const invalidContent = '<div aria-invalid-attribute="value">Content</div>';
      const result = AccessibilityUtils.validateARIA(invalidContent);
      
      expect(result.passed).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Report Generation', () => {
    it('should generate accessibility report', async () => {
      const checker = new AccessibilityChecker();
      const content = '<main><h1>Title</h1><img src="test.jpg"></main>'; // Missing alt
      const result = await checker.auditPage(content);
      
      const report = AccessibilityUtils.generateAccessibilityReport(result);
      
      expect(report).toContain('# Accessibility Audit Report');
      expect(report).toContain('WCAG AA Compliance');
      expect(report).toContain('## Summary');
      
      if (result.violations.length > 0) {
        expect(report).toContain('## Violations');
      }
    });
  });

  describe('Keyboard Navigation', () => {
    it('should test keyboard navigation', async () => {
      // Mock document and elements
      const mockElement = {
        tagName: 'BUTTON',
        matches: jest.fn(() => true),
      };
      
      Object.defineProperty(document, 'querySelectorAll', {
        value: jest.fn(() => [mockElement]),
        configurable: true,
      });
      
      Object.defineProperty(window, 'getComputedStyle', {
        value: jest.fn(() => ({
          outline: '2px solid blue',
          boxShadow: 'none',
        })),
        configurable: true,
      });
      
      const result = await AccessibilityUtils.testKeyboardNavigation();
      
      expect(result.focusableElements).toBe(1);
      expect(result.passed).toBe(true);
    });
  });
});
