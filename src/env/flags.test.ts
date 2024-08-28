import { describe, it, expect } from "vitest";
import { withEnv, withFlag, withoutFlag } from "./setting.js";
import { Flag } from "./flags.js";

const TEST_FLAG = new Flag("___PRISMATIC_TEST_FLAG___");

describe("Flag", () => {
  describe("when the env variable is missing", () => {
    it("should be disabled", () =>
      withoutFlag(TEST_FLAG, () => {
        expect(TEST_FLAG.isEnabled()).toBe(false);
      }));
  });

  describe("when the env variable is set to the ON value", () => {
    it("should be enabled", () =>
      withFlag(TEST_FLAG, () => {
        expect(TEST_FLAG.isEnabled()).toBe(true);
      }));
  });

  describe("when the env variable is set to another value", () => {
    it("should be disabled", () => {
      withEnv(TEST_FLAG.name, "<SOME VALUE>", () => {
        expect(TEST_FLAG.isEnabled()).toBe(false);
      });
    });
  });
});
