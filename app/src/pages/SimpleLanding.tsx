import React from "react";
import { ShieldCheck, Lock, BadgeCheck, ArrowRight, Play, Clock, Eye, EyeOff, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Simple Privacy Panel that doesn't use CSS classes
function SimplePrivacyPanel() {
  return (
    <div style={{
      backgroundColor: '#2a2827',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #3a3937'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: '#5B8CFF20', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Eye style={{ width: '16px', height: '16px', color: '#5B8CFF' }} />
        </div>
        <h3 style={{ color: '#5B8CFF', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>
          Privacy Transparency
        </h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Revealed Panel */}
        <div style={{ backgroundColor: '#1a3a1a', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: '#10b98120', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Check style={{ width: '12px', height: '12px', color: '#10b981' }} />
            </div>
            <h4 style={{ fontWeight: '600', color: '#10b981' }}>Revealed</h4>
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ opacity: '0.7' }}>Eligible:</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>✓ true</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ opacity: '0.7' }}>Job ID:</span>
              <code style={{ fontSize: '12px', backgroundColor: '#1a1917', padding: '4px 8px', borderRadius: '4px', border: '1px solid #3a3937' }}>
                0x12ab…
              </code>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ opacity: '0.7' }}>Nullifier:</span>
              <code style={{ fontSize: '12px', backgroundColor: '#1a1917', padding: '4px 8px', borderRadius: '4px', border: '1px solid #3a3937' }}>
                0x8f3c…
              </code>
            </div>
          </div>
        </div>

        {/* Kept Private Panel */}
        <div style={{ backgroundColor: '#2a2827', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: '#3a3937', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Lock style={{ width: '12px', height: '12px', color: 'white', opacity: '0.6' }} />
            </div>
            <h4 style={{ fontWeight: '600', color: 'white', opacity: '0.8' }}>Kept Private</h4>
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <EyeOff style={{ width: '12px', height: '12px', opacity: '0.6' }} />
              <span style={{ opacity: '0.7' }}>
                <strong>Skills:</strong> rust, ts, zk
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <EyeOff style={{ width: '12px', height: '12px', opacity: '0.6' }} />
              <span style={{ opacity: '0.7' }}>
                <strong>Region:</strong> CA-ON
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EyeOff style={{ width: '12px', height: '12px', opacity: '0.6' }} />
              <span style={{ opacity: '0.7' }}>
                <strong>Salary:</strong> $60k
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SimpleLanding() {
  const navigate = useNavigate();

  const handleQuickDemo = () => {
    navigate("/jobs/1?demo=true");
  };

  return (
    <div style={{
      backgroundColor: '#1a1917',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 50px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5B8CFF' }} />
              <span style={{ color: '#5B8CFF', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Privacy-First Job Applications
              </span>
            </div>
            
            <h1 style={{ fontSize: '3.5rem', marginBottom: '32px', lineHeight: '1.1' }}>
              Prove You Qualify—
              <br />
              <span style={{ color: '#5B8CFF' }}>Without Oversharing</span>
            </h1>
            
            <p style={{ fontSize: '1.25rem', marginBottom: '48px', opacity: '0.8', maxWidth: '40rem' }}>
              Generate ZK proofs for skills, region, and salary fit.{' '}
              <strong style={{ color: 'white', opacity: '1' }}>Reveal nothing else.</strong>
            </p>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <button style={{
                backgroundColor: '#5B8CFF',
                color: 'white',
                padding: '16px 32px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Connect Wallet
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </button>
              <button 
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '16px 32px',
                  border: '2px solid #3a3937',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onClick={handleQuickDemo}
              >
                Try Demo (2 min)
              </button>
            </div>
          </div>

          {/* Enhanced Privacy Panel */}
          <div>
            <SimplePrivacyPanel />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 50px', borderTop: '1px solid #3a3937', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>How It Works</h2>
          <p style={{ fontSize: '1.125rem', opacity: '0.7', maxWidth: '32rem', margin: '0 auto' }}>
            A simple three-step process that keeps your data private while proving your eligibility
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
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
            <div key={i} style={{
              backgroundColor: '#2a2827',
              padding: '32px',
              borderRadius: '12px',
              border: '1px solid #3a3937'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  width: '48px',
                  height: '48px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#5B8CFF20',
                  fontSize: '24px'
                }}>
                  {step.icon}
                </div>
                <div style={{
                  display: 'flex',
                  width: '32px',
                  height: '32px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#5B8CFF',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {i + 1}
                </div>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>{step.title}</h3>
              <p style={{ opacity: '0.7', lineHeight: '1.6' }}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 50px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Why Choose GhostHire?</h2>
          <p style={{ fontSize: '1.125rem', opacity: '0.7', maxWidth: '32rem', margin: '0 auto' }}>
            Built with privacy and security at the core
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { icon: <ShieldCheck style={{ width: '24px', height: '24px' }} />, title: "Zero-Knowledge Proofs", desc: "Eligibility without revealing sensitive data." },
            { icon: <Lock style={{ width: '24px', height: '24px' }} />, title: "Privacy First", desc: "Your skills, region, and salary expectations stay private." },
            { icon: <BadgeCheck style={{ width: '24px', height: '24px' }} />, title: "Anti-Sybil", desc: "Per-applicant nullifiers prevent spam." },
            { icon: <Clock style={{ width: '24px', height: '24px' }} />, title: "Instant Verification", desc: "On-chain verification with immediate results." }
          ].map((feature, i) => (
            <div key={i} style={{
              backgroundColor: '#2a2827',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #3a3937'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ color: '#5B8CFF' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontWeight: '600' }}>{feature.title}</h3>
              </div>
              <p style={{ opacity: '0.7', lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 50px', borderTop: '1px solid #3a3937', background: 'linear-gradient(to right, #5B8CFF10, transparent, #10b98110)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '48rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Ready to Experience Privacy-First Applications?</h2>
          <p style={{ fontSize: '1.125rem', opacity: '0.7', marginBottom: '32px' }}>
            Join the future of privacy-preserving job applications. 
            No more oversharing, just proof of qualification.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button style={{
              backgroundColor: '#5B8CFF',
              color: 'white',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Play style={{ width: '20px', height: '20px' }} />
              Connect Wallet
            </button>
            <button 
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '16px 32px',
                border: '2px solid #3a3937',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => navigate("/post")}
            >
              Post a Job
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
