import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { useWallet } from '@/wallet/WalletProvider'
import { ProofGenerator } from '@/zk/proofGenerator'

interface Job {
  id: number
  title: string
  company: string
  thresholds: { rust: number; typescript: number; zk: number }
  allowedRegions: string[]
  salaryMin: number
  salaryMax: number
}

interface Profile {
  id: string
  name: string
  skills: { rust: number; typescript: number; zk: number }
  region: string
  expectedSalary: number
}

export function ApplyPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { isConnected } = useWallet()
  const proofGenerator = new ProofGenerator()
  
  const [job, setJob] = useState<Job | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  const [proofResult, setProofResult] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPrivateData, setShowPrivateData] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      navigate('/connect')
      return
    }

    loadJob()
    loadProfiles()
  }, [jobId, isConnected, navigate])

  const loadJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      if (response.ok) {
        const jobData = await response.json()
        setJob(jobData)
      }
    } catch (error) {
      console.error('Failed to load job:', error)
      toast.error('Failed to load job details')
    }
  }

  const loadProfiles = async () => {
    try {
      const response = await fetch('/api/profiles')
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles)
      }
    } catch (error) {
      console.error('Failed to load profiles:', error)
      toast.error('Failed to load profiles')
    }
  }

  const generateProof = async () => {
    if (!selectedProfile || !job) return

    setIsGeneratingProof(true)
    try {
      // Convert skills object to array format
      const skillsArray = [selectedProfile.skills.rust, selectedProfile.skills.typescript, selectedProfile.skills.zk];
      const thresholdsArray = [job.thresholds.rust, job.thresholds.typescript, job.thresholds.zk];
      
      // Generate Merkle root and path for regions
      const regionRoot = proofGenerator.buildRegionMerkleRoot(job.allowedRegions);
      const regionPath = proofGenerator.getMerklePath(selectedProfile.region, job.allowedRegions);

      const inputs = {
        jobId: job.id,
        skills: skillsArray,
        skillThresholds: thresholdsArray,
        region: selectedProfile.region,
        regionMerklePath: regionPath,
        regionMerkleRoot: regionRoot,
        expectedSalary: selectedProfile.expectedSalary,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        applicantSecret: `${selectedProfile.id}-secret-${Date.now()}`,
      };

      const result = await proofGenerator.generateEligibilityProof(inputs);

      setProofResult(result)
      toast.success('Proof generated successfully!')
    } catch (error) {
      console.error('Failed to generate proof:', error)
      toast.error('Failed to generate proof')
    } finally {
      setIsGeneratingProof(false)
    }
  }

  const submitApplication = async () => {
    if (!proofResult) return

    setIsSubmitting(true)
    try {
      // In a real implementation, this would submit the transaction to the blockchain
      // For demo purposes, we'll simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Application submitted successfully!')
      navigate(`/jobs/${jobId}`)
    } catch (error) {
      console.error('Failed to submit application:', error)
      toast.error('Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkEligibility = (profile: Profile) => {
    if (!job) return false
    
    return (
      profile.skills.rust >= job.thresholds.rust &&
      profile.skills.typescript >= job.thresholds.typescript &&
      profile.skills.zk >= job.thresholds.zk &&
      job.allowedRegions.includes(profile.region) &&
      profile.expectedSalary >= job.salaryMin &&
      profile.expectedSalary <= job.salaryMax
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Apply for {job.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Prove your eligibility using zero-knowledge proofs
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Profile Selection & Proof Generation */}
          <div className="space-y-6">
            {/* Profile Selection */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" id="profile-selection-heading">
                Select Your Profile
              </h2>
              <div 
                className="space-y-3" 
                role="radiogroup" 
                aria-labelledby="profile-selection-heading"
                aria-describedby="profile-selection-help"
              >
                <p id="profile-selection-help" className="sr-only">
                  Choose a profile to apply with. Eligible profiles are marked with a checkmark.
                </p>
                {profiles.map((profile) => {
                  const isEligible = checkEligibility(profile)
                  const profileId = `profile-${profile.id}`
                  return (
                    <div
                      key={profile.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
                        selectedProfile?.id === profile.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedProfile(profile)}
                    >
                      <label 
                        htmlFor={profileId}
                        className="block cursor-pointer"
                      >
                        <input
                          type="radio"
                          id={profileId}
                          name="profile-selection"
                          value={profile.id}
                          checked={selectedProfile?.id === profile.id}
                          onChange={() => setSelectedProfile(profile)}
                          className="sr-only"
                          aria-describedby={`${profileId}-details`}
                        />
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {profile.name}
                            </h3>
                            <p 
                              id={`${profileId}-details`}
                              className="text-sm text-gray-600 dark:text-gray-300"
                            >
                              {profile.region} • ${profile.expectedSalary.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isEligible ? (
                              <CheckCircle 
                                className="h-5 w-5 text-green-500" 
                                aria-label="Eligible for this position"
                              />
                            ) : (
                              <XCircle 
                                className="h-5 w-5 text-red-500" 
                                aria-label="Not eligible for this position"
                              />
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Proof Generation */}
            {selectedProfile && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" id="proof-generation-heading">
                  Generate Proof
                </h2>
                <Button
                  onClick={generateProof}
                  disabled={isGeneratingProof || !checkEligibility(selectedProfile)}
                  className="w-full"
                  aria-describedby="proof-generation-help"
                  aria-live="polite"
                  aria-busy={isGeneratingProof}
                >
                  {isGeneratingProof ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                      Generating Proof...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" aria-hidden="true" />
                      Generate ZK Proof
                    </>
                  )}
                </Button>
                <p id="proof-generation-help" className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Creates a zero-knowledge proof to verify your eligibility without revealing personal data.
                </p>
              </div>
            )}

            {/* Submit Application */}
            {proofResult && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Submit Application
                </h2>
                <Button
                  onClick={submitApplication}
                  disabled={isSubmitting}
                  className="w-full"
                  aria-describedby="submit-application-help"
                  aria-live="polite"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                    </>
                  )}
                </Button>
                <p id="submit-application-help" className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Your proof will be submitted along with your application. Personal data remains private.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Privacy Visualization */}
          <div className="space-y-6">
            {/* What You Reveal */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-600" />
                What You Reveal
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Job ID
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {job.id}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Nullifier
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-mono">
                    {proofResult?.publicInputs?.nullifier?.slice(0, 16)}...
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Eligibility Status
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✓ Meets Requirements
                  </p>
                </div>
              </div>
            </div>

            {/* What Stays Private */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <EyeOff className="h-5 w-5 mr-2 text-purple-600" />
                What Stays Private
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Skill Scores
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-700 dark:text-purple-300">
                      Rust: {showPrivateData ? selectedProfile?.skills.rust : '***'}
                    </span>
                    <span className="text-sm text-purple-700 dark:text-purple-300">
                      TS: {showPrivateData ? selectedProfile?.skills.typescript : '***'}
                    </span>
                    <span className="text-sm text-purple-700 dark:text-purple-300">
                      ZK: {showPrivateData ? selectedProfile?.skills.zk : '***'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Location
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {showPrivateData ? selectedProfile?.region : '***'}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Expected Salary
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {showPrivateData ? `$${selectedProfile?.expectedSalary.toLocaleString()}` : '***'}
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrivateData(!showPrivateData)}
                className="mt-4"
                aria-pressed={showPrivateData}
                aria-describedby="toggle-data-help"
                role="switch"
                aria-label={showPrivateData ? "Hide private data" : "Show private data for demonstration"}
              >
                {showPrivateData ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" aria-hidden="true" />
                    Hide Private Data
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                    Show Private Data (Demo)
                  </>
                )}
              </Button>
              <p id="toggle-data-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Toggle to demonstrate how private data remains hidden in real applications.
              </p>
            </div>

            {/* Proof Details */}
            {proofResult && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Proof Details
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Proof Size:</span>
                    <span className="font-mono">~2.3 KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Verification Time:</span>
                    <span className="font-mono">~150ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Security Level:</span>
                    <span className="text-green-600 dark:text-green-400">128-bit</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
