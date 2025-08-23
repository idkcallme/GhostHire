import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, DollarSign, Users, Calendar } from 'lucide-react'
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

export function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')

  useEffect(() => {
    loadJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, selectedRegion, selectedSkill])

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = jobs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Region filter
    if (selectedRegion) {
      filtered = filtered.filter(job =>
        job.allowedRegions.includes(selectedRegion)
      )
    }

    // Skill filter
    if (selectedSkill) {
      filtered = filtered.filter(job => {
        const threshold = job.thresholds[selectedSkill as keyof typeof job.thresholds]
        return threshold > 0
      })
    }

    setFilteredJobs(filtered)
  }

  const getSkillLevel = (level: number) => {
    if (level >= 80) return { label: 'Expert', color: 'text-green-600 dark:text-green-400' }
    if (level >= 60) return { label: 'Advanced', color: 'text-blue-600 dark:text-blue-400' }
    if (level >= 40) return { label: 'Intermediate', color: 'text-yellow-600 dark:text-yellow-400' }
    return { label: 'Beginner', color: 'text-gray-600 dark:text-gray-400' }
  }

  const regions = [
    { code: 'US-CA', name: 'California, USA' },
    { code: 'US-NY', name: 'New York, USA' },
    { code: 'CA-ON', name: 'Ontario, Canada' },
    { code: 'UK-LON', name: 'London, UK' },
    { code: 'DE-BER', name: 'Berlin, Germany' },
  ]

  const skills = [
    { key: 'rust', name: 'Rust' },
    { key: 'typescript', name: 'TypeScript' },
    { key: 'zk', name: 'Zero-Knowledge' },
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Available Jobs
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Browse and apply for jobs using privacy-preserving zero-knowledge proofs
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8" role="search" aria-label="Job search and filters">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <label htmlFor="job-search" className="sr-only">
              Search jobs by title or company
            </label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <input
              id="job-search"
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              aria-describedby="search-help"
            />
            <p id="search-help" className="sr-only">
              Search through job titles and company names
            </p>
          </div>

          {/* Region Filter */}
          <div>
            <label htmlFor="region-filter" className="sr-only">
              Filter by region
            </label>
            <select
              id="region-filter"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              aria-label="Filter by region"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label htmlFor="skill-filter" className="sr-only">
              Filter by skill
            </label>
            <select
              id="skill-filter"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              aria-label="Filter by skill"
            >
              <option value="">All Skills</option>
              {skills.map((skill) => (
                <option key={skill.key} value={skill.key}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedRegion('')
                setSelectedSkill('')
              }}
              className="w-full"
              aria-label="Clear all search filters"
              type="button"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
      </div>

      {/* Job List */}
      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <article key={job.id} className="card hover:shadow-lg transition-shadow" aria-labelledby={`job-title-${job.id}`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 id={`job-title-${job.id}`} className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {job.company}
                      </p>
                    </div>
                    <Link 
                      to={`/jobs/${job.id}/apply`}
                      aria-label={`Apply for ${job.title} at ${job.company}`}
                    >
                      <Button>
                        Apply Now
                      </Button>
                    </Link>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {/* Salary Range */}
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <DollarSign className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span aria-label={`Salary range: ${job.salaryMin.toLocaleString()} to ${job.salaryMax.toLocaleString()} dollars`}>
                        ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                      </span>
                    </div>

                    {/* Regions */}
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span aria-label={`Available in ${job.allowedRegions.length} regions`}>
                        {job.allowedRegions.length} regions
                      </span>
                    </div>

                    {/* Application Count */}
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4 mr-2" />
                      <span>0 applications</span>
                    </div>
                  </div>

                  {/* Skill Requirements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(job.thresholds).map(([skill, level]) => {
                        const skillInfo = getSkillLevel(level)
                        return (
                          <span
                            key={skill}
                            className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 ${skillInfo.color}`}
                          >
                            {skill.charAt(0).toUpperCase() + skill.slice(1)}: {skillInfo.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {/* Allowed Regions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Eligible Regions
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {job.allowedRegions.map((region) => (
                        <span
                          key={region}
                          className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Posted recently</span>
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
