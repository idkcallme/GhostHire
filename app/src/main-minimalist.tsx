// GhostHire - Minimalist Design Inspired by CodePen
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';

// Enhanced CSS-in-JS for better performance and animations
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: clamp(14px, 1.2vw, 18px);
    scroll-behavior: smooth;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background: #fafafa;
    overflow-x: hidden;
  }
  
  .fade-in {
    animation: fadeIn 0.8s ease-out forwards;
    opacity: 0;
  }
  
  @keyframes fadeIn {
    to { opacity: 1; }
  }
  
  .slide-up {
    animation: slideUp 0.6s ease-out forwards;
    transform: translateY(30px);
    opacity: 0;
  }
  
  @keyframes slideUp {
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Loading Component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: '16px',
    md: '32px',
    lg: '48px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: sizeClasses[size],
        height: sizeClasses[size],
        border: '2px solid #f0f0f0',
        borderTop: '2px solid #1a1a1a',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Toast Component
const Toast: React.FC = () => {
  const { state, hideToast } = useApp();
  const { toast } = state;

  if (!toast.show) return null;

  const bgColors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      zIndex: 1000,
      maxWidth: '400px',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: bgColors[toast.type],
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{toast.message}</span>
        <button 
          onClick={hideToast}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          ×
        </button>
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Minimalist Header inspired by the CodePen
const Header: React.FC = () => {
  const { state, logout, toggleModal } = useApp();
  const { user, isAuthenticated, unreadCount } = state;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home', public: true },
    { path: '/jobs', label: 'Opportunities', public: true, count: null },
    { path: '/applications', label: 'Applications', public: false, count: unreadCount },
    { path: '/post-job', label: 'Post', public: false },
    { path: '/profile', label: 'Profile', public: false }
  ];

  return (
    <>
      <style>{globalStyles}</style>
      <header style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(250, 250, 250, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(26, 26, 26, 0.08)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo with circles inspired by the CodePen */}
          <Link to="/" style={{ 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#1a1a1a',
                animation: 'pulse 2s infinite'
              }} />
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#666',
                animation: 'pulse 2s infinite 0.5s'
              }} />
            </div>
            <span style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              color: '#1a1a1a',
              letterSpacing: '-0.02em'
            }}>
              GhostHire
            </span>
          </Link>

          {/* Navigation */}
          <nav>
            <ul style={{ 
              display: 'flex', 
              listStyle: 'none', 
              gap: '2.5rem', 
              alignItems: 'center',
              margin: 0,
              padding: 0
            }}>
              {navItems.map(item => {
                if (!item.public && !isAuthenticated) return null;
                
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      style={{
                        color: isActive ? '#1a1a1a' : '#666',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: isActive ? '600' : '400',
                        letterSpacing: '-0.01em',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#1a1a1a';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#666';
                      }}
                    >
                      {item.label}
                      {item.count && item.count > 0 && (
                        <sup style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '2px 6px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {item.count}
                        </sup>
                      )}
                      {isActive && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-8px',
                          left: '0',
                          right: '0',
                          height: '2px',
                          backgroundColor: '#1a1a1a',
                          borderRadius: '1px'
                        }} />
                      )}
                    </Link>
                  </li>
                );
              })}

              {/* Auth Section */}
              <li style={{ marginLeft: '1rem' }}>
                {isAuthenticated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}>
                      {user?.name || user?.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(26, 26, 26, 0.1)',
                        color: '#666',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#1a1a1a';
                        e.currentTarget.style.color = '#1a1a1a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(26, 26, 26, 0.1)';
                        e.currentTarget.style.color = '#666';
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => toggleModal('login', true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#1a1a1a'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => toggleModal('register', true)}
                      style={{
                        backgroundColor: '#1a1a1a',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                    >
                      Join
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </header>
    </>
  );
};

// Minimalist Modal Components
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }> = ({
  isOpen,
  onClose,
  children,
  title
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '2rem',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2.5rem',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <h2 style={{ 
            fontSize: '1.4rem', 
            fontWeight: '600', 
            color: '#1a1a1a',
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none',
              border: 'none',
              fontSize: '1.5rem', 
              color: '#666', 
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.color = '#1a1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#666';
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Form Input Component
const FormInput: React.FC<{
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}> = ({ label, type, value, onChange, placeholder, required }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <label style={{ 
      display: 'block', 
      marginBottom: '0.5rem', 
      fontSize: '0.9rem',
      fontWeight: '500', 
      color: '#1a1a1a',
      letterSpacing: '-0.01em'
    }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{
        width: '100%',
        padding: '0.875rem',
        border: '1px solid rgba(26, 26, 26, 0.1)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        backgroundColor: '#fafafa'
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#1a1a1a';
        e.currentTarget.style.backgroundColor = 'white';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(26, 26, 26, 0.1)';
        e.currentTarget.style.backgroundColor = '#fafafa';
      }}
    />
  </div>
);

// Login Modal
const LoginModal: React.FC = () => {
  const { state, login, toggleModal, clearAuthError } = useApp();
  const [formData, setFormData] = React.useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      toggleModal('login', false);
      setFormData({ email: '', password: '' });
    }
  };

  const handleClose = () => {
    toggleModal('login', false);
    clearAuthError();
    setFormData({ email: '', password: '' });
  };

  return (
    <Modal isOpen={state.modals.login} onClose={handleClose} title="Welcome back">
      {state.authError && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          color: '#dc2626', 
          padding: '0.875rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          border: '1px solid #fecaca'
        }}>
          {state.authError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          placeholder="your@email.com"
          required
        />
        
        <FormInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
          placeholder="Enter your password"
          required
        />

        <button
          type="submit"
          disabled={state.isLoading}
          style={{
            width: '100%',
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '0.875rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: state.isLoading ? 'not-allowed' : 'pointer',
            opacity: state.isLoading ? 0.7 : 1,
            transition: 'all 0.3s ease',
            marginBottom: '1.5rem'
          }}
          onMouseEnter={(e) => {
            if (!state.isLoading) e.currentTarget.style.backgroundColor = '#333';
          }}
          onMouseLeave={(e) => {
            if (!state.isLoading) e.currentTarget.style.backgroundColor = '#1a1a1a';
          }}
        >
          {state.isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
        </button>
      </form>

      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        fontSize: '0.85rem',
        letterSpacing: '-0.01em'
      }}>
        New to GhostHire?{' '}
        <button
          onClick={() => {
            handleClose();
            toggleModal('register', true);
          }}
          style={{ 
            color: '#1a1a1a', 
            textDecoration: 'underline', 
            border: 'none', 
            background: 'none', 
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Join now
        </button>
      </p>
    </Modal>
  );
};

// Register Modal
const RegisterModal: React.FC = () => {
  const { state, register, toggleModal, clearAuthError } = useApp();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'job_seeker' as 'job_seeker' | 'employer'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });
    
    if (success) {
      toggleModal('register', false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'job_seeker' });
    }
  };

  const handleClose = () => {
    toggleModal('register', false);
    clearAuthError();
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'job_seeker' });
  };

  return (
    <Modal isOpen={state.modals.register} onClose={handleClose} title="Join GhostHire">
      {state.authError && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          color: '#dc2626', 
          padding: '0.875rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          border: '1px solid #fecaca'
        }}>
          {state.authError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="Your full name"
          required
        />

        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          placeholder="your@email.com"
          required
        />

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontSize: '0.9rem',
            fontWeight: '500', 
            color: '#1a1a1a'
          }}>
            I am a...
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'job_seeker' | 'employer' })}
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid rgba(26, 26, 26, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: '#fafafa'
            }}
          >
            <option value="job_seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        
        <FormInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
          placeholder="Create a password"
          required
        />

        <FormInput
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
          placeholder="Confirm your password"
          required
        />

        <button
          type="submit"
          disabled={state.isLoading}
          style={{
            width: '100%',
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '0.875rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: state.isLoading ? 'not-allowed' : 'pointer',
            opacity: state.isLoading ? 0.7 : 1,
            transition: 'all 0.3s ease',
            marginBottom: '1.5rem'
          }}
          onMouseEnter={(e) => {
            if (!state.isLoading) e.currentTarget.style.backgroundColor = '#333';
          }}
          onMouseLeave={(e) => {
            if (!state.isLoading) e.currentTarget.style.backgroundColor = '#1a1a1a';
          }}
        >
          {state.isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
        </button>
      </form>

      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        fontSize: '0.85rem' 
      }}>
        Already have an account?{' '}
        <button
          onClick={() => {
            handleClose();
            toggleModal('login', true);
          }}
          style={{ 
            color: '#1a1a1a', 
            textDecoration: 'underline', 
            border: 'none', 
            background: 'none', 
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Sign in
        </button>
      </p>
    </Modal>
  );
};

// Minimalist Home Page
const HomePage: React.FC = () => {
  const { state, toggleModal } = useApp();
  const navigate = useNavigate();

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section style={{
        padding: '6rem 2rem 4rem',
        maxWidth: '1400px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div className="slide-up">
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: '300', 
            marginBottom: '1.5rem',
            color: '#1a1a1a',
            letterSpacing: '-0.04em',
            lineHeight: '1.1'
          }}>
            Privacy-first professional networking
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            color: '#666',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Prove your qualifications without revealing sensitive data using zero-knowledge proofs. 
            Connect with employers who value your privacy.
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '4rem'
          }}>
            <button
              onClick={() => navigate('/jobs')}
              style={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '-0.01em'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
            >
              Explore Opportunities
            </button>
            {!state.isAuthenticated && (
              <button
                onClick={() => toggleModal('register', true)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#1a1a1a',
                  border: '1px solid rgba(26, 26, 26, 0.2)',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1a1a1a';
                  e.currentTarget.style.backgroundColor = '#1a1a1a';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(26, 26, 26, 0.2)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#1a1a1a';
                }}
              >
                Join GhostHire
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ 
        padding: '4rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {[
            {
              title: 'Zero-Knowledge Proofs',
              description: 'Verify qualifications without revealing personal information using cryptographic proofs.',
              icon: '🔒'
            },
            {
              title: 'Privacy by Design',
              description: 'Your data stays encrypted and private until you choose to share it.',
              icon: '🛡️'
            },
            {
              title: 'Smart Matching',
              description: 'AI-powered job matching based on verified skills and preferences.',
              icon: '🎯'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="slide-up"
              style={{
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid rgba(26, 26, 26, 0.08)',
                transition: 'all 0.3s ease',
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                marginBottom: '0.75rem', 
                color: '#1a1a1a',
                letterSpacing: '-0.02em'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                color: '#666', 
                lineHeight: '1.6',
                fontSize: '0.9rem'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '4rem 2rem 6rem',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
          fontWeight: '400', 
          marginBottom: '1rem',
          color: '#1a1a1a',
          letterSpacing: '-0.03em'
        }}>
          Ready to take control of your career?
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          marginBottom: '2rem', 
          color: '#666',
          lineHeight: '1.6'
        }}>
          Join thousands of professionals who value their privacy and quality opportunities.
        </p>
        {!state.isAuthenticated && (
          <button
            onClick={() => toggleModal('register', true)}
            style={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
          >
            Get Started — It's Free
          </button>
        )}
      </section>
    </div>
  );
};

// Enhanced Jobs Page with real API
const JobsPage: React.FC = () => {
  const { state, loadJobs, setJobFilters, applyToJob, toggleModal } = useApp();
  const { jobs, jobsLoading, jobFilters, totalJobs, isAuthenticated } = state;
  const navigate = useNavigate();

  React.useEffect(() => {
    loadJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs({ ...jobFilters, page: 1 });
  };

  const handleFilterChange = (field: keyof typeof jobFilters, value: string | number) => {
    setJobFilters({ [field]: value });
  };

  const handleApply = async (jobId: string) => {
    if (!isAuthenticated) {
      toggleModal('login', true);
      return;
    }

    const success = await applyToJob(jobId, {
      coverLetter: 'Applied through GhostHire platform',
      zkProof: null
    });

    if (success) {
      loadJobs();
    }
  };

  if (jobsLoading && jobs.length === 0) {
    return (
      <div style={{ 
        padding: '6rem 2rem', 
        textAlign: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <LoadingSpinner size="lg" />
        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
          Loading opportunities...
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '2rem' 
    }}>
      {/* Header */}
      <div className="slide-up" style={{ marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 4vw, 3rem)', 
          fontWeight: '400', 
          marginBottom: '0.5rem', 
          color: '#1a1a1a',
          letterSpacing: '-0.03em'
        }}>
          Opportunities
        </h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          {totalJobs} positions available
        </p>
      </div>

      {/* Search Section */}
      <div className="slide-up" style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '12px',
        border: '1px solid rgba(26, 26, 26, 0.08)',
        marginBottom: '3rem'
      }}>
        <form onSubmit={handleSearch} style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          alignItems: 'end' 
        }}>
          <FormInput
            label="Search"
            type="text"
            value={jobFilters.search}
            onChange={(value) => handleFilterChange('search', value)}
            placeholder="Job title, skills, company..."
          />
          
          <FormInput
            label="Location"
            type="text"
            value={jobFilters.location}
            onChange={(value) => handleFilterChange('location', value)}
            placeholder="City, remote..."
          />

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.9rem',
              fontWeight: '500', 
              color: '#1a1a1a'
            }}>
              Type
            </label>
            <select
              value={jobFilters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '1px solid rgba(26, 26, 26, 0.1)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                backgroundColor: '#fafafa'
              }}
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              padding: '0.875rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              height: 'fit-content',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
          >
            Search
          </button>
        </form>
      </div>

      {/* Job Listings */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className="slide-up"
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid rgba(26, 26, 26, 0.08)',
              transition: 'all 0.3s ease',
              animationDelay: `${index * 0.05}s`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'start', 
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '600', 
                  color: '#1a1a1a', 
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.02em'
                }}>
                  {job.title}
                </h3>
                <p style={{ 
                  color: '#1a1a1a', 
                  fontWeight: '500', 
                  marginBottom: '0.75rem',
                  fontSize: '0.95rem'
                }}>
                  {job.company}
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  fontSize: '0.85rem', 
                  color: '#666',
                  flexWrap: 'wrap'
                }}>
                  <span>📍 {job.location}</span>
                  <span>💼 {job.type}</span>
                  <span>💰 {job.salary}</span>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem', 
                alignItems: 'end',
                textAlign: 'right'
              }}>
                <span style={{ 
                  backgroundColor: job.status === 'open' ? '#10b981' : '#6b7280', 
                  color: 'white', 
                  padding: '0.3rem 0.75rem', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {job.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p style={{ 
              color: '#666', 
              marginBottom: '1.5rem', 
              lineHeight: '1.6',
              fontSize: '0.9rem'
            }}>
              {job.description.length > 200 ? 
                `${job.description.substring(0, 200)}...` : 
                job.description
              }
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              flexWrap: 'wrap', 
              marginBottom: '1.5rem' 
            }}>
              {job.requirements.slice(0, 4).map((req, reqIndex) => (
                <span
                  key={reqIndex}
                  style={{
                    backgroundColor: '#f8f9fa',
                    color: '#1a1a1a',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    border: '1px solid rgba(26, 26, 26, 0.08)'
                  }}
                >
                  {req}
                </span>
              ))}
              {job.requirements.length > 4 && (
                <span style={{ 
                  color: '#666', 
                  fontSize: '0.8rem',
                  alignSelf: 'center'
                }}>
                  +{job.requirements.length - 4} more
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/jobs/${job.id}`)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#1a1a1a',
                  border: '1px solid rgba(26, 26, 26, 0.2)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1a1a1a';
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(26, 26, 26, 0.2)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                View Details
              </button>
              
              <button
                onClick={() => handleApply(job.id)}
                style={{
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              >
                {isAuthenticated ? 'Apply with ZK Proof' : 'Sign In to Apply'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && !jobsLoading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          color: '#666' 
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ 
            fontSize: '1.3rem', 
            fontWeight: '500', 
            marginBottom: '0.75rem',
            color: '#1a1a1a'
          }}>
            No opportunities found
          </h3>
          <p style={{ fontSize: '0.9rem' }}>
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

// Placeholder pages with consistent design
const ApplicationsPage: React.FC = () => {
  const { state } = useApp();
  
  return (
    <div className="fade-in" style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '2rem' 
    }}>
      <h1 style={{ 
        fontSize: 'clamp(2rem, 4vw, 3rem)', 
        fontWeight: '400', 
        marginBottom: '3rem', 
        color: '#1a1a1a',
        letterSpacing: '-0.03em'
      }}>
        Applications
      </h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '3rem 2rem', 
        borderRadius: '12px', 
        textAlign: 'center',
        border: '1px solid rgba(26, 26, 26, 0.08)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
        <h3 style={{ 
          fontSize: '1.2rem', 
          fontWeight: '500', 
          marginBottom: '0.75rem',
          color: '#1a1a1a'
        }}>
          {state.applications.length === 0 ? 'No applications yet' : `${state.applications.length} applications`}
        </h3>
        <p style={{ 
          color: '#666', 
          fontSize: '0.9rem',
          lineHeight: '1.6'
        }}>
          Your job applications and their status will appear here with real-time updates.
        </p>
      </div>
    </div>
  );
};

const PostJobPage: React.FC = () => (
  <div className="fade-in" style={{ 
    maxWidth: '1400px', 
    margin: '0 auto', 
    padding: '2rem' 
  }}>
    <h1 style={{ 
      fontSize: 'clamp(2rem, 4vw, 3rem)', 
      fontWeight: '400', 
      marginBottom: '3rem', 
      color: '#1a1a1a',
      letterSpacing: '-0.03em'
    }}>
      Post Opportunity
    </h1>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '3rem 2rem', 
      borderRadius: '12px', 
      textAlign: 'center',
      border: '1px solid rgba(26, 26, 26, 0.08)'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
      <h3 style={{ 
        fontSize: '1.2rem', 
        fontWeight: '500', 
        marginBottom: '0.75rem',
        color: '#1a1a1a'
      }}>
        Job posting interface
      </h3>
      <p style={{ 
        color: '#666', 
        fontSize: '0.9rem',
        lineHeight: '1.6'
      }}>
        Complete job creation with ZK-proof requirements and candidate verification coming soon.
      </p>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const { state } = useApp();
  
  return (
    <div className="fade-in" style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '2rem' 
    }}>
      <h1 style={{ 
        fontSize: 'clamp(2rem, 4vw, 3rem)', 
        fontWeight: '400', 
        marginBottom: '3rem', 
        color: '#1a1a1a',
        letterSpacing: '-0.03em'
      }}>
        Profile
      </h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '12px',
        border: '1px solid rgba(26, 26, 26, 0.08)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            fontSize: '0.85rem', 
            fontWeight: '500', 
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Name
          </label>
          <p style={{ 
            fontSize: '1rem', 
            fontWeight: '500', 
            color: '#1a1a1a',
            marginTop: '0.25rem'
          }}>
            {state.user?.name}
          </p>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            fontSize: '0.85rem', 
            fontWeight: '500', 
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Email
          </label>
          <p style={{ 
            fontSize: '1rem', 
            fontWeight: '500', 
            color: '#1a1a1a',
            marginTop: '0.25rem'
          }}>
            {state.user?.email}
          </p>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            fontSize: '0.85rem', 
            fontWeight: '500', 
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Role
          </label>
          <p style={{ 
            fontSize: '1rem', 
            fontWeight: '500', 
            color: '#1a1a1a',
            marginTop: '0.25rem',
            textTransform: 'capitalize'
          }}>
            {state.user?.role === 'job_seeker' ? 'Job Seeker' : 'Employer'}
          </p>
        </div>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid rgba(26, 26, 26, 0.08)'
        }}>
          <p style={{ 
            color: '#666', 
            fontSize: '0.85rem',
            lineHeight: '1.6'
          }}>
            Enhanced profile management with ZK credentials, skill verification, and privacy controls coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer: React.FC = () => (
  <footer style={{ 
    backgroundColor: '#1a1a1a', 
    color: 'white', 
    padding: '3rem 2rem 2rem',
    marginTop: '6rem'
  }}>
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      textAlign: 'center' 
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'white'
        }} />
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#999'
        }} />
      </div>
      <p style={{ 
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
        fontWeight: '500'
      }}>
        GhostHire
      </p>
      <p style={{ 
        fontSize: '0.8rem', 
        color: '#999',
        letterSpacing: '-0.01em'
      }}>
        Privacy-first professional networking. Built for a more private future.
      </p>
    </div>
  </footer>
);

// Main App Component
const AppContent: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      
      <LoginModal />
      <RegisterModal />
      <Toast />
      <Footer />
    </div>
  );
};

// Root App Component
const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
