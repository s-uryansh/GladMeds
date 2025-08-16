// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import jwt from 'jsonwebtoken';
// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
// import fs from 'fs/promises';
// import path from 'path';

// export const dynamic = 'force-dynamic';

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get('token')?.value;
//     if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

//     const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
//     const userId = payload.id;

//     const [userRows] = await db.query(
//       'SELECT full_name, email, age, gender, blood_group, phone, address, created_at FROM users WHERE id = ?',
//       [userId]
//     );
//     const user = (userRows as any[])[0];

//     const [profileRows] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
//     const profile = (profileRows as any[])[0];

//     const [pdfRows] = await db.query('SELECT file_path FROM uploaded_pdfs WHERE user_id = ?', [userId]);

//     const [historyRows] = await db.query(
//       'SELECT title, description, created_at FROM medical_histories WHERE user_id = ?',
//       [userId]
//     );

//     const pdfDoc = await PDFDocument.create();
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     const addPageWithHeader = async () => {
//       const page = pdfDoc.addPage([595, 842]);
//       const logoPath = path.join(process.cwd(), 'public/images/logo/icon.png');
//       const logoBytes = await fs.readFile(logoPath);
//       const pngImage = await pdfDoc.embedPng(logoBytes);
//       const pngDims = pngImage.scale(0.2);

//       page.drawImage(pngImage, {
//         x: page.getWidth() - pngDims.width - 40,
//         y: page.getHeight() - pngDims.height - 40,
//         width: pngDims.width,
//         height: pngDims.height,
//       });

//       page.drawText('GladMeds - A Secure Healthcare Platform', {
//         x: 50,
//         y: 30,
//         size: 10,
//         font,
//         color: rgb(0.5, 0.5, 0.5),
//       });

//       page.drawLine({
//         start: { x: 50, y: 45 },
//         end: { x: 300, y: 45 },
//         thickness: 0.5,
//         color: rgb(0.7, 0.7, 0.7),
//       });

//       return page;
//     };

//     const page1 = await addPageWithHeader();
//     let y = 720;
//     page1.drawText('GladMeds - Medical Report', { x: 50, y, size: 20, font, color: rgb(0.1, 0.3, 0.8) });
//     y -= 30;
//     page1.drawText('Basic Information:', { x: 50, y, size: 14, font });
//     y -= 20;

//     const userInfo: Record<string, string> = {
//       'Full Name': user.full_name,
//       Email: user.email,
//       Age: String(user.age),
//       Gender: user.gender,
//       'Blood Group': user.blood_group || 'N/A',
//       Phone: user.phone || 'N/A',
//       Address: user.address || 'N/A',
//       'Registered On': new Date(user.created_at).toLocaleString(),
//     };

//     const rowHeight = 28;
//     const paddingY = 8;
//     for (const [key, value] of Object.entries(userInfo)) {
//       page1.drawRectangle({
//         x: 50,
//         y: y - rowHeight + paddingY,
//         width: 495,
//         height: 24,
//         color: rgb(0.96, 0.96, 0.96),
//         borderColor: rgb(0.85, 0.85, 0.85),
//         borderWidth: 0.3,
//       });
//       page1.drawText(`${key}:`, { x: 60, y: y - 8, size: 12, font });
//       page1.drawText(value, { x: 200, y: y - 8, size: 12, font });
//       y -= rowHeight;
//     }

//     const page2 = await addPageWithHeader();
//     let y2 = 750;
//     page2.drawText('Extended Medical Profile:', { x: 50, y: y2, size: 16, font, color: rgb(0.1, 0.1, 0.4) });
//     y2 -= 30;

//     const fields = [
//       'date_of_birth', 'marital_status', 'id_proof_type', 'id_proof_number',
//       'occupation', 'nationality', 'guardian_name', 'guardian_relation',
//       'guardian_phone', 'religion', 'preferred_language', 'known_allergies',
//       'chronic_conditions', 'past_surgeries', 'current_medications',
//       'immunization_status', 'family_medical_history', 'lifestyle_details', 'menstrual_info',
//     ];

//     for (const field of fields) {
//       if (profile[field]) {
//         const label = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
//         const text = `${label}: ${profile[field]}`;
//         const wrappedText = text.match(/.{1,80}/g) || [];

//         for (let line of wrappedText) {
//           if (y2 < 50) {
//             const nextPage = await addPageWithHeader();
//             y2 = 750;
//             page2.drawText('...continued', { x: 50, y: y2, size: 12, font });
//             y2 -= 20;
//           }
//           page2.drawText(line, { x: 50, y: y2, size: 12, font });
//           y2 -= 20;
//         }
//         y2 -= 10;
//       }
//     }

//     const historyPage = await addPageWithHeader();
//     let y3 = 750;
//     historyPage.drawText('Medical History:', { x: 50, y: y3, size: 16, font, color: rgb(0.1, 0.1, 0.4) });
//     y3 -= 30;

//     for (const record of historyRows as any[]) {
//       const title = `• ${record.title}`;
//       const descLines = (record.description || '').match(/.{1,90}/g) || [];
//       historyPage.drawText(title, { x: 60, y: y3, size: 13, font });
//       y3 -= 20;
//       for (const line of descLines) {
//         historyPage.drawText(line, { x: 80, y: y3, size: 11, font });
//         y3 -= 16;
//       }
//       y3 -= 10;
//       if (y3 < 60) {
//         const nextPage = await addPageWithHeader();
//         y3 = 750;
//         historyPage.drawText('...continued', { x: 50, y: y3, size: 12, font });
//         y3 -= 20;
//       }
//     }

//     const mainPdfBytes = await pdfDoc.save();
//     const mergedPdf = await PDFDocument.create();
//     const mainPdf = await PDFDocument.load(mainPdfBytes);
//     const mainPages = await mergedPdf.copyPages(mainPdf, mainPdf.getPageIndices());
//     mainPages.forEach(p => mergedPdf.addPage(p));

//     for (const pdf of pdfRows as any[]) {
//       try {
//         const res = await fetch(pdf.file_path, {
//           headers: {
//             Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
//           },
//         });
//         if (!res.ok) throw new Error(`Failed to fetch PDF: ${pdf.file_path}`);

//         // const filePath = path.join(process.cwd(), 'public', pdf.file_path);
//         // const fileBytes = await fs.readFile(filePath);
//         const fileBytes = new Uint8Array(await res.arrayBuffer());
//         const userPdf = await PDFDocument.load(fileBytes);
//         const userPages = await mergedPdf.copyPages(userPdf, userPdf.getPageIndices());
//         userPages.forEach(p => mergedPdf.addPage(p));
//       } catch (err) {
//         console.warn('Failed to include PDF:', pdf.file_path, err);
//       }
//     }

//     const finalPdfBytes = await mergedPdf.save();
//     return new NextResponse(finalPdfBytes, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': 'attachment; filename="gladmeds-report.pdf"',
//       },
//     });
//   } catch (err) {
//     console.error('PDF export error:', err);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
// src/app/api/report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { dbConnect } from '@/lib/db';
import Users from '@/lib/models/Users';
import UserProfile from '@/lib/models/UsersProfile';
import UploadedPdf from '@/lib/models/UploadedPDF';
import MedicalHistory from '@/lib/models/MedicalHistory';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = payload.id;

    // 2. Connect to MongoDB
    await dbConnect();

    // 3. Fetch all data
    const user     = await Users.findById(userId, 'fullName email age gender bloodGroup phone address createdAt');
    const profile = await UserProfile
    .findOne({ userId }, '-_id -userId -__v')
    .lean();
    const pdfRows  = await UploadedPdf.find({ userId }, 'filePath');
    const history  = await MedicalHistory.find({ userId }, 'title description createdAt');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Build PDF
    const pdfDoc = await PDFDocument.create();
    const font   = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const addPageWithHeader = async () => {
      const page = pdfDoc.addPage([595, 842]);
      const logoPath = path.join(process.cwd(), 'public/images/logo/icon.png');
      const logoBytes = await fs.readFile(logoPath);
      const pngImage  = await pdfDoc.embedPng(logoBytes);
      const pngDims   = pngImage.scale(0.2);

      page.drawImage(pngImage, {
        x: page.getWidth() - pngDims.width - 40,
        y: page.getHeight() - pngDims.height - 40,
        width: pngDims.width,
        height: pngDims.height,
      });

      page.drawText('GladMeds - A Secure Healthcare Platform', {
        x: 50, y: 30, size: 10, font, color: rgb(0.5, 0.5, 0.5)
      });
      page.drawLine({
        start: { x: 50, y: 45 },
        end:   { x: 300, y: 45 },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
      });
      return page;
    };

    // — Page 1: Basic Info
    const page1 = await addPageWithHeader();
    let y = 720;
    page1.drawText('GladMeds - Medical Report', { x: 50, y, size: 20, font, color: rgb(0.1, 0.3, 0.8) });
    y -= 30;
    page1.drawText('Basic Information:', { x: 50, y, size: 14, font });
    y -= 20;

    const userInfo: Record<string,string> = {
      'Full Name': user.fullName,
      Email:       user.email,
      Age:         String(user.age),
      Gender:      user.gender,
      'Blood Group': user.bloodGroup || 'N/A',
      Phone:       user.phone || 'N/A',
      Address:     user.address || 'N/A',
      'Registered On': new Date(user.createdAt).toLocaleString(),
    };

    const rowHeight = 28, paddingY = 8;
    for (const [key, val] of Object.entries(userInfo)) {
      page1.drawRectangle({
        x: 50, y: y - rowHeight + paddingY,
        width: 495, height: 24,
        color: rgb(0.96, 0.96, 0.96),
        borderColor: rgb(0.85, 0.85, 0.85),
        borderWidth: 0.3,
      });
      page1.drawText(`${key}:`, { x: 60, y: y - 8, size: 12, font });
      page1.drawText(val,     { x: 200, y: y - 8, size: 12, font });
      y -= rowHeight;
    }

    // — Page 2: Extended Profile
    const page2 = await addPageWithHeader();
    let y2 = 750;
    page2.drawText('Extended Medical Profile:', { x: 50, y: y2, size: 16, font, color: rgb(0.1,0.1,0.4) });
    y2 -= 30;

    for (const field of Object.keys(profile || {})) {
      const value = (profile as any)[field];
      if (!value) continue;
      const label = field.replace(/([A-Z])/g,' $1')
                         .replace(/^./,str=>str.toUpperCase());
      const text  = `${label}: ${value}`;
      const lines = text.match(/.{1,80}/g)!;
      for (const line of lines) {
        if (y2 < 50) { y2 = 750; await addPageWithHeader().then(p=>p.drawText('...continued',{x:50,y:y2,size:12,font})); y2-=20; }
        page2.drawText(line, { x: 50, y: y2, size: 12, font });
        y2 -= 20;
      }
      y2 -= 10;
    }

    // — Page 3: Medical History
    const historyPage = await addPageWithHeader();
    let y3 = 750;
    historyPage.drawText('Medical History:', { x: 50, y: y3, size: 16, font, color: rgb(0.1,0.1,0.4) });
    y3 -= 30;

    for (const rec of history) {
      historyPage.drawText(`• ${rec.title}`, { x: 60, y: y3, size: 13, font });
      y3 -= 20;
      const descLines = (rec.description||'').match(/.{1,90}/g)!;
      for (const ln of descLines) {
        historyPage.drawText(ln, { x: 80, y: y3, size: 11, font });
        y3 -= 16;
      }
      y3 -= 10;
      if (y3 < 60) { y3 = 750; await addPageWithHeader().then(p=>p.drawText('...continued',{x:50,y:y3,size:12,font})); y3-=20; }
    }

    // — Merge in user PDFs
    const mainPdfBytes = await pdfDoc.save();
    const mergedPdf   = await PDFDocument.create();
    const mainLoaded  = await PDFDocument.load(mainPdfBytes);
    const mainPages   = await mergedPdf.copyPages(mainLoaded, mainLoaded.getPageIndices());
    mainPages.forEach(p => mergedPdf.addPage(p));

    for (const p of pdfRows) {
      try {
        if (!p.filePath || typeof p.filePath !== 'string') {
          console.warn('Skipping PDF due to invalid filePath:', p.filePath);
          continue;
        }
        const res = await fetch(p.filePath, { headers:{ Authorization:`Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` } });
        if (!res.ok) throw new Error(`Fetch error`);
        const arr    = new Uint8Array(await res.arrayBuffer());
        const upPdf  = await PDFDocument.load(arr);
        const pages  = await mergedPdf.copyPages(upPdf, upPdf.getPageIndices());
        pages.forEach(pg => mergedPdf.addPage(pg));
      } catch {
        console.warn('Skipping PDF:', p.filePath);
      }
    }

    const finalBytes = await mergedPdf.save();
    return new NextResponse(Buffer.from(finalBytes), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': 'attachment; filename="gladmeds-report.pdf"',
      },
    });
  } catch (err) {
    console.error('PDF export error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
