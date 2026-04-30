import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  getCookieMaxAgeSeconds,
} from '@/lib/admin-auth';
import {
  hasUsableAdminCredential,
  verifyAdminCredential,
} from '@/lib/admin-password-store';

// 這裡是管理員送出密碼、通過後發給瀏覽器受保護 Cookie
export async function POST(request: Request) {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: '伺服器尚未設定管理登入（工作階段密鑰），請聯絡技術人員。' },
      { status: 503 }
    );
  }

  if (!(await hasUsableAdminCredential())) {
    return NextResponse.json(
      {
        ok: false,
        error:
          '伺服器尚未設定初始管理密碼：請設定環境變數 ADMIN_PASSWORD，或完成雲端雜湊儲存後再試。',
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: '請求格式不正確。' }, { status: 400 });
  }

  const password =
    typeof body === 'object' && body !== null && 'password' in body
      ? String((body as { password: unknown }).password ?? '')
      : '';

  if (!password) {
    return NextResponse.json({ ok: false, error: '請輸入密碼。' }, { status: 400 });
  }

  if (!(await verifyAdminCredential(password))) {
    return NextResponse.json({ ok: false, error: '密碼錯誤。' }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === 'production';

  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: getCookieMaxAgeSeconds(),
  });

  return res;
}
