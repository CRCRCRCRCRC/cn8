import { NextRequest, NextResponse } from 'next/server'

// 簡化版價格 API (不需要 cheerio)
async function fetchSimplePrices() {
  try {
    // 使用金融 API 或備用數據源
    // 這裡使用合理的模擬數據，但會根據市場趨勢調整
    
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()
    
    // 基於時間的合理價格變動
    const goldBasePrice = 2000
    const wheatBasePrice = 600
    
    // 模擬市場開盤時間的價格變動
    const marketOpen = hour >= 9 && hour <= 16 && day >= 1 && day <= 5
    const volatility = marketOpen ? 1.5 : 0.5
    
    const goldVariation = (Math.sin(hour * 0.5) + Math.cos(day * 0.3)) * 20 * volatility
    const wheatVariation = (Math.sin(hour * 0.3) + Math.cos(day * 0.5)) * 15 * volatility
    
    const goldPrice = goldBasePrice + goldVariation
    const wheatPrice = wheatBasePrice + wheatVariation
    
    // 計算變化百分比
    const goldChange = (goldVariation / goldBasePrice) * 100
    const wheatChange = (wheatVariation / wheatBasePrice) * 100
    
    return {
      gold: {
        price: goldPrice.toFixed(2),
        change: goldChange.toFixed(2),
        currency: 'USD',
        unit: '盎司',
        lastUpdate: new Date().toISOString(),
        source: 'market_simulation'
      },
      wheat: {
        price: wheatPrice.toFixed(2),
        change: wheatChange.toFixed(2),
        currency: 'USD',
        unit: '蒲式耳',
        lastUpdate: new Date().toISOString(),
        source: 'market_simulation'
      }
    }

  } catch (error) {
    console.error('Failed to fetch prices:', error)
    
    // 最終備用數據
    return {
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
  }
}

export async function GET(request: NextRequest) {
  try {
    const prices = await fetchSimplePrices()
    return NextResponse.json(prices)
  } catch (error) {
    console.error('Price fetch error:', error)
    
    return NextResponse.json({
      gold: {
        price: '2000.00',
        change: '0.00',
        currency: 'USD',
        unit: '盎司',
        lastUpdate: new Date().toISOString(),
        source: 'error_fallback'
      },
      wheat: {
        price: '600.00',
        change: '0.00',
        currency: 'USD',
        unit: '蒲式耳',
        lastUpdate: new Date().toISOString(),
        source: 'error_fallback'
      }
    })
  }
}