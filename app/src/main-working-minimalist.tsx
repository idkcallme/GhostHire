// GhostHire - Working Minimalist Design with API Integration
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

// Import the API client and JobDetailsPage
import { apiClient } from './services/apiClient';
import JobDetailsPage from './pages/JobDetailsPage';

console.log("🚀 Loading GhostHire with Minimalist Design + API...");

// Simple state management without complex context
const useSimpleState = () => {
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);

  return {
    user, setUser,
    isAuthenticated, setIsAuthenticated,
    jobs, setJobs,
    loading, setLoading,
    showLoginModal, setShowLoginModal,
    showRegisterModal, setShowRegisterModal
  };
};

// Global styles for consistency and accessibility
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #fafafa;
      overflow-x: hidden;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    /* Allow text selection only for content areas */
    p, .content-text, input, textarea {
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
    
    /* Prevent text cursor on buttons and links */
    button, a, .no-select {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
    }
    
    /* Skip link for accessibility */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 6px;
      background: #1a1a1a;
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.2s;
    }
    
    .skip-link:focus {
      top: 6px;
    }
    
    /* Focus indicators */
    button:focus, input:focus, textarea:focus, select:focus {
      outline: 2px solid #1a1a1a;
      outline-offset: 2px;
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      body {
        background: #ffffff;
        color: #000000;
      }
      
      button, .card {
        border: 2px solid #000000;
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .fade-in, .slide-up, .pulse, * {
        animation: none !important;
        transition: none !important;
      }
    }
    
    .fade-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    
    .slide-up { animation: slideUp 0.6s ease-out; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    
    .pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    
    /* Screen reader only content */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `}</style>
);

// Minimalist Header Component
const Header = ({ state, setState }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', public: true },
    { path: '/jobs', label: 'Opportunities', public: true },
    { path: '/applications', label: 'Applications', public: false },
    { path: '/profile', label: 'Profile', public: false }
  ];

  const logout = () => {
    setState(prev => ({ 
      ...prev, 
      user: null, 
      isAuthenticated: false 
    }));
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(250, 250, 250, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(26, 26, 26, 0.08)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
          aria-label="GhostHire - Go to homepage"
        >
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} aria-hidden="true">
            <div className="pulse" style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#1a1a1a'
            }} />
            <div className="pulse" style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#666',
              animationDelay: '0.5s'
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
        <nav role="navigation" aria-label="Main navigation">
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            {navItems.map(item => {
              if (!item.public && !state.isAuthenticated) return null;
              
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
                      transition: 'color 0.3s ease',
                      position: 'relative',
                      padding: '0.5rem',
                      borderRadius: '4px'
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid #1a1a1a';
                      e.currentTarget.style.outlineOffset = '2px';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = 'none';
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '0',
                        right: '0',
                        height: '2px',
                        backgroundColor: '#1a1a1a',
                        borderRadius: '1px'
                      }} aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Auth Buttons */}
            <li style={{ marginLeft: '1rem' }}>
              {state.isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#666', fontSize: '0.85rem' }}>
                    {state.user?.name || state.user?.email}
                  </span>
                  <button
                    onClick={logout}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(26, 26, 26, 0.1)',
                      color: '#666',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setState(prev => ({ ...prev, showLoginModal: true }))}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setState(prev => ({ ...prev, showRegisterModal: true }))}
                    style={{
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    Join
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
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
      padding: '2rem'
    }}>
      <div className="fade-in" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2.5rem',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
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
            color: '#1a1a1a'
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
              borderRadius: '4px'
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

// Login Modal
const LoginModal = ({ state, setState }) => {
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.login(formData);
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          user: response.data.user,
          isAuthenticated: true,
          showLoginModal: false
        }));
        setFormData({ email: '', password: '' });
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setState(prev => ({ ...prev, showLoginModal: false }));
    setError('');
    setFormData({ email: '', password: '' });
  };

  return (
    <Modal 
      isOpen={state.showLoginModal} 
      onClose={handleClose} 
      title="Welcome back"
    >
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '0.875rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#1a1a1a'
          }}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your@email.com"
            required
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid rgba(26, 26, 26, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: '#fafafa'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#1a1a1a'
          }}>
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter your password"
            required
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid rgba(26, 26, 26, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: '#fafafa'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '0.875rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: '1.5rem'
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p style={{
        textAlign: 'center',
        color: '#666',
        fontSize: '0.85rem'
      }}>
        New to GhostHire?{' '}
        <button
          onClick={() => {
            handleClose();
            setState(prev => ({ ...prev, showRegisterModal: true }));
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
const RegisterModal = ({ state, setState }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'job_seeker'
  });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.register(formData);
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          user: response.data.user,
          isAuthenticated: true,
          showRegisterModal: false
        }));
        setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'job_seeker' });
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setState(prev => ({ ...prev, showRegisterModal: false }));
    setError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'job_seeker' });
  };

  return (
    <Modal 
      isOpen={state.showRegisterModal} 
      onClose={handleClose} 
      title="Join GhostHire"
    >
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '0.875rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Full name"
            required
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid rgba(26, 26, 26, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: '#fafafa'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email address"
            required
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid rgba(26, 26, 26, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: '#fafafa'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <select
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
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

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Create password"
            required
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid rgba(26, 26, 26, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: '#fafafa'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirm password"
            required
            style={{
              width: '100%',
              padding: '0.875rem',
              border: '1px solid rgba(26, 26, 26, 0.1)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: '#fafafa'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '0.875rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: '1.5rem'
          }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
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
            setState(prev => ({ ...prev, showLoginModal: true }));
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

// Home Page
const HomePage = ({ state, setState }) => {
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
            lineHeight: '1.6'
          }} className="content-text">
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
                transition: 'background-color 0.3s ease'
              }}
            >
              Explore Opportunities
            </button>
            {!state.isAuthenticated && (
              <button
                onClick={() => setState(prev => ({ ...prev, showRegisterModal: true }))}
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
              >
                Join GhostHire
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '4rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              title: 'Zero-Knowledge Proofs',
              description: 'Verify qualifications without revealing personal information.',
              icon: '●'
            },
            {
              title: 'Privacy by Design',
              description: 'Your data stays encrypted until you choose to share it.',
              icon: '◆'
            },
            {
              title: 'Smart Matching',
              description: 'AI-powered job matching based on verified skills.',
              icon: '▲'
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
                transition: 'transform 0.3s ease',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: 'bold' }}>{feature.icon}</div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                color: '#1a1a1a'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                fontSize: '0.9rem'
              }} className="content-text">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Jobs Page
const JobsPage = ({ state, setState }) => {
  const navigate = useNavigate();
  const [localJobs, setLocalJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await apiClient.getJobs();
        if (response.success && response.data) {
          setLocalJobs(response.data.jobs || []);
        }
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  if (loading) {
    return (
      <div style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f0f0f0',
          borderTop: '4px solid #1a1a1a',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: '#666' }}>Loading opportunities...</p>
      </div>
    );
  }

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
        Opportunities
      </h1>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {localJobs.length > 0 ? localJobs.map((job, index) => (
          <div
            key={job.id}
            className="slide-up"
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid rgba(26, 26, 26, 0.08)',
              transition: 'all 0.3s ease',
              animationDelay: `${index * 0.05}s`,
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/jobs/${job.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '0.5rem'
            }}>
              {job.title}
            </h3>
            <p style={{
              color: '#1a1a1a',
              fontWeight: '500',
              marginBottom: '0.75rem'
            }}>
              {job.company}
            </p>
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              fontSize: '0.85rem',
              color: '#666',
              flexWrap: 'wrap',
              marginBottom: '1rem'
            }}>
              <span>◐ {job.location}</span>
              <span>◑ {job.type}</span>
              <span>◒ {job.salary}</span>
            </div>
            <p style={{
              color: '#666',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }} className="content-text">
              {job.description.length > 200 
                ? `${job.description.substring(0, 200)}...`
                : job.description
              }
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '0.8rem',
                color: '#666',
                backgroundColor: '#f5f5f5',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px'
              }}>
                🔒 ZK Privacy
              </span>
              <span style={{
                fontSize: '0.85rem',
                color: '#1a1a1a',
                fontWeight: '500'
              }}>
                View Details →
              </span>
            </div>
          </div>
        )) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid rgba(26, 26, 26, 0.08)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1a1a1a' }}>◇</div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '500',
              marginBottom: '0.75rem',
              color: '#1a1a1a'
            }}>
              No opportunities yet
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Job listings will appear here when the backend is connected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple placeholder pages
const ApplicationsPage = () => (
  <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '400', marginBottom: '3rem', color: '#1a1a1a' }}>
      Applications
    </h1>
    <div style={{ backgroundColor: 'white', padding: '3rem 2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(26, 26, 26, 0.08)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1a1a1a' }}>◈</div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.75rem', color: '#1a1a1a' }}>No applications yet</h3>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>Your job applications will appear here.</p>
    </div>
  </div>
);

const ProfilePage = ({ state }) => (
  <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '400', marginBottom: '3rem', color: '#1a1a1a' }}>
      Profile
    </h1>
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(26, 26, 26, 0.08)' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#666', textTransform: 'uppercase' }}>Name</label>
        <p style={{ fontSize: '1rem', fontWeight: '500', color: '#1a1a1a', marginTop: '0.25rem' }}>
          {state.user?.name || 'Not signed in'}
        </p>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#666', textTransform: 'uppercase' }}>Email</label>
        <p style={{ fontSize: '1rem', fontWeight: '500', color: '#1a1a1a', marginTop: '0.25rem' }}>
          {state.user?.email || 'Not signed in'}
        </p>
      </div>
    </div>
  </div>
);

// Main App
const App = () => {
  const state = useSimpleState();
  const [appState, setAppState] = React.useState({
    user: null,
    isAuthenticated: false,
    jobs: [],
    loading: false,
    showLoginModal: false,
    showRegisterModal: false
  });

  return (
    <Router>
      <GlobalStyles />
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <Header state={appState} setState={setAppState} />
        
        <main id="main-content" role="main">
          <Routes>
            <Route path="/" element={<HomePage state={appState} setState={setAppState} />} />
            <Route path="/jobs" element={<JobsPage state={appState} setState={setAppState} />} />
            <Route path="/jobs/:jobId" element={<JobDetailsPage state={appState} setState={setAppState} />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/profile" element={<ProfilePage state={appState} />} />
          </Routes>
        </main>

        <LoginModal state={appState} setState={setAppState} />
        <RegisterModal state={appState} setState={setAppState} />

        {/* Footer */}
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
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>
              GhostHire
            </p>
            <p style={{ fontSize: '0.8rem', color: '#999' }}>
              Privacy-first professional networking
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("✅ GhostHire Minimalist + API App Rendered!");
