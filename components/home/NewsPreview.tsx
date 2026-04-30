'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { NewsItem } from '@/lib/news';
import {
  DEFAULT_NEWS_ITEMS,
  NEWS_STORAGE_KEY,
  homePreviewSummary,
  newsForHomePreview,
  parseStoredNews,
} from '@/lib/news';
import { useAdminSession } from '@/hooks/useAdminSession';

// 首頁最新消息預覽（讀取與 /news/manage 相同之 localStorage）
export default function NewsPreview() {
  const [items, setItems] = useState<NewsItem[]>(DEFAULT_NEWS_ITEMS);
  const { isAdmin } = useAdminSession();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(NEWS_STORAGE_KEY);
      const parsed = parseStoredNews(raw);
      if (parsed) setItems(parsed);
    } catch {
      setItems(DEFAULT_NEWS_ITEMS);
    }
  }, []);

  const previewRows = useMemo(() => newsForHomePreview(items, 3), [items]);

  return (
    <section className="py-20 bg-white">
      <div className="container-site">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h2 className="section-title">最新消息</h2>
            {isAdmin ? (
              <p className="mt-2">
                <Link
                  href="/news/manage"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  編輯最新消息內容 →
                </Link>
              </p>
            ) : null}
          </div>
          <Link
            href="/news"
            className="text-sm font-semibold flex items-center gap-1 transition-colors shrink-0 self-start sm:self-auto"
            style={{ color: '#4A90D9' }}
          >
            查看全部
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewRows.map((news) => (
            <Link key={news.id} href="/news" className="card group block p-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: `${news.categoryColor}18`,
                    color: news.categoryColor,
                  }}
                >
                  {news.category}
                </span>
                <span className="text-xs text-gray-400">{news.date}</span>
              </div>
              <h3
                className="font-bold text-gray-800 text-base leading-snug mb-2 group-hover:text-orange-500 transition-colors"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                {news.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{homePreviewSummary(news)}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-orange-500">
                閱讀更多
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
