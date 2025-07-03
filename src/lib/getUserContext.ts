import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

type User = RowDataPacket & {
  full_name: string;
  age: number;
  gender: string;
  blood_group: string;
};

type UserProfile = RowDataPacket & {
  date_of_birth: string;
  marital_status: string;
  id_proof_type: string;
  id_proof_number: string;
  occupation: string;
  nationality: string;
  guardian_name: string;
  guardian_relation: string;
  guardian_phone: string;
  religion: string;
  preferred_language: string;
  known_allergies: string;
  chronic_conditions: string;
  past_surgeries: string;
  current_medications: string;
  immunization_status: string;
  family_medical_history: string;
  lifestyle_details: string;
  menstrual_info: string;
};

type MedicalHistory = RowDataPacket & {
  title: string;
  description: string;
};


export async function getUserMedicalContext(userId: string) {
  // 1. Fetch from users
  const [userRows] = await db.query<User[]>(
    `SELECT full_name, age, gender, blood_group FROM users WHERE id = ?`,
    [userId]
  );
  const user = userRows[0];

  // 2. Fetch from user_profiles
  const [profileRows] = await db.query<UserProfile[]>(
    `SELECT * FROM user_profiles WHERE user_id = ?`,
    [userId]
  );
  const profile = profileRows[0];

  // 3. Fetch from medical_histories
  const [historyRows] = await db.query<MedicalHistory[]>(
    `SELECT title, description FROM medical_histories WHERE user_id = ?`,
    [userId]
  );

  // Combine all into a prompt string
  return `
👤 User Profile:
- Name: ${user.full_name}
- Age: ${user.age}
- Gender: ${user.gender}
- Blood Group: ${user.blood_group}

📄 Extended Profile:
- DOB: ${profile.date_of_birth}
- Occupation: ${profile.occupation}
- Languages: ${profile.preferred_language}

🩺 Medical Summary:
- Allergies: ${profile.known_allergies || 'None'}
- Chronic Conditions: ${profile.chronic_conditions || 'None'}
- Past Surgeries: ${profile.past_surgeries || 'None'}
- Current Medications: ${profile.current_medications || 'None'}
- Immunization: ${profile.immunization_status}
- Family History: ${profile.family_medical_history}
- Lifestyle: ${profile.lifestyle_details}
- Menstrual Info: ${profile.menstrual_info || 'N/A'}

📚 Medical History:
${historyRows.length > 0
  ? historyRows.map(h => `- ${h.title}: ${h.description}`).join('\n')
  : '- No medical history records found.'}
`;
}
