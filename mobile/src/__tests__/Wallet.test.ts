import { describe, expect, it } from "@jest/globals";
import { ed25519 } from "@noble/curves/ed25519";
import { hexToBytes } from "@noble/hashes/utils";
import { Wallet } from "../Wallet";

// The server's demo wallet. server/src/main.ts derives the same address from it with Lucid.
const demoKey = "ed25519_sk1a4rftj7hlj80my7equwfedlzu8afjhlpjf5svdvw8ngp6nr25gms0rkak9";

describe("Wallet", () => {
  it("works out the same testnet address as Lucid", () => {
    expect(new Wallet(demoKey).address).toBe("addr_test1vpuua79pn5m5amc0cdw08mrvpewa3pt8s9x9csp4pws6m6qml4al4");
  });

  it("signs with the key whose public half it gives", () => {
    const wallet = new Wallet(demoKey);
    const signature = wallet.sign("explorie:redeem:abc");
    const message = new TextEncoder().encode("explorie:redeem:abc");
    expect(ed25519.verify(hexToBytes(signature), message, hexToBytes(wallet.publicKey))).toBe(true);
  });

  it("rejects anything but an ed25519_sk key", () => {
    expect(() => new Wallet("addr_test1vpuua79pn5m5amc0cdw08mrvpewa3pt8s9x9csp4pws6m6qml4al4")).toThrow();
    expect(() => new Wallet("not a key")).toThrow();
  });
});
