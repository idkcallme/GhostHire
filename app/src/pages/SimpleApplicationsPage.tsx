import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, MapPin, Users, Eye, CheckCircle, Clock, XCircle, Filter, Search } from 'lucide-react';
import { useSimpleTheme } from '../components/SimpleThemeProvider';

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  salary: { min: number; max: number };
  region: string;
  applicantName?: string;
  applicantEmail?: string;
}

export function SimpleApplicationsPage() {
  const { theme } = useSimpleTheme();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'applied' | 'posted'>('applied'); // Toggle between applications sent and jobs posted

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1917' : '#ffffff';
  const textColor = isDark ? '#f5f5f4' : '#1a1917';
  const cardBg = isDark ? '#2a2827' : '#f8f9fa';
  const borderColor = isDark ? '#3a3937' : '#e5e5e5';
  const primaryColor = '#5B8CFF';

  // Mock data - in real app this would come from API
  const mockApplications: Application[] = [
    {
      id: 1,
      jobId: 1,
      jobTitle: "Senior Rust Developer",
      company: "BlockTech Solutions",
      appliedDate: "2024-01-15",
      status: "pending",
      salary: { min: 120000, max: 180000 },
      region: "US-CA"
    },
    {
      id: 2,
      jobId: 2,
      jobTitle: "ZK Protocol Engineer",
      company: "Privacy Labs",
      appliedDate: "2024-01-12",
      status: "reviewed",
      salary: { min: 140000, max: 200000 },
      region: "US-CA"
    },
    // Mock posted jobs (when user is employer)
    {
      id: 3,
      jobId: 3,
      jobTitle: "Full Stack Developer",
      company: "My Company",
      appliedDate: "2024-01-10",
      status: "accepted",
      salary: { min: 90000, max: 140000 },
      region: "US-NY",
      applicantName: "John Smith",
      applicantEmail: "john@example.com"
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setApplications(mockApplications);
      setFilteredApplications(mockApplications);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedStatus, searchTerm, viewMode]);

  const filterApplications = () => {
    let filtered = applications;

    // Filter by view mode
    if (viewMode === 'applied') {
      filtered = filtered.filter(app => !app.applicantName); // Applications I sent
    } else {
      filtered = filtered.filter(app => app.applicantName); // Applications to my jobs
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.applicantName && app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { color: '#f59e0b', bg: '#fef3c7' };
      case 'reviewed': return { color: '#3b82f6', bg: '#dbeafe' };
      case 'accepted': return { color: '#10b981', bg: '#d1fae5' };
      case 'rejected': return { color: '#ef4444', bg: '#fee2e2' };
      default: return { color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'reviewed': return Eye;
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
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

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Briefcase style={{ width: '40px', height: '40px', color: primaryColor }} />
          Applications Dashboard
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: '0.8' }}>
          Track your job applications and manage incoming applications
        </p>
      </div>

      {/* View Mode Toggle */}
      <div style={{
        backgroundColor: cardBg,
        padding: '6px',
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        marginBottom: '24px',
        display: 'inline-flex',
        gap: '4px'
      }}>
        <button
          onClick={() => setViewMode('applied')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: viewMode === 'applied' ? primaryColor : 'transparent',
            color: viewMode === 'applied' ? 'white' : textColor,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          My Applications
        </button>
        <button
          onClick={() => setViewMode('posted')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: viewMode === 'posted' ? primaryColor : 'transparent',
            color: viewMode === 'posted' ? 'white' : textColor,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Received Applications
        </button>
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
              placeholder={viewMode === 'applied' ? "Search jobs..." : "Search applicants..."}
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

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '12px 16px',
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              backgroundColor: bgColor,
              color: textColor,
              fontSize: '14px'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('all');
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
          Showing {filteredApplications.length} {viewMode === 'applied' ? 'applications' : 'received applications'}
        </p>
      </div>

      {/* Applications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredApplications.length === 0 ? (
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
              <Briefcase style={{ width: '32px', height: '32px', color: '#6b7280' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
              No applications found
            </h3>
            <p style={{ opacity: '0.7', marginBottom: '24px' }}>
              {viewMode === 'applied' 
                ? "You haven't applied to any jobs yet."
                : "No applications have been received for your posted jobs."
              }
            </p>
            <Link 
              to={viewMode === 'applied' ? "/jobs" : "/post"}
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
              {viewMode === 'applied' ? "Browse Jobs" : "Post a Job"}
            </Link>
          </div>
        ) : (
          filteredApplications.map((application) => {
            const statusInfo = getStatusColor(application.status);
            const StatusIcon = getStatusIcon(application.status);
            
            return (
              <div key={application.id} style={{
                backgroundColor: cardBg,
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${borderColor}`,
                transition: 'box-shadow 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px' }}>
                      {application.jobTitle}
                    </h3>
                    <p style={{ fontSize: '1rem', opacity: '0.8', marginBottom: '8px' }}>
                      {application.company}
                    </p>
                    {viewMode === 'posted' && application.applicantName && (
                      <p style={{ fontSize: '14px', opacity: '0.7', marginBottom: '8px' }}>
                        Applicant: {application.applicantName} ({application.applicantEmail})
                      </p>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: statusInfo.bg,
                      color: statusInfo.color,
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <StatusIcon style={{ width: '12px', height: '12px' }} />
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </div>
                    
                    <Link
                      to={`/jobs/${application.jobId}`}
                      style={{
                        padding: '8px 16px',
                        border: `1px solid ${primaryColor}`,
                        borderRadius: '6px',
                        color: primaryColor,
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      View Job
                    </Link>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  {/* Salary */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', opacity: '0.8' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>💰</span>
                    <span>${application.salary.min.toLocaleString()} - ${application.salary.max.toLocaleString()}</span>
                  </div>

                  {/* Region */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', opacity: '0.8' }}>
                    <MapPin style={{ width: '14px', height: '14px' }} />
                    <span>{application.region}</span>
                  </div>

                  {/* Applied Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', opacity: '0.8' }}>
                    <Calendar style={{ width: '14px', height: '14px' }} />
                    <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons for Employers */}
                {viewMode === 'posted' && application.status === 'pending' && (
                  <div style={{ 
                    paddingTop: '16px', 
                    borderTop: `1px solid ${borderColor}`,
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Accept
                    </button>
                    <button
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Reject
                    </button>
                    <button
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: `1px solid ${borderColor}`,
                        backgroundColor: 'transparent',
                        color: textColor,
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      View ZK Proof
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Stats */}
      {filteredApplications.length > 0 && (
        <div style={{
          backgroundColor: cardBg,
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          marginTop: '32px'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
            Quick Stats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
            {Object.entries(
              filteredApplications.reduce((acc, app) => {
                acc[app.status] = (acc[app.status] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([status, count]) => {
              const statusInfo = getStatusColor(status);
              return (
                <div key={status} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: statusInfo.color,
                    marginBottom: '4px'
                  }}>
                    {count}
                  </div>
                  <div style={{ fontSize: '12px', textTransform: 'capitalize', opacity: '0.7' }}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
