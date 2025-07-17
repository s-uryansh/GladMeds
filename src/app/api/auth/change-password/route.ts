import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const db = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
});

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();
    const userEmail = req.cookies.get('user_email')?.value; // Or get from session/JWT

    if (!userEmail) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 });
    }

    // Fetch user from DB
    const [rows] = await db.query(
      'SELECT password_hash FROM users WHERE email = ?',
      [userEmail]
    );
    const user = (rows as any)[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    // Hash new password and update
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [newHash, userEmail]
    );

    return NextResponse.json({ message: 'Password changed successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}