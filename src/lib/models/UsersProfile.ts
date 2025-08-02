import { Schema, model, models } from 'mongoose';

export interface UserProfile {
  _id: string;
  userId: string;
  dateOfBirth?: Date;
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  idProofType?: string;
  idProofNumber?: string;
  occupation?: string;
  nationality?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  religion?: string;
  preferredLanguage?: string;
  knownAllergies?: string;
  chronicConditions?: string;
  pastSurgeries?: string;
  currentMedications?: string;
  immunizationStatus?: string;
  familyMedicalHistory?: string;
  lifestyleDetails?: string;
  menstrualInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<UserProfile>({
  _id:                  { type: String, required: true },
  userId:               { type: String, ref: 'Users', required: true },
  dateOfBirth:          { type: Date },
  maritalStatus:        { type: String, enum: ['SINGLE','MARRIED','DIVORCED','WIDOWED'] },
  idProofType:          { type: String },
  idProofNumber:        { type: String },
  occupation:           { type: String },
  nationality:          { type: String },
  guardianName:         { type: String },
  guardianRelation:     { type: String },
  guardianPhone:        { type: String },
  religion:             { type: String },
  preferredLanguage:    { type: String },
  knownAllergies:       { type: String },
  chronicConditions:    { type: String },
  pastSurgeries:        { type: String },
  currentMedications:   { type: String },
  immunizationStatus:   { type: String },
  familyMedicalHistory: { type: String },
  lifestyleDetails:     { type: String },
  menstrualInfo:        { type: String },
  createdAt:            { type: Date, default: () => new Date() },
  updatedAt:            { type: Date, default: () => new Date() },
}, {
  collection: 'user_profiles'
});

export default models.UserProfile || model<UserProfile>('UserProfile', profileSchema);
