// 改進的新聞服務 - 提供備用數據源
import { safeLog, safeError } from '../utils/env'

// 備用新聞數據（當 API 失敗時使用）- 2025 年版本
const FALLBACK_NEWS_2025 = [
  "2025年台海軍事演習規模創新高，國際密切關注",
  "美軍印太戰略2025年度調整，加強前沿部署",
  "兩岸關係在2025年面臨新挑戰與機遇",
  "南海局勢2025年最新發展對台海安全影響",
  "國防部發布2025年軍事現代化進展報告",
  "國際軍事專家分析2025年台海情勢變化",
  "2025年地緣政治重組對區域安全的深遠影響",
  "印太盟友2025年軍事合作新框架啟動",
  "經濟制裁在2025年對軍事決策的影響評估",
  "2025年軍事技術發展對台海平衡的影響",
  "國際法在2025年台海問題上的新適用",
  "2025年區域軍事平衡的戰略性變化"
]

// 保留舊版本作為備用
const FALLBACK_NEWS = FALLBACK_NEWS_2025

// 獲取新聞數據的主要函數
export async function fetchRealNews(): Promise<string[]> {
  safeLog('開始獲取最新新聞數據...')
  try {
    const news = await fetchFromGoogleNews()
    if (news.length > 0) {
      safeLog(`成功從 Google News 獲取 ${news.length} 條新聞`)
      return news
    }
    safeLog('從 Google News 未獲取到新聞，將使用備用數據')
  } catch (error) {
    safeError('從 Google News 獲取新聞失敗:', error)
    safeLog('將使用備用數據')
  }
  
  // 如果 API 失敗或未返回新聞，則使用備用數據
  safeLog('使用精心策劃的 2025 年新聞數據作為備用')
  return FALLBACK_NEWS_2025.slice(0, 12)
}

// 從 Google News 獲取新聞
async function fetchFromGoogleNews(): Promise<string[]> {
  const searchQueries = [
    '台海軍事演習',
    '中國台灣軍事部署',
    '美軍台海印太戰略',
    '兩岸關係最新發展',
    '台海安全國際關注',
    '共軍繞台軍機活動',
    '美台軍售防務合作',
    '南海台海地緣政治'
  ];

  let allNews: string[] = [];
  const newsSet = new Set<string>();

  // 並行獲取多個查詢結果
  const promises = searchQueries.map(async (query) => {
    try {
      safeLog(`通過後端代理搜索關鍵字: ${query}`);
      const response = await fetch(`/api/news?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `請求失敗，狀態碼: ${response.status}`);
      }

      const data = await response.json();
      if (data.news && Array.isArray(data.news)) {
        data.news.forEach((title: string) => {
          if (title.length > 15 && !newsSet.has(title)) {
            newsSet.add(title);
            safeLog(`找到新聞: ${title}`);
          }
        });
      }
    } catch (error) {
      safeError(`搜索 "${query}" 時發生錯誤:`, error);
    }
  });

  await Promise.all(promises);

  allNews = Array.from(newsSet);
  
  // 如果還是沒有新聞，返回一個空陣列，讓主函數處理備用數據
  if (allNews.length === 0) {
      safeLog('後端代理未能獲取任何新聞。');
  }

  return allNews.slice(0, 12);
}
}