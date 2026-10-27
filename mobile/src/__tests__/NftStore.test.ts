import { describe, expect, it } from "@jest/globals";
import { collect, findNft, redeem, searchNfts } from "../state/NftStore";

describe("collect", () => {
  it("adds an NFT to the end of the wallet, unredeemed", () => {
    expect(collect([{ id: "1", redeemed: true }], "2")).toEqual([
      { id: "1", redeemed: true },
      { id: "2", redeemed: false },
    ]);
  });

  it("ignores an NFT that is already owned", () => {
    const owned = [{ id: "1", redeemed: true }];
    expect(collect(owned, "1")).toBe(owned);
  });
});

describe("redeem", () => {
  it("marks only that NFT redeemed and keeps wallet order", () => {
    const owned = [
      { id: "6", redeemed: false },
      { id: "11", redeemed: false },
    ];
    expect(redeem(owned, "6")).toEqual([
      { id: "6", redeemed: true },
      { id: "11", redeemed: false },
    ]);
  });
});

describe("searchNfts", () => {
  it("matches title case-insensitively", () => {
    expect(searchNfts("PIZZA").map((n) => n.id)).toEqual(["10"]);
  });

  it("matches location name", () => {
    expect(searchNfts("madison").map((n) => n.id)).toEqual(["5"]);
  });
});

describe("findNft", () => {
  it("throws for an unknown id", () => {
    expect(() => findNft("nope")).toThrow("No NFT with id nope");
  });
});
