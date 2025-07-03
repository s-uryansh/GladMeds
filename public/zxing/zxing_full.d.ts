import type { ZXingFullModule, ZXingModuleOverrides } from "../share.js";

declare function zxingModuleFactory(overrides?: ZXingModuleOverrides): Promise<ZXingFullModule>;
export default zxingModuleFactory;