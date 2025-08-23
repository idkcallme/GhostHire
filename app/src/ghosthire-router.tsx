import { createBrowserRouter } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import React from "react";
import { JobsPage } from "./pages/JobsPage-working";
import { JobApplicationPage } from "./pages/JobApplicationPage";
import { ApplicationConfirmationPage } from "./pages/ApplicationConfirmationPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { JobPostingPage } from "./pages/JobPostingPage";
import { useAuth } from "./contexts/AuthContext";

function GhostHireLayout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ 
        padding: "20px", 
        backgroundColor: "#1a1917", 
        color: "#f5f5f4", 
        borderBottom: "1px solid #3a3937" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #5B8CFF 0%, #10b981 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
              boxShadow: "0 2px 8px rgba(91, 140, 255, 0.3)"
            }}>
              G
            </div>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#5B8CFF" }}>
              GhostHire
            </span>
          </div>
          
          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <Link to="/" style={{ color: "#f5f5f4", textDecoration: "none", opacity: "0.8" }}>Home</Link>
            <Link to="/jobs" style={{ color: "#f5f5f4", textDecoration: "none", opacity: "0.8" }}>Browse Jobs</Link>
            {user?.role === 'employer' && (
              <Link to="/jobs/post" style={{ color: "#f5f5f4", textDecoration: "none", opacity: "0.8" }}>Post a Job</Link>
            )}
            
            {isAuthenticated ? (
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ opacity: "0.8", fontSize: "14px" }}>
                  Welcome, {user?.firstName}
                </span>
                <button 
                  onClick={logout}
                  style={{
                    background: "none",
                    border: "1px solid #5B8CFF",
                    color: "#5B8CFF",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                <Link 
                  to="/auth/login" 
                  style={{ 
                    color: "#f5f5f4", 
                    textDecoration: "none", 
                    opacity: "0.8",
                    padding: "6px 12px",
                    border: "1px solid transparent"
                  }}
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth/register" 
                  style={{ 
                    color: "#1a1917", 
                    textDecoration: "none", 
                    backgroundColor: "#5B8CFF",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontWeight: "500"
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      
      <main style={{ flex: 1, padding: "40px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Outlet />
        </div>
      </main>
      
      <footer style={{ 
        padding: "20px", 
        backgroundColor: "#1a1917", 
        color: "#f5f5f4", 
        borderTop: "1px solid #3a3937",
        textAlign: "center"
      }}>
        <p>© 2024 GhostHire - Privacy-first job applications with zero-knowledge proofs</p>
      </footer>
    </div>
  );
}

function GhostHireLanding() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          backgroundColor: "#5B8CFF20",
          borderRadius: "20px",
          marginBottom: "30px"
        }}>
          <div style={{ width: "8px", height: "8px", backgroundColor: "#5B8CFF", borderRadius: "50%" }}></div>
          <span style={{ color: "#5B8CFF", fontSize: "14px", fontWeight: "500" }}>PRIVACY-FIRST JOB APPLICATIONS</span>
        </div>
      </div>
      
      <h1 style={{ 
        fontSize: "48px", 
        fontWeight: "bold", 
        marginBottom: "24px",
        color: "#1a1917"
      }}>
        Prove You Qualify—<br />
        <span style={{ color: "#5B8CFF" }}>Without Oversharing</span>
      </h1>
      
      <p style={{ 
        fontSize: "20px", 
        color: "#666", 
        maxWidth: "600px", 
        margin: "0 auto 40px",
        lineHeight: "1.6"
      }}>
        Use zero-knowledge proofs to demonstrate your qualifications while keeping sensitive information private.
        <strong style={{ color: "#1a1917" }}> Reveal nothing else.</strong>
      </p>
      
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link 
          to="/jobs" 
          style={{
            display: "inline-block",
            padding: "16px 32px",
            backgroundColor: "#5B8CFF",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px"
          }}
        >
          Browse Jobs →
        </Link>
        
        <Link 
          to="/post" 
          style={{
            display: "inline-block",
            padding: "16px 32px",
            backgroundColor: "transparent",
            color: "#5B8CFF",
            textDecoration: "none",
            border: "2px solid #5B8CFF",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px"
          }}
        >
          Post a Job
        </Link>
      </div>
      
      <div style={{ marginTop: "60px", display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔒</div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Zero-Knowledge Proofs</h3>
          <p style={{ color: "#666", fontSize: "14px" }}>Prove eligibility without revealing data</p>
        </div>
        
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>⚡</div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Real-time Verification</h3>
          <p style={{ color: "#666", fontSize: "14px" }}>Instant proof generation</p>
        </div>
        
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🌐</div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Midnight Network</h3>
          <p style={{ color: "#666", fontSize: "14px" }}>Built on privacy-first blockchain</p>
        </div>
      </div>
    </div>
  );
}

function PostJobPlaceholder() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>Post a Job</h1>
      <p style={{ color: "#666", marginBottom: "40px" }}>Coming soon: Create job listings with ZK requirements</p>
      <Link to="/" style={{ color: "#5B8CFF", textDecoration: "none" }}>← Back to Home</Link>
    </div>
  );
}

export const ghostHireRouter = createBrowserRouter([
  {
    path: "/",
    element: <GhostHireLayout />,
    children: [
      {
        index: true,
        element: <GhostHireLanding />,
      },
      {
        path: "jobs",
        element: <JobsPage />,
      },
      {
        path: "jobs/post",
        element: <JobPostingPage />,
      },
      {
        path: "jobs/:jobId/apply",
        element: <JobApplicationPage />,
      },
      {
        path: "application-confirmation/:applicationId",
        element: <ApplicationConfirmationPage />,
      },
      {
        path: "applications",
        element: <div style={{ textAlign: "center", padding: "40px" }}><h2>My Applications</h2><p>Feature coming soon...</p></div>,
      },
      {
        path: "post",
        element: <PostJobPlaceholder />,
      },
      {
        path: "auth/login",
        element: <LoginPage />,
      },
      {
        path: "auth/register", 
        element: <RegisterPage />,
      },
    ],
  },
]);
