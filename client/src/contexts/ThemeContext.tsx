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
  const [theme, setThemeState] = useState<Theme>('nature');

  useEffect(() => {
    const savedTheme = localStorage.getItem('codesphere-theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      setThemeState('nature');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(
      'light', 'dark', 'system',
      'star-trek', 'coding-vibe', 'cyberpunk', 'nature',
      'ocean', 'sunset', 'matrix', 'retro', 'minimal'
    );
    root.classList.add(theme);
    localStorage.setItem('codesphere-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // Persist to backend if user is logged in
    fetch('/api/users/theme', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ theme: newTheme }),
    }).catch(() => {}); // non-blocking, best-effort
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