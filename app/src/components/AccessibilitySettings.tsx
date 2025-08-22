import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { 
  Sun, 
  Moon, 
  Eye, 
  Type, 
  Zap, 
  Settings as SettingsIcon,
  X,
  Check
} from 'lucide-react';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { 
    theme, 
    setTheme, 
    reducedMotion, 
    setReducedMotion, 
    fontSize, 
    setFontSize,
    isHighContrast 
  } = useTheme();

  const dialogRef = useRef<HTMLDivElement>(null);
  const [previousFocus, setPreviousFocus] = useState<HTMLElement | null>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      setPreviousFocus(document.activeElement as HTMLElement);
      // Focus the dialog
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 100);
    } else if (previousFocus) {
      previousFocus.focus();
    }
  }, [isOpen, previousFocus]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[1040]"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-settings-title"
        aria-describedby="accessibility-settings-description"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
                   w-full max-w-md mx-4 z-[1050] max-h-[90vh] overflow-y-auto"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 
              id="accessibility-settings-title"
              className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <SettingsIcon className="w-5 h-5" aria-hidden="true" />
              Accessibility Settings
            </h2>
            <p 
              id="accessibility-settings-description"
              className="text-sm text-gray-600 dark:text-gray-400 mt-1"
            >
              Customize your viewing experience
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Theme Preference
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-lg border-2 transition-all duration-200 
                           flex items-center gap-2 text-sm font-medium
                           ${theme === 'light' 
                             ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                             : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                           }`}
                aria-pressed={theme === 'light'}
              >
                <Sun className="w-4 h-4" aria-hidden="true" />
                Light
                {theme === 'light' && <Check className="w-4 h-4 ml-auto" aria-hidden="true" />}
              </button>
              
              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-lg border-2 transition-all duration-200 
                           flex items-center gap-2 text-sm font-medium
                           ${theme === 'dark' 
                             ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                             : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                           }`}
                aria-pressed={theme === 'dark'}
              >
                <Moon className="w-4 h-4" aria-hidden="true" />
                Dark
                {theme === 'dark' && <Check className="w-4 h-4 ml-auto" aria-hidden="true" />}
              </button>
              
              <button
                onClick={() => setTheme('high-contrast')}
                className={`p-3 rounded-lg border-2 transition-all duration-200 
                           flex items-center gap-2 text-sm font-medium col-span-2
                           ${theme === 'high-contrast' 
                             ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                             : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                           }`}
                aria-pressed={theme === 'high-contrast'}
              >
                <Eye className="w-4 h-4" aria-hidden="true" />
                High Contrast
                {theme === 'high-contrast' && <Check className="w-4 h-4 ml-auto" aria-hidden="true" />}
              </button>
              
              <button
                onClick={() => setTheme('high-contrast-dark')}
                className={`p-3 rounded-lg border-2 transition-all duration-200 
                           flex items-center gap-2 text-sm font-medium col-span-2
                           ${theme === 'high-contrast-dark' 
                             ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                             : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                           }`}
                aria-pressed={theme === 'high-contrast-dark'}
              >
                <Eye className="w-4 h-4" aria-hidden="true" />
                High Contrast Dark
                {theme === 'high-contrast-dark' && <Check className="w-4 h-4 ml-auto" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Font Size
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['normal', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 
                             flex flex-col items-center gap-1 text-sm font-medium
                             ${fontSize === size 
                               ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                               : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                             }`}
                  aria-pressed={fontSize === size}
                >
                  <Type 
                    className={`${size === 'normal' ? 'w-4 h-4' : size === 'large' ? 'w-5 h-5' : 'w-6 h-6'}`} 
                    aria-hidden="true" 
                  />
                  <span className="capitalize">{size.replace('-', ' ')}</span>
                  {fontSize === size && <Check className="w-3 h-3" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </div>

          {/* Motion Preference */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Motion Preference
            </h3>
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Reduce Motion
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Minimize animations and transitions
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                role="switch"
                aria-checked={reducedMotion}
                aria-labelledby="reduce-motion-label"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                           ${reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out 
                             ${reducedMotion ? 'translate-x-6' : 'translate-x-1'}`}
                />
                <span className="sr-only">
                  {reducedMotion ? 'Disable' : 'Enable'} reduced motion
                </span>
              </button>
            </div>
          </div>

          {/* Keyboard Navigation Info */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Keyboard Navigation
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li><kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">Tab</kbd> - Navigate forward</li>
              <li><kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">Shift + Tab</kbd> - Navigate backward</li>
              <li><kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">Enter/Space</kbd> - Activate buttons</li>
              <li><kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">Escape</kbd> - Close dialogs</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                       font-medium transition-colors duration-200 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default AccessibilitySettings;
