import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Simple working main file to verify the application loads
const App: React.FC = () => {
  return (
    <Router>
      <div style={{ padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ 
          borderBottom: '1px solid #e5e7eb', 
          paddingBottom: '1rem', 
          marginBottom: '2rem' 
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#111827',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '2.5rem' }}>👻</span>
            GhostHire
          </h1>
          <p style={{ 
            color: '#6b7280', 
            margin: '0.5rem 0 0 0',
            fontSize: '1.125rem'
          }}>
            Privacy-First Job Matching with Zero-Knowledge Proofs
          </p>
        </header>

        <nav style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              to="/" 
              style={{ 
                color: '#6366f1', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#f3f4f6'
              }}
            >
              Home
            </Link>
            <Link 
              to="/jobs" 
              style={{ 
                color: '#6366f1', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#f3f4f6'
              }}
            >
              Jobs
            </Link>
            <Link 
              to="/register" 
              style={{ 
                color: '#6366f1', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#f3f4f6'
              }}
            >
              Register
            </Link>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>

        <footer style={{ 
          marginTop: '4rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid #e5e7eb',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <p>© 2024 GhostHire - Privacy-First Job Board</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Built with ❤️ and zero-knowledge cryptography
          </p>
        </footer>
      </div>
    </Router>
  );
};

const HomePage: React.FC = () => (
  <div>
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '3rem',
      borderRadius: '1rem',
      textAlign: 'center',
      marginBottom: '2rem'
    }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
        Welcome to GhostHire
      </h2>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
        Prove your qualifications without revealing sensitive data using zero-knowledge cryptography
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🔒</span>
          <span>Privacy Protected</span>
        </div>
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚡</span>
          <span>Instant Verification</span>
        </div>
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🎯</span>
          <span>Perfect Matches</span>
        </div>
      </div>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    }}>
      <FeatureCard
        icon="🛡️"
        title="Zero-Knowledge Privacy"
        description="Prove qualifications without revealing personal information using advanced cryptographic proofs."
      />
      <FeatureCard
        icon="🎯"
        title="Smart Matching"
        description="AI-powered job matching that respects your privacy while finding perfect opportunities."
      />
      <FeatureCard
        icon="⚡"
        title="Instant Verification"
        description="Real-time proof generation and verification for seamless application processes."
      />
    </div>
  </div>
);

const JobsPage: React.FC = () => (
  <div>
    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
      Available Jobs
    </h2>
    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
      Discover opportunities that match your skills while maintaining your privacy.
    </p>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '1.5rem'
    }}>
      <JobCard
        title="Senior Frontend Developer"
        company="TechCorp"
        location="Remote"
        salary="$120k - $180k"
        tags={["React", "TypeScript", "Web3"]}
      />
      <JobCard
        title="Blockchain Engineer"
        company="CryptoStartup"
        location="San Francisco"
        salary="$150k - $250k"
        tags={["Solidity", "ZK Proofs", "DeFi"]}
      />
      <JobCard
        title="Privacy Engineer"
        company="SecureData Inc"
        location="New York"
        salary="$140k - $200k"
        tags={["Cryptography", "Privacy", "Security"]}
      />
    </div>
  </div>
);

const RegisterPage: React.FC = () => (
  <div style={{ maxWidth: '500px', margin: '0 auto' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
      Join GhostHire
    </h2>
    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
      Start your privacy-first career journey today.
    </p>
    
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Password
        </label>
        <input
          type="password"
          placeholder="Create a secure password"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>
      
      <button
        type="submit"
        style={{
          padding: '1rem',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1.125rem',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Create Account
      </button>
    </form>
  </div>
);

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
      {title}
    </h3>
    <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
      {description}
    </p>
  </div>
);

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
}

const JobCard: React.FC<JobCardProps> = ({ title, company, location, salary, tags }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  }}>
    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
      {title}
    </h3>
    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
      {company} • {location}
    </p>
    <p style={{ color: '#059669', fontWeight: '600', marginBottom: '1rem' }}>
      {salary}
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
      {tags.map((tag, index) => (
        <span
          key={index}
          style={{
            padding: '0.25rem 0.75rem',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            borderRadius: '1rem',
            fontSize: '0.875rem'
          }}
        >
          {tag}
        </span>
      ))}
    </div>
    <button style={{
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#6366f1',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer'
    }}>
      Apply with ZK Proof
    </button>
  </div>
);

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
