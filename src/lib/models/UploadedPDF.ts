import { Schema, model, models } from 'mongoose';

export interface UploadedPdf {
  _id: string;                 // UUID
  userId: string;              // references User._id
  fileName?: string;
  filePath?: string;
  uploadedAt: Date;
}

const pdfSchema = new Schema<UploadedPdf>({
  _id:        { type: String, required: true },
  userId:     { type: String, ref: 'User', required: true },
  fileName:   { type: String },
  filePath:   { type: String },
  uploadedAt: { type: Date, default: () => new Date() },
}, {
  collection: 'uploaded_pdfs'
});

export default models.UploadedPdf || model<UploadedPdf>('UploadedPdf', pdfSchema);
