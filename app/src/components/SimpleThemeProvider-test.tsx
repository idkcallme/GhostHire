import React, { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface SimpleThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const SimpleThemeContext = createContext<SimpleThemeContextType | undefined>(undefined);

interface SimpleThemeProviderProps {
  children: ReactNode;
}

export const SimpleThemeProvider: React.FC<SimpleThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value: SimpleThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <SimpleThemeContext.Provider value={value}>
      {children}
    </SimpleThemeContext.Provider>
  );
};

export const useSimpleTheme = (): SimpleThemeContextType => {
  const context = useContext(SimpleThemeContext);
  if (context === undefined) {
    throw new Error('useSimpleTheme must be used within a SimpleThemeProvider');
  }
  return context;
};
