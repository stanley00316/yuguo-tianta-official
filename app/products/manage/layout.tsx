import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '公益商品編輯',
  robots: { index: false, follow: false },
};

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
