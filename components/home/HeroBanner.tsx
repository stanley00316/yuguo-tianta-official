import Image from 'next/image';
import Link from 'next/link';

// 首頁最上方的全版 Hero Banner
export default function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden min-h-[360px] sm:min-h-[440px] lg:min-h-[520px]"
      style={{
        background: 'linear-gradient(135deg, #FFF8EC 0%, #EDF6FF 50%, #F0FBF0 100%)',
      }}
    >
      {/* 背景裝飾圓形（彩虹色系） */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F5A623, transparent)' }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4A90D9, transparent)' }}
      />
      <div
        className="absolute top-10 left-1/4 w-32 h-32 rounded-full opacity-6 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5CB85C, transparent)' }}
      />

      <div className="container-site relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 py-12 sm:py-16 lg:py-20">

          {/* 左側文字區 */}
          <div className="flex-1 max-w-xl text-center lg:text-left">
            {/* 彩虹標籤 */}
            <div className="inline-flex flex-wrap items-center gap-2 mb-5 justify-center lg:justify-start">
              <div className="flex gap-1">
                {['#E84040', '#F5A623', '#5CB85C', '#4A90D9'].map((c, i) => (
                  <span key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-500 tracking-wide text-center lg:text-left">
                社團法人高雄市瑀過天泰關懷協會
              </span>
            </div>

            {/* 主標語 */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4"
              style={{
                fontFamily: "'Nunito', 'Noto Sans TC', sans-serif",
                color: '#1A1A1A',
              }}
            >
              用溫暖陪伴，<br />
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(90deg, #F5A623, #E84040)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                讓每個人都被看見
              </span>
            </h1>

            {/* 副標語 */}
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              透過職業訓練與公益商品，
              為每一位夥伴創造有尊嚴的工作機會。
            </p>

            {/* CTA 按鈕區 */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/about" className="btn-primary">
                認識我們
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/products" className="btn-secondary">
                瀏覽公益商品
              </Link>
            </div>
          </div>

          {/* 右側 Logo 大圖 */}
          <div className="flex-shrink-0 relative">
            {/* 彩虹光暈效果 */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-110"
              style={{ background: 'conic-gradient(from 0deg, #E84040, #F5A623, #5CB85C, #4A90D9, #E84040)' }}
            />
            <div
              className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-white"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            >
              <Image
                src="/images/logo.jpg"
                alt="瑀過天泰關懷協會"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 224px, 288px"
                priority
              />
            </div>
          </div>

        </div>
      </div>

      {/* 底部波浪裝飾 */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0 48 C360 0 1080 0 1440 48 L1440 48 L0 48 Z" fill="#FAFAF7"/>
        </svg>
      </div>
    </section>
  );
}
