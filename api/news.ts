import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

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
    console.log('Fetched HTML length:', html.length);
    // console.log('Fetched HTML content:', html.substring(0, 500)); // Log first 500 chars

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
    if (articles.length < 10) {
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

    console.log('Successfully processed news articles.');
    return response.status(200).json({ news: articles });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return response.status(500).json({ error: error.message });
  }
}