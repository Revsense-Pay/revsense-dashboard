export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore Next internals & API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 🔒 Not logged in → signup
  if (!token) {
    if (!pathname.startsWith('/auth')) {
      return NextResponse.redirect(
        new URL('/auth/signup', req.url)
      );
    }
    return NextResponse.next();
  }

  // 🔐 Admin-only routes
  if (pathname.startsWith('/dashboards') ||
      pathname.startsWith('/usage') ||
      pathname.startsWith('/clients') ||
      pathname.startsWith('/transactions') ||
      pathname.startsWith('/settings')) {

    if (token?.role !== 'ADMIN') {
      return NextResponse.redirect(
        new URL('/no-access', req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};