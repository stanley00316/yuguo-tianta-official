import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '首頁背景編輯',
  robots: { index: false, follow: false },
};

export default function HeroManageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
