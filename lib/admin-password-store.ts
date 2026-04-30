// 這裡集中管理「管理密碼」的雜湊讀寫：本機檔案或 Upstash Redis（Vercel 等無持久硬碟時用）

import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const REDIS_KEY = 'yuguo:admin:pw_v1';
const FILE_REL = path.join('data', 'admin-password.json');

/** 檔案中只存 scrypt 雜湊，不存明文 */
export type StoredAdminPasswordV1 = { v: 1; algo: 'scrypt'; salt: string; hash: string };

// 沿用舊版：與環境變數明文比對時，先用 SHA-256 再常數時間比較
function verifyEnvPasswordSha256(input: string, expectedFromEnv: string): boolean {
  const a = createHash('sha256').update(input, 'utf8').digest();
  const b = createHash('sha256').update(expectedFromEnv, 'utf8').digest();
  return timingSafeEqual(a, b);
}

// 將輸入密碼與儲存的 scrypt 雜湊比對
function verifyScryptHash(plain: string, saltHex: string, hashHex: string): boolean {
  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(saltHex, 'hex');
    expected = Buffer.from(hashHex, 'hex');
  } catch {
    return false;
  }
  if (salt.length < 8 || expected.length !== 64) return false;
  const actual = scryptSync(plain, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });
  return timingSafeEqual(actual, expected);
}

// 產生新的 scrypt 紀錄（寫入檔案或 Redis）
function hashPlaintextToStored(plain: string): StoredAdminPasswordV1 {
  const salt = randomBytes(16);
  const hashBuf = scryptSync(plain, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });
  return { v: 1, algo: 'scrypt', salt: salt.toString('hex'), hash: hashBuf.toString('hex') };
}

function hasRedisEnv(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim());
}

async function parseStoredJson(raw: string): Promise<StoredAdminPasswordV1 | null> {
  try {
    const o = JSON.parse(raw) as StoredAdminPasswordV1;
    if (o.v !== 1 || o.algo !== 'scrypt' || typeof o.salt !== 'string' || typeof o.hash !== 'string')
      return null;
    return o;
  } catch {
    return null;
  }
}

// 若設了 Upstash，以 Redis 為唯一雜湊儲存；否則讀取本機 data 目錄內檔案
async function readStoredRecord(): Promise<StoredAdminPasswordV1 | null> {
  if (hasRedisEnv()) {
    const { Redis } = await import('@upstash/redis');
    const redis = Redis.fromEnv();
    const raw = await redis.get<string>(REDIS_KEY);
    if (!raw || typeof raw !== 'string') return null;
    return parseStoredJson(raw);
  }
  const fp = path.join(process.cwd(), FILE_REL);
  try {
    const raw = await fs.readFile(fp, 'utf8');
    return parseStoredJson(raw);
  } catch {
    return null;
  }
}

// 是否已可登入：有已儲存雜湊，或環境變數仍提供初始密碼
export async function hasUsableAdminCredential(): Promise<boolean> {
  const stored = await readStoredRecord();
  if (stored) return true;
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length > 0);
}

// 登入或變更密碼前：驗證使用者輸入是否為目前有效密碼
export async function verifyAdminCredential(plainPassword: string): Promise<boolean> {
  const stored = await readStoredRecord();
  if (stored) {
    return verifyScryptHash(plainPassword, stored.salt, stored.hash);
  }
  const envPw = process.env.ADMIN_PASSWORD;
  if (!envPw) return false;
  return verifyEnvPasswordSha256(plainPassword, envPw);
}

// 寫入新密碼雜湊（成功變更後，之後登入只認此雜湊，不再使用環境變數明文）
async function persistRecord(rec: StoredAdminPasswordV1): Promise<void> {
  if (hasRedisEnv()) {
    const { Redis } = await import('@upstash/redis');
    const redis = Redis.fromEnv();
    await redis.set(REDIS_KEY, JSON.stringify(rec));
    return;
  }
  const dir = path.join(process.cwd(), path.dirname(FILE_REL));
  await fs.mkdir(dir, { recursive: true });
  const fp = path.join(process.cwd(), FILE_REL);
  await fs.writeFile(fp, JSON.stringify(rec), { encoding: 'utf8', mode: 0o600 });
}

/** 前端或說明用：密碼雜湊存在 Redis 或本機檔案 */
export function getAdminPasswordStorageMode(): 'redis' | 'file' {
  return hasRedisEnv() ? 'redis' : 'file';
}

// 通過驗證後寫入新雜湊；無硬碟環境請改設定 Redis
export async function persistNewAdminPassword(plainNew: string): Promise<
  { ok: true } | { ok: false; error: string }
> {
  if (!plainNew || plainNew.length < 10) {
    return { ok: false, error: '新密碼至少需 10 個字元。' };
  }
  const rec = hashPlaintextToStored(plainNew);
  try {
    await persistRecord(rec);
    return { ok: true };
  } catch {
    if (hasRedisEnv()) {
      return { ok: false, error: '無法寫入 Redis，請檢查金鑰與連線設定。' };
    }
    return {
      ok: false,
      error:
        '無法寫入密碼檔。部署在無持久硬碟的環境時，請在平台設定 UPSTASH_REDIS_REST_URL 與 UPSTASH_REDIS_REST_TOKEN。',
    };
  }
}
