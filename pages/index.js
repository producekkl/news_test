import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [newsItems, setNewsItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRssNews();
  }, []);

  const fetchRssNews = async () => {
    try {
      const response = await fetch('/api/rss');
      const data = await response.json();
      setNewsItems(data.items || []);
    } catch (error) {
      console.error('RSS 피드를 불러오는데 실패했습니다:', error);
    }
  };

  const filteredNews = newsItems.filter((item) => {
    const searchContent = `${item.title} ${item.description}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  return (
    <main className={`font-sans min-h-screen bg-gray-50`}>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-gray-800">연합뉴스 경제</h1>
            
            <div className="relative flex-1 max-w-2xl">
              <input
                type="search"
                placeholder="뉴스 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredNews.map((item, index) => (
            <article 
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
            >
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
                <div className="relative w-full h-48">
                  <Image
                    src={`https://picsum.photos/seed/${index + item.title.length}/400/300`}
                    alt={item.title}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 5} // 처음 5개 이미지는 우선 로딩
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      경제
                    </span>
                  </div>
                  <h2 className="text-sm font-bold mb-2 hover:text-blue-600 line-clamp-2">
                    {item.title.replace(/\[\[CDATA\[|\]\]>/g, '')}
                  </h2>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {item.description || '내용 없음'}
                  </p>
                  <div className="mt-auto">
                    <time className="text-xs text-gray-500">
                      {new Date(item.pubDate).toLocaleDateString('ko-KR')}
                    </time>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
