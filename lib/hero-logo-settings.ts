// 首頁 Hero 大圖 LOGO：與公益商品等相同，存於瀏覽器 localStorage（同一瀏覽器可看見更新）

export const HERO_LOGO_STORAGE_KEY = 'yuguo_hero_logo_v1';

/** 未自訂時使用的靜態檔 */
export const DEFAULT_HERO_LOGO_PATH = '/images/logo.jpg';

/** 圓框基準（rem），對應未縮放時的 w-64 / sm:w-80 / lg:w-96 */
export const HERO_LOGO_BASE_REM = { mobile: 16, sm: 20, lg: 24 } as const;

export type HeroLogoStored = {
  /** data:... JPEG 或站內路徑；null 表示沿用預設檔 */
  imageSrc: string | null;
  /** 圓框縮放（乘在基準 rem 上） */
  frameScale: number;
};

export const HERO_LOGO_SYNC_EVENT = 'yuguo-hero-logo-sync';

export function clampHeroFrameScale(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(1.4, Math.max(0.75, n));
}

// 這裡是檢查 localStorage JSON 是否可信、避免亂塞字串
function isValidCustomImageSrc(s: string): boolean {
  if (s.length > 5_500_000) return false;
  if (s.startsWith('/images/') && s.length < 500) return true;
  if (s.startsWith('data:image/jpeg') || s.startsWith('data:image/png') || s.startsWith('data:image/webp'))
    return true;
  return false;
}

export function parseHeroLogoStored(raw: string | null): HeroLogoStored | null {
  if (!raw?.trim()) return null;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    let imageSrc: string | null = null;
    if (o.imageSrc === null) imageSrc = null;
    else if (typeof o.imageSrc === 'string' && isValidCustomImageSrc(o.imageSrc)) imageSrc = o.imageSrc;

    const frameScale =
      typeof o.frameScale === 'number' ? clampHeroFrameScale(o.frameScale) : 1;

    return { imageSrc, frameScale };
  } catch {
    return null;
  }
}

export function serializeHeroLogoStored(data: HeroLogoStored): string {
  return JSON.stringify({
    imageSrc: data.imageSrc,
    frameScale: clampHeroFrameScale(data.frameScale),
  });
}
