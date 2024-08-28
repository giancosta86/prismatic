import { describe, it, expect, beforeAll } from "vitest";
import { env } from "node:process";
import { withEnv, withoutEnv } from "./setting.js";

const TEST_ENV_VAR = "___MY_TEST_VARIABLE___";

describe("Temporarily setting an environment variable", () => {
  describe("when the variable is initally missing", () => {
    beforeAll(() => {
      delete env[TEST_ENV_VAR];
    });

    it("should set it correctly", () =>
      withEnv(TEST_ENV_VAR, "dodo", () => {
        expect(env[TEST_ENV_VAR]).toBe("dodo");
      }));

    it("should delete it in the end", async () => {
      await withEnv(TEST_ENV_VAR, "dodo", () => {});

      expect(Object.keys(env)).not.contains(TEST_ENV_VAR);
    });
  });

  describe("when the variable has an initial value", () => {
    beforeAll(() => {
      env[TEST_ENV_VAR] = "ciop";
    });

    it("should set it correctly", () =>
      withEnv(TEST_ENV_VAR, "dodo", () => {
        expect(env[TEST_ENV_VAR]).toBe("dodo");
      }));

    it("should delete it in the end", async () => {
      await withEnv(TEST_ENV_VAR, "dodo", () => {});

      expect(env[TEST_ENV_VAR]).toBe("ciop");
    });
  });
});

describe("Temporarily removing an environment variable", () => {
  describe("when the variable is initially missing", () => {
    beforeAll(() => {
      delete env[TEST_ENV_VAR];
    });

    it("should leave it missing", () =>
      withoutEnv(TEST_ENV_VAR, () => {
        expect(Object.keys(env)).not.toContain(TEST_ENV_VAR);
      }));
  });

  describe("when the variable has an initial value", () => {
    beforeAll(() => {
      env[TEST_ENV_VAR] = "ciop";
    });

    it("should delete it", () =>
      withoutEnv(TEST_ENV_VAR, () => {
        expect(Object.keys(env)).not.toContain(TEST_ENV_VAR);
      }));

    it("should restore the value in the end", async () => {
      await withoutEnv(TEST_ENV_VAR, () => {});

      expect(env[TEST_ENV_VAR]).toBe("ciop");
    });
  });
});
