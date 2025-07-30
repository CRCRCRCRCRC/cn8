'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Loader, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface AnalysisSectionProps {
  isDevMode: boolean
}

interface AnalysisResult {
  overall_assessment: {
    probability: string
    confidence_level: string
  }
  indicator_analysis: Array<{
    name: string
    current_status: string
    impact_score: string
    trend: string
  }>
  key_triggers: string[]
  mitigation_factors: string[]
}

const AI_MODELS = {
  'gpt-4.1-nano-2025-04-14': { cost: 2.5, name: 'GPT-4.1 Nano', description: '快速分析，適合初步評估' },
  'o4-mini-2025-04-16': { cost: 27.5, name: 'O4 Mini', description: '平衡效能與成本' },
  'o3-2025-04-16': { cost: 50, name: 'O3', description: '深度分析，高準確度' },
  'o3-pro-2025-06-10': { cost: 500, name: 'O3 Pro', description: '專業級分析，最高精度' },
  'o3-deep-research-2025-06-26': { cost: 250, name: 'O3 Deep Research', description: '深度研究模式' },
  'o4-mini-deep-research-2025-06-26': { cost: 50, name: 'O4 Mini Deep Research', description: '輕量深度研究' },
}

export default function AnalysisSection({ isDevMode }: AnalysisSectionProps) {
  const [selectedModel, setSelectedModel] = useState('o3-2025-04-16') // 預設使用高品質模型
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [detailedReport, setDetailedReport] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleAnalysis = async () => {
    setIsAnalyzing(true)
    setError('')
    setAnalysisResult(null)
    setDetailedReport('')

    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          isDevMode
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '分析失敗')
      }

      const data = await response.json()
      setAnalysisResult(data.analysis)
      setDetailedReport(data.detailedReport)
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析過程中發生錯誤')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case '升高':
        return <TrendingUp className="w-4 h-4 text-red-400" />
      case '降低':
        return <TrendingDown className="w-4 h-4 text-green-400" />
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case '升高':
        return 'text-red-400'
      case '降低':
        return 'text-green-400'
      default:
        return 'text-yellow-400'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Model Selection */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-cyber font-bold mb-4 cyber-text">選擇 AI 分析模型</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(AI_MODELS).map(([key, model]) => (
            <motion.div
              key={key}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedModel === key
                  ? 'cyber-border bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20'
                  : 'border border-gray-600 bg-gray-800/50 hover:border-cyber-primary/50'
              }`}
              onClick={() => setSelectedModel(key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-cyber-primary">{model.name}</h4>
                <span className="text-sm font-mono bg-gradient-to-r from-cyber-accent to-yellow-400 text-cyber-dark px-2 py-1 rounded">
                  {isDevMode ? '免費' : `${model.cost} 積分`}
                </span>
              </div>
              <p className="text-sm text-gray-300 font-mono">{model.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Premium Analysis Notice */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="cyber-border rounded-lg p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm">
          <h4 className="text-lg font-cyber font-bold text-cyber-primary mb-2">
            🎯 專業級深度分析
          </h4>
          <p className="text-sm text-gray-300 font-mono leading-relaxed">
            系統將獲取最新市場數據、全面新聞資訊，並使用頂級 AI 模型進行深度分析<br/>
            <span className="text-cyber-accent">追求最高質量的分析結果，不考慮時間限制</span>
          </p>
        </div>
      </motion.div>

      {/* Analysis Button */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <button
          onClick={handleAnalysis}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-cyber-primary to-cyber-secondary text-cyber-dark px-8 py-4 rounded-lg font-bold text-xl hover:shadow-lg hover:shadow-cyber-primary/50 transition-all duration-300 cyber-border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader className="inline-block w-6 h-6 mr-2 animate-spin" />
              專業分析進行中<span className="loading-dots"></span>
            </>
          ) : (
            <>
              <Brain className="inline-block w-6 h-6 mr-2" />
              🎯 開始專業分析
            </>
          )}
        </button>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div 
          className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-mono">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Overall Assessment */}
          <div className="cyber-border rounded-lg p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm">
            <h3 className="text-3xl font-cyber font-bold mb-4 cyber-text">總體評估</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="text-6xl font-bold text-cyber-primary cyber-glow">
                {analysisResult.overall_assessment.probability}
              </div>
            </div>
            <p className="text-center text-xl font-mono text-gray-300">
              未來三個月內攻台機率 • 信心水準: {analysisResult.overall_assessment.confidence_level}
            </p>
          </div>

          {/* Indicator Analysis */}
          <div className="cyber-border rounded-lg p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm">
            <h3 className="text-2xl font-cyber font-bold mb-6 cyber-text">指標分析</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {analysisResult.indicator_analysis.map((indicator, index) => (
                <motion.div
                  key={indicator.name}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-cyber-primary">{indicator.name}</h4>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(indicator.trend)}
                      <span className={`text-sm font-mono ${getTrendColor(indicator.trend)}`}>
                        {indicator.trend}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2 font-mono">{indicator.current_status}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">影響權重</span>
                    <span className="text-sm font-bold text-cyber-accent">{indicator.impact_score}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key Triggers and Mitigation Factors */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="cyber-border rounded-lg p-6 bg-gradient-to-br from-red-900/20 to-gray-800/80 backdrop-blur-sm">
              <h3 className="text-xl font-cyber font-bold mb-4 text-red-400">關鍵觸發點</h3>
              <ul className="space-y-2">
                {analysisResult.key_triggers.map((trigger, index) => (
                  <li key={index} className="text-sm font-mono text-gray-300 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>{trigger}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cyber-border rounded-lg p-6 bg-gradient-to-br from-green-900/20 to-gray-800/80 backdrop-blur-sm">
              <h3 className="text-xl font-cyber font-bold mb-4 text-green-400">緩解因素</h3>
              <ul className="space-y-2">
                {analysisResult.mitigation_factors.map((factor, index) => (
                  <li key={index} className="text-sm font-mono text-gray-300 flex items-start space-x-2">
                    <TrendingDown className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Report */}
          {detailedReport && (
            <div className="cyber-border rounded-lg p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm">
              <h3 className="text-2xl font-cyber font-bold mb-6 cyber-text">詳細分析報告</h3>
              <div className="prose prose-invert max-w-none">
                <div 
                  className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: detailedReport.replace(/\n/g, '<br>') }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}