// 最新消息型別、預設資料與瀏覽器儲存解析（全站與後台共用）

export type NewsItem = {
  id: number;
  /** 格式 YYYY-MM-DD，供排序與顯示 */
  date: string;
  category: string;
  /** 時間軸圓點與標籤底色（建議 #RRGGBB） */
  categoryColor: string;
  title: string;
  /** 內文；段落之間可用空行，前台會拆成多段 <p> */
  content: string;
  tags: string[];
  /**
   * 首頁「最新消息」卡片摘要；未填則由內文第一段自動截取
   */
  summary?: string;
};

/** 瀏覽器保存自訂消息的 key */
export const NEWS_STORAGE_KEY = 'yuguo-tianta-news-v1';

/** 後台可選分類（與原站一致） */
export const NEWS_CATEGORY_OPTIONS = ['活動公告', '工坊動態', '公益活動'] as const;

/** 分類預設色（可於編輯時再改） */
export const NEWS_CATEGORY_DEFAULT_COLOR: Record<string, string> = {
  活動公告: '#F5A623',
  工坊動態: '#5CB85C',
  公益活動: '#4A90D9',
};

function isValidIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function isValidHexColor(s: string): boolean {
  return /^#[0-9A-Fa-f]{3}$/.test(s) || /^#[0-9A-Fa-f]{6}$/.test(s);
}

/** 依日期新到舊排序（同日則 id 較大在前） */
export function sortNewsByDateDesc(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return b.id - a.id;
  });
}

/** 首頁卡片用的摘要文字 */
export function homePreviewSummary(item: NewsItem): string {
  const s = item.summary?.trim();
  if (s) return s;
  const first = item.content.trim().split(/\n\n/)[0] || item.content.trim();
  if (first.length <= 200) return first;
  return `${first.slice(0, 197)}…`;
}

/** 首頁只顯示最新幾則（預設 3） */
export function newsForHomePreview(items: NewsItem[], limit = 3): NewsItem[] {
  return sortNewsByDateDesc(items).slice(0, limit);
}

/**
 * 官網預設消息（未自訂時顯示）
 * 內容依 Facebook 粉絲頁「瑀過天秦」公開資訊整理：
 * https://www.facebook.com/p/瑀過天秦-100091626739290/
 * （先前範例市集／職訓故事為示意文案，已移除以免與粉絲頁不一致）
 * 截至同步日，公開時間軸上可追溯之 2026 則動態以自動抓取所見為準（若有較早貼文未載入於抓取結果，請以粉絲頁為準）。
 */
export const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    date: '2026-04-21',
    category: '工坊動態',
    categoryColor: '#5CB85C',
    title: '海盛釣具店職場體驗：慢飛天使一日店員',
    summary:
      '感謝海盛釣具店提供職場體驗，孩子們學習招呼客人、上架商品與認識釣具；完整貼文與相片請見 Facebook。',
    content: `感謝海盛釣具店給我們這次溫暖又難得的職場體驗，讓這群慢飛天使當了一日店員。

過程中，他們學著跟客人打招呼、互動，也動手上架商品、貼價格標籤，還認識了各種釣魚器具；看到青蟲時，甚至勇敢地伸手去碰。

上述為粉絲頁公開貼文可閱讀之段落；若貼文另有後續說明或多張相片，請至 Facebook「瑀過天秦」粉絲頁查看完整內容。`,
    tags: ['職場體驗', '海盛釣具店', '慢飛天使'],
  },
];

// 這裡是從瀏覽器讀出自訂消息（SSR 不可用）
export function parseStoredNews(json: string | null): NewsItem[] | null {
  if (!json) return null;
  try {
    const data = JSON.parse(json) as unknown;
    if (!Array.isArray(data) || data.length === 0) return null;
    const cleaned: NewsItem[] = [];
    for (const row of data) {
      if (!row || typeof row !== 'object') continue;
      const o = row as Record<string, unknown>;
      const id = Number(o.id);
      const date = String(o.date ?? '').trim();
      const category = String(o.category ?? '').trim();
      let categoryColor = String(o.categoryColor ?? '#F5A623').trim();
      const title = String(o.title ?? '').trim();
      const content = String(o.content ?? '').trim();
      if (!isValidIsoDate(date)) continue;
      if (!isValidHexColor(categoryColor)) {
        categoryColor = NEWS_CATEGORY_DEFAULT_COLOR[category] ?? '#F5A623';
      }
      let tags: string[] = [];
      if (Array.isArray(o.tags)) {
        tags = o.tags
          .map((t) => String(t ?? '').trim())
          .filter(Boolean)
          .slice(0, 20)
          .map((t) => (t.length > 30 ? t.slice(0, 30) : t));
      }
      let summary: string | undefined;
      if (typeof o.summary === 'string' && o.summary.trim()) {
        summary = o.summary.trim().slice(0, 500);
      }
      if (!Number.isFinite(id) || id < 1 || !category || !title || !content) continue;
      cleaned.push({
        id,
        date,
        category,
        categoryColor,
        title,
        content,
        tags,
        ...(summary ? { summary } : {}),
      });
    }
    return cleaned.length > 0 ? cleaned : null;
  } catch {
    return null;
  }
}
