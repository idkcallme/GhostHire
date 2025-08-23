import React from "react";
import { ShieldCheck, Lock, BadgeCheck, ArrowRight, Play, Clock } from "lucide-react";
import { PrivacyPanel } from "../components/PrivacyPanel";
import { useNavigate } from "react-router-dom";

export function Landing() {
  const navigate = useNavigate();

  const handleQuickDemo = () => {
    navigate("/jobs/1?demo=true");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="section-large relative overflow-hidden">
        <div className="grid-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full status-pulse" style={{background: "var(--primary)"}} />
                <span className="body-small" style={{color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em"}}>
                  Privacy-First Job Applications
                </span>
              </div>
              
              <h1 className="h1 mb-8">
                Prove You Qualify—
                <br />
                <span style={{color: "var(--primary)"}}>Without Oversharing</span>
              </h1>
              
              <p className="body-large mb-12" style={{maxWidth: "40rem", opacity: "0.8"}}>
                Use zero-knowledge proofs to demonstrate your qualifications while keeping sensitive information private.
                <strong style={{color: "var(--warm-off-white)", opacity: "1"}}> Reveal nothing else.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={() => navigate("/jobs")}
                  className="btn btn-primary btn-large group"
                >
                  <span>Browse Jobs</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button 
                  onClick={handleQuickDemo}
                  className="btn btn-secondary btn-large group"
                >
                  <Play className="w-5 h-5" />
                  <span>Quick Demo</span>
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm opacity-70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: "var(--info)"}} />
                  <span>Zero-Knowledge Proofs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Real-time Verification</span>
                </div>
              </div>
            </div>

            <div className="lg:order-first animate-fade-in-up animation-delay-200">
              <PrivacyPanel />
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-info/5 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-info/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Rest of the content would go here */}
    </>
  );
}
