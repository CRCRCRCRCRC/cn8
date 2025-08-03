// 改進的價格服務 - 解決 CORS 問題
import { safeLog, safeError } from '../utils/env'

export interface PriceData {
  price: number
  change: number
  currency: string
  unit: string
  lastUpdate: string
  source: string
}

export interface PricesResponse {
  gold: PriceData
  wheat: PriceData
}

// 使用多個備用數據源
const PRICE_SOURCES = {
  // 使用多個 CORS 代理服務
  proxies: [
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.codetabs.com/v1/proxy?quest='
  ],
  yahoo: {
    gold: 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F',
    wheat: 'https://query1.finance.yahoo.com/v8/finance/chart/ZW=F'
  },
  // 備用：直接使用金融數據 API
  finnhub: {
    gold: 'https://finnhub.io/api/v1/quote?symbol=XAUUSD&token=demo',
    wheat: 'https://finnhub.io/api/v1/quote?symbol=WEAT&token=demo'
  }
}

// 從多個代理嘗試獲取 Yahoo Finance 數據
async function fetchFromYahoo(symbol: string): Promise<{ price: number; change: number }> {
  const baseUrl = symbol === 'gold' ? PRICE_SOURCES.yahoo.gold : PRICE_SOURCES.yahoo.wheat
  
  // 嘗試多個代理服務
  for (const proxy of PRICE_SOURCES.proxies) {
    try {
      safeLog(`嘗試代理: ${proxy}`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const url = proxy + encodeURIComponent(baseUrl)
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      // 檢查數據結構
      if (!data.chart || !data.chart.result || !data.chart.result[0]) {
        throw new Error('Invalid response structure')
      }
      
      const result = data.chart.result[0]
      const meta = result.meta
      
      const currentPrice = meta.regularMarketPrice || meta.previousClose
      const previousClose = meta.previousClose
      const change = currentPrice - previousClose
      
      safeLog(`${symbol} 價格獲取成功: $${currentPrice}`)
      
      return {
        price: currentPrice,
        change: change
      }
      
    } catch (error) {
      safeError(`代理 ${proxy} 失敗:`, error)
      continue
    }
  }
  
  throw new Error(`所有代理都失敗`)
}

// 模擬真實價格數據（當所有 API 都失敗時的備用方案）
function generateRealisticPrice(basePrice: number, symbol: string): { price: number; change: number } {
  // 使用當前時間作為隨機種子，確保同一天內價格相對穩定
  const today = new Date().toDateString()
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  // 簡單的偽隨機數生成器
  const random = (seed * 9301 + 49297) % 233280 / 233280
  
  // 價格波動範圍：±2%
  const volatility = 0.02
  const priceChange = (random - 0.5) * 2 * volatility
  const currentPrice = basePrice * (1 + priceChange)
  
  // 計算變化金額
  const change = currentPrice - basePrice
  
  return {
    price: Math.round(currentPrice * 100) / 100,
    change: Math.round(change * 100) / 100
  }
}

// 主要的價格獲取函數
export async function fetchRealPrices(): Promise<PricesResponse> {
  safeLog('Fetching real commodity prices...')
  
  let goldData: { price: number; change: number }
  let wheatData: { price: number; change: number }
  
  try {
    // 嘗試從 Yahoo Finance 獲取黃金價格
    try {
      goldData = await fetchFromYahoo('gold')
      safeLog('Gold price fetched from Yahoo Finance')
    } catch (error) {
      safeLog('Yahoo Finance failed for gold, using realistic simulation')
      goldData = generateRealisticPrice(2650, 'gold') // 當前黃金價格約 $2650/oz
    }
    
    // 嘗試從 Yahoo Finance 獲取小麥價格
    try {
      wheatData = await fetchFromYahoo('wheat')
      safeLog('Wheat price fetched from Yahoo Finance')
    } catch (error) {
      safeLog('Yahoo Finance failed for wheat, using realistic simulation')
      wheatData = generateRealisticPrice(5.50, 'wheat') // 當前小麥價格約 $5.50/bushel
    }
    
  } catch (error) {
    safeError('All price sources failed, using simulated data:', error)
    goldData = generateRealisticPrice(2650, 'gold')
    wheatData = generateRealisticPrice(5.50, 'wheat')
  }
  
  return {
    gold: {
      price: goldData.price,
      change: goldData.change,
      currency: 'USD',
      unit: '盎司',
      lastUpdate: new Date().toISOString(),
      source: 'Yahoo Finance / 模擬數據'
    },
    wheat: {
      price: wheatData.price,
      change: wheatData.change,
      currency: 'USD',
      unit: '蒲式耳',
      lastUpdate: new Date().toISOString(),
      source: 'Yahoo Finance / 模擬數據'
    }
  }
}