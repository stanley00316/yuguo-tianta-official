import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';
import { safeRedirectPathForLogin } from '@/lib/admin-login-redirect';
import { hasUsableAdminCredential } from '@/lib/admin-password-store';
import LoginForm from './LoginForm';

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

// 管理員登入頁：若 Cookie 仍有效則直接導向 next（或安全預設），不必再看表單
export default async function AdminLoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  // 這裡是判斷「後台是否真的可登入」：環境不完整時直接鎖表單，避免畫面上可輸入但 API 一直回 503
  let blockedReason: 'secret' | 'credential' | null = null;
  if (!secret) blockedReason = 'secret';
  else if (!(await hasUsableAdminCredential())) blockedReason = 'credential';

  if (secret) {
    const jar = await cookies();
    const token = jar.get(ADMIN_COOKIE_NAME)?.value;
    if (token && (await verifySessionToken(token, secret))) {
      redirect(safeRedirectPathForLogin(sp.next ?? null));
    }
  }

  return (
    <Suspense
      fallback={
        <div className="container-site py-20 text-center text-gray-600" style={{ background: '#FAFAF7' }}>
          載入中…
        </div>
      }
    >
      <LoginForm blockedReason={blockedReason} />
    </Suspense>
  );
}
