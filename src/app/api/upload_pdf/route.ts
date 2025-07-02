// import { NextRequest, NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import path from 'path';
// import { writeFile } from 'fs/promises';
// import { db } from '@/lib/db';

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const files = formData.getAll('files') as File[];
//   const userId = formData.get('userId') as string;
//   if (!files || !userId) {
//     return NextResponse.json({ error: 'Missing files or user ID' }, { status: 400 });
//   }

//   for (const file of files) {
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     const filename = `${uuidv4()}_${file.name}`;
//     const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
//     await writeFile(filePath, buffer);

//     await db.execute(
//       'INSERT INTO uploaded_pdfs (id, user_id, file_name, file_path) VALUES (?, ?, ?, ?)',
//       [uuidv4(), userId, file.name, `/uploads/${filename}`]
//     );
//   }

//   return NextResponse.json({ message: 'Files uploaded successfully' });
// }
// /app/api/upload_pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { writeFile } from 'fs/promises';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('pdf_files') as File[];

    // ✅ Get userId from token (not from formData)
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = payload.id;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${uuidv4()}_${file.name}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      await writeFile(filePath, buffer);

      await db.execute(
        'INSERT INTO uploaded_pdfs (id, user_id, file_name, file_path) VALUES (?, ?, ?, ?)',
        [uuidv4(), userId, file.name, `/uploads/${filename}`]
      );
    }

    return NextResponse.json({ message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
