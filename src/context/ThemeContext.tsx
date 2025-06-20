'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';

// Single theme system - Deep Forest Haze
const THEME = 'deep-forest-haze';

type ThemeContextType = {
  theme: string;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Apply Deep Forest Haze theme to document
    document.documentElement.classList.add(THEME);

    // Clean up any old theme classes that might exist
    document.documentElement.classList.remove('light', 'dark');
  }, []);

  return <ThemeContext.Provider value={{ theme: THEME }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
