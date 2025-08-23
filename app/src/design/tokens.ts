// Design System Token Implementation
export const designTokens = {
  // Color System
  colors: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      500: '#6366f1',
      600: '#4f46e5',
      900: '#312e81'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    neutral: {
      0: '#ffffff',
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      500: '#6b7280',
      900: '#111827'
    }
  },
  
  // Typography Scale
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace"
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem'     // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  },
  
  // Spacing Scale (8pt grid)
  spacing: {
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem'      // 96px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },
  
  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  },
  
  // Animation
  transition: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms'
    },
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080
  }
};

// Component Styling Functions
export const getButtonStyles = (variant: 'primary' | 'secondary' | 'danger' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: designTokens.spacing[2],
    fontFamily: designTokens.typography.fontFamily.sans,
    fontWeight: designTokens.typography.fontWeight.medium as any,
    borderRadius: designTokens.borderRadius.lg,
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: `all ${designTokens.transition.duration.normal} ${designTokens.transition.timing}`,
    textDecoration: 'none',
    userSelect: 'none' as any
  };

  const sizeStyles = {
    sm: {
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
      fontSize: designTokens.typography.fontSize.xs
    },
    md: {
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
      fontSize: designTokens.typography.fontSize.sm
    },
    lg: {
      padding: `${designTokens.spacing[4]} ${designTokens.spacing[8]}`,
      fontSize: designTokens.typography.fontSize.base
    }
  };

  const variantStyles = {
    primary: {
      backgroundColor: designTokens.colors.primary[500],
      color: designTokens.colors.neutral[0],
      borderColor: designTokens.colors.primary[500]
    },
    secondary: {
      backgroundColor: 'transparent',
      color: designTokens.colors.neutral[900],
      borderColor: designTokens.colors.neutral[300]
    },
    danger: {
      backgroundColor: designTokens.colors.semantic.error,
      color: designTokens.colors.neutral[0],
      borderColor: designTokens.colors.semantic.error
    }
  };

  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant]
  } as React.CSSProperties;
};

export const getCardStyles = (elevated: boolean = false): React.CSSProperties => ({
  backgroundColor: designTokens.colors.neutral[0],
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.xl,
  boxShadow: elevated ? designTokens.boxShadow.lg : designTokens.boxShadow.sm,
  overflow: 'hidden',
  transition: `all ${designTokens.transition.duration.normal} ${designTokens.transition.timing}`
});

export const getInputStyles = (hasError: boolean = false): React.CSSProperties => ({
  width: '100%',
  padding: designTokens.spacing[3],
  fontSize: designTokens.typography.fontSize.base,
  border: `2px solid ${hasError ? designTokens.colors.semantic.error : designTokens.colors.neutral[300]}`,
  borderRadius: designTokens.borderRadius.lg,
  backgroundColor: designTokens.colors.neutral[0],
  color: designTokens.colors.neutral[900],
  transition: `all ${designTokens.transition.duration.normal} ${designTokens.transition.timing}`
});
