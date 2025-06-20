/**
 * @jest-environment jsdom
 */
import { act } from '@testing-library/react';

import {
  getContrastRatio,
  meetsContrastRequirement,
  FocusManager,
  prefersReducedMotion,
  announceToScreenReader,
  handleKeyboardNavigation,
  auditAccessibility,
  colorPalette,
} from '../accessibility';

// Mock window.matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock document methods
const mockCreateElement = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockQuerySelector = jest.fn();
const mockQuerySelectorAll = jest.fn();
const mockGetComputedStyle = jest.fn();

Object.defineProperty(document, 'createElement', {
  writable: true,
  value: mockCreateElement,
});

Object.defineProperty(document.body, 'appendChild', {
  writable: true,
  value: mockAppendChild,
});

Object.defineProperty(document.body, 'removeChild', {
  writable: true,
  value: mockRemoveChild,
});

Object.defineProperty(document, 'querySelector', {
  writable: true,
  value: mockQuerySelector,
});

Object.defineProperty(document, 'querySelectorAll', {
  writable: true,
  value: mockQuerySelectorAll,
});

Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: mockGetComputedStyle,
});

// Mock setTimeout
jest.useFakeTimers();

describe('accessibility utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  describe('getContrastRatio', () => {
    it('calculates contrast ratio for black and white', () => {
      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('calculates contrast ratio for same colors', () => {
      const ratio = getContrastRatio('#ffffff', '#ffffff');
      expect(ratio).toBe(1);
    });

    it('calculates contrast ratio for brand colors', () => {
      const ratio = getContrastRatio('#101211', '#E8E8E3');
      expect(ratio).toBeGreaterThan(4.5);
    });

    it('handles colors without hash prefix', () => {
      const ratio = getContrastRatio('000000', 'ffffff');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('calculates ratio for medium contrast colors', () => {
      const ratio = getContrastRatio('#666666', '#ffffff');
      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBeLessThan(21);
    });
  });

  describe('meetsContrastRequirement', () => {
    it('returns true for high contrast combinations (AA normal)', () => {
      const result = meetsContrastRequirement('#000000', '#ffffff', 'AA', 'normal');
      expect(result).toBe(true);
    });

    it('returns false for low contrast combinations (AA normal)', () => {
      const result = meetsContrastRequirement('#cccccc', '#ffffff', 'AA', 'normal');
      expect(result).toBe(false);
    });

    it('has lower requirements for large text (AA)', () => {
      const result = meetsContrastRequirement('#666666', '#ffffff', 'AA', 'large');
      expect(result).toBe(true);
    });

    it('has higher requirements for AAA level', () => {
      const result = meetsContrastRequirement('#666666', '#ffffff', 'AAA', 'normal');
      expect(result).toBe(false);
    });

    it('uses AA normal as default parameters', () => {
      const result = meetsContrastRequirement('#000000', '#ffffff');
      expect(result).toBe(true);
    });

    it('validates brand color combinations', () => {
      const result = meetsContrastRequirement(
        colorPalette['bw-text-primary'],
        colorPalette['bw-bg-primary']
      );
      expect(result).toBe(true);
    });
  });

  describe('FocusManager', () => {
    let mockContainer: any;
    let mockFocusableElements: any[];

    beforeEach(() => {
      mockContainer = {
        querySelectorAll: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      mockFocusableElements = [
        { focus: jest.fn(), id: 'element-0' },
        { focus: jest.fn(), id: 'element-1' },
        { focus: jest.fn(), id: 'element-2' },
      ];

      mockContainer.querySelectorAll.mockReturnValue(mockFocusableElements);
    });

    describe('trapFocus', () => {
      it('focuses first element on initialization', () => {
        FocusManager.trapFocus(mockContainer);
        expect(mockFocusableElements[0].focus).toHaveBeenCalled();
      });

      it('adds event listeners to container', () => {
        FocusManager.trapFocus(mockContainer);
        expect(mockContainer.addEventListener).toHaveBeenCalledWith(
          'keydown',
          expect.any(Function)
        );
        expect(mockContainer.addEventListener).toHaveBeenCalledTimes(2);
      });

      it('returns cleanup function', () => {
        const cleanup = FocusManager.trapFocus(mockContainer);
        expect(typeof cleanup).toBe('function');

        cleanup();
        expect(mockContainer.removeEventListener).toHaveBeenCalledWith(
          'keydown',
          expect.any(Function)
        );
        expect(mockContainer.removeEventListener).toHaveBeenCalledTimes(2);
      });

      it('handles empty focusable elements gracefully', () => {
        mockContainer.querySelectorAll = jest.fn().mockReturnValue([]);
        expect(() => FocusManager.trapFocus(mockContainer)).not.toThrow();
      });
    });

    describe('saveFocus and restoreFocus', () => {
      it('saves and restores focus', () => {
        const mockActiveElement = { focus: jest.fn() };

        Object.defineProperty(document, 'activeElement', {
          writable: true,
          value: mockActiveElement,
        });

        FocusManager.saveFocus();
        FocusManager.restoreFocus();

        expect(mockActiveElement.focus).toHaveBeenCalled();
      });

      it('handles no saved focus gracefully', () => {
        expect(() => FocusManager.restoreFocus()).not.toThrow();
      });

      it('maintains focus stack order', () => {
        const element1 = { focus: jest.fn() };
        const element2 = { focus: jest.fn() };

        Object.defineProperty(document, 'activeElement', {
          writable: true,
          value: element1,
        });
        FocusManager.saveFocus();

        Object.defineProperty(document, 'activeElement', {
          writable: true,
          value: element2,
        });
        FocusManager.saveFocus();

        FocusManager.restoreFocus();
        expect(element2.focus).toHaveBeenCalled();

        FocusManager.restoreFocus();
        expect(element1.focus).toHaveBeenCalled();
      });
    });
  });

  describe('prefersReducedMotion', () => {
    it('returns false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const result = prefersReducedMotion();
      expect(result).toBe(false);

      global.window = originalWindow;
    });

    it('returns true when user prefers reduced motion', () => {
      mockMatchMedia.mockReturnValue({ matches: true });

      const result = prefersReducedMotion();
      expect(result).toBe(true);
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('returns false when user does not prefer reduced motion', () => {
      mockMatchMedia.mockReturnValue({ matches: false });

      const result = prefersReducedMotion();
      expect(result).toBe(false);
    });
  });

  describe('announceToScreenReader', () => {
    beforeEach(() => {
      const mockElement = {
        setAttribute: jest.fn(),
        textContent: '',
        className: '',
      };
      mockCreateElement.mockReturnValue(mockElement);
    });

    it('returns early when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      announceToScreenReader('test message');
      expect(mockCreateElement).not.toHaveBeenCalled();

      global.window = originalWindow;
    });

    it('creates announcement element with correct attributes', () => {
      const mockElement = {
        setAttribute: jest.fn(),
        textContent: '',
        className: '',
      };
      mockCreateElement.mockReturnValue(mockElement);

      announceToScreenReader('test message', 'assertive');

      expect(mockCreateElement).toHaveBeenCalledWith('div');
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'assertive');
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-atomic', 'true');
      expect(mockElement.className).toBe('sr-only');
      expect(mockElement.textContent).toBe('test message');
      expect(mockAppendChild).toHaveBeenCalledWith(mockElement);
    });

    it('uses polite as default priority', () => {
      const mockElement = {
        setAttribute: jest.fn(),
        textContent: '',
        className: '',
      };
      mockCreateElement.mockReturnValue(mockElement);

      announceToScreenReader('test message');

      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'polite');
    });

    it('removes element after timeout', () => {
      const mockElement = {
        setAttribute: jest.fn(),
        textContent: '',
        className: '',
      };
      mockCreateElement.mockReturnValue(mockElement);

      announceToScreenReader('test message');

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockRemoveChild).toHaveBeenCalledWith(mockElement);
    });
  });

  describe('handleKeyboardNavigation', () => {
    const mockCallbacks = {
      onEnter: jest.fn(),
      onSpace: jest.fn(),
      onEscape: jest.fn(),
      onArrowKeys: jest.fn(),
    };

    beforeEach(() => {
      Object.values(mockCallbacks).forEach(fn => fn.mockClear());
    });

    it('handles Enter key', () => {
      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn(),
      } as any;

      handleKeyboardNavigation(mockEvent, mockCallbacks.onEnter);

      expect(mockCallbacks.onEnter).toHaveBeenCalled();
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('handles Space key', () => {
      const mockEvent = {
        key: ' ',
        preventDefault: jest.fn(),
      } as any;

      handleKeyboardNavigation(mockEvent, undefined, mockCallbacks.onSpace);

      expect(mockCallbacks.onSpace).toHaveBeenCalled();
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('handles Escape key', () => {
      const mockEvent = {
        key: 'Escape',
        preventDefault: jest.fn(),
      } as any;

      handleKeyboardNavigation(mockEvent, undefined, undefined, mockCallbacks.onEscape);

      expect(mockCallbacks.onEscape).toHaveBeenCalled();
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('handles arrow keys', () => {
      const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      const expectedDirections = ['up', 'down', 'left', 'right'];

      directions.forEach((key, index) => {
        const mockEvent = {
          key,
          preventDefault: jest.fn(),
        } as any;

        handleKeyboardNavigation(
          mockEvent,
          undefined,
          undefined,
          undefined,
          mockCallbacks.onArrowKeys
        );

        expect(mockCallbacks.onArrowKeys).toHaveBeenCalledWith(expectedDirections[index]);
        expect(mockEvent.preventDefault).toHaveBeenCalled();

        mockCallbacks.onArrowKeys.mockClear();
      });
    });

    it('ignores unhandled keys', () => {
      const mockEvent = {
        key: 'Tab',
        preventDefault: jest.fn(),
      } as any;

      handleKeyboardNavigation(mockEvent, mockCallbacks.onEnter);

      expect(mockCallbacks.onEnter).not.toHaveBeenCalled();
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('does not call callbacks when not provided', () => {
      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn(),
      } as any;

      expect(() => handleKeyboardNavigation(mockEvent)).not.toThrow();
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  // Note: useAriaLiveRegion hook tests are skipped due to test environment limitations
  // The hook functionality is tested through integration tests

  describe('auditAccessibility', () => {
    beforeEach(() => {
      mockQuerySelectorAll.mockClear();
      mockQuerySelector.mockClear();
      mockGetComputedStyle.mockClear();
    });

    it('returns passed true with no violations when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const result = auditAccessibility();
      expect(result).toEqual({
        passed: true,
        violations: [],
        warnings: [],
      });

      global.window = originalWindow;
    });

    it('detects missing alt text on images', () => {
      const mockImages = [
        { alt: '', getAttribute: jest.fn().mockReturnValue(null) },
        { alt: 'Valid alt text', getAttribute: jest.fn() },
        { alt: '', getAttribute: jest.fn().mockReturnValue('true') }, // aria-hidden
      ];

      mockQuerySelectorAll.mockImplementation(selector => {
        if (selector === 'img') return mockImages;
        return [];
      });

      const result = auditAccessibility();

      expect(result.passed).toBe(false);
      expect(result.violations).toContain('Image 1 missing alt text');
      expect(result.violations).not.toContain('Image 2 missing alt text');
      expect(result.violations).not.toContain('Image 3 missing alt text');
    });

    it('detects improper heading hierarchy', () => {
      const mockHeadings = [
        { tagName: 'H2' }, // Should start with H1
        { tagName: 'H4' }, // Skips H3
        { tagName: 'H3' },
      ];

      mockQuerySelectorAll.mockImplementation(selector => {
        if (selector === 'h1, h2, h3, h4, h5, h6') return mockHeadings;
        return [];
      });

      const result = auditAccessibility();

      expect(result.warnings).toContain('Page should start with h1');
      expect(result.violations).toContain('Heading level skipped: H4 after h2');
    });

    it('detects proper heading hierarchy', () => {
      const mockHeadings = [
        { tagName: 'H1' },
        { tagName: 'H2' },
        { tagName: 'H3' },
        { tagName: 'H2' },
      ];

      mockQuerySelectorAll.mockImplementation(selector => {
        if (selector === 'h1, h2, h3, h4, h5, h6') return mockHeadings;
        return [];
      });

      const result = auditAccessibility();

      expect(result.warnings).not.toContain('Page should start with h1');
      expect(result.violations.filter(v => v.includes('Heading level skipped'))).toHaveLength(0);
    });

    it('detects missing form labels', () => {
      const mockInputs = [
        {
          id: 'input1',
          getAttribute: jest.fn().mockImplementation(attr => {
            if (attr === 'aria-label') return null;
            if (attr === 'aria-labelledby') return null;
            return null;
          }),
        },
        {
          id: 'input2',
          getAttribute: jest.fn().mockImplementation(attr => {
            if (attr === 'aria-label') return 'Input label';
            return null;
          }),
        },
      ];

      mockQuerySelectorAll.mockImplementation(selector => {
        if (selector === 'input, textarea, select') return mockInputs;
        return [];
      });

      mockQuerySelector.mockImplementation(selector => {
        if (selector === 'label[for="input1"]') return null;
        if (selector === 'label[for="input2"]') return document.createElement('label');
        return null;
      });

      const result = auditAccessibility();

      expect(result.violations).toContain('Form input 1 missing label');
      expect(result.violations).not.toContain('Form input 2 missing label');
    });

    it('detects missing focus indicators', () => {
      const mockElements = [{ tagName: 'BUTTON' }, { tagName: 'A' }];

      mockQuerySelectorAll.mockImplementation(selector => {
        if (selector.includes('button, [href]')) return mockElements;
        return [];
      });

      mockGetComputedStyle.mockImplementation((_element, pseudo) => {
        if (pseudo === ':focus') {
          return {
            outline: 'none',
            boxShadow: 'none',
          };
        }
        return {};
      });

      const result = auditAccessibility();

      expect(result.warnings).toContain('Element 1 may lack focus indicator');
      expect(result.warnings).toContain('Element 2 may lack focus indicator');
    });

    it('passes when elements have proper focus indicators', () => {
      const mockElements = [{ tagName: 'BUTTON' }];

      mockQuerySelectorAll.mockImplementation(selector => {
        if (selector.includes('button, [href]')) return mockElements;
        return [];
      });

      mockGetComputedStyle.mockImplementation((_element, pseudo) => {
        if (pseudo === ':focus') {
          return {
            outline: '2px solid blue',
            boxShadow: 'none',
          };
        }
        return {};
      });

      const result = auditAccessibility();

      expect(result.warnings.filter(w => w.includes('focus indicator'))).toHaveLength(0);
    });

    it('returns passed false when violations exist', () => {
      const mockImages = [{ alt: '', getAttribute: jest.fn().mockReturnValue(null) }];

      mockQuerySelectorAll.mockImplementation(selector => {
        if (selector === 'img') return mockImages;
        return [];
      });

      const result = auditAccessibility();

      expect(result.passed).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('returns passed true when no violations exist', () => {
      mockQuerySelectorAll.mockReturnValue([]);

      const result = auditAccessibility();

      expect(result.passed).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe('colorPalette', () => {
    it('contains all required brand colors', () => {
      expect(colorPalette['bw-bg-primary']).toBe('#101211');
      expect(colorPalette['bw-text-primary']).toBe('#E8E8E3');
      expect(colorPalette['bw-accent-gold']).toBe('#C3A358');
      expect(colorPalette['bw-aurora-teal']).toBe('#0F3530');
      expect(colorPalette['bw-aurora-green']).toBe('#1E4A38');
      expect(colorPalette['bw-border-subtle']).toBe('#2A2E2C');
    });

    it('contains legacy colors for backward compatibility', () => {
      expect(colorPalette['bw-black']).toBe('#101211');
      expect(colorPalette['bw-white']).toBe('#E8E8E3');
      expect(colorPalette['bw-gold']).toBe('#C3A358');
      expect(colorPalette['bw-charcoal']).toBe('#0f0f0f');
    });

    it('has proper contrast ratios for primary combinations', () => {
      const primaryContrast = getContrastRatio(
        colorPalette['bw-text-primary'],
        colorPalette['bw-bg-primary']
      );
      expect(primaryContrast).toBeGreaterThan(4.5);

      const goldContrast = getContrastRatio(
        colorPalette['bw-accent-gold'],
        colorPalette['bw-bg-primary']
      );
      expect(goldContrast).toBeGreaterThan(3);
    });
  });
});
