import React, { createContext, useContext, useState } from 'react';

export const themes = {
  orange: {
    name: 'Orange Sunset',
    primary: 'from-orange-500 to-purple-600',
    secondary: 'bg-orange-500',
    accent: 'bg-purple-600',
    highlight: 'text-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600',
  },
  green: {
    name: 'Forest Green',
    primary: 'from-green-500 to-teal-600',
    secondary: 'bg-green-500',
    accent: 'bg-teal-600',
    highlight: 'text-green-500',
    button: 'bg-green-500 hover:bg-green-600',
  },
  purple: {
    name: 'Royal Purple',
    primary: 'from-purple-500 to-indigo-600',
    secondary: 'bg-purple-500',
    accent: 'bg-indigo-600',
    highlight: 'text-purple-500',
    button: 'bg-purple-500 hover:bg-purple-600',
  },
  blue: {
    name: 'Ocean Blue',
    primary: 'from-blue-500 to-cyan-600',
    secondary: 'bg-blue-500',
    accent: 'bg-cyan-600',
    highlight: 'text-blue-500',
    button: 'bg-blue-500 hover:bg-blue-600',
  },
  red: {
    name: 'Ruby Red',
    primary: 'from-red-500 to-pink-600',
    secondary: 'bg-red-500',
    accent: 'bg-pink-600',
    highlight: 'text-red-500',
    button: 'bg-red-500 hover:bg-red-600',
  },
  yellow: {
    name: 'Golden Sun',
    primary: 'from-yellow-500 to-orange-600',
    secondary: 'bg-yellow-500',
    accent: 'bg-orange-600',
    highlight: 'text-yellow-500',
    button: 'bg-yellow-500 hover:bg-yellow-600',
  },
  teal: {
    name: 'Tropical Teal',
    primary: 'from-teal-500 to-emerald-600',
    secondary: 'bg-teal-500',
    accent: 'bg-emerald-600',
    highlight: 'text-teal-500',
    button: 'bg-teal-500 hover:bg-teal-600',
  },
  indigo: {
    name: 'Deep Ocean',
    primary: 'from-indigo-500 to-blue-600',
    secondary: 'bg-indigo-500',
    accent: 'bg-blue-600',
    highlight: 'text-indigo-500',
    button: 'bg-indigo-500 hover:bg-indigo-600',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('orange');

  const value = {
    theme: themes[currentTheme],
    setTheme: setCurrentTheme,
    currentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
