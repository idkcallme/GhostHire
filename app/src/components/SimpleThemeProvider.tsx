import React, { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface SimpleThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const SimpleThemeContext = createContext<SimpleThemeContextType | undefined>(undefined);

interface SimpleThemeProviderProps {
  children: ReactNode;
}

export const SimpleThemeProvider: React.FC<SimpleThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value: SimpleThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <SimpleThemeContext.Provider value={value}>
      <div style={{
        backgroundColor: theme === 'dark' ? '#1a1917' : '#ffffff',
        color: theme === 'dark' ? '#f5f5f4' : '#1a1917',
        minHeight: '100vh'
      }}>
        {children}
      </div>
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
