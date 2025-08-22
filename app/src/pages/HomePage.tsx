import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { useWallet } from '@/wallet/WalletProvider'

export function HomePage() {
  const { isConnected } = useWallet()

  const features = [
    {
      icon: Shield,
      title: 'Zero-Knowledge Proofs',
      description: 'Prove you meet job requirements without revealing your exact data',
    },
    {
      icon: Eye,
      title: 'Privacy First',
      description: 'Your skills, location, and salary expectations stay private',
    },
    {
      icon: Users,
      title: 'Anti-Sybil Protection',
      description: 'Prevent spam with cryptographic nullifiers',
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'On-chain proof verification for immediate results',
    },
  ]

  const benefits = [
    'No oversharing of personal data',
    'Cryptographic proof of eligibility',
    'Selective disclosure options',
    'Built on Midnight Network',
    'Open source and transparent',
    'Accessible and user-friendly',
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Prove You Qualify{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Without Oversharing
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              GhostHire uses zero-knowledge proofs to verify job eligibility while keeping your 
              skills, location, and salary expectations completely private.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {isConnected ? (
                <Link to="/jobs">
                  <Button size="lg" className="group">
                    Browse Jobs
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link to="/connect">
                  <Button size="lg" className="group">
                    Connect Wallet
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              
              <Link to="/create-job">
                <Button variant="outline" size="lg">
                  Post a Job
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              GhostHire leverages cutting-edge zero-knowledge cryptography to protect your privacy 
              while proving your qualifications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose GhostHire?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Experience the future of privacy-preserving job applications
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  For Applicants
                </h3>
                <ul className="space-y-3">
                  {benefits.slice(0, 3).map((benefit) => (
                    <li key={benefit} className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  For Employers
                </h3>
                <ul className="space-y-3">
                  {benefits.slice(3).map((benefit) => (
                    <li key={benefit} className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the future of privacy-preserving job applications. 
            No more oversharing, just proof of qualification.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <Link to="/jobs">
                <Button size="lg" variant="secondary" className="group">
                  Browse Available Jobs
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Link to="/connect">
                <Button size="lg" variant="secondary" className="group">
                  Connect Your Wallet
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            
            <Link to="/create-job">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
