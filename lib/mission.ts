// 使命區塊三張卡片、每張最多 3 張照片的型別與 localStorage 工具

import { isValidProductImage } from '@/lib/products';

/**
 * 單一使命卡片的照片組（最多 3 張，索引 0-2）
 * undefined 表示該格尚未上傳
 */
export type MissionCardImages = [string | undefined, string | undefined, string | undefined];

/**
 * 三張使命卡片各自的照片組
 * 索引 0=職業訓練, 1=就業支持, 2=社會融合
 */
export type MissionImages = [MissionCardImages, MissionCardImages, MissionCardImages];

/** 瀏覽器保存使命照片的 key */
export const MISSION_IMAGES_STORAGE_KEY = 'yuguo-tianta-mission-images-v2';

/** 空白的預設結構（9 格全空） */
export const DEFAULT_MISSION_IMAGES: MissionImages = [
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
];

/** 從 localStorage 解析並驗證 3×3 照片陣列 */
export function parseStoredMissionImages(json: string | null): MissionImages | null {
  if (!json) return null;
  try {
    const data = JSON.parse(json) as unknown;
    if (!Array.isArray(data) || data.length < 3) return null;
    const result: MissionImages = [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ];
    for (let card = 0; card < 3; card++) {
      const group = (data as unknown[])[card];
      if (!Array.isArray(group)) continue;
      for (let slot = 0; slot < 3; slot++) {
        const v = (group as unknown[])[slot];
        if (typeof v === 'string' && isValidProductImage(v)) {
          result[card][slot] = v;
        }
      }
    }
    return result;
  } catch {
    return null;
  }
}
