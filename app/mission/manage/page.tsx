'use client';

// 後台：使命區塊三張卡片、每張可上傳 3 張照片（共 9 格）

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { compressImageToJpegDataUrl } from '@/lib/image-compress';
import {
  DEFAULT_MISSION_IMAGES,
  MISSION_IMAGES_STORAGE_KEY,
  parseStoredMissionImages,
  type MissionImages,
} from '@/lib/mission';
import AdminSessionActions from '@/components/admin/AdminSessionActions';

const MISSION_META = [
  { icon: '💼', title: '職業訓練', borderColor: '#F5A623', color: '#FFF3E0' },
  { icon: '🤝', title: '就業支持', borderColor: '#4A90D9', color: '#E8F4FD' },
  { icon: '🌈', title: '社會融合', borderColor: '#5CB85C', color: '#E8F8E8' },
] as const;

export default function ManageMissionPage() {
  const [images, setImages] = useState<MissionImages>(DEFAULT_MISSION_IMAGES);
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  // busyKey 格式："cardIdx-slotIdx"
  const [busyKey, setBusyKey] = useState<string | null>(null);

  // 每個 card 的 3 個 input ref（共 9 個）
  const fileInputRefs = [
    [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)],
    [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)],
    [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)],
  ];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MISSION_IMAGES_STORAGE_KEY);
      const parsed = parseStoredMissionImages(raw);
      if (parsed) setImages(parsed);
    } catch {
      // 無法讀取時保持空白
    }
  }, []);

  const persist = (next: MissionImages) => {
    try {
      window.localStorage.setItem(MISSION_IMAGES_STORAGE_KEY, JSON.stringify(next));
      setImages(next);
      setSaveMsg({ type: 'ok', text: '已儲存！官網首頁使命區塊會立即反映（同一瀏覽器）。' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '儲存失敗';
      setSaveMsg({ type: 'err', text: `${msg}。照片可能太多或太大，請移除部分後再試。` });
    }
  };

  const handleFileChange = async (cardIdx: number, slotIdx: number, file: File | null) => {
    if (!file) return;
    const key = `${cardIdx}-${slotIdx}`;
    setBusyKey(key);
    setSaveMsg(null);
    try {
      const dataUrl = await compressImageToJpegDataUrl(file);
      const next: MissionImages = images.map((card) => [...card]) as MissionImages;
      next[cardIdx][slotIdx] = dataUrl;
      persist(next);
    } catch (e) {
      setSaveMsg({ type: 'err', text: e instanceof Error ? e.message : '壓縮失敗，請換張圖片。' });
    } finally {
      setBusyKey(null);
    }
  };

  const handleRemove = (cardIdx: number, slotIdx: number) => {
    const label = `「${MISSION_META[cardIdx].title}」第 ${slotIdx + 1} 張`;
    if (!window.confirm(`確定要移除 ${label} 照片？`)) return;
    const next: MissionImages = images.map((card) => [...card]) as MissionImages;
    next[cardIdx][slotIdx] = undefined;
    persist(next);
  };

  return (
    <div style={{ background: '#FAFAF7', minHeight: '60vh' }}>

      {/* 頁首 */}
      <section className="py-12 text-center border-b border-gray-200 bg-white">
        <div className="container-site">
          <p className="text-xs font-bold tracking-wider text-orange-600 mb-2">協會內部使用</p>
          <h1
            className="text-2xl sm:text-3xl font-black text-gray-900 mb-3"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            使命照片編輯
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-4">
            三張使命卡片各可上傳最多 <strong>3 張</strong>活動照片（共 9 格），首頁會自動輪播。
            上傳後照片取代 Emoji 圖示，讓訪客看到機構真實面貌。
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Link href="/" className="btn-secondary text-sm py-2 px-4">
              返回官網首頁
            </Link>
          </div>
          <AdminSessionActions />
        </div>
      </section>

      {/* 儲存訊息 */}
      {saveMsg && (
        <div className="container-site pt-6">
          <div
            className={`rounded-xl px-5 py-3 text-sm font-medium ${
              saveMsg.type === 'ok'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {saveMsg.type === 'ok' ? '✅ ' : '⚠️ '}
            {saveMsg.text}
          </div>
        </div>
      )}

      {/* 三大使命卡片 */}
      <div className="container-site py-10 flex flex-col gap-10">
        {MISSION_META.map((m, cardIdx) => (
          <div
            key={cardIdx}
            className="rounded-2xl overflow-hidden"
            style={{
              border: `2px solid ${m.borderColor}33`,
              boxShadow: `0 4px 20px ${m.borderColor}12`,
            }}
          >
            {/* 卡片標題列 */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{ background: `${m.borderColor}18` }}
            >
              <span className="text-2xl">{m.icon}</span>
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif", color: '#2D2D2D' }}
              >
                {m.title}
              </h2>
              <span className="ml-auto text-xs text-gray-400">
                已上傳 {images[cardIdx].filter(Boolean).length} / 3 張
              </span>
            </div>

            {/* 三格照片上傳區 */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5"
              style={{ background: m.color }}
            >
              {([0, 1, 2] as const).map((slotIdx) => {
                const photo = images[cardIdx][slotIdx];
                const key = `${cardIdx}-${slotIdx}`;
                const isBusy = busyKey === key;

                return (
                  <div
                    key={slotIdx}
                    className="rounded-xl overflow-hidden flex flex-col"
                    style={{
                      border: `1.5px dashed ${m.borderColor}66`,
                      background: 'white',
                    }}
                  >
                    {/* 照片預覽 */}
                    <div
                      className="relative flex items-center justify-center"
                      style={{ height: '150px', background: `${m.borderColor}10` }}
                    >
                      {photo ? (
                        <Image
                          src={photo}
                          alt={`${m.title} 第 ${slotIdx + 1} 張`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-3xl mb-1 opacity-30">{m.icon}</div>
                          <p className="text-xs text-gray-400">第 {slotIdx + 1} 張</p>
                        </div>
                      )}
                      {isBusy && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs text-gray-500">
                          壓縮中…
                        </div>
                      )}
                    </div>

                    {/* 操作按鈕 */}
                    <div className="p-3 flex flex-col gap-2">
                      <input
                        ref={fileInputRefs[cardIdx][slotIdx]}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(cardIdx, slotIdx, e.target.files?.[0] ?? null)
                        }
                      />
                      <button
                        type="button"
                        disabled={!!busyKey}
                        onClick={() => fileInputRefs[cardIdx][slotIdx].current?.click()}
                        className="w-full py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity"
                        style={{
                          background: m.borderColor,
                          opacity: busyKey ? 0.5 : 1,
                        }}
                      >
                        {photo ? '重新上傳' : '上傳照片'}
                      </button>
                      {photo && (
                        <button
                          type="button"
                          disabled={!!busyKey}
                          onClick={() => handleRemove(cardIdx, slotIdx)}
                          className="w-full py-1.5 rounded-lg text-xs font-semibold border border-red-300 text-red-500 bg-white hover:bg-red-50"
                        >
                          移除
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p className="text-center text-xs text-gray-400 pb-4">
          建議橫幅比例（4:3 或 16:9），大小不超過 5MB，系統會自動壓縮。多張照片會在首頁自動輪播。
        </p>
      </div>
    </div>
  );
}
