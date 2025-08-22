import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { ConnectWalletButton } from "../wallet/ConnectWalletButton";
import { useTheme } from "../components/ThemeProvider";
import AccessibilitySettings from "../components/AccessibilitySettings";
import { Menu, X, Settings, Sun, Moon } from "lucide-react";

export function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-dvh" style={{backgroundColor: "var(--warm-off-black)", color: "var(--warm-off-white)"}}>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md"
        style={{
          position: 'absolute',
          top: '-40px',
          left: '6px',
          background: 'var(--primary)',
          color: 'white',
          padding: '8px 16px',
          textDecoration: 'none',
          borderRadius: '6px',
          zIndex: 1000,
          transition: 'top 0.2s ease'
        }}
        onFocus={(e) => e.target.style.top = '6px'}
        onBlur={(e) => e.target.style.top = '-40px'}
      >
        Skip to main content
      </a>
      
      {/* Sophisticated Header */}
      <header 
        className="sticky top-0 z-50" 
        role="banner"
        style={{
          background: "rgba(26, 25, 23, 0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)"
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-20 px-4 md:px-6">
            {/* Logo with Gradient */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
              style={{textDecoration: "none"}}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--info) 100%)",
                  color: "var(--warm-off-black)"
                }}
              >
                G
              </div>
              <span 
                className="h2 transition-all duration-300 group-hover:opacity-80" 
                style={{
                  background: "linear-gradient(135deg, var(--warm-off-white) 0%, var(--primary) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textTransform: "none",
                  fontSize: "1.5rem",
                  fontWeight: "600"
                }}
              >
                GhostHire
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-10 xl:gap-12">
              <NavLink 
                to="/jobs" 
                className={({ isActive }) => `
                  text-sm md:text-base lg:text-lg font-medium transition-all duration-300 relative whitespace-nowrap px-2
                  ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
                `}
                style={({isActive}) => ({
                  color: isActive ? "var(--primary)" : "var(--warm-off-white)",
                  textDecoration: "none",
                  borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                  paddingBottom: "0.5rem"
                })}
              >
                Browse Jobs
              </NavLink>
              <NavLink 
                to="/post" 
                className={({ isActive }) => `
                  text-sm md:text-base lg:text-lg font-medium transition-all duration-300 relative whitespace-nowrap px-2
                  ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
                `}
                style={({isActive}) => ({
                  color: isActive ? "var(--primary)" : "var(--warm-off-white)",
                  textDecoration: "none",
                  borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                  paddingBottom: "0.5rem"
                })}
              >
                Post a Job
              </NavLink>
              <NavLink 
                to="/applications" 
                className={({ isActive }) => `
                  text-sm md:text-base lg:text-lg font-medium transition-all duration-300 relative whitespace-nowrap px-2
                  ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
                `}
                style={({isActive}) => ({
                  color: isActive ? "var(--primary)" : "var(--warm-off-white)",
                  textDecoration: "none",
                  borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                  paddingBottom: "0.5rem"
                })}
              >
                Applications
              </NavLink>
              <a 
                href="/docs" 
                className="text-sm md:text-base lg:text-lg font-medium opacity-70 hover:opacity-100 transition-all duration-300 whitespace-nowrap px-2"
                style={{
                  color: "var(--warm-off-white)",
                  textDecoration: "none",
                  borderBottom: "2px solid transparent",
                  paddingBottom: "0.5rem"
                }}
              >
                Docs
              </a>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all duration-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{color: "var(--warm-off-white)"}}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Moon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              {/* Accessibility Settings */}
              <button
                onClick={() => setAccessibilityOpen(true)}
                className="p-2 rounded-lg transition-all duration-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{color: "var(--warm-off-white)"}}
                aria-label="Open accessibility settings"
                title="Accessibility settings"
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </button>

                          {/* Wallet Connection */}
            {/* <ConnectWalletButton /> */}
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{color: "var(--warm-off-white)"}}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden border-t"
            role="navigation"
            aria-label="Mobile navigation"
            style={{
              background: "rgba(26, 25, 23, 0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid var(--border)"
            }}
          >
            <div className="grid-container px-6 py-6">
              <nav className="flex flex-col gap-4">
                <NavLink 
                  to="/jobs" 
                  className="body-large font-medium opacity-70 hover:opacity-100 transition-all duration-300 py-2"
                  style={{color: "var(--warm-off-white)", textDecoration: "none"}}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Jobs
                </NavLink>
                <NavLink 
                  to="/post" 
                  className="body-large font-medium opacity-70 hover:opacity-100 transition-all duration-300 py-2"
                  style={{color: "var(--warm-off-white)", textDecoration: "none"}}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Post a Job
                </NavLink>
                <NavLink 
                  to="/applications" 
                  className="body-large font-medium opacity-70 hover:opacity-100 transition-all duration-300 py-2"
                  style={{color: "var(--warm-off-white)", textDecoration: "none"}}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Applications
                </NavLink>
                <a 
                  href="/docs" 
                  className="body-large font-medium opacity-70 hover:opacity-100 transition-all duration-300 py-2"
                  style={{color: "var(--warm-off-white)", textDecoration: "none"}}
                >
                  Docs
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main 
        id="main-content"
        className="pb-24"
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>

      {/* Sophisticated Footer */}
      <footer style={{borderTop: "1px solid var(--border)"}}>
        <div className="grid-container px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--info) 100%)",
                    color: "var(--warm-off-black)"
                  }}
                >
                  G
                </div>
                <span 
                  className="h3"
                  style={{
                    background: "linear-gradient(135deg, var(--warm-off-white) 0%, var(--primary) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textTransform: "none"
                  }}
                >
                  GhostHire
                </span>
              </div>
              <p className="body-large mb-6" style={{opacity: "0.8", maxWidth: "400px"}}>
                Privacy-first job applications powered by zero-knowledge proofs.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://github.com" 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/5"
                  style={{border: "1px solid var(--border)"}}
                >
                  <span className="body-small">GH</span>
                </a>
                <a 
                  href="https://twitter.com" 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/5"
                  style={{border: "1px solid var(--border)"}}
                >
                  <span className="body-small">TW</span>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="h3 mb-4" style={{textTransform: "none", fontSize: "1.1rem"}}>Product</h4>
              <ul className="space-y-3">
                <li><a href="/features" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.7", textDecoration: "none", color: "var(--warm-off-white)"}}>Features</a></li>
                <li><a href="/pricing" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.7", textDecoration: "none", color: "var(--warm-off-white)"}}>Pricing</a></li>
                <li><a href="/api" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.7", textDecoration: "none", color: "var(--warm-off-white)"}}>API</a></li>
                <li><a href="/docs" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.7", textDecoration: "none", color: "var(--warm-off-white)"}}>Documentation</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="h3 mb-4" style={{textTransform: "none", fontSize: "1.1rem"}}>Company</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.7", textDecoration: "none", color: "var(--warm-off-white)"}}>About</a></li>
                <li><a href="/blog" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.7", textDecoration: "none", color: "var(--warm-off-white)"}}>Blog</a></li>
                <li><a href="/careers" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.7", textDecoration: "none", color: "var(--warm-off-white)"}}>Careers</a></li>
                <li><a href="/contact" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.7", textDecoration: "none", color: "var(--warm-off-white)"}}>Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between pt-8 mt-8" style={{borderTop: "1px solid var(--border)"}}>
            <div className="body-small" style={{opacity: "0.6"}}>
              © 2024 GhostHire. Built with ❤️ for privacy.<br/>
              Apache 2.0 License • Powered by Midnight Network
            </div>
            <div className="flex gap-6">
              <a href="/privacy" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.6", textDecoration: "none", color: "var(--warm-off-white)"}}>Privacy</a>
              <a href="/terms" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.6", textDecoration: "none", color: "var(--warm-off-white)"}}>Terms</a>
              <a href="/security" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.6", textDecoration: "none", color: "var(--warm-off-white)"}}>Security</a>
              <a href="/compliance" className="body-small transition-all duration-300 hover:opacity-100" style={{opacity: "0.6", textDecoration: "none", color: "var(--warm-off-white)"}}>Compliance</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Accessibility Settings Modal */}
      <AccessibilitySettings 
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />

      {/* Accessibility announcement region */}
      <div
        id="accessibility-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
}
