import { parseStringPromise } from 'xml2js';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.yna.co.kr/rss/economy.xml');
    const xmlText = await response.text();
    const result = await parseStringPromise(xmlText);
    
    const items = result.rss.channel[0].item.map((item, index) => ({
      title: item.title[0],
      link: item.link[0],
      description: item.description ? item.description[0] : '',
      pubDate: item.pubDate[0],
      imageUrl: `https://picsum.photos/seed/${index}/400/300`
    }));

    res.status(200).json({ items });
  } catch (error) {
    console.error('RSS 처리 중 오류:', error);
    res.status(500).json({ error: 'RSS 피드를 가져오는데 실패했습니다.' });
  }
} 