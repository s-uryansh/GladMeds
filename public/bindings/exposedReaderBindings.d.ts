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

export declare const BarcodeFormat: {
  readonly AZTEC: 'Aztec';
  readonly CODABAR: 'Codabar';
  readonly CODE_39: 'Code39';
  readonly CODE_93: 'Code93';
  readonly CODE_128: 'Code128';
  readonly DATA_MATRIX: 'DataMatrix';
  readonly EAN_8: 'EAN8';
  readonly EAN_13: 'EAN13';
  readonly ITF: 'ITF';
  readonly MAXICODE: 'MaxiCode';
  readonly PDF_417: 'PDF417';
  readonly QR_CODE: 'QRCode';
  readonly RSS_14: 'RSS14';
  readonly RSS_EXPANDED: 'RSSExpanded';
  readonly UPC_A: 'UPCA';
  readonly UPC_E: 'UPCE';
  readonly UPC_EAN_EXTENSION: 'UPCEANExtension';
};

export type BarcodeFormatType = typeof BarcodeFormat[keyof typeof BarcodeFormat];