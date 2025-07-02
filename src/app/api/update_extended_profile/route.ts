import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  const formatDateForMySQL = (iso: string) => {
    return new Date(iso).toISOString().slice(0, 19).replace('T', ' ')
  }
    const formatDateOnly = (iso: string) => {
    return new Date(iso).toISOString().slice(0, 10) // Returns YYYY-MM-DD
  }
  ``
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!)
    const userId = payload.id

    const body = await req.json()

    delete body.created_at

    body.updated_at = formatDateForMySQL(new Date().toISOString())

    const fields = Object.keys(body)
    const values = fields.map((key) => {
      const val = body[key]
      if (key === 'date_of_birth' && val) {
        return formatDateOnly(val)
      }
      if (val instanceof Date) {
        return formatDateForMySQL(val.toISOString())
      }
      if (val instanceof Date) {
        return formatDateForMySQL(val.toISOString())
      }
      return val
    })

    const sets = fields.map((key) => `${key} = ?`).join(', ')

    const [result] = await db.execute(
      `UPDATE user_profiles SET ${sets} WHERE user_id = ?`,
      [...values, userId]
    )

    return NextResponse.json({ message: 'Extended profile updated successfully' })
  } catch (err) {
    console.error('Update extended profile error:', err)
    return NextResponse.json({ error: 'Failed to update extended profile' }, { status: 500 })
  }
}
