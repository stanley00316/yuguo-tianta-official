'use client';

// 首頁三大使命亮點區塊（每張卡片最多 3 張活動照片，自動輪播）

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_MISSION_IMAGES,
  MISSION_IMAGES_STORAGE_KEY,
  parseStoredMissionImages,
  type MissionImages,
} from '@/lib/mission';
import { useAdminSession } from '@/hooks/useAdminSession';

const MISSIONS = [
  {
    icon: '💼',
    title: '職業訓練',
    description:
      '提供身心障礙夥伴實務技能培訓，包含服飾整理、手工製作等工作技能，協助建立自信心與獨立能力。',
    color: '#FFF3E0',
    borderColor: '#F5A623',
  },
  {
    icon: '🤝',
    title: '就業支持',
    description:
      '搭建一座友善的橋樑，媒合合適的就業機會，讓每一位夥伴都能在有尊嚴的環境中工作與生活。',
    color: '#E8F4FD',
    borderColor: '#4A90D9',
  },
  {
    icon: '🌈',
    title: '社會融合',
    description:
      '透過公益活動與商品銷售，讓更多人認識、接納身心障礙者，共同打造包容友善的社會環境。',
    color: '#E8F8E8',
    borderColor: '#5CB85C',
  },
] as const;

// 單張卡片的照片輪播子元件
function MissionCard({
  mission,
  photos,
}: {
  mission: (typeof MISSIONS)[number];
  photos: (string | undefined)[];
}) {
  const validPhotos = photos.filter((p): p is string => !!p);
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 有多張照片時每 3 秒自動切換
  useEffect(() => {
    if (validPhotos.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % validPhotos.length);
    }, 2000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [validPhotos.length]);

  // 照片數量改變時重置到第一張
  useEffect(() => {
    setActiveIdx(0);
  }, [validPhotos.length]);

  const handleDotClick = (idx: number) => {
    setActiveIdx(idx);
    // 重置計時器
    if (timerRef.current) clearInterval(timerRef.current);
    if (validPhotos.length > 1) {
      timerRef.current = setInterval(() => {
        setActiveIdx((prev) => (prev + 1) % validPhotos.length);
      }, 2000);
    }
  };

  return (
    <div
      className="rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      style={{
        background: mission.color,
        border: `2px solid ${mission.borderColor}22`,
        boxShadow: `0 4px 20px ${mission.borderColor}18`,
      }}
    >
      {/* 上方照片輪播或 Emoji 圖示 */}
      {validPhotos.length > 0 ? (
        <div className="relative w-full" style={{ height: '180px' }}>
          {validPhotos.map((src, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: idx === activeIdx ? 1 : 0 }}
            >
              <Image
                src={src}
                alt={`${mission.title} 活動照片 ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
          ))}
          {/* 多張照片時顯示圓點導覽 */}
          {validPhotos.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
              {validPhotos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background: idx === activeIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                    transform: idx === activeIdx ? 'scale(1.3)' : 'scale(1)',
                  }}
                  aria-label={`切換到第 ${idx + 1} 張照片`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="pt-7 pb-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ background: `${mission.borderColor}20` }}
          >
            {mission.icon}
          </div>
        </div>
      )}

      {/* 文字內容 */}
      <div className="px-7 pb-7 pt-4 flex flex-col items-center w-full">
        <h3
          className="text-xl font-bold mb-3"
          style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif", color: '#2D2D2D' }}
        >
          {mission.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{mission.description}</p>
        <div
          className="mt-5 w-12 h-1 rounded-full"
          style={{ background: mission.borderColor }}
        />
      </div>
    </div>
  );
}

export default function MissionSection() {
  const [images, setImages] = useState<MissionImages>(DEFAULT_MISSION_IMAGES);
  const { isAdmin } = useAdminSession();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MISSION_IMAGES_STORAGE_KEY);
      const parsed = parseStoredMissionImages(raw);
      if (parsed) setImages(parsed);
    } catch {
      // 讀取失敗時保持預設 Emoji 顯示
    }
  }, []);

  return (
    <section className="py-20" style={{ background: '#FAFAF7' }}>
      <div className="container-site">

        {/* 標題 */}
        <div className="text-center mb-12">
          <h2 className="section-title mx-auto" style={{ display: 'inline-block' }}>
            我們的使命
          </h2>
          <p className="mt-5 text-gray-500 text-base leading-relaxed max-w-xl mx-auto">
            瑀過天秦致力於透過工坊服務，讓身心障礙夥伴找到屬於自己的舞台
          </p>
          {isAdmin && (
            <p className="mt-2">
              <Link
                href="/mission/manage"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                編輯使命照片 →
              </Link>
            </p>
          )}
        </div>

        {/* 三欄卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MISSIONS.map((m, i) => (
            <MissionCard key={i} mission={m} photos={images[i]} />
          ))}
        </div>

      </div>
    </section>
  );
}
