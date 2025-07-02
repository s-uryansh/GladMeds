import { NextRequest, NextResponse } from 'next/server';
import { queryGroq } from '@/lib/groqClient';
import { getUserMedicalContext } from '@/lib/getUserContext';
import { getUserIdFromToken } from '@/lib/auth';
import { scanBarcodeFromImage, lookupProductFromBarcode, extractTextFromImage, fallbackGoogleSearch } from '@/lib/barcodeScanner';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ result: 'No file provided.' }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const barcode = await scanBarcodeFromImage(buffer);
  console.log(barcode, " barcode");

  const productNameFromForm = formData.get('productName')?.toString().trim() || '';

  if (!barcode && !productNameFromForm) {
    return NextResponse.json({ result: 'Neither barcode nor product name provided.' }, { status: 400 });
  }

  if (!barcode) return NextResponse.json({ result: 'Barcode not detected.' }, { status: 400 });

  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const context = await getUserMedicalContext(userId);

  let productInfo = barcode ? await lookupProductFromBarcode(barcode) : null;

  if (!productInfo && productNameFromForm) {
    const fallbackInfo = await fallbackGoogleSearch(productNameFromForm);
    if (fallbackInfo) {
      productInfo = fallbackInfo;
    }
  }

  const promptIngredients = `What are the ingredients found in ${productNameFromForm} `
  const ingreds = await queryGroq(promptIngredients);  

  const prompt = `
  User profile: ${context}

  Scanned product:
  - Barcode: ${barcode}
  - Name: ${productInfo?.name || productNameFromForm || 'Unknown'}
  - Ingredients: ${productInfo?.ingredients?.join(', ') || ingreds}
    (If ingredients are not listed, search for "${productNameFromForm}" and infer them. You may list them.)

  Strictly respond in this minimal format (no long paragraphs or health conditions):

  - 🟢 SAFE / 🟠 WARNING / 🔴 DANGEROUS  
  - [Product Name]  
  - [Very short advice: max 1 sentence. Do not include speculation.]

  Ingredients:
  - [ingredient list]

  (This is advice from ai and is not a real doctor, for precise information best to  consult a real doctor)
  `;


  const result = await queryGroq(prompt);

  return NextResponse.json({ result });
}
