import { Schema, model, models } from 'mongoose';

export interface MedicalHistory {
  _id: string;                 // UUID
  userId: string;              // references User._id
  title: string;
  description?: string;
  createdAt: Date;
}

const historySchema = new Schema<MedicalHistory>({
  _id:        { type: String, required: true },
  userId:     { type: String, ref: 'User', required: true },
  title:      { type: String, required: true },
  description:{ type: String },
  createdAt:  { type: Date, default: () => new Date() },
}, {
  collection: 'medical_histories'
});

export default models.MedicalHistory || model<MedicalHistory>('MedicalHistory', historySchema);
