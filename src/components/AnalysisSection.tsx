import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Loader, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { AI_MODELS, fetchRealPrices, fetchRealNews, callOpenAI } from '../services/api'

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

const AI_MODEL_DESCRIPTIONS = {
  'gpt-4.1-nano-2025-04-14': '快速分析，適合初步評估',
  'o4-mini-2025-04-16': '平衡效能與成本',
  'o3-2025-04-16': '深度分析，高準確度',
  'o3-pro-2025-06-10': '專業級分析，最高精度',
  'o3-deep-research-2025-06-26': '深度研究模式',
  'o4-mini-deep-research-2025-06-26': '輕量深度研究',
}

export default function AnalysisSection() {
  const { isDevMode, useCredits, userCredits } = useAuth()
  const [selectedModel, setSelectedModel] = useState('o3-2025-04-16')
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
      const modelConfig = AI_MODELS[selectedModel as keyof typeof AI_MODELS]
      
      // 檢查積分
      if (!isDevMode) {
        if (!userCredits || userCredits.credits < modelConfig.cost) {
          throw new Error(`積分不足！需要 ${modelConfig.cost} 積分，目前剩餘 ${userCredits?.credits || 0} 積分`)
        }
        
        if (!useCredits(modelConfig.cost, `AI 分析 - ${modelConfig.name}`)) {
          throw new Error('積分扣除失敗')
        }
      }

      console.log('開始獲取真實數據進行專業分析...')

      // 並行獲取真實數據
      const [priceData, newsData] = await Promise.allSettled([
        fetchRealPrices(),
        fetchRealNews()
      ])

      const prices = priceData.status === 'fulfilled' ? priceData.value : {
        gold: { price: '2000.00', change: '0.00', currency: 'USD', unit: '盎司', lastUpdate: new Date().toISOString(), source: 'fallback' },
        wheat: { price: '600.00', change: '0.00', currency: 'USD', unit: '蒲式耳', lastUpdate: new Date().toISOString(), source: 'fallback' }
      }

      const news = newsData.status === 'fulfilled' ? newsData.value : [
        '台海軍事演習活動持續進行，國際社會密切關注',
        '美軍印太司令部調整戰略部署以因應地區安全挑戰',
        '兩岸軍事互動頻繁，專家呼籲保持克制與對話',
        '國際社會持續關注台海和平穩定的重要性'
      ]

      console.log(`收集到 ${news.length} 條新聞和市場數據，開始 AI 分析...`)

      // 調用真實 OpenAI API
      const aiResponse = await callOpenAI(selectedModel, prices, news)
      
      // 解析 AI 回應
      const jsonMatch = aiResponse.match(/\{[\s\S]*?\}/)
      if (!jsonMatch) {
        throw new Error('AI 回應格式錯誤')
      }

      const analysis = JSON.parse(jsonMatch[0])
      const reportStart = aiResponse.indexOf(jsonMatch[0]) + jsonMatch[0].length
      const detailedReport = aiResponse.substring(reportStart).trim()

      setAnalysisResult(analysis)
      setDetailedReport(detailedReport || '詳細報告生成中...')

    } catch (err) {
      console.error('Analysis error:', err)
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
              <p className="text-sm text-gray-300 font-mono">{AI_MODEL_DESCRIPTIONS[key as keyof typeof AI_MODEL_DESCRIPTIONS]}</p>
            </motion.div>
          ))}
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
          {/* 攻台機率 - 最前面顯示 */}
          <div className="cyber-border rounded-lg p-8 bg-gradient-to-br from-red-900/30 to-gray-800/80 backdrop-blur-sm mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-cyber font-bold mb-2 text-red-400">⚠️ 近三個月攻台機率</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="text-8xl font-bold text-red-400 cyber-glow animate-pulse">
                  {analysisResult.overall_assessment.probability}
                </div>
              </div>
              <p className="text-xl font-mono text-gray-300 mb-2">
                信心水準: <span className="text-cyber-accent">{analysisResult.overall_assessment.confidence_level}</span>
              </p>
              <p className="text-sm text-gray-400 font-mono">
                基於當前軍事、政治、經濟等多維度指標綜合評估
              </p>
            </div>
          </div>

          {/* Overall Assessment */}
          <div className="cyber-border rounded-lg p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm">
            <h3 className="text-3xl font-cyber font-bold mb-4 cyber-text">總體評估詳情</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-lg font-bold text-cyber-primary mb-2">攻台機率</h4>
                <div className="text-4xl font-bold text-cyber-primary">
                  {analysisResult.overall_assessment.probability}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-lg font-bold text-cyber-secondary mb-2">信心水準</h4>
                <div className="text-4xl font-bold text-cyber-secondary">
                  {analysisResult.overall_assessment.confidence_level}
                </div>
              </div>
            </div>
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