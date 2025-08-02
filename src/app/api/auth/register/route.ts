// import { db } from '@/lib/db';
// import { NextRequest, NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import bcrypt from 'bcryptjs';

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { email, password, full_name, age, gender, blood_group, phone, address, termsAccepted, termsAcceptedAt } = body;

//   if (!email || !password || !full_name || !age || !gender) {
//     return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//   }

//   if (!termsAccepted) {
//     return NextResponse.json({ error: 'Terms of service must be accepted' }, { status: 400 });
//   }

//   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//   const hasNumber = /\d/.test(password);

//   if (password.length < 8 || !hasSpecialChar || !hasNumber) {
//     return NextResponse.json(
//       {
//         error: "Password must be at least 8 characters long and include at least one special character and one number"
//       },
//       { status: 400 }
//     );
//   }

//   try {
//     const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

//     if ((existing as any[]).length > 0) {
//       return NextResponse.json({ error: 'User already exists' }, { status: 409 });
//     }

//     const id = uuidv4();
//     const password_hash = await bcrypt.hash(password, 10);

//     await db.query(
//       `INSERT INTO users (id, email, password_hash, full_name, age, gender, blood_group, phone, address, terms_accepted, terms_accepted_at, terms_version)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [id, email, password_hash, full_name, age, gender, blood_group || null, phone || null, address || null, true, new Date(termsAcceptedAt), '1.0']
//     );

//     return NextResponse.json({ message: 'User registered successfully', userId: id });
//   } catch (err) {
//     console.error('Registration error:', err);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import Users from '@/lib/models/Users';

export async function POST(req: NextRequest) {
  const {
    email,
    password,
    full_name,
    age,
    gender,
    blood_group,
    phone,
    address,
    termsAccepted,
    termsAcceptedAt,
  } = await req.json();

  // 1. Validate required fields
  if (!email || !password || !full_name || !age || !gender) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!termsAccepted) {
    return NextResponse.json({ error: 'Terms of service must be accepted' }, { status: 400 });
  }
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /\d/.test(password);
  if (password.length < 8 || !hasSpecialChar || !hasNumber) {
    return NextResponse.json({
      error:
        'Password must be at least 8 characters long and include at least one special character and one number',
    }, { status: 400 });
  }

  try {
    // 2. Connect to MongoDB
    await dbConnect();

    // 3. Check for existing user
    const exists = await Users.exists({ email });
    if (exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // 4. Create new user
    const hashed = await bcrypt.hash(password, 10);
    const user = await Users.create({
      _id: uuidv4(),
      email,
      passwordHash: hashed,
      fullName: full_name,
      age,
      gender,
      bloodGroup: blood_group || null,
      phone: phone || null,
      address: address || null,
      termsAccepted: true,
      termsAcceptedAt: termsAcceptedAt ? new Date(termsAcceptedAt) : new Date(),
      termsVersion: '1.0',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: 'User registered successfully',
      userId: user._id,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
