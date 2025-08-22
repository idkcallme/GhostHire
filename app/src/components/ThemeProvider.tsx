import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast' | 'high-contrast-dark';
type ReducedMotion = boolean;
type FontSize = 'normal' | 'large' | 'extra-large';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  reducedMotion: ReducedMotion;
  setReducedMotion: (reduced: ReducedMotion) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  toggleTheme: () => void;
  isHighContrast: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('ghosthire-theme') as Theme;
    const savedReducedMotion = localStorage.getItem('ghosthire-reduced-motion') === 'true';
    const savedFontSize = (localStorage.getItem('ghosthire-font-size') as FontSize) || 'normal';

    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Check system preferences
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      
      if (prefersHighContrast) {
        setThemeState(prefersDark ? 'high-contrast-dark' : 'high-contrast');
      } else {
        setThemeState(prefersDark ? 'dark' : 'light');
      }
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(savedReducedMotion || prefersReducedMotion);
    
    setFontSize(savedFontSize);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('ghosthire-theme');
      if (!savedTheme) {
        const prefersDark = mediaQuery.matches;
        const prefersHighContrast = contrastQuery.matches;
        
        if (prefersHighContrast) {
          setThemeState(prefersDark ? 'high-contrast-dark' : 'high-contrast');
        } else {
          setThemeState(prefersDark ? 'dark' : 'light');
        }
      }
    };

    const handleMotionChange = () => {
      const savedMotion = localStorage.getItem('ghosthire-reduced-motion');
      if (!savedMotion) {
        setReducedMotion(motionQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    contrastQuery.addEventListener('change', handleThemeChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
      contrastQuery.removeEventListener('change', handleThemeChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply font size class
    document.documentElement.className = document.documentElement.className
      .replace(/font-size-\w+/g, '')
      .concat(` font-size-${fontSize}`)
      .trim();

    // Apply reduced motion class
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [theme, fontSize, reducedMotion]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('ghosthire-theme', newTheme);
    
    // Announce theme change to screen readers
    const announcement = `Theme changed to ${newTheme.replace('-', ' ')} mode`;
    announceToScreenReader(announcement);
  };

  const setReducedMotionState = (reduced: ReducedMotion) => {
    setReducedMotion(reduced);
    localStorage.setItem('ghosthire-reduced-motion', reduced.toString());
    
    const announcement = `Motion ${reduced ? 'reduced' : 'enabled'}`;
    announceToScreenReader(announcement);
  };

  const setFontSizeState = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('ghosthire-font-size', size);
    
    const announcement = `Font size changed to ${size}`;
    announceToScreenReader(announcement);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'high-contrast', 'high-contrast-dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const isHighContrast = theme.includes('high-contrast');

  const value: ThemeContextType = {
    theme,
    setTheme,
    reducedMotion,
    setReducedMotion: setReducedMotionState,
    fontSize,
    setFontSize: setFontSizeState,
    toggleTheme,
    isHighContrast,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {/* Accessibility announcement region */}
      <div
        id="accessibility-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Utility function to announce changes to screen readers
function announceToScreenReader(message: string) {
  const announcer = document.getElementById('accessibility-announcements');
  if (announcer) {
    announcer.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
}

// CSS classes for font sizes
const fontSizeStyles = `
.font-size-normal {
  font-size: 1rem;
}

.font-size-large {
  font-size: 1.125rem;
}

.font-size-extra-large {
  font-size: 1.25rem;
}

.reduced-motion *,
.reduced-motion *::before,
.reduced-motion *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}
`;

// Inject font size styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = fontSizeStyles;
  document.head.appendChild(styleElement);
}