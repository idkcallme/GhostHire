import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, DollarSign, Users, Calendar, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'

interface Job {
  id: number
  title: string
  company: string
  thresholds: { rust: number; typescript: number; zk: number }
  allowedRegions: string[]
  salaryMin: number
  salaryMax: number
}

export function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadJob()
  }, [jobId])

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
    } finally {
      setIsLoading(false)
    }
  }

  const getSkillLevel = (level: number) => {
    if (level >= 80) return { label: 'Expert', color: 'text-green-600 dark:text-green-400' }
    if (level >= 60) return { label: 'Advanced', color: 'text-blue-600 dark:text-blue-400' }
    if (level >= 40) return { label: 'Intermediate', color: 'text-yellow-600 dark:text-yellow-400' }
    return { label: 'Beginner', color: 'text-gray-600 dark:text-gray-400' }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Job Not Found
          </h1>
          <Link to="/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/jobs">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {job.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                {job.company}
              </p>
            </div>
            <Link to={`/jobs/${job.id}/apply`}>
              <Button size="lg">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Overview */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Job Overview
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Salary Range</p>
                    <p className="text-lg font-semibold">
                      ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="h-5 w-5 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Regions</p>
                    <p className="text-lg font-semibold">{job.allowedRegions.length} locations</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Users className="h-5 w-5 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Applications</p>
                    <p className="text-lg font-semibold">0</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Posted recently</span>
              </div>
            </div>

            {/* Skill Requirements */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Required Skills
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Applicants must prove they meet these minimum skill thresholds using zero-knowledge proofs.
              </p>
              
              <div className="space-y-4">
                {Object.entries(job.thresholds).map(([skill, level]) => {
                  const skillInfo = getSkillLevel(level)
                  return (
                    <div key={skill} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                          {skill}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Minimum level: {level}/100
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 ${skillInfo.color}`}>
                        {skillInfo.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Eligible Regions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Eligible Regions
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Applicants must prove they are located in one of these regions without revealing their exact location.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {job.allowedRegions.map((region) => (
                  <span
                    key={region}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy Features */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Privacy Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Zero-Knowledge Proofs
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Prove eligibility without revealing exact data
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Anti-Sybil Protection
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Prevent spam with cryptographic nullifiers
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Selective Disclosure
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Choose what information to reveal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Process */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Application Process
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Connect your wallet
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Generate ZK proof
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Submit application
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Apply */}
            <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ready to Apply?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Prove your eligibility with zero-knowledge proofs while keeping your data private.
              </p>
              <Link to={`/jobs/${job.id}/apply`}>
                <Button className="w-full">
                  Start Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
