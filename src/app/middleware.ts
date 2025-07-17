import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Handle Google OAuth callback
  if (url.pathname.startsWith('/api/auth/callback/google')) {
    console.log('Google callback intercepted:', url.pathname);
    // Let NextAuth handle the callback naturally
    return NextResponse.next();
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/auth/callback/:path*'], 
};
