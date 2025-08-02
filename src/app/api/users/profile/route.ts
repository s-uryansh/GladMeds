// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { db } from '@/lib/db';

// type UserProfile = {
//   date_of_birth: string | null;
//   marital_status: string | null;
//   id_proof_type: string | null;
//   id_proof_number: string | null;
//   occupation: string | null;
//   nationality: string | null;
//   guardian_name: string | null;
//   guardian_relation: string | null;
//   guardian_phone: string | null;
//   religion: string | null;
//   preferred_language: string | null;
//   known_allergies: string | null;
//   chronic_conditions: string | null;
//   past_surgeries: string | null;
//   current_medications: string | null;
//   immunization_status: string | null;
//   family_medical_history: string | null;
//   lifestyle_details: string | null;
//   menstrual_info: string | null;
// };

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get('token')?.value;
//     if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
//     const userId = payload.id;

//     const [rawRows] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
//     const rows = rawRows as UserProfile[];

//     if (rows.length === 0) {
//       return NextResponse.json({ error: 'No profile found' }, { status: 404 });
//     }

//     return NextResponse.json(rows[0]);
//   } catch (err) {
//     console.error('Fetch profile error:', err);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
// src/app/api/user/get-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/db';
import UserProfile from '@/lib/models/UsersProfile'; // Make sure this model exists

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
    const userId = payload._id;

    await dbConnect();
    
    const profile = await UserProfile
  .findOne({ user_id: userId })
  .select('-_id -userId -__v')
  .lean();


    if (!profile) {
      return NextResponse.json({ error: 'No profile found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error('Fetch profile error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
