import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Unmock ThemeContext for this test file to test the actual implementation
jest.unmock('@/context/ThemeContext');

import { ThemeProvider, useTheme } from '../ThemeContext';

// Test component that uses the theme context
function TestComponent() {
  const { theme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
    </div>
  );
}

describe('ThemeContext', () => {
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

    it('provides Deep Forest Haze theme', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('deep-forest-haze');
    });

    it('applies theme class to document', () => {
      const addClassSpy = jest.spyOn(document.documentElement.classList, 'add');
      const removeClassSpy = jest.spyOn(document.documentElement.classList, 'remove');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Should add the Deep Forest Haze theme class
      expect(addClassSpy).toHaveBeenCalledWith('deep-forest-haze');

      // Should clean up old theme classes
      expect(removeClassSpy).toHaveBeenCalledWith('light', 'dark');

      addClassSpy.mockRestore();
      removeClassSpy.mockRestore();
    });

    it('provides context value correctly', () => {
      let contextValue: { theme: string } | undefined;

      function TestContextConsumer() {
        contextValue = useTheme();
        return <div>Test</div>;
      }

      render(
        <ThemeProvider>
          <TestContextConsumer />
        </ThemeProvider>
      );

      expect(contextValue).toBeDefined();
      expect(contextValue!.theme).toBe('deep-forest-haze');
      // Note: toggleTheme doesn't exist in this single-theme implementation
    });
  });

  describe('useTheme hook', () => {
    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      function TestComponentWithoutProvider() {
        useTheme(); // This should throw
        return <div>Should not render</div>;
      }

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });

    it('provides theme value', () => {
      let themeValue: string | undefined;

      function TestComponentWithHook() {
        const theme = useTheme();
        themeValue = theme.theme;
        return <div>Test</div>;
      }

      render(
        <ThemeProvider>
          <TestComponentWithHook />
        </ThemeProvider>
      );

      expect(themeValue).toBeDefined();
      expect(themeValue).toBe('deep-forest-haze');
    });
  });

});
