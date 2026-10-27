import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { CML, credentialToAddress, paymentCredentialOf, type Network } from "@lucid-evolution/lucid";

type Coordinate = { latitude: number; longitude: number };

const EARTH_RADIUS_METRES = 6_371_000;

// Great-circle distance (haversine).
export function distanceMetres(a: Coordinate, b: Coordinate): number {
  const rad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_METRES * Math.asin(Math.sqrt(h));
}

// The code printed in a drop's QR poster. Only the server knows `secret`,
// so a code can't be made up without visiting the poster.
export function claimCode(secret: string, dropId: string): string {
  return createHmac("sha256", secret).update(dropId).digest("hex").slice(0, 16);
}

// What a drop's QR poster holds, and what the app's scanner reads.
export function posterText(secret: string, dropId: string): string {
  return `explorie:${dropId}:${claimCode(secret, dropId)}`;
}

export function isClaimCode(secret: string, dropId: string, code: string): boolean {
  const expected = Buffer.from(claimCode(secret, dropId));
  const given = Buffer.from(code);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// The asset name the minting policy requires for an NFT minted by spending
// this output: SHA3-256 of the output index (one byte) then the transaction id.
// The same as Lucid's getUniqueTokenName, without its experimental Web Crypto call.
export function nftName(txHash: string, outputIndex: number): string {
  if (outputIndex > 255) throw new Error("Output index must fit in one byte");
  return createHash("sha3-256")
    .update(Buffer.from([outputIndex]))
    .update(Buffer.from(txHash, "hex"))
    .digest("hex");
}

// What a wallet signs to redeem a voucher. The app signs the same text.
export function redemptionMessage(unit: string): string {
  return `explorie:redeem:${unit}`;
}

// Whether the address's own key signed the redemption of this unit: the
// public key must hash to the address's payment key, and the signature check.
// Both are hex.
export function isSignedRedemption(address: string, unit: string, publicKey: string, signature: string): boolean {
  try {
    const key = CML.PublicKey.from_bytes(Buffer.from(publicKey, "hex"));
    if (key.hash().to_hex() !== paymentCredentialOf(address).hash) return false;
    const sig = CML.Ed25519Signature.from_raw_bytes(Buffer.from(signature, "hex"));
    return key.verify(Buffer.from(redemptionMessage(unit)), sig);
  } catch {
    return false;
  }
}

// Signs a redemption as the app does, with an "ed25519_sk…" key. For the demo
// wallet's seed and the tests.
export function signRedemption(privateKey: string, unit: string): { publicKey: string; signature: string } {
  const key = CML.PrivateKey.from_bech32(privateKey);
  return {
    publicKey: Buffer.from(key.to_public().to_raw_bytes()).toString("hex"),
    signature: Buffer.from(key.sign(Buffer.from(redemptionMessage(unit))).to_raw_bytes()).toString("hex"),
  };
}

// The enterprise address of an "ed25519_sk…" key, as the app works it out.
export function keyAddress(privateKey: string, network: Network): string {
  const hash = CML.PrivateKey.from_bech32(privateKey).to_public().hash().to_hex();
  return credentialToAddress(network, { type: "Key", hash });
}
