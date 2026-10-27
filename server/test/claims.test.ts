import { test } from "node:test";
import assert from "node:assert/strict";
import { generateEmulatorAccountFromPrivateKey } from "@lucid-evolution/lucid";
import { claimCode, distanceMetres, isClaimCode, keyAddress, nftName } from "../src/claims.ts";

test("distanceMetres matches a known distance", () => {
  // Times Square to Madison Square Garden is about 1.06 km.
  const timesSquare = { latitude: 40.758, longitude: -73.9855 };
  const garden = { latitude: 40.7505, longitude: -73.9934 };
  assert.ok(Math.abs(distanceMetres(timesSquare, garden) - 1060) < 30);
  assert.equal(distanceMetres(garden, garden), 0);
});

test("claim codes are per drop and per secret", () => {
  assert.notEqual(claimCode("s", "1"), claimCode("s", "2"));
  assert.notEqual(claimCode("s", "1"), claimCode("t", "1"));
  assert.ok(isClaimCode("s", "1", claimCode("s", "1")));
  assert.ok(!isClaimCode("s", "1", claimCode("s", "2")));
  assert.ok(!isClaimCode("s", "1", "short"));
});

test("nftName matches the value pinned in the Aiken tests", () => {
  // contracts/validators/explorie_nft.ak, test name_matches_lucid.
  assert.equal(nftName("33".repeat(32), 1), "72037a4e3948b11ecdd039e095c8c5cb2b6878c8d9265fac7dd17d91ad9e5723");
  assert.throws(() => nftName("33".repeat(32), 256));
});

test("keyAddress gives the address Lucid gives the same key", () => {
  const account = generateEmulatorAccountFromPrivateKey({ lovelace: 0n });
  assert.equal(keyAddress(account.privateKey, "Custom"), account.address);
});
