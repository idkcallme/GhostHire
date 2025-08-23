import React from "react";
import ReactDOM from "react-dom/client";

// Simple test to make sure React works
function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#5B8CFF' }}>🚀 GhostHire Test</h1>
      <p>If you can see this, React is working!</p>
      <p>The app is successfully loading at localhost:5173</p>
    </div>
  );
}

console.log("🔥 main.tsx is loading...");
const rootElement = document.getElementById("root");
console.log("📍 Root element found:", !!rootElement);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("✅ React app rendered");
} else {
  console.error("❌ Root element not found!");
}
