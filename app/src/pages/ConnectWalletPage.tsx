import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, Shield, Eye, Zap, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/Button'
import { useWallet } from '@/wallet/WalletProvider'

export function ConnectWalletPage() {
  const navigate = useNavigate()
  const { connect } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
      toast.success('Wallet connected successfully!')
      navigate('/jobs')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays private with zero-knowledge proofs',
    },
    {
      icon: Eye,
      title: 'Selective Disclosure',
      description: 'Choose what information to reveal',
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Prove eligibility without revealing details',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Connect Your Wallet
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Connect your Midnight Network wallet to start applying for jobs with 
                privacy-preserving zero-knowledge proofs.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Connect Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card max-w-md mx-auto"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Get Started
                </h2>
                
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  size="lg"
                  className="w-full mb-6 group"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5 mr-2" />
                      Connect Midnight Wallet
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Don't have a Midnight wallet?{' '}
                  <a
                    href="https://midnight.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Learn more
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Why Connect Your Wallet?
              </h2>
              
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How It Works
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">1</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Connect</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Connect your Midnight Network wallet to access the platform
                  </p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">2</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Generate Proof</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Create zero-knowledge proofs to verify your eligibility
                  </p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">3</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Apply</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Submit applications with cryptographic proof of qualification
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
