import React, { useState } from "react";
import { Briefcase, Target, MapPin, Save, Rocket, Info } from "lucide-react";
import toast from "react-hot-toast";

export function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    // Core skills
    programmingThreshold: 50,
    problemSolvingThreshold: 60,
    // Technical skills
    rustThreshold: 70,
    frontendThreshold: 0,
    backendThreshold: 0,
    blockchainThreshold: 0,
    zkThreshold: 50,
    devopsThreshold: 0,
    // Legacy (keep for compatibility)
    typescriptThreshold: 60,
    // Salary and regions
    salaryMin: 50000,
    salaryMax: 70000,
    regions: [] as string[]
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleRegionToggle = (region: string) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.includes(region) 
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region]
    }));
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    try {
      // Simulate smart contract deployment
      await new Promise(r => setTimeout(r, 2500));
      
      // Generate mock transaction hash
      const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      // Create job record for demo
      const jobData = {
        ...formData,
        id: Date.now().toString(),
        txHash,
        deployedAt: new Date(),
        status: 'active'
      };
      
      // Store in localStorage (in real app, this would be blockchain)
      const existingJobs = JSON.parse(localStorage.getItem('ghosthire_jobs') || '[]');
      existingJobs.push(jobData);
      localStorage.setItem('ghosthire_jobs', JSON.stringify(existingJobs));
      
      // Show success toast
      toast.success("Job deployed to blockchain successfully!");
      
      // Redirect to jobs page
      setTimeout(() => {
        window.location.href = '/jobs';
      }, 1500);
      
    } catch (error) {
      console.error('Deploy failed:', error);
      toast.error("Deployment failed. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="section-large flex items-center">
      <div className="grid-container w-full">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{background: "linear-gradient(135deg, var(--primary) 0%, var(--info) 100%)"}}
              >
                <Briefcase className="w-6 h-6" style={{color: "var(--warm-off-black)"}} />
              </div>
            </div>
            <h1 className="h1 mb-4">Post a Job</h1>
            <p className="body-large" style={{opacity: "0.8", maxWidth: "600px", margin: "0 auto"}}>
              Create a privacy-preserving job posting with ZK-proof requirements. 
              <strong style={{color: "var(--warm-off-white)", opacity: "1"}}> Candidates prove eligibility without revealing sensitive data.</strong>
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((step, index) => (
                <React.Fragment key={step}>
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step === currentStep ? 'scale-110' : step < currentStep ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      background: step <= currentStep 
                        ? "linear-gradient(135deg, var(--primary) 0%, var(--info) 100%)"
                        : "var(--border-strong)",
                      color: step <= currentStep ? "var(--warm-off-black)" : "var(--warm-off-white)"
                    }}
                  >
                    {step}
                  </div>
                  {index < 3 && (
                    <div 
                      className="w-8 h-0.5 transition-all duration-300"
                      style={{
                        background: step < currentStep ? "var(--primary)" : "var(--border)"
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="card max-w-3xl mx-auto">
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6" style={{color: "var(--primary)"}} />
                  <h2 className="h2" style={{textTransform: "none"}}>Job Basics</h2>
                </div>

                <FormField 
                  label="Job Title"
                  placeholder="e.g., Senior Rust Protocol Engineer"
                  value={formData.title}
                  onChange={(value) => setFormData(prev => ({...prev, title: value}))}
                  required
                />

                <FormField 
                  label="Job Description"
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({...prev, description: value}))}
                  multiline
                  rows={6}
                  required
                />

                <FormField 
                  label="Skills Tags"
                  placeholder="rust, zero-knowledge, cryptography, web3"
                  value={formData.tags}
                  onChange={(value) => setFormData(prev => ({...prev, tags: value}))}
                  helper="Comma-separated list of relevant skills and technologies"
                />

                <div className="flex justify-end">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.title || !formData.description}
                  >
                    Next: Requirements
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Requirements */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6" style={{color: "var(--primary)"}} />
                  <h2 className="h2" style={{textTransform: "none"}}>Skill Requirements</h2>
                </div>

                <div className="space-y-6">
                  {/* Primary Skills - Always Required */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SliderField
                      label="Programming Experience"
                      value={formData.programmingThreshold || 50}
                      onChange={(value) => setFormData(prev => ({...prev, programmingThreshold: value}))}
                      helper="General programming proficiency (0-100)"
                    />
                    
                    <SliderField
                      label="Problem Solving"
                      value={formData.problemSolvingThreshold || 60}
                      onChange={(value) => setFormData(prev => ({...prev, problemSolvingThreshold: value}))}
                      helper="Critical thinking and debugging (0-100)"
                    />
                  </div>

                  {/* Technical Skills */}
                  <div className="space-y-4">
                    <h4 className="body-large font-semibold">Technical Proficiencies</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SliderField
                        label="Rust/Systems Programming"
                        value={formData.rustThreshold || 0}
                        onChange={(value) => setFormData(prev => ({...prev, rustThreshold: value}))}
                        helper="Rust, C++, systems-level development"
                      />

                      <SliderField
                        label="Frontend Development"
                        value={formData.frontendThreshold || 0}
                        onChange={(value) => setFormData(prev => ({...prev, frontendThreshold: value}))}
                        helper="React, TypeScript, modern web tech"
                      />

                      <SliderField
                        label="Backend/API Development"
                        value={formData.backendThreshold || 0}
                        onChange={(value) => setFormData(prev => ({...prev, backendThreshold: value}))}
                        helper="Node.js, databases, microservices"
                      />

                      <SliderField
                        label="Blockchain/Web3"
                        value={formData.blockchainThreshold || 0}
                        onChange={(value) => setFormData(prev => ({...prev, blockchainThreshold: value}))}
                        helper="Smart contracts, DeFi, cryptography"
                      />

                      <SliderField
                        label="Zero-Knowledge Proofs"
                        value={formData.zkThreshold || 0}
                        onChange={(value) => setFormData(prev => ({...prev, zkThreshold: value}))}
                        helper="Circom, SNARKs, privacy protocols"
                      />

                      <SliderField
                        label="DevOps/Infrastructure"
                        value={formData.devopsThreshold || 0}
                        onChange={(value) => setFormData(prev => ({...prev, devopsThreshold: value}))}
                        helper="Docker, Kubernetes, CI/CD, cloud"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg" style={{background: "var(--primary-muted)", border: "1px solid rgba(91, 140, 255, 0.2)"}}>
                    <p className="body-small" style={{color: "var(--primary)"}}>
                      💡 <strong>Tip:</strong> Set skills to 0 if not required. Candidates will only be evaluated on skills with thresholds &gt; 0.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <NumberField
                    label="Minimum Salary"
                    value={formData.salaryMin}
                    onChange={(value) => setFormData(prev => ({...prev, salaryMin: value}))}
                    prefix="$"
                    placeholder="50000"
                  />
                  <NumberField
                    label="Maximum Salary"
                    value={formData.salaryMax}
                    onChange={(value) => setFormData(prev => ({...prev, salaryMax: value}))}
                    prefix="$"
                    placeholder="70000"
                  />
                </div>

                <div className="flex justify-between">
                  <button 
                    className="btn btn-ghost"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(3)}
                  >
                    Next: Regions
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Regions */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6" style={{color: "var(--primary)"}} />
                  <h2 className="h2" style={{textTransform: "none"}}>Allowed Regions</h2>
                </div>

                <div className="space-y-4">
                  <p className="body-large" style={{opacity: "0.8"}}>
                    Select regions where candidates can be located. This creates a Merkle tree for privacy-preserving location verification.
                  </p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { code: "CA-ON", name: "Ontario, Canada" },
                      { code: "US-CA", name: "California, USA" },
                      { code: "US-NY", name: "New York, USA" },
                      { code: "DE-BE", name: "Berlin, Germany" },
                      { code: "GB-LN", name: "London, UK" },
                      { code: "SG-SG", name: "Singapore" }
                    ].map(region => (
                      <label 
                        key={region.code} 
                        className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/5"
                        style={{
                          border: formData.regions.includes(region.code) 
                            ? "1px solid var(--primary)" 
                            : "1px solid var(--border)",
                          background: formData.regions.includes(region.code) 
                            ? "var(--primary-muted)" 
                            : "transparent"
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={formData.regions.includes(region.code)}
                          onChange={() => handleRegionToggle(region.code)}
                          className="sr-only"
                        />
                        <div 
                          className="w-4 h-4 rounded border transition-all duration-300 flex items-center justify-center"
                          style={{
                            borderColor: formData.regions.includes(region.code) ? "var(--primary)" : "var(--border)",
                            background: formData.regions.includes(region.code) ? "var(--primary)" : "transparent"
                          }}
                        >
                          {formData.regions.includes(region.code) && (
                            <div className="w-2 h-2 rounded-full" style={{background: "var(--warm-off-black)"}} />
                          )}
                        </div>
                        <div>
                          <div className="body-small font-medium">{region.code}</div>
                          <div className="body-small" style={{opacity: "0.7"}}>{region.name}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {formData.regions.length > 0 && (
                    <div 
                      className="p-4 rounded-lg"
                      style={{background: "var(--border-strong)", border: "1px solid var(--border)"}}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4" style={{color: "var(--info)"}} />
                        <span className="body-small font-medium" style={{color: "var(--info)"}}>Merkle Root Preview</span>
                      </div>
                      <code className="body-small" style={{opacity: "0.8"}}>
                        0x{Math.random().toString(16).substring(2, 18)}...
                      </code>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button 
                    className="btn btn-ghost"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(4)}
                    disabled={formData.regions.length === 0}
                  >
                    Review & Deploy
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <Rocket className="w-6 h-6" style={{color: "var(--primary)"}} />
                  <h2 className="h2" style={{textTransform: "none"}}>Review & Deploy</h2>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-lg" style={{background: "var(--border-strong)", border: "1px solid var(--border)"}}>
                    <h3 className="h3 mb-4" style={{textTransform: "none"}}>Job Summary</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="body-small" style={{opacity: "0.7"}}>Title:</span>
                        <div className="body-large font-medium">{formData.title}</div>
                      </div>
                      <div>
                        <span className="body-small" style={{opacity: "0.7"}}>Salary Range:</span>
                        <div className="body-large font-medium">${formData.salaryMin.toLocaleString()} - ${formData.salaryMax.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="body-small" style={{opacity: "0.7"}}>Skill Requirements:</span>
                        <div className="body-small mt-1 space-y-1">
                          <div>Programming: {formData.programmingThreshold}/100</div>
                          <div>Problem Solving: {formData.problemSolvingThreshold}/100</div>
                          {formData.rustThreshold > 0 && <div>Rust/Systems: {formData.rustThreshold}/100</div>}
                          {formData.frontendThreshold > 0 && <div>Frontend: {formData.frontendThreshold}/100</div>}
                          {formData.backendThreshold > 0 && <div>Backend: {formData.backendThreshold}/100</div>}
                          {formData.blockchainThreshold > 0 && <div>Blockchain: {formData.blockchainThreshold}/100</div>}
                          {formData.zkThreshold > 0 && <div>Zero-Knowledge: {formData.zkThreshold}/100</div>}
                          {formData.devopsThreshold > 0 && <div>DevOps: {formData.devopsThreshold}/100</div>}
                        </div>
                      </div>
                      <div>
                        <span className="body-small" style={{opacity: "0.7"}}>Allowed Regions:</span>
                        <div className="body-small mt-1">{formData.regions.join(", ")}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button 
                    className="btn btn-ghost"
                    onClick={() => setCurrentStep(3)}
                  >
                    Back
                  </button>
                  <div className="flex gap-3">
                    <button className="btn btn-secondary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={handleDeploy}
                      disabled={isDeploying}
                    >
                      {isDeploying ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4 mr-2" />
                          Deploy Job
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Form Components
function FormField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  multiline = false, 
  rows = 3, 
  required = false,
  helper 
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  helper?: string;
}) {
  const inputStyles = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    background: "rgba(248, 245, 242, 0.05)",
    color: "var(--warm-off-white)",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    outline: "none"
  };

  return (
    <div className="space-y-2">
      <label className="body-large font-medium">
        {label} {required && <span style={{color: "var(--warning)"}}>*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={inputStyles}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={inputStyles}
        />
      )}
      {helper && (
        <p className="body-small" style={{opacity: "0.6"}}>{helper}</p>
      )}
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  helper
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helper?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="body-large font-medium">{label}</label>
        <span 
          className="px-2 py-1 rounded text-sm font-medium"
          style={{background: "var(--primary-muted)", color: "var(--primary)"}}
        >
          {value}/100
        </span>
      </div>
              <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          aria-label={`${label} slider`}
          style={{
            background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${value}%, var(--border) ${value}%, var(--border) 100%)`
          }}
        />
      {helper && (
        <p className="body-small" style={{opacity: "0.6"}}>{helper}</p>
      )}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  prefix
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  prefix?: string;
}) {
  const inputStyles = {
    width: "100%",
    padding: "0.75rem 1rem",
    paddingLeft: prefix ? "2.5rem" : "1rem",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    background: "rgba(248, 245, 242, 0.05)",
    color: "var(--warm-off-white)",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    outline: "none"
  };

  return (
    <div className="space-y-2">
      <label className="body-large font-medium">{label}</label>
      <div className="relative">
        {prefix && (
          <div 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 font-medium"
            style={{color: "var(--warm-off-white)", opacity: "0.7"}}
          >
            {prefix}
          </div>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          placeholder={placeholder}
          style={inputStyles}
        />
      </div>
    </div>
  );
}
