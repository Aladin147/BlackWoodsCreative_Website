'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Single theme system - Deep Forest Haze
const THEME = 'deep-forest-haze';

type ThemeContextType = {
  theme: string;
  isHydrated: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated first to prevent hydration mismatch
    setIsHydrated(true);

    // Only apply theme changes in browser environment
    if (typeof document !== 'undefined') {
      // Apply Deep Forest Haze theme to document after hydration
      document.documentElement.classList.add(THEME);

      // Clean up any old theme classes that might exist
      document.documentElement.classList.remove('light', 'dark');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: THEME, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
