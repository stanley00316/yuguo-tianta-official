'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import HeroLogoEditorModal from '@/components/home/HeroLogoEditorModal';
import { useAdminSession } from '@/hooks/useAdminSession';
import {
  DEFAULT_HERO_LOGO_PATH,
  HERO_LOGO_BASE_REM,
  HERO_LOGO_STORAGE_KEY,
  HERO_LOGO_SYNC_EVENT,
  type HeroLogoStored,
  parseHeroLogoStored,
} from '@/lib/hero-logo-settings';

const DEFAULT_STORED: HeroLogoStored = { imageSrc: null, frameScale: 1 };

// 首頁最上方的全版 Hero Banner（LOGO 可由管理員點擊編輯，資料存 localStorage）
export default function HeroBanner() {
  const { isAdmin } = useAdminSession();
  const [stored, setStored] = useState<HeroLogoStored>(DEFAULT_STORED);
  const [editorOpen, setEditorOpen] = useState(false);

  // 從瀏覽器讀取自訂 LOGO／圓框比例，並聽同步事件（同頁儲存或他分頁）
  const loadStored = useCallback(() => {
    try {
      const raw = localStorage.getItem(HERO_LOGO_STORAGE_KEY);
      const parsed = parseHeroLogoStored(raw);
      setStored(parsed ?? DEFAULT_STORED);
    } catch {
      setStored(DEFAULT_STORED);
    }
  }, []);

  useEffect(() => {
    loadStored();
    window.addEventListener(HERO_LOGO_SYNC_EVENT, loadStored);
    window.addEventListener('storage', loadStored);
    return () => {
      window.removeEventListener(HERO_LOGO_SYNC_EVENT, loadStored);
      window.removeEventListener('storage', loadStored);
    };
  }, [loadStored]);

  const displaySrc = stored.imageSrc ?? DEFAULT_HERO_LOGO_PATH;
  const isDataUrl = displaySrc.startsWith('data:');
  const s = stored.frameScale;
  const sizeMobile = Math.round(256 * s);
  const sizeSm = Math.round(320 * s);
  const sizeLg = Math.round(384 * s);

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
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-4 py-12 sm:py-16 lg:py-20">
          {/* 左側文字區 */}
          <div className="flex-1 max-w-xl text-center lg:text-left">
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

            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              透過職業訓練與公益商品，
              <br />
              為每一位夥伴創造有尊嚴的工作機會。
            </p>

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

          {/* 右側 LOGO：管理員點擊可開啟編輯；lg 負 margin 貼右緣 */}
          <div className="flex-shrink-0 relative lg:-mr-[max(2.5rem,env(safe-area-inset-right,0px))]">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, #E84040, #F5A623, #5CB85C, #4A90D9, #E84040)',
                transform: `scale(${1.18 * s})`,
              }}
            />
            <div
              className={`relative hero-logo-frame rounded-full overflow-hidden border-4 border-white ${
                isAdmin ? 'cursor-pointer ring-2 ring-orange-400/90 ring-offset-4 ring-offset-[#FFF8EC] sm:ring-offset-[#EDF6FF]' : ''
              }`}
              style={
                {
                  '--hero-logo-base-mobile': `${HERO_LOGO_BASE_REM.mobile}rem`,
                  '--hero-logo-base-sm': `${HERO_LOGO_BASE_REM.sm}rem`,
                  '--hero-logo-base-lg': `${HERO_LOGO_BASE_REM.lg}rem`,
                  '--hero-logo-scale': stored.frameScale,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                } as React.CSSProperties
              }
              role={isAdmin ? 'button' : undefined}
              tabIndex={isAdmin ? 0 : undefined}
              aria-label={isAdmin ? '編輯首頁大圖 LOGO 與圓框大小' : undefined}
              onClick={isAdmin ? () => setEditorOpen(true) : undefined}
              onKeyDown={
                isAdmin
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setEditorOpen(true);
                      }
                    }
                  : undefined
              }
            >
              {isDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displaySrc}
                  alt="瑀過天泰關懷協會"
                  className="absolute inset-0 w-full h-full object-fill"
                />
              ) : (
                <Image
                  src={displaySrc}
                  alt="瑀過天泰關懷協會"
                  fill
                  className="object-fill"
                  sizes={`(max-width: 639px) ${sizeMobile}px, (max-width: 1023px) ${sizeSm}px, ${sizeLg}px`}
                  priority
                />
              )}
            </div>
            {isAdmin && !editorOpen && (
              <p className="mt-3 text-center lg:text-right text-xs font-semibold text-orange-700/90 max-w-[18rem] lg:ml-auto">
                管理者：點擊圓形 LOGO 可上傳圖檔並調整大小
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0 48 C360 0 1080 0 1440 48 L1440 48 L0 48 Z" fill="#FAFAF7" />
        </svg>
      </div>

      <HeroLogoEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        initial={stored}
        onSaved={(next) => setStored(next)}
      />
    </section>
  );
}
