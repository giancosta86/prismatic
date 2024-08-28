import { describe, it, expect } from "vitest";
import { tmpdir } from "node:os";
import { basename } from "node:path";
import { PrismaticFlags, withFlag } from "~/env";
import {
  withTempDirectory,
  switchToTempDirectory,
  createTempDirectory,
  rmTempDirectory
} from "./temp.js";
import { assertExisting, assertMissing } from "./paths.js";

describe("Creating a temp directory", () => {
  it("should return a path starting with the system temp root", async () => {
    const tempDirectory = await createTempDirectory("prismatic");
    expect(tempDirectory).matches(new RegExp(`^${tmpdir()}`));
  });

  it("should actually create the temp directory", async () => {
    const tempDirectory = await createTempDirectory("prismatic");
    assertExisting(tempDirectory);
  });

  it("should have a basename starting with the given basename and underscore", async () => {
    const tempDirectory = await createTempDirectory("mytest");
    expect(basename(tempDirectory).startsWith("mytest_"));
  });
});

describe("Deleting a temp directory", () => {
  describe("by default", () => {
    it("should delete the directory", async () => {
      const tempDirectory = await createTempDirectory("prismatic");

      await assertExisting(tempDirectory);

      await rmTempDirectory(tempDirectory);

      await assertMissing(tempDirectory);
    });
  });

  describe("when the flag to keep temporary directories is enabled", () => {
    it("should keep the directory", async () => {
      await withFlag(PrismaticFlags.keepTempDirectory, async () => {
        const tempDirectory = await createTempDirectory("prismatic");
        await rmTempDirectory(tempDirectory);

        await assertExisting(tempDirectory);
      });
    });
  });
});

describe("Requesting a disposable temp directory", () => {
  it("should return a path starting with the system temp root", () =>
    withTempDirectory("prismatic", async tempDirectory => {
      expect(tempDirectory).matches(RegExp(`^${tmpdir()}`));
    }));

  it("should return a brand-new temp directory", () =>
    withTempDirectory("prismatic", tempDirectory =>
      assertExisting(tempDirectory)
    ));

  it("should have a basename starting with the given basename and underscore", () =>
    withTempDirectory("mytest", tempDirectory => {
      expect(basename(tempDirectory).startsWith("mytest_"));
    }));

  describe("by default", () => {
    it("should delete the temp directory", async () => {
      let createdDirectory: string = "";

      await withTempDirectory("prismatic", async tempDirectory => {
        createdDirectory = tempDirectory;
        await assertExisting(tempDirectory);
      });

      await assertMissing(createdDirectory);
    });
  });

  describe("when enabling the flag to keep the temp directory", () => {
    it("should keep the temp directory", () =>
      withFlag(PrismaticFlags.keepTempDirectory.name, async () => {
        let createdDirectory: string = "";

        await withTempDirectory("prismatic", async tempDirectory => {
          createdDirectory = tempDirectory;
          await assertExisting(tempDirectory);
        });

        await assertExisting(createdDirectory);
      }));
  });
});

describe("Switching to a temp directory", () => {
  it("should change to the temporary directory", () =>
    switchToTempDirectory("prismatic", tempDirectory => {
      expect(process.cwd()).toBe(tempDirectory);
    }));

  it("should revert to the original directory in the end", async () => {
    const oldDirectory = process.cwd();

    await switchToTempDirectory("prismatic", () => {});

    expect(process.cwd()).toBe(oldDirectory);
  });
});
