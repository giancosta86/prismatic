import { join, sep as pathSeparator } from "node:path";
import { PackageName } from "./PackageName.js";

/**
 * Returns a path within a dependency package.
 *
 * The returned path is always relative and starting with `node_modules/`.
 */
export function getPathInPackage(
  packageName: PackageName,
  relativePathComponents: readonly string[]
): string {
  const packageAsDirectory = packageName.toString().replace("/", pathSeparator);

  return join("node_modules", packageAsDirectory, ...relativePathComponents);
}
