import { ed25519 } from "@noble/curves/ed25519";
import { blake2b } from "@noble/hashes/blake2b";
import { bytesToHex } from "@noble/hashes/utils";
import { bech32 } from "@scure/base";

// A wallet from an "ed25519_sk…" key, the bech32 format Lucid and the server
// use: its address on the testnets, and signatures that prove it owns that
// address. Throws if the key isn't one.
export class Wallet {
  readonly address: string;
  // Hex, as the server takes it.
  readonly publicKey: string;
  #privateKey: Uint8Array;

  constructor(key: string) {
    const { prefix, words } = bech32.decode(key as `${string}1${string}`);
    const privateKey = bech32.fromWords(words);
    if (prefix !== "ed25519_sk" || privateKey.length !== 32) throw new Error("Not an ed25519_sk key");
    this.#privateKey = privateKey;
    const publicKey = ed25519.getPublicKey(privateKey);
    this.publicKey = bytesToHex(publicKey);
    // An enterprise address (a payment key and nothing else) on network 0, the testnets: the 0x60 header,
    // then the key's 28-byte BLAKE2b hash.
    const payload = new Uint8Array([0x60, ...blake2b(publicKey, { dkLen: 28 })]);
    this.address = bech32.encode("addr_test", bech32.toWords(payload));
  }

  // Hex, as the server takes it.
  sign(message: string): string {
    return bytesToHex(ed25519.sign(new TextEncoder().encode(message), this.#privateKey));
  }
}
