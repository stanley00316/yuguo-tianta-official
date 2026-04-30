'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { compressImageToJpegDataUrl } from '@/lib/image-compress';
import {
  DEFAULT_HERO_LOGO_PATH,
  HERO_LOGO_STORAGE_KEY,
  HERO_LOGO_SYNC_EVENT,
  type HeroLogoStored,
  clampHeroFrameScale,
  serializeHeroLogoStored,
} from '@/lib/hero-logo-settings';

type Props = {
  open: boolean;
  onClose: () => void;
  initial: HeroLogoStored;
  onSaved: (next: HeroLogoStored) => void;
};

// 管理員首頁 Hero：上傳 LOGO、調整圓框比例（寫入 localStorage）
export default function HeroLogoEditorModal({ open, onClose, initial, onSaved }: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(initial.imageSrc);
  const [frameScale, setFrameScale] = useState(initial.frameScale);
  const [imageError, setImageError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 每次打開時與父層最新設定對齊
  useEffect(() => {
    if (open) {
      setImageSrc(initial.imageSrc);
      setFrameScale(initial.frameScale);
      setImageError(null);
    }
  }, [open, initial.imageSrc, initial.frameScale]);

  // 按 ESC 關閉對話框
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('請選擇圖片檔（JPG／PNG／WebP）。');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setImageError('檔案過大，請選 12MB 以下的圖片。');
      return;
    }
    setImageError(null);
    setBusy(true);
    try {
      const dataUrl = await compressImageToJpegDataUrl(file);
      setImageSrc(dataUrl);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : '圖片處理失敗');
    } finally {
      setBusy(false);
    }
  };

  const resetDefaultImage = () => {
    setImageSrc(null);
    setImageError(null);
  };

  const save = useCallback(() => {
    const next: HeroLogoStored = {
      imageSrc,
      frameScale: clampHeroFrameScale(frameScale),
    };
    try {
      localStorage.setItem(HERO_LOGO_STORAGE_KEY, serializeHeroLogoStored(next));
      window.dispatchEvent(new Event(HERO_LOGO_SYNC_EVENT));
      onSaved(next);
      onClose();
    } catch {
      setImageError('儲存失敗（可能超過瀏覽器配額），請換較小圖片或清除部分資料。');
    }
  }, [imageSrc, frameScale, onSaved, onClose]);

  if (!open) return null;

  const previewSrc = imageSrc ?? DEFAULT_HERO_LOGO_PATH;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 這裡是編輯 LOGO 的浮層（不導頁） */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 space-y-4">
          <h2 id={titleId} className="text-lg font-bold text-gray-900">
            編輯首頁大圖 LOGO
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            設定與公益商品後台相同，會存在<strong>這台瀏覽器</strong>；訪客若要看到相同圖，需以正式環境之伺服器儲存方案為準（可再請技術人員擴充）。
          </p>

          <div>
            <label className="form-label">更換圖檔</label>
            <div className="flex flex-wrap items-center gap-2">
              <label className="btn-secondary text-sm py-2 px-4 cursor-pointer">
                {busy ? '處理中…' : '選擇圖片'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={busy}
                  onChange={handleFile}
                />
              </label>
              <button type="button" className="text-sm text-gray-600 underline" onClick={resetDefaultImage}>
                恢復預設圖檔
              </button>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="hero-logo-scale">
              圓框大小：{Math.round(frameScale * 100)}%（75%～140%）
            </label>
            <input
              id="hero-logo-scale"
              type="range"
              min={0.75}
              max={1.4}
              step={0.05}
              value={frameScale}
              onChange={(e) => setFrameScale(clampHeroFrameScale(Number(e.target.value)))}
              className="w-full accent-orange-500"
            />
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 mb-2">預覽</p>
            <div className="flex justify-center py-2">
              <div
                className="rounded-full overflow-hidden border-4 border-white shadow-md"
                style={{
                  width: `${8 * frameScale}rem`,
                  height: `${8 * frameScale}rem`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="" className="w-full h-full object-fill" />
              </div>
            </div>
          </div>

          {imageError && <p className="text-sm text-red-600">{imageError}</p>}

          <div className="flex flex-wrap gap-3 justify-end pt-2">
            <button type="button" className="btn-secondary text-sm py-2 px-4" onClick={onClose}>
              取消
            </button>
            <button type="button" className="btn-primary text-sm py-2 px-4" onClick={save}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
