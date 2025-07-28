'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Code, Lock, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function DevAuthPage() {
  const router = useRouter()
  const [testCode, setTestCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/dev-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testCode }),
      })

      if (response.ok) {
        setSuccess(true)
        localStorage.setItem('devMode', 'true')
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        const data = await response.json()
        setError(data.error || 'Invalid test code')
      }
    } catch (err) {
      setError('Verification error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-gray-900 to-cyber-darker flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-400 mb-2">Success!</h2>
          <p className="text-gray-300 font-mono">Entering dev mode...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-gray-900 to-cyber-darker flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link 
            href="/login"
            className="inline-flex items-center space-x-2 text-cyber-primary hover:text-cyber-secondary transition-colors duration-200 font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </motion.div>

        <motion.div
          className="cyber-border rounded-lg p-8 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ 
                boxShadow: [
                  '0 0 10px rgba(255, 193, 7, 0.5)',
                  '0 0 20px rgba(255, 193, 7, 0.8)',
                  '0 0 10px rgba(255, 193, 7, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Code className="w-8 h-8 text-gray-900" />
            </motion.div>
            
            <h1 className="text-3xl font-cyber font-bold text-yellow-400 mb-2">
              Developer Auth
            </h1>
            <p className="text-gray-400 font-mono">
              Enter test code to access dev mode
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Test Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 text-white font-mono"
                  placeholder="Enter test code..."
                  required
                />
              </div>
            </motion.div>

            {error && (
              <motion.div
                className="flex items-center space-x-2 p-3 bg-red-900/50 border border-red-500 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-mono text-sm">{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading || !testCode.trim()}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 py-4 px-6 rounded-lg font-bold text-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Code'
              )}
            </motion.button>
          </form>

          <motion.div 
            className="mt-8 pt-6 border-t border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">
              Dev Mode Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 font-mono">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Unlimited credits</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Skip Google login</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Dev team only</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-6 text-center text-xs text-gray-500 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p>⚠️ Authorized developers only</p>
          <p>Unauthorized access will be logged</p>
        </motion.div>
      </motion.div>
    </div>
  )
}