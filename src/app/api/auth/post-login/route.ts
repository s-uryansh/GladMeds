import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session.user.id) {
      console.error('Invalid session:', session);
      return NextResponse.redirect(new URL('/auth/error?message=session-failed', req.url));
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.redirect(new URL('/auth/error?message=server-error', req.url));
    }

    const token = jwt.sign(
      { 
        id: session.user.id, 
        email: session.user.email,
        name: session.user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    const redirectUrl = new URL('/profile', req.url); 
    
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('Post-login error:', error);
    return NextResponse.redirect(new URL('/auth/error?message=server-error', req.url));
  }
}