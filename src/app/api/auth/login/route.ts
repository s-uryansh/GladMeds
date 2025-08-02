// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export async function POST(req: NextRequest) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
//     }

//     const [rows] = await db.query('SELECT id, email, password_hash, full_name FROM users WHERE email = ?', [email]);
//     const user = (rows as any[])[0];

//     if (!user) {
//       return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
//     }

//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email, name: user.full_name },
//       process.env.JWT_SECRET!,
//       { expiresIn: '7d' }
//     );

//     const response = NextResponse.json({ 
//       message: 'Login successful', 
//       user: { 
//         id: user.id, 
//         email: user.email, 
//         name: user.full_name 
//       } 
//     });
//     response.cookies.set('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7,
//       sameSite: 'lax',
//     });

//     return response;
//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/db';
import Users from '@/lib/models/Users';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    await dbConnect();

    // Find user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.full_name },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Send response with cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.full_name,
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
