'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { safeRedirectPathForLogin } from '@/lib/admin-login-redirect';

// 管理員輸入密碼、通過後導向活動剪影或公益商品後台
export default function LoginForm() {
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get('next');
  const reason = searchParams.get('reason');
  const nextTarget = useMemo(() => safeRedirectPathForLogin(nextRaw), [nextRaw]);

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    reason === 'config' ? '伺服器尚未設定管理登入（環境變數），請聯絡技術人員。' : null
  );
  const [loading, setLoading] = useState(false);

  // 這裡是送出密碼、向伺服器換取受保護 Cookie
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || '登入失敗。');
        setLoading(false);
        return;
      }
      // 這裡是登入成功後整頁導向後台（讓 Cookie 立刻生效）
      window.location.href = nextTarget;
    } catch {
      setError('網路錯誤，請稍後再試。');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh]" style={{ background: 'var(--color-bg)' }}>
      {/* 頂部說明區：與聯絡我們等內頁一致的柔和漸層 Banner */}
      <section
        className="relative py-12 sm:py-14 text-center overflow-hidden border-b border-[var(--color-border)]"
        style={{
          background:
            'linear-gradient(145deg, #FFF4E6 0%, #FFF9F0 35%, #EDF6FF 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 80% 20%, #F5A623 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 80%, #4A90D9 0%, transparent 50%)',
          }}
          aria-hidden
        />
        <div className="container-site relative z-10 px-4 max-w-lg mx-auto">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-sm"
            style={{ background: 'rgba(245, 166, 35, 0.18)', color: '#B45309' }}
          >
            <span className="inline-block size-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
            協會內部使用
          </span>
          <div className="flex justify-center mb-4">
            <div
              className="relative size-[88px] sm:size-[100px] rounded-2xl overflow-hidden shadow-[var(--shadow-md)] ring-2 ring-white/80"
              style={{ background: 'var(--color-card-bg)' }}
            >
              <Image
                src="/images/logo.jpg"
                alt="瑀過天泰關懷協會"
                fill
                className="object-cover"
                sizes="100px"
                priority
              />
            </div>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            管理員登入
          </h1>
          <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed max-w-md mx-auto">
            通過驗證後可進入後台編輯活動剪影、公益商品與最新消息；登入後可在任一後台點選「變更管理密碼」更新登入密碼。請勿與他人共用密碼，並於公用電腦使用後登出。
          </p>
        </div>
      </section>

      {/* 表單主區：卡片式版面，較符合全站質感 */}
      <section className="py-10 sm:py-12 pb-16">
        <div className="container-site max-w-md mx-auto px-4">
          <div
            className="rounded-2xl bg-white px-6 py-8 sm:px-8 sm:py-9"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div
              className="h-1 rounded-full mb-8 -mx-2 sm:-mx-3 opacity-95"
              style={{
                background: 'linear-gradient(90deg, #E84040, #F5A623, #5CB85C, #4A90D9)',
              }}
              aria-hidden
            />

            <form onSubmit={onSubmit} className="space-y-5 text-left">
              <div>
                <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  管理密碼
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
                  placeholder="請輸入密碼"
                  disabled={loading || reason === 'config'}
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'admin-login-error' : undefined}
                />
              </div>

              {/* 將伺服器或網路錯誤顯示在表單上，並供螢幕報讀器朗讀 */}
              {error && (
                <p
                  id="admin-login-error"
                  role="alert"
                  className="text-sm font-medium text-red-800 bg-red-50 border border-red-200/80 rounded-xl px-3.5 py-2.5"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full justify-center py-3.5 text-base font-semibold disabled:opacity-60 disabled:pointer-events-none"
                disabled={loading || reason === 'config'}
              >
                {loading ? '驗證中…' : '安全登入'}
              </button>
            </form>

            {reason === 'config' && (
              <p className="mt-5 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-5">
                若您是網站管理員：請在部署環境設定 <span className="font-mono text-[11px]">ADMIN_PASSWORD</span> 與{' '}
                <span className="font-mono text-[11px]">ADMIN_SESSION_SECRET</span>（可參考專案內{' '}
                <code className="text-[11px] bg-gray-100 px-1 rounded">.env.example</code>）。
              </p>
            )}
          </div>

          <nav
            className="mt-8 flex flex-col sm:flex-row flex-wrap gap-x-5 gap-y-2 justify-center items-center text-sm text-center"
            aria-label="離開登入頁或前往公開頁"
          >
            <Link href="/" className="font-semibold hover:underline" style={{ color: 'var(--color-secondary)' }}>
              返回首頁
            </Link>
            <span className="hidden sm:inline text-gray-300 select-none">|</span>
            <Link href="/gallery" className="text-gray-600 hover:text-gray-900 hover:underline">
              活動剪影
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-gray-900 hover:underline">
              公益商品
            </Link>
            <Link href="/news" className="text-gray-600 hover:text-gray-900 hover:underline">
              最新消息
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
