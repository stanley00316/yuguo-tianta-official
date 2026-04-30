import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE_NAME,
  verifySessionToken,
} from '@/lib/admin-auth';
import {
  persistNewAdminPassword,
  verifyAdminCredential,
} from '@/lib/admin-password-store';

// 已登入管理員送出「目前密碼／新密碼」後更新雜湊儲存
export async function POST(request: Request) {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: '請求格式不正確。' }, { status: 400 });
  }

  const o = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  const currentPassword = typeof o.currentPassword === 'string' ? o.currentPassword : '';
  const newPassword = typeof o.newPassword === 'string' ? o.newPassword : '';
  const confirmPassword = typeof o.confirmPassword === 'string' ? o.confirmPassword : '';

  if (!currentPassword) {
    return NextResponse.json({ ok: false, error: '請輸入目前密碼。' }, { status: 400 });
  }
  if (!newPassword) {
    return NextResponse.json({ ok: false, error: '請輸入新密碼。' }, { status: 400 });
  }
  if (newPassword.length < 10) {
    return NextResponse.json({ ok: false, error: '新密碼至少需 10 個字元。' }, { status: 400 });
  }
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ ok: false, error: '新密碼與確認欄位不一致。' }, { status: 400 });
  }
  if (currentPassword === newPassword) {
    return NextResponse.json({ ok: false, error: '新密碼不可與目前密碼相同。' }, { status: 400 });
  }

  if (!(await verifyAdminCredential(currentPassword))) {
    return NextResponse.json({ ok: false, error: '目前密碼不正確。' }, { status: 400 });
  }

  const saved = await persistNewAdminPassword(newPassword);
  if (!saved.ok) {
    return NextResponse.json({ ok: false, error: saved.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
