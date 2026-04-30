import type { MetadataRoute } from 'next';

import { getSiteOrigin } from '@/lib/site-url';

const PUBLIC_PATHS = ['/', '/about', '/products', '/gallery', '/news', '/contact'] as const;

// 公開頁面網址列表（不含 /admin、/*\/manage）
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin();
  const now = new Date();

  return PUBLIC_PATHS.map((path) => ({
    url: path === '/' ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
