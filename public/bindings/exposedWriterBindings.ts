export interface WriteResult {
  data: Uint8Array;
  width: number;
  height: number;
  format: string;
}

export interface EncodingOptions {
  characterSet?: string;
  errorCorrectionLevel?: string | number;
}

export const WriterFormat = {
  AZTEC: 'Aztec',
  CODABAR: 'Codabar',
  CODE_39: 'Code39',
  CODE_93: 'Code93',
  CODE_128: 'Code128',
  DATA_MATRIX: 'DataMatrix',
  EAN_8: 'EAN8',
  EAN_13: 'EAN13',
  ITF: 'ITF',
  PDF_417: 'PDF417',
  QR_CODE: 'QRCode',
  UPC_A: 'UPCA',
  UPC_E: 'UPCE',
} as const;

export type WriterFormatType = typeof WriterFormat[keyof typeof WriterFormat];