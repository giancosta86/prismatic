import { describe, it, expect } from "vitest";
import { dirname, join } from "node:path";
import { RawPackageDescriptor } from "./RawPackageDescriptor.js";
import { PackageDescriptor } from "./PackageDescriptor.js";
import { Export } from "./exports/index.js";

const PACKAGE_FILE = join(import.meta.dirname, "..", "..", "package.json");

describe("Package descriptor", () => {
  describe("converting from a raw descriptor", () => {
    describe("when only the basic fields are present", () => {
      it("should work", () => {
        const rawDescriptor: RawPackageDescriptor = {
          name: "@giancosta86/dodo",
          version: "1.0.2"
        };

        const descriptor = PackageDescriptor.from(rawDescriptor);
        expect(descriptor.name.toString()).toBe("@giancosta86/dodo");
        expect(descriptor.version).toBe("1.0.2");
        expect(descriptor.dependencies.length).toBe(0);
        expect(descriptor.devDependencies.length).toBe(0);
        expect(descriptor.exports.size).toBe(0);
      });
    });

    describe("when all the fields are specified", () => {
      it("should work", () => {
        const rawDescriptor: RawPackageDescriptor = {
          name: "@giancosta86/dodo",
          version: "1.0.2",
          dependencies: {
            alpha: "3.4",
            beta: "5.6"
          },
          devDependencies: {
            sigma: "7.8"
          },
          exports: {
            ciop: {
              import: "ciop_import",
              types: "ciop_types"
            }
          }
        };

        const descriptor = PackageDescriptor.from(rawDescriptor);
        expect(descriptor.name.toString()).toBe("@giancosta86/dodo");
        expect(descriptor.version).toBe("1.0.2");
        expect(
          [...descriptor.dependencies].map(dependency => dependency.toString())
        ).toEqual(["alpha@3.4", "beta@5.6"]);
        expect(
          [...descriptor.devDependencies].map(dependency =>
            dependency.toString()
          )
        ).toEqual(["sigma@7.8"]);
        expect(descriptor.exports).toEqual(
          new Map<string, Export>([
            ["ciop", { import: "ciop_import", types: "ciop_types" }]
          ])
        );
      });
    });
  });

  describe("loading from file", () => {
    it("should work", async () => {
      const loadedPackage = await PackageDescriptor.fromFile(
        PACKAGE_FILE
      );

      expect(loadedPackage.name.toString()).toBe("@giancosta86/prismatic");
    });
  });

  describe("loading from directory", () => {
    it("should work", async () => {
      const loadedPackage = await PackageDescriptor.fromDirectory(
        dirname(PACKAGE_FILE)
      );

      expect(loadedPackage.name.toString()).toBe("@giancosta86/prismatic");
    });
  });
});
