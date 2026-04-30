import type { Metadata } from 'next';
import NewsClient from './NewsClient';
import { DEFAULT_NEWS_ITEMS } from '@/lib/news';

export const metadata: Metadata = {
  title: '最新消息',
  description: '瑀過天泰關懷協會最新活動公告、工坊動態與公益資訊。',
};

/** 對外相容：舊程式若從 page 引用仍可使用 */
export const newsItems = DEFAULT_NEWS_ITEMS;

export default function NewsPage() {
  return <NewsClient items={DEFAULT_NEWS_ITEMS} />;
}
