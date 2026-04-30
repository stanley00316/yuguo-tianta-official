import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';
import {
  canListContactMessagesInProduction,
  listContactMessages,
} from '@/lib/contact-inbox-store';

// 已登入管理員取得站內「聯絡留言」列表（新到舊）
export async function GET() {
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

  if (process.env.NODE_ENV === 'production' && !canListContactMessagesInProduction()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          '正式環境請設定 Upstash Redis（UPSTASH_REDIS_REST_URL／UPSTASH_REDIS_REST_TOKEN）才能讀取站內留言。',
      },
      { status: 503 }
    );
  }

  const items = await listContactMessages();

  return NextResponse.json({ ok: true, items });
}
