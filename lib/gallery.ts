// 活動剪影型別與預設資料（全站／管理頁共用）

import { isValidProductImage } from '@/lib/products';

export type GalleryItem = {
  id: number;
  emoji: string;
  title: string;
  description: string;
  date: string;
  category: string;
  color: string;
  size: 'large' | 'small';
  /** 上架後官網與首預覽會顯示；false 為草稿／暫下架 */
  published: boolean;
  /** 使用者上傳的活動相片；未設定時顯示 Emoji 與漸層 */
  imageUrl?: string;
};

/** 瀏覽器保存自訂活動剪影的 key */
export const GALLERY_STORAGE_KEY = 'yuguo-tianta-gallery-v1';

/** 活動剪影分類（須與前台篩選按鈕一致） */
export const GALLERY_CATEGORY_OPTIONS = [
  '市集活動',
  '訓練結訓',
  '工坊日常',
  '對外參展',
  '慶典活動',
  '志工培訓',
] as const;

/** 只在官網顯示已上架項目 */
export function visibleGalleryItems(items: GalleryItem[]): GalleryItem[] {
  return items.filter((x) => x.published !== false);
}

/**
 * 預設活動剪影（未自訂時顯示）
 * 2026 年度經 Facebook「瑀過天秦」公開時間軸可核對之貼文，目前自動抓取僅能完整對應一則：
 * https://www.facebook.com/p/瑀過天秦-100091626739290/
 * 其餘往年／示意剪影已移除；若有新活動請於後台上架或自 FB 編輯後手動新增。
 */
export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    emoji: '🎣',
    title: '海盛釣具店職場體驗（慢飛天使一日店員）',
    description:
      '感謝海盛釣具店提供職場體驗：孩子們練習招呼客人、上架商品與貼標價，並認識釣魚器具；內容與相片以 Facebook 粉絲頁貼文為準。',
    date: '2026年4月21日',
    category: '工坊日常',
    color: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
    size: 'large',
    published: true,
  },
];

// 從瀏覽器讀出自訂列表（SSR 不可用）
export function parseStoredGallery(json: string | null): GalleryItem[] | null {
  if (!json) return null;
  try {
    const data = JSON.parse(json) as unknown;
    if (!Array.isArray(data) || data.length === 0) return null;
    const cleaned: GalleryItem[] = [];
    for (const row of data) {
      if (!row || typeof row !== 'object') continue;
      const o = row as Record<string, unknown>;
      const id = Number(o.id);
      const emoji = String(o.emoji ?? '📷').trim() || '📷';
      const title = String(o.title ?? '').trim();
      const description = String(o.description ?? '').trim();
      const date = String(o.date ?? '').trim();
      const category = String(o.category ?? '').trim();
      const color =
        typeof o.color === 'string' && o.color.trim()
          ? o.color.trim()
          : 'linear-gradient(135deg, #F0FBF0, #EDF6FF)';
      const sizeRaw = String(o.size ?? 'small').toLowerCase();
      const size: 'large' | 'small' = sizeRaw === 'large' ? 'large' : 'small';

      let published = true;
      if (typeof o.published === 'boolean') published = o.published;

      let imageUrl: string | undefined;
      if (typeof o.imageUrl === 'string' && isValidProductImage(o.imageUrl)) {
        imageUrl = o.imageUrl;
      }

      if (!Number.isFinite(id) || !title || !category) continue;

      cleaned.push({
        id,
        emoji,
        title,
        description,
        date: date || '—',
        category,
        color,
        size,
        published,
        ...(imageUrl ? { imageUrl } : {}),
      });
    }
    return cleaned.length > 0 ? cleaned : null;
  } catch {
    return null;
  }
}
