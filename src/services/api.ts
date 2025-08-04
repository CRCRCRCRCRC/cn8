// 真實 API 服務
// 導入新的價格服務
import { fetchRealPrices as fetchPricesFromService } from './priceService'
import { fetchRealNews as fetchNewsFromService } from './newsService'
import { safeLog, safeError, ENV_CONFIG } from '../utils/env'

const OPENAI_API_KEY = ENV_CONFIG.OPENAI_API_KEY

// AI 模型配置 - 完全按照開發計畫.md
export const AI_MODELS = {
  'gpt-4.1-nano-2025-04-14': { cost: 2.5, name: 'GPT-4.1 Nano', apiModel: 'gpt-4.1-nano-2025-04-14' },
  'o4-mini-2025-04-16': { cost: 27.5, name: 'O4 Mini', apiModel: 'o4-mini-2025-04-16' },
  'o3-2025-04-16': { cost: 50, name: 'O3', apiModel: 'o3-2025-04-16' },
  'o3-pro-2025-06-10': { cost: 500, name: 'O3 Pro', apiModel: 'o3-pro-2025-06-10' },
  'o3-deep-research-2025-06-26': { cost: 250, name: 'O3 Deep Research', apiModel: 'o3-deep-research-2025-06-26' },
  'o4-mini-deep-research-2025-06-26': { cost: 50, name: 'O4 Mini Deep Research', apiModel: 'o4-mini-deep-research-2025-06-26' },
}

// 獲取真實價格數據 - 使用改進的服務
export async function fetchRealPrices() {
  return await fetchPricesFromService()
}

// 獲取真實新聞數據 - 使用改進的服務
export async function fetchRealNews() {
  return await fetchNewsFromService()
}

// 調用真實 AI API - 嚴格按照用戶選擇的模型
export async function callOpenAI(modelKey: string, priceData: any, newsData: string[]) {
  // 根據使用者選擇的模型鍵取得對應的 OpenAI 模型 ID
  const modelConfig = AI_MODELS[modelKey as keyof typeof AI_MODELS]
  const apiModel = modelConfig ? modelConfig.apiModel : modelKey
  
  // 根據模型決定使用 Responses API 或 Chat Completions
  const responsesAPIModels = new Set([
    'o4-mini-2025-04-16',
    'o3-2025-04-16',
    'o3-pro-2025-06-10',
    'o3-deep-research-2025-06-26',
    'o4-mini-deep-research-2025-06-26',
  ])
  const endpoint = responsesAPIModels.has(apiModel)
    ? 'https://api.openai.com/v1/responses'
    : 'https://api.openai.com/v1/chat/completions'
  if (!OPENAI_API_KEY) {
    safeError('AI API KEY not configured')
    throw new Error('AI API KEY not configured')
  }
  
  // 移除過於嚴格的 API key 格式檢查，因為新的 OpenAI key 格式可能不同
  
  safeLog(`嚴格使用用戶選擇的模型鍵: ${modelKey}，對應 OpenAI 模型 ID: ${apiModel}`)
  safeLog(`絕不擅自更改模型名稱`)
  safeLog(`價格數據:`, priceData)
  safeLog(`新聞數據: ${newsData.length} 條`)

  const prompt = `請你扮演一位專業的國際政治與安全分析師，結合公開資料與歷史案例，評估中華人民共和國在未來三個月內對台灣發動軍事行動的可能性（以百分比形式呈現）。

請在分析中考慮以下面向：
1. 兩岸近期的軍事演習與活動（如共機繞台、海上演習等）
2. 中國國內的政治壓力與決策節奏（例：重要政治會議、領導人動向）
3. 美國及盟國在台灣周邊的軍事部署與外交互動
4. 經濟情勢與對外制裁／反制裁影響
5. 地緣政治事件（如南海、朝鮮半島局勢）對中國決策的牽動
6. 歷史上類似時機點（如金門炮戰、近年演習升級）之比較

## 當前市場指標數據
**黃金價格**: $${priceData.gold?.price || 'N/A'} USD/盎司 (變化: ${priceData.gold?.change || 0}%)
**小麥價格**: $${priceData.wheat?.price || 'N/A'} USD/蒲式耳 (變化: ${priceData.wheat?.change || 0}%)
*數據來源: ${priceData.gold?.source || 'N/A'}, 更新時間: ${priceData.gold?.lastUpdate ? new Date(priceData.gold.lastUpdate).toLocaleString('zh-TW') : 'N/A'}*

## 最新相關新聞動態
${newsData.map((news, index) => `${index + 1}. ${news}`).join('\n')}

### 1. JSON 格式回覆

請先以以下 JSON 結構回覆，所有欄位皆不可省略，若無資料請填「N/A」：

\`\`\`json
{
  "overall_assessment": {
    "probability": "xx%",
    "confidence_level": "高/中/低"
  },
  "indicator_analysis": [
    {
      "name": "軍事演習動態",
      "current_status": "...",
      "impact_score": "xx%",
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

請以上述 Markdown 結構回覆，切勿省略任何步驟和欄位，若無資料請填「N/A」。`}]}}}

  try {
    safeLog(`準備調用 OpenAI API，模型: ${apiModel}`)
    safeLog(`API Key 長度: ${OPENAI_API_KEY.length}`)
    
    const requestBodyBase = {
      model: apiModel,
      max_tokens: 4000,
      temperature: 0.7,
    }
    const systemInstruction = '你是一位專業的國際政治與安全分析師，專精於台海情勢分析。你的任務是根據提供的新聞和數據，生成一份結構化的 JSON 格式分析報告。請嚴格遵循指定的 JSON 結構，不要在回覆中包含任何非 JSON 內容、註解或 markdown 標記 (例如 ```json)。你的回覆必須是一個可以直接被程式解析的 JSON 物件。'
    const chatMessages = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ]
    const requestBody = endpoint.includes('/responses')
      ? { model: apiModel, instructions: systemInstruction, input: prompt, stream: false }
      : { model: apiModel, max_tokens: 4000, temperature: 0.7, messages: chatMessages }
    
    safeLog('請求體:', JSON.stringify(requestBody, null, 2))
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      safeError(`OpenAI API error details:`, { status: response.status, statusText: response.statusText, body: errorText })
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('OpenAI API response data:', JSON.stringify(data, null, 2));
    const messageOutput = data.output?.find((item: any) => item.type === 'message');
    const resultContent = endpoint.includes('/responses')
      ? (messageOutput?.content?.[0]?.text || '')
      : (data.choices?.[0]?.message?.content || '');
    return resultContent
  } catch (error) {
    safeError('OpenAI API error:', error)
    throw error
  }
}
