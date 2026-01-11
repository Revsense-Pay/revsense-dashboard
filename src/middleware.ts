import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  console.log('MIDDLEWARE PATH:', pathname)

  // ✅ Never block API routes or Next internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // 🚪 Not logged in → redirect to signup (except auth pages)
  if (!token) {
    if (!pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/auth/signup', req.url))
    }
    return NextResponse.next()
  }

  // 🔐 Admin-only routes (ONLY /usage)
  if (pathname.startsWith('/usage') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/no-access', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}