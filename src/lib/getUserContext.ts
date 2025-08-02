import UserModel from '@/lib/models/Users';
import UserProfileModel from '@/lib/models/UsersProfile';
import MedicalHistoryModel from '@/lib/models/MedicalHistory';

export async function getUserMedicalContext(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error('User not found');
  const profile = await UserProfileModel.findOne({ userId });
  const histories = await MedicalHistoryModel.find({ userId });

  return `
👤 User Profile:
- Name: ${user.fullName}
- Age: ${user.age}
- Gender: ${user.gender}
- Blood Group: ${user.bloodGroup || 'Unknown'}

📄 Extended Profile:
- DOB: ${profile?.dateOfBirth?.toISOString().split('T')[0] || 'N/A'}
- Occupation: ${profile?.occupation || 'N/A'}
- Languages: ${profile?.preferredLanguage || 'N/A'}

🩺 Medical Summary:
- Allergies: ${profile?.knownAllergies || 'None'}
- Chronic Conditions: ${profile?.chronicConditions || 'None'}
- Past Surgeries: ${profile?.pastSurgeries || 'None'}
- Current Medications: ${profile?.currentMedications || 'None'}
- Immunization: ${profile?.immunizationStatus || 'N/A'}
- Family History: ${profile?.familyMedicalHistory || 'N/A'}
- Lifestyle: ${profile?.lifestyleDetails || 'N/A'}
- Menstrual Info: ${profile?.menstrualInfo || 'N/A'}

📚 Medical History:
${histories.length > 0
  ? histories.map(h => `- ${h.title}: ${h.description || ''}`).join('\n')
  : '- No medical history records found.'}
`;
}
