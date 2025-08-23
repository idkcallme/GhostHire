import React from "react";
import { useParams, Link } from "react-router-dom";

export function ApplicationConfirmationPage() {
  const { jobId } = useParams<{ jobId: string }>();

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
      {/* Success Icon */}
      <div style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "#10b981",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 32px auto"
      }}>
        <span style={{ color: "white", fontSize: "40px" }}>✓</span>
      </div>

      {/* Success Message */}
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px", color: "#1f2937" }}>
        Application Submitted Successfully!
      </h1>
      
      <p style={{ color: "#666", fontSize: "18px", marginBottom: "32px", lineHeight: "1.6" }}>
        Your privacy-preserving job application has been submitted with zero-knowledge proofs. 
        The employer can verify your qualifications without accessing your sensitive data.
      </p>

      {/* Application Details */}
      <div style={{
        backgroundColor: "#f8faff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "32px",
        textAlign: "left"
      }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#5B8CFF" }}>
          What happens next?
        </h3>
        
        <div style={{ display: "grid", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ color: "#5B8CFF", fontSize: "18px" }}>1️⃣</span>
            <div>
              <p style={{ fontWeight: "500", marginBottom: "4px" }}>Proof Verification</p>
              <p style={{ color: "#666", fontSize: "14px" }}>
                The employer verifies your ZK proofs without seeing your private data
              </p>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ color: "#5B8CFF", fontSize: "18px" }}>2️⃣</span>
            <div>
              <p style={{ fontWeight: "500", marginBottom: "4px" }}>Application Review</p>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Your application will be reviewed by the hiring team
              </p>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ color: "#5B8CFF", fontSize: "18px" }}>3️⃣</span>
            <div>
              <p style={{ fontWeight: "500", marginBottom: "4px" }}>Response</p>
              <p style={{ color: "#666", fontSize: "14px" }}>
                You'll receive an update via email within 5-7 business days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Benefits */}
      <div style={{
        backgroundColor: "#f0f9ff",
        border: "1px solid #5B8CFF20",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "32px",
        textAlign: "left"
      }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#5B8CFF" }}>
          🔒 Privacy Protected
        </h3>
        
        <div style={{ display: "grid", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#10b981" }}>✓</span>
            <span style={{ fontSize: "14px" }}>Your personal details remain private</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#10b981" }}>✓</span>
            <span style={{ fontSize: "14px" }}>Salary history is cryptographically proven, not revealed</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#10b981" }}>✓</span>
            <span style={{ fontSize: "14px" }}>Education credentials verified without disclosure</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#10b981" }}>✓</span>
            <span style={{ fontSize: "14px" }}>Background checks proven without revealing details</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          to="/applications"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#5B8CFF",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "600"
          }}
        >
          View My Applications
        </Link>
        
        <Link
          to="/jobs"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "transparent",
            color: "#5B8CFF",
            textDecoration: "none",
            border: "2px solid #5B8CFF",
            borderRadius: "8px",
            fontWeight: "600"
          }}
        >
          Browse More Jobs
        </Link>
      </div>

      {/* Reference Number */}
      <div style={{ marginTop: "32px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
          Application Reference
        </p>
        <p style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: "600" }}>
          GH-{jobId}-{Date.now().toString().slice(-6)}
        </p>
      </div>
    </div>
  );
}
