import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(null, { status: 401 });
    }
    
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(null, { status: 403 });
    }
    const userId = payload.id;
    const [rows] = await db.query('SELECT id, full_name, email FROM users WHERE id = ?', [userId]);

    if ((rows as any[]).length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    const user = (rows as any[])[0];

    return NextResponse.json(user); 
  } catch (err) {
    console.error('User fetch error:', err);
    return NextResponse.json(null, { status: 500 });
  }
}
