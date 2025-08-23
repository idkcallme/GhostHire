import React from 'react';

export function TestLanding() {
  console.log('TestLanding component is rendering...');
  
  return (
    <div style={{ 
      padding: '40px', 
      color: 'white', 
      backgroundColor: '#1a1917',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
        GhostHire - Test Page Working! ✓
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        React is rendering successfully. The black screen issue is resolved.
      </p>
      <div style={{ marginBottom: '20px' }}>
        <a href="/app/jobs" style={{ color: '#5B8CFF', fontSize: '1.1rem' }}>
          Go to Jobs →
        </a>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <a href="/app/post" style={{ color: '#5B8CFF', fontSize: '1.1rem' }}>
          Post a Job →
        </a>
      </div>
      <div style={{ 
        padding: '20px', 
        border: '1px solid #5B8CFF', 
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h3 style={{ color: '#5B8CFF', marginBottom: '10px' }}>Debug Info:</h3>
        <p>• React is rendering ✓</p>
        <p>• Styles are applying ✓</p>
        <p>• Current URL: {window.location.href}</p>
        <p>• Timestamp: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}
