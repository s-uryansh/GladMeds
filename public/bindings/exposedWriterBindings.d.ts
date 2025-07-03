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

export declare const WriterFormat: {
  readonly AZTEC: 'Aztec';
  readonly CODABAR: 'Codabar';
  readonly CODE_39: 'Code39';
  readonly CODE_93: 'Code93';
  readonly CODE_128: 'Code128';
  readonly DATA_MATRIX: 'DataMatrix';
  readonly EAN_8: 'EAN8';
  readonly EAN_13: 'EAN13';
  readonly ITF: 'ITF';
  readonly PDF_417: 'PDF417';
  readonly QR_CODE: 'QRCode';
  readonly UPC_A: 'UPCA';
  readonly UPC_E: 'UPCE';
};

export type WriterFormatType = typeof WriterFormat[keyof typeof WriterFormat];