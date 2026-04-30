// 官網對外聯絡：服務據點地址與總機（Footer、聯絡我們等區塊共用，避免各處寫死不一致）

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
