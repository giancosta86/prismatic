import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { getPathInPackage } from "./resources.js";
import { PackageName } from "./PackageName.js";

describe("Getting a path within a package", () => {
  describe("when the package has no namespace", () => {
    it("should be able to retrieve the package root", () => {
      const expectedPath = join("node_modules", "lodash");

      const actualPath = getPathInPackage(PackageName.parse("lodash"), []);

      expect(actualPath).toBe(expectedPath);
    });

    it("should be able to retrieve a root file", () => {
      const expectedPath = join("node_modules", "lodash", "README");

      const actualPath = getPathInPackage(PackageName.parse("lodash"), [
        "README"
      ]);

      expect(actualPath).toBe(expectedPath);
    });

    it("should be able to retrieve a nested file", () => {
      const expectedPath = join(
        "node_modules",
        "lodash",
        "alpha",
        "beta",
        "gamma.txt"
      );

      const actualPath = getPathInPackage(PackageName.parse("lodash"), [
        "alpha",
        "beta",
        "gamma.txt"
      ]);

      expect(actualPath).toBe(expectedPath);
    });
  });

  describe("when the package has a namespace", () => {
    it("should be able to retrieve the package root", () => {
      const expectedPath = join("node_modules", "@giancosta86", "example");

      const actualPath = getPathInPackage(
        PackageName.parse("@giancosta86/example"),
        []
      );

      expect(actualPath).toBe(expectedPath);
    });

    it("should be able to retrieve a root file", () => {
      const expectedPath = join(
        "node_modules",
        "@giancosta86",
        "example",
        "README"
      );

      const actualPath = getPathInPackage(
        PackageName.parse("@giancosta86/example"),
        ["README"]
      );

      expect(actualPath).toBe(expectedPath);
    });

    it("should be able to retrieve a nested file", () => {
      const expectedPath = join(
        "node_modules",
        "@giancosta86",
        "example",
        "alpha",
        "beta",
        "gamma.txt"
      );

      const actualPath = getPathInPackage(
        PackageName.parse("@giancosta86/example"),
        ["alpha", "beta", "gamma.txt"]
      );

      expect(actualPath).toBe(expectedPath);
    });
  });
});
