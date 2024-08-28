import { RawDependencies } from "./dependencies/index.js";
import { RawExports } from "./exports/RawExports.js";

/**
 * Raw package.json descriptor.
 */
export type RawPackageDescriptor = Readonly<{
  name: string;
  version: string;
  dependencies?: RawDependencies;
  devDependencies?: RawDependencies;
  exports?: RawExports;
}>;
