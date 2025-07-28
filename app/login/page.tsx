'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Chrome, Shield, Code, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 檢查是否已經登入
    getSession().then((session) => {
      if (session) {
        router.push('/')
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-gray-900 to-cyber-darker flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyber-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Back Button */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-cyber-primary hover:text-cyber-secondary transition-colors duration-200 font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回首頁</span>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="cyber-border rounded-lg p-8 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ 
                boxShadow: [
                  '0 0 10px rgba(0, 255, 255, 0.5)',
                  '0 0 20px rgba(0, 255, 255, 0.8)',
                  '0 0 10px rgba(0, 255, 255, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-cyber-dark" />
            </motion.div>
            
            <h1 className="text-3xl font-cyber font-bold cyber-text mb-2">
              登入系統
            </h1>
            <p className="text-gray-400 font-mono">
              台灣防衛情勢感知系統
            </p>
          </div>

          {/* Google Sign In Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white text-gray-800 py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Chrome className="w-6 h-6" />
            )}
            <span>{isLoading ? '登入中...' : '使用 Google 登入'}</span>
          </motion.button>

          {/* Developer Link */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link 
              href="/dev-auth"
              className="text-sm text-gray-500 hover:text-cyber-primary transition-colors duration-200 font-mono flex items-center justify-center space-x-1"
            >
              <Code className="w-4 h-4" />
              <span>是開發團隊嗎？</span>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="mt-8 pt-6 border-t border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-lg font-bold text-cyber-primary mb-4 text-center">
              系統特色
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 font-mono">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyber-primary rounded-full"></div>
                <span>AI 驅動的威脅分析</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyber-secondary rounded-full"></div>
                <span>即時市場指標監控</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyber-accent rounded-full"></div>
                <span>每月 1000 積分額度</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Security Notice */}
        <motion.div 
          className="mt-6 text-center text-xs text-gray-500 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p>🔒 我們重視您的隱私安全</p>
          <p>登入資訊僅用於身份驗證，不會儲存敏感資料</p>
        </motion.div>
      </motion.div>
    </div>
  )
}