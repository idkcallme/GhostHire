import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

console.log("🚀 GhostHire with Router Starting!");

// Header component
function Header() {
  return (
    <header style={{ 
      backgroundColor: '#5B8CFF', 
      color: 'white', 
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ margin: '0 0 15px 0', fontSize: '28px' }}>🚀 GhostHire</h1>
      <nav>
        <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none', fontSize: '16px' }}>Home</Link>
        <Link to="/jobs" style={{ color: 'white', marginRight: '20px', textDecoration: 'none', fontSize: '16px' }}>Jobs</Link>
        <Link to="/applications" style={{ color: 'white', marginRight: '20px', textDecoration: 'none', fontSize: '16px' }}>Applications</Link>
        <Link to="/post" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>Post Job</Link>
      </nav>
    </header>
  );
}

// Home page
function HomePage() {
  return (
    <div>
      <Header />
      <main style={{ padding: '40px 20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: '#333', fontSize: '36px', marginBottom: '20px' }}>Welcome to GhostHire</h2>
        <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.6', marginBottom: '30px' }}>
          The privacy-preserving job board that uses zero-knowledge proofs to verify your qualifications 
          without revealing sensitive personal data.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <h3 style={{ color: '#5B8CFF', marginBottom: '10px' }}>🔍 Find Jobs</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>Browse opportunities from top companies looking for qualified candidates.</p>
            <Link to="/jobs" style={{ 
              display: 'inline-block',
              padding: '10px 20px', 
              backgroundColor: '#5B8CFF', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '16px'
            }}>Browse Jobs</Link>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <h3 style={{ color: '#28a745', marginBottom: '10px' }}>📝 Post Jobs</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>Find qualified candidates while respecting their privacy.</p>
            <Link to="/post" style={{ 
              display: 'inline-block',
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '16px'
            }}>Post a Job</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// Jobs page
function JobsPage() {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>📋 Available Jobs</h2>
        <div style={{ display: 'grid', gap: '20px', maxWidth: '800px' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff' }}>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Senior Rust Developer</h3>
            <p><strong>Company:</strong> BlockTech Solutions</p>
            <p><strong>Location:</strong> Remote, US/CA/EU</p>
            <p><strong>Salary:</strong> $120,000 - $180,000</p>
            <p><strong>Skills:</strong> Rust, Zero-Knowledge Proofs, Blockchain</p>
            <button style={{ 
              backgroundColor: '#5B8CFF', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '5px', 
              cursor: 'pointer',
              marginTop: '10px'
            }}>
              Apply with ZK Proof
            </button>
          </div>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff' }}>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>ZK Protocol Engineer</h3>
            <p><strong>Company:</strong> Privacy Labs</p>
            <p><strong>Location:</strong> Remote, Global</p>
            <p><strong>Salary:</strong> $140,000 - $200,000</p>
            <p><strong>Skills:</strong> Cryptography, Zero-Knowledge, Mathematics</p>
            <button style={{ 
              backgroundColor: '#5B8CFF', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '5px', 
              cursor: 'pointer',
              marginTop: '10px'
            }}>
              Apply with ZK Proof
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Applications page
function ApplicationsPage() {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>📄 My Applications</h2>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f0f8ff', 
          border: '1px solid #5B8CFF', 
          borderRadius: '8px',
          maxWidth: '600px'
        }}>
          <h3 style={{ color: '#5B8CFF', marginBottom: '10px' }}>🔒 Privacy-First Applications</h3>
          <p style={{ color: '#666' }}>
            All your applications use zero-knowledge proofs to verify qualifications 
            without revealing personal data. Your applications will appear here once submitted.
          </p>
        </div>
      </main>
    </div>
  );
}

// Post Job page
function PostJobPage() {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>📝 Post a Job</h2>
        <div style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '30px',
          maxWidth: '600px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Create Job Posting</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Job Title</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Rust Developer" 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontSize: '16px'
                }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Company</label>
              <input 
                type="text" 
                placeholder="e.g. BlockTech Solutions" 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontSize: '16px'
                }} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Min Salary</label>
                <input 
                  type="number" 
                  placeholder="120000" 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '16px'
                  }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Max Salary</label>
                <input 
                  type="number" 
                  placeholder="180000" 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontSize: '16px'
                  }} 
                />
              </div>
            </div>
            <button style={{ 
              backgroundColor: '#5B8CFF', 
              color: 'white', 
              border: 'none', 
              padding: '15px 30px', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontSize: '16px', 
              fontWeight: 'bold',
              marginTop: '20px'
            }}>
              Post Job with ZK Requirements
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Router setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/jobs",
    element: <JobsPage />,
  },
  {
    path: "/applications",
    element: <ApplicationsPage />,
  },
  {
    path: "/post",
    element: <PostJobPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

console.log("✅ GhostHire with full navigation rendered!");
