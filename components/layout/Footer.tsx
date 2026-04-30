import Image from 'next/image';
import Link from 'next/link';

import {
  SITE_LINE_OFFICIAL_ID,
  SITE_LINE_OFFICIAL_URL,
  SITE_MAIN_PHONE_HREF,
  SITE_MAIN_PHONE_LABEL,
  SITE_SERVICE_LOCATIONS,
} from '@/lib/site-contact';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* 彩虹頂部線 */}
      <div className="rainbow-top-bar" />

      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* 左欄：Logo 與簡介 */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="瑀過天泰關懷協會"
                  fill
                  className="object-contain rounded-full border-2 border-white/20"
                />
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight"
                  style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}>
                  瑀過天泰關懷協會
                </div>
                <div className="text-gray-400 text-xs mt-0.5">試衣間身心障礙工坊</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              用溫暖陪伴，讓每個人都被看見。<br />
              我們致力於提供身心障礙者職業訓練與就業機會，
              打造一個充滿愛與尊重的友善工作環境。
            </p>
            {/* Facebook 連結 */}
            <a
              href="https://www.facebook.com/p/瑀過天秦-100091626739290/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook 粉絲頁
            </a>
          </div>

          {/* 中欄：快速連結 */}
          <div>
            <h3 className="text-white font-bold text-base mb-4"
              style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}>
              快速連結
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: '首頁' },
                { href: '/about', label: '關於我們' },
                { href: '/products', label: '公益商品販售' },
                { href: '/gallery', label: '活動剪影' },
                { href: '/news', label: '最新消息' },
                { href: '/contact', label: '聯絡我們' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-orange-500">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 右欄：聯絡資訊 */}
          <div>
            <h3 className="text-white font-bold text-base mb-4"
              style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}>
              聯絡資訊
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                {/* 地點圖示：服務據點（含 Google 地圖連結） */}
                <svg className="w-4 h-4 mt-1 flex-shrink-0 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div className="space-y-2">
                  <div className="text-white/90 font-medium text-xs">服務據點</div>
                  {SITE_SERVICE_LOCATIONS.map((loc) => (
                    <div key={loc.area} className="leading-snug">
                      <span className="text-gray-500">{loc.area}：</span>{' '}
                      <a
                        href={loc.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-orange-400 transition-colors underline-offset-2 hover:underline"
                      >
                        {loc.address}
                      </a>
                    </div>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                {/* 電話圖示 */}
                <svg className="w-4 h-4 flex-shrink-0 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <a href={SITE_MAIN_PHONE_HREF} className="hover:text-orange-400 transition-colors">
                  {SITE_MAIN_PHONE_LABEL}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                {/* Facebook 圖示 */}
                <svg className="w-4 h-4 flex-shrink-0 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <a
                  href="https://www.facebook.com/p/瑀過天秦-100091626739290/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition-colors"
                >
                  Facebook 粉絲頁
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                {/* LINE 官方帳號 */}
                <svg className="w-4 h-4 flex-shrink-0 text-[#06C755]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H6.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.142h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572 5.385.572 0 4.943 0 10.314c0 4.867 4.11 8.938 9.645 9.79.375.078.89.24 1.02.55.12.299.079.766.038 1.08l-.001.02c-.042.34-.239 1.144-.239 1.144s0 .019.011.032c.02.017.042.012.042.012.142-.02 1.23-.792 1.41-.928.17-.13.65-.84.65-.84.013 0 .258.149.29.165.33.165.77.265 1.23.265.63 0 1.208-.17 1.708-.465 2.35-1.35 3.798-3.925 3.798-6.655z" />
                </svg>
                <a
                  href={SITE_LINE_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#3de889] transition-colors"
                >
                  LINE 官方帳號 {SITE_LINE_OFFICIAL_ID}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* 底部版權列 */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {currentYear} 社團法人高雄市瑀過天泰關懷協會. 版權所有.</span>
          <span className="text-gray-600">試衣間身心障礙工坊 官方網站</span>
        </div>
      </div>
    </footer>
  );
}
