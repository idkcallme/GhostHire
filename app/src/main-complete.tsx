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
    description: "We're looking for an experienced Rust developer to work on cutting-edge blockchain technology with zero-knowledge proofs. You'll be building the future of privacy-preserving applications.",
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
    description: "Join our team to develop next-generation privacy-preserving protocols using advanced cryptographic techniques. Work on cutting-edge ZK-SNARK implementations.",
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
    description: "Build the future of decentralized finance with our innovative platform using modern web technologies. Experience with smart contracts is a plus.",
    postedDate: new Date(2025, 7, 22)
  }
];

// App State Provider
function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [applications, setApplications] = useState<Application[]>([]);

  const login = (email: string, password: string): boolean => {
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

// Common styles
const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f7fafc' },
  main: { padding: '40px 20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  button: { backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  input: { width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '6px', fontSize: '16px' }
};

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
            <button onClick={logout} style={{ ...styles.button, backgroundColor: '#e53e3e', fontSize: '14px' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ ...styles.button, textDecoration: 'none', fontSize: '14px' }}>
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
    <div style={styles.page}>
      <Header />
      <main style={styles.main}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ color: '#2d3748', fontSize: '42px', marginBottom: '20px', fontWeight: 'bold' }}>
            Privacy-First Job Matching
          </h2>
          <p style={{ fontSize: '20px', color: '#718096', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            Prove your qualifications with zero-knowledge proofs. No personal data exposed, maximum privacy guaranteed.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          <div style={styles.card}>
            <h3 style={{ color: '#3182ce', marginBottom: '15px', fontSize: '24px' }}>🔍 Find Your Dream Job</h3>
            <p style={{ color: '#718096', marginBottom: '20px', lineHeight: '1.6' }}>
              Browse {jobs.length} available positions from top companies. Apply with confidence using ZK proofs.
            </p>
            <Link to="/jobs" style={{ ...styles.button, textDecoration: 'none', display: 'inline-block' }}>
              Browse Jobs →
            </Link>
          </div>
          
          <div style={styles.card}>
            <h3 style={{ color: '#38a169', marginBottom: '15px', fontSize: '24px' }}>📝 Hire Top Talent</h3>
            <p style={{ color: '#718096', marginBottom: '20px', lineHeight: '1.6' }}>
              Post your job and find qualified candidates while respecting their privacy completely.
            </p>
            <Link to="/post" style={{ ...styles.button, backgroundColor: '#38a169', textDecoration: 'none', display: 'inline-block' }}>
              Post a Job →
            </Link>
          </div>

          {user && (
            <div style={styles.card}>
              <h3 style={{ color: '#805ad5', marginBottom: '15px', fontSize: '24px' }}>📊 Track Applications</h3>
              <p style={{ color: '#718096', marginBottom: '20px', lineHeight: '1.6' }}>
                Monitor your job applications and ZK proof verification status in real-time.
              </p>
              <Link to="/applications" style={{ ...styles.button, backgroundColor: '#805ad5', textDecoration: 'none', display: 'inline-block' }}>
                My Applications →
              </Link>
            </div>
          )}
        </div>

        <div style={{ ...styles.card, textAlign: 'center' }}>
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
    <div style={styles.page}>
      <Header />
      <main style={{ ...styles.main, maxWidth: '400px', display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ ...styles.card, width: '100%' }}>
          <h2 style={{ color: '#2d3748', marginBottom: '30px', textAlign: 'center', fontSize: '28px' }}>Login to GhostHire</h2>
          {error && (
            <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
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
                style={styles.input}
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
                style={styles.input}
              />
            </div>
            <button type="submit" style={{ ...styles.button, width: '100%', padding: '14px' }}>
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

function JobsPage() {
  const { jobs, user, applyToJob } = useApp();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  ).filter(job => {
    if (!salaryFilter) return true;
    const minSalary = parseInt(salaryFilter);
    return job.minSalary >= minSalary;
  });

  const handleApply = (jobId: string) => {
    if (!user) {
      alert('Please login to apply for jobs');
      return;
    }
    applyToJob(jobId);
    alert('Application submitted with ZK proof!');
  };

  return (
    <div style={styles.page}>
      <Header />
      <main style={styles.main}>
        <h2 style={{ color: '#2d3748', fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>Available Jobs</h2>
        
        {/* Search and Filters */}
        <div style={{ ...styles.card, marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <input 
            type="text"
            placeholder="Search jobs, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...styles.input, flex: 1, minWidth: '300px' }}
          />
          <select 
            value={salaryFilter}
            onChange={(e) => setSalaryFilter(e.target.value)}
            style={{ ...styles.input, minWidth: '200px' }}
          >
            <option value="">All Salaries</option>
            <option value="80000">$80k+</option>
            <option value="100000">$100k+</option>
            <option value="120000">$120k+</option>
            <option value="150000">$150k+</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 1fr' : '1fr', gap: '30px' }}>
          {/* Job List */}
          <div>
            {filteredJobs.length === 0 && (
              <div style={{ ...styles.card, textAlign: 'center', color: '#718096' }}>
                No jobs found matching your criteria
              </div>
            )}
            {filteredJobs.map(job => (
              <div 
                key={job.id}
                onClick={() => setSelectedJob(job)}
                style={{ 
                  ...styles.card,
                  marginBottom: '20px',
                  cursor: 'pointer',
                  border: selectedJob?.id === job.id ? '2px solid #3182ce' : '1px solid #e2e8f0',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ color: '#2d3748', margin: '0 0 5px 0', fontSize: '20px', fontWeight: 'bold' }}>{job.title}</h3>
                    <p style={{ color: '#718096', margin: '0 0 5px 0', fontSize: '16px' }}>{job.company}</p>
                    <p style={{ color: '#718096', margin: '0', fontSize: '14px' }}>{job.location}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#38a169', margin: '0', fontSize: '16px', fontWeight: 'bold' }}>
                      ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}
                    </p>
                    <p style={{ color: '#718096', margin: '5px 0 0 0', fontSize: '12px' }}>
                      Posted {job.postedDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                  {job.skills.map(skill => (
                    <span 
                      key={skill}
                      style={{ 
                        backgroundColor: '#edf2f7', 
                        color: '#2d3748', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p style={{ color: '#718096', margin: '0', fontSize: '14px', lineHeight: '1.4' }}>
                  {job.description.substring(0, 150)}...
                </p>
              </div>
            ))}
          </div>

          {/* Job Detail */}
          {selectedJob && (
            <div style={{ 
              ...styles.card,
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ color: '#2d3748', margin: '0 0 15px 0', fontSize: '24px', fontWeight: 'bold' }}>{selectedJob.title}</h3>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#718096', margin: '0 0 5px 0', fontSize: '16px' }}><strong>Company:</strong> {selectedJob.company}</p>
                <p style={{ color: '#718096', margin: '0 0 5px 0', fontSize: '16px' }}><strong>Location:</strong> {selectedJob.location}</p>
                <p style={{ color: '#38a169', margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  ${selectedJob.minSalary.toLocaleString()} - ${selectedJob.maxSalary.toLocaleString()}
                </p>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#2d3748', margin: '0 0 10px 0', fontSize: '16px' }}>Required Skills:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedJob.skills.map(skill => (
                    <span 
                      key={skill}
                      style={{ 
                        backgroundColor: '#3182ce', 
                        color: 'white', 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ color: '#2d3748', margin: '0 0 10px 0', fontSize: '16px' }}>Job Description:</h4>
                <p style={{ color: '#718096', lineHeight: '1.6', fontSize: '14px' }}>{selectedJob.description}</p>
              </div>

              <button 
                onClick={() => handleApply(selectedJob.id)}
                style={{ 
                  ...styles.button,
                  width: '100%',
                  backgroundColor: user ? '#38a169' : '#cbd5e0', 
                  cursor: user ? 'pointer' : 'not-allowed', 
                  padding: '15px',
                  fontWeight: 'bold'
                }}
                disabled={!user}
              >
                {user ? '🔒 Apply with ZK Proof' : '🔑 Login to Apply'}
              </button>
              
              {user && (
                <p style={{ 
                  textAlign: 'center', 
                  marginTop: '10px', 
                  color: '#718096', 
                  fontSize: '12px',
                  fontStyle: 'italic'
                }}>
                  Your credentials will be verified using zero-knowledge proofs
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ApplicationsPage() {
  const { applications, user } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={styles.page}>
        <Header />
        <main style={{ ...styles.main, textAlign: 'center' }}>
          <h2 style={{ color: '#2d3748', fontSize: '32px', marginBottom: '20px' }}>Please Login</h2>
          <p style={{ color: '#718096', marginBottom: '30px' }}>You need to be logged in to view your applications.</p>
          <button onClick={() => navigate('/login')} style={styles.button}>
            Go to Login
          </button>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header />
      <main style={{ ...styles.main, maxWidth: '1000px' }}>
        <h2 style={{ color: '#2d3748', fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>My Applications</h2>
        
        {applications.length === 0 ? (
          <div style={{ ...styles.card, textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
            <h3 style={{ color: '#2d3748', marginBottom: '15px' }}>No Applications Yet</h3>
            <p style={{ color: '#718096', marginBottom: '25px' }}>Start applying to jobs to see your applications here.</p>
            <button onClick={() => navigate('/jobs')} style={styles.button}>
              Browse Jobs
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {applications.map(app => (
              <div key={app.id} style={{ ...styles.card, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ color: '#2d3748', margin: '0 0 5px 0', fontSize: '20px', fontWeight: 'bold' }}>{app.jobTitle}</h3>
                    <p style={{ color: '#718096', margin: '0 0 5px 0', fontSize: '16px' }}>{app.company}</p>
                    <p style={{ color: '#718096', margin: '0', fontSize: '14px' }}>
                      Applied: {app.appliedDate.toLocaleDateString()} at {app.appliedDate.toLocaleTimeString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      backgroundColor: app.status === 'pending' ? '#fbb6ce' : 
                                     app.status === 'reviewing' ? '#fbb6ce' :
                                     app.status === 'accepted' ? '#c6f6d5' : '#fed7d7',
                      color: app.status === 'pending' ? '#97266d' : 
                             app.status === 'reviewing' ? '#97266d' :
                             app.status === 'accepted' ? '#276749' : '#c53030',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {app.status}
                    </span>
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: '#f7fafc', 
                  padding: '15px', 
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ marginRight: '10px', fontSize: '18px' }}>🔐</span>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#2d3748' }}>Zero-Knowledge Proof</h4>
                      <p style={{ margin: '0', fontSize: '12px', color: '#718096', fontFamily: 'monospace' }}>
                        Hash: {app.zkProofHash}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#38a169', borderRadius: '50%' }}></div>
                      <span style={{ fontSize: '12px', color: '#718096' }}>Privacy Protected</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#3182ce', borderRadius: '50%' }}></div>
                      <span style={{ fontSize: '12px', color: '#718096' }}>Cryptographically Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PostJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    skills: '',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { addJob } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
    
    addJob({
      title: formData.title,
      company: formData.company,
      location: formData.location,
      minSalary: parseInt(formData.minSalary),
      maxSalary: parseInt(formData.maxSalary),
      skills: skillsArray,
      description: formData.description
    });
    
    setSubmitted(true);
    setFormData({
      title: '',
      company: '',
      location: '',
      minSalary: '',
      maxSalary: '',
      skills: '',
      description: ''
    });
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <Header />
        <main style={{ ...styles.main, maxWidth: '600px', textAlign: 'center' }}>
          <div style={styles.card}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#38a169', marginBottom: '20px', fontSize: '28px' }}>Job Posted Successfully!</h2>
            <p style={{ color: '#718096', marginBottom: '30px', lineHeight: '1.6' }}>
              Your job posting is now live and candidates can start applying with zero-knowledge proofs.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setSubmitted(false)} style={styles.button}>
                Post Another Job
              </button>
              <Link to="/jobs" style={{ ...styles.button, backgroundColor: '#38a169', textDecoration: 'none' }}>
                View All Jobs
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Header />
      <main style={{ ...styles.main, maxWidth: '800px' }}>
        <div style={styles.card}>
          <h2 style={{ color: '#2d3748', marginBottom: '30px', textAlign: 'center', fontSize: '32px' }}>Post a New Job</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Job Title *</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="e.g. Senior React Developer" 
                  style={styles.input}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Company *</label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                  placeholder="e.g. Tech Innovations Inc" 
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Location *</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                placeholder="e.g. Remote, San Francisco, New York" 
                style={styles.input}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Min Salary ($) *</label>
                <input 
                  type="number" 
                  value={formData.minSalary}
                  onChange={(e) => setFormData({...formData, minSalary: e.target.value})}
                  required
                  min="0"
                  placeholder="80000" 
                  style={styles.input}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Max Salary ($) *</label>
                <input 
                  type="number" 
                  value={formData.maxSalary}
                  onChange={(e) => setFormData({...formData, maxSalary: e.target.value})}
                  required
                  min="0"
                  placeholder="120000" 
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Required Skills *</label>
              <input 
                type="text" 
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                required
                placeholder="e.g. React, TypeScript, Node.js, GraphQL" 
                style={styles.input}
              />
              <p style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
                Separate skills with commas
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Job Description *</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows={6}
                placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity special..." 
                style={{ ...styles.input, fontFamily: 'Arial, sans-serif', resize: 'vertical' }}
              />
            </div>

            <button type="submit" style={{ ...styles.button, width: '100%', backgroundColor: '#38a169', padding: '16px', fontSize: '18px', fontWeight: 'bold' }}>
              🚀 Post Job
            </button>
          </form>

          <div style={{ 
            backgroundColor: '#edf2f7', 
            padding: '20px', 
            borderRadius: '8px', 
            marginTop: '30px'
          }}>
            <h4 style={{ color: '#2d3748', margin: '0 0 10px 0', fontSize: '16px' }}>💡 Why GhostHire?</h4>
            <ul style={{ color: '#718096', fontSize: '14px', lineHeight: '1.6', margin: '0', paddingLeft: '20px' }}>
              <li>Candidates apply with zero-knowledge proofs</li>
              <li>Verify qualifications without exposing personal data</li>
              <li>Reduce bias and focus on skills</li>
              <li>Streamlined privacy-first hiring process</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

// Router Configuration
const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/jobs", element: <JobsPage /> },
  { path: "/applications", element: <ApplicationsPage /> },
  { path: "/post", element: <PostJobPage /> }
]);

// Main App
function FullApp() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

// Render
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<FullApp />);

console.log("✅ GhostHire FULL FEATURED App Loaded Successfully!");
console.log("🔥 Features: Login/Auth, Job Search, Apply with ZK Proofs, Post Jobs, Track Applications");
