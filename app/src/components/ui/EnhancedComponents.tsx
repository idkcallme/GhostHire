import React, { useState, useRef, useEffect } from 'react';
import { designTokens, getButtonStyles, getCardStyles, getInputStyles } from '../../design/tokens';

// Enhanced Button Component with Accessibility
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  icon
}) => {
  const styles = getButtonStyles(variant, size);
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      style={{
        ...styles,
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer'
      }}
    >
      {loading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
};

// Enhanced Card Component
interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  padding = 'md',
  className = '',
  onClick,
  tabIndex,
  role,
  'aria-label': ariaLabel
}) => {
  const paddingMap = {
    sm: designTokens.spacing[4],
    md: designTokens.spacing[6],
    lg: designTokens.spacing[8]
  };

  const cardStyles = {
    ...getCardStyles(elevated),
    padding: paddingMap[padding],
    cursor: onClick ? 'pointer' : 'default'
  };

  return (
    <div
      className={className}
      style={cardStyles}
      onClick={onClick}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
};

// Enhanced Input Component with Accessibility
interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helper?: string;
  id?: string;
  autoComplete?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helper,
  id,
  autoComplete
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helper ? `${inputId}-helper` : undefined;

  return (
    <div style={{ marginBottom: designTokens.spacing[4] }}>
      <label
        htmlFor={inputId}
        style={{
          display: 'block',
          fontSize: designTokens.typography.fontSize.sm,
          fontWeight: designTokens.typography.fontWeight.medium,
          color: designTokens.colors.neutral[900],
          marginBottom: designTokens.spacing[1]
        }}
      >
        {label}
        {required && (
          <span
            style={{ color: designTokens.colors.semantic.error, marginLeft: '4px' }}
            aria-label="required"
          >
            *
          </span>
        )}
      </label>
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
        style={getInputStyles(!!error)}
      />
      
      {error && (
        <div
          id={errorId}
          role="alert"
          style={{
            marginTop: designTokens.spacing[1],
            fontSize: designTokens.typography.fontSize.sm,
            color: designTokens.colors.semantic.error
          }}
        >
          {error}
        </div>
      )}
      
      {helper && !error && (
        <div
          id={helperId}
          style={{
            marginTop: designTokens.spacing[1],
            fontSize: designTokens.typography.fontSize.sm,
            color: designTokens.colors.neutral[500]
          }}
        >
          {helper}
        </div>
      )}
    </div>
  );
};

// Enhanced Modal Component with Focus Management
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const sizeMap = {
    sm: '400px',
    md: '500px',
    lg: '700px',
    xl: '900px'
  };

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: designTokens.zIndex.modal,
        padding: designTokens.spacing[4]
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        style={{
          backgroundColor: designTokens.colors.neutral[0],
          borderRadius: designTokens.borderRadius['2xl'],
          boxShadow: designTokens.boxShadow['2xl'],
          width: '100%',
          maxWidth: sizeMap[size],
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div
          style={{
            padding: designTokens.spacing[6],
            borderBottom: `1px solid ${designTokens.colors.neutral[200]}`
          }}
        >
          <h2
            id="modal-title"
            style={{
              margin: 0,
              fontSize: designTokens.typography.fontSize['2xl'],
              fontWeight: designTokens.typography.fontWeight.semibold,
              color: designTokens.colors.neutral[900]
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: designTokens.spacing[4],
              right: designTokens.spacing[4],
              background: 'none',
              border: 'none',
              fontSize: designTokens.typography.fontSize['2xl'],
              cursor: 'pointer',
              color: designTokens.colors.neutral[500],
              padding: designTokens.spacing[2],
              borderRadius: designTokens.borderRadius.md
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ padding: designTokens.spacing[6] }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: '16px',
    md: '24px',
    lg: '32px'
  };

  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: '2px solid transparent',
        borderTop: `2px solid ${designTokens.colors.primary[500]}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
  );
};

// Toast Notification Component
interface ToastProps {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, isVisible, onClose }) => {
  const typeColors = {
    success: designTokens.colors.semantic.success,
    warning: designTokens.colors.semantic.warning,
    error: designTokens.colors.semantic.error,
    info: designTokens.colors.semantic.info
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        top: designTokens.spacing[4],
        right: designTokens.spacing[4],
        backgroundColor: designTokens.colors.neutral[0],
        border: `1px solid ${typeColors[type]}`,
        borderRadius: designTokens.borderRadius.lg,
        padding: designTokens.spacing[4],
        boxShadow: designTokens.boxShadow.lg,
        zIndex: designTokens.zIndex.toast,
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[2] }}>
        <div
          style={{
            width: '4px',
            height: '20px',
            backgroundColor: typeColors[type],
            borderRadius: designTokens.borderRadius.full
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: designTokens.typography.fontSize.sm,
            color: designTokens.colors.neutral[900]
          }}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          aria-label="Close notification"
          style={{
            background: 'none',
            border: 'none',
            fontSize: designTokens.typography.fontSize.lg,
            cursor: 'pointer',
            color: designTokens.colors.neutral[500],
            marginLeft: 'auto'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};
