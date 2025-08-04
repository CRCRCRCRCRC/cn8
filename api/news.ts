import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// 模擬新聞數據作為備用方案
const getMockNews = (query: string): string[] => {
  const mockNewsDatabase = {
    '南海台海地緣政治': [
      '美國國務院重申對台海和平穩定的承諾',
      '南海爭議升溫，各國呼籲和平解決',
      '台海局勢成為國際關注焦點',
      '專家分析台海地緣政治影響',
      '亞太地區安全合作機制討論',
    ],
    '台海安全國際關注': [
      '國際社會關注台海和平穩定',
      '多國呼籲維護台海現狀',
      '台海安全議題成為國際焦點',
      '專家警告台海緊張局勢升級',
      '國際媒體報導台海最新動態',
    ],
    '共軍繞台軍機活動': [
      '軍事專家分析區域軍事動態',
      '國防部發布最新軍事報告',
      '亞太軍事平衡受到關注',
      '區域安全局勢持續發展',
      '軍事觀察員評估當前情勢',
    ],
    '台海軍事演習': [
      '國際軍事演習促進區域合作',
      '多國海軍聯合訓練活動',
      '軍事專家評估演習意義',
      '區域軍事合作機制加強',
      '國防安全議題受到重視',
    ],
    '美軍台海印太戰略': [
      '美國印太戰略最新發展',
      '區域安全合作夥伴關係',
      '印太地區戰略平衡分析',
      '國際安全專家評估局勢',
      '多邊安全對話機制推進',
    ],
    '美台軍售防務合作': [
      '國際防務合作關係發展',
      '區域安全夥伴關係加強',
      '防務技術交流與合作',
      '國際軍事合作新趨勢',
      '專家分析防務合作意義',
    ],
    '中國台灣軍事部署': [
      '區域軍事平衡現狀分析',
      '軍事專家評估當前局勢',
      '國際觀察員關注發展',
      '區域安全環境變化',
      '軍事戰略專家深度解析',
    ]
  };

  // 尋找最匹配的關鍵字
  for (const [key, news] of Object.entries(mockNewsDatabase)) {
    if (query.includes(key) || key.includes(query)) {
      return news;
    }
  }

  // 如果沒有匹配，返回通用新聞
  return [
    '台海地區和平穩定受到國際關注',
    '專家呼籲通過對話解決爭議',
    '區域安全合作機制持續發展',
    '國際社會關注亞太局勢',
    '多方努力維護區域和平',
    '專家分析當前國際形勢',
    '區域對話機制重要性凸顯',
    '國際合作促進和平發展',
  ];
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { query } = request.query;
  if (!query || typeof query !== 'string') {
    return response.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    console.log(`Attempting to fetch news for query: ${query}`);
    
    const newsUrl = `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`;
    const fetchResponse = await fetch(newsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      },
      timeout: 10000, // 10 秒超時
    });

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch Google News: ${fetchResponse.status} ${fetchResponse.statusText}`);
    }

    const html = await fetchResponse.text();
    console.log('Fetched HTML length:', html.length);

    const $ = cheerio.load(html);
    const articles: string[] = [];
    const seenTitles = new Set<string>();

    // 優先選擇包含標題和連結的結構
    $('a[href*="./articles/"]').each((i, el) => {
        const titleElement = $(el).find('h3, h4');
        const title = titleElement.text().trim();
        if (title && title.length > 15 && !seenTitles.has(title)) {
            articles.push(title);
            seenTitles.add(title);
        }
    });

    console.log(`Found ${articles.length} articles with primary selector.`);

    // 如果主要選擇器找不到，使用備用方案
    if (articles.length < 5) {
        $('h3, h4').each((i, el) => {
            if (articles.length >= 10) return;
            const title = $(el).text().trim();
            if (title && title.length > 15 && !seenTitles.has(title)) {
                articles.push(title);
                seenTitles.add(title);
            }
        });
        console.log(`Found ${articles.length} articles after fallback.`);
    }

    // 如果仍然沒有足夠的文章，使用模擬數據
    if (articles.length < 3) {
      console.log('Using mock data as fallback');
      const mockNews = getMockNews(query);
      return response.status(200).json({ 
        news: mockNews,
        isMockData: true,
        message: '由於網路限制，顯示模擬新聞數據'
      });
    }

    console.log('Successfully processed real news articles.');
    return response.status(200).json({ 
      news: articles,
      isMockData: false 
    });
  } catch (error: any) {
    console.error('Error fetching news, using mock data:', error);
    
    // 發生錯誤時使用模擬數據
    const mockNews = getMockNews(query);
    return response.status(200).json({ 
      news: mockNews,
      isMockData: true,
      message: '由於網路限制，顯示模擬新聞數據'
    });
  }
}