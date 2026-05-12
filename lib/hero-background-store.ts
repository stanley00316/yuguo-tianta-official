import { promises as fs } from 'node:fs';
import path from 'node:path';

const REDIS_KEY = 'yuguo:site:hero_background_v1';
const FILE_REL = path.join('data', 'hero-background.json');
const MAX_BASE64_LENGTH = 4_500_000;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type HeroBackgroundMime = (typeof ALLOWED_MIME_TYPES)[number];

export type StoredHeroBackground = {
  hasCustom: true;
  mime: HeroBackgroundMime;
  base64: string;
  updatedAt: string;
};

export type HeroBackgroundSummary = {
  hasCustom: boolean;
  updatedAt: string | null;
};

function hasRedisEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

function heroBackgroundFilePath(): string {
  return path.join(process.cwd(), FILE_REL);
}

function isAllowedMime(mime: string): mime is HeroBackgroundMime {
  return ALLOWED_MIME_TYPES.includes(mime as HeroBackgroundMime);
}

function isBase64ImageBody(value: string): boolean {
  if (!value || value.length > MAX_BASE64_LENGTH) return false;
  return /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}

function parseStoredHeroBackground(raw: string | null): StoredHeroBackground | null {
  if (!raw?.trim()) return null;

  try {
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const mime = typeof obj.mime === 'string' ? obj.mime : '';
    const base64 = typeof obj.base64 === 'string' ? obj.base64 : '';
    const updatedAt = typeof obj.updatedAt === 'string' ? obj.updatedAt : '';

    if (!isAllowedMime(mime)) return null;
    if (!isBase64ImageBody(base64)) return null;
    if (Number.isNaN(Date.parse(updatedAt))) return null;

    return { hasCustom: true, mime, base64, updatedAt };
  } catch {
    return null;
  }
}

function parseDataUrlImage(input: unknown):
  | { ok: true; value: StoredHeroBackground }
  | { ok: false; error: string } {
  if (typeof input !== 'string') {
    return { ok: false, error: '請上傳圖片資料。' };
  }

  const match = input.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) {
    return { ok: false, error: '圖片格式不正確，請使用 JPG、PNG 或 WebP。' };
  }

  const mime = match[1];
  const base64 = match[2];
  if (!isAllowedMime(mime)) {
    return { ok: false, error: '圖片格式不支援，請使用 JPG、PNG 或 WebP。' };
  }
  if (!isBase64ImageBody(base64)) {
    return { ok: false, error: '圖片太大，請換較小的圖片後再試。' };
  }

  return {
    ok: true,
    value: {
      hasCustom: true,
      mime,
      base64,
      updatedAt: new Date().toISOString(),
    },
  };
}

function vercelProductionWithoutRedisBlocked(): boolean {
  return process.env.NODE_ENV === 'production' && isVercelRuntime() && !hasRedisEnv();
}

export function canPersistHeroBackgroundInProduction(): boolean {
  if (hasRedisEnv()) return true;
  if (process.env.NODE_ENV === 'production' && isVercelRuntime()) return false;
  return true;
}

export function getHeroBackgroundStorageMode(): 'redis' | 'file' {
  return hasRedisEnv() ? 'redis' : 'file';
}

export const HERO_BACKGROUND_VERCEL_BLOCKED_MESSAGE =
  '此為 Vercel 正式環境且未設定 Upstash Redis，無持久硬碟可儲存首頁背景圖。請設定 UPSTASH_REDIS_REST_URL／UPSTASH_REDIS_REST_TOKEN，或改為自主機房並以 data/hero-background.json 儲存。';

export async function getHeroBackground(): Promise<StoredHeroBackground | null> {
  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      const raw = await redis.get<string>(REDIS_KEY);
      return parseStoredHeroBackground(typeof raw === 'string' ? raw : null);
    } catch {
      return null;
    }
  }

  try {
    const raw = await fs.readFile(heroBackgroundFilePath(), 'utf8');
    return parseStoredHeroBackground(raw);
  } catch {
    return null;
  }
}

export async function getHeroBackgroundSummary(): Promise<HeroBackgroundSummary> {
  const item = await getHeroBackground();
  return item
    ? { hasCustom: true, updatedAt: item.updatedAt }
    : { hasCustom: false, updatedAt: null };
}

export async function saveHeroBackgroundFromDataUrl(
  imageDataUrl: unknown
): Promise<{ ok: true; item: HeroBackgroundSummary } | { ok: false; error: string }> {
  if (vercelProductionWithoutRedisBlocked()) {
    return { ok: false, error: HERO_BACKGROUND_VERCEL_BLOCKED_MESSAGE };
  }

  const parsed = parseDataUrlImage(imageDataUrl);
  if (!parsed.ok) return parsed;

  const serialized = JSON.stringify({
    mime: parsed.value.mime,
    base64: parsed.value.base64,
    updatedAt: parsed.value.updatedAt,
  });

  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      await redis.set(REDIS_KEY, serialized);
      return {
        ok: true,
        item: { hasCustom: true, updatedAt: parsed.value.updatedAt },
      };
    } catch {
      return { ok: false, error: '儲存首頁背景圖失敗，請稍後再試。' };
    }
  }

  try {
    const fp = heroBackgroundFilePath();
    await fs.mkdir(path.dirname(fp), { recursive: true });
    await fs.writeFile(fp, serialized, { encoding: 'utf8', mode: 0o600 });
    return {
      ok: true,
      item: { hasCustom: true, updatedAt: parsed.value.updatedAt },
    };
  } catch {
    return {
      ok: false,
      error: '無法寫入首頁背景圖檔案，請確認主機對專案目錄下 data／ 資料夾有讀寫權限。',
    };
  }
}

export async function removeHeroBackground(): Promise<
  { ok: true; item: HeroBackgroundSummary } | { ok: false; error: string }
> {
  if (vercelProductionWithoutRedisBlocked()) {
    return { ok: false, error: HERO_BACKGROUND_VERCEL_BLOCKED_MESSAGE };
  }

  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      await redis.del(REDIS_KEY);
      return { ok: true, item: { hasCustom: false, updatedAt: null } };
    } catch {
      return { ok: false, error: '移除首頁背景圖失敗，請稍後再試。' };
    }
  }

  try {
    await fs.rm(heroBackgroundFilePath(), { force: true });
    return { ok: true, item: { hasCustom: false, updatedAt: null } };
  } catch {
    return { ok: false, error: '無法移除首頁背景圖檔案，請確認主機資料夾權限。' };
  }
}
