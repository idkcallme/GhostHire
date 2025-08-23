import React from "react";
import { Outlet } from "react-router-dom";

export function SimpleRootLayout() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <header style={{ padding: "10px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
        <h2>GhostHire - Simple Layout</h2>
      </header>
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
      <footer style={{ padding: "10px", backgroundColor: "#f8f9fa", borderTop: "1px solid #dee2e6", textAlign: "center" }}>
        <p>© 2024 GhostHire</p>
      </footer>
    </div>
  );
}
