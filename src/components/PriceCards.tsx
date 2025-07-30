import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Wheat } from 'lucide-react'

interface PriceData {
  gold: {
    price: string
    change: string
    currency: string
    unit: string
    lastUpdate: string
    source: string
  }
  wheat: {
    price: string
    change: string
    currency: string
    unit: string
    lastUpdate: string
    source: string
  }
}

export default function PriceCards() {
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrices()
    // 每5分鐘更新一次價格
    const interval = setInterval(fetchPrices, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchPrices = async () => {
    try {
      // 使用真實價格 API
      const { fetchRealPrices } = await import('../services/api')
      const realData = await fetchRealPrices()
      setPriceData(realData)
    } catch (error) {
      console.error('Failed to fetch prices:', error)
      // 備用數據
      const fallbackData: PriceData = {
        gold: {
          price: '2000.00',
          change: '0.00',
          currency: 'USD',
          unit: '盎司',
          lastUpdate: new Date().toISOString(),
          source: 'fallback'
        },
        wheat: {
          price: '600.00',
          change: '0.00',
          currency: 'USD',
          unit: '蒲式耳',
          lastUpdate: new Date().toISOString(),
          source: 'fallback'
        }
      }
      setPriceData(fallbackData)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('zh-TW', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getChangeColor = (change: string) => {
    const changeNum = parseFloat(change)
    if (changeNum > 0) return 'text-green-400'
    if (changeNum < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  const getChangeIcon = (change: string) => {
    const changeNum = parseFloat(change)
    if (changeNum > 0) return <TrendingUp className="w-4 h-4" />
    if (changeNum < 0) return <TrendingDown className="w-4 h-4" />
    return null
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {[1, 2].map((i) => (
          <div key={i} className="cyber-border rounded-lg p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!priceData) {
    return (
      <div className="text-center text-gray-400 font-mono">
        無法載入價格資料
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h2 
        className="text-3xl font-cyber font-bold text-center mb-8 cyber-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        市場指標監控
      </motion.h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gold Price Card */}
        <motion.div
          className="cyber-border rounded-lg p-6 bg-gradient-to-br from-yellow-900/20 to-gray-800/80 backdrop-blur-sm hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-900" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400">黃金價格</h3>
                <p className="text-sm text-gray-400 font-mono">每{priceData.gold.unit}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">
                ${priceData.gold.price}
              </div>
              <div className={`flex items-center space-x-1 ${getChangeColor(priceData.gold.change)}`}>
                {getChangeIcon(priceData.gold.change)}
                <span className="font-mono text-sm">
                  {parseFloat(priceData.gold.change) > 0 ? '+' : ''}{priceData.gold.change}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
            <span>來源: {priceData.gold.source}</span>
            <span>更新: {formatTime(priceData.gold.lastUpdate)}</span>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-300 font-mono">
              💡 黃金通常被視為避險資產，價格上漲可能反映市場對地緣政治風險的擔憂
            </p>
          </div>
        </motion.div>

        {/* Wheat Price Card */}
        <motion.div
          className="cyber-border rounded-lg p-6 bg-gradient-to-br from-amber-900/20 to-gray-800/80 backdrop-blur-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <Wheat className="w-6 h-6 text-amber-900" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-400">小麥價格</h3>
                <p className="text-sm text-gray-400 font-mono">每{priceData.wheat.unit}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400">
                ${priceData.wheat.price}
              </div>
              <div className={`flex items-center space-x-1 ${getChangeColor(priceData.wheat.change)}`}>
                {getChangeIcon(priceData.wheat.change)}
                <span className="font-mono text-sm">
                  {parseFloat(priceData.wheat.change) > 0 ? '+' : ''}{priceData.wheat.change}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
            <span>來源: {priceData.wheat.source}</span>
            <span>更新: {formatTime(priceData.wheat.lastUpdate)}</span>
          </div>
          
          <div className="mt-4 p-3 bg-amber-900/20 rounded-lg">
            <p className="text-xs text-amber-300 font-mono">
              🌾 小麥是重要的糧食作物，價格波動可能反映供應鏈穩定性和食品安全風險
            </p>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <p className="text-sm text-gray-400 font-mono">
          * 價格數據僅供參考，實際交易請以官方報價為準
        </p>
      </motion.div>
    </div>
  )
}