import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient, Job } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface LegacyJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  zkRequirements: string[];
  posted: string;
}

type DisplayJob = Job & {
  type?: string;
  salary?: string; 
  posted?: string;
};

const sampleJobs: LegacyJob[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $180k",
    description: "Join our team building next-generation privacy-preserving applications using zero-knowledge proofs.",
    requirements: ["5+ years experience", "React/TypeScript", "Node.js"],
    zkRequirements: ["Degree in Computer Science", "Previous salary >$100k", "Security clearance"],
    posted: "2 days ago"
  },
  {
    id: "2", 
    title: "ZK Protocol Developer",
    company: "CryptoLabs",
    location: "San Francisco, CA",
    type: "Full-time", 
    salary: "$150k - $250k",
    description: "Research and develop zero-knowledge proof systems for privacy-preserving applications.",
    requirements: ["PhD in Cryptography", "Rust/Go", "Protocol design"],
    zkRequirements: ["PhD degree", "Published research papers", "Previous crypto experience"],
    posted: "1 week ago"
  },
  {
    id: "3",
    title: "Privacy Engineer",
    company: "DataSecure Inc",
    location: "New York, NY", 
    type: "Full-time",
    salary: "$100k - $140k",
    description: "Build privacy-first data processing systems using advanced cryptographic techniques.",
    requirements: ["3+ years experience", "Python/Rust", "Cryptography knowledge"],
    zkRequirements: ["Bachelor's degree", "Privacy certifications", "Clean background check"],
    posted: "3 days ago"
  }
];

export function JobsPage() {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<DisplayJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<DisplayJob | null>(null);

  // Load jobs from API
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const jobsData = await apiClient.getJobs();
        setJobs(jobsData);
        if (jobsData.length > 0) {
          setSelectedJob(jobsData[0]);
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setError('Failed to load jobs');
        // Fallback to sample data for now
        setJobs(sampleJobs as any);
        setSelectedJob(sampleJobs[0] as any);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f4f6",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px"
        }}></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <h2 style={{ color: "#dc2626", marginBottom: "16px" }}>Error Loading Jobs</h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "16px" }}>
          Browse Jobs
        </h1>
        <p style={{ color: "#666", fontSize: "18px" }}>
          Find privacy-preserving job opportunities that respect your personal data
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedJob ? "1fr 1fr" : "1fr", gap: "40px" }}>
        {/* Job List */}
        <div>
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#666" }}>{jobs.length} jobs found</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: "white",
                cursor: "pointer"
              }}>
                Filter
              </button>
              <button style={{
                padding: "8px 16px", 
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: "white",
                cursor: "pointer"
              }}>
                Sort
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                style={{
                  padding: "24px",
                  border: selectedJob?.id === job.id ? "2px solid #5B8CFF" : "1px solid #e5e7eb",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: selectedJob?.id === job.id ? "0 4px 12px rgba(91, 140, 255, 0.15)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
                  userSelect: "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "4px", color: "#1a1917", userSelect: "none" }}>
                      {job.title}
                    </h3>
                    <p style={{ color: "#666", fontSize: "16px", userSelect: "none" }}>{job.company}</p>
                  </div>
                  <span style={{ 
                    color: "#5B8CFF", 
                    fontSize: "14px",
                    backgroundColor: "#5B8CFF20",
                    padding: "4px 8px",
                    borderRadius: "4px"
                  }}>
                    {job.posted}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
                  <span style={{ color: "#666", fontSize: "14px", userSelect: "none" }}>📍 {job.location}</span>
                  <span style={{ color: "#666", fontSize: "14px", userSelect: "none" }}>💼 {job.type}</span>
                  <span style={{ color: "#666", fontSize: "14px", userSelect: "none" }}>💰 {job.salary}</span>
                </div>

                <p style={{ color: "#333", fontSize: "14px", lineHeight: "1.5", marginBottom: "12px", userSelect: "none" }}>
                  {job.description}
                </p>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: "12px",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    padding: "4px 8px",
                    borderRadius: "4px"
                  }}>
                    🔒 {
                      job.zkRequirements ? 
                      Object.values(job.zkRequirements).filter(Boolean).length :
                      (job as any).zkRequirements?.length || 0
                    } ZK Requirements
                  </span>
                  {job.requirements.slice(0, 2).map((req, idx) => (
                    <span key={idx} style={{
                      fontSize: "12px",
                      backgroundColor: "#f3f4f6",
                      color: "#374151", 
                      padding: "4px 8px",
                      borderRadius: "4px"
                    }}>
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Details */}
        {selectedJob && (
          <div style={{ 
            position: "sticky", 
            top: "20px",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "32px",
            height: "fit-content"
          }}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>
                {selectedJob.title}
              </h2>
              <p style={{ fontSize: "18px", color: "#666", marginBottom: "16px" }}>
                {selectedJob.company}
              </p>
              
              <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
                <span style={{ color: "#666" }}>📍 {selectedJob.location}</span>
                <span style={{ color: "#666" }}>💼 {selectedJob.type}</span>
                <span style={{ color: "#666" }}>💰 {selectedJob.salary}</span>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Description</h3>
              <p style={{ color: "#333", lineHeight: "1.6" }}>{selectedJob.description}</p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Requirements</h3>
              <ul style={{ color: "#333", paddingLeft: "20px" }}>
                {selectedJob.requirements.map((req, idx) => (
                  <li key={idx} style={{ marginBottom: "4px" }}>{req}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#5B8CFF" }}>
                🔒 ZK Proof Requirements
              </h3>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
                Prove these qualifications without revealing sensitive details:
              </p>
              <ul style={{ color: "#333", paddingLeft: "20px" }}>
                {selectedJob.zkRequirements && typeof selectedJob.zkRequirements === 'object' ? (
                  Object.entries(selectedJob.zkRequirements).map(([key, value], idx) => 
                    value ? (
                      <li key={idx} style={{ marginBottom: "4px" }}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('requires', 'Requires')}
                      </li>
                    ) : null
                  )
                ) : (
                  (selectedJob as any).zkRequirements?.map((req: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>{req}</li>
                  )) || []
                )}
              </ul>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <Link 
                to={`/jobs/${selectedJob.id}/apply`}
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  backgroundColor: "#5B8CFF",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  textAlign: "center",
                  flex: 1
                }}
              >
                Apply with ZK Proof
              </Link>
              <button style={{
                padding: "12px 16px",
                backgroundColor: "transparent",
                color: "#5B8CFF",
                border: "2px solid #5B8CFF",
                borderRadius: "8px",
                cursor: "pointer"
              }}>
                💾
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
