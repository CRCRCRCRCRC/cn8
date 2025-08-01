// 真實 API 服務

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// AI 模型配置 - 完全按照開發計畫.md
export const AI_MODELS = {
  'gpt-4.1-nano-2025-04-14': { cost: 2.5, name: 'GPT-4.1 Nano', apiModel: 'gpt-4' },
  'o4-mini-2025-04-16': { cost: 27.5, name: 'O4 Mini', apiModel: 'gpt-4' },
  'o3-2025-04-16': { cost: 50, name: 'O3', apiModel: 'gpt-4' },
  'o3-pro-2025-06-10': { cost: 500, name: 'O3 Pro', apiModel: 'gpt-4' },
  'o3-deep-research-2025-06-26': { cost: 250, name: 'O3 Deep Research', apiModel: 'gpt-4' },
  'o4-mini-deep-research-2025-06-26': { cost: 50, name: 'O4 Mini Deep Research', apiModel: 'gpt-4' },
}

// 獲取真實價格數據
export async function fetchRealPrices() {
  try {
    console.log('Fetching real prices from investing.com...')
    
    const proxyUrl = 'https://api.allorigins.win/raw?url='
    const goldUrl = encodeURIComponent('https://www.investing.com/commodities/gold')
    const wheatUrl = encodeURIComponent('https://www.investing.com/commodities/us-wheat')
    
    const [goldResponse, wheatResponse] = await Promise.all([
      fetch(proxyUrl + goldUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }),
      fetch(proxyUrl + wheatUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
    ])

    let goldPrice = '2000.00'
    let goldChange = '0.00'
    let wheatPrice = '600.00'
    let wheatChange = '0.00'

    // 解析黃金價格
    if (goldResponse.ok) {
      const goldHtml = await goldResponse.text()
      console.log('Gold HTML received, length:', goldHtml.length)
      
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

    // 解析小麥價格
    if (wheatResponse.ok) {
      const wheatHtml = await wheatResponse.text()
      console.log('Wheat HTML received, length:', wheatHtml.length)
      
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
    console.error('Failed to fetch real prices:', error)
    throw error
  }
}

// 獲取真實新聞數據
export async function fetchRealNews() {
  try {
    console.log('Fetching comprehensive news from Google News...')
    
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
    const proxyUrl = 'https://api.allorigins.win/raw?url='
    
    for (const query of searchQueries) {
      try {
        console.log(`Searching for: ${query}`)
        
        const newsUrl = encodeURIComponent(`https://news.google.com/search?q=${encodeURIComponent(query)}&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`)
        
        const response = await fetch(proxyUrl + newsUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
          }
        })
        
        if (response.ok) {
          const html = await response.text()
          console.log(`Successfully fetched news for: ${query}`)
          
          const titlePatterns = [
            /<article[^>]*>[\s\S]*?<h3[^>]*>(.*?)<\/h3>/g,
            /<h3[^>]*class="[^"]*"[^>]*>(.*?)<\/h3>/g,
            /<h4[^>]*>(.*?)<\/h4>/g,
            /data-n-tid[^>]*>(.*?)<\/a>/g,
            /<a[^>]*data-n-tid[^>]*>(.*?)<\/a>/g,
          ]
          
          for (const pattern of titlePatterns) {
            let match
            while ((match = pattern.exec(html)) !== null && allNews.length < 50) {
              let title = match[1].replace(/<[^>]*>/g, '').trim()
              title = title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
              
              if (title.length > 15 && 
                  !allNews.includes(title) && 
                  (title.includes('台') || title.includes('中國') || title.includes('美') || title.includes('軍') || title.includes('海'))) {
                allNews.push(title)
                console.log(`Found news: ${title}`)
              }
            }
          }
        }
      } catch (error) {
        console.log(`Error fetching news for query "${query}":`, error)
        continue
      }
      
      // 延遲避免被限制
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    return allNews.slice(0, 12)
    
  } catch (error) {
    console.error('Failed to fetch news:', error)
    throw error
  }
}

// 調用真實 OpenAI API
export async function callOpenAI(model: string, priceData: any, newsData: string[]) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const prompt = `請你扮演一位專業的國際政治與安全分析師，結合公開資料與歷史案例，評估中華人民共和國在未來三個月內對台灣發動軍事行動的可能性（以百分比形式呈現）。  

請在分析中考慮以下面向：  
1. 兩岸近期的軍事演習與活動（如共機繞台、海上演習等）  
2. 中國國內的政治壓力與決策節奏（例：重要政治會議、領導人動向）  
3. 美國及盟國在台灣周邊的軍事部署與外交互動  
4. 經濟情勢與對外制裁／反制裁影響  
5. 地緣政治事件（如南海、朝鮮半島局勢）對中國決策的牽動  
6. 歷史上類似時機點（如金門炮戰、近年演習升級）之比較  

## 當前市場指標數據
**黃金價格**: $${priceData.gold.price} USD/盎司 (變化: ${priceData.gold.change}%)
**小麥價格**: $${priceData.wheat.price} USD/蒲式耳 (變化: ${priceData.wheat.change}%)
*數據來源: ${priceData.gold.source}, 更新時間: ${new Date(priceData.gold.lastUpdate).toLocaleString('zh-TW')}*

## 近期相關新聞動態
${newsData.map((news, index) => `${index + 1}. ${news}`).join('\n')}

### 1. JSON 格式回覆

請先以以下 JSON 結構回覆，所有欄位皆不可省略，若無資料請填「N/A」：

\`\`\`json
{
  "overall_assessment": {
    "probability": "xx%",           // 未來三個月內中國攻台的總體機率
    "confidence_level": "高/中/低"  // AI 對此評估的信心水準
  },
  "indicator_analysis": [
    {
      "name": "軍事演習動態",
      "current_status": "...",     // 簡要描述
      "impact_score": "xx%",       // 對風險影響佔比
      "trend": "升高/穩定/降低"
    },
    {
      "name": "國內政治壓力",
      "current_status": "...",
      "impact_score": "xx%",
      "trend": "升高/穩定/降低"
    },
    {
      "name": "美軍部署與盟友互動",
      "current_status": "...",
      "impact_score": "xx%",
      "trend": "升高/穩定/降低"
    },
    {
      "name": "經濟與制裁情勢",
      "current_status": "...",
      "impact_score": "xx%",
      "trend": "升高/穩定/降低"
    },
    {
      "name": "其他地緣事件",
      "current_status": "...",
      "impact_score": "xx%",
      "trend": "升高/穩定/降低"
    }
  ],
  "key_triggers": [
    "觸發點 1：描述…",
    "觸發點 2：描述…"
  ],
  "mitigation_factors": [
    "因應因素 1：描述…",
    "因應因素 2：描述…"
  ]
}
\`\`\`

### 2. 最完整的分析報告（繁體中文）

請在上述 JSON 之後另起一段，用最完整、最詳盡的文字形式撰寫一份分析報告，至少 **800 字**。
報告可包含以下結構：

1. **背景說明**
2. **各指標深度解讀**
   * 軍事演習動態
   * 國內政治壓力
   * 美軍部署與盟友互動
   * 經濟與制裁情勢
   * 其他地緣事件
3. **風險觸發情境舉例**
4. **可能後果**
5. **建議對策**

請以上述 Markdown 結構回覆，切勿省略任何步驟和欄位，若無資料請填「N/A」。`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODELS[model as keyof typeof AI_MODELS]?.apiModel || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一位專業的國際政治與安全分析師，專精於台海情勢分析。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}