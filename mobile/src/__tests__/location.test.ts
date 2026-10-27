import { describe, expect, it } from "@jest/globals";
import { distanceMetres, formatDistance } from "../location";

describe("distanceMetres", () => {
  it("agrees with the server's sum", () => {
    // Madison Square Garden to 0N1 Force, as server/src/claims.ts computes it.
    const metres = distanceMetres(
      { latitude: 40.7547105, longitude: -73.9856321 },
      { latitude: 40.7596569, longitude: -73.9830029 },
    );
    expect(metres).toBeCloseTo(592.92, 1);
  });
});

describe("formatDistance", () => {
  it("rounds metres to tens, then kilometres to one decimal, then to whole kilometres", () => {
    expect([4, 593, 994, 996, 1121, 9_940, 9_960, 12_400].map(formatDistance)).toEqual([
      "0 m",
      "590 m",
      "990 m",
      "1.0 km",
      "1.1 km",
      "9.9 km",
      "10 km",
      "12 km",
    ]);
  });
});
