import React from "react";
import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>GhostHire Landing Page</h1>
      <p>Welcome to GhostHire - Testing minimal landing page</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/jobs" style={{ marginRight: "10px", padding: "10px", backgroundColor: "#007bff", color: "white", textDecoration: "none", borderRadius: "4px" }}>
          Browse Jobs
        </Link>
        <Link to="/post" style={{ marginRight: "10px", padding: "10px", backgroundColor: "#28a745", color: "white", textDecoration: "none", borderRadius: "4px" }}>
          Post a Job
        </Link>
        <Link to="/applications" style={{ padding: "10px", backgroundColor: "#6c757d", color: "white", textDecoration: "none", borderRadius: "4px" }}>
          Applications
        </Link>
      </div>
    </div>
  );
}
