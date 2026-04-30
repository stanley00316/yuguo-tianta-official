import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '活動剪影編輯',
  robots: { index: false, follow: false },
};

export default function GalleryManageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
