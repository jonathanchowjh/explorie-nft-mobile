import { randomBytes } from "node:crypto";
import { serve } from "@hono/node-server";
import { Emulator, Lucid, generateEmulatorAccountFromPrivateKey } from "@lucid-evolution/lucid";
import { buildApp } from "./app.ts";
import { claimCode } from "./claims.ts";
import { CLAIM_RADIUS_METRES, drops } from "./drops.ts";
import { Minter } from "./Minter.ts";

// Local mode: an in-memory Cardano chain (Lucid's emulator) with a funded issuer.
// Nothing touches a real network, and state resets on restart.
const issuer = generateEmulatorAccountFromPrivateKey({ lovelace: 1_000_000_000n });
const lucid = await Lucid(new Emulator([issuer]), "Custom");
lucid.selectWallet.fromPrivateKey(issuer.privateKey);

const claimSecret = process.env.CLAIM_SECRET ?? randomBytes(16).toString("hex");
// The drops are in Manhattan, so a demo anywhere else needs a wider radius.
const radiusMetres = Number(process.env.CLAIM_RADIUS_METRES ?? CLAIM_RADIUS_METRES);
const minter = new Minter(lucid, issuer.address);
const port = Number(process.env.PORT ?? 8787);
// Fixed, so the app's .env.local keeps working across restarts. Nobody holds
// its key, which is fine: the app only needs an address to receive NFTs.
const demoAddress =
  process.env.DEMO_ADDRESS ?? "addr_test1vremee8x8n88fhct3qhjg6xwtmvprylzvnww3dy8f7gn8kcfzddd6";

const app = buildApp(minter, claimSecret, radiusMetres);

// The demo user starts with the original app's wallet: a collectable, a
// voucher, and a voucher already redeemed. Seeding goes through the API, so
// it passes the same checks as any claim.
async function post(path: string, body: object) {
  const response = await app.request(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Seeding ${path} failed: ${await response.text()}`);
  return response.json();
}
for (const id of ["11", "6", "7"]) {
  const drop = drops.find((d) => d.id === id)!;
  const { unit } = await post("/claims", {
    dropId: id,
    code: claimCode(claimSecret, id),
    address: demoAddress,
    location: drop.coordinate,
  });
  if (id === "7") await post("/redemptions", { address: demoAddress, unit });
}

// Listens on every interface, so a phone on the same network can reach it.
serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
  console.log(`Explorie server on port ${port} (local emulator chain)`);
  console.log(`Policy id: ${minter.policyId}`);
  console.log(`Claim radius: ${radiusMetres} m`);
  console.log(`For the app's .env.local, the demo user, who starts with 3 NFTs:`);
  console.log(`  EXPO_PUBLIC_WALLET_ADDRESS=${demoAddress}`);
  console.log("QR poster contents:");
  for (const drop of drops) console.log(`  explorie:${drop.id}:${claimCode(claimSecret, drop.id)}  ${drop.title}`);
});
