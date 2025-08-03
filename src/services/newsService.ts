// 改進的新聞服務 - 提供備用數據源
import { safeLog, safeError } from '../utils/env'

// 備用新聞數據（當 API 失敗時使用）
const FALLBACK_NEWS = [
  "台海軍事演習持續進行，國際關注度提升",
  "美軍印太司令部加強區域部署",
  "兩岸關係發展受到國際社會密切關注",
  "南海局勢對台海安全影響分析",
  "國防部公布最新軍事準備狀況",
  "國際軍事專家評估台海情勢",
  "地緣政治變化對區域安全的影響",
  "盟友國家在印太地區的軍事合作",
  "經濟制裁對軍事決策的潛在影響",
  "歷史軍事衝突案例的比較分析",
  "國際法在台海問題上的適用性",
  "區域軍事平衡的最新發展"
]

// 獲取新聞數據的主要函數
export async function fetchRealNews(): Promise<string[]> {
  safeLog('開始獲取新聞數據...')
  
  try {
    // 嘗試從 Google News 獲取
    const googleNews = await fetchFromGoogleNews()
    if (googleNews.length > 0) {
      safeLog(`成功從 Google News 獲取 ${googleNews.length} 條新聞`)
      return googleNews
    }
  } catch (error) {
    safeError('Google News 獲取失敗:', error)
  }
  
  // 如果所有來源都失敗，使用備用新聞
  safeLog('使用備用新聞數據')
  return FALLBACK_NEWS.slice(0, 12)
}

// 從 Google News 獲取新聞
async function fetchFromGoogleNews(): Promise<string[]> {
  const searchQueries = [
    '台海 軍事 演習 2024',
    '中國 台灣 軍事 部署',
    '美軍 台海 印太 戰略',
    '兩岸 關係 最新 發展',
    '台海 安全 國際 關注',
    '共軍 繞台 軍機 活動',
    '美台 軍售 防務 合作',
    '南海 台海 地緣 政治'
  ]
  
  let allNews: string[] = []
  // 使用多個代理服務
  const proxyServices = [
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url='
  ]
  
  for (const query of searchQueries.slice(0, 2)) { // 只取前2個查詢避免超時
    let success = false
    
    // 嘗試多個代理服務
    for (const proxyUrl of proxyServices) {
      if (success) break
      
      try {
        safeLog(`搜索關鍵字: ${query} 使用代理: ${proxyUrl}`)
        
        const newsUrl = encodeURIComponent(`https://news.google.com/search?q=${encodeURIComponent(query)}&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超時
        
        const response = await fetch(proxyUrl + newsUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
      
      if (response.ok) {
        const html = await response.text()
        safeLog(`成功獲取新聞: ${query}`)
        
        const titlePatterns = [
          /<article[^>]*>[\s\S]*?<h3[^>]*>(.*?)<\/h3>/g,
          /<h3[^>]*class="[^"]*"[^>]*>(.*?)<\/h3>/g,
          /<h4[^>]*>(.*?)<\/h4>/g,
          /data-n-tid[^>]*>(.*?)<\/a>/g,
          /<a[^>]*data-n-tid[^>]*>(.*?)<\/a>/g,
        ]
        
        for (const pattern of titlePatterns) {
          let match
          while ((match = pattern.exec(html)) !== null && allNews.length < 20) {
            let title = match[1].replace(/<[^>]*>/g, '').trim()
            title = title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            
            if (title.length > 15 && 
                !allNews.includes(title) && 
                (title.includes('台') || title.includes('中國') || title.includes('美') || title.includes('軍') || title.includes('海'))) {
              allNews.push(title)
              safeLog(`找到新聞: ${title}`)
            }
          }
        }
      }
    } catch (error) {
      safeError(`搜索 "${query}" 時發生錯誤:`, error)
      continue
    }
    
    // 短暫延遲避免被限制
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  return allNews.slice(0, 12)
}
}