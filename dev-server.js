import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 3001;

// 啟用 CORS
app.use(cors());
app.use(express.json());

// 模擬新聞數據
const getMockNews = (query) => {
  const mockNewsDatabase = {
    '台海軍事演習': [
      '2025年台海軍事演習規模創新高，國際密切關注',
      '中國軍方宣布台海周邊大規模軍事演習計劃',
      '台海軍事演習引發國際社會廣泛關注與討論'
    ],
    '中國台灣軍事部署': [
      '中國在台海對岸增強軍事部署，引起國際關注',
      '台灣國防部回應大陸軍事部署調整',
      '專家分析兩岸軍事部署變化對區域穩定影響'
    ],
    '美軍台海印太戰略': [
      '美軍印太戰略2025年度調整，加強前沿部署',
      '美國國防部發布最新印太軍事戰略報告',
      '美軍在印太地區軍事存在持續加強'
    ],
    '兩岸關係最新發展': [
      '兩岸關係在2025年面臨新挑戰與機遇',
      '兩岸經貿往來在複雜局勢下尋求新平衡',
      '專家呼籲兩岸應通過對話化解分歧'
    ],
    '台海安全國際關注': [
      '國際社會持續關注台海安全局勢發展',
      '多國外交官員就台海問題發表關切聲明',
      '台海安全成為國際峰會重要議題'
    ],
    '共軍繞台軍機活動': [
      '共軍繞台軍機活動頻率持續上升',
      '台灣國防部監控共軍軍機動態並發布報告',
      '軍事專家分析共軍繞台行動戰略意圖'
    ],
    '美台軍售防務合作': [
      '美台防務合作關係在新形勢下持續深化',
      '美國國會通過新一輪對台軍售法案',
      '台美軍事交流合作項目不斷擴大'
    ],
    '南海台海地緣政治': [
      '南海局勢2025年最新發展對台海安全影響',
      '地緣政治專家分析南海台海局勢關聯性',
      '區域大國在南海台海問題上的戰略博弈'
    ]
  };

  // 根據查詢關鍵字匹配相關新聞
  for (const [key, news] of Object.entries(mockNewsDatabase)) {
    if (query.includes(key) || key.includes(query)) {
      return news;
    }
  }

  // 如果沒有匹配，返回通用新聞
  return [
    '2025年台海情勢持續受到國際關注',
    '區域安全局勢發展引發各方密切關注',
    '專家呼籲通過對話維護台海和平穩定'
  ];
};

// 新聞 API 端點
app.get('/api/news', async (req, res) => {
  const { query } = req.query;
  
  console.log(`[開發服務器] 收到新聞請求，查詢: ${query}`);
  
  try {
    // 嘗試從 Google News 獲取真實新聞
    const googleNewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`;
    
    console.log(`[開發服務器] 嘗試從 Google News 獲取: ${googleNewsUrl}`);
    
    const response = await fetch(googleNewsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    if (response.ok) {
      const html = await response.text();
      console.log(`[開發服務器] 獲取到 HTML 內容，長度: ${html.length}`);
      
      const $ = cheerio.load(html);
      const articles = [];
      
      // 嘗試多種選擇器
      const selectors = ['item title', 'title', 'h3', 'h2', '.title'];
      
      for (const selector of selectors) {
        $(selector).each((i, element) => {
          const title = $(element).text().trim();
          if (title && title.length > 10 && !articles.includes(title)) {
            articles.push(title);
          }
        });
        
        if (articles.length >= 5) break;
      }
      
      console.log(`[開發服務器] 從 Google News 解析到 ${articles.length} 條新聞`);
      
      if (articles.length > 0) {
        return res.json({
          news: articles.slice(0, 12),
          isMockData: false,
          message: '成功從 Google News 獲取新聞'
        });
      }
    }
    
    console.log(`[開發服務器] Google News 請求失敗或無數據，使用模擬數據`);
    
  } catch (error) {
    console.error(`[開發服務器] Google News 請求錯誤:`, error.message);
  }
  
  // 如果真實請求失敗，使用模擬數據
  const mockNews = getMockNews(query);
  console.log(`[開發服務器] 返回 ${mockNews.length} 條模擬新聞`);
  
  res.json({
    news: mockNews,
    isMockData: true,
    message: '由於網路限制，使用本地模擬數據'
  });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`🚀 開發 API 服務器運行在 http://localhost:${PORT}`);
  console.log(`📰 新聞 API: http://localhost:${PORT}/api/news?query=台海`);
});