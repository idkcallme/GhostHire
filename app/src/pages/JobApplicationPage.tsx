import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MidnightClient } from "../services/midnightClient";
import { apiClient, Job } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/JobApplicationPage.css';

const midnightClient = new MidnightClient();

export function JobApplicationPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proofProgress, setProofProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [proofs, setProofs] = useState({
    educationProof: '',
    salaryProof: '',
    experienceProof: '',
    clearanceProof: ''
  });

  // Load job data on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    const loadJob = async () => {
      if (!jobId) {
        setError('Job ID not provided');
        setIsLoadingJob(false);
        return;
      }

      try {
        setIsLoadingJob(true);
        const jobData = await apiClient.getJob(jobId);
        setJob(jobData);
      } catch (err) {
        console.error('Failed to load job:', err);
        setError('Failed to load job details');
      } finally {
        setIsLoadingJob(false);
      }
    };

    loadJob();
  }, [jobId, isAuthenticated, navigate]);

  // Update personal info when user data changes
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: ''
      });
    }
  }, [user]);

  // Loading state
  if (!isAuthenticated || isLoadingJob) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error || 'Job not found'}</p>
        <button onClick={() => navigate('/jobs')} className="btn-primary">
          Back to Jobs
        </button>
      </div>
    );
  }

  const generateZKProofs = async () => {
    if (!job) return;

    setIsGeneratingProof(true);
    setProofProgress(0);

    try {
      const zkRequirements = job.zkRequirements || {
        requiresEducationProof: false,
        requiresSalaryProof: false,
        requiresExperienceProof: false,
        requiresClearanceProof: false
      };
      const newProofs = { ...proofs };

      // Generate education proof if required
      if (zkRequirements.requiresEducationProof) {
        setProofProgress(25);
        const eduProof = await midnightClient.generateEducationProof({
          hasRequiredDegree: true,
          degreeLevel: 'Bachelor',
          fieldOfStudy: 'Computer Science'
        });
        newProofs.educationProof = eduProof.proof;
      }

      // Generate salary proof if required
      if (zkRequirements.requiresSalaryProof) {
        setProofProgress(50);
        const salProof = await midnightClient.generateSalaryProof({
          minimumSalary: 80000,
          actualSalary: 120000
        });
        newProofs.salaryProof = salProof.proof;
      }

      // Generate experience proof if required
      if (zkRequirements.requiresExperienceProof) {
        setProofProgress(75);
        const expProof = await midnightClient.generateExperienceProof({
          yearsOfExperience: 5,
          hasRelevantExperience: true,
          skillAreas: ['JavaScript', 'React', 'Node.js']
        });
        newProofs.experienceProof = expProof.proof;
      }

      // Generate clearance proof if required
      if (zkRequirements.requiresClearanceProof) {
        setProofProgress(90);
        const clrProof = await midnightClient.generateClearanceProof({
          hasClearance: true,
          clearanceLevel: 'Secret',
          backgroundCheckPassed: true
        });
        newProofs.clearanceProof = clrProof.proof;
      }

      setProofs(newProofs);
      setProofProgress(100);
      
      // Auto-advance to next step after successful proof generation
      setTimeout(() => {
        setCurrentStep(3);
        setIsGeneratingProof(false);
      }, 1000);

    } catch (err) {
      console.error('Failed to generate proofs:', err);
      setError('Failed to generate ZK proofs. Please try again.');
      setIsGeneratingProof(false);
    }
  };

  const submitApplication = async () => {
    if (!job || !user) return;

    setIsSubmitting(true);
    try {
      const applicationData = {
        jobId: job.id,
        personalInfo,
        proofs
      };

      const submittedApplication = await apiClient.submitApplication(applicationData);
      
      // Navigate to confirmation page with application ID
      navigate(`/application-confirmation/${submittedApplication.id}`);
      
    } catch (err) {
      console.error('Failed to submit application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="progress-stepper">
      {[1, 2, 3].map((step) => (
        <div key={step} className="progress-step-container">
          <div className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
            {currentStep > step ? '✓' : step}
          </div>
          <span className="progress-label">
            {step === 1 ? 'Personal Info' : step === 2 ? 'ZK Proofs' : 'Review & Submit'}
          </span>
          {step < 3 && <div className="progress-connector"></div>}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfoStep = () => (
    <div className="form-step">
      <h2>Personal Information</h2>
      <p>Please provide your basic information for this application.</p>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
            required
            className="form-input"
            placeholder="Enter your first name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
            required
            className="form-input"
            placeholder="Enter your last name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
            required
            className="form-input"
            placeholder="Enter your email address"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
            className="form-input"
            placeholder="Enter your phone number"
          />
        </div>
      </div>
      
      <div className="step-actions">
        <button 
          onClick={() => setCurrentStep(2)}
          disabled={!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email}
          className="btn-primary"
        >
          Continue to ZK Proofs
        </button>
      </div>
    </div>
  );

  const renderZKProofStep = () => (
    <div className="form-step">
      <h2>Zero-Knowledge Proof Generation</h2>
      <p>Generate privacy-preserving proofs to verify your qualifications without revealing personal data.</p>
      
      <div className="zk-requirements">
        <h3>Required Proofs for this Position:</h3>
        <ul>
          {job?.zkRequirements?.requiresEducationProof && <li>✓ Education Verification</li>}
          {job?.zkRequirements?.requiresSalaryProof && <li>✓ Salary History Verification</li>}
          {job?.zkRequirements?.requiresExperienceProof && <li>✓ Experience Verification</li>}
          {job?.zkRequirements?.requiresClearanceProof && <li>✓ Security Clearance Verification</li>}
        </ul>
      </div>

      {isGeneratingProof ? (
        <div className="proof-generation">
          <div className="proof-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill-dynamic" 
                style={{ width: `${proofProgress}%` }}
              ></div>
            </div>
            <p>Generating proofs... {proofProgress}%</p>
          </div>
          <p className="proof-info">
            🔐 Your personal data is being processed locally using advanced cryptography. 
            No sensitive information leaves your device.
          </p>
        </div>
      ) : (
        <div className="step-actions">
          <button onClick={() => setCurrentStep(1)} className="btn-secondary">
            Back
          </button>
          <button onClick={generateZKProofs} className="btn-primary">
            Generate ZK Proofs
          </button>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="form-step">
      <h2>Review & Submit Application</h2>
      <p>Please review your application details before submitting.</p>
      
      <div className="review-section">
        <h3>Job Details</h3>
        <div className="review-item">
          <strong>{job?.title}</strong> at {job?.company}
        </div>
        
        <h3>Personal Information</h3>
        <div className="review-item">
          <strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}
        </div>
        <div className="review-item">
          <strong>Email:</strong> {personalInfo.email}
        </div>
        {personalInfo.phone && (
          <div className="review-item">
            <strong>Phone:</strong> {personalInfo.phone}
          </div>
        )}
        
        <h3>Zero-Knowledge Proofs</h3>
        <div className="proof-status">
          {proofs.educationProof && <div className="proof-item">✅ Education proof generated</div>}
          {proofs.salaryProof && <div className="proof-item">✅ Salary proof generated</div>}
          {proofs.experienceProof && <div className="proof-item">✅ Experience proof generated</div>}
          {proofs.clearanceProof && <div className="proof-item">✅ Clearance proof generated</div>}
        </div>
      </div>
      
      <div className="step-actions">
        <button onClick={() => setCurrentStep(2)} className="btn-secondary" disabled={isSubmitting}>
          Back
        </button>
        <button 
          onClick={submitApplication} 
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="job-application-page">
      <div className="application-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>Apply for {job.title}</h1>
        <p>at {job.company}</p>
      </div>

      {renderProgressBar()}

      <div className="application-content">
        {currentStep === 1 && renderPersonalInfoStep()}
        {currentStep === 2 && renderZKProofStep()}
        {currentStep === 3 && renderReviewStep()}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="error-dismiss">×</button>
        </div>
      )}
    </div>
  );
}