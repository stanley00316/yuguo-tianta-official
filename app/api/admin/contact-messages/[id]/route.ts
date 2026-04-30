import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';
import {
  canListContactMessagesInProduction,
  deleteContactMessage,
  updateContactMessage,
} from '@/lib/contact-inbox-store';

// 檢查是否為已登入管理員且具備讀寫收件匣條件（與 GET 列表相同）
async function guardAdminContactInbox(): Promise<NextResponse | null> {
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
          '正式環境請設定 Upstash Redis（UPSTASH_REDIS_REST_URL／UPSTASH_REDIS_REST_TOKEN）才能管理站內留言。',
      },
      { status: 503 }
    );
  }

  return null;
}

type RouteContext = { params: Promise<{ id: string }> };

// 管理員刪除單則留言
export async function DELETE(_request: Request, context: RouteContext) {
  const deny = await guardAdminContactInbox();
  if (deny) return deny;

  const { id: idParam } = await context.params;
  const id = decodeURIComponent(idParam);
  const result = await deleteContactMessage(id);
  if (!result.ok) {
    const isMissing = result.error.includes('找不到');
    return NextResponse.json({ ok: false, error: result.error }, { status: isMissing ? 404 : 500 });
  }
  return NextResponse.json({ ok: true });
}

// 管理員更新留言內容
export async function PATCH(request: Request, context: RouteContext) {
  const deny = await guardAdminContactInbox();
  if (deny) return deny;

  const { id: idParam } = await context.params;
  const id = decodeURIComponent(idParam);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: '請求格式不正確。' }, { status: 400 });
  }

  const result = await updateContactMessage(id, body);
  if (!result.ok) {
    const status = result.fieldErrors ? 400 : result.error.includes('找不到') ? 404 : 500;
    return NextResponse.json(
      {
        ok: false,
        error: result.error,
        ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
      },
      { status }
    );
  }
  return NextResponse.json({ ok: true, item: result.item });
}
