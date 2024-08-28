import { describe, it, expect, beforeEach, vi } from "vitest";
import { ConsoleLogger } from "./ConsoleLogger.js";

describe("Console-based backend", () => {
  let consoleLogger: ConsoleLogger;

  beforeEach(() => {
    consoleLogger = new ConsoleLogger();
  });

  it("should output info", () => {
    const consoleSpy = vi.spyOn(console, "info");

    consoleLogger.info("<TEST INFO>");

    expect(consoleSpy).toHaveBeenCalledWith("<TEST INFO>");
  });

  it("should output warnings", () => {
    const consoleSpy = vi.spyOn(console, "warn");

    consoleLogger.warn("<TEST WARN>");

    expect(consoleSpy).toHaveBeenCalledWith("<TEST WARN>");
  });

  it("should output errors", () => {
    const consoleSpy = vi.spyOn(console, "error");

    consoleLogger.error("<TEST ERROR>");

    expect(consoleSpy).toHaveBeenCalledWith("<TEST ERROR>");
  });
});
