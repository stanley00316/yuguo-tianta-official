'use client';

// 根版面層級錯誤（須含 html／body）
export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FAFAF7] px-4 text-center text-gray-800 antialiased">
        <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
          系統暫時無法載入
        </h1>
        <p className="text-sm text-gray-600 max-w-md leading-relaxed">請稍後再試，或聯絡網站管理員。</p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl px-5 py-2.5 font-semibold text-white"
          style={{ background: '#F5A623' }}
        >
          再試一次
        </button>
      </body>
    </html>
  );
}
