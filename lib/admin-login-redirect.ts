// 登入成功後允許導向的路徑（須與 middleware 保護範圍一致，避免開放式重新導向）

export const ALLOWED_LOGIN_NEXT = [
  '/gallery/manage',
  '/products/manage',
  '/news/manage',
  '/contact/manage',
  '/admin/change-password',
] as const;

const FALLBACK_AFTER_LOGIN = '/gallery/manage';

/** 登入後或「已登入再訪登入頁」時的安全導向網址 */
export function safeRedirectPathForLogin(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return FALLBACK_AFTER_LOGIN;

  const adminOk = ALLOWED_LOGIN_NEXT.some(
    (prefix) => next === prefix || next.startsWith(`${prefix}/`)
  );
  if (adminOk) return next;

  if (next === '/') return next;
  if (next === '/about' || next.startsWith('/about/')) return next;
  if (next === '/products' || (next.startsWith('/products/') && !next.startsWith('/products/manage'))) {
    return next;
  }
  if (next === '/gallery' || (next.startsWith('/gallery/') && !next.startsWith('/gallery/manage'))) {
    return next;
  }
  if (next === '/news' || (next.startsWith('/news/') && !next.startsWith('/news/manage'))) return next;
  if (next === '/contact') return next;

  return FALLBACK_AFTER_LOGIN;
}
