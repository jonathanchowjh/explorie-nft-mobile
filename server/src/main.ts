import { randomBytes } from "node:crypto";
import { serve } from "@hono/node-server";
import { Emulator, Lucid, generateEmulatorAccountFromPrivateKey } from "@lucid-evolution/lucid";
import { buildApp } from "./app.ts";
import { claimCode } from "./claims.ts";
import { drops } from "./drops.ts";
import { Minter } from "./Minter.ts";

// Local mode: an in-memory Cardano chain (Lucid's emulator) with a funded issuer
// and a demo user. Nothing touches a real network, and state resets on restart.
const issuer = generateEmulatorAccountFromPrivateKey({ lovelace: 1_000_000_000n });
const demoUser = generateEmulatorAccountFromPrivateKey({ lovelace: 0n });
const lucid = await Lucid(new Emulator([issuer, demoUser]), "Custom");
lucid.selectWallet.fromPrivateKey(issuer.privateKey);

const claimSecret = process.env.CLAIM_SECRET ?? randomBytes(16).toString("hex");
const minter = new Minter(lucid, issuer.address);
const port = Number(process.env.PORT ?? 8787);

serve({ fetch: buildApp(minter, claimSecret).fetch, port }, () => {
  console.log(`Explorie server on http://localhost:${port} (local emulator chain)`);
  console.log(`Policy id: ${minter.policyId}`);
  console.log(`Demo user address: ${demoUser.address}`);
  console.log("Claim codes:");
  for (const drop of drops) console.log(`  ${drop.id.padStart(2)}  ${claimCode(claimSecret, drop.id)}  ${drop.title}`);
});
