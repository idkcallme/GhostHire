import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, User, FileText, MapPin, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useSimpleTheme } from '../components/SimpleThemeProvider';

interface Job {
  id: number;
  title: string;
  company: string;
  thresholds: { rust: number; typescript: number; zk: number };
  allowedRegions: string[];
  salaryMin: number;
  salaryMax: number;
}

interface UserProof {
  rust: number;
  typescript: number;
  zk: number;
  region: string;
}

export function SimpleApplyPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { theme } = useSimpleTheme();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    coverLetter: '',
    portfolio: '',
    resume: null as File | null
  });

  // Mock user skills (would come from ZK proof)
  const [userProof, setUserProof] = useState<UserProof>({
    rust: 75,
    typescript: 80,
    zk: 65,
    region: 'US-CA'
  });

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1917' : '#ffffff';
  const textColor = isDark ? '#f5f5f4' : '#1a1917';
  const cardBg = isDark ? '#2a2827' : '#f8f9fa';
  const borderColor = isDark ? '#3a3937' : '#e5e5e5';
  const primaryColor = '#5B8CFF';
  const successColor = '#10b981';
  const errorColor = '#ef4444';

  // Mock job data
  const mockJobs: Record<string, Job> = {
    '1': {
      id: 1,
      title: "Senior Rust Developer",
      company: "BlockTech Solutions",
      thresholds: { rust: 80, typescript: 60, zk: 70 },
      allowedRegions: ["US-CA", "US-NY", "CA-ON"],
      salaryMin: 120000,
      salaryMax: 180000
    },
    '2': {
      id: 2,
      title: "ZK Protocol Engineer",
      company: "Privacy Labs",
      thresholds: { rust: 70, typescript: 50, zk: 90 },
      allowedRegions: ["US-CA", "UK-LON", "DE-BER"],
      salaryMin: 140000,
      salaryMax: 200000
    }
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      if (jobId && mockJobs[jobId]) {
        setJob(mockJobs[jobId]);
      } else {
        setError('Job not found');
      }
      setIsLoading(false);
    }, 500);
  }, [jobId]);

  const checkEligibility = () => {
    if (!job) return { eligible: false, reasons: ['Job not found'] };
    
    const reasons: string[] = [];
    
    // Check skills
    if (userProof.rust < job.thresholds.rust) {
      reasons.push(`Rust skill level ${userProof.rust} is below required ${job.thresholds.rust}`);
    }
    if (userProof.typescript < job.thresholds.typescript) {
      reasons.push(`TypeScript skill level ${userProof.typescript} is below required ${job.thresholds.typescript}`);
    }
    if (userProof.zk < job.thresholds.zk) {
      reasons.push(`Zero-Knowledge skill level ${userProof.zk} is below required ${job.thresholds.zk}`);
    }
    
    // Check region
    if (!job.allowedRegions.includes(userProof.region)) {
      reasons.push(`Region ${userProof.region} is not in allowed regions`);
    }
    
    return {
      eligible: reasons.length === 0,
      reasons
    };
  };

  const eligibility = checkEligibility();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, resume: file }));
  };

  const handleSubmit = async () => {
    if (!eligibility.eligible) return;
    
    setIsSubmitting(true);
    
    // Simulate application submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    // Navigate to success page
    navigate('/applications');
  };

  const getSkillStatus = (userLevel: number, requiredLevel: number) => {
    const meetsRequirement = userLevel >= requiredLevel;
    return {
      meets: meetsRequirement,
      color: meetsRequirement ? successColor : errorColor,
      icon: meetsRequirement ? CheckCircle : AlertCircle
    };
  };

  if (isLoading) {
    return (
      <div style={{ 
        backgroundColor: bgColor, 
        color: textColor, 
        padding: '60px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${borderColor}`,
          borderTop: `3px solid ${primaryColor}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={{ backgroundColor: bgColor, color: textColor, padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>
          Application Error
        </h2>
        <p style={{ opacity: '0.7', marginBottom: '24px' }}>
          {error || 'Job not found'}
        </p>
        <Link 
          to="/jobs"
          style={{
            backgroundColor: primaryColor,
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, padding: '32px 24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Back Button */}
      <Link 
        to={`/jobs/${job.id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: primaryColor,
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '24px'
        }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to Job Details
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield style={{ width: '32px', height: '32px', color: primaryColor }} />
          Apply for {job.title}
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: '0.8' }}>
          at {job.company}
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{
        backgroundColor: cardBg,
        padding: '24px',
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {[
            { step: 1, label: 'Verify Eligibility', icon: Shield },
            { step: 2, label: 'Application Details', icon: FileText },
            { step: 3, label: 'Submit Application', icon: CheckCircle }
          ].map(({ step, label, icon: Icon }) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: currentStep >= step ? primaryColor : borderColor,
                color: currentStep >= step ? 'white' : textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {currentStep > step ? <CheckCircle style={{ width: '16px', height: '16px' }} /> : step}
              </div>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                color: currentStep >= step ? textColor : `${textColor}80`
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Eligibility Check */}
      {currentStep === 1 && (
        <div style={{
          backgroundColor: cardBg,
          padding: '32px',
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>
            ZK Proof Verification
          </h2>
          <p style={{ fontSize: '14px', opacity: '0.7', marginBottom: '24px' }}>
            Your skills and eligibility are verified using zero-knowledge proofs to maintain privacy.
          </p>

          {/* Eligibility Status */}
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: eligibility.eligible ? `${successColor}10` : `${errorColor}10`,
            border: `1px solid ${eligibility.eligible ? successColor : errorColor}30`,
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {eligibility.eligible ? (
                <CheckCircle style={{ width: '20px', height: '20px', color: successColor }} />
              ) : (
                <AlertCircle style={{ width: '20px', height: '20px', color: errorColor }} />
              )}
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                {eligibility.eligible ? 'Eligible to Apply' : 'Not Eligible'}
              </h3>
            </div>
            {!eligibility.eligible && (
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {eligibility.reasons.map((reason, index) => (
                  <li key={index} style={{ fontSize: '14px', color: errorColor, marginBottom: '4px' }}>
                    {reason}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Skill Requirements vs User Skills */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
              Skill Verification
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(job.thresholds).map(([skill, required]) => {
                const userLevel = userProof[skill as keyof UserProof] as number;
                const status = getSkillStatus(userLevel, required);
                const Icon = status.icon;
                
                return (
                  <div key={skill} style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `1px solid ${status.color}30`,
                    backgroundColor: `${status.color}10`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: status.color }}>
                          Your Level: {userLevel} / Required: {required}
                        </span>
                        <Icon style={{ width: '16px', height: '16px', color: status.color }} />
                      </div>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: `${status.color}20`,
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min((userLevel / required) * 100, 100)}%`,
                        height: '100%',
                        backgroundColor: status.color,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Region Check */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
              Location Verification
            </h3>
            <div style={{
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${job.allowedRegions.includes(userProof.region) ? successColor : errorColor}30`,
              backgroundColor: `${job.allowedRegions.includes(userProof.region) ? successColor : errorColor}10`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <MapPin style={{ 
                width: '20px', 
                height: '20px', 
                color: job.allowedRegions.includes(userProof.region) ? successColor : errorColor 
              }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                  Your Region: {userProof.region}
                </p>
                <p style={{ fontSize: '12px', opacity: '0.7' }}>
                  {job.allowedRegions.includes(userProof.region) 
                    ? 'Eligible for this position' 
                    : `Not in allowed regions: ${job.allowedRegions.join(', ')}`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => eligibility.eligible && setCurrentStep(2)}
            disabled={!eligibility.eligible}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: eligibility.eligible ? primaryColor : borderColor,
              color: eligibility.eligible ? 'white' : `${textColor}60`,
              fontSize: '16px',
              fontWeight: '600',
              cursor: eligibility.eligible ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {eligibility.eligible ? 'Continue to Application' : 'Requirements Not Met'}
            {eligibility.eligible && <CheckCircle style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>
      )}

      {/* Step 2: Application Form */}
      {currentStep === 2 && (
        <div style={{
          backgroundColor: cardBg,
          padding: '32px',
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>
            Application Details
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  backgroundColor: bgColor,
                  color: textColor,
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  backgroundColor: bgColor,
                  color: textColor,
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Portfolio */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Portfolio/GitHub URL
              </label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                placeholder="https://github.com/yourname or portfolio URL"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  backgroundColor: bgColor,
                  color: textColor,
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Resume (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  backgroundColor: bgColor,
                  color: textColor,
                  fontSize: '14px'
                }}
              />
              {formData.resume && (
                <p style={{ fontSize: '12px', color: successColor, marginTop: '4px' }}>
                  ✓ {formData.resume.name}
                </p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Cover Letter
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                placeholder="Tell us why you're interested in this position..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  backgroundColor: bgColor,
                  color: textColor,
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button
              onClick={() => setCurrentStep(1)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                backgroundColor: 'transparent',
                color: textColor,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!formData.fullName || !formData.email}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: (formData.fullName && formData.email) ? primaryColor : borderColor,
                color: (formData.fullName && formData.email) ? 'white' : `${textColor}60`,
                fontSize: '14px',
                fontWeight: '600',
                cursor: (formData.fullName && formData.email) ? 'pointer' : 'not-allowed'
              }}
            >
              Review Application
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review and Submit */}
      {currentStep === 3 && (
        <div style={{
          backgroundColor: cardBg,
          padding: '32px',
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>
            Review Your Application
          </h2>

          {/* Application Summary */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
              Application Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', opacity: '0.7' }}>Full Name:</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{formData.fullName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', opacity: '0.7' }}>Email:</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{formData.email}</span>
              </div>
              {formData.portfolio && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', opacity: '0.7' }}>Portfolio:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{formData.portfolio}</span>
                </div>
              )}
              {formData.resume && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', opacity: '0.7' }}>Resume:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{formData.resume.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: `${primaryColor}10`,
            border: `1px solid ${primaryColor}30`,
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Shield style={{ width: '20px', height: '20px', color: primaryColor }} />
              <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Privacy Protection</h4>
            </div>
            <p style={{ fontSize: '12px', opacity: '0.8', margin: 0 }}>
              Your skills have been verified using zero-knowledge proofs. The employer will only see that you meet the requirements, not your exact skill levels.
            </p>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setCurrentStep(2)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                backgroundColor: 'transparent',
                color: textColor,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Back to Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                flex: 2,
                padding: '16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isSubmitting ? borderColor : primaryColor,
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Application
                  <CheckCircle style={{ width: '20px', height: '20px' }} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
