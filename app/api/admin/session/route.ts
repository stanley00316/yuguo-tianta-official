import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';

// 前端僅用來確認是否為已登入管理員（不洩漏敏感資訊）
export async function GET() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !(await verifySessionToken(token, secret))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
