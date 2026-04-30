// 與前端一致的諮詢主旨選項（後端也檢查，避免被竄改成任意長字串）
export const CONTACT_SUBJECT_OPTIONS = [
  '商品訂購詢問',
  '企業合作洽談',
  '志工報名',
  '捐款支持',
  '職訓課程詢問',
  '媒體採訪',
  '其他',
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECT_OPTIONS)[number];

export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  subject: ContactSubject;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

const PHONE_PATTERN = /^[\d+\-\(\)\s]{7,22}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 將前端／第三方送來的 JSON 轉成聯絡表單資料並驗證（與官網表單規則一致）
export function parseAndValidateContactPayload(
  raw: unknown
): { ok: true; data: ContactPayload } | { ok: false; errors: ContactFieldErrors } {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: { message: '請求格式不正確。' } };
  }

  const o = raw as Record<string, unknown>;
  const name = typeof o.name === 'string' ? o.name.trim() : '';
  const phone = typeof o.phone === 'string' ? o.phone.trim() : '';
  const email = typeof o.email === 'string' ? o.email.trim() : '';
  const subjectRaw = typeof o.subject === 'string' ? o.subject.trim() : '';
  const message = typeof o.message === 'string' ? o.message.trim() : '';

  const errors: ContactFieldErrors = {};

  if (!name) errors.name = '請輸入您的姓名';
  if (name.length > 50) errors.name = '姓名請勿超過 50 字';

  if (!phone) errors.phone = '請輸入聯絡電話';
  else if (!PHONE_PATTERN.test(phone)) errors.phone = '請輸入有效的電話號碼';
  if (phone.length > 20) errors.phone = '電話請勿超過 20 字';

  if (email && !EMAIL_PATTERN.test(email)) errors.email = '請輸入有效的 Email 格式';
  if (email.length > 100) errors.email = 'Email 請勿超過 100 字';

  if (!CONTACT_SUBJECT_OPTIONS.includes(subjectRaw as ContactSubject)) {
    errors.subject = '請選擇有效的諮詢主旨';
  }

  if (!message) errors.message = '請輸入您的留言內容';

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      phone,
      email,
      subject: subjectRaw as ContactSubject,
      message,
    },
  };
}

// 組成給管理員閱讀的純文字內容（不要用 HTML，降低郵件用戶端 XSS 風險）
export function formatContactPlainText(data: ContactPayload): string {
  const lines = [
    '瑀過天泰關懷協會｜官網聯絡表單',
    '',
    `諮詢主旨：${data.subject}`,
    `姓名：${data.name}`,
    `聯絡電話：${data.phone}`,
    `Email：${data.email || '（未填）'}`,
    '',
    '留言內容：',
    data.message,
    '',
    `送出時間（伺服器 UTC）：${new Date().toISOString()}`,
  ];
  return lines.join('\n');
}
