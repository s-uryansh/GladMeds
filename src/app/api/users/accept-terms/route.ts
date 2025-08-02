// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { db } from '@/lib/db'

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       )
//     }

//     const { userEmail, acceptedAt, termsVersion } = await request.json()

//     // Validate that the user is accepting terms for their own account
//     if (userEmail && userEmail !== session.user.email) {
//       return NextResponse.json(
//         { error: 'Forbidden' },
//         { status: 403 }
//       )
//     }

//     // Update user with terms acceptance
//     await db.execute(
//       'UPDATE users SET terms_accepted = ?, terms_accepted_at = ?, terms_version = ? WHERE email = ?',
//       [true, new Date(acceptedAt), termsVersion, session.user.email]
//     )

//     return NextResponse.json({
//       success: true,
//       message: 'Terms accepted successfully'
//     })

//   } catch (error) {
//     console.error('Error accepting terms:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }
// src/app/api/user/accept-terms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Users from '@/lib/models/Users';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userEmail, acceptedAt, termsVersion } = await request.json();

    if (userEmail && userEmail !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    await Users.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          terms_accepted: true,
          terms_accepted_at: new Date(acceptedAt),
          terms_version: termsVersion,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Terms accepted successfully',
    });
  } catch (error) {
    console.error('Error accepting terms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
