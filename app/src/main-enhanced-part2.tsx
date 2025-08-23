// Continue from where we left off...

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      <Header />
      <main style={{ padding: '40px 20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#2d3748', fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>Available Jobs</h2>
        
        {/* Search and Filters */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <input 
            type="text"
            placeholder="Search jobs, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1,
              minWidth: '300px',
              padding: '12px', 
              border: '2px solid #e2e8f0', 
              borderRadius: '6px',
              fontSize: '16px'
            }} 
          />
          <select 
            value={salaryFilter}
            onChange={(e) => setSalaryFilter(e.target.value)}
            style={{ 
              padding: '12px', 
              border: '2px solid #e2e8f0', 
              borderRadius: '6px',
              fontSize: '16px',
              minWidth: '200px'
            }}
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
              <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                No jobs found matching your criteria
              </div>
            )}
            {filteredJobs.map(job => (
              <div 
                key={job.id}
                onClick={() => setSelectedJob(job)}
                style={{ 
                  backgroundColor: 'white', 
                  padding: '25px', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                  width: '100%',
                  backgroundColor: user ? '#38a169' : '#cbd5e0', 
                  color: 'white', 
                  border: 'none', 
                  padding: '15px', 
                  borderRadius: '6px', 
                  cursor: user ? 'pointer' : 'not-allowed', 
                  fontSize: '16px', 
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
        <Header />
        <main style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
          <h2 style={{ color: '#2d3748', fontSize: '32px', marginBottom: '20px' }}>Please Login</h2>
          <p style={{ color: '#718096', marginBottom: '30px' }}>You need to be logged in to view your applications.</p>
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              backgroundColor: '#3182ce', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Login
          </button>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      <Header />
      <main style={{ padding: '40px 20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ color: '#2d3748', fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>My Applications</h2>
        
        {applications.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '8px', 
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
            <h3 style={{ color: '#2d3748', marginBottom: '15px' }}>No Applications Yet</h3>
            <p style={{ color: '#718096', marginBottom: '25px' }}>Start applying to jobs to see your applications here.</p>
            <button 
              onClick={() => navigate('/jobs')}
              style={{ 
                backgroundColor: '#3182ce', 
                color: 'white', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {applications.map(app => (
              <div 
                key={app.id}
                style={{ 
                  backgroundColor: 'white', 
                  padding: '25px', 
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0'
                }}
              >
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
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#38a169', 
                        borderRadius: '50%' 
                      }}></div>
                      <span style={{ fontSize: '12px', color: '#718096' }}>Privacy Protected</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#3182ce', 
                        borderRadius: '50%' 
                      }}></div>
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
        <Header />
        <main style={{ 
          padding: '40px 20px', 
          fontFamily: 'Arial, sans-serif', 
          maxWidth: '600px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#38a169', marginBottom: '20px', fontSize: '28px' }}>Job Posted Successfully!</h2>
            <p style={{ color: '#718096', marginBottom: '30px', lineHeight: '1.6' }}>
              Your job posting is now live and candidates can start applying with zero-knowledge proofs.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setSubmitted(false)}
                style={{ 
                  backgroundColor: '#3182ce', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Post Another Job
              </button>
              <Link 
                to="/jobs"
                style={{ 
                  display: 'inline-block',
                  backgroundColor: '#38a169', 
                  color: 'white', 
                  padding: '12px 24px', 
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '16px'
                }}
              >
                View All Jobs
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      <Header />
      <main style={{ padding: '40px 20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
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
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '6px',
                    fontSize: '16px'
                  }} 
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
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '6px',
                    fontSize: '16px'
                  }} 
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
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '6px',
                  fontSize: '16px'
                }} 
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
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '6px',
                    fontSize: '16px'
                  }} 
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
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '6px',
                    fontSize: '16px'
                  }} 
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
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '6px',
                  fontSize: '16px'
                }} 
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
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontFamily: 'Arial, sans-serif',
                  resize: 'vertical'
                }} 
              />
            </div>

            <button 
              type="submit"
              style={{ 
                width: '100%',
                backgroundColor: '#38a169', 
                color: 'white', 
                border: 'none', 
                padding: '16px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '18px', 
                fontWeight: 'bold'
              }}
            >
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
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/jobs",
    element: <JobsPage />
  },
  {
    path: "/applications",
    element: <ApplicationsPage />
  },
  {
    path: "/post",
    element: <PostJobPage />
  }
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
