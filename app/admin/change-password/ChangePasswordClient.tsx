'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Props {
  storageMode: 'redis' | 'file';
}

// 已登入管理員在此輸入目前密碼與新密碼並送出更新
export default function ChangePasswordClient({ storageMode }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || '變更失敗，請稍後再試。');
        setLoading(false);
        return;
      }
      setDone(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setError('網路錯誤，請稍後再試。');
    }
    setLoading(false);
  }

  return (
    <div style={{ background: '#FAFAF7', minHeight: '55vh' }}>
      <section className="relative py-12 border-b border-gray-200 bg-white">
        <div className="container-site max-w-lg mx-auto px-4 text-center">
          <p className="text-xs font-bold tracking-wider text-orange-600 mb-2">協會內部使用</p>
          <h1
            className="text-2xl sm:text-3xl font-black text-gray-900 mb-2"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            變更管理密碼
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            成功後請以<strong>新密碼</strong>重新登入。其他瀏覽器若仍保持登入狀態，可於過期後自動失效或手動登出。
          </p>

          <div className="text-left rounded-2xl bg-white px-6 py-7 border border-gray-100 shadow-[var(--shadow-card)] mb-8">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              {storageMode === 'redis'
                ? '密碼雜湊儲於 Upstash Redis（適合無硬碟環境）。'
                : '密碼雜湊儲於伺服器資料夾 data／admin-password.json（請勿將此檔提交到 Git）。'}
            </p>
            <Link href="/gallery/manage" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-secondary)' }}>
              返回活動剪影編輯
            </Link>
          </div>

          {done && (
            <p role="status" className="mb-6 text-sm font-medium text-green-800 bg-green-50 border border-green-200 rounded-xl px-3.5 py-2.5">
              已成功變更密碼。建議到其他分頁測試新密碼登入是否正常。
            </p>
          )}

          <form onSubmit={onSubmit} className="text-left space-y-5 max-w-md mx-auto">
            <div>
              <label htmlFor="cur-pw" className="block text-sm font-semibold text-gray-800 mb-1.5">
                目前密碼
              </label>
              <input
                id="cur-pw"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(ev) => setCurrentPassword(ev.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label htmlFor="new-pw" className="block text-sm font-semibold text-gray-800 mb-1.5">
                新密碼（至少 10 字元）
              </label>
              <input
                id="new-pw"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(ev) => setNewPassword(ev.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                disabled={loading}
                required
                minLength={10}
              />
            </div>
            <div>
              <label htmlFor="cf-pw" className="block text-sm font-semibold text-gray-800 mb-1.5">
                確認新密碼
              </label>
              <input
                id="cf-pw"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                disabled={loading}
                required
                minLength={10}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-red-800 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
              {loading ? '儲存中…' : '更新密碼'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
