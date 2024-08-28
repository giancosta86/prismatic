/**
 * A dependency, split into its core elements.
 */
export class Dependency {
  constructor(
    readonly name: string,
    readonly version: string
  ) {}

  /**
   * Converts the dependency to the `<name>@<version>` format.
   */
  toString(): string {
    return `${this.name}@${this.version}`;
  }
}
