import { getHeroBackground } from '@/lib/hero-background-store';

export const dynamic = 'force-dynamic';

// 公開讀取首頁背景圖片；沒有自訂圖時不回錯誤，前台會使用內建溫馨背景。
export async function GET() {
  const item = await getHeroBackground();
  if (!item) {
    return new Response(null, {
      status: 204,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const bytes = Buffer.from(item.base64, 'base64');
  return new Response(bytes, {
    headers: {
      'Content-Type': item.mime,
      'Content-Length': String(bytes.byteLength),
      'Last-Modified': new Date(item.updatedAt).toUTCString(),
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
