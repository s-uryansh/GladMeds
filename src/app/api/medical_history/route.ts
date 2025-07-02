import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const userId = decoded.id
    const { title, description } = await req.json()

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    await db.execute(
      'INSERT INTO medical_histories (id, user_id, title, description) VALUES (?, ?, ?, ?)',
      [uuidv4(), userId, title, description || null]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
