"use client";

import { useEffect } from "react";

// Special Next.js file: this is the ONLY boundary that can catch an error
// thrown by the ROOT layout.jsx itself (AuthProvider, Navbar, Footer, etc).
// Because it replaces the entire root layout when active, it must render
// its own <html> and <body> tags - there's no parent layout left to rely on.
// Kept intentionally simple/self-contained (inline styles, no imports of
// app components like Modal or Navbar) since those could be part of
// whatever just crashed.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0E1F",
          color: "#F5F5F9",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "420px" }}>
          <span style={{ fontSize: "48px" }}>⚠️</span>
          <div style={{ height: "1px", width: "56px", background: "#262C4D", margin: "20px auto" }} />
          <h1 style={{ fontSize: "22px", marginBottom: "10px" }}>The app hit a critical error.</h1>
          <p style={{ fontSize: "14px", color: "#9AA0C3", marginBottom: "28px" }}>
            Something went wrong at the core of the application. Please try reloading -
            if this keeps happening, our team is already looking into it.
          </p>
          <button
            onClick={() => reset()}
            style={{
              backgroundImage: "linear-gradient(135deg, #6366F1, #A855F7, #EC4899)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload app
          </button>
        </div>
      </body>
    </html>
  );
}