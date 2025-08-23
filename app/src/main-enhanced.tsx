import React, { useState, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link, useNavigate } from "react-router-dom";

console.log("🚀 GhostHire FULL FEATURED App Starting!");

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  skills: string[];
  description: string;
  postedDate: Date;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: Date;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  zkProofHash: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

// Global State Context
interface AppState {
  user: User | null;
  jobs: Job[];
  applications: Application[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addJob: (job: Omit<Job, 'id' | 'postedDate'>) => void;
  applyToJob: (jobId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

// Sample data
const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Senior Rust Developer",
    company: "BlockTech Solutions",
    location: "Remote, US/CA/EU",
    minSalary: 120000,
    maxSalary: 180000,
    skills: ["Rust", "Zero-Knowledge Proofs", "Blockchain"],
    description: "We're looking for an experienced Rust developer to work on cutting-edge blockchain technology with zero-knowledge proofs.",
    postedDate: new Date(2025, 7, 20)
  },
  {
    id: "2",
    title: "ZK Protocol Engineer",
    company: "Privacy Labs",
    location: "Remote, Global",
    minSalary: 140000,
    maxSalary: 200000,
    skills: ["Cryptography", "Zero-Knowledge", "Mathematics"],
    description: "Join our team to develop next-generation privacy-preserving protocols using advanced cryptographic techniques.",
    postedDate: new Date(2025, 7, 21)
  },
  {
    id: "3",
    title: "Full Stack TypeScript Developer",
    company: "DeFi Innovations",
    location: "Remote, Americas",
    minSalary: 90000,
    maxSalary: 140000,
    skills: ["TypeScript", "React", "Web3"],
    description: "Build the future of decentralized finance with our innovative platform using modern web technologies.",
    postedDate: new Date(2025, 7, 22)
  }
];

// App State Provider
function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [applications, setApplications] = useState<Application[]>([]);

  const login = (email: string, password: string): boolean => {
    // Simulate authentication
    if (email && password.length >= 6) {
      setUser({
        id: "user1",
        name: email.split('@')[0],
        email,
        isAuthenticated: true
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addJob = (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedDate: new Date()
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const applyToJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || !user) return;

    const newApplication: Application = {
      id: Date.now().toString(),
      jobId,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date(),
      status: 'pending',
      zkProofHash: `zk_${Math.random().toString(36).substr(2, 9)}`
    };

    setApplications(prev => [newApplication, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      user,
      jobs,
      applications,
      login,
      logout,
      addJob,
      applyToJob
    }}>
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// Components
function Header() {
  const { user, logout } = useApp();
  
  return (
    <header style={{ 
      backgroundColor: '#1a365d', 
      color: 'white', 
      padding: '15px 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold' }}>🚀 GhostHire</h1>
        <nav>
          <Link to="/" style={{ color: '#90cdf4', marginRight: '20px', textDecoration: 'none', fontSize: '14px' }}>Home</Link>
          <Link to="/jobs" style={{ color: '#90cdf4', marginRight: '20px', textDecoration: 'none', fontSize: '14px' }}>Jobs</Link>
          {user && <Link to="/applications" style={{ color: '#90cdf4', marginRight: '20px', textDecoration: 'none', fontSize: '14px' }}>My Applications</Link>}
          <Link to="/post" style={{ color: '#90cdf4', marginRight: '20px', textDecoration: 'none', fontSize: '14px' }}>Post Job</Link>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <>
            <span style={{ fontSize: '14px', color: '#90cdf4' }}>Welcome, {user.name}!</span>
            <button 
              onClick={logout}
              style={{ 
                backgroundColor: '#e53e3e', 
                color: 'white', 
                border: 'none', 
                padding: '8px 15px', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            style={{ 
              backgroundColor: '#3182ce', 
              color: 'white', 
              padding: '8px 15px', 
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

function HomePage() {
  const { jobs, user } = useApp();
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      <Header />
      <main style={{ padding: '40px 20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ color: '#2d3748', fontSize: '42px', marginBottom: '20px', fontWeight: 'bold' }}>
            Privacy-First Job Matching
          </h2>
          <p style={{ fontSize: '20px', color: '#718096', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            Prove your qualifications with zero-knowledge proofs. No personal data exposed, maximum privacy guaranteed.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          <div style={{ 
            padding: '30px', 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#3182ce', marginBottom: '15px', fontSize: '24px' }}>🔍 Find Your Dream Job</h3>
            <p style={{ color: '#718096', marginBottom: '20px', lineHeight: '1.6' }}>
              Browse {jobs.length} available positions from top companies. Apply with confidence using ZK proofs.
            </p>
            <Link to="/jobs" style={{ 
              display: 'inline-block',
              padding: '12px 24px', 
              backgroundColor: '#3182ce', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Browse Jobs →
            </Link>
          </div>
          
          <div style={{ 
            padding: '30px', 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#38a169', marginBottom: '15px', fontSize: '24px' }}>📝 Hire Top Talent</h3>
            <p style={{ color: '#718096', marginBottom: '20px', lineHeight: '1.6' }}>
              Post your job and find qualified candidates while respecting their privacy completely.
            </p>
            <Link to="/post" style={{ 
              display: 'inline-block',
              padding: '12px 24px', 
              backgroundColor: '#38a169', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Post a Job →
            </Link>
          </div>

          {user && (
            <div style={{ 
              padding: '30px', 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ color: '#805ad5', marginBottom: '15px', fontSize: '24px' }}>📊 Track Applications</h3>
              <p style={{ color: '#718096', marginBottom: '20px', lineHeight: '1.6' }}>
                Monitor your job applications and ZK proof verification status in real-time.
              </p>
              <Link to="/applications" style={{ 
                display: 'inline-block',
                padding: '12px 24px', 
                backgroundColor: '#805ad5', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                My Applications →
              </Link>
            </div>
          )}
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '40px', 
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#2d3748', fontSize: '28px', marginBottom: '20px' }}>🔒 How ZK Proofs Work</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '30px' }}>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🛡️</div>
              <h4 style={{ color: '#2d3748', marginBottom: '10px' }}>Privacy Protected</h4>
              <p style={{ color: '#718096', fontSize: '14px' }}>Your personal data never leaves your device</p>
            </div>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
              <h4 style={{ color: '#2d3748', marginBottom: '10px' }}>Verified Skills</h4>
              <p style={{ color: '#718096', fontSize: '14px' }}>Cryptographically prove your qualifications</p>
            </div>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚡</div>
              <h4 style={{ color: '#2d3748', marginBottom: '10px' }}>Instant Verification</h4>
              <p style={{ color: '#718096', fontSize: '14px' }}>Employers get immediate proof validation</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('Invalid credentials. Please use any email and password (min 6 characters).');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      <Header />
      <main style={{ 
        padding: '40px 20px', 
        fontFamily: 'Arial, sans-serif', 
        maxWidth: '400px', 
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '40px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#2d3748', marginBottom: '30px', textAlign: 'center', fontSize: '28px' }}>Login to GhostHire</h2>
          {error && (
            <div style={{ 
              backgroundColor: '#fed7d7', 
              color: '#c53030', 
              padding: '12px', 
              borderRadius: '6px', 
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com" 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }} 
              />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter password (min 6 chars)" 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }} 
              />
            </div>
            <button 
              type="submit"
              style={{ 
                width: '100%',
                backgroundColor: '#3182ce', 
                color: 'white', 
                border: 'none', 
                padding: '14px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '16px', 
                fontWeight: '600'
              }}
            >
              Login
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#718096', fontSize: '14px' }}>
            Demo: Use any email and password (6+ characters)
          </p>
        </div>
      </main>
    </div>
  );
}
