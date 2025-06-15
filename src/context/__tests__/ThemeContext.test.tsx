import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Test component that uses the theme context
function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Reset matchMedia mock
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  describe('ThemeProvider', () => {
    it('renders children correctly', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Test Child</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('provides default dark theme when no saved preference', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    it('calls localStorage.getItem on mount', () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should call localStorage.getItem to check for saved theme
      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    it('respects system preference when no saved theme', () => {
      (window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    it('checks system preference when no saved theme', () => {
      (window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: light)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should call matchMedia to check system preference
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('provides toggle function', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should render toggle button
      const toggleButton = screen.getByTestId('toggle-theme');
      expect(toggleButton).toBeInTheDocument();

      // Should be clickable
      expect(() => {
        fireEvent.click(toggleButton);
      }).not.toThrow();
    });

    it('calls localStorage.setItem when theme changes', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Clear previous calls
      localStorageMock.setItem.mockClear();

      fireEvent.click(screen.getByTestId('toggle-theme'));

      // Should call setItem (though the value might vary based on initial state)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', expect.any(String));
    });

    it('manipulates document classes', () => {
      const documentElement = document.documentElement;
      const addClassSpy = jest.spyOn(documentElement.classList, 'add');
      const removeClassSpy = jest.spyOn(documentElement.classList, 'remove');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should manipulate document classes
      expect(addClassSpy).toHaveBeenCalled();
      expect(removeClassSpy).toHaveBeenCalled();

      // Toggle theme
      fireEvent.click(screen.getByTestId('toggle-theme'));

      // Should continue to manipulate classes
      expect(addClassSpy).toHaveBeenCalled();
      expect(removeClassSpy).toHaveBeenCalled();

      addClassSpy.mockRestore();
      removeClassSpy.mockRestore();
    });
  });

  describe('useTheme hook', () => {
    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      function TestComponentWithoutProvider() {
        try {
          useTheme();
          return <div>Test</div>;
        } catch (error) {
          throw error;
        }
      }

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });

    it('provides theme and toggleTheme function', () => {
      let themeValue: any;
      let toggleThemeFunction: any;

      function TestComponentWithHook() {
        const theme = useTheme();
        themeValue = theme.theme;
        toggleThemeFunction = theme.toggleTheme;
        return <div>Test</div>;
      }

      render(
        <ThemeProvider>
          <TestComponentWithHook />
        </ThemeProvider>
      );

      expect(themeValue).toBe('dark');
      expect(typeof toggleThemeFunction).toBe('function');
    });
  });

  describe('Edge cases', () => {
    it('handles invalid localStorage values gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should fall back to system preference or default
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    it('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => {
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );
      }).not.toThrow();
    });

    it('handles matchMedia not being available', () => {
      // Remove matchMedia
      delete (window as any).matchMedia;

      expect(() => {
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );
      }).not.toThrow();

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
  });
});
