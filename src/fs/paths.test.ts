import { describe, it, expect } from "vitest";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  exists,
  assertExisting,
  assertMissing,
  assertExistence,
  switchToDirectory,
  safeRm,
} from "./paths.js";
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

describe("Asserting a file/directory exists in the file system", () => {
  describe("when the subject exists", () => {
    describe("when the subject is a file", () => {
      it("should resolve", () =>
        switchToTempDirectory(async () => {
          await writeFile("test.txt", "Test");
          await assertExisting("test.txt");
        }));
    });

    describe("when the subject is a directory", () => {
      it("should resolve", () =>
        switchToTempDirectory(async () => {
          await mkdir("my_dir");
          await assertExisting("my_dir");
        }));
    });
  });

  describe("when the subject is missing", () => {
    it("should reject", () =>
      switchToTempDirectory(() =>
        expect(assertExisting("<MISSING>")).rejects.toThrow(
          "Missing file or directory: '<MISSING>'"
        )
      ));
  });
});

describe("Asserting a file/directory is missing from the file system", () => {
  describe("when the subject exists", () => {
    describe("when the subject is a file", () => {
      it("should reject", () =>
        switchToTempDirectory(async () => {
          await writeFile("test.txt", "Test");
          await expect(assertMissing("test.txt")).rejects.toThrow(
            "File or directory 'test.txt' should not exist"
          );
        }));
    });

    describe("when the subject is a directory", () => {
      it("should reject", () =>
        switchToTempDirectory(async () => {
          await mkdir("my_dir");
          await expect(assertMissing("my_dir")).rejects.toThrow(
            "File or directory 'my_dir' should not exist"
          );
        }));
    });
  });

  describe("when the subject is missing", () => {
    it("should resolve", () =>
      switchToTempDirectory(() => assertMissing("<MISSING>")));
  });
});

describe("Asserting the existence of a file/directory", () => {
  describe("when asserting existence", () => {
    it("should work", () =>
      switchToTempDirectory(async () => {
        await writeToArbitraryFile("mytest.txt");
        await assertExistence("mytest.txt", true);
      }));
  });

  describe("when negating existence", () => {
    it("should work", () =>
      switchToTempDirectory(() => assertExistence("<MISSING>", false)));
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

        await assertMissing("a");
      }));
  });

  describe("when removing a file", () =>
    it("should work", () =>
      switchToTempDirectory(async () => {
        const testFile = join("a", "b", "c", "d.txt");

        await writeToArbitraryFile(testFile);

        await safeRm(testFile);

        await assertMissing(testFile);
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

        await assertMissing("a");
        await assertMissing("r");
        await assertMissing("x.txt");
        await assertMissing("t.txt");
      }));
  });
});
