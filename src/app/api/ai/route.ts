// import { NextRequest, NextResponse } from 'next/server';
// import { queryGroq } from '@/lib/groqClient';
// import { getUserMedicalContext } from '@/lib/getUserContext';
// import { db } from '@/lib/db';
// import { logAIRequestToFile } from '@/lib/logAIRequestToFile';
// import { getUserIdFromToken } from '@/lib/auth';
// import { RowDataPacket } from 'mysql2';

// export async function POST(req: NextRequest) {
//   try {

//     const userId = getUserIdFromToken(req);
//     if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const { input } = await req.json();
//     if (!input) return NextResponse.json({ error: 'Missing input' }, { status: 400 });

//     const context = await getUserMedicalContext(userId);
//     const fullPrompt = `${context}\n\nUser's Question: ${input}`;

//     const result = await queryGroq(fullPrompt);
//     const [userRows] = await db.query<(RowDataPacket & { full_name: string })[]>(
//       `SELECT full_name FROM users WHERE id = ?`,
//       [userId]
//     );
//     const username = userRows[0]?.full_name || 'unknown_user';

//     await logAIRequestToFile(username, input, result);

//     return NextResponse.json({ result });
//   } catch (err) {
    
//     console.error(err);
//     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { queryGroq } from '@/lib/groqClient';
import { getUserMedicalContext } from '@/lib/getUserContext';
import { dbConnect } from '@/lib/db';
import { logAIRequestToFile } from '@/lib/logAIRequestToFile';
import { getUserIdFromToken } from '@/lib/auth';
import Users from '@/lib/models/Users';

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { input } = await req.json();
    if (!input) return NextResponse.json({ error: 'Missing input' }, { status: 400 });

    await dbConnect();

    const context = await getUserMedicalContext(userId);
    const fullPrompt = `${context}\n\nUser's Question: ${input}`;

    const result = await queryGroq(fullPrompt);

    const userDoc = await Users.findById(userId, 'profile.fullName').lean();
    const user = Array.isArray(userDoc) ? userDoc[0] : userDoc;
    const username = user?.profile?.fullName || 'unknown_user';

    await logAIRequestToFile(username, input, result);

    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
