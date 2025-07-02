import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);

let zxingInstance: any = null;

export async function loadZxingFull() {
  if (zxingInstance) return zxingInstance;

  const ZXingFactory = (await import('../../../public/zxing/zxing_full.js')).default;

  const wasmPath = path.resolve(process.cwd(), 'public/zxing/zxing_full.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);

  console.log("Loading zxing wasm from:", wasmPath);

  zxingInstance = await ZXingFactory({
    wasmBinary,
  });

  return zxingInstance;
}
