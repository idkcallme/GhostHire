import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, CreateJobData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/JobPostingPage.css';

export function JobPostingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [jobData, setJobData] = useState<CreateJobData>({
    title: '',
    company: user?.company || '',
    description: '',
    skillRequirements: {},
    salaryMin: 50000,
    salaryMax: 150000,
    allowedRegions: ['Remote'],
    tags: [],
    remote: true,
    experience: undefined,
    department: ''
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentThreshold, setCurrentThreshold] = useState(70);
  const [currentTag, setCurrentTag] = useState('');

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please sign in to post a job.</p>
        <button onClick={() => navigate('/auth/login')} className="btn-primary">
          Sign In
        </button>
      </div>
    );
  }

  // Check if user is employer
  if (user?.role !== 'employer') {
    return (
      <div className="role-required">
        <h2>Employer Account Required</h2>
        <p>Only employers can post jobs. Please contact support if you need to upgrade your account.</p>
        <button onClick={() => navigate('/jobs')} className="btn-primary">
          Browse Jobs Instead
        </button>
      </div>
    );
  }

  const addSkillRequirement = () => {
    if (currentSkill.trim() && !jobData.skillRequirements[currentSkill.trim()]) {
      setJobData({
        ...jobData,
        skillRequirements: {
          ...jobData.skillRequirements,
          [currentSkill.trim()]: currentThreshold
        }
      });
      setCurrentSkill('');
      setCurrentThreshold(70);
    }
  };

  const removeSkillRequirement = (skill: string) => {
    const newSkills = { ...jobData.skillRequirements };
    delete newSkills[skill];
    setJobData({
      ...jobData,
      skillRequirements: newSkills
    });
  };

  const addTag = () => {
    if (currentTag.trim() && !jobData.tags!.includes(currentTag.trim())) {
      setJobData({
        ...jobData,
        tags: [...(jobData.tags || []), currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    setJobData({
      ...jobData,
      tags: jobData.tags!.filter((_, i) => i !== index)
    });
  };

  const submitJob = async () => {
    if (!jobData.title || !jobData.description || !jobData.company) {
      setError('Please fill in all required fields');
      return;
    }

    if (Object.keys(jobData.skillRequirements).length === 0) {
      setError('Please add at least one skill requirement');
      return;
    }

    if (jobData.salaryMax <= jobData.salaryMin) {
      setError('Maximum salary must be greater than minimum salary');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.createJob(jobData);
      navigate(`/jobs`);
    } catch (err: any) {
      console.error('Failed to create job:', err);
      setError(err.message || 'Failed to create job posting');
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
            {step === 1 ? 'Job Details' : step === 2 ? 'Requirements' : 'Final Review'}
          </span>
          {step < 3 && <div className="progress-connector"></div>}
        </div>
      ))}
    </div>
  );

  const renderJobDetailsStep = () => (
    <div className="form-step">
      <h2>Job Details</h2>
      <p>Provide the basic information about this job posting.</p>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="title">Job Title *</label>
          <input
            id="title"
            type="text"
            value={jobData.title}
            onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
            placeholder="e.g. Senior Software Engineer"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company *</label>
          <input
            id="company"
            type="text"
            value={jobData.company}
            onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
            placeholder="Your company name"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            type="text"
            value={jobData.department || ''}
            onChange={(e) => setJobData({ ...jobData, department: e.target.value })}
            placeholder="e.g. Engineering, Marketing"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience Level</label>
          <select
            id="experience"
            value={jobData.experience || ''}
            onChange={(e) => setJobData({ ...jobData, experience: e.target.value as any })}
            className="form-input"
          >
            <option value="">Select level</option>
            <option value="JUNIOR">Junior (0-2 years)</option>
            <option value="MID">Mid-level (2-5 years)</option>
            <option value="SENIOR">Senior (5+ years)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="salaryMin">Minimum Salary ($) *</label>
          <input
            id="salaryMin"
            type="number"
            value={jobData.salaryMin}
            onChange={(e) => setJobData({ ...jobData, salaryMin: parseInt(e.target.value) || 0 })}
            placeholder="50000"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="salaryMax">Maximum Salary ($) *</label>
          <input
            id="salaryMax"
            type="number"
            value={jobData.salaryMax}
            onChange={(e) => setJobData({ ...jobData, salaryMax: parseInt(e.target.value) || 0 })}
            placeholder="150000"
            className="form-input"
            required
          />
        </div>

        <div className="form-group form-group-full">
          <label>
            <input
              type="checkbox"
              checked={jobData.remote || false}
              onChange={(e) => setJobData({ ...jobData, remote: e.target.checked })}
            />
            This is a remote position
          </label>
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="description">Job Description *</label>
          <textarea
            id="description"
            value={jobData.description}
            onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
            className="form-textarea"
            rows={6}
            required
          />
        </div>
      </div>
      
      <div className="step-actions">
        <button 
          onClick={() => setCurrentStep(2)}
          disabled={!jobData.title || !jobData.company || !jobData.description || jobData.salaryMax <= jobData.salaryMin}
          className="btn-primary"
        >
          Continue to Requirements
        </button>
      </div>
    </div>
  );

  const renderRequirementsStep = () => (
    <div className="form-step">
      <h2>Skills & Requirements</h2>
      <p>Specify the skills, experience, and qualifications needed for this role.</p>
      
      <div className="requirements-input">
        <label htmlFor="skill">Add Skill Requirements</label>
        <div className="skill-input-group">
          <input
            id="skill"
            type="text"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            placeholder="e.g. React, Python, Project Management"
            className="form-input"
            onKeyPress={(e) => e.key === 'Enter' && addSkillRequirement()}
          />
          <input
            type="number"
            value={currentThreshold}
            onChange={(e) => setCurrentThreshold(parseInt(e.target.value) || 0)}
            min="0"
            max="100"
            placeholder="Skill level (0-100)"
            className="form-input skill-threshold"
          />
          <button type="button" onClick={addSkillRequirement} className="btn-secondary">
            Add
          </button>
        </div>
      </div>

      {Object.keys(jobData.skillRequirements).length > 0 && (
        <div className="requirements-list">
          <h3>Current Skill Requirements:</h3>
          <div className="requirement-tags">
            {Object.entries(jobData.skillRequirements).map(([skill, threshold]) => (
              <div key={skill} className="requirement-tag">
                <span>{skill} (Level: {threshold})</span>
                <button 
                  type="button"
                  onClick={() => removeSkillRequirement(skill)}
                  className="requirement-remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="requirements-input">
        <label htmlFor="tag">Add Tags (Optional)</label>
        <div className="requirement-input-group">
          <input
            id="tag"
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="e.g. startup, fintech, healthcare"
            className="form-input"
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <button type="button" onClick={addTag} className="btn-secondary">
            Add Tag
          </button>
        </div>
      </div>

      {(jobData.tags?.length || 0) > 0 && (
        <div className="requirements-list">
          <h3>Tags:</h3>
          <div className="requirement-tags">
            {jobData.tags!.map((tag, index) => (
              <div key={index} className="requirement-tag">
                <span>{tag}</span>
                <button 
                  type="button"
                  onClick={() => removeTag(index)}
                  className="requirement-remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="step-actions">
        <button onClick={() => setCurrentStep(1)} className="btn-secondary">
          Back
        </button>
        <button 
          onClick={() => setCurrentStep(3)}
          disabled={Object.keys(jobData.skillRequirements).length === 0}
          className="btn-primary"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="form-step">
      <h2>Review & Publish</h2>
      <p>Review your job posting before publishing it.</p>
      
      <div className="job-preview">
        <div className="preview-section">
          <h3>Job Overview</h3>
          <div className="preview-field">
            <strong>Title:</strong> {jobData.title}
          </div>
          <div className="preview-field">
            <strong>Company:</strong> {jobData.company}
          </div>
          <div className="preview-field">
            <strong>Salary:</strong> ${jobData.salaryMin.toLocaleString()} - ${jobData.salaryMax.toLocaleString()}
          </div>
          <div className="preview-field">
            <strong>Remote:</strong> {jobData.remote ? 'Yes' : 'No'}
          </div>
          {jobData.experience && (
            <div className="preview-field">
              <strong>Experience Level:</strong> {jobData.experience}
            </div>
          )}
          {jobData.department && (
            <div className="preview-field">
              <strong>Department:</strong> {jobData.department}
            </div>
          )}
        </div>

        <div className="preview-section">
          <h3>Description</h3>
          <div className="preview-description">
            {jobData.description}
          </div>
        </div>

        <div className="preview-section">
          <h3>Required Skills</h3>
          <div className="requirement-tags">
            {Object.entries(jobData.skillRequirements).map(([skill, threshold]) => (
              <div key={skill} className="requirement-tag">
                {skill} (Level: {threshold})
              </div>
            ))}
          </div>
        </div>

        {(jobData.tags?.length || 0) > 0 && (
          <div className="preview-section">
            <h3>Tags</h3>
            <div className="requirement-tags">
              {jobData.tags!.map((tag, index) => (
                <div key={index} className="requirement-tag tag-preview">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="step-actions">
        <button onClick={() => setCurrentStep(2)} className="btn-secondary" disabled={isSubmitting}>
          Back
        </button>
        <button 
          onClick={submitJob}
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Publishing Job...' : 'Publish Job'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="job-posting-page">
      <div className="posting-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>Post a New Job</h1>
        <p>Create a comprehensive job posting with skill requirements and competitive compensation</p>
      </div>

      {renderProgressBar()}

      <div className="posting-content">
        {currentStep === 1 && renderJobDetailsStep()}
        {currentStep === 2 && renderRequirementsStep()}
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
