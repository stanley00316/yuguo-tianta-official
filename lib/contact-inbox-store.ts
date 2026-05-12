import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  CONTACT_SUBJECT_OPTIONS,
  parseAndValidateContactPayload,
  type ContactFieldErrors,
  type ContactPayload,
  type ContactSubject,
} from '@/lib/contact-submission';

// 訪客留言：有 Upstash 時寫 Redis；否則寫本機 data/contact-inbox.jsonl（自主機房單機持久碟適用）
const REDIS_LIST_KEY = 'yuguo:contact:inbox_v1';
const MAX_MESSAGES = 500;
const INBOX_FILENAME = 'contact-inbox.jsonl';

export type StoredContactMessage = {
  id: string;
  receivedAt: string;
  name: string;
  phone: string;
  email: string;
  subject: ContactSubject;
  message: string;
};

function hasRedisEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

// Vercel 無持久硬碟：正式環境若未設 Redis，不可假裝「檔案收件匣」有效
function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

function inboxFilePath(): string {
  return path.join(process.cwd(), 'data', INBOX_FILENAME);
}

// 解析本機 jsonl 或 Redis 內單筆 JSON 字串（兼容早期沒有 id 的列）
function parseStoredLine(line: string): StoredContactMessage | null {
  try {
    const o = JSON.parse(line) as Record<string, unknown>;
    if (typeof o.receivedAt !== 'string') return null;
    const name = typeof o.name === 'string' ? o.name : '';
    const phone = typeof o.phone === 'string' ? o.phone : '';
    const email = typeof o.email === 'string' ? o.email : '';
    const subjectRaw = typeof o.subject === 'string' ? o.subject : '';
    const message = typeof o.message === 'string' ? o.message : '';
    if (!CONTACT_SUBJECT_OPTIONS.includes(subjectRaw as ContactSubject)) return null;
    const id =
      typeof o.id === 'string' && o.id.length > 0 ? o.id : `legacy-${o.receivedAt}`;
    return {
      id,
      receivedAt: o.receivedAt,
      name,
      phone,
      email,
      subject: subjectRaw as ContactSubject,
      message,
    };
  } catch {
    return null;
  }
}

// 從檔案讀入全部留言並依時間新到舊排序
async function loadMessagesFromFile(): Promise<StoredContactMessage[]> {
  const fp = inboxFilePath();
  let text: string;
  try {
    text = await fs.readFile(fp, 'utf8');
  } catch {
    return [];
  }
  const items: StoredContactMessage[] = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const p = parseStoredLine(line);
    if (p) items.push(p);
  }
  items.sort((a, b) => (a.receivedAt < b.receivedAt ? 1 : -1));
  return items;
}

// 將清單寫回 jsonl（每行一筆 JSON；順序為新到舊）
async function writeMessagesToFile(newestFirst: StoredContactMessage[]): Promise<void> {
  const fp = inboxFilePath();
  await fs.mkdir(path.dirname(fp), { recursive: true });
  const trimmed = newestFirst.slice(0, MAX_MESSAGES);
  const body =
    trimmed.length === 0 ? '' : trimmed.map((x) => JSON.stringify(x)).join('\n') + '\n';
  await fs.writeFile(fp, body, { encoding: 'utf8', mode: 0o600 });
}

function vercelProductionWithoutRedisBlocked(): boolean {
  return process.env.NODE_ENV === 'production' && isVercelRuntime() && !hasRedisEnv();
}

// 將通過驗證的聯絡表單寫入站內收件匣
export async function saveContactMessage(
  data: ContactPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (vercelProductionWithoutRedisBlocked()) {
    return {
      ok: false,
      error:
        '此部署環境（Vercel）無持久硬碟，請在環境變數設定 UPSTASH_REDIS_REST_URL 與 UPSTASH_REDIS_REST_TOKEN，或改用自主機房主機儲存留言。',
    };
  }

  const record: StoredContactMessage = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    name: data.name,
    phone: data.phone,
    email: data.email,
    subject: data.subject,
    message: data.message,
  };

  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      const line = JSON.stringify(record);
      await redis.lpush(REDIS_LIST_KEY, line);
      await redis.ltrim(REDIS_LIST_KEY, 0, MAX_MESSAGES - 1);
      return { ok: true };
    } catch {
      return { ok: false, error: '儲存留言失敗，請稍後再試。' };
    }
  }

  try {
    const merged = await loadMessagesFromFile();
    merged.unshift(record);
    await writeMessagesToFile(merged);
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: '無法寫入留言檔案，請確認主機對專案目錄下 data／ 資料夾有讀寫權限。',
    };
  }
}

// 後台列表用：由新到舊讀取留言
export async function listContactMessages(): Promise<StoredContactMessage[]> {
  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      const raw = await redis.lrange<string>(REDIS_LIST_KEY, 0, MAX_MESSAGES - 1);
      const out: StoredContactMessage[] = [];
      for (const line of raw) {
        if (typeof line !== 'string') continue;
        const p = parseStoredLine(line);
        if (p) out.push(p);
      }
      return out;
    } catch {
      return [];
    }
  }

  return loadMessagesFromFile();
}

// 將完整列表寫回（順序為新到舊；編輯／刪除後重建）
async function persistFullInboxList(
  newestFirst: StoredContactMessage[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (vercelProductionWithoutRedisBlocked()) {
    return {
      ok: false,
      error:
        '此部署環境無法使用檔案收件匣：請設定 Upstash Redis，或將網站改為自主機房部署。',
    };
  }

  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      const trimmed = newestFirst.slice(0, MAX_MESSAGES);
      await redis.del(REDIS_LIST_KEY);
      if (trimmed.length === 0) return { ok: true };
      for (let i = trimmed.length - 1; i >= 0; i--) {
        await redis.lpush(REDIS_LIST_KEY, JSON.stringify(trimmed[i]));
      }
      return { ok: true };
    } catch {
      return { ok: false, error: '更新留言清單失敗，請稍後再試。' };
    }
  }

  try {
    await writeMessagesToFile(newestFirst);
    return { ok: true };
  } catch {
    return { ok: false, error: '無法寫入本機留言檔案，請確認目錄權限。' };
  }
}

// 管理員刪除一則留言
export async function deleteContactMessage(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const list = await listContactMessages();
  const filtered = list.filter((x) => x.id !== id);
  if (filtered.length === list.length) {
    return { ok: false, error: '找不到該筆留言。' };
  }
  const saved = await persistFullInboxList(filtered);
  if (!saved.ok) return saved;
  return { ok: true };
}

// 管理員更新留言（收件時間與 id 不變；欄位規則與訪客表單相同）
export async function updateContactMessage(
  id: string,
  rawBody: unknown
): Promise<
  { ok: true; item: StoredContactMessage } | { ok: false; error: string; fieldErrors?: ContactFieldErrors }
> {
  const parsed = parseAndValidateContactPayload(rawBody);
  if (!parsed.ok) {
    return { ok: false, error: '請確認欄位內容。', fieldErrors: parsed.errors };
  }

  const list = await listContactMessages();
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) {
    return { ok: false, error: '找不到該筆留言。' };
  }

  const prev = list[idx];
  const next: StoredContactMessage = {
    id: prev.id,
    receivedAt: prev.receivedAt,
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  };

  const newList = [...list];
  newList[idx] = next;
  const saved = await persistFullInboxList(newList);
  if (!saved.ok) {
    return { ok: false, error: saved.error };
  }
  return { ok: true, item: next };
}

// 供 API 判斷正式環境是否具備收件匣後端（Redis 或非 Vercel 之檔案）
export function canListContactMessagesInProduction(): boolean {
  if (hasRedisEnv()) return true;
  if (process.env.NODE_ENV === 'production' && isVercelRuntime()) return false;
  return true;
}

// Vercel 正式環境且未設定 Redis 時 API 共用說明（自主機房無 VERCEL 環境變數時改純檔案）
export const CONTACT_INBOX_VERCEL_BLOCKED_MESSAGE =
  '此為 Vercel 正式環境且未設定 Upstash Redis，無持久硬碟可使用站內留言。請設定 UPSTASH_REDIS_REST_URL／UPSTASH_REDIS_REST_TOKEN，或改為自主機房並以 data/contact-inbox.jsonl 儲存。';
