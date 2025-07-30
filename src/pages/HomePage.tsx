import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Brain, TrendingUp, AlertTriangle, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import AnalysisSection from '../components/AnalysisSection'
import PriceCards from '../components/PriceCards'
import LoginModal from '../components/LoginModal'

export default function HomePage() {
  const { user, isDevMode } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleStartAnalysis = () => {
    if (!user && !isDevMode) {
      setShowLoginModal(true)
    }
  }

  return (
    <div className="min-h-screen">
      <Header onStartAnalysis={handleStartAnalysis} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section 
          className="text-center py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <motion.h1 
              className="text-6xl md:text-8xl font-cyber font-bold mb-6 cyber-text"
              data-text="台灣防衛情勢感知系統"
              animate={{ 
                textShadow: [
                  '0 0 10px #00ffff',
                  '0 0 20px #00ffff, 0 0 30px #ff00ff',
                  '0 0 10px #00ffff'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              台灣防衛情勢感知系統
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-cyber-primary mb-8 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              即時蒐集多源情報 • 量化威脅評估 • AI 綜合分析
            </motion.p>

            <motion.div
              className="flex justify-center space-x-8 mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {[
                { icon: Shield, label: '防衛監控', color: 'text-cyber-primary' },
                { icon: Brain, label: 'AI 分析', color: 'text-cyber-secondary' },
                { icon: TrendingUp, label: '趨勢預測', color: 'text-cyber-accent' },
                { icon: AlertTriangle, label: '威脅評估', color: 'text-red-400' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <item.icon className={`w-12 h-12 ${item.color} mb-2`} />
                  <span className="text-sm font-mono">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {(user || isDevMode) ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <AnalysisSection />
              </motion.div>
            ) : (
              <motion.button
                onClick={handleStartAnalysis}
                className="bg-gradient-to-r from-cyber-primary to-cyber-secondary text-cyber-dark px-8 py-4 rounded-lg font-bold text-xl hover:shadow-lg hover:shadow-cyber-primary/50 transition-all duration-300 cyber-border"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <Zap className="inline-block w-6 h-6 mr-2" />
                開始分析
              </motion.button>
            )}
          </div>
        </motion.section>

        {/* Price Cards Section */}
        <motion.section
          className="py-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <PriceCards />
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <h2 className="text-4xl font-cyber font-bold text-center mb-12 cyber-text">
            系統特色
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '多源情報整合',
                description: '整合公開資料、軍事動態、經濟指標等多維度資訊',
                icon: Shield,
                color: 'from-cyber-primary to-blue-400'
              },
              {
                title: 'AI 智能分析',
                description: '運用先進 AI 模型進行深度分析與威脅評估',
                icon: Brain,
                color: 'from-cyber-secondary to-purple-400'
              },
              {
                title: '即時監控預警',
                description: '24/7 持續監控，提供即時威脅評估與預警',
                icon: AlertTriangle,
                color: 'from-cyber-accent to-orange-400'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="cyber-border rounded-lg p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-cyber-primary">{feature.title}</h3>
                <p className="text-gray-300 font-mono text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  )
}