import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, DollarSign, MapPin, Users, Save, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'

interface JobForm {
  title: string
  company: string
  thresholds: {
    rust: number
    typescript: number
    zk: number
  }
  allowedRegions: string[]
  salaryMin: number
  salaryMax: number
  description: string
}

const regions = [
  { code: 'US-CA', name: 'California, USA' },
  { code: 'US-NY', name: 'New York, USA' },
  { code: 'CA-ON', name: 'Ontario, Canada' },
  { code: 'UK-LON', name: 'London, UK' },
  { code: 'DE-BER', name: 'Berlin, Germany' },
]

export function CreateJobPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<JobForm>({
    title: '',
    company: '',
    thresholds: {
      rust: 0,
      typescript: 0,
      zk: 0,
    },
    allowedRegions: [],
    salaryMin: 0,
    salaryMax: 0,
    description: '',
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleThresholdChange = (skill: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [skill]: value,
      },
    }))
  }

  const handleRegionToggle = (regionCode: string) => {
    setFormData(prev => ({
      ...prev,
      allowedRegions: prev.allowedRegions.includes(regionCode)
        ? prev.allowedRegions.filter(r => r !== regionCode)
        : [...prev.allowedRegions, regionCode],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.company) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.salaryMin >= formData.salaryMax) {
      toast.error('Maximum salary must be greater than minimum salary')
      return
    }

    if (formData.allowedRegions.length === 0) {
      toast.error('Please select at least one region')
      return
    }

    setIsSubmitting(true)
    try {
      // In a real implementation, this would submit to the blockchain
      // For demo purposes, we'll simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Job posted successfully!')
      navigate('/jobs')
    } catch (error) {
      console.error('Failed to post job:', error)
      toast.error('Failed to post job')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/jobs')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create a job posting with privacy-preserving requirements
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="label">
                  Job Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input"
                  placeholder="e.g., Senior Rust Developer"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="company" className="label">
                  Company Name *
                </label>
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="input"
                  placeholder="e.g., TechCorp"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="label">
                Job Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input min-h-[100px]"
                placeholder="Describe the role, responsibilities, and requirements..."
              />
            </div>
          </motion.div>

          {/* Skill Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Skill Requirements
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Set minimum skill thresholds. Applicants will prove they meet these requirements 
              without revealing their exact skill levels.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="rust-threshold" className="label">
                  Rust (0-100)
                </label>
                <input
                  id="rust-threshold"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.thresholds.rust}
                  onChange={(e) => handleThresholdChange('rust', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>0</span>
                  <span className="font-medium">{formData.thresholds.rust}</span>
                  <span>100</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="typescript-threshold" className="label">
                  TypeScript (0-100)
                </label>
                <input
                  id="typescript-threshold"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.thresholds.typescript}
                  onChange={(e) => handleThresholdChange('typescript', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>0</span>
                  <span className="font-medium">{formData.thresholds.typescript}</span>
                  <span>100</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="zk-threshold" className="label">
                  Zero-Knowledge (0-100)
                </label>
                <input
                  id="zk-threshold"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.thresholds.zk}
                  onChange={(e) => handleThresholdChange('zk', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>0</span>
                  <span className="font-medium">{formData.thresholds.zk}</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Salary Range */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Salary Range
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Set the salary range. Applicants will prove their expected salary falls within 
              this range without revealing the exact amount.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="salary-min" className="label">
                  Minimum Salary (USD)
                </label>
                <input
                  id="salary-min"
                  type="number"
                  min="0"
                  value={formData.salaryMin}
                  onChange={(e) => handleInputChange('salaryMin', parseInt(e.target.value))}
                  className="input"
                  placeholder="50000"
                />
              </div>
              
              <div>
                <label htmlFor="salary-max" className="label">
                  Maximum Salary (USD)
                </label>
                <input
                  id="salary-max"
                  type="number"
                  min="0"
                  value={formData.salaryMax}
                  onChange={(e) => handleInputChange('salaryMax', parseInt(e.target.value))}
                  className="input"
                  placeholder="150000"
                />
              </div>
            </div>
          </motion.div>

          {/* Allowed Regions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Allowed Regions
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Select regions where applicants can be located. Applicants will prove they are 
              in an allowed region without revealing their exact location.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regions.map((region) => (
                <label
                  key={region.code}
                  className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.allowedRegions.includes(region.code)}
                    onChange={() => handleRegionToggle(region.code)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-900 dark:text-white">{region.name}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-end space-x-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/jobs')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Post Job
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
