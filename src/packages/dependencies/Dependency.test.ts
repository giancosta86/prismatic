import { describe, it, expect } from "vitest";
import { Dependency } from "./Dependency.js";

describe("Dependency", () => {
  it("should be convertible to string", () => {
    const dependency = new Dependency("alpha", "1.0.0");

    expect(dependency.toString()).toBe("alpha@1.0.0");
  });
});
