import { RawExport } from "./RawExport.js";

/**
 * Raw exports group within a package.json descriptor.
 */
export type RawExports = Readonly<{
  [moduleName: string]: RawExport;
}>;
