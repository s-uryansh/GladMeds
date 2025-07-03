export interface ZXingModuleOverrides {
  locateFile?: (path: string, scriptDirectory: string) => string;
  onRuntimeInitialized?: () => void;
  print?: (text: string) => void;
  printErr?: (text: string) => void;
}

export interface ZXingFullModule {
  cwrap: any;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  HEAPU8: Uint8Array;
  ready: Promise<void>;
}

export interface PrepareZXingModuleOptions {
  overrides?: ZXingModuleOverrides;
  equalityFn?: (a: any, b: any) => boolean;
  fireImmediately?: boolean;
}

export function prepareZXingModuleWithFactory(
  factory: () => Promise<ZXingFullModule>,
  options?: PrepareZXingModuleOptions
): void | Promise<ZXingFullModule>;

export function purgeZXingModuleWithFactory(factory: () => Promise<ZXingFullModule>): void;

export function readBarcodesWithFactory(
  factory: () => Promise<ZXingFullModule>,
  input: Blob | ArrayBuffer | Uint8Array | ImageData,
  readerOptions?: any
): Promise<any>;

export function writeBarcodeWithFactory(
  factory: () => Promise<ZXingFullModule>,
  input: string | Uint8Array,
  writerOptions?: any
): Promise<any>;

export const ZXING_CPP_COMMIT: string;
export const ZXING_WASM_VERSION: string;