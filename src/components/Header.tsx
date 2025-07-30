import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, LogOut, Zap, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  onStartAnalysis: () => void
}

export default function Header({ onStartAnalysis }: HeaderProps) {
  const { user, isDevMode, credits, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <motion.header 
      className="cyber-border border-b bg-gradient-to-r from-cyber-dark/90 to-gray-900/90 backdrop-blur-md sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-full flex items-center justify-center">
            <Settings className="w-6 h-6 text-cyber-dark animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <span className="text-xl font-cyber font-bold cyber-text">
            TDAS
          </span>
        </motion.div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          {user || isDevMode ? (
            <>
              {/* Credits Display */}
              {isDevMode ? (
                <motion.div 
                  className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-lg cyber-border"
                  animate={{ 
                    boxShadow: [
                      '0 0 10px rgba(255, 255, 0, 0.3)',
                      '0 0 20px rgba(255, 255, 0, 0.5)',
                      '0 0 10px rgba(255, 255, 0, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-mono text-yellow-400 font-bold">
                    開發模式 • 無限積分
                  </span>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex items-center space-x-2 bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 px-4 py-2 rounded-lg cyber-border"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap className="w-5 h-5 text-cyber-primary" />
                  <span className="font-mono text-cyber-primary">
                    剩餘 {credits}/1000 積分
                  </span>
                </motion.div>
              )}

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 px-3 py-2 rounded-lg cyber-border hover:from-gray-600/50 hover:to-gray-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt="User Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-8 h-8 text-cyber-primary" />
                  )}
                  {user?.name && (
                    <span className="font-mono text-sm text-cyber-primary">
                      {user.name}
                    </span>
                  )}
                  {isDevMode && (
                    <span className="font-mono text-sm text-yellow-400">
                      (開發者)
                    </span>
                  )}
                </motion.button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-gray-900 cyber-border rounded-lg shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-2">
                      {user && (
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-800 rounded-lg transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span className="font-mono text-sm text-red-400">登出</span>
                        </button>
                      )}
                      {isDevMode && (
                        <button
                          onClick={() => {
                            localStorage.removeItem('devMode')
                            window.location.reload()
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-800 rounded-lg transition-colors duration-200"
                        >
                          <Settings className="w-4 h-4 text-yellow-400" />
                          <span className="font-mono text-sm text-yellow-400">退出開發模式</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <motion.button
              onClick={onStartAnalysis}
              className="bg-gradient-to-r from-cyber-primary to-cyber-secondary text-cyber-dark px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-cyber-primary/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              開始使用
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  )
}