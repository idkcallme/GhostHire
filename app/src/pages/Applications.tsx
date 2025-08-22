import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, XCircle, FileText, Eye, Calendar } from "lucide-react";

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  submittedAt: Date;
  transactionHash: string;
  privacyScore: number;
}

export function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedTab, setSelectedTab] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    // Load applications from localStorage (in real app, this would be from blockchain/backend)
    const savedApplications = localStorage.getItem('ghosthire_applications');
    if (savedApplications) {
      const parsed = JSON.parse(savedApplications);
      setApplications(parsed.map((app: any) => ({
        ...app,
        submittedAt: new Date(app.submittedAt)
      })));
    } else {
      // Demo data
      const demoApplications: Application[] = [
        {
          id: "app-1",
          jobId: "1",
          jobTitle: "Senior Rust Protocol Engineer",
          company: "ZK Labs",
          status: "approved",
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          transactionHash: "0x1234...5678",
          privacyScore: 95
        },
        {
          id: "app-2", 
          jobId: "2",
          jobTitle: "ZK Protocol Engineer",
          company: "Midnight Corp",
          status: "reviewing",
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          transactionHash: "0x9abc...def0",
          privacyScore: 98
        },
        {
          id: "app-3",
          jobId: "3", 
          jobTitle: "Frontend Developer",
          company: "Privacy Inc",
          status: "pending",
          submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          transactionHash: "0xfedc...ba98",
          privacyScore: 92
        }
      ];
      setApplications(demoApplications);
      localStorage.setItem('ghosthire_applications', JSON.stringify(demoApplications));
    }
  }, []);

  const filteredApplications = applications.filter(app => 
    selectedTab === "all" || app.status === selectedTab
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "var(--success)";
      case "rejected": return "var(--warning)";
      case "reviewing": return "var(--info)";
      default: return "var(--warm-off-white)";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "reviewing": return <Eye className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="section-large">
      <div className="grid-container">
        <div className="content-wide">
          {/* Header */}
          <div className="mb-12">
            <h1 className="h1 mb-4">Your Applications</h1>
            <p className="body-large" style={{opacity: "0.8"}}>
              Track your privacy-preserving job applications and their status.
              <strong style={{color: "var(--warm-off-white)", opacity: "1"}}> All sensitive data remains private.</strong>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="h2 mb-2" style={{color: "var(--primary)"}}>{applications.length}</div>
              <div className="body-small" style={{opacity: "0.8"}}>Total Applications</div>
            </div>
            <div className="card text-center">
              <div className="h2 mb-2" style={{color: "var(--success)"}}>{applications.filter(a => a.status === "approved").length}</div>
              <div className="body-small" style={{opacity: "0.8"}}>Approved</div>
            </div>
            <div className="card text-center">
              <div className="h2 mb-2" style={{color: "var(--info)"}}>{applications.filter(a => a.status === "reviewing").length}</div>
              <div className="body-small" style={{opacity: "0.8"}}>Under Review</div>
            </div>
            <div className="card text-center">
              <div className="h2 mb-2" style={{color: "var(--warm-off-white)", opacity: "0.8"}}>{Math.round(applications.reduce((sum, app) => sum + app.privacyScore, 0) / applications.length) || 0}%</div>
              <div className="body-small" style={{opacity: "0.8"}}>Avg Privacy Score</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "all", label: "All Applications", count: applications.length },
              { key: "pending", label: "Pending", count: applications.filter(a => a.status === "pending").length },
              { key: "approved", label: "Approved", count: applications.filter(a => a.status === "approved").length },
              { key: "rejected", label: "Rejected", count: applications.filter(a => a.status === "rejected").length }
            ].map(tab => (
              <button
                key={tab.key}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedTab === tab.key ? 'btn btn-primary' : 'btn btn-ghost'
                }`}
                onClick={() => setSelectedTab(tab.key as any)}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="card text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4" style={{opacity: "0.5"}} />
                <h3 className="h3 mb-2">No Applications Found</h3>
                <p className="body-large mb-6" style={{opacity: "0.7"}}>
                  {selectedTab === "all" 
                    ? "You haven't submitted any applications yet."
                    : `No ${selectedTab} applications found.`
                  }
                </p>
                <Link to="/jobs">
                  <button className="btn btn-primary">Browse Jobs</button>
                </Link>
              </div>
            ) : (
              filteredApplications.map(application => (
                <div key={application.id} className="card">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      {/* Job Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="h3 mb-1" style={{textTransform: "none"}}>{application.jobTitle}</h3>
                          <p className="body-large" style={{opacity: "0.8"}}>{application.company}</p>
                        </div>
                        
                        {/* Status Badge */}
                        <div 
                          className="flex items-center gap-2 px-3 py-1 rounded-full"
                          style={{
                            background: `${getStatusColor(application.status)}20`,
                            border: `1px solid ${getStatusColor(application.status)}40`,
                            color: getStatusColor(application.status)
                          }}
                        >
                          {getStatusIcon(application.status)}
                          <span className="body-small font-medium capitalize">{application.status}</span>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{opacity: "0.6"}} />
                          <span className="body-small">
                            Submitted {application.submittedAt.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" style={{opacity: "0.6"}} />
                          <span className="body-small">
                            Privacy Score: {application.privacyScore}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" style={{opacity: "0.6"}} />
                          <span className="body-small font-mono">
                            {application.transactionHash.substring(0, 10)}...
                          </span>
                        </div>
                      </div>

                      {/* Privacy Indicator */}
                      <div 
                        className="p-3 rounded-lg"
                        style={{background: "var(--success-muted)", border: "1px solid rgba(60, 203, 127, 0.2)"}}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4" style={{color: "var(--success)"}} />
                          <span className="body-small font-medium" style={{color: "var(--success)"}}>
                            Zero-Knowledge Proof Verified
                          </span>
                        </div>
                        <p className="body-small" style={{opacity: "0.8"}}>
                          Your skills, location, and salary data remain completely private while proving eligibility.
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link to={`/jobs/${application.jobId}`}>
                        <button className="btn btn-ghost body-small">View Job</button>
                      </Link>
                      <Link to={`/receipt/${application.transactionHash}`}>
                        <button className="btn btn-secondary body-small">View Receipt</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
