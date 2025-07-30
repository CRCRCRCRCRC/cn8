import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code, Lock, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function DevAuthPage() {
  const navigate = useNavigate()
  const { enableDevMode } = useAuth()
  const [testCode, setTestCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (testCode === 'howard is a pig') {
        setSuccess(true)
        enableDevMode()
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        setError('此測試碼無法使用')
      }
    } catch (err) {
      setError('驗證過程中發生錯誤')
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
          <h2 className="text-2xl font-bold text-green-400 mb-2">驗證成功！</h2>
          <p className="text-gray-300 font-mono">正在進入開發模式...</p>
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
            to="/login"
            className="inline-flex items-center space-x-2 text-cyber-primary hover:text-cyber-secondary transition-colors duration-200 font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回登入</span>
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
              開發者驗證
            </h1>
            <p className="text-gray-400 font-mono">
              輸入測試碼以進入開發模式
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-mono text-gray-300 mb-2">
                測試碼
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 text-white font-mono"
                  placeholder="輸入測試碼..."
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
                  <span>驗證中...</span>
                </div>
              ) : (
                '驗證測試碼'
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}