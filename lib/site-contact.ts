// 官網對外聯絡：LINE／服務據點／總機等（Footer、聯絡我們共用，避免各處寫死不一致）

export type SiteServiceLocation = {
  /** 據點區名（例：鼓山） */
  area: string;
  /** 完整地址一行 */
  address: string;
  /** Google 地圖連結 */
  mapsUrl: string;
};

export const SITE_SERVICE_LOCATIONS: SiteServiceLocation[] = [
  {
    area: '鼓山',
    address: '高雄市鼓山區鼓山二路197-1號',
    mapsUrl: 'https://maps.google.com/?q=高雄市鼓山區鼓山二路197-1號',
  },
  {
    area: '左營',
    address: '高雄市左營區文萊路369號',
    mapsUrl: 'https://maps.google.com/?q=高雄市左營區文萊路369號',
  },
];

// 對外電話集中維護，Footer／聯絡頁共用以避免號碼不同步

const PRIMARY_SITE_PHONE = { label: '07-9623203', href: 'tel:+88679623203' };
const SECOND_SITE_PHONE = { label: '07-34355636', href: 'tel:+886734355636' };

/** 對外電話（順序即顯示順序） */
export const SITE_PHONES: readonly { label: string; href: string }[] = [
  PRIMARY_SITE_PHONE,
  SECOND_SITE_PHONE,
] as const;

/** 畫面上顯示的第一支電話（向下相容既有匯入處） */
export const SITE_MAIN_PHONE_LABEL = PRIMARY_SITE_PHONE.label;

/** 第一支電話之撥號連結 */
export const SITE_MAIN_PHONE_HREF = PRIMARY_SITE_PHONE.href;

/** LINE 官方帳號 Basic ID（畫面上顯示） */
export const SITE_LINE_OFFICIAL_ID = '@502zrgxr';

/** LINE 官方帳號（加好友／開啟聊天，標準網址格式） */
export const SITE_LINE_OFFICIAL_URL = 'https://line.me/R/ti/p/@502zrgxr';
