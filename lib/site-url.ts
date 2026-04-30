// 產生絕對網址字串（robots、sitemap、正式環境建議設定 NEXT_PUBLIC_SITE_URL）

export function getSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, '');
    return `https://${host}`;
  }

  return 'http://localhost:3000';
}
