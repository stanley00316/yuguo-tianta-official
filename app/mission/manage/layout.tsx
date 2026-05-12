import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '使命照片編輯',
  robots: { index: false, follow: false },
};

export default function MissionManageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
