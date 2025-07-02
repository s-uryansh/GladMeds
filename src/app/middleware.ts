// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (url.pathname === '/api/auth/callback/google') {
    return NextResponse.redirect(new URL('/post-login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/api/auth/callback/google'], 
};
