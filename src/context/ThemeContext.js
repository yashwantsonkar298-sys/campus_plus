import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'blog-theme';

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved !== null) return JSON.parse(saved);
  } catch {
    // Fall through to the user's system preference.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
    } catch {
      // Theme switching still works for the active session.
    }
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
