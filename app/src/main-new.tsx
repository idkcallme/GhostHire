import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { Landing } from "./pages/Landing-simple";

console.log("🔥🔥🔥 BRAND NEW MAIN FILE LOADING! 🔥🔥🔥");

// Completely new GhostHire application
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div style={{ 
        fontFamily: 'Arial, sans-serif', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <header style={{ 
          backgroundColor: '#2c3e50', 
          color: 'white', 
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🚀 GhostHire - Premium Job Board 🚀
          </h1>
          <nav style={{ 
            marginTop: '20px', 
            textAlign: 'center',
            padding: '15px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px'
          }}>
            <Link to="/" style={{ 
              color: 'white', 
              marginRight: '30px', 
              textDecoration: 'none', 
              fontSize: '20px', 
              fontWeight: 'bold',
              padding: '10px 15px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '5px'
            }}>🏠 Home</Link>
            <Link to="/jobs" style={{ 
              color: 'white', 
              marginRight: '30px', 
              textDecoration: 'none', 
              fontSize: '20px', 
              fontWeight: 'bold',
              padding: '10px 15px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '5px'
            }}>💼 Browse Jobs</Link>
            <Link to="/applications" style={{ 
              color: 'white', 
              marginRight: '30px', 
              textDecoration: 'none', 
              fontSize: '20px', 
              fontWeight: 'bold',
              padding: '10px 15px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '5px'
            }}>📋 My Applications</Link>
            <Link to="/post" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '20px', 
              fontWeight: 'bold',
              padding: '10px 15px',
              backgroundColor: '#e74c3c',
              borderRadius: '5px'
            }}>➕ Post New Job</Link>
          </nav>
        </header>
        <main style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
              Welcome to GhostHire! 🎉
            </h2>
            <Landing />
          </div>
        </main>
      </div>
    ),
  },
  {
    path: "/jobs",
    element: (
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '32px', textAlign: 'center' }}>🚀 GhostHire - Browse Jobs</h1>
          <nav style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/" style={{ color: 'white', marginRight: '30px', textDecoration: 'none', fontSize: '18px' }}>🏠 Home</Link>
            <Link to="/jobs" style={{ color: '#f39c12', marginRight: '30px', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>💼 Jobs</Link>
            <Link to="/applications" style={{ color: 'white', marginRight: '30px', textDecoration: 'none', fontSize: '18px' }}>📋 Applications</Link>
            <Link to="/post" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>➕ Post Job</Link>
          </nav>
        </header>
        <main style={{ padding: '40px' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px' }}>Available Positions</h2>
            <div style={{ display: 'grid', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
              {[
                { title: "Senior React Developer", company: "TechCorp", salary: "$120k-150k", location: "Remote" },
                { title: "Full Stack Engineer", company: "StartupXYZ", salary: "$90k-130k", location: "San Francisco, CA" },
                { title: "DevOps Engineer", company: "CloudTech", salary: "$110k-140k", location: "Austin, TX" }
              ].map((job, index) => (
                <div key={index} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  padding: '25px',
                  backgroundColor: '#f8f9fa',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>{job.title}</h3>
                  <p style={{ margin: '5px 0', color: '#666' }}><strong>Company:</strong> {job.company}</p>
                  <p style={{ margin: '5px 0', color: '#666' }}><strong>Salary:</strong> {job.salary}</p>
                  <p style={{ margin: '5px 0', color: '#666' }}><strong>Location:</strong> {job.location}</p>
                  <button style={{
                    marginTop: '15px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}>🔐 Apply with ZK Proof</button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    ),
  }
]);

console.log("✅ NEW ROUTER CREATED WITH AMAZING STYLING!");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

console.log("🎉 COMPLETELY NEW GHOSTHIRE APP IS RUNNING! 🎉");
