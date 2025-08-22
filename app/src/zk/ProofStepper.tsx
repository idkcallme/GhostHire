import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Stepper } from "../components/ui/Stepper";
import { Button } from "../components/ui/Button";
import { PrivacyPanel } from "../components/PrivacyPanel";
import { Upload, FileText } from "lucide-react";

export function ProofStepper({ job }: { job: any }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [proof, setProof] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [stepStatuses, setStepStatuses] = useState<("idle" | "loading" | "success" | "error")[]>(["idle", "idle", "idle"]);

  // Update step statuses based on state
  useEffect(() => {
    setStepStatuses(prev => {
      const newStatuses = [...prev];
      newStatuses[0] = profile ? "success" : "idle";
      return newStatuses;
    });
  }, [profile]);

  const steps = [
    {
      id: "profile",
      title: "Load Profile",
      description: "Load your credentials or use a sample profile",
      status: stepStatuses[0]
    },
    {
      id: "proof",
      title: "Build Proof",
      description: "Generate ZK proof locally",
      status: stepStatuses[1]
    },
    {
      id: "submit",
      title: "Review & Submit",
      description: "Verify proof and submit application",
      status: stepStatuses[2]
    }
  ];

  function next() { 
    setStep((s) => Math.min(s + 1, steps.length - 1)); 
  }
  
  function back() { 
    setStep((s) => Math.max(s - 1, 0)); 
  }

  async function buildProof() {
    try {
      setLoading(true);
      setStepStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[1] = "loading";
        return newStatuses;
      });
      
      // TODO: call /proof-server with witness; handle retries
      await new Promise(r => setTimeout(r, 1200));
      
      setProof({ 
        ok: true, 
        publicSignals: { 
          jobId: job.id, 
          nullifier: "0x8f3c…" 
        }
      });
      
      setStepStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[1] = "success";
        return newStatuses;
      });
      toast.success("Proof generated successfully");
      next();
    } catch (e: any) {
      setStepStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[1] = "error";
        return newStatuses;
      });
      toast.error("Failed to build proof. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    try {
      setLoading(true);
      setStepStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[2] = "loading";
        return newStatuses;
      });
      
      // Simulate blockchain submission with realistic timing
      await new Promise(r => setTimeout(r, 2500));
      
      // Generate transaction hash
      const transactionHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      // Create application record
      const application = {
        id: "app-" + Date.now(),
        jobId: job.id,
        jobTitle: "Senior Rust Protocol Engineer", // In real app, get from job data
        company: "ZK Labs",
        status: "pending" as const,
        submittedAt: new Date(),
        transactionHash,
        privacyScore: 97,
        zkProof: proof,
        profile: {
          skillsRevealed: false,
          locationRevealed: false,
          salaryRevealed: false,
          nullifierGenerated: true
        }
      };
      
      // Save to localStorage (in real app, this would be blockchain/backend)
      const existingApplications = JSON.parse(localStorage.getItem('ghosthire_applications') || '[]');
      existingApplications.push(application);
      localStorage.setItem('ghosthire_applications', JSON.stringify(existingApplications));
      
      setStepStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[2] = "success";
        return newStatuses;
      });
      
      toast.success("Application submitted to blockchain!");
      
      // Navigate to receipt page
      setTimeout(() => {
        window.location.href = `/receipt/${transactionHash}`;
      }, 1000);
    } catch {
      setStepStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[2] = "error";
        return newStatuses;
      });
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    if (step === 0 && !profile) return;
    if (step === 1) {
      buildProof();
    } else {
      next();
    }
  };

  const handleFinish = () => {
    submit();
  };

  return (
    <div className="space-y-6">
      <Stepper
        steps={steps}
        currentStep={step}
        onNext={handleNext}
        onBack={back}
        onFinish={handleFinish}
        nextDisabled={step === 0 && !profile}
        loading={loading}
      />

      {/* Step Content */}
      {step === 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Load Your Profile</h3>
          <p className="subtle mb-4">
            Load a sample profile or upload your credentials. Your data never leaves the browser.
          </p>
          
          <div className="space-y-4">
            <Button
              variant="secondary"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => {
                setProfile({ 
                  skills: { rust: 72, ts: 65, zk: 58 }, 
                  region: "CA-ON", 
                  salary: 60000 
                });
                toast.success("Sample profile loaded");
              }}
              className="w-full"
            >
              Use Sample Profile
            </Button>
            
            <div className="relative">
              <Button
                variant="secondary"
                icon={<Upload className="w-4 h-4" />}
                className="w-full"
                onClick={() => document.getElementById('profile-upload')?.click()}
              >
                Upload Profile JSON
              </Button>
              <input
                id="profile-upload"
                type="file"
                accept="application/json"
                className="sr-only"
                aria-label="Upload profile JSON file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      try {
                        const profile = JSON.parse(e.target?.result as string);
                        setProfile(profile);
                        toast.success("Profile loaded successfully");
                      } catch {
                        toast.error("Invalid JSON file. Please check the format.");
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </div>
          </div>

          {profile && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>Profile loaded:</strong> Rust {profile.skills.rust}, TS {profile.skills.ts}, ZK {profile.skills.zk} • {profile.region} • ${profile.salary.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Generate ZK Proof</h3>
          <p className="subtle mb-4">
            The proof will verify your eligibility without revealing your actual data.
          </p>
          
          <div className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Thresholds check (Rust ≥{job.thresholds.rust}, TS ≥{job.thresholds.ts}, ZK ≥{job.thresholds.zk})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Region membership verification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Salary range validation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && proof && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Review Your Application</h3>
            <p className="subtle mb-4">
              Verify the information that will be revealed vs kept private.
            </p>
          </div>

          <PrivacyPanel
            revealed={{
              eligible: true,
              jobId: proof.publicSignals.jobId,
              nullifier: proof.publicSignals.nullifier
            }}
            keptPrivate={{
              skills: ["rust", "ts", "zk"],
              region: profile?.region || "CA-ON",
              salary: `$${profile?.salary?.toLocaleString() || "60,000"}`
            }}
            variant="detailed"
          />
        </div>
      )}
    </div>
  );
}
