import { Dependency } from "./Dependency.js";
import { RawDependencies } from "./RawDependencies.js";

/**
 * A map of dependencies.
 */
export class Dependencies implements Iterable<Dependency> {
  /**
   * Parses a package.json {@link RawDependencies} group.
   */
  static fromRaw(rawDependencies: RawDependencies): Dependencies {
    const entries: readonly [string, Dependency][] = Object.entries(
      rawDependencies
    ).map(([name, version]) => [name, new Dependency(name, version)]);

    const entryMap = new Map<string, Dependency>(entries);

    return new Dependencies(entryMap);
  }

  /**
   * Reads items from an `Iterable` of {@link Dependency}.
   */
  static from(source: Iterable<Dependency>): Dependencies {
    const sourceMap = new Map(
      [...source].map(dependency => [dependency.name, dependency])
    );

    return new Dependencies(sourceMap);
  }

  public readonly length: number;

  private constructor(private readonly entryMap: Map<string, Dependency>) {
    this.length = entryMap.size;
  }

  /**
   * Iterates over the dependencies in alphabetical order
   */
  [Symbol.iterator](): Iterator<Dependency> {
    const sortedArray = [...this.entryMap.values()].sort((left, right) =>
      left.name.localeCompare(right.name)
    );

    return sortedArray[Symbol.iterator]();
  }

  /**
   * Returns a subset of the dependencies - the ones having the expected names.
   *
   * If at least one expected dependency is not in the source least, an exception is thrown.
   *
   * Similarly, at least one expected name must be passed - or an exception is thrown.
   */
  filterByNames(expectedNames: readonly string[]): Dependencies {
    if (!expectedNames.length) {
      throw new Error("The list of expected dependency names cannot be empty");
    }

    const filteredDependencies: readonly [string, Dependency][] = [
      ...this.entryMap.entries()
    ].filter(([dependencyName]) => expectedNames.includes(dependencyName));

    if (filteredDependencies.length < expectedNames.length) {
      const dependencyNames = [...this.entryMap.keys()];

      for (const expectedName of expectedNames) {
        if (!dependencyNames.includes(expectedName)) {
          throw new Error(`Missing expected dependency: '${expectedName}'`);
        }
      }
    }

    return new Dependencies(new Map(filteredDependencies));
  }

  /**
   * Merges the given dependencies, overwriting the existing ones
   */
  merge(other: Dependencies): Dependencies {
    const resultMap = new Map(this.entryMap);

    for (const dependency of other.entryMap.values()) {
      resultMap.set(dependency.name, dependency);
    }

    return new Dependencies(resultMap);
  }

  /**
   * Converts the dependencies into an instance of package.json {@link RawDependencies}.
   */
  toRaw(): RawDependencies {
    return Object.fromEntries(
      [...this].map(dependency => [dependency.name, dependency.version])
    );
  }
}
