import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, DollarSign, Briefcase, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useSimpleTheme } from '../components/SimpleThemeProvider';

interface JobFormData {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryMin: string;
  salaryMax: string;
  allowedRegions: string[];
  thresholds: {
    rust: string;
    typescript: string;
    zk: string;
  };
}

export function SimplePostJobPage() {
  const navigate = useNavigate();
  const { theme } = useSimpleTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState('basic');
  
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    salaryMin: '',
    salaryMax: '',
    allowedRegions: [],
    thresholds: {
      rust: '',
      typescript: '',
      zk: ''
    }
  });

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1917' : '#ffffff';
  const textColor = isDark ? '#f5f5f4' : '#1a1917';
  const cardBg = isDark ? '#2a2827' : '#f8f9fa';
  const borderColor = isDark ? '#3a3937' : '#e5e5e5';
  const primaryColor = '#5B8CFF';
  const successColor = '#10b981';
  const errorColor = '#ef4444';

  const regions = [
    { code: 'US-CA', name: 'California, USA' },
    { code: 'US-NY', name: 'New York, USA' },
    { code: 'CA-ON', name: 'Ontario, Canada' },
    { code: 'UK-LON', name: 'London, UK' },
    { code: 'DE-BER', name: 'Berlin, Germany' },
    { code: 'JP-TKY', name: 'Tokyo, Japan' },
    { code: 'AU-SYD', name: 'Sydney, Australia' },
  ];

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThresholdChange = (skill: keyof typeof formData.thresholds, value: string) => {
    setFormData(prev => ({
      ...prev,
      thresholds: { ...prev.thresholds, [skill]: value }
    }));
  };

  const handleListChange = (field: 'requirements' | 'responsibilities' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addListItem = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleRegionToggle = (regionCode: string) => {
    setFormData(prev => ({
      ...prev,
      allowedRegions: prev.allowedRegions.includes(regionCode)
        ? prev.allowedRegions.filter(r => r !== regionCode)
        : [...prev.allowedRegions, regionCode]
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push('Job title is required');
    if (!formData.company.trim()) errors.push('Company name is required');
    if (!formData.description.trim()) errors.push('Job description is required');
    if (!formData.salaryMin || !formData.salaryMax) errors.push('Salary range is required');
    if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) errors.push('Maximum salary must be higher than minimum');
    if (formData.allowedRegions.length === 0) errors.push('At least one region must be selected');
    if (!formData.thresholds.rust || !formData.thresholds.typescript || !formData.thresholds.zk) {
      errors.push('All skill thresholds are required');
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    
    // Simulate job posting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    navigate('/jobs');
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Briefcase },
    { id: 'details', label: 'Job Details', icon: Shield },
    { id: 'requirements', label: 'Skills & Location', icon: CheckCircle }
  ];

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back Button */}
      <Link 
        to="/jobs"
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
        Back to Jobs
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Plus style={{ width: '32px', height: '32px', color: primaryColor }} />
          Post a New Job
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: '0.8' }}>
          Create a job posting with privacy-preserving skill verification
        </p>
      </div>

      {/* Section Navigation */}
      <div style={{
        backgroundColor: cardBg,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentSection(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: currentSection === id ? primaryColor : 'transparent',
                color: currentSection === id ? 'white' : textColor,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                opacity: currentSection === id ? 1 : 0.7
              }}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Basic Info Section */}
      {currentSection === 'basic' && (
        <div style={{
          backgroundColor: cardBg,
          padding: '32px',
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>
            Basic Information
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Job Title */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Senior Rust Developer"
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

            {/* Company */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g., BlockTech Solutions"
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

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the role, what the candidate will be working on, and why they should be excited about this opportunity..."
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

            {/* Salary Range */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Salary Range (USD) *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                  placeholder="Minimum salary"
                  style={{
                    padding: '12px 16px',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    backgroundColor: bgColor,
                    color: textColor,
                    fontSize: '14px'
                  }}
                />
                <input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                  placeholder="Maximum salary"
                  style={{
                    padding: '12px 16px',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    backgroundColor: bgColor,
                    color: textColor,
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentSection('details')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: primaryColor,
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '24px'
            }}
          >
            Continue to Job Details
          </button>
        </div>
      )}

      {/* Job Details Section */}
      {currentSection === 'details' && (
        <div style={{
          backgroundColor: cardBg,
          padding: '32px',
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>
            Job Details
          </h2>

          {/* Requirements */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
              Requirements
            </label>
            {formData.requirements.map((req, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleListChange('requirements', index, e.target.value)}
                  placeholder="e.g., 5+ years of Rust development experience"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '6px',
                    backgroundColor: bgColor,
                    color: textColor,
                    fontSize: '14px'
                  }}
                />
                {formData.requirements.length > 1 && (
                  <button
                    onClick={() => removeListItem('requirements', index)}
                    style={{
                      padding: '8px',
                      border: `1px solid ${errorColor}`,
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      color: errorColor,
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addListItem('requirements')}
              style={{
                padding: '8px 16px',
                border: `1px dashed ${borderColor}`,
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: textColor,
                fontSize: '12px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              + Add Requirement
            </button>
          </div>

          {/* Responsibilities */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
              Responsibilities
            </label>
            {formData.responsibilities.map((resp, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleListChange('responsibilities', index, e.target.value)}
                  placeholder="e.g., Design and implement core blockchain protocols"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '6px',
                    backgroundColor: bgColor,
                    color: textColor,
                    fontSize: '14px'
                  }}
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    onClick={() => removeListItem('responsibilities', index)}
                    style={{
                      padding: '8px',
                      border: `1px solid ${errorColor}`,
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      color: errorColor,
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addListItem('responsibilities')}
              style={{
                padding: '8px 16px',
                border: `1px dashed ${borderColor}`,
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: textColor,
                fontSize: '12px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              + Add Responsibility
            </button>
          </div>

          {/* Benefits */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
              Benefits
            </label>
            {formData.benefits.map((benefit, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleListChange('benefits', index, e.target.value)}
                  placeholder="e.g., Competitive salary and equity package"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '6px',
                    backgroundColor: bgColor,
                    color: textColor,
                    fontSize: '14px'
                  }}
                />
                {formData.benefits.length > 1 && (
                  <button
                    onClick={() => removeListItem('benefits', index)}
                    style={{
                      padding: '8px',
                      border: `1px solid ${errorColor}`,
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      color: errorColor,
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addListItem('benefits')}
              style={{
                padding: '8px 16px',
                border: `1px dashed ${borderColor}`,
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: textColor,
                fontSize: '12px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              + Add Benefit
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setCurrentSection('basic')}
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
              onClick={() => setCurrentSection('requirements')}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: primaryColor,
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Continue to Requirements
            </button>
          </div>
        </div>
      )}

      {/* Requirements Section */}
      {currentSection === 'requirements' && (
        <div style={{
          backgroundColor: cardBg,
          padding: '32px',
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>
            Skills & Location Requirements
          </h2>

          {/* Skill Thresholds */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
              Skill Level Requirements
            </h3>
            <p style={{ fontSize: '14px', opacity: '0.7', marginBottom: '16px' }}>
              Set minimum skill levels (0-100) that candidates must meet. These will be verified using zero-knowledge proofs.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {Object.entries(formData.thresholds).map(([skill, value]) => (
                <div key={skill}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                    {skill.charAt(0).toUpperCase() + skill.slice(1)} Level *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleThresholdChange(skill as keyof typeof formData.thresholds, e.target.value)}
                    placeholder="0-100"
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
                  <div style={{
                    marginTop: '4px',
                    height: '4px',
                    backgroundColor: `${borderColor}`,
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(parseInt(value) || 0, 100)}%`,
                      height: '100%',
                      backgroundColor: primaryColor,
                      transition: 'width 0.2s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allowed Regions */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
              Eligible Regions *
            </h3>
            <p style={{ fontSize: '14px', opacity: '0.7', marginBottom: '16px' }}>
              Select regions where candidates can be located to apply for this position.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {regions.map((region) => (
                <label
                  key={region.code}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${formData.allowedRegions.includes(region.code) ? primaryColor : borderColor}`,
                    backgroundColor: formData.allowedRegions.includes(region.code) ? `${primaryColor}10` : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.allowedRegions.includes(region.code)}
                    onChange={() => handleRegionToggle(region.code)}
                    style={{ margin: 0 }}
                  />
                  <MapPin style={{ width: '14px', height: '14px', color: primaryColor }} />
                  {region.name}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setCurrentSection('details')}
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
              {isSubmitting ? 'Posting Job...' : 'Post Job'}
              {!isSubmitting && <CheckCircle style={{ width: '20px', height: '20px' }} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
