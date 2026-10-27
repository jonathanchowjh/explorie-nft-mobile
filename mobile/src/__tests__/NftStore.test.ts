import { describe, expect, it } from "@jest/globals";
import { findNft, searchNfts, toWallet } from "../state/NftStore";
import { parseClaimQr } from "../api";

describe("toWallet", () => {
  it("keeps the server's order and skips drops the app doesn't know", () => {
    const wallet = toWallet([
      { unit: "b", dropId: "6", redeemed: true },
      { unit: "x", dropId: "99", redeemed: false },
      { unit: "a", dropId: "1", redeemed: false },
    ]);
    expect(wallet.map((n) => [n.title, n.unit, n.redeemed])).toEqual([
      ["Pop UP by Reggie Watts", "b", true],
      ["0N1 Force #2819", "a", false],
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

describe("parseClaimQr", () => {
  it("reads the drop id and claim code from a poster", () => {
    expect(parseClaimQr("explorie:10:0123456789abcdef")).toEqual({ dropId: "10", code: "0123456789abcdef" });
  });

  it("rejects anything else", () => {
    expect(parseClaimQr("5")).toBeNull();
    expect(parseClaimQr("https://example.com")).toBeNull();
    expect(parseClaimQr("explorie:5:")).toBeNull();
  });
});
