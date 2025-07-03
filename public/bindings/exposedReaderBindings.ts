export interface BarcodeResult {
  text: string;
  format: string;
  position?: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
  orientation?: number;
  ec_level?: string;
  symbology_identifier?: string;
}

export interface ReadResult {
  results: BarcodeResult[];
  errors?: string[];
}

export const BarcodeFormat = {
  AZTEC: 'Aztec',
  CODABAR: 'Codabar',
  CODE_39: 'Code39',
  CODE_93: 'Code93',
  CODE_128: 'Code128',
  DATA_MATRIX: 'DataMatrix',
  EAN_8: 'EAN8',
  EAN_13: 'EAN13',
  ITF: 'ITF',
  MAXICODE: 'MaxiCode',
  PDF_417: 'PDF417',
  QR_CODE: 'QRCode',
  RSS_14: 'RSS14',
  RSS_EXPANDED: 'RSSExpanded',
  UPC_A: 'UPCA',
  UPC_E: 'UPCE',
  UPC_EAN_EXTENSION: 'UPCEANExtension',
} as const;

export type BarcodeFormatType = typeof BarcodeFormat[keyof typeof BarcodeFormat];