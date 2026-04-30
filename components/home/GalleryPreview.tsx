'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { GalleryItem } from '@/lib/gallery';
import {
  DEFAULT_GALLERY_ITEMS,
  GALLERY_STORAGE_KEY,
  parseStoredGallery,
  visibleGalleryItems,
} from '@/lib/gallery';
import { useAdminSession } from '@/hooks/useAdminSession';

// 首頁活動剪影預覽：與活動剪影頁共用同一份瀏覽器儲存，只顯示已上架前 4 筆
export default function GalleryPreview() {
  const [photos, setPhotos] = useState<GalleryItem[]>(() =>
    visibleGalleryItems(DEFAULT_GALLERY_ITEMS).slice(0, 4)
  );
  const { isAdmin } = useAdminSession();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(GALLERY_STORAGE_KEY);
      const parsed = parseStoredGallery(raw);
      const list = parsed ?? DEFAULT_GALLERY_ITEMS;
      setPhotos(visibleGalleryItems(list).slice(0, 4));
    } catch {
      setPhotos(visibleGalleryItems(DEFAULT_GALLERY_ITEMS).slice(0, 4));
    }
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="section-title">活動剪影</h2>
            <p className="mt-3 text-gray-500 text-sm">紀錄每一個感動的瞬間</p>
            <p className="mt-2">
              {isAdmin ? (
                <Link
                  href="/gallery/manage"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  編輯活動剪影、上架照片 →
                </Link>
              ) : null}
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-semibold flex items-center gap-1 transition-colors shrink-0"
            style={{ color: '#4A90D9' }}
          >
            查看更多
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {photos.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 text-sm py-8">
              目前尚未上架的活動剪影，請至編輯頁勾選上架或新增項目。
            </p>
          ) : (
            photos.map((photo) => (
            <Link key={photo.id} href="/gallery" className="group block">
              <div className="rounded-2xl overflow-hidden relative" style={{ paddingBottom: '100%' }}>
                {photo.imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- 首頁預覽可為使用者 data URL */}
                    <img
                      src={photo.imageUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </>
                ) : (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-105"
                    style={{ background: photo.color }}
                  >
                    <span className="text-5xl mb-2">{photo.emoji}</span>
                    <span className="text-xs font-semibold text-gray-600">{photo.date}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end p-3 rounded-2xl">
                  <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 px-2 py-1 rounded-lg line-clamp-2">
                    {photo.title}
                  </span>
                </div>
              </div>
            </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
