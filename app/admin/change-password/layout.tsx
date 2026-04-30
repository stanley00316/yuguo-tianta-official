import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '變更管理密碼',
  description: '管理員變更後台登入密碼（須已登入）。',
  robots: { index: false, follow: false },
};

export default function AdminChangePasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
