import type { ReaderOptions, WriterOptions } from "./bindings/index.js";

export interface ZXingModuleOverrides {
  locateFile?: (path: string, scriptDirectory: string) => string;
  onRuntimeInitialized?: () => void;
  print?: (text: string) => void;
  printErr?: (text: string) => void;
  wasmBinary?: ArrayBuffer | Uint8Array;
  [key: string]: any; // Allow additional properties
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

let moduleInstance: ZXingFullModule | null = null;
let modulePromise: Promise<ZXingFullModule> | null = null;

export function prepareZXingModuleWithFactory(
  factory: () => Promise<ZXingFullModule>,
  options?: PrepareZXingModuleOptions
): void | Promise<ZXingFullModule> {
  if (options?.fireImmediately) {
    if (!modulePromise) {
      modulePromise = factory().then(module => {
        moduleInstance = module;
        return module;
      });
    }
    return modulePromise;
  }
  
  if (!modulePromise) {
    modulePromise = factory().then(module => {
      moduleInstance = module;
      return module;
    });
  }
}

export function purgeZXingModuleWithFactory(factory: () => Promise<ZXingFullModule>): void {
  moduleInstance = null;
  modulePromise = null;
}

export async function readBarcodesWithFactory(
  factory: () => Promise<ZXingFullModule>,
  input: Blob | ArrayBuffer | Uint8Array | ImageData,
  readerOptions?: ReaderOptions
) {
  const module = moduleInstance || await factory();
  
  return {
    results: [],
    errors: []
  };
}

export async function writeBarcodeWithFactory(
  factory: () => Promise<ZXingFullModule>,
  input: string | Uint8Array,
  writerOptions?: WriterOptions
) {
  const module = moduleInstance || await factory();
  
  return {
    data: new Uint8Array(),
    width: 0,
    height: 0,
    format: writerOptions?.format || 'QRCode'
  };
}

export const ZXING_CPP_COMMIT = "v1.4.0";
export const ZXING_WASM_VERSION = "1.4.0";