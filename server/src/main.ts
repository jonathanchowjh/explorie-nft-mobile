import { randomBytes } from "node:crypto";
import { serve } from "@hono/node-server";
import { Emulator, Lucid, generateEmulatorAccountFromPrivateKey } from "@lucid-evolution/lucid";
import { buildApp } from "./app.ts";
import { claimCode } from "./claims.ts";
import { CLAIM_RADIUS_METRES, drops } from "./drops.ts";
import { Minter } from "./Minter.ts";

// Local mode: an in-memory Cardano chain (Lucid's emulator) with a funded issuer
// and a demo user. Nothing touches a real network, and state resets on restart.
const issuer = generateEmulatorAccountFromPrivateKey({ lovelace: 1_000_000_000n });
const demoUser = generateEmulatorAccountFromPrivateKey({ lovelace: 0n });
const lucid = await Lucid(new Emulator([issuer, demoUser]), "Custom");
lucid.selectWallet.fromPrivateKey(issuer.privateKey);

const claimSecret = process.env.CLAIM_SECRET ?? randomBytes(16).toString("hex");
// The drops are in Manhattan, so a demo anywhere else needs a wider radius.
const radiusMetres = Number(process.env.CLAIM_RADIUS_METRES ?? CLAIM_RADIUS_METRES);
const minter = new Minter(lucid, issuer.address);
const port = Number(process.env.PORT ?? 8787);

// Listens on every interface, so a phone on the same network can reach it.
serve({ fetch: buildApp(minter, claimSecret, radiusMetres).fetch, port, hostname: "0.0.0.0" }, () => {
  console.log(`Explorie server on port ${port} (local emulator chain)`);
  console.log(`Policy id: ${minter.policyId}`);
  console.log(`Claim radius: ${radiusMetres} m`);
  console.log(`For the app's .env (any address on this network works): EXPO_PUBLIC_WALLET_ADDRESS=${demoUser.address}`);
  console.log("QR poster contents:");
  for (const drop of drops) console.log(`  explorie:${drop.id}:${claimCode(claimSecret, drop.id)}  ${drop.title}`);
});
