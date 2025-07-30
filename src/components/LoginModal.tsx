import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate()

  const handleConfirm = () => {
    onClose()
    navigate('/login')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 cyber-border rounded-lg p-8 max-w-md w-full relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-cyber-primary transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Content */}
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  animate={{ 
                    boxShadow: [
                      '0 0 10px rgba(239, 68, 68, 0.5)',
                      '0 0 20px rgba(239, 68, 68, 0.8)',
                      '0 0 10px rgba(239, 68, 68, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle className="w-8 h-8 text-white" />
                </motion.div>

                <h2 className="text-2xl font-cyber font-bold mb-4 cyber-text">
                  需要登入
                </h2>
                
                <p className="text-gray-300 font-mono mb-8 leading-relaxed">
                  請登入後再使用分析功能！<br />
                  系統需要驗證您的身份以提供個人化服務。
                </p>

                <div className="flex space-x-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-all duration-200 font-mono"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyber-primary to-cyber-secondary text-cyber-dark rounded-lg hover:shadow-lg hover:shadow-cyber-primary/50 transition-all duration-300 font-bold"
                  >
                    確認
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}