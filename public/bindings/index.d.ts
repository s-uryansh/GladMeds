export interface ReaderOptions {
  formats?: string[];
  tryHarder?: boolean;
  tryRotate?: boolean;
  tryInvert?: boolean;
  tryDownscale?: boolean;
  isPure?: boolean;
  returnCodabarStartEnd?: boolean;
  returnErrors?: boolean;
  characterSet?: string;
  minLineCount?: number;
  maxNumberOfSymbols?: number;
  tryCode39ExtendedMode?: boolean;
  validateCode39CheckSum?: boolean;
  validateITFCheckSum?: boolean;
}

export interface WriterOptions {
  format: string;
  width?: number;
  height?: number;
  margin?: number;
  eccLevel?: number;
  encoding?: string;
}