import type { MetadataRoute } from 'next';

import { getSiteOrigin } from '@/lib/site-url';

// 告訴搜尋引擎可索引範圍（管理與後台路徑不在此站點地圖內，且各 manage 頁另有 noindex）
export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
