import React from "react";
import ReactDOM from "react-dom/client";

console.log("🔥 FRESH GhostHire App Starting!");

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', fontSize: '32px' }}>
        🚀 GhostHire Job Board - Fresh Start
      </h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        This app is working! Time: {new Date().toLocaleTimeString()}
      </p>
      <div style={{ marginTop: '20px' }}>
        <button style={{ 
          padding: '10px 20px', 
          margin: '5px',
          backgroundColor: '#5B8CFF', 
          color: 'white', 
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Browse Jobs
        </button>
        <button style={{ 
          padding: '10px 20px', 
          margin: '5px',
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Post a Job
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("✅ Fresh GhostHire app rendered!");
