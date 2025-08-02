// import { NextRequest, NextResponse } from 'next/server'
// import { db } from '@/lib/db'
// import { v4 as uuidv4 } from 'uuid'
// import jwt from 'jsonwebtoken'

// export async function POST(req: NextRequest) {
//   try {
//     const token = req.cookies.get('token')?.value
//     if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
//     const userId = decoded.id
//     const { title, description } = await req.json()

//     if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

//     await db.execute(
//       'INSERT INTO medical_histories (id, user_id, title, description) VALUES (?, ?, ?, ?)',
//       [uuidv4(), userId, title, description || null]
//     )

//     return NextResponse.json({ success: true })
//   } catch (err) {
//     console.error(err)
//     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
//   }
// }
// src/app/api/history/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/db';
import MedicalHistory from '@/lib/models/MedicalHistory';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate via JWT cookie
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = payload.id;

    // 2. Parse & validate
    const { title, description } = await req.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // 3. Connect to MongoDB
    await dbConnect();

    // 4. Create new history entry
    await MedicalHistory.create({
      _id:        uuidv4(),
      userId,
      title,
      description: description || null,
      createdAt:  new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Create medical history error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
