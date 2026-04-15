import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system' | 'star-trek' | 'coding-vibe' | 'cyberpunk' | 'nature' | 'ocean' | 'sunset' | 'matrix' | 'retro' | 'minimal';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    // Load theme from localStorage or user preferences
    const savedTheme = localStorage.getItem('codesphere-theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Default to dark theme
      setThemeState('dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove(
      'light', 'dark', 'system',
      'star-trek', 'coding-vibe', 'cyberpunk', 'nature', 
      'ocean', 'sunset', 'matrix', 'retro', 'minimal'
    );
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('codesphere-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}