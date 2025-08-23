import React from "react";
import ReactDOM from "react-dom/client";
import App from "./main-api-integrated.tsx";
import "./index.css";

console.log("🚀 Loading GhostHire with Real API Integration...");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("✅ GhostHire API-Integrated App Rendered!");
