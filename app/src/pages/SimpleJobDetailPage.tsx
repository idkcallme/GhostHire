import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Users, Calendar, Briefcase, CheckCircle, Shield, Clock } from 'lucide-react';
import { useSimpleTheme } from '../components/SimpleThemeProvider';

interface Job {
  id: number;
  title: string;
  company: string;
  thresholds: { rust: number; typescript: number; zk: number };
  allowedRegions: string[];
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedDate: string;
  applicationsCount: number;
}

export function SimpleJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useSimpleTheme();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1917' : '#ffffff';
  const textColor = isDark ? '#f5f5f4' : '#1a1917';
  const cardBg = isDark ? '#2a2827' : '#f8f9fa';
  const borderColor = isDark ? '#3a3937' : '#e5e5e5';
  const primaryColor = '#5B8CFF';

  // Mock job data
  const mockJobs: Record<string, Job> = {
    '1': {
      id: 1,
      title: "Senior Rust Developer",
      company: "BlockTech Solutions",
      thresholds: { rust: 80, typescript: 60, zk: 70 },
      allowedRegions: ["US-CA", "US-NY", "CA-ON"],
      salaryMin: 120000,
      salaryMax: 180000,
      description: "Join our team building next-generation blockchain infrastructure with Rust. We're looking for an experienced developer who can design and implement high-performance systems that handle millions of transactions per day.",
      requirements: [
        "5+ years of Rust development experience",
        "Strong understanding of blockchain concepts",
        "Experience with consensus algorithms",
        "Knowledge of cryptographic principles",
        "Previous work with distributed systems"
      ],
      responsibilities: [
        "Design and implement core blockchain protocols",
        "Optimize system performance and scalability",
        "Collaborate with the research team on new features",
        "Mentor junior developers",
        "Write comprehensive tests and documentation"
      ],
      benefits: [
        "Competitive salary and equity package",
        "Health, dental, and vision insurance",
        "Flexible working hours and remote work options",
        "Professional development budget",
        "Annual company retreats"
      ],
      postedDate: "2024-01-10",
      applicationsCount: 12
    },
    '2': {
      id: 2,
      title: "ZK Protocol Engineer",
      company: "Privacy Labs",
      thresholds: { rust: 70, typescript: 50, zk: 90 },
      allowedRegions: ["US-CA", "UK-LON", "DE-BER"],
      salaryMin: 140000,
      salaryMax: 200000,
      description: "Lead the development of cutting-edge zero-knowledge proof systems. You'll be working on novel cryptographic protocols that enable privacy-preserving computations at scale.",
      requirements: [
        "PhD in Computer Science, Mathematics, or related field",
        "Deep understanding of zero-knowledge proofs",
        "Experience with zk-SNARKs and zk-STARKs",
        "Strong mathematical background",
        "Published research in cryptography"
      ],
      responsibilities: [
        "Research and develop new ZK protocols",
        "Implement proof systems in Rust",
        "Optimize proof generation and verification",
        "Collaborate with academic researchers",
        "Present findings at conferences"
      ],
      benefits: [
        "Top-tier compensation package",
        "Research publication opportunities",
        "Conference travel budget",
        "Flexible research time allocation",
        "Access to latest hardware and tools"
      ],
      postedDate: "2024-01-05",
      applicationsCount: 8
    }
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      if (id && mockJobs[id]) {
        setJob(mockJobs[id]);
      } else {
        setError('Job not found');
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  const getSkillLevel = (level: number) => {
    if (level >= 80) return { label: 'Expert', color: '#10b981' };
    if (level >= 60) return { label: 'Advanced', color: '#3b82f6' };
    if (level >= 40) return { label: 'Intermediate', color: '#f59e0b' };
    return { label: 'Beginner', color: '#6b7280' };
  };

  const regions = [
    { code: 'US-CA', name: 'California, USA' },
    { code: 'US-NY', name: 'New York, USA' },
    { code: 'CA-ON', name: 'Ontario, Canada' },
    { code: 'UK-LON', name: 'London, UK' },
    { code: 'DE-BER', name: 'Berlin, Germany' },
  ];

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
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: cardBg,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Briefcase style={{ width: '32px', height: '32px', color: '#6b7280' }} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>
          Job Not Found
        </h2>
        <p style={{ opacity: '0.7', marginBottom: '24px' }}>
          The job you're looking for doesn't exist or has been removed.
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
    <div style={{ backgroundColor: bgColor, color: textColor, padding: '32px 24px', maxWidth: '1000px', margin: '0 auto' }}>
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

      {/* Job Header */}
      <div style={{
        backgroundColor: cardBg,
        padding: '32px',
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
              {job.title}
            </h1>
            <p style={{ fontSize: '1.25rem', opacity: '0.8', marginBottom: '16px' }}>
              {job.company}
            </p>
            <p style={{ fontSize: '1rem', opacity: '0.7', lineHeight: '1.6' }}>
              {job.description}
            </p>
          </div>
          <Link 
            to={`/jobs/${job.id}/apply`}
            style={{
              backgroundColor: primaryColor,
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Apply Now
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {/* Salary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              backgroundColor: `${primaryColor}20`,
              padding: '8px',
              borderRadius: '8px'
            }}>
              <DollarSign style={{ width: '20px', height: '20px', color: primaryColor }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', opacity: '0.7', marginBottom: '2px' }}>Salary Range</p>
              <p style={{ fontSize: '14px', fontWeight: '600' }}>
                ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Applications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              backgroundColor: `${primaryColor}20`,
              padding: '8px',
              borderRadius: '8px'
            }}>
              <Users style={{ width: '20px', height: '20px', color: primaryColor }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', opacity: '0.7', marginBottom: '2px' }}>Applications</p>
              <p style={{ fontSize: '14px', fontWeight: '600' }}>
                {job.applicationsCount} submitted
              </p>
            </div>
          </div>

          {/* Posted Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              backgroundColor: `${primaryColor}20`,
              padding: '8px',
              borderRadius: '8px'
            }}>
              <Calendar style={{ width: '20px', height: '20px', color: primaryColor }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', opacity: '0.7', marginBottom: '2px' }}>Posted</p>
              <p style={{ fontSize: '14px', fontWeight: '600' }}>
                {new Date(job.postedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Requirements */}
          <div style={{
            backgroundColor: cardBg,
            padding: '24px',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle style={{ width: '20px', height: '20px', color: primaryColor }} />
              Requirements
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {job.requirements.map((req, index) => (
                <li key={index} style={{ 
                  padding: '8px 0', 
                  borderBottom: index < job.requirements.length - 1 ? `1px solid ${borderColor}` : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', lineHeight: '1.5' }}>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibilities */}
          <div style={{
            backgroundColor: cardBg,
            padding: '24px',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase style={{ width: '20px', height: '20px', color: primaryColor }} />
              Responsibilities
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {job.responsibilities.map((resp, index) => (
                <li key={index} style={{ 
                  padding: '8px 0', 
                  borderBottom: index < job.responsibilities.length - 1 ? `1px solid ${borderColor}` : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: primaryColor,
                    borderRadius: '50%',
                    marginTop: '8px',
                    flexShrink: 0
                  }} />
                  <span style={{ fontSize: '14px', lineHeight: '1.5' }}>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div style={{
            backgroundColor: cardBg,
            padding: '24px',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield style={{ width: '20px', height: '20px', color: primaryColor }} />
              Benefits
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {job.benefits.map((benefit, index) => (
                <li key={index} style={{ 
                  padding: '8px 0', 
                  borderBottom: index < job.benefits.length - 1 ? `1px solid ${borderColor}` : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <Shield style={{ width: '16px', height: '16px', color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', lineHeight: '1.5' }}>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Skill Requirements */}
          <div style={{
            backgroundColor: cardBg,
            padding: '24px',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
              Skill Requirements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(job.thresholds).map(([skill, level]) => {
                const skillInfo = getSkillLevel(level);
                return (
                  <div key={skill}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        fontWeight: '500',
                        color: skillInfo.color,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: `${skillInfo.color}20`
                      }}>
                        {skillInfo.label}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: `${skillInfo.color}20`,
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${level}%`,
                        height: '100%',
                        backgroundColor: skillInfo.color,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Eligible Regions */}
          <div style={{
            backgroundColor: cardBg,
            padding: '24px',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '18px', height: '18px', color: primaryColor }} />
              Eligible Regions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {job.allowedRegions.map((regionCode) => {
                const region = regions.find(r => r.code === regionCode);
                return (
                  <div key={regionCode} style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: `${primaryColor}10`,
                    border: `1px solid ${primaryColor}30`,
                    fontSize: '14px'
                  }}>
                    {region?.name || regionCode}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Apply Section */}
          <div style={{
            backgroundColor: cardBg,
            padding: '24px',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px' }}>
              Ready to Apply?
            </h3>
            <p style={{ fontSize: '14px', opacity: '0.7', marginBottom: '16px' }}>
              Use zero-knowledge proofs to verify your skills privately
            </p>
            <Link 
              to={`/jobs/${job.id}/apply`}
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
                gap: '8px',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <Shield style={{ width: '16px', height: '16px' }} />
              Apply with ZK Proof
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
