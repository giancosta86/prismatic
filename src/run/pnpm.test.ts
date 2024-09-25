import { describe, it, expect, vi } from "vitest";
import child_process, { SpawnOptionsWithoutStdio } from "node:child_process";
import { runWithPnpm } from "./pnpm.js";

const FAKE_ERROR_TRIGGER = "<ERROR>";
const FAKE_ERROR_MESSAGE = "Really arbitrary testing error";

vi.mock("node:child_process", async (importOriginal) => {
  const originalModule: typeof child_process = await importOriginal();

  const fakeSpawn = (command: string, options?: SpawnOptionsWithoutStdio) =>
    options instanceof Array && options[0] == FAKE_ERROR_TRIGGER
      ? ({
          on(message: string, callback: (...args: unknown[]) => void) {
            if (message == "error") {
              callback(new Error(FAKE_ERROR_MESSAGE));
            }
          },
        } as ReturnType<typeof originalModule.spawn>)
      : originalModule.spawn(command, options);

  return {
    ...originalModule,
    spawn: fakeSpawn,
  };
});

describe("Running via pnpm", async () => {
  describe("when running a valid command", () => {
    it("should work", () => runWithPnpm("--version"));
  });

  describe("when running an invalid command", () => {
    it("should reject", () =>
      expect(runWithPnpm("<UNKNOWN COMMAND>")).rejects.toThrow(
        "The invoked process exited with code:"
      ));
  });

  describe("when running a process raising an error", () => {
    it("should reject", () =>
      expect(runWithPnpm(FAKE_ERROR_TRIGGER)).rejects.toThrow(
        FAKE_ERROR_MESSAGE
      ));
  });
});
