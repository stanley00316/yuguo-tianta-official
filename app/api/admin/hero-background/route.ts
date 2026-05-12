import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';
import {
  HERO_BACKGROUND_VERCEL_BLOCKED_MESSAGE,
  canPersistHeroBackgroundInProduction,
  getHeroBackgroundStorageMode,
  getHeroBackgroundSummary,
  removeHeroBackground,
  saveHeroBackgroundFromDataUrl,
} from '@/lib/hero-background-store';

export const dynamic = 'force-dynamic';

async function guardAdminHeroBackground(): Promise<NextResponse | null> {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: '伺服器尚未設定管理登入（環境變數），請聯絡技術人員。' },
      { status: 503 }
    );
  }

  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !(await verifySessionToken(token, secret))) {
    return NextResponse.json({ ok: false, error: '請先登入管理後台。' }, { status: 401 });
  }

  return null;
}

function summaryResponse(item: { hasCustom: boolean; updatedAt: string | null }) {
  return {
    ok: true,
    item,
    imageUrl: item.hasCustom && item.updatedAt
      ? `/api/hero-background/image?v=${encodeURIComponent(item.updatedAt)}`
      : null,
    storageMode: getHeroBackgroundStorageMode(),
    canPersist: canPersistHeroBackgroundInProduction(),
    blockedMessage: canPersistHeroBackgroundInProduction()
      ? null
      : HERO_BACKGROUND_VERCEL_BLOCKED_MESSAGE,
  };
}

// 已登入管理員讀取目前首頁背景狀態
export async function GET() {
  const deny = await guardAdminHeroBackground();
  if (deny) return deny;

  const item = await getHeroBackgroundSummary();
  return NextResponse.json(summaryResponse(item), {
    headers: { 'Cache-Control': 'no-store' },
  });
}

// 已登入管理員儲存新首頁背景圖
export async function POST(request: Request) {
  const deny = await guardAdminHeroBackground();
  if (deny) return deny;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: '請求格式不正確。' }, { status: 400 });
  }

  const imageDataUrl =
    body && typeof body === 'object' && 'imageDataUrl' in body
      ? (body as { imageDataUrl?: unknown }).imageDataUrl
      : undefined;

  const result = await saveHeroBackgroundFromDataUrl(imageDataUrl);
  if (!result.ok) {
    const status =
      result.error === HERO_BACKGROUND_VERCEL_BLOCKED_MESSAGE
        ? 503
        : result.error.includes('格式') || result.error.includes('太大') || result.error.includes('上傳')
          ? 400
          : 500;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json(summaryResponse(result.item), {
    headers: { 'Cache-Control': 'no-store' },
  });
}

// 已登入管理員移除自訂背景，首頁回到內建溫馨背景
export async function DELETE() {
  const deny = await guardAdminHeroBackground();
  if (deny) return deny;

  const result = await removeHeroBackground();
  if (!result.ok) {
    const status = result.error === HERO_BACKGROUND_VERCEL_BLOCKED_MESSAGE ? 503 : 500;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json(summaryResponse(result.item), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
