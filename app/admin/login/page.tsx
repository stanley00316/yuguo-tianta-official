import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';
import { safeRedirectPathForLogin } from '@/lib/admin-login-redirect';
import LoginForm from './LoginForm';

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

// 管理員登入頁：若 Cookie 仍有效則直接導向 next（或安全預設），不必再看表單
export default async function AdminLoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
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
      <LoginForm />
    </Suspense>
  );
}
