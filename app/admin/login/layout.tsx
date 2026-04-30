import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '管理員登入',
  description: '協會後台登入（活動剪影、公益商品、最新消息編輯）。僅限已授權人員使用。',
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
