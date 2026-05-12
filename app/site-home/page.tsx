import type { Metadata } from 'next';

import HomePage from '../page';

// 與根目錄「/」相同的協會首頁區塊；給頁首 Logo 固定連結用，並設為不主推給搜尋引擎索引
export const metadata: Metadata = {
  title: '協會官網首頁',
  robots: { index: false, follow: true },
};

export default HomePage;
