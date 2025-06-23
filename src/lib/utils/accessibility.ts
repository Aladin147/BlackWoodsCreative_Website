// Accessibility utilities and helpers for WCAG 2.1 AA compliance
'use client';

import React from 'react';

// Color contrast ratio calculation
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * (sRGB[0] ?? 0) + 0.7152 * (sRGB[1] ?? 0) + 0.0722 * (sRGB[2] ?? 0);
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// Check if contrast ratio meets WCAG standards
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);

  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }

  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

// Focus management utilities
export class FocusManager {
  private static focusStack: HTMLElement[] = [];

  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement | undefined;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement | undefined;

    if (!firstElement || !lastElement) {
      return () => {
        // No focusable elements found - no cleanup needed
      };
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.restoreFocus();
      }
    };

    container.addEventListener('keydown', handleTabKey);
    container.addEventListener('keydown', handleEscapeKey);

    // Focus first element
    firstElement.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      container.removeEventListener('keydown', handleEscapeKey);
    };
  }

  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      this.focusStack.push(activeElement);
    }
  }

  static restoreFocus(): void {
    const element = this.focusStack.pop();
    if (element) {
      element.focus();
    }
  }
}

// Reduced motion detection
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Screen reader utilities
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof window === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Keyboard navigation helpers
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onSpace?: () => void,
  onEscape?: () => void,
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
): void {
  switch (event.key) {
    case 'Enter':
      if (onEnter) {
        event.preventDefault();
        onEnter();
      }
      break;
    case ' ':
      if (onSpace) {
        event.preventDefault();
        onSpace();
      }
      break;
    case 'Escape':
      if (onEscape) {
        event.preventDefault();
        onEscape();
      }
      break;
    case 'ArrowUp':
      if (onArrowKeys) {
        event.preventDefault();
        onArrowKeys('up');
      }
      break;
    case 'ArrowDown':
      if (onArrowKeys) {
        event.preventDefault();
        onArrowKeys('down');
      }
      break;
    case 'ArrowLeft':
      if (onArrowKeys) {
        event.preventDefault();
        onArrowKeys('left');
      }
      break;
    case 'ArrowRight':
      if (onArrowKeys) {
        event.preventDefault();
        onArrowKeys('right');
      }
      break;
  }
}

// ARIA live region hook
export function useAriaLiveRegion() {
  const [message, setMessage] = React.useState('');
  const [priority, setPriority] = React.useState<'polite' | 'assertive'>('polite');

  const announce = React.useCallback((text: string, level: 'polite' | 'assertive' = 'polite') => {
    setMessage(''); // Clear first to ensure re-announcement
    setTimeout(() => {
      setMessage(text);
      setPriority(level);
    }, 100);
  }, []);

  return { announce, message, priority };
}

// Accessibility audit function
export function auditAccessibility(): {
  passed: boolean;
  violations: string[];
  warnings: string[];
} {
  if (typeof window === 'undefined') {
    return { passed: true, violations: [], warnings: [] };
  }

  const violations: string[] = [];
  const warnings: string[] = [];

  // Check for missing alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      violations.push(`Image ${index + 1} missing alt text`);
    }
  });

  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (index === 0 && level !== 1) {
      warnings.push('Page should start with h1');
    }
    if (level > lastLevel + 1) {
      violations.push(`Heading level skipped: ${heading.tagName} after h${lastLevel}`);
    }
    lastLevel = level;
  });

  // Check for form labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    const hasLabel =
      input.getAttribute('aria-label') ??
      input.getAttribute('aria-labelledby') ??
      document.querySelector(`label[for="${input.id}"]`);
    if (!hasLabel) {
      violations.push(`Form input ${index + 1} missing label`);
    }
  });

  // Check for focus indicators
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusableElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element, ':focus');
    if (styles.outline === 'none' && !styles.boxShadow.includes('inset')) {
      warnings.push(`Element ${index + 1} may lack focus indicator`);
    }
  });

  return {
    passed: violations.length === 0,
    violations,
    warnings,
  };
}

// Export color palette for contrast checking - UPDATED TO MATCH THEME GUIDE
export const colorPalette = {
  'bw-bg-primary': '#101211', // Near Black with green tint
  'bw-text-primary': '#E8E8E3', // Off-White, warm and soft
  'bw-accent-gold': '#C3A358', // Muted Gold, rich ochre
  'bw-aurora-teal': '#0F3530', // Enhanced Dark Teal
  'bw-aurora-green': '#1E4A38', // Enhanced Forest Green
  'bw-border-subtle': '#2A2E2C', // Low-contrast borders

  // Legacy colors for backward compatibility
  'bw-black': '#101211', // Updated to match bg-primary
  'bw-white': '#E8E8E3', // Updated to match text-primary
  'bw-gold': '#C3A358', // Updated to match accent-gold
  'bw-charcoal': '#0f0f0f',
  'bw-dark-gray': '#1a1a1a',
  'bw-medium-gray': '#2a2a2a',
  'bw-light-gray': '#6a6a6a',
  'bw-pearl': '#f8f8f8',
} as const;
