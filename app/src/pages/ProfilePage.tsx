import { useState, useEffect } from 'react'
import { useWallet } from '@/wallet/WalletProvider'
import { User, Wallet, Shield, FileText, Calendar, MapPin, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'

interface Application {
  id: string
  jobId: number
  jobTitle: string
  company: string
  status: 'pending' | 'accepted' | 'rejected'
  submittedAt: string
  nullifier: string
}

export function ProfilePage() {
  const { address, isConnected } = useWallet()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected) {
      loadApplications()
    }
  }, [isConnected])

  const loadApplications = async () => {
    try {
      // In a real implementation, this would fetch from the blockchain
      // For demo purposes, we'll use mock data
      const mockApplications: Application[] = [
        {
          id: 'app-1',
          jobId: 1,
          jobTitle: 'Senior Rust Developer',
          company: 'TechCorp',
          status: 'accepted',
          submittedAt: '2024-01-15T10:30:00Z',
          nullifier: '0x1234...5678',
        },
        {
          id: 'app-2',
          jobId: 2,
          jobTitle: 'ZK Protocol Engineer',
          company: 'CryptoStartup',
          status: 'pending',
          submittedAt: '2024-01-14T15:45:00Z',
          nullifier: '0xabcd...efgh',
        },
      ]
      
      setApplications(mockApplications)
    } catch (error) {
      console.error('Failed to load applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      case 'rejected':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending'
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please Connect Your Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect your wallet to view your profile and applications.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your applications and privacy settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Anonymous User
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Privacy-first profile
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Wallet Address
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                      {formatAddress(address!)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Privacy Level
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Maximum (ZK Proofs)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Applications
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {applications.length} submitted
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Features */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Privacy Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Zero-Knowledge Proofs
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Your data never leaves your device
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Anti-Sybil Protection
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Cryptographic nullifiers prevent spam
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Selective Disclosure
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Choose what to reveal post-application
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Application History
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No applications yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Start applying for jobs to see your application history here.
                  </p>
                  <Button onClick={() => window.location.href = '/jobs'}>
                    Browse Jobs
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {application.jobTitle}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {getStatusLabel(application.status)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {application.company}
                          </p>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                {new Date(application.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <Shield className="h-4 w-4 mr-2" />
                              <span className="font-mono text-xs">
                                {application.nullifier}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/jobs/${application.jobId}`}
                          >
                            View Job
                          </Button>
                          {application.status === 'accepted' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              Contact Employer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Stats */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Privacy Statistics
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {applications.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Applications
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {applications.filter(app => app.status === 'accepted').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Accepted
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    100%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Privacy Protected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
