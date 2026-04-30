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

/** 畫面上顯示的電話號碼 */
export const SITE_MAIN_PHONE_LABEL = '07-9623203';

/** 點擊撥號用（台灣市話去首碼 0 加國碼 886） */
export const SITE_MAIN_PHONE_HREF = 'tel:+88679623203';

/** LINE 官方帳號 Basic ID（畫面上顯示） */
export const SITE_LINE_OFFICIAL_ID = '@502zrgxr';

/** LINE 官方帳號（加好友／開啟聊天，標準網址格式） */
export const SITE_LINE_OFFICIAL_URL = 'https://line.me/R/ti/p/@502zrgxr';
