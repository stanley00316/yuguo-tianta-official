import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';
import { CONTACT_INBOX_SEEN_COOKIE } from '@/lib/contact-inbox-seen-cookie';
import {
  canListContactMessagesInProduction,
  listContactMessages,
} from '@/lib/contact-inbox-store';

// 已登入管理員：是否有比「上次標記已讀」更新的站內留言（供全站頂部紅點）
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
  if (items.length === 0) {
    return NextResponse.json({ ok: true, hasNew: false });
  }

  // 列表已為新到舊，第一筆即最新收件時間
  const newestAt = items[0]!.receivedAt;
  const seenAt = jar.get(CONTACT_INBOX_SEEN_COOKIE)?.value?.trim() ?? '';

  // 從未進過收件匣或從未標記已讀時：有留言就顯示紅點
  if (!seenAt) {
    return NextResponse.json({ ok: true, hasNew: true });
  }

  // ISO 時間字串可安全用字串比大小（皆為同一時區格式）
  const hasNew = newestAt > seenAt;
  return NextResponse.json({ ok: true, hasNew });
}
