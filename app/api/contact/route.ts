import { NextResponse } from 'next/server';
import { checkContactPostRateLimit } from '@/lib/contact-rate-limit';
import { saveContactMessage } from '@/lib/contact-inbox-store';
import {
  formatContactPlainText,
  parseAndValidateContactPayload,
  type ContactPayload,
} from '@/lib/contact-submission';

// 接收官網「聯絡我們」表單：優先寫入站內收件匣（Redis 或本機檔），可選同步寄信
export async function POST(request: Request) {
  // 同一 IP 每分鐘限制次數，減少濫用與機器人刷寫
  const rateOk = await checkContactPostRateLimit(request);
  if (!rateOk) {
    return NextResponse.json(
      { ok: false, error: '送出過於頻繁，請稍後再試。' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: '請求格式不正確。' }, { status: 400 });
  }

  const parsed = parseAndValidateContactPayload(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: '請確認表單內容。', fieldErrors: parsed.errors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const saved = await saveContactMessage(data);
  if (!saved.ok) {
    const status = process.env.NODE_ENV === 'development' ? 500 : 503;
    return NextResponse.json({ ok: false, error: saved.error }, { status });
  }

  // 若仍設定了 Web3Forms／Resend，在留言已成功儲存後嘗試寄信（失敗不影響訪客体驗）
  void sendOptionalEmailNotification(data);
  
  return NextResponse.json({ ok: true });
}

async function sendOptionalEmailNotification(data: ContactPayload): Promise<void> {
  const web3Key = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  if (web3Key) {
    await sendViaWeb3Forms(web3Key, data);
    return;
  }
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  if (resendKey && toEmail) {
    await sendViaResend(resendKey, toEmail, data);
  }
}

async function sendViaWeb3Forms(
  accessKey: string,
  data: ContactPayload
): Promise<{ ok: boolean }> {
  const payload: Record<string, string> = {
    access_key: accessKey,
    subject: `【瑀過天泰官網】${data.subject}`,
    from_name: data.name,
    message: formatContactPlainText(data),
  };
  if (data.email) {
    payload.email = data.email;
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { ok: false };
    }

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      return { ok: false };
    }

    const success =
      typeof json === 'object' &&
      json !== null &&
      'success' in json &&
      (json as { success: unknown }).success === true;

    return { ok: success };
  } catch {
    return { ok: false };
  }
}

async function sendViaResend(
  apiKey: string,
  to: string,
  data: ContactPayload
): Promise<{ ok: boolean }> {
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || 'onboarding@resend.dev';
  const text = formatContactPlainText(data);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email || undefined,
        subject: `【瑀過天泰官網】${data.subject}｜${data.name}`,
        text,
      }),
    });

    if (!res.ok) {
      return { ok: false };
    }

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      return { ok: false };
    }

    const id =
      typeof json === 'object' &&
      json !== null &&
      'id' in json &&
      typeof (json as { id: unknown }).id === 'string';

    return { ok: id };
  } catch {
    return { ok: false };
  }
}
