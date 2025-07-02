import { prepareZXingModule, readBarcodes } from 'zxing-wasm';
import sharp from 'sharp';
import { createCanvas } from 'canvas';
import Tesseract from 'tesseract.js';

export type ProductInfo = {
  name: string;
  ingredients: string[];
  rawText?: string;
}

const extractText = async (file: File) => {
  const { data } = await Tesseract.recognize(file, 'eng');
  return data.text.trim();
};

let isReady = false;

export async function scanBarcodeFromImage(buffer: Buffer): Promise<string | null> {
  if (!isReady) {
    await prepareZXingModule();
    isReady = true;
  }

  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const canvas = createCanvas(info.width, info.height);
  const ctx = canvas.getContext('2d');

  const imageData = ctx.createImageData(info.width, info.height);
  imageData.data.set(data);

  const domImageData = imageData as ImageData & { colorSpace: 'srgb' };
  domImageData.colorSpace = 'srgb';

  try {
    const results = await readBarcodes(domImageData, {
      tryHarder: true,
      maxNumberOfSymbols: 1,
    });

    return results.length > 0 ? results[0].text ?? null : null;
  } catch (error) {
    console.error('Barcode decoding failed:', error);
    return null;
  }
}
export async function lookupProductFromBarcode(barcode: string): Promise<ProductInfo | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();

    if (data.status !== 1 || !data.product?.product_name) return null;

    return {
      name: data.product.product_name,
      ingredients: data.product.ingredients_text
        ? data.product.ingredients_text.split(/,|;/).map((s: string) => s.trim())
        : [],
    };
  } catch (e) {
    console.error('Lookup failed:', e);
    return null;
  }
}


export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  const { data } = await Tesseract.recognize(buffer, 'eng');
  return data.text.trim();
}
export async function fallbackGoogleSearch(barcode: string) {
  try {
    const res = await fetch(`https://www.google.com/search?q=${barcode}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
    const text = await res.text();
    const match = text.match(/<h3.*?>(.*?)<\/h3>/);
    if (!match) return null;

    const name = match[1].replace(/<[^>]+>/g, '').trim();
    return {
      name,
      ingredients: [],
      rawText: `Guessed from Google result: ${name}`,
    };
  } catch {
    return null;
  }
}
