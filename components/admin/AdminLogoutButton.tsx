'use client';

import { useState } from 'react';

// 呼叫 API 清除 Cookie 並回到登入頁
export default function AdminLogoutButton() {
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      className="text-sm font-semibold py-2 px-4 rounded-full border border-gray-400 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      onClick={handleLogout}
    >
      {busy ? '登出中…' : '登出'}
    </button>
  );
}
