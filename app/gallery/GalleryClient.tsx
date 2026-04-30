'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { GalleryItem } from '@/lib/gallery';
import {
  GALLERY_STORAGE_KEY,
  parseStoredGallery,
  visibleGalleryItems,
} from '@/lib/gallery';
import { useAdminSession } from '@/hooks/useAdminSession';

interface GalleryClientProps {
  items: GalleryItem[];
}

// 活動分類清單
const categories = ['全部', '市集活動', '訓練結訓', '工坊日常', '對外參展', '慶典活動', '志工培訓'];

// 活動剪影頁面主體（含分類篩選 + lightbox；僅顯示已上架）
export default function GalleryClient({ items: initialItems }: GalleryClientProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const { isAdmin } = useAdminSession();

  // 掛載後讀取瀏覽器內自訂活動剪影（與後台共用同一份資料）
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(GALLERY_STORAGE_KEY) : null;
      const parsed = parseStoredGallery(raw);
      if (parsed) setItems(parsed);
    } catch {
      // 讀取失敗時沿用伺服器預設
    }
  }, []);

  const publicItems = visibleGalleryItems(items);
  const filteredItems =
    activeCategory === '全部'
      ? publicItems
      : publicItems.filter((item) => item.category === activeCategory);

  const closeLightbox = () => setLightboxItem(null);

  return (
    <>
      <section
        className="relative py-16 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F0FBF0 0%, #EDF6FF 100%)' }}
      >
        <div className="container-site relative z-10">
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ background: '#DCFCE7', color: '#16A34A' }}
          >
            GALLERY
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black mb-3"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            活動剪影
          </h1>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            紀錄每一個感動的瞬間，見證夥伴們的成長與蛻變
          </p>
          <p className="mt-4">
            {isAdmin ? (
              <Link
                href="/gallery/manage"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span aria-hidden>✏️</span>
                編輯活動剪影、上架與上傳照片
              </Link>
            ) : null}
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container-site">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
                style={
                  activeCategory === cat
                    ? {
                        background: '#5CB85C',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(92,184,92,0.35)',
                        transform: 'translateY(-1px)',
                      }
                    : {
                        background: '#F9FAFB',
                        color: '#6B7280',
                        border: '1.5px solid #E5E7EB',
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 欄數由 globals.css .gallery-masonry 依螢幕寬度切換 */}
          <div className="gallery-masonry">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid mb-4 cursor-pointer group"
                onClick={() => setLightboxItem(item)}
              >
                <div
                  className="rounded-2xl overflow-hidden relative transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
                  style={{
                    paddingBottom: item.size === 'large' ? '75%' : '100%',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  }}
                >
                  {item.imageUrl ? (
                    <>
                      {/* 活動照片上傳後當作主視覺 */}
                      <div className="absolute inset-0">
                        {/* eslint-disable-next-line @next/next/no-img-element -- 資料來自使用者上傳 data URL */}
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-full h-full object-cover absolute inset-0 transition-transform duration-400 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" aria-hidden />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-400 group-hover:scale-105"
                      style={{ background: item.color }}
                    >
                      <span className="text-5xl sm:text-6xl mb-2 transition-transform duration-300 group-hover:scale-110">
                        {item.emoji}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 rounded-2xl">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full self-start mb-1.5"
                      style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}
                    >
                      {item.category}
                    </span>
                    <h3 className="text-white font-bold text-sm leading-snug">{item.title}</h3>
                    <p className="text-white/80 text-xs mt-1">{item.date}</p>
                  </div>

                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">📷</div>
              <p className="text-base">此分類目前尚無相片</p>
            </div>
          )}
        </div>
      </section>

      {lightboxItem && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div
            className="relative max-w-lg w-full mx-auto rounded-2xl sm:rounded-3xl overflow-hidden max-h-[min(92dvh,92vh)] overflow-y-auto my-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}
          >
            {lightboxItem.imageUrl ? (
              <div className="relative w-full min-h-[180px] h-[42vh] max-h-[min(50vh,360px)] sm:h-80 sm:max-h-none bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxItem.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center min-h-[200px] h-[38vh] max-h-[320px] sm:h-80 sm:max-h-none"
                style={{
                  background: lightboxItem.color,
                }}
              >
                <span className="text-6xl sm:text-8xl">{lightboxItem.emoji}</span>
              </div>
            )}

            <div className="bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: '#DCFCE7', color: '#16A34A' }}
                >
                  {lightboxItem.category}
                </span>
                <span className="text-sm text-gray-400">{lightboxItem.date}</span>
              </div>
              <h2
                className="text-lg sm:text-xl font-black text-gray-800 mb-2 break-words"
                style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
              >
                {lightboxItem.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">{lightboxItem.description}</p>
            </div>

            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-md"
              aria-label="關閉"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
