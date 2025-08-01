import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createConnection } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profileId = userId;
    const db = await createConnection();

    const getField = (name: string) => formData.get(name)?.toString() || null;

    const data = {
      id: profileId,
      user_id: userId,
      date_of_birth: getField('date_of_birth'),
      marital_status: getField('marital_status'),
      id_proof_type: getField('id_proof_type'),
      id_proof_number: getField('id_proof_number'),
      occupation: getField('occupation'),
      nationality: getField('nationality'),
      guardian_name: getField('guardian_name'),
      guardian_relation: getField('guardian_relation'),
      guardian_phone: getField('guardian_phone'),
      religion: getField('religion'),
      preferred_language: formData.getAll('preferred_language').join(','),
      known_allergies: getField('known_allergies'),
      chronic_conditions: getField('chronic_conditions'),
      past_surgeries: getField('past_surgeries'),
      current_medications: getField('current_medications'),
      immunization_status: getField('immunization_status'),
      family_medical_history: getField('family_medical_history'),
      lifestyle_details: getField('lifestyle_details'),
      menstrual_info: getField('menstrual_info'),
    };

    await db.execute(
      `INSERT INTO user_profiles (
        id, user_id, date_of_birth, marital_status, id_proof_type, id_proof_number,
        occupation, nationality, guardian_name, guardian_relation, guardian_phone,
        religion, preferred_language, known_allergies, chronic_conditions,
        past_surgeries, current_medications, immunization_status,
        family_medical_history, lifestyle_details, menstrual_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(data)
    );

    const files = formData.getAll('pdf_files') as File[];

    const uploads = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueName = `${userId}-${Date.now()}-${file.name}`; 

        const blob = await put(uniqueName, buffer, {
          access: 'public',
          token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN, 
        });

        const pdfId = uuidv4();
        await db.execute(
          'INSERT INTO uploaded_pdfs (id, user_id, file_name, file_path) VALUES (?, ?, ?, ?)',
          [pdfId, userId, file.name, blob.url] 
        );

        return blob.url;
      })
    );

    return NextResponse.json({
      message: 'Profile and PDFs uploaded successfully',
      uploaded_files: uploads,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
