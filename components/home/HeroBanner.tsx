'use client';

import Link from 'next/link';

import { useAdminSession } from '@/hooks/useAdminSession';

const HERO_BACKGROUND_IMAGE_URL = '/api/hero-background/image';

// 首頁第一屏：照片背景由後台上傳，沒有自訂圖時用溫暖漸層當安全底圖。
export default function HeroBanner() {
  const { isAdmin } = useAdminSession();

  return (
    <section
      className="relative isolate overflow-hidden min-h-[520px] sm:min-h-[600px] lg:min-h-[640px]"
      style={{
        backgroundColor: '#D6B47A',
        backgroundImage: [
          'linear-gradient(90deg, rgba(64, 40, 22, 0.78) 0%, rgba(83, 51, 28, 0.58) 43%, rgba(255, 255, 255, 0.08) 100%)',
          'linear-gradient(180deg, rgba(255, 248, 237, 0.24) 0%, rgba(255, 255, 255, 0) 44%, rgba(250, 250, 247, 0.28) 100%)',
          `url("${HERO_BACKGROUND_IMAGE_URL}")`,
          'radial-gradient(circle at 18% 34%, rgba(111, 157, 82, 0.78) 0%, rgba(111, 157, 82, 0) 32%)',
          'radial-gradient(circle at 78% 28%, rgba(255, 225, 151, 0.82) 0%, rgba(255, 225, 151, 0) 34%)',
          'linear-gradient(135deg, #E6C17B 0%, #A8C983 46%, #7FB2D4 100%)',
        ].join(', '),
        backgroundSize: 'cover, cover, cover, cover, cover, cover',
        backgroundPosition: 'center, center, center, center, center, center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 上方白色弧線：承接固定頁首，做出參考圖的柔和波浪感。 */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 96" className="w-full h-16 sm:h-20 lg:h-24" preserveAspectRatio="none" aria-hidden>
          <path d="M0 0 H1440 V34 C1090 92 310 92 0 34 Z" fill="white" />
        </svg>
      </div>

      <div className="container-site relative z-10 min-h-[520px] sm:min-h-[600px] lg:min-h-[640px] flex items-center pt-24 sm:pt-28 lg:pt-32 pb-28 sm:pb-32 lg:pb-36">
        <div className="max-w-2xl text-center lg:text-left text-white">
          <div className="inline-flex flex-wrap items-center gap-2 mb-5 justify-center lg:justify-start">
            <div className="flex gap-1">
              {['#E84040', '#F5A623', '#5CB85C', '#4A90D9'].map((color) => (
                <span key={color} className="w-3 h-3 rounded-full border border-white/60" style={{ background: color }} />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-white/95 drop-shadow">
              社團法人高雄市瑀過天秦關懷協會
            </span>
          </div>

          <h1
            className="mb-5 tracking-normal"
            style={{
              fontFamily: "'Nunito', 'Noto Sans TC', sans-serif",
              textShadow: '0 2px 18px rgba(0, 0, 0, 0.34)',
            }}
          >
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
              以陪伴為起點，看見每一段成長的價值。
            </span>
            <span className="mt-4 block max-w-xl text-base sm:text-lg lg:text-xl font-bold leading-[1.65] text-white/95 mx-auto lg:mx-0">
              我們從早期療育出發，陪伴至成人階段，持續支持身心障礙者與弱勢族群走過人生的重要歷程。
            </span>
          </h1>

          <p
            className="text-base sm:text-lg text-white/92 mb-7 sm:mb-8 leading-relaxed"
            style={{ textShadow: '0 2px 14px rgba(0, 0, 0, 0.28)' }}
          >
            透過職業訓練與公益商品的推動，
            <br />
            我們不只是提供機會，
            <br />
            更致力於打造穩定的工作機會與安心的生活，
            <br />
            實現共融、共好的社會願景。
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link href="/about" className="btn-primary">
              認識我們
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white/92 text-[#2F6EB5] border-2 border-white font-bold py-3 px-7 rounded-full transition-all duration-200 hover:bg-white hover:-translate-y-0.5"
              style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
            >
              瀏覽公益商品
            </Link>
          </div>

          {isAdmin && (
            <div className="mt-5">
              <Link
                href="/hero/manage"
                className="inline-flex items-center rounded-full bg-white/88 px-4 py-2 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-white"
              >
                管理者：編輯首頁背景
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 下方白色弧線：讓照片自然銜接下一個暖白區塊。 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 112" className="w-full h-24 sm:h-28" preserveAspectRatio="none" aria-hidden>
          <path d="M0 62 C260 100 430 28 620 52 C850 82 980 26 1188 46 C1328 60 1398 50 1440 34 V112 H0 Z" fill="#FAFAF7" />
        </svg>
      </div>
    </section>
  );
}
