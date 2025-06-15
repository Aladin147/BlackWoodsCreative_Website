import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Image from 'next/image';
import { 
  getContrastRatio, 
  meetsContrastRequirement, 
  colorPalette,
  FocusManager,
  auditAccessibility 
} from '@/lib/utils/accessibility';

// Mock components for testing
const MockButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>{children}</button>
);

const MockForm = () => (
  <form>
    <label htmlFor="test-input">Test Input</label>
    <input id="test-input" type="text" />
    <button type="submit">Submit</button>
  </form>
);

const MockImageGallery = () => (
  <div>
    <Image src="/test1.jpg" alt="Test image 1" width={100} height={100} />
    <Image src="/test2.jpg" alt="Test image 2" width={100} height={100} />
    <Image src="/test3.jpg" alt="" role="presentation" width={100} height={100} />
  </div>
);

describe('Accessibility Utilities', () => {
  describe('Color Contrast', () => {
    it('calculates contrast ratio correctly', () => {
      const ratio = getContrastRatio('#ffffff', '#000000');
      expect(ratio).toBeCloseTo(21, 0); // Perfect contrast
    });

    it('validates WCAG AA compliance for normal text', () => {
      expect(meetsContrastRequirement('#ffffff', '#000000', 'AA', 'normal')).toBe(true);
      expect(meetsContrastRequirement('#ffffff', '#777777', 'AA', 'normal')).toBe(false);
    });

    it('validates WCAG AA compliance for large text', () => {
      expect(meetsContrastRequirement('#ffffff', '#777777', 'AA', 'large')).toBe(true);
      expect(meetsContrastRequirement('#ffffff', '#999999', 'AA', 'large')).toBe(false);
    });

    it('validates brand colors meet contrast requirements', () => {
      // Test key brand color combinations using theme guide colors
      expect(meetsContrastRequirement(colorPalette['bw-text-primary'], colorPalette['bw-bg-primary'])).toBe(true);
      expect(meetsContrastRequirement(colorPalette['bw-bg-primary'], colorPalette['bw-accent-gold'])).toBe(true);
      expect(meetsContrastRequirement(colorPalette['bw-text-primary'], colorPalette['bw-border-subtle'])).toBe(true);
    });
  });

  describe('Focus Management', () => {
    it('traps focus within container', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button>First</button>
        <button>Second</button>
        <button>Last</button>
      `;
      document.body.appendChild(container);

      const cleanup = FocusManager.trapFocus(container);
      
      // First button should be focused
      expect(document.activeElement).toBe(container.querySelector('button'));

      cleanup();
      document.body.removeChild(container);
    });

    it('saves and restores focus', () => {
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      document.body.appendChild(button);
      button.focus();

      FocusManager.saveFocus();
      
      // Focus something else
      const otherButton = document.createElement('button');
      document.body.appendChild(otherButton);
      otherButton.focus();

      FocusManager.restoreFocus();
      expect(document.activeElement).toBe(button);

      document.body.removeChild(button);
      document.body.removeChild(otherButton);
    });
  });

  describe('Accessibility Audit', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('detects missing alt text', () => {
      // Create a test with actual missing alt attribute
      const TestComponent = () => (
        <div>
          <Image src="/test.jpg" alt="Good image" width={100} height={100} />
          <Image src="/test2.jpg" alt="" width={100} height={100} />
        </div>
      );

      render(<TestComponent />);

      const audit = auditAccessibility();
      expect(audit.passed).toBe(false);
      expect(audit.violations).toContain('Image 2 missing alt text');
    });

    it('validates proper heading hierarchy', () => {
      render(
        <div>
          <h1>Main Title</h1>
          <h3>Skipped h2</h3>
        </div>
      );

      const audit = auditAccessibility();
      expect(audit.violations.some(v => v.includes('Heading level skipped'))).toBe(true);
    });

    it('detects missing form labels', () => {
      render(
        <form>
          <input type="text" />
          <input type="email" aria-label="Email" />
        </form>
      );

      const audit = auditAccessibility();
      expect(audit.violations.some(v => v.includes('missing label'))).toBe(true);
    });

    it('passes audit with proper accessibility', () => {
      render(
        <div>
          <h1>Main Title</h1>
          <h2>Subtitle</h2>
          <Image src="/test.jpg" alt="Test image" width={100} height={100} />
          <form>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" />
          </form>
        </div>
      );

      const audit = auditAccessibility();
      expect(audit.passed).toBe(true);
    });
  });

  describe('Component Accessibility', () => {
    it('button has proper keyboard support', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<MockButton onClick={handleClick}>Test Button</MockButton>);
      
      const button = screen.getByRole('button');
      
      // Test click
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Test keyboard activation
      button.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(2);

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('form has proper labels and associations', () => {
      render(<MockForm />);
      
      const input = screen.getByLabelText('Test Input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-input');
      
      const label = screen.getByText('Test Input');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('images have appropriate alt text', () => {
      render(<MockImageGallery />);
      
      expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
      expect(screen.getByAltText('Test image 2')).toBeInTheDocument();
      
      // Decorative image should have empty alt
      const decorativeImage = screen.getByRole('presentation');
      expect(decorativeImage).toHaveAttribute('alt', '');
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports tab navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <button>First</button>
          <button>Second</button>
          <button>Third</button>
        </div>
      );

      const buttons = screen.getAllByRole('button');
      
      // Tab through buttons
      await user.tab();
      expect(document.activeElement).toBe(buttons[0]);
      
      await user.tab();
      expect(document.activeElement).toBe(buttons[1]);
      
      await user.tab();
      expect(document.activeElement).toBe(buttons[2]);
    });

    it('supports shift+tab for reverse navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <button>First</button>
          <button>Second</button>
        </div>
      );

      const buttons = screen.getAllByRole('button');
      
      // Focus last button first
      buttons[1].focus();
      
      // Shift+Tab should go to previous
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(document.activeElement).toBe(buttons[0]);
    });
  });
});
