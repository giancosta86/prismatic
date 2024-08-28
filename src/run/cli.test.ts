import { describe, it, expect } from "vitest";
import process from "node:process";
import { withCliArgs } from "./cli.js";

describe("Requesting custom CLI arguments", () => {
  it("should keep the first 2 argv items", async () => {
    const originalArgv = process.argv;

    await withCliArgs(["alpha", "beta", "gamma"], () => {
      expect(process.argv.slice(0, 2)).toEqual(originalArgv.slice(0, 2));
    });
  });

  it("should set the requested values", () =>
    withCliArgs(["A", "B", "C"], () => {
      expect(process.argv.slice(2, 5)).toEqual(["A", "B", "C"]);
    }));

  it("should restore the original argv in the end", async () => {
    const originalArgv = process.argv;

    await withCliArgs(["alpha", "beta", "gamma"], () => {
      //Just do nothing
    });

    expect(process.argv).toEqual(originalArgv);
  });
});
