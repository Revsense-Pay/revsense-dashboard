import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Example cookies (you'll refine this later)
  const isLoggedIn = request.cookies.get('session')?.value;
  const onboardingComplete = request.cookies.get('onboardingComplete')?.value;

  // Public routes
  if (pathname.startsWith('/onboarding')) {
    return NextResponse.next();
  }

  // Root URL → onboarding
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/onboarding/start', request.url));
  }

  // Protect dashboard
  if (pathname.startsWith('/dashboards')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/onboarding/start', request.url));
    }

    if (!onboardingComplete) {
      return NextResponse.redirect(new URL('/onboarding/business', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboards/:path*'],
};