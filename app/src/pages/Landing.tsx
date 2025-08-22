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
                Generate ZK proofs for skills, region, and salary fit. 
                <strong style={{color: "var(--warm-off-white)", opacity: "1"}}> Reveal nothing else.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="btn btn-primary">
                  Connect Wallet
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleQuickDemo}
                >
                  Try Demo (2 min)
                </button>
              </div>
              
              <div className="flex flex-col gap-3 body-small">
                <div className="flex items-center gap-3">
                  <div className="status-pulse" />
                  <span>No wallet required</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: "var(--info)"}} />
                  <span>Your data never leaves the browser</span>
                </div>
              </div>
            </div>

            {/* Enhanced Privacy Panel */}
            <div className="animate-slide-in-right">
              <PrivacyPanel
                revealed={{
                  eligible: true,
                  jobId: "0x12ab…",
                  nullifier: "0x8f3c…"
                }}
                keptPrivate={{
                  skills: ["rust", "ts", "zk"],
                  region: "CA-ON",
                  salary: "$60k"
                }}
                variant="detailed"
                className="privacy-panel"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section border-t border-border relative">
        <div className="grid-container">
          <div className="text-center mb-12">
            <h2 className="h2 mb-4">How It Works</h2>
            <p className="text-lg subtle max-w-2xl mx-auto">
              A simple three-step process that keeps your data private while proving your eligibility
            </p>
          </div>
          
          <ol className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Pick a Job",
                description: "Browse public requirements only—no personal data shared.",
                icon: "🎯"
              },
              {
                title: "Generate Proof",
                description: "Your data never leaves the browser. ZK proofs verify eligibility locally.",
                icon: "🔒"
              },
              {
                title: "Submit & Verify",
                description: "On-chain verification with instant results. Only proof outcomes are shared.",
                icon: "⚡"
              }
            ].map((step, i) => (
              <li key={i} className="card group hover:shadow-glow transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="subtle leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Enhanced Features */}
      <section className="section">
        <div className="grid-container">
          <div className="text-center mb-12">
            <h2 className="h2 mb-4">Why Choose GhostHire?</h2>
            <p className="text-lg subtle max-w-2xl mx-auto">
              Built with privacy and security at the core
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Feature 
              icon={<ShieldCheck className="w-6 h-6" />} 
              title="Zero-Knowledge Proofs" 
              desc="Eligibility without revealing sensitive data." 
            />
            <Feature 
              icon={<Lock className="w-6 h-6" />} 
              title="Privacy First" 
              desc="Your skills, region, and salary expectations stay private." 
            />
            <Feature 
              icon={<BadgeCheck className="w-6 h-6" />} 
              title="Anti-Sybil" 
              desc="Per-applicant nullifiers prevent spam." 
            />
            <Feature 
              icon={<Clock className="w-6 h-6" />} 
              title="Instant Verification" 
              desc="On-chain verification with immediate results." 
            />
          </div>
        </div>
      </section>

      {/* Enhanced Value Propositions */}
      <section className="section border-t border-border">
        <div className="grid-container">
          <div className="text-center mb-12">
            <h2 className="h2 mb-4">Built for Everyone</h2>
            <p className="text-lg subtle max-w-2xl mx-auto">
              Whether you're applying or hiring, GhostHire protects your privacy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card group hover:shadow-glow-success">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-success" />
                </div>
                <h3 className="h3">For Applicants</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                  <span className="subtle">No oversharing of personal data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                  <span className="subtle">Cryptographic proof of eligibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                  <span className="subtle">Selective disclosure options</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                  <span className="subtle">Complete control over your information</span>
                </li>
              </ul>
            </div>
            
            <div className="card group hover:shadow-glow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="h3">For Employers</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="subtle">Built on Midnight Network</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="subtle">Open source and transparent</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="subtle">Accessible and user-friendly</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="subtle">Verified candidate quality</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA */}
      <section className="py-16 border-t border-border bg-gradient-to-r from-primary/5 via-transparent to-success/5">
        <div className="grid-container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="h2 mb-4">Ready to Experience Privacy-First Applications?</h2>
            <p className="text-lg subtle mb-8">
              Join the future of privacy-preserving job applications. 
              No more oversharing, just proof of qualification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary">
                <Play className="w-5 h-5 mr-2" />
                Connect Wallet
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate("/post")}
              >
                Post a Job
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({icon, title, desc}:{icon:React.ReactNode; title:string; desc:string}) {
  return (
    <div className="card group hover:shadow-glow transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="subtle leading-relaxed">{desc}</p>
    </div>
  );
}
