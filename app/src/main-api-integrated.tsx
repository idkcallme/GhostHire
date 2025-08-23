// Main App with Real API Integration
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';

// Loading Component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
    </div>
  );
};

// Toast Component
const Toast: React.FC = () => {
  const { state, hideToast } = useApp();
  const { toast } = state;

  if (!toast.show) return null;

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`${bgColors[toast.type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between`}>
        <span>{toast.message}</span>
        <button 
          onClick={hideToast}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Header Component with Real Authentication
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
    { path: '/jobs', label: 'Jobs', public: true },
    { path: '/post-job', label: 'Post a Job', public: false },
    { path: '/applications', label: 'My Applications', public: false },
    { path: '/profile', label: 'Profile', public: false }
  ];

  return (
    <header style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link to="/" style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            👻 GhostHire
          </Link>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navItems.map(item => {
              if (!item.public && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    color: location.pathname === item.path ? '#ffd700' : 'white',
                    textDecoration: 'none',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    transition: 'color 0.3s'
                  }}
                >
                  {item.label}
                  {item.label === 'My Applications' && unreadCount > 0 && (
                    <span style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '0.125rem 0.375rem',
                      fontSize: '0.75rem',
                      marginLeft: '0.25rem'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'white', fontSize: '0.875rem' }}>
                  Welcome, {user?.name || user?.email}!
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => toggleModal('login', true)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '1px solid white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#667eea';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => toggleModal('register', true)}
                  style={{
                    backgroundColor: '#ffd700',
                    color: '#333',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'transform 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

// Login Modal Component
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

  if (!state.modals.login) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Login to GhostHire</h2>
          <button onClick={handleClose} style={{ fontSize: '1.5rem', color: '#666', cursor: 'pointer', border: 'none', background: 'none' }}>×</button>
        </div>

        {state.authError && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            {state.authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={state.isLoading}
            style={{
              width: '100%',
              backgroundColor: '#667eea',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: state.isLoading ? 'not-allowed' : 'pointer',
              opacity: state.isLoading ? 0.7 : 1
            }}
          >
            {state.isLoading ? <LoadingSpinner size="sm" /> : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280' }}>
          Don't have an account?{' '}
          <button
            onClick={() => {
              handleClose();
              toggleModal('register', true);
            }}
            style={{ color: '#667eea', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

// Register Modal Component
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

  if (!state.modals.register) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Join GhostHire</h2>
          <button onClick={handleClose} style={{ fontSize: '1.5rem', color: '#666', cursor: 'pointer', border: 'none', background: 'none' }}>×</button>
        </div>

        {state.authError && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            {state.authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>I am a...</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'job_seeker' | 'employer' })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={state.isLoading}
            style={{
              width: '100%',
              backgroundColor: '#667eea',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: state.isLoading ? 'not-allowed' : 'pointer',
              opacity: state.isLoading ? 0.7 : 1
            }}
          >
            {state.isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280' }}>
          Already have an account?{' '}
          <button
            onClick={() => {
              handleClose();
              toggleModal('login', true);
            }}
            style={{ color: '#667eea', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

// Home Page Component
const HomePage: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        padding: '4rem 0',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            👻 Welcome to GhostHire
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            The privacy-first job platform where your identity stays protected through zero-knowledge proofs until you're ready to reveal it.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/jobs')}
              style={{
                backgroundColor: 'white',
                color: '#667eea',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Browse Jobs
            </button>
            {state.isAuthenticated && state.user?.role === 'employer' && (
              <button
                onClick={() => navigate('/post-job')}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#f5576c';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                Post a Job
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '3rem',
            color: '#1f2937'
          }}>
            Why Choose GhostHire?
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              {
                icon: '🔒',
                title: 'Privacy First',
                description: 'Your personal information stays encrypted until you choose to reveal it to the right employer.'
              },
              {
                icon: '🎯',
                title: 'Zero-Knowledge Proofs',
                description: 'Prove your qualifications without revealing sensitive personal data using cutting-edge cryptography.'
              },
              {
                icon: '🚀',
                title: 'Smart Matching',
                description: 'Our AI matches you with relevant opportunities while keeping your identity completely private.'
              },
              {
                icon: '💼',
                title: 'Professional Network',
                description: 'Connect with top employers who value privacy and respect candidate confidentiality.'
              },
              {
                icon: '⚡',
                title: 'Fast & Secure',
                description: 'Lightning-fast applications with military-grade security protecting your data.'
              },
              {
                icon: '🌟',
                title: 'Quality Jobs',
                description: 'Curated job listings from verified employers looking for talented professionals like you.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  border: '1px solid #e5e7eb',
                  transition: 'transform 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#1f2937', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem' }}>
            Join Thousands of Privacy-Conscious Professionals
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              { number: '10,000+', label: 'Active Job Seekers' },
              { number: '500+', label: 'Verified Employers' },
              { number: '50,000+', label: 'Jobs Posted' },
              { number: '98%', label: 'Privacy Rating' }
            ].map((stat, index) => (
              <div key={index} style={{ padding: '1rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffd700', marginBottom: '0.5rem' }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '1.125rem', color: '#e5e7eb' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#667eea', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Ready to Start Your Private Job Search?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
            Join GhostHire today and take control of your career while protecting your privacy.
          </p>
          {!state.isAuthenticated && (
            <button
              onClick={() => state.toggleModal('register', true)}
              style={{
                backgroundColor: '#ffd700',
                color: '#333',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Get Started - It's Free!
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

// Jobs Page Component with Real API
const JobsPage: React.FC = () => {
  const { state, loadJobs, setJobFilters, applyToJob } = useApp();
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
      navigate('/login');
      return;
    }

    const success = await applyToJob(jobId, {
      coverLetter: 'Applied through GhostHire platform',
      zkProof: null // Will be generated by the backend
    });

    if (success) {
      // Refresh jobs to update application status
      loadJobs();
    }
  };

  if (jobsLoading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <LoadingSpinner size="lg" />
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
        Find Your Dream Job
      </h1>

      {/* Search and Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.75rem', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Search Jobs</label>
            <input
              type="text"
              value={jobFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Job title, skills, company..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Location</label>
            <input
              type="text"
              value={jobFilters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="City, state, remote..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Job Type</label>
            <select
              value={jobFilters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
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
              backgroundColor: '#667eea',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              height: 'fit-content'
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Summary */}
      <div style={{ marginBottom: '2rem', color: '#6b7280' }}>
        Found {totalJobs} jobs {jobFilters.search && `for "${jobFilters.search}"`}
      </div>

      {/* Job Listings */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                  {job.title}
                </h3>
                <p style={{ color: '#667eea', fontWeight: '500', marginBottom: '0.5rem' }}>
                  {job.company}
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span>📍 {job.location}</span>
                  <span>💼 {job.type}</span>
                  <span>💰 {job.salary}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'end' }}>
                <span style={{ 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {job.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p style={{ color: '#374151', marginBottom: '1rem', lineHeight: '1.6' }}>
              {job.description.length > 200 ? `${job.description.substring(0, 200)}...` : job.description}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {job.requirements.slice(0, 3).map((req, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                >
                  {req}
                </span>
              ))}
              {job.requirements.length > 3 && (
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  +{job.requirements.length - 3} more
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => navigate(`/jobs/${job.id}`)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#667eea',
                  border: '1px solid #667eea',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                View Details
              </button>
              
              <button
                onClick={() => handleApply(job.id)}
                disabled={!isAuthenticated}
                style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  opacity: isAuthenticated ? 1 : 0.6
                }}
              >
                {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && !jobsLoading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>No jobs found</h3>
          <p>Try adjusting your search criteria or check back later for new opportunities.</p>
        </div>
      )}

      {/* Pagination */}
      {totalJobs > jobFilters.limit && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem' }}>
          {Array.from({ length: Math.ceil(totalJobs / jobFilters.limit) }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => {
                setJobFilters({ page });
                loadJobs();
              }}
              style={{
                padding: '0.5rem 1rem',
                border: page === jobFilters.page ? 'none' : '1px solid #d1d5db',
                backgroundColor: page === jobFilters.page ? '#667eea' : 'white',
                color: page === jobFilters.page ? 'white' : '#374151',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple placeholder pages for navigation
const ApplicationsPage: React.FC = () => {
  const { state } = useApp();
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
        My Applications
      </h1>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          {state.applications.length === 0 ? 'No applications yet.' : `You have ${state.applications.length} applications.`}
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Real application management coming soon with full API integration!
        </p>
      </div>
    </div>
  );
};

const PostJobPage: React.FC = () => (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
      Post a Job
    </h1>
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', textAlign: 'center' }}>
      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Job posting interface coming soon!</p>
      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
        Full job creation with ZK proofs and real API integration.
      </p>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const { state } = useApp();
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
        Profile
      </h1>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Name:</strong> {state.user?.name}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Email:</strong> {state.user?.email}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Role:</strong> {state.user?.role === 'job_seeker' ? 'Job Seeker' : 'Employer'}
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '2rem' }}>
          Enhanced profile management with ZK credentials coming soon!
        </p>
      </div>
    </div>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
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
      
      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#1f2937', 
        color: 'white', 
        padding: '2rem 0',
        marginTop: '4rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <p>&copy; 2024 GhostHire. Privacy-first professional networking.</p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            Built with ❤️ for a more private future
          </p>
        </div>
      </footer>
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
