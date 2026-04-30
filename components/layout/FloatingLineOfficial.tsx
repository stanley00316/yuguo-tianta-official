// 全站右下角浮動按鈕：開啟 LINE 官方帳號加好友頁（連結由 site-contact 統一維護）

import { SITE_LINE_OFFICIAL_ID, SITE_LINE_OFFICIAL_URL } from '@/lib/site-contact';

export default function FloatingLineOfficial() {
  return (
    <a
      href={SITE_LINE_OFFICIAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`開啟 LINE 官方帳號 ${SITE_LINE_OFFICIAL_ID}`}
      title={`LINE 官方 ${SITE_LINE_OFFICIAL_ID}`}
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#06C755] text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-[#05b34c] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06C755] motion-reduce:transition-none motion-reduce:hover:scale-100"
      style={{
        bottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))',
        right: 'max(1.25rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H6.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.142h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572 5.385.572 0 4.943 0 10.314c0 4.867 4.11 8.938 9.645 9.79.375.078.89.24 1.02.55.12.299.079.766.038 1.08l-.001.02c-.042.34-.239 1.144-.239 1.144s0 .019.011.032c.02.017.042.012.042.012.142-.02 1.23-.792 1.41-.928.17-.13.65-.84.65-.84.013 0 .258.149.29.165.33.165.77.265 1.23.265.63 0 1.208-.17 1.708-.465 2.35-1.35 3.798-3.925 3.798-6.655z" />
      </svg>
    </a>
  );
}
