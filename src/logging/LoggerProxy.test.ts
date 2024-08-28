import { describe, it, expect, vi } from "vitest";
import { Logger } from "./Logger.js";
import { LoggerProxy } from "./LoggerProxy.js";

describe("Logger proxy", () => {
  it("should actually delegate calls to its wrapped instance", () => {
    const wrapped: Logger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    };

    const proxy = new LoggerProxy(wrapped);

    proxy.info("test info");
    proxy.warn("test warning");
    proxy.error("test error");

    expect(wrapped.info).toHaveBeenCalledWith("test info");
    expect(wrapped.warn).toHaveBeenCalledWith("test warning");
    expect(wrapped.error).toHaveBeenCalledWith("test error");
  });

  it("should support changing instance", () => {
    const original: Logger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    };

    const proxy = new LoggerProxy(original);

    const replacement: Logger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    };

    proxy.instance = replacement;

    proxy.info("test info");
    proxy.warn("test warning");
    proxy.error("test error");

    expect(original.info).toHaveBeenCalledTimes(0);
    expect(original.warn).toHaveBeenCalledTimes(0);
    expect(original.error).toHaveBeenCalledTimes(0);

    expect(replacement.info).toHaveBeenCalledWith("test info");
    expect(replacement.warn).toHaveBeenCalledWith("test warning");
    expect(replacement.error).toHaveBeenCalledWith("test error");
  });
});
