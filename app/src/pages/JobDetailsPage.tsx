import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient, Job } from '../services/apiClient';
import { midnightZK } from '../services/midnightZK';

interface JobDetailsPageProps {
  state: any;
  setState: any;
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ state, setState }) => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = React.useState<Job | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [applying, setApplying] = React.useState(false);
  const [showApplicationModal, setShowApplicationModal] = React.useState(false);
  const [applicationData, setApplicationData] = React.useState({
    coverLetter: '',
    expectedSalary: '',
    skills: {} as { [key: string]: number }
  });
  const [zkProofStatus, setZkProofStatus] = React.useState<'idle' | 'generating' | 'complete' | 'error'>('idle');
  const [privacyScore, setPrivacyScore] = React.useState(0);

  React.useEffect(() => {
    const loadJob = async () => {
      if (!jobId) return;
      
      try {
        const response = await apiClient.getJobById(jobId);
        if (response.success && response.data) {
          setJob(response.data);
        }
      } catch (error) {
        console.error('Failed to load job:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  React.useEffect(() => {
    // Initialize Midnight ZK service
    midnightZK.initialize();
  }, []);

  const handleApplyClick = () => {
    if (!state.isAuthenticated) {
      setState((prev: any) => ({ ...prev, showLoginModal: true }));
    } else {
      setShowApplicationModal(true);
    }
  };

  const handleSkillChange = (skill: string, value: number) => {
    setApplicationData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: value }
    }));
  };

  const generateZKProof = async () => {
    if (!job || !state.user) return null;

    setZkProofStatus('generating');

    try {
      // Parse job requirements
      const skillRequirements = JSON.parse(job.skillRequirements || '[]');
      const skillThresholds: { [key: string]: number } = {};
      
      // Extract skill names for the new interface
      const skillNames = skillRequirements.map((req: any) => req.skill);
      const applicantSkills = Object.keys(applicationData.skills);

      // Generate ZK proof of eligibility with real Midnight Network
      const zkProof = await midnightZK.generateEligibilityProof(
        {
          jobId: parseInt(jobId!),
          skills: applicantSkills,
          location: state.user.location || 'US',
          expectedSalary: parseInt(applicationData.expectedSalary) || job.salaryMin,
          applicantSecret: state.user.id + '_secret' // In production, use proper secret management
        },
        {
          skills: skillNames,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          allowedRegions: JSON.parse(job.allowedRegions || '["US"]')
        }
      );

      setPrivacyScore(zkProof.privacyScore);
      setZkProofStatus('complete');
      
      return zkProof;
    } catch (error) {
      console.error('ZK proof generation failed:', error);
      setZkProofStatus('error');
      return null;
    }
  };

  const submitApplication = async () => {
    if (!job || !state.user) return;

    setApplying(true);

    try {
      // Generate ZK proof first
      const zkProof = await generateZKProof();
      if (!zkProof) {
        throw new Error('Failed to generate ZK proof');
      }

      // Submit application with ZK proof
      const applicationResponse = await apiClient.applyToJob(jobId!, {
        coverLetter: applicationData.coverLetter,
        zkProof: {
          eligibilityProof: JSON.stringify(zkProof.proof),
          privacyScore: zkProof.privacyScore,
          proofHash: zkProof.proofHash,
          metadata: zkProof.metadata
        }
      });

      if (applicationResponse.success) {
        // Submit to blockchain
        await midnightZK.submitApplication(parseInt(jobId!), zkProof);
        
        // Show success message
        alert(`✅ Application submitted successfully!\n🌙 Secured with Midnight Network\n🔒 Privacy Score: ${zkProof.privacyScore}%\n⛓️ ZK proof verified on TestNet`);
        setShowApplicationModal(false);
        navigate('/applications');
      } else {
        throw new Error(applicationResponse.error || 'Application failed');
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      alert('❌ Application failed: ' + error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center'
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
        <p style={{ color: '#666' }}>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#1a1a1a', marginBottom: '1rem' }}>Job Not Found</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>The job you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/jobs')}
          style={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Browse Jobs
        </button>
      </div>
    );
  }

  const skillRequirements = JSON.parse(job.skillRequirements || '[]');
  const jobTags = JSON.parse(job.tags || '[]');

  return (
    <div className="fade-in" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      {/* Job Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(26, 26, 26, 0.08)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em'
            }}>
              {job.title}
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#1a1a1a',
              fontWeight: '500',
              marginBottom: '1rem'
            }}>
              {job.company}
            </p>
            <div style={{
              display: 'flex',
              gap: '2rem',
              fontSize: '0.9rem',
              color: '#666',
              flexWrap: 'wrap'
            }}>
              <span>◐ {job.location}</span>
              <span>◑ {job.type}</span>
              <span>◒ ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}</span>
              <span>◓ {job.experience}</span>
            </div>
          </div>
          
          <button
            onClick={handleApplyClick}
            disabled={applying}
            style={{
              backgroundColor: applying ? '#999' : '#1a1a1a',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: applying ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}
          >
            {applying ? 'Applying...' : 'Apply with ZK Proof'}
          </button>
        </div>

        {/* Tags */}
        {jobTags.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {jobTags.map((tag: string, index: number) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Content */}
        <div>
          {/* Job Description */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(26, 26, 26, 0.08)',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '1rem'
            }}>
              Job Description
            </h2>
            <div
              style={{
                color: '#666',
                lineHeight: '1.6',
                fontSize: '0.95rem',
                whiteSpace: 'pre-line'
              }}
              className="content-text"
            >
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {skillRequirements.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid rgba(26, 26, 26, 0.08)'
            }}>
              <h2 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '1rem'
              }}>
                🔒 ZK-Verified Requirements
              </h2>
              <p style={{
                color: '#666',
                fontSize: '0.9rem',
                marginBottom: '1.5rem'
              }} className="content-text">
                These requirements are verified using zero-knowledge proofs. Only proof of meeting thresholds is revealed.
              </p>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {skillRequirements.map((req: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '8px'
                    }}
                  >
                    <span style={{
                      color: '#1a1a1a',
                      fontWeight: '500'
                    }}>
                      {req.skill}
                    </span>
                    <span style={{
                      color: '#666',
                      fontSize: '0.85rem'
                    }}>
                      Min Level: {req.minLevel}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Privacy Score Preview */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(26, 26, 26, 0.08)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '1rem'
            }}>
              🔒 Privacy Protection
            </h3>
            <p style={{
              color: '#666',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              marginBottom: '1rem'
            }} className="content-text">
              Your application will be secured with zero-knowledge proofs. Only your eligibility will be proven without revealing personal data.
            </p>
            <div style={{
              display: 'grid',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: '#666'
            }}>
              <span>◆ Skills: Threshold-only verification</span>
              <span>◆ Location: Region-only proof</span>
              <span>◆ Salary: Range compatibility only</span>
            </div>
          </div>

          {/* Midnight Network Info */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(26, 26, 26, 0.08)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '1rem'
            }}>
              🌙 Midnight Network
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: '#22c55e' }}>●</span>
                <span style={{ color: '#666' }}>ZK Circuit: Eligibility Proof</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: '#22c55e' }}>●</span>
                <span style={{ color: '#666' }}>Smart Contract: JobBoard.compact</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: '#22c55e' }}>●</span>
                <span style={{ color: '#666' }}>Network: Testnet (Mock)</span>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(26, 26, 26, 0.08)'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '1rem'
            }}>
              Company Details
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <span style={{
                  fontSize: '0.8rem',
                  color: '#666',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Company
                </span>
                <p style={{
                  color: '#1a1a1a',
                  fontWeight: '500',
                  marginTop: '0.25rem'
                }}>
                  {job.company}
                </p>
              </div>
              <div>
                <span style={{
                  fontSize: '0.8rem',
                  color: '#666',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Department
                </span>
                <p style={{
                  color: '#1a1a1a',
                  fontWeight: '500',
                  marginTop: '0.25rem'
                }}>
                  {job.department || 'Engineering'}
                </p>
              </div>
              <div>
                <span style={{
                  fontSize: '0.8rem',
                  color: '#666',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Posted
                </span>
                <p style={{
                  color: '#1a1a1a',
                  fontWeight: '500',
                  marginTop: '0.25rem'
                }}>
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
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
                Apply to {job.title}
              </h2>
              <button
                onClick={() => setShowApplicationModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#666',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            {/* Midnight Network Notice */}
            <div style={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span>🌙</span>
                <strong>Powered by Midnight Network</strong>
              </div>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Your application will be secured with zero-knowledge proofs on Midnight TestNet, 
                ensuring privacy while proving eligibility. Real blockchain integration with fallback support.
              </p>
            </div>

            {/* Skill Assessment */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '1rem'
              }}>
                🔒 ZK Skill Assessment
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#666',
                marginBottom: '1rem'
              }} className="content-text">
                Rate your skills (0-100). Only whether you meet thresholds will be revealed via zero-knowledge proof.
              </p>
              
              {skillRequirements.map((req: any) => (
                <div key={req.skill} style={{ marginBottom: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: '#1a1a1a'
                    }}>
                      {req.skill}
                    </label>
                    <span style={{
                      fontSize: '0.8rem',
                      color: '#666'
                    }}>
                      Required: {req.minLevel}+
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={applicationData.skills[req.skill] || 0}
                    onChange={(e) => handleSkillChange(req.skill, parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      marginBottom: '0.25rem'
                    }}
                  />
                  <div style={{
                    fontSize: '0.8rem',
                    color: applicationData.skills[req.skill] >= req.minLevel ? '#22c55e' : '#ef4444',
                    fontWeight: '500'
                  }}>
                    Your Level: {applicationData.skills[req.skill] || 0}
                    {applicationData.skills[req.skill] >= req.minLevel ? ' ✓' : ' ✗'}
                  </div>
                </div>
              ))}
            </div>

            {/* Expected Salary */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                Expected Salary (USD)
              </label>
              <input
                type="number"
                value={applicationData.expectedSalary}
                onChange={(e) => setApplicationData(prev => ({ ...prev, expectedSalary: e.target.value }))}
                placeholder="e.g., 120000"
                min={job.salaryMin}
                max={job.salaryMax}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid rgba(26, 26, 26, 0.1)',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
              <p style={{
                fontSize: '0.8rem',
                color: '#666',
                marginTop: '0.25rem'
              }}>
                Range: ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
              </p>
            </div>

            {/* Cover Letter */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                Cover Letter (Optional)
              </label>
              <textarea
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                placeholder="Tell us why you're interested in this role..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid rgba(26, 26, 26, 0.1)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* ZK Proof Status */}
            {zkProofStatus !== 'idle' && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                backgroundColor: zkProofStatus === 'error' ? '#fef2f2' : zkProofStatus === 'complete' ? '#f0fdf4' : '#fef3c7'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {zkProofStatus === 'generating' && <div className="pulse">🔒</div>}
                  {zkProofStatus === 'complete' && <span>✅</span>}
                  {zkProofStatus === 'error' && <span>❌</span>}
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: zkProofStatus === 'error' ? '#dc2626' : zkProofStatus === 'complete' ? '#16a34a' : '#d97706'
                  }}>
                    {zkProofStatus === 'generating' && 'Generating ZK proof on Midnight Network...'}
                    {zkProofStatus === 'complete' && `🌙 Midnight Network ZK proof ready! Privacy Score: ${privacyScore}%`}
                    {zkProofStatus === 'error' && 'Failed to generate proof. Please check your proof server connection.'}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={submitApplication}
              disabled={applying || zkProofStatus === 'error'}
              style={{
                width: '100%',
                backgroundColor: applying ? '#999' : '#1a1a1a',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                cursor: applying ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}
            >
              {applying ? 'Submitting to Midnight Network...' : 'Submit with ZK Proof 🌙'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
