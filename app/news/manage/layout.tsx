import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '最新消息編輯',
  robots: { index: false, follow: false },
};

export default function NewsManageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
