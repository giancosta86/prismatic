import { Export } from "./Export.js";
import { RawExports } from "./RawExports.js";

/**
 * A map of exports.
 */
export type Exports = ReadonlyMap<string, Export>;

export function parseExports(rawExports: RawExports): Exports {
  return new Map(Object.entries(rawExports));
}
