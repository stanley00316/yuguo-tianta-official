'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { NewsItem } from '@/lib/news';
import { NEWS_STORAGE_KEY, parseStoredNews, sortNewsByDateDesc } from '@/lib/news';
import { useAdminSession } from '@/hooks/useAdminSession';

interface NewsClientProps {
  items: NewsItem[];
}

// 最新消息內頁：時間軸列表（與後台共用 localStorage）
export default function NewsClient({ items: initialItems }: NewsClientProps) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const { isAdmin } = useAdminSession();

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(NEWS_STORAGE_KEY) : null;
      const parsed = parseStoredNews(raw);
      if (parsed) setItems(parsed);
    } catch {
      // 讀取失敗時沿用伺服器預設
    }
  }, []);

  const sorted = useMemo(() => sortNewsByDateDesc(items), [items]);

  return (
    <>
      <section
        className="relative py-16 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EDF6FF 0%, #F0FBF0 100%)' }}
      >
        <div className="container-site relative z-10">
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ background: '#DBEAFE', color: '#1D4ED8' }}
          >
            NEWS
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black mb-3"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            最新消息
          </h1>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            掌握瑀過天泰的最新活動與工坊動態
          </p>
          <p className="mt-4">
            {isAdmin ? (
              <Link
                href="/news/manage"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span aria-hidden>✏️</span>
                編輯最新消息內容
              </Link>
            ) : null}
          </p>
        </div>
      </section>

      <section className="py-14" style={{ background: '#FAFAF7' }}>
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div
                className="absolute left-4 sm:left-5 top-0 bottom-0 w-0.5"
                style={{ background: 'linear-gradient(to bottom, #F5A623, #4A90D9, #5CB85C)' }}
              />

              <div className="space-y-6 sm:space-y-8">
                {sorted.map((news) => (
                  <div key={news.id} className="relative flex gap-4 sm:gap-6 pl-11 sm:pl-14">
                    <div
                      className="absolute left-[17px] sm:left-[21px] top-4 w-3 h-3 rounded-full border-2 border-white flex-shrink-0 z-10 -translate-x-1/2"
                      style={{
                        background: news.categoryColor,
                        boxShadow: `0 0 0 3px ${news.categoryColor}30`,
                      }}
                    />

                    <div
                      className="flex-1 bg-white rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg min-w-0"
                      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{
                            background: `${news.categoryColor}18`,
                            color: news.categoryColor,
                          }}
                        >
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-400">{news.date}</span>
                      </div>

                      <h2
                        className="text-lg font-bold text-gray-800 mb-3 leading-snug"
                        style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                      >
                        {news.title}
                      </h2>

                      <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                        {news.content.trim().split('\n\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {news.tags.map((tag) => (
                          <span
                            key={`${news.id}-${tag}`}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: '#F3F4F6', color: '#6B7280' }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12 text-gray-400 text-sm">
              <p>以上為近期公告，更多消息請關注</p>
              <a
                href="https://www.facebook.com/p/瑀過天秦-100091626739290/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold mt-1 inline-block hover:text-blue-500 transition-colors"
                style={{ color: '#4A90D9' }}
              >
                Facebook 粉絲頁 →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
