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

// 訪客留言儲存：正式環境用 Upstash Redis（與管理密碼相同設定），本機開發可只用檔案
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

// 將通過驗證的聯絡表單寫入站內收件匣
export async function saveContactMessage(
  data: ContactPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
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
      // 新留言插在列表最前，並保留最近 MAX_MESSAGES 筆
      await redis.lpush(REDIS_LIST_KEY, line);
      await redis.ltrim(REDIS_LIST_KEY, 0, MAX_MESSAGES - 1);
      return { ok: true };
    } catch {
      return { ok: false, error: '儲存留言失敗，請稍後再試。' };
    }
  }

  if (process.env.NODE_ENV === 'development') {
    try {
      const fp = inboxFilePath();
      await fs.mkdir(path.dirname(fp), { recursive: true });
      await fs.appendFile(fp, JSON.stringify(record) + '\n', 'utf8');
      return { ok: true };
    } catch {
      return { ok: false, error: '無法寫入本機測試檔案，請檢查專案目錄權限。' };
    }
  }

  return {
    ok: false,
    error:
      '正式環境尚未設定留言儲存：請在 Vercel 等部署環境設定 Upstash Redis（UPSTASH_REDIS_REST_URL／UPSTASH_REDIS_REST_TOKEN），與管理密碼所用相同即可。',
  };
}

// 後台列表用：由新到舊讀取留言（Redis 已為新在前；檔案則依時間排序）
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

  if (process.env.NODE_ENV === 'development') {
    const fp = inboxFilePath();
    try {
      const text = await fs.readFile(fp, 'utf8');
      const items: StoredContactMessage[] = [];
      for (const line of text.split('\n')) {
        if (!line.trim()) continue;
        const p = parseStoredLine(line);
        if (p) items.push(p);
      }
      items.sort((a, b) => (a.receivedAt < b.receivedAt ? 1 : -1));
      return items;
    } catch {
      return [];
    }
  }

  return [];
}

// 將完整列表寫回（順序為新到舊；編輯／刪除後重建 Redis 或覆寫本機檔）
async function persistFullInboxList(
  newestFirst: StoredContactMessage[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = newestFirst.slice(0, MAX_MESSAGES);

  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
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

  if (process.env.NODE_ENV === 'development') {
    try {
      const fp = inboxFilePath();
      await fs.mkdir(path.dirname(fp), { recursive: true });
      const body =
        trimmed.length === 0 ? '' : trimmed.map((x) => JSON.stringify(x)).join('\n') + '\n';
      await fs.writeFile(fp, body, 'utf8');
      return { ok: true };
    } catch {
      return { ok: false, error: '無法寫入本機留言檔案。' };
    }
  }

  return {
    ok: false,
    error: '正式環境須設定 Upstash Redis 才能修改或刪除留言。',
  };
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

// 供 API 判斷正式環境是否具備讀取收件匣能力（無 Redis 時後台列表無法對應正式資料）
export function canListContactMessagesInProduction(): boolean {
  return hasRedisEnv();
}
