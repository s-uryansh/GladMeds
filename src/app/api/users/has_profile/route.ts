// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import jwt from 'jsonwebtoken';

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get('token')?.value;
//     if (!token) return NextResponse.json({ hasProfile: false });

//     const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
//     const userId = payload.id;

//     const [rows] = await db.query('SELECT id FROM user_profiles WHERE user_id = ?', [userId]);
//     const hasProfile = (rows as any[]).length > 0;

//     return NextResponse.json({ hasProfile });
//   } catch (error) {
//     return NextResponse.json({ hasProfile: false });
//   }
// }
// src/app/api/user/has-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/db';
import UserProfile from '@/lib/models/UsersProfile';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ hasProfile: false });

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = payload.id;
    await dbConnect();
    const profile = await UserProfile.findOne({ user_id: userId });
    return NextResponse.json({ hasProfile: !!profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ hasProfile: false });
  }
}
