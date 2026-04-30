import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';
import {
  CONTACT_INBOX_SEEN_COOKIE,
  CONTACT_INBOX_SEEN_MAX_AGE_SEC,
} from '@/lib/contact-inbox-seen-cookie';
import {
  canListContactMessagesInProduction,
  listContactMessages,
} from '@/lib/contact-inbox-store';

// 管理員開啟「留言收件匣」並載入成功後呼叫：把已讀游標設成目前最新一則的時間，全站紅點會消失
export async function POST() {
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
  const res = NextResponse.json({ ok: true as const });

  if (items.length === 0) {
    res.cookies.delete(CONTACT_INBOX_SEEN_COOKIE);
    return res;
  }

  const newestAt = items[0]!.receivedAt;
  res.cookies.set(CONTACT_INBOX_SEEN_COOKIE, newestAt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: CONTACT_INBOX_SEEN_MAX_AGE_SEC,
  });
  return res;
}
