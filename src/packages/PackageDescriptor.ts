import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Dependencies } from "./dependencies/index.js";
import { Exports, parseExports } from "./exports/index.js";
import { RawPackageDescriptor } from "./RawPackageDescriptor.js";
import { PackageName } from "./PackageName.js";

/**
 * Package descriptor for a NodeJS project.
 */
export class PackageDescriptor {
  /**
   * Loads the package descriptor from the given raw descriptor.
   */
  public static from(rawDescriptor: RawPackageDescriptor): PackageDescriptor {
    const packageName = PackageName.parse(rawDescriptor.name);
    const dependencies = Dependencies.fromRaw(rawDescriptor.dependencies ?? {});
    const devDependencies = Dependencies.fromRaw(
      rawDescriptor.devDependencies ?? {}
    );
    const exports = parseExports(rawDescriptor.exports ?? {});

    return new PackageDescriptor(
      packageName,
      rawDescriptor.version,
      dependencies,
      devDependencies,
      exports
    );
  }

  /**
   * Parses the package descriptor from a file.
   */
  public static async fromFile(
    packageDescriptorFile: string
  ): Promise<PackageDescriptor> {
    const descriptorString = await readFile(packageDescriptorFile, {
      encoding: "utf8"
    });

    const rawPackageDescriptor = JSON.parse(
      descriptorString
    ) as RawPackageDescriptor;

    return PackageDescriptor.from(rawPackageDescriptor);
  }

  /**
   * Parses the "package.json" file from the requested directory.
   *
   * The directory is obtained by chaining the components,
   *  often using `import.meta.dirname`
   */
  public static fromDirectory(
    ...directoryPathComponents: readonly string[]
  ): Promise<PackageDescriptor> {
    const packageDescriptorFile = join(
      ...directoryPathComponents,
      "package.json"
    );

    return PackageDescriptor.fromFile(packageDescriptorFile);
  }

  private constructor(
    readonly name: PackageName,
    readonly version: string,
    readonly dependencies: Dependencies,
    readonly devDependencies: Dependencies,
    readonly exports: Exports
  ) {}
}
