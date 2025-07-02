import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!)
    const userId = payload.id

    const body = await req.json()

    const editableFields = ['full_name', 'email', 'age', 'gender', 'blood_group', 'phone', 'address']
    const fields = Object.keys(body).filter((key) => editableFields.includes(key))

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
    }

    const values = fields.map((key) => body[key])
    const sets = fields.map((key) => `${key} = ?`).join(', ')

    const [result] = await db.execute(
      `UPDATE users SET ${sets} WHERE id = ?`,
      [...values, userId]
    )

    return NextResponse.json({ message: 'User profile updated successfully' })
  } catch (err) {
    console.error('Update user error:', err)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
