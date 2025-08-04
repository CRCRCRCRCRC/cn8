import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
    return text.replace(/&quot;/g, '"')
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&#39;/g, "'");
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { query } = request.query;
  if (!query || typeof query !== 'string') {
    return response.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const newsUrl = `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`;
    const fetchResponse = await fetch(newsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      },
    });

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch Google News: ${fetchResponse.status} ${fetchResponse.statusText}`);
    }

    const html = await fetchResponse.text();
    
    const articles: string[] = [];
    // Regex to find article links and titles within the script tags or in the main body
    const pattern = /<a[^>]+href="\.\/articles\/([^?]+)[^>]*>\s*<h3[^>]*>([^<]+)<\/h3>|<h3[^>]*class="[^>]*">\s*<a[^>]*>([^<]+)<\/a>\s*<\/h3>/g;
    let match;

    while ((match = pattern.exec(html)) !== null) {
        const title = match[2] || match[3];
        if (title && title.length > 15 && !articles.includes(title)) {
            articles.push(decodeHtmlEntities(title.trim()));
        }
        if (articles.length >= 10) break;
    }

    // Fallback regex if the main one fails
    if (articles.length === 0) {
        const fallbackPattern = /<h3[^>]*>(.*?)<\/h3>/g;
        while ((match = fallbackPattern.exec(html)) !== null) {
            const cleanedTitle = match[1].replace(/<[^>]*>/g, '').trim();
            if (cleanedTitle.length > 15 && !articles.includes(cleanedTitle)) {
                articles.push(decodeHtmlEntities(cleanedTitle));
            }
            if (articles.length >= 10) break;
        }
    }

    return response.status(200).json({ news: articles });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return response.status(500).json({ error: error.message });
  }
}