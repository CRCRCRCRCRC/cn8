import { NextRequest, NextResponse } from 'next/server'

// 從 investing.com 獲取真實價格數據
async function fetchRealPrices() {
  try {
    console.log('Fetching real prices from investing.com...')
    
    // 使用代理服務或 CORS 代理來獲取數據
    const proxyUrl = 'https://api.allorigins.win/raw?url='
    
    const goldUrl = encodeURIComponent('https://www.investing.com/commodities/gold')
    const wheatUrl = encodeURIComponent('https://www.investing.com/commodities/us-wheat')
    
    let goldPrice = '2000.00'
    let goldChange = '0.00'
    let wheatPrice = '600.00'
    let wheatChange = '0.00'
    
    try {
      // 獲取黃金價格
      console.log('Fetching gold price...')
      const goldResponse = await fetch(proxyUrl + goldUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (goldResponse.ok) {
        const goldHtml = await goldResponse.text()
        console.log('Gold HTML received, length:', goldHtml.length)
        
        // 尋找價格數據的多種模式
        const pricePatterns = [
          /data-test="instrument-price-last"[^>]*>([^<]+)</,
          /class="text-2xl[^>]*>([^<]+)</,
          /pid-1-last[^>]*>([^<]+)</,
          /"last":"([^"]+)"/,
          /\$([0-9,]+\.?[0-9]*)/
        ]
        
        for (const pattern of pricePatterns) {
          const match = goldHtml.match(pattern)
          if (match) {
            const extractedPrice = match[1].replace(/[^0-9.]/g, '')
            if (extractedPrice && parseFloat(extractedPrice) > 1000) {
              goldPrice = parseFloat(extractedPrice).toFixed(2)
              console.log('Gold price found:', goldPrice)
              break
            }
          }
        }
        
        // 尋找變化數據
        const changePatterns = [
          /data-test="instrument-price-change"[^>]*>([^<]+)</,
          /change[^>]*>([+-]?[0-9.]+)/,
          /"change":"([^"]+)"/
        ]
        
        for (const pattern of changePatterns) {
          const match = goldHtml.match(pattern)
          if (match) {
            const extractedChange = match[1].replace(/[^0-9.-]/g, '')
            if (extractedChange) {
              goldChange = parseFloat(extractedChange).toFixed(2)
              console.log('Gold change found:', goldChange)
              break
            }
          }
        }
      }
    } catch (goldError) {
      console.log('Gold fetch error:', goldError.message)
    }
    
    try {
      // 獲取小麥價格
      console.log('Fetching wheat price...')
      const wheatResponse = await fetch(proxyUrl + wheatUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (wheatResponse.ok) {
        const wheatHtml = await wheatResponse.text()
        console.log('Wheat HTML received, length:', wheatHtml.length)
        
        // 尋找價格數據
        const pricePatterns = [
          /data-test="instrument-price-last"[^>]*>([^<]+)</,
          /class="text-2xl[^>]*>([^<]+)</,
          /pid-[0-9]+-last[^>]*>([^<]+)</,
          /"last":"([^"]+)"/,
          /\$([0-9,]+\.?[0-9]*)/
        ]
        
        for (const pattern of pricePatterns) {
          const match = wheatHtml.match(pattern)
          if (match) {
            const extractedPrice = match[1].replace(/[^0-9.]/g, '')
            if (extractedPrice && parseFloat(extractedPrice) > 100) {
              wheatPrice = parseFloat(extractedPrice).toFixed(2)
              console.log('Wheat price found:', wheatPrice)
              break
            }
          }
        }
        
        // 尋找變化數據
        const changePatterns = [
          /data-test="instrument-price-change"[^>]*>([^<]+)</,
          /change[^>]*>([+-]?[0-9.]+)/,
          /"change":"([^"]+)"/
        ]
        
        for (const pattern of changePatterns) {
          const match = wheatHtml.match(pattern)
          if (match) {
            const extractedChange = match[1].replace(/[^0-9.-]/g, '')
            if (extractedChange) {
              wheatChange = parseFloat(extractedChange).toFixed(2)
              console.log('Wheat change found:', wheatChange)
              break
            }
          }
        }
      }
    } catch (wheatError) {
      console.log('Wheat fetch error:', wheatError.message)
    }
    
    return {
      gold: {
        price: goldPrice,
        change: goldChange,
        currency: 'USD',
        unit: '盎司',
        lastUpdate: new Date().toISOString(),
        source: 'investing.com'
      },
      wheat: {
        price: wheatPrice,
        change: wheatChange,
        currency: 'USD',
        unit: '蒲式耳',
        lastUpdate: new Date().toISOString(),
        source: 'investing.com'
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
    // 調用真實價格獲取函數
    const prices = await fetchRealPrices()
    
    return NextResponse.json(prices)
  } catch (error) {
    console.error('Price fetch error:', error)
    
    // 返回預設值以防 API 錯誤
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