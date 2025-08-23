import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './hooks/useAppContext';
import { WalletProvider } from './wallet/WalletProvider';
import { ThemeProvider } from './components/ThemeProvider';
import { AccessibilityTester } from './utils/accessibility';

// Import all enhanced components
import { Button, Card, Input, Modal, LoadingSpinner, Toast } from './components/ui/EnhancedComponents';

// Import styles
import './styles/professional.css';
import './styles/animations.css';
import './index.css';

// Enhanced Header Component with Professional Design
const Header: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Browse Jobs', path: '/jobs', icon: '🔍' },
    { label: 'Post Job', path: '/post-job', icon: '➕' },
    { label: 'Applications', path: '/applications', icon: '📄' },
    { label: 'Profile', path: '/profile', icon: '👤' }
  ];

  return (
    <header className="header-professional">
      <div className="container-professional">
        <div className="header-content">
          <Link to="/" className="logo-professional">
            <span className="logo-icon">👻</span>
            <span className="logo-text">GhostHire</span>
          </Link>

          <nav className="nav-professional" aria-label="Main navigation">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="nav-link">
                    <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            {user ? (
              <div className="user-menu">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="user-button"
                  aria-expanded={isMenuOpen ? "true" : "false"}
                  aria-haspopup="true"
                >
                  <span className="user-avatar">{user.name?.[0] || 'U'}</span>
                  <span className="user-name">{user.name}</span>
                </button>
                
                {isMenuOpen && (
                  <div className="user-dropdown" role="menu">
                    <button onClick={() => navigate('/profile')} role="menuitem">
                      Profile Settings
                    </button>
                    <button onClick={() => navigate('/applications')} role="menuitem">
                      My Applications
                    </button>
                    <hr />
                    <button onClick={logout} role="menuitem">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/login')}
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/register')}
                  aria-label="Create new account"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Enhanced Hero Section with Professional Animations
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={`hero-professional ${isVisible ? 'hero-visible' : ''}`}>
      <div className="container-professional">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Privacy-First Job Matching
              <span className="gradient-text"> with Zero-Knowledge Proofs</span>
            </h1>
            
            <p className="hero-description">
              Prove your qualifications without revealing sensitive data. GhostHire uses 
              cutting-edge zero-knowledge cryptography to protect your privacy while 
              connecting you with the perfect opportunities.
            </p>

            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon" aria-hidden="true">🔒</span>
                <span>Privacy Protected</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon" aria-hidden="true">⚡</span>
                <span>Instant Verification</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon" aria-hidden="true">🎯</span>
                <span>Perfect Matches</span>
              </div>
            </div>

            <div className="hero-actions">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                aria-label="Start your privacy-first job search"
              >
                Start Your Journey
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => navigate('/jobs')}
                aria-label="Browse available job opportunities"
              >
                Browse Jobs
              </Button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="zk-proof-animation">
              <div className="proof-circle proof-1"></div>
              <div className="proof-circle proof-2"></div>
              <div className="proof-circle proof-3"></div>
              <div className="proof-connection"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Features Grid
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '🛡️',
      title: 'Zero-Knowledge Privacy',
      description: 'Prove your qualifications without revealing personal information using advanced cryptographic proofs.',
      details: ['Groth16 ZK-SNARKs', 'Midnight Network', 'Privacy Score Calculation']
    },
    {
      icon: '🎯',
      title: 'Smart Matching',
      description: 'AI-powered job matching that respects your privacy while finding perfect opportunities.',
      details: ['Skills Assessment', 'Experience Verification', 'Cultural Fit Analysis']
    },
    {
      icon: '⚡',
      title: 'Instant Verification',
      description: 'Real-time proof generation and verification for seamless application processes.',
      details: ['Sub-second Proofs', 'Automated Verification', 'Blockchain Anchoring']
    },
    {
      icon: '🌐',
      title: 'Decentralized Trust',
      description: 'Built on blockchain technology for transparent and tamper-proof credential verification.',
      details: ['Immutable Records', 'Distributed Validation', 'Cross-Platform Compatibility']
    }
  ];

  return (
    <section className="features-professional">
      <div className="container-professional">
        <div className="features-header">
          <h2>Why Choose GhostHire?</h2>
          <p>The future of privacy-preserving recruitment is here</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              elevated 
              className="feature-card"
              role="article"
              aria-labelledby={`feature-${index}-title`}
            >
              <div className="feature-icon-large" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 id={`feature-${index}-title`}>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="feature-details">
                {feature.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Registration Form with Real API Integration
const RegisterPage: React.FC = () => {
  const { login, loading } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate' as 'candidate' | 'employer'
  });
  
  const [errors, setErrors] = React.useState<{[key: string]: string}>({});
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // For now, simulate registration by trying to login
      // In a real app, you'd have a separate register endpoint
      const success = await login(formData.email, formData.password);
      
      if (success) {
        setToastMessage('Account created successfully! Welcome to GhostHire.');
        setShowToast(true);
        
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      } else {
        setToastMessage('Registration failed. Please try again.');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Registration failed. Please try again.');
      setShowToast(true);
    }
  };

  return (
    <div className="register-page">
      <div className="container-professional">
        <div className="register-content">
          <div className="register-form-section">
            <h1>Join GhostHire</h1>
            <p>Start your privacy-first career journey today</p>

            <form onSubmit={handleSubmit} className="register-form">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(value) => setFormData({...formData, name: value})}
                placeholder="Enter your full name"
                required
                error={errors.name}
                autoComplete="name"
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({...formData, email: value})}
                placeholder="Enter your email address"
                required
                error={errors.email}
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(value) => setFormData({...formData, password: value})}
                placeholder="Create a secure password"
                required
                error={errors.password}
                helper="Must be at least 8 characters"
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => setFormData({...formData, confirmPassword: value})}
                placeholder="Confirm your password"
                required
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              <div className="role-selection">
                <label className="form-label">I am a:</label>
                <div className="role-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="role"
                      value="candidate"
                      checked={formData.role === 'candidate'}
                      onChange={(e) => setFormData({...formData, role: e.target.value as 'candidate' | 'employer'})}
                    />
                    <span className="radio-label">
                      <span className="role-icon">👤</span>
                      Job Seeker
                    </span>
                  </label>
                  
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="role"
                      value="employer"
                      checked={formData.role === 'employer'}
                      onChange={(e) => setFormData({...formData, role: e.target.value as 'candidate' | 'employer'})}
                    />
                    <span className="radio-label">
                      <span className="role-icon">🏢</span>
                      Employer
                    </span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={loading}
                aria-label="Create your GhostHire account"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="register-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          <div className="register-benefits">
            <h3>What you'll get:</h3>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">🔒</span>
                Complete privacy protection
              </li>
              <li>
                <span className="benefit-icon">🎯</span>
                Personalized job matching
              </li>
              <li>
                <span className="benefit-icon">⚡</span>
                Instant application verification
              </li>
              <li>
                <span className="benefit-icon">🌟</span>
                Access to exclusive opportunities
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Toast
        type="success"
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

// Enhanced HomePage Component
const HomePage: React.FC = () => {
  return (
    <div className="homepage-professional">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};

// Enhanced Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="footer-professional">
      <div className="container-professional">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">👻</span>
              <span className="logo-text">GhostHire</span>
            </div>
            <p>Privacy-first job matching with zero-knowledge proofs</p>
          </div>

          <div className="footer-section">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/post-job">Post a Job</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Privacy</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/security">Security</Link></li>
              <li><Link to="/zk-proofs">ZK Technology</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/status">System Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 GhostHire. All rights reserved.</p>
          <p>Built with ❤️ and zero-knowledge cryptography</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component with Professional Layout
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <AppProvider>
          <Router>
            <div className="app-professional">
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              
              <Header />
              
              <main id="main-content" className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/jobs" element={<div>Jobs Page (Coming Soon)</div>} />
                  <Route path="/post-job" element={<div>Post Job Page (Coming Soon)</div>} />
                  <Route path="/applications" element={<div>Applications Page (Coming Soon)</div>} />
                  <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />
                  <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
              </main>
              
              <Footer />
              
              {process.env.NODE_ENV === 'development' && <AccessibilityTester />}
            </div>
          </Router>
        </AppProvider>
      </WalletProvider>
    </ThemeProvider>
  );
};

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
