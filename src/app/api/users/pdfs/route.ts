// import { NextRequest, NextResponse } from 'next/server'
// import { db } from '@/lib/db'
// import jwt from 'jsonwebtoken'

// export const dynamic = 'force-dynamic'

// export async function GET(req: NextRequest) {
//   try {
//     // 1. Get JWT from cookies
//     const token = req.cookies.get('token')?.value
//     if (!token) {
//       return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
//     }
//     // 2. Verify token
//     let payload: any
//     try {
//       payload = jwt.verify(token, process.env.JWT_SECRET!)
//     } catch {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
//     }

//     const userId = payload.id

//     const [rows] = await db.query(
//       'SELECT id, file_name, file_path, uploaded_at FROM uploaded_pdfs WHERE user_id = ? ORDER BY uploaded_at DESC',
//       [userId]
//     )

//     return NextResponse.json({ pdfs: rows }, { status: 200 })
//   } catch (err) {
//     console.error('Error fetching PDFs:', err)
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//   }
// }
// src/app/api/user/get-pdfs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/db';
import UploadedPdf from '@/lib/models/UploadedPDF';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    const userId = payload.id;

    await dbConnect();

    const pdfs = await UploadedPdf.find({ userId: userId })
      .sort({ uploadedAt: -1 })
      .select('_id fileName filePath uploadedAt')
      ;

    return NextResponse.json({ pdfs }, { status: 200 });
  } catch (err) {
    console.error('Error fetching PDFs:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
