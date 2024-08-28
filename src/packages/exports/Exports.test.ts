import { describe, it, expect } from "vitest";
import { RawExports } from "./RawExports.js";
import { parseExports } from "./Exports.js";
import { Export } from "./Export.js";

describe("Parsing raw exports", () => {
  it("should return concrete exports", () => {
    const rawExports: RawExports = {
      cip: {
        import: "i1",
        types: "t1"
      },

      ciop: {
        import: "i2",
        types: "t2"
      }
    };

    const concreteExports = parseExports(rawExports);

    expect(concreteExports).toEqual(
      new Map<string, Export>([
        [
          "cip",
          {
            import: "i1",
            types: "t1"
          }
        ],

        [
          "ciop",
          {
            import: "i2",
            types: "t2"
          }
        ]
      ])
    );
  });
});
