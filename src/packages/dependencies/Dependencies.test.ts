import { describe, it, expect } from "vitest";
import { RawDependencies } from "./RawDependencies.js";
import { Dependencies } from "./Dependencies.js";
import { Dependency } from "./Dependency.js";

describe("Dependencies", () => {
  it("should be obtained from raw dependencies", () => {
    const rawDependencies: RawDependencies = {
      alpha: "1.0",
      beta: "2.0"
    };

    const dependencies = Dependencies.fromRaw(rawDependencies);

    const dependencyStrings = [...dependencies].map(dependency =>
      dependency.toString()
    );

    expect(dependencyStrings.sort()).toEqual(["alpha@1.0", "beta@2.0"]);
  });

  it("should be obtained from an iterable of dependencies", () => {
    const source: readonly Dependency[] = [
      new Dependency("alpha", "1.0"),
      new Dependency("beta", "2.0")
    ];

    const dependencies = Dependencies.from(source);

    expect(dependencies.toRaw()).toEqual({
      alpha: "1.0",
      beta: "2.0"
    });
  });

  it("should be convertible into a dependency group", () => {
    const dependencies = Dependencies.from([
      new Dependency("alpha", "1.0"),
      new Dependency("beta", "2.0")
    ]);

    const rawDependencies = dependencies.toRaw();

    expect(rawDependencies).toEqual({
      alpha: "1.0",
      beta: "2.0"
    });
  });

  describe("length", () => {
    it("should have the correct number of items", () => {
      const dependencies: readonly Dependency[] = [
        new Dependency("alpha", "1.0"),
        new Dependency("beta", "2.0")
      ];

      expect(dependencies.length).toBe(2);
    });
  });

  describe("filtering", () => {
    describe("when requesting existing dependencies", () => {
      it("should actually filter the dependencies", () => {
        const originalDependencies = Dependencies.from([
          new Dependency("alpha", "1.0"),
          new Dependency("beta", "2.0"),
          new Dependency("gamma", "3.0")
        ]);

        const filteredDependencies = originalDependencies.filterByNames([
          "alpha",
          "gamma"
        ]);

        expect(filteredDependencies.toRaw()).toEqual({
          alpha: "1.0",
          gamma: "3.0"
        });
      });
    });

    describe("when expecting a missing dependency", () => {
      it("should throw", () => {
        expect(() => {
          Dependencies.from([new Dependency("alpha", "1.0")]).filterByNames([
            "gamma"
          ]);
        }).toThrow("Missing expected dependency: 'gamma'");
      });
    });

    describe("when passing an empty array of expected names", () => {
      it("should throw", () => {
        expect(() => {
          Dependencies.from([new Dependency("alpha", "1.0")]).filterByNames([]);
        }).toThrow("The list of expected dependency names cannot be empty");
      });
    });
  });

  describe("merging", () => {
    it("should never alter either operand", () => {
      const left = Dependencies.fromRaw({
        alpha: "1.0"
      });

      const right = Dependencies.fromRaw({
        sigma: "3.0"
      });

      left.merge(right);

      expect(left.toRaw()).toEqual({
        alpha: "1.0"
      });

      expect(right.toRaw()).toEqual({
        sigma: "3.0"
      });
    });

    describe("when there is no overlap", () => {
      it("should work", () => {
        const left = Dependencies.fromRaw({
          alpha: "1.0"
        });

        const right = Dependencies.fromRaw({
          sigma: "3.0"
        });

        const result = left.merge(right);

        expect(result.toRaw()).toEqual({
          alpha: "1.0",
          sigma: "3.0"
        });
      });
    });

    describe("when there is partial overlap", () => {
      it("should overwrite the common dependencies", () => {
        const left = Dependencies.fromRaw({
          alpha: "1.0",
          beta: "2.0"
        });

        const right = Dependencies.fromRaw({
          beta: "2.5",
          sigma: "3.0"
        });

        const result = left.merge(right);

        expect(result.toRaw()).toEqual({
          alpha: "1.0",
          beta: "2.5",
          sigma: "3.0"
        });
      });
    });
  });
});
