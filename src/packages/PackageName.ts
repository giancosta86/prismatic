/**
 * Package name split into its components.
 */
export class PackageName {
  private static readonly RAW_NAME_REGEX = /(?:(@[^/]+)\/)?(.+)/;

  /**
   * Parses the package name from a raw string.
   */
  static parse(rawName: string): PackageName {
    const matchResult = PackageName.RAW_NAME_REGEX.exec(rawName);

    if (!matchResult) {
      throw new Error(`Invalid package name: '${rawName}'`);
    }

    return new PackageName(matchResult[1], matchResult[2]!);
  }

  private constructor(
    readonly scope: string | undefined,
    readonly basename: string
  ) {}

  /**
   * Converts the name to its package.json "name" field format.
   */
  toString() {
    return this.scope ? `${this.scope}/${this.basename}` : this.basename;
  }
}
