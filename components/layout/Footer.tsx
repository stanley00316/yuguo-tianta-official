import Image from 'next/image';
import Link from 'next/link';

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
                {/* 地址圖示 */}
                <svg className="w-4 h-4 mt-1 flex-shrink-0 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>高雄市<br />（詳細地址請來電洽詢）</span>
              </li>
              <li className="flex items-center gap-2.5">
                {/* 電話圖示 */}
                <svg className="w-4 h-4 flex-shrink-0 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <a href="tel:" className="hover:text-orange-400 transition-colors">請洽粉絲頁</a>
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
