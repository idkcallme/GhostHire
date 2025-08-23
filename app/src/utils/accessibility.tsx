import React from 'react';

// Accessibility Testing and Validation Utilities
export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: string;
  issue: string;
  suggestion: string;
  wcagGuideline?: string;
}

export class AccessibilityValidator {
  private issues: AccessibilityIssue[] = [];

  // Check for common accessibility issues
  validatePage(): AccessibilityIssue[] {
    this.issues = [];
    
    // Check for missing alt text on images
    this.checkImageAltText();
    
    // Check for proper heading hierarchy
    this.checkHeadingHierarchy();
    
    // Check for keyboard navigation
    this.checkKeyboardNavigation();
    
    // Check for color contrast
    this.checkColorContrast();
    
    // Check for form labels
    this.checkFormLabels();
    
    // Check for focus management
    this.checkFocusManagement();
    
    // Check for ARIA attributes
    this.checkAriaAttributes();
    
    return this.issues;
  }

  private checkImageAltText() {
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('aria-labelledby')) {
        this.issues.push({
          type: 'error',
          element: `Image #${index + 1}`,
          issue: 'Missing alt text',
          suggestion: 'Add descriptive alt text or aria-label for screen readers',
          wcagGuideline: 'WCAG 2.1 - 1.1.1 Non-text Content'
        });
      }
    });
  }

  private checkHeadingHierarchy() {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    
    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && currentLevel !== 1) {
        this.issues.push({
          type: 'warning',
          element: `${heading.tagName} - "${heading.textContent?.substring(0, 30)}..."`,
          issue: 'Page should start with h1',
          suggestion: 'Use h1 for the main page title',
          wcagGuideline: 'WCAG 2.1 - 2.4.6 Headings and Labels'
        });
      }
      
      if (currentLevel > previousLevel + 1) {
        this.issues.push({
          type: 'warning',
          element: `${heading.tagName} - "${heading.textContent?.substring(0, 30)}..."`,
          issue: 'Heading level skipped',
          suggestion: 'Maintain proper heading hierarchy (don\'t skip levels)',
          wcagGuideline: 'WCAG 2.1 - 2.4.6 Headings and Labels'
        });
      }
      
      previousLevel = currentLevel;
    });
  }

  private checkKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
      if (element.getAttribute('tabindex') === '-1' && element.tagName !== 'DIV') {
        this.issues.push({
          type: 'warning',
          element: `${element.tagName.toLowerCase()} #${index + 1}`,
          issue: 'Interactive element not keyboard accessible',
          suggestion: 'Remove tabindex="-1" or add keyboard event handlers',
          wcagGuideline: 'WCAG 2.1 - 2.1.1 Keyboard'
        });
      }
    });
  }

  private checkColorContrast() {
    // This is a simplified check - in practice, you'd use a more sophisticated algorithm
    const elements = document.querySelectorAll('p, span, div, button, a');
    
    elements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);
      const fontWeight = styles.fontWeight;
      
      // Check if text might have contrast issues (simplified)
      if (fontSize < 14 || (fontSize < 18 && fontWeight < '600')) {
        const textColor = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        if (textColor === backgroundColor || 
            (textColor === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)')) {
          this.issues.push({
            type: 'warning',
            element: `${element.tagName.toLowerCase()} #${index + 1}`,
            issue: 'Potential color contrast issue',
            suggestion: 'Ensure text has sufficient contrast ratio (4.5:1 for normal text)',
            wcagGuideline: 'WCAG 2.1 - 1.4.3 Contrast (Minimum)'
          });
        }
      }
    });
  }

  private checkFormLabels() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach((input, index) => {
      const id = input.id;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      
      if (!label && !ariaLabel && !ariaLabelledBy) {
        this.issues.push({
          type: 'error',
          element: `${input.tagName.toLowerCase()} #${index + 1}`,
          issue: 'Form control missing label',
          suggestion: 'Add a label element, aria-label, or aria-labelledby attribute',
          wcagGuideline: 'WCAG 2.1 - 3.3.2 Labels or Instructions'
        });
      }
    });
  }

  private checkFocusManagement() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach((button, index) => {
      if (!button.getAttribute('aria-label') && !button.textContent?.trim()) {
        this.issues.push({
          type: 'error',
          element: `button #${index + 1}`,
          issue: 'Button has no accessible name',
          suggestion: 'Add text content or aria-label to describe the button\'s purpose',
          wcagGuideline: 'WCAG 2.1 - 4.1.2 Name, Role, Value'
        });
      }
    });
  }

  private checkAriaAttributes() {
    const elementsWithRole = document.querySelectorAll('[role]');
    
    elementsWithRole.forEach((element, index) => {
      const role = element.getAttribute('role');
      
      // Check for specific role requirements
      if (role === 'dialog' && !element.getAttribute('aria-labelledby') && !element.getAttribute('aria-label')) {
        this.issues.push({
          type: 'error',
          element: `${element.tagName.toLowerCase()}[role="dialog"] #${index + 1}`,
          issue: 'Dialog missing accessible name',
          suggestion: 'Add aria-labelledby pointing to dialog title or aria-label',
          wcagGuideline: 'WCAG 2.1 - 4.1.2 Name, Role, Value'
        });
      }
      
      if (role === 'button' && !element.getAttribute('aria-label') && !element.textContent?.trim()) {
        this.issues.push({
          type: 'error',
          element: `${element.tagName.toLowerCase()}[role="button"] #${index + 1}`,
          issue: 'Button role missing accessible name',
          suggestion: 'Add text content or aria-label',
          wcagGuideline: 'WCAG 2.1 - 4.1.2 Name, Role, Value'
        });
      }
    });
  }
}

// Accessibility hooks for React components
export const useAccessibilityAnnouncement = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };
  
  return { announce };
};

export const useFocusTrap = (isActive: boolean) => {
  const focusTrapRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (!isActive || !focusTrapRef.current) return;
    
    const focusableElements = focusTrapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);
  
  return focusTrapRef;
};

// Accessibility testing component
export const AccessibilityTester: React.FC = () => {
  const [issues, setIssues] = React.useState<AccessibilityIssue[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  
  const runAccessibilityTest = () => {
    const validator = new AccessibilityValidator();
    const foundIssues = validator.validatePage();
    setIssues(foundIssues);
    setShowResults(true);
  };
  
  const getIssueColor = (type: string) => {
    switch (type) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };
  
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 1000,
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px'
    }}>
      <button
        onClick={runAccessibilityTest}
        style={{
          backgroundColor: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        Run A11y Test
      </button>
      
      {showResults && (
        <div style={{ marginTop: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
            Accessibility Report ({issues.length} issues)
          </h4>
          
          {issues.length === 0 ? (
            <p style={{ color: '#10b981', margin: 0, fontSize: '14px' }}>
              ✅ No accessibility issues found!
            </p>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {issues.map((issue, index) => (
                <div
                  key={index}
                  style={{
                    borderLeft: `4px solid ${getIssueColor(issue.type)}`,
                    paddingLeft: '12px',
                    marginBottom: '12px',
                    paddingBottom: '8px'
                  }}
                >
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600',
                    color: getIssueColor(issue.type),
                    textTransform: 'uppercase'
                  }}>
                    {issue.type}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500', margin: '4px 0' }}>
                    {issue.element}: {issue.issue}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {issue.suggestion}
                  </div>
                  {issue.wcagGuideline && (
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                      {issue.wcagGuideline}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={() => setShowResults(false)}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              marginTop: '8px'
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
