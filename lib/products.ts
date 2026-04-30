// 公益商品型別與預設資料（供全站與管理頁共用）

export type ProductItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  emoji: string;
  color: string;
  /** 使用者上傳的照片（壓縮後的 data URL）；未設定時顯示 emoji 區塊 */
  imageUrl?: string;
};

/** 瀏覽器保存自訂商品的 key */
export const PRODUCTS_STORAGE_KEY = 'yuguo-tianta-products-v1';

/** 官網預設公益商品清單（未自訂時顯示） */
export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    name: '手工刺繡托特包',
    description:
      '由工坊夥伴親手以傳統刺繡工法製作，每件圖案都是獨一無二的創作，兼具實用與藝術美感。',
    category: '手工藝',
    price: '580',
    emoji: '👜',
    color: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
  },
  {
    id: 2,
    name: '愛心手工皂禮盒',
    description:
      '天然植物油配方，5 款香味可選，包裝精美，適合送禮或自用，溫和不傷肌。',
    category: '生活用品',
    price: '320',
    emoji: '🧼',
    color: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
  },
  {
    id: 3,
    name: '有機黑糖薑母茶磚',
    description:
      '嚴選台灣老薑，古法熬製，每磚約沖 8 杯，暖心暖胃，免費提供客製化文字。',
    category: '食品',
    price: '280',
    emoji: '🍵',
    color: 'linear-gradient(135deg, #F3E5F5, #CE93D8)',
  },
  {
    id: 4,
    name: '手縫拼布零錢包',
    description:
      '多色棉布拼接，手工縫製，輕巧耐用，每件配色不同，是日常隨身的溫暖小物。',
    category: '手工藝',
    price: '180',
    emoji: '👛',
    color: 'linear-gradient(135deg, #FCE4EC, #F8BBD9)',
  },
  {
    id: 5,
    name: '天然蜂蜜禮盒',
    description:
      '合作農場純正台灣蜂蜜，無添加防腐劑，分裝成適合分享的小罐裝，甜蜜又暖心。',
    category: '食品',
    price: '350',
    emoji: '🍯',
    color: 'linear-gradient(135deg, #FFFDE7, #FFF176)',
  },
  {
    id: 6,
    name: '手工棉繩編織杯墊',
    description:
      '棉繩手工編織，吸水耐熱，共 4 個一組，環保又實用，是居家必備的溫馨小物。',
    category: '生活用品',
    price: '220',
    emoji: '🪢',
    color: 'linear-gradient(135deg, #E8F5E9, #A5D6A7)',
  },
  {
    id: 7,
    name: '彩虹刺繡胸針',
    description:
      '以彩虹色系手工刺繡而成，象徵包容與多元，別在包包或衣服上，讓愛心被看見。',
    category: '手工藝',
    price: '120',
    emoji: '🌈',
    color: 'linear-gradient(135deg, #E1F5FE, #81D4FA)',
  },
  {
    id: 8,
    name: '養生南瓜子堅果包',
    description:
      '嚴選多種台灣在地堅果，人工分裝，低溫烘焙，健康美味，是下午茶最佳夥伴。',
    category: '食品',
    price: '160',
    emoji: '🥜',
    color: 'linear-gradient(135deg, #FFF8E1, #FFE082)',
  },
  {
    id: 9,
    name: '手作環保購物袋',
    description:
      '厚磅帆布材質，夥伴手工縫製並親筆簽名，每個都是限量作品，實用兼具收藏價值。',
    category: '生活用品',
    price: '260',
    emoji: '🛍️',
    color: 'linear-gradient(135deg, #F1F8E9, #DCEDC8)',
  },
];

/** 粗略檢查是否為合法的圖片 data URL（防非圖檔混入） */
export function isSafeImageDataUrl(src: string): boolean {
  return /^data:image\/(jpeg|png|webp|gif);base64,/i.test(src);
}

/** 檢查是否為站內圖片路徑（僅允許相對路徑開頭） */
export function isSafePublicImagePath(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//') && !src.includes('..');
}

export function isValidProductImage(src: string | undefined): src is string {
  if (!src || typeof src !== 'string') return false;
  return isSafeImageDataUrl(src) || isSafePublicImagePath(src);
}

// 這裡是從瀏覽器讀出自訂列表（SSR 不可用）
export function parseStoredProducts(json: string | null): ProductItem[] | null {
  if (!json) return null;
  try {
    const data = JSON.parse(json) as unknown;
    if (!Array.isArray(data) || data.length === 0) return null;
    const cleaned: ProductItem[] = [];
    for (const row of data) {
      if (!row || typeof row !== 'object') continue;
      const o = row as Record<string, unknown>;
      const id = Number(o.id);
      const name = String(o.name ?? '').trim();
      const description = String(o.description ?? '').trim();
      const category = String(o.category ?? '').trim();
      const price = String(o.price ?? '').trim();
      const emoji = String(o.emoji ?? '🎁').trim() || '🎁';
      const color =
        typeof o.color === 'string' && o.color.trim()
          ? o.color.trim()
          : 'linear-gradient(135deg, #FFF3E0, #FFE0B2)';
      let imageUrl: string | undefined;
      if (typeof o.imageUrl === 'string' && isValidProductImage(o.imageUrl)) {
        imageUrl = o.imageUrl;
      }
      if (!Number.isFinite(id) || !name || !category) continue;
      cleaned.push({
        id,
        name,
        description,
        category,
        price,
        emoji,
        color,
        ...(imageUrl ? { imageUrl } : {}),
      });
    }
    return cleaned.length > 0 ? cleaned : null;
  } catch {
    return null;
  }
}
