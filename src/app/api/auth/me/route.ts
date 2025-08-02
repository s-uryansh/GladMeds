// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { db } from '@/lib/db';

// export const dynamic = 'force-dynamic';

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get('token')?.value;

//     if (!token) {
//       return NextResponse.json(null, { status: 401 });
//     }
    
//     let payload: any;
//     try {
//       payload = jwt.verify(token, process.env.JWT_SECRET!);
//     } catch (err) {
//       return NextResponse.json(null, { status: 403 });
//     }
//     const userId = payload.id;
//     const [rows] = await db.query('SELECT id, full_name, email FROM users WHERE id = ?', [userId]);

//     if ((rows as any[]).length === 0) {
//       return NextResponse.json(null, { status: 404 });
//     }

//     const user = (rows as any[])[0];

//     return NextResponse.json(user); 
//   } catch (err) {
//     console.error('User fetch error:', err);
//     return NextResponse.json(null, { status: 500 });
//   }
// }
// src/app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/Users';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Check for JWT cookie
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(null, { status: 401 });
    }

    // 2. Verify token
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(null, { status: 403 });
    }
    const userId = payload.id;

    // 3. Connect to MongoDB
    await dbConnect();

    // 4. Fetch user document
    //    We only need fullName and email – rename fullName to full_name
    const userDoc = await User.findById(userId, 'fullName email');
    if (!userDoc) {
      return NextResponse.json(null, { status: 404 });
    }

    // 5. Return same shape as before
    return NextResponse.json({
      id: userDoc._id,
      full_name: userDoc.fullName,
      email: userDoc.email,
    });
  } catch (err) {
    console.error('User fetch error:', err);
    return NextResponse.json(null, { status: 500 });
  }
}
