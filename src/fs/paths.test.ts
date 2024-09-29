import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { exists, switchToDirectory, safeRm } from "./paths.js";
import { writeToArbitraryFile } from "./data.js";
import { switchToTempDirectory, withTempDirectory } from "./temp.js";

describe("File existence", () => {
  describe("if the file exists", () => {
    it("should return true", () =>
      switchToTempDirectory(async () => {
        await writeToArbitraryFile("alpha.txt", "alpha");

        const result = await exists("alpha.txt");

        expect(result).toBe(true);
      }));
  });

  describe("if the file is missing", () => {
    it("should return false", () =>
      switchToTempDirectory(async () => {
        const result = await exists("<MISSING>");

        expect(result).toBe(false);
      }));
  });
});

describe("Switching to a directory", () => {
  it("should change to the requested directory", () =>
    withTempDirectory("prismatic", (tempDirectory) =>
      switchToDirectory(tempDirectory, () => {
        expect(process.cwd()).toBe(tempDirectory);
      })
    ));

  it("should revert to the original directory in the end", () =>
    withTempDirectory("prismatic", async (tempDirectory) => {
      const oldDirectory = process.cwd();

      await switchToDirectory(tempDirectory, () => {});

      expect(process.cwd()).toBe(oldDirectory);
    }));
});

describe("Safe removal", () => {
  describe("when removing a directory tree", () => {
    it("should work", () =>
      switchToTempDirectory(async () => {
        await writeToArbitraryFile(join("a", "b", "c", "d.txt"), "Dodo");

        await safeRm("a");

        expect("a").not.toExistInFileSystem();
      }));
  });

  describe("when removing a file", () =>
    it("should work", () =>
      switchToTempDirectory(async () => {
        const testFile = join("a", "b", "c", "d.txt");

        await writeToArbitraryFile(testFile);

        await safeRm(testFile);

        expect(testFile).not.toExistInFileSystem();
      })));

  describe("when the path is missing", () => {
    it("should still work", () =>
      switchToTempDirectory(async () => {
        await safeRm("<MISSING>");
      }));
  });

  describe("when more directories and files are removed at once", () => {
    it("should remove them all", () =>
      switchToTempDirectory(async () => {
        await writeToArbitraryFile(join("a", "b", "c", "d.txt"));
        await writeToArbitraryFile(join("r", "sigma.txt"));
        await writeToArbitraryFile("x.txt");
        await writeToArbitraryFile("y.txt");

        await safeRm("a", "r", "x.txt", "y.txt");

        expect("a").not.toExistInFileSystem();
        expect("r").not.toExistInFileSystem();
        expect("x.txt").not.toExistInFileSystem();
        expect("t.txt").not.toExistInFileSystem();
      }));
  });

  it("should support globs", () =>
    switchToTempDirectory(async () => {
      await writeToArbitraryFile(join("a", "b", "c", "d.txt"));

      await writeToArbitraryFile("alpha.txt");

      await writeToArbitraryFile("az.txt");

      await safeRm("a*");

      expect("a").not.toExistInFileSystem();
      expect("alpha.txt").not.toExistInFileSystem();
      expect("az.txt").not.toExistInFileSystem();
    }));
});
