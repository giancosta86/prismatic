import { describe, it, expect } from "vitest";
import { PackageName } from "./PackageName.js";

describe("Package name", () => {
  describe("parsing", () => {
    describe("when there is no scope", () => {
      it("should find no scope", () => {
        const packageName = PackageName.parse("example");
        expect(packageName.scope).toBeUndefined();
      });

      it("should retrieve the basename", () => {
        const packageName = PackageName.parse("example");
        expect(packageName.basename).toBe("example");
      });
    });

    describe("when there is a scope", () => {
      it("should detect the scope", () => {
        const packageName = PackageName.parse("@giancosta86/example");
        expect(packageName.scope).toBe("@giancosta86");
      });

      it("should retrieve the basename", () => {
        const packageName = PackageName.parse("@giancosta86/example");
        expect(packageName.basename).toBe("example");
      });
    });

    describe("when the format is not valid", () => {
      it("should throw", () => {
        expect(() => {
          PackageName.parse("");
        }).toThrow("Invalid package name: ''");
      });
    });
  });

  describe.each([
    {
      description: "when there is no scope",
      nameAsString: "example"
    },

    {
      description: "when there is a scope",
      nameAsString: "@giancosta86/example"
    }
  ])("converting to string", ({ description, nameAsString }) => {
    describe(description, () => {
      it("should work", () => {
        const packageName = PackageName.parse(nameAsString);
        expect(packageName.toString()).toBe(nameAsString);
      });
    });
  });
});
