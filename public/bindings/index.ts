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

export function createReaderOptions(options: Partial<ReaderOptions> = {}): ReaderOptions {
  return {
    formats: options.formats || [],
    tryHarder: options.tryHarder || false,
    tryRotate: options.tryRotate || false,
    tryInvert: options.tryInvert || false,
    tryDownscale: options.tryDownscale || false,
    isPure: options.isPure || false,
    returnCodabarStartEnd: options.returnCodabarStartEnd || false,
    returnErrors: options.returnErrors || false,
    characterSet: options.characterSet || 'UTF-8',
    minLineCount: options.minLineCount || 1,
    maxNumberOfSymbols: options.maxNumberOfSymbols || 1,
    tryCode39ExtendedMode: options.tryCode39ExtendedMode || false,
    validateCode39CheckSum: options.validateCode39CheckSum || false,
    validateITFCheckSum: options.validateITFCheckSum || false,
    ...options
  };
}

export function createWriterOptions(options: Partial<WriterOptions> = {}): WriterOptions {
  return {
    format: options.format || 'QRCode',
    width: options.width || 200,
    height: options.height || 200,
    margin: options.margin || 10,
    eccLevel: options.eccLevel || 0,
    encoding: options.encoding || 'UTF-8',
    ...options
  };
}