// 環境檢查組件
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { validateEnvironment } from '../utils/env'

interface EnvironmentCheckProps {
  onValidationComplete: (isValid: boolean) => void
}

export default function EnvironmentCheck({ onValidationComplete }: EnvironmentCheckProps) {
  const [validation, setValidation] = useState<{ isValid: boolean; missing: string[] } | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const result = validateEnvironment()
    setValidation(result)
    onValidationComplete(result.isValid)
  }, [onValidationComplete])

  if (!validation) {
    return null
  }

  if (validation.isValid) {
    return null // 環境正常，不顯示任何內容
  }

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 max-w-md"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 cyber-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-yellow-400 font-bold mb-2">環境配置警告</h3>
            <p className="text-gray-300 text-sm mb-3">
              部分功能可能無法正常運作，因為缺少必要的環境變數。
            </p>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-cyber-primary hover:text-cyber-secondary text-sm underline mb-2"
            >
              {showDetails ? '隱藏詳情' : '查看詳情'}
            </button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-800/50 rounded p-3 mt-2"
              >
                <p className="text-gray-300 text-sm mb-2">缺少的環境變數：</p>
                <ul className="space-y-1">
                  {validation.missing.map((env) => (
                    <li key={env} className="flex items-center space-x-2 text-sm">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <code className="text-red-300 bg-gray-900/50 px-1 rounded">{env}</code>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-gray-400 text-xs">
                    請在 Vercel 部署設定中添加這些環境變數，或聯繫系統管理員。
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex items-center space-x-2 mt-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">系統將使用備用功能繼續運行</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}