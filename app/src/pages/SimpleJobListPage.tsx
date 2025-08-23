import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Users, Calendar, Briefcase } from 'lucide-react';
import { useSimpleTheme } from '../components/SimpleThemeProvider';

interface Job {
  id: number;
  title: string;
  company: string;
  thresholds: { rust: number; typescript: number; zk: number };
  allowedRegions: string[];
  salaryMin: number;
  salaryMax: number;
  description?: string;
  postedDate?: string;
}

export function SimpleJobListPage() {
  const { theme } = useSimpleTheme();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1917' : '#ffffff';
  const textColor = isDark ? '#f5f5f4' : '#1a1917';
  const cardBg = isDark ? '#2a2827' : '#f8f9fa';
  const borderColor = isDark ? '#3a3937' : '#e5e5e5';
  const primaryColor = '#5B8CFF';

  // Mock data for demonstration
  const mockJobs: Job[] = [
    {
      id: 1,
      title: "Senior Rust Developer",
      company: "BlockTech Solutions",
      thresholds: { rust: 80, typescript: 60, zk: 70 },
      allowedRegions: ["US-CA", "US-NY", "CA-ON"],
      salaryMin: 120000,
      salaryMax: 180000,
      description: "Build high-performance blockchain infrastructure with Rust",
      postedDate: "2 days ago"
    },
    {
      id: 2,
      title: "ZK Protocol Engineer",
      company: "Privacy Labs",
      thresholds: { rust: 70, typescript: 50, zk: 90 },
      allowedRegions: ["US-CA", "UK-LON", "DE-BER"],
      salaryMin: 140000,
      salaryMax: 200000,
      description: "Design and implement zero-knowledge proof systems",
      postedDate: "1 week ago"
    },
    {
      id: 3,
      title: "Full Stack TypeScript Developer",
      company: "DeFi Innovations",
      thresholds: { rust: 40, typescript: 85, zk: 30 },
      allowedRegions: ["US-NY", "CA-ON", "UK-LON"],
      salaryMin: 90000,
      salaryMax: 140000,
      description: "Build modern web applications for decentralized finance",
      postedDate: "3 days ago"
    },
    {
      id: 4,
      title: "Blockchain Security Researcher",
      company: "CryptoAudit Corp",
      thresholds: { rust: 75, typescript: 40, zk: 80 },
      allowedRegions: ["US-CA", "DE-BER"],
      salaryMin: 110000,
      salaryMax: 160000,
      description: "Research and audit smart contracts and zkp implementations",
      postedDate: "5 days ago"
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, selectedRegion, selectedSkill]);

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter(job =>
        job.allowedRegions.includes(selectedRegion)
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter(job => {
        const threshold = job.thresholds[selectedSkill as keyof typeof job.thresholds];
        return threshold > 0;
      });
    }

    setFilteredJobs(filtered);
  };

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

  const skills = [
    { key: 'rust', name: 'Rust' },
    { key: 'typescript', name: 'TypeScript' },
    { key: 'zk', name: 'Zero-Knowledge' },
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

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Briefcase style={{ width: '40px', height: '40px', color: primaryColor }} />
          Available Jobs
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: '0.8' }}>
          Browse and apply for jobs using privacy-preserving zero-knowledge proofs
        </p>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: cardBg,
        padding: '24px',
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        marginBottom: '32px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '16px', 
              height: '16px', 
              color: '#6b7280' 
            }} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px',
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                backgroundColor: bgColor,
                color: textColor,
                fontSize: '14px'
              }}
            />
          </div>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{
              padding: '12px 16px',
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              backgroundColor: bgColor,
              color: textColor,
              fontSize: '14px'
            }}
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>

          {/* Skill Filter */}
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            style={{
              padding: '12px 16px',
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              backgroundColor: bgColor,
              color: textColor,
              fontSize: '14px'
            }}
          >
            <option value="">All Skills</option>
            {skills.map((skill) => (
              <option key={skill.key} value={skill.key}>
                {skill.name}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('');
              setSelectedSkill('');
            }}
            style={{
              padding: '12px 24px',
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: textColor,
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '14px', opacity: '0.8' }}>
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
      </div>

      {/* Job List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
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
              <Search style={{ width: '32px', height: '32px', color: '#6b7280' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
              No jobs found
            </h3>
            <p style={{ opacity: '0.7' }}>
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} style={{
              backgroundColor: cardBg,
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${borderColor}`,
              transition: 'box-shadow 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px' }}>
                    {job.title}
                  </h3>
                  <p style={{ fontSize: '1rem', opacity: '0.8', marginBottom: '8px' }}>
                    {job.company}
                  </p>
                  {job.description && (
                    <p style={{ fontSize: '14px', opacity: '0.7', marginBottom: '16px' }}>
                      {job.description}
                    </p>
                  )}
                </div>
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Apply Now
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                {/* Salary Range */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', opacity: '0.8' }}>
                  <DollarSign style={{ width: '16px', height: '16px' }} />
                  <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                </div>

                {/* Regions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', opacity: '0.8' }}>
                  <MapPin style={{ width: '16px', height: '16px' }} />
                  <span>{job.allowedRegions.length} regions</span>
                </div>

                {/* Application Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', opacity: '0.8' }}>
                  <Users style={{ width: '16px', height: '16px' }} />
                  <span>0 applications</span>
                </div>
              </div>

              {/* Skill Requirements */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Required Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(job.thresholds).map(([skill, level]) => {
                    const skillInfo = getSkillLevel(level);
                    return (
                      <span
                        key={skill}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: `${skillInfo.color}20`,
                          color: skillInfo.color,
                          border: `1px solid ${skillInfo.color}40`
                        }}
                      >
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}: {skillInfo.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Allowed Regions */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Eligible Regions
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {job.allowedRegions.map((region) => (
                    <span
                      key={region}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: `${primaryColor}20`,
                        color: primaryColor
                      }}
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ 
                paddingTop: '16px', 
                borderTop: `1px solid ${borderColor}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', opacity: '0.6' }}>
                  <Calendar style={{ width: '14px', height: '14px' }} />
                  <span>Posted {job.postedDate || 'recently'}</span>
                </div>
                <Link
                  to={`/jobs/${job.id}`}
                  style={{
                    color: primaryColor,
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
