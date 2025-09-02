import React, { createContext, useContext } from 'react';
import { useTheme, Theme } from '../hooks/useTheme';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeData = useTheme();

  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
