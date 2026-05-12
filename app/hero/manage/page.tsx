'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import AdminSessionActions from '@/components/admin/AdminSessionActions';
import { compressImageToJpegDataUrl } from '@/lib/image-compress';

type HeroBackgroundAdminResponse = {
  ok?: boolean;
  item?: {
    hasCustom: boolean;
    updatedAt: string | null;
  };
  imageUrl?: string | null;
  storageMode?: 'redis' | 'file';
  canPersist?: boolean;
  blockedMessage?: string | null;
  error?: string;
};

type ViewState = {
  hasCustom: boolean;
  updatedAt: string | null;
  imageUrl: string | null;
  storageMode: 'redis' | 'file';
  canPersist: boolean;
  blockedMessage: string | null;
};

const DEFAULT_STATE: ViewState = {
  hasCustom: false,
  updatedAt: null,
  imageUrl: null,
  storageMode: 'file',
  canPersist: true,
  blockedMessage: null,
};

function formatUpdatedAt(value: string | null): string {
  if (!value) return '尚未上傳自訂背景';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '上傳時間不明';
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function parseAdminResponse(data: HeroBackgroundAdminResponse): ViewState {
  return {
    hasCustom: Boolean(data.item?.hasCustom),
    updatedAt: data.item?.updatedAt ?? null,
    imageUrl: data.imageUrl ?? null,
    storageMode: data.storageMode === 'redis' ? 'redis' : 'file',
    canPersist: data.canPersist !== false,
    blockedMessage: data.blockedMessage ?? null,
  };
}

export default function ManageHeroBackgroundPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<ViewState>(DEFAULT_STATE);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const previewSrc = previewDataUrl ?? view.imageUrl;

  // 進入頁面時讀取目前全站共用背景，讓管理員知道訪客正在看到哪一張圖。
  useEffect(() => {
    let alive = true;
    async function loadCurrent() {
      setBusy(true);
      setMessage(null);
      try {
        const res = await fetch('/api/admin/hero-background', { cache: 'no-store' });
        const data = (await res.json()) as HeroBackgroundAdminResponse;
        if (!alive) return;
        if (!res.ok || !data.ok) {
          setMessage({ type: 'err', text: data.error ?? '讀取首頁背景設定失敗。' });
          return;
        }
        setView(parseAdminResponse(data));
      } catch {
        if (alive) setMessage({ type: 'err', text: '讀取首頁背景設定失敗，請稍後再試。' });
      } finally {
        if (alive) setBusy(false);
      }
    }

    void loadCurrent();
    return () => {
      alive = false;
    };
  }, []);

  async function handleFileChange(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'err', text: '請選擇圖片檔（JPG、PNG 或 WebP）。' });
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setMessage({ type: 'err', text: '檔案過大，請選 12MB 以下的圖片。' });
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      // 先在瀏覽器把照片壓小，再送到伺服器，避免正式網站載入變慢。
      const imageDataUrl = await compressImageToJpegDataUrl(file, {
        maxSide: 1800,
        quality: 0.84,
      });
      setPreviewDataUrl(imageDataUrl);

      const res = await fetch('/api/admin/hero-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl }),
      });
      const data = (await res.json()) as HeroBackgroundAdminResponse;
      if (!res.ok || !data.ok) {
        setMessage({ type: 'err', text: data.error ?? '儲存首頁背景圖失敗。' });
        return;
      }
      setView(parseAdminResponse(data));
      setPreviewDataUrl(null);
      setMessage({ type: 'ok', text: '已儲存，所有訪客重新整理首頁後都會看到新的背景圖。' });
    } catch (err) {
      setMessage({
        type: 'err',
        text: err instanceof Error ? err.message : '圖片處理失敗，請換一張圖片再試。',
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    if (!view.hasCustom) return;
    if (!window.confirm('確定要移除目前首頁背景圖，改回內建溫馨背景嗎？')) return;

    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/hero-background', { method: 'DELETE' });
      const data = (await res.json()) as HeroBackgroundAdminResponse;
      if (!res.ok || !data.ok) {
        setMessage({ type: 'err', text: data.error ?? '移除首頁背景圖失敗。' });
        return;
      }
      setView(parseAdminResponse(data));
      setPreviewDataUrl(null);
      setMessage({ type: 'ok', text: '已移除自訂背景，首頁會回到內建溫馨背景。' });
    } catch {
      setMessage({ type: 'err', text: '移除首頁背景圖失敗，請稍後再試。' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: '#FAFAF7', minHeight: '60vh' }}>
      <section className="py-12 text-center border-b border-gray-200 bg-white">
        <div className="container-site">
          <p className="text-xs font-bold tracking-wider text-orange-600 mb-2">協會內部使用</p>
          <h1
            className="text-2xl sm:text-3xl font-black text-gray-900 mb-3"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            首頁背景編輯
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-4">
            上傳一張溫暖、明亮、能呈現陪伴感的橫幅照片。儲存後，正式網站所有訪客都會看到同一張首頁背景。
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Link href="/" className="btn-secondary text-sm py-2 px-4">
              返回官網首頁
            </Link>
          </div>
          <AdminSessionActions />
        </div>
      </section>

      {message && (
        <div className="container-site pt-6">
          <div
            className={`rounded-xl px-5 py-3 text-sm font-medium ${
              message.type === 'ok'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      {view.blockedMessage && (
        <div className="container-site pt-6">
          <div className="rounded-xl px-5 py-4 text-sm leading-relaxed bg-amber-50 text-amber-800 border border-amber-200">
            {view.blockedMessage}
          </div>
        </div>
      )}

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
            <div
              className="relative min-h-[260px] sm:min-h-[360px] flex items-end"
              style={{
                background: previewSrc
                  ? `linear-gradient(90deg, rgba(80, 47, 24, 0.52), rgba(80, 47, 24, 0.12)), url("${previewSrc}")`
                  : 'linear-gradient(135deg, #F4C16D 0%, #8FCB8C 48%, #80B6D8 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute top-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 88" className="w-full h-16 sm:h-20" preserveAspectRatio="none" aria-hidden>
                  <path d="M0 0 H1440 V30 C1120 88 300 88 0 30 Z" fill="white" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 96" className="w-full h-20 sm:h-24" preserveAspectRatio="none" aria-hidden>
                  <path d="M0 56 C300 92 445 20 640 48 C850 78 980 24 1180 44 C1320 58 1390 48 1440 34 V96 H0 Z" fill="white" />
                </svg>
              </div>
              <div className="relative z-10 p-6 sm:p-8 text-white max-w-lg">
                <p className="text-xs font-bold tracking-wider mb-2">首頁預覽</p>
                <p className="text-2xl sm:text-3xl font-black leading-tight drop-shadow">
                  以陪伴為起點，看見每一段成長的價值。
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">背景設定</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-gray-500">目前狀態</dt>
                <dd className="text-gray-900">{view.hasCustom ? '使用自訂背景圖' : '使用內建溫馨背景'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-500">更新時間</dt>
                <dd className="text-gray-900">{formatUpdatedAt(view.updatedAt)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-500">儲存位置</dt>
                <dd className="text-gray-900">
                  {view.storageMode === 'redis' ? 'Upstash Redis（正式站共用）' : '伺服器 data 資料夾'}
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  e.target.value = '';
                  void handleFileChange(file);
                }}
              />
              <button
                type="button"
                className="btn-primary w-full justify-center text-sm py-2.5 px-4 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={busy || !view.canPersist}
                onClick={() => fileInputRef.current?.click()}
              >
                {busy ? '處理中...' : view.hasCustom ? '重新上傳背景圖' : '上傳背景圖'}
              </button>
              <button
                type="button"
                className="btn-secondary w-full justify-center text-sm py-2.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={busy || !view.hasCustom || !view.canPersist}
                onClick={handleRemove}
              >
                移除自訂背景
              </button>
            </div>

            <p className="mt-5 text-xs text-gray-500 leading-relaxed">
              建議使用 16:9 或更寬的橫幅照片，主體靠左或中間較適合。系統會自動壓縮圖片，並限制格式與大小，避免首頁載入變慢。
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
