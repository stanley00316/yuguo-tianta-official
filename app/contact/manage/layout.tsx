import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '聯絡留言收件匣',
  robots: { index: false, follow: false },
};

export default function ContactManageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
