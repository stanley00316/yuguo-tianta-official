'use client';

// 一般頁面錯誤時顯示（仍使用根版面之 Header／Footer）
export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-site py-20 text-center max-w-lg mx-auto px-4">
      <h1 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
        發生錯誤
      </h1>
      <p className="text-gray-600 mb-8 text-sm leading-relaxed">
        頁面載入時發生問題，請重整或稍後再試。
      </p>
      <button type="button" className="btn-primary" onClick={() => reset()}>
        再試一次
      </button>
    </div>
  );
}
