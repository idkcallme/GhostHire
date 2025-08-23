import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useSimpleTheme } from "../components/SimpleThemeProvider";

export function SimpleRootLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useSimpleTheme();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1917' : '#ffffff';
  const textColor = isDark ? '#f5f5f4' : '#1a1917';
  const borderColor = isDark ? '#3a3937' : '#e5e5e5';
  const primaryColor = '#5B8CFF';

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: `${bgColor}ee`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${borderColor}`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px', padding: '0 24px' }}>
            {/* Logo */}
            <Link 
              to="/" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                textDecoration: 'none',
                color: textColor
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${primaryColor} 0%, #10b981 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                G
              </div>
              <span style={{
                fontSize: '24px',
                fontWeight: '600',
                color: primaryColor
              }}>
                GhostHire
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
              <div style={{ display: 'flex', gap: '32px' }}>
                <Link 
                  to="/jobs" 
                  style={{ 
                    textDecoration: 'none', 
                    color: textColor, 
                    fontSize: '16px',
                    fontWeight: '500',
                    opacity: '0.8',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '1'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '0.8'}
                >
                  Browse Jobs
                </Link>
                <Link 
                  to="/post" 
                  style={{ 
                    textDecoration: 'none', 
                    color: textColor, 
                    fontSize: '16px',
                    fontWeight: '500',
                    opacity: '0.8',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '1'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '0.8'}
                >
                  Post a Job
                </Link>
                <Link 
                  to="/applications" 
                  style={{ 
                    textDecoration: 'none', 
                    color: textColor, 
                    fontSize: '16px',
                    fontWeight: '500',
                    opacity: '0.8',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '1'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '0.8'}
                >
                  Applications
                </Link>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Toggle theme"
              >
                {isDark ? <Sun style={{ width: '20px', height: '20px' }} /> : <Moon style={{ width: '20px', height: '20px' }} />}
              </button>

              {/* Mobile Menu Button */}
              <button
                style={{
                  display: 'none',
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  cursor: 'pointer'
                }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${borderColor}`, marginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            {/* Brand Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${primaryColor} 0%, #10b981 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  G
                </div>
                <span style={{ fontSize: '20px', fontWeight: '600', color: primaryColor }}>
                  GhostHire
                </span>
              </div>
              <p style={{ opacity: '0.8', maxWidth: '300px', lineHeight: '1.6' }}>
                Privacy-first job applications powered by zero-knowledge proofs.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/features" style={{ color: textColor, textDecoration: 'none', opacity: '0.7' }}>Features</a>
                <a href="/pricing" style={{ color: textColor, textDecoration: 'none', opacity: '0.7' }}>Pricing</a>
                <a href="/docs" style={{ color: textColor, textDecoration: 'none', opacity: '0.7' }}>Documentation</a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/about" style={{ color: textColor, textDecoration: 'none', opacity: '0.7' }}>About</a>
                <a href="/blog" style={{ color: textColor, textDecoration: 'none', opacity: '0.7' }}>Blog</a>
                <a href="/contact" style={{ color: textColor, textDecoration: 'none', opacity: '0.7' }}>Contact</a>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '32px', 
            marginTop: '32px', 
            borderTop: `1px solid ${borderColor}`,
            fontSize: '14px',
            opacity: '0.6'
          }}>
            <div>
              © 2024 GhostHire. Built with ❤️ for privacy.
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="/privacy" style={{ color: textColor, textDecoration: 'none', opacity: '0.6' }}>Privacy</a>
              <a href="/terms" style={{ color: textColor, textDecoration: 'none', opacity: '0.6' }}>Terms</a>
              <a href="/security" style={{ color: textColor, textDecoration: 'none', opacity: '0.6' }}>Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
