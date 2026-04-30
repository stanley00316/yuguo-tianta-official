'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAdminSession } from '@/hooks/useAdminSession';

// 導覽選單項目定義
const navItems = [
  { href: '/', label: '首頁' },
  { href: '/about', label: '關於我們' },
  { href: '/products', label: '公益商品' },
  { href: '/gallery', label: '活動剪影' },
  { href: '/news', label: '最新消息' },
  { href: '/contact', label: '聯絡我們' },
];

export default function Header() {
  const pathname = usePathname();
  // 控制手機選單開關
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 控制 scroll 後導覽列加上陰影效果
  const [scrolled, setScrolled] = useState(false);
  // 已登入管理員且站内有未讀留言時，顯示 Logo／標題旁紅點
  const [hasNewContact, setHasNewContact] = useState(false);
  const { isAdmin } = useAdminSession();

  // 管理者登入連結的 next 參數：在登入頁本身則改帶後台預設，避免網址循環
  const mobileLoginNext = useMemo(() => {
    if (pathname.startsWith('/admin')) return '/gallery/manage';
    return pathname || '/';
  }, [pathname]);

  // 向後端問「是否有新留言」（未登入會回 401，畫面上不顯示紅點）
  const refreshContactBadge = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/contact-inbox-badge', { cache: 'no-store' });
      if (!res.ok) {
        setHasNewContact(false);
        return;
      }
      const data = (await res.json()) as { ok?: boolean; hasNew?: boolean };
      setHasNewContact(Boolean(data.ok && data.hasNew));
    } catch {
      setHasNewContact(false);
    }
  }, []);

  useEffect(() => {
    void refreshContactBadge();
  }, [pathname, refreshContactBadge]);

  useEffect(() => {
    const id = window.setInterval(() => void refreshContactBadge(), 45_000);
    return () => window.clearInterval(id);
  }, [refreshContactBadge]);

  useEffect(() => {
    const onSeen = () => void refreshContactBadge();
    window.addEventListener('yuguo-contact-inbox-seen', onSeen);
    return () => window.removeEventListener('yuguo-contact-inbox-seen', onSeen);
  }, [refreshContactBadge]);

  // 監聽滾動事件，超過 60px 就加陰影
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 切換頁面時自動關閉手機選單
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 彩虹頂部裝飾線 */}
      <div className="rainbow-top-bar" />

      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-18 py-3">

            {/* Logo 區域 */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="瑀過天泰關懷協會 Logo"
                  fill
                  className="object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                {hasNewContact ? (
                  <span
                    className="sm:hidden absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#E84040] ring-2 ring-white"
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <div
                    className="font-extrabold text-lg leading-tight"
                    style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif", color: '#2D2D2D' }}
                  >
                    瑀過天泰關懷協會
                  </div>
                  {hasNewContact ? (
                    <span
                      className="inline-flex shrink-0 w-2 h-2 rounded-full bg-[#E84040]"
                      title="有新留言待查看"
                      aria-label="有新留言待查看"
                      role="status"
                    />
                  ) : null}
                </div>
              </div>
            </Link>

            {/* 桌面版導覽選單 */}
            <nav className="hidden lg:flex items-center gap-7">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link text-sm ${
                    pathname === item.href ? 'active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {/* 捐款/支持 CTA 按鈕 */}
              <Link href="/contact" className="btn-primary text-sm py-2 px-5">
                支持我們
              </Link>
              {isAdmin ? (
                <Link
                  href="/gallery/manage"
                  className="nav-link text-sm"
                  style={{ color: '#4A90D9' }}
                >
                  管理者登入
                </Link>
              ) : (
                <Link
                  href={`/admin/login?next=${encodeURIComponent(mobileLoginNext)}`}
                  className="nav-link text-sm text-gray-600"
                >
                  管理者登入
                </Link>
              )}
            </nav>

            {/* 手機版：管理者登入 + 漢堡選單（並列於右側） */}
            <div className="lg:hidden flex items-center gap-0.5 sm:gap-1 shrink-0">
              {isAdmin ? (
                <Link
                  href="/gallery/manage"
                  className="text-xs sm:text-sm font-semibold px-2 py-1.5 rounded-lg transition-colors hover:bg-gray-100"
                  style={{ color: '#4A90D9' }}
                >
                  管理者登入
                </Link>
              ) : (
                <Link
                  href={`/admin/login?next=${encodeURIComponent(mobileLoginNext)}`}
                  className="text-xs sm:text-sm font-semibold px-2 py-1.5 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
                >
                  管理者登入
                </Link>
              )}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex flex-col gap-1.5 p-2 rounded-lg transition-colors hover:bg-gray-100"
                aria-label={mobileMenuOpen ? '關閉選單' : '開啟選單'}
              >
                <span
                  className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* 手機版展開選單 */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'
          }`}
        >
          <nav className="container-site py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-xl font-semibold text-base transition-colors ${
                  pathname === item.href
                    ? 'bg-orange-50 text-orange-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link href="/contact" className="btn-primary w-full justify-center text-sm">
                支持我們
              </Link>
            </div>
          </nav>
        </div>

      </header>
    </>
  );
}
