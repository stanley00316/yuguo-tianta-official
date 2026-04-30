import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';

// 未登入者進入後台會被帶到登入頁，並保留原本要去的網址
export async function middleware(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);

  if (!secret) {
    loginUrl.searchParams.set('reason', 'config');
    return NextResponse.redirect(loginUrl);
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !(await verifySessionToken(token, secret))) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/gallery/manage',
    '/gallery/manage/:path*',
    '/products/manage',
    '/products/manage/:path*',
    '/news/manage',
    '/news/manage/:path*',
    '/contact/manage',
    '/contact/manage/:path*',
    '/admin/change-password',
    '/admin/change-password/:path*',
  ],
};
