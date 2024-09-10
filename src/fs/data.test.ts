import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { writeToArbitraryFile } from "./data.js";
import { switchToTempDirectory } from "./temp.js";
import { assertExisting } from "./paths.js";

describe("Writing a file to an arbitrary file", () => {
  it("should write the file, creating the intermediate directories", () =>
    switchToTempDirectory(async () => {
      const expectedString = "My test";

      const file = join("a", "b", "c", "d.txt");

      await writeToArbitraryFile(file, expectedString);

      const actualString = await readFile(file, { encoding: "utf8" });

      expect(actualString).toBe(expectedString);
    }));

  describe("when passing no text content", () => {
    it("should still create the file", () =>
      switchToTempDirectory(async () => {
        const testFile = join("a", "b", "c", "d.txt");

        await writeToArbitraryFile(testFile);

        await assertExisting(testFile);
      }));
  });
});
