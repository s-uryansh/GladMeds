import { Schema, model, models } from 'mongoose';

export interface User {
  _id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  age: number;
  gender: string;
  bloodGroup?: string;
  phone?: string;
  address?: string;
  termsAccepted: boolean;
  termsAcceptedAt?: Date;
  termsVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>({
  _id:              { type: String, required: true },
  email:            { type: String, required: true, unique: true },
  passwordHash:     { type: String, required: true },
  fullName:         { type: String, required: true },
  age:              { type: Number, required: true },
  gender:           { type: String, required: true },
  bloodGroup:       { type: String },
  phone:            { type: String },
  address:          { type: String },
  termsAccepted:    { type: Boolean, default: false },
  termsAcceptedAt:  { type: Date },
  termsVersion:     { type: String, default: '1.0' },
  createdAt:        { type: Date, default: () => new Date() },
  updatedAt:        { type: Date, default: () => new Date() },
}, {
  collection: 'users'
});

export default models.Users || model<User>('Users', userSchema);
