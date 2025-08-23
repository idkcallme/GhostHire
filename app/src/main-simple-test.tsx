// Simple working version to test
import React from 'react';
import ReactDOM from 'react-dom/client';

console.log("🚀 Loading Simple Test App...");

const App: React.FC = () => {
  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#1a1a1a'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#666'
          }} />
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '1rem',
          letterSpacing: '-0.02em'
        }}>
          GhostHire
        </h1>
        
        <p style={{
          color: '#666',
          fontSize: '1rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          Privacy-first professional networking with zero-knowledge proofs
        </p>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button style={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Browse Jobs
          </button>
          
          <button style={{
            backgroundColor: 'transparent',
            color: '#1a1a1a',
            border: '1px solid rgba(26, 26, 26, 0.2)',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Sign Up
          </button>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#666'
        }}>
          ✅ Frontend Running<br/>
          ✅ Beautiful Minimalist Design<br/>
          🔄 API Integration Loading...
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("✅ Simple GhostHire App Rendered!");
