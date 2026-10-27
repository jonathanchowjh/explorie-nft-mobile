import { randomBytes } from "node:crypto";
import { serve } from "@hono/node-server";
import { Blockfrost, Emulator, Lucid, generateEmulatorAccountFromPrivateKey } from "@lucid-evolution/lucid";
import { buildApp } from "./app.ts";
import { claimCode } from "./claims.ts";
import { CLAIM_RADIUS_METRES, drops } from "./drops.ts";
import { Minter } from "./Minter.ts";

// Two modes. By default, an in-memory Cardano chain (Lucid's emulator) with a
// funded issuer and a demo wallet: nothing touches a real network, and
// everything resets on restart. With BLOCKFROST_PROJECT_ID set, the Preview
// testnet: the issuer is ISSUER_PRIVATE_KEY, which needs test ada, and records
// are kept in DATA_FILE.
const projectId = process.env.BLOCKFROST_PROJECT_ID;
// Posters carry codes made from the secret, so on a real network it must outlive a restart.
const claimSecret = projectId ? required("CLAIM_SECRET") : (process.env.CLAIM_SECRET ?? randomBytes(16).toString("hex"));
const { lucid, issuerAddress } = projectId ? await previewTestnet(projectId) : await localEmulator();

// The drops are in Manhattan, so a demo anywhere else needs a wider radius.
const radiusMetres = Number(process.env.CLAIM_RADIUS_METRES ?? CLAIM_RADIUS_METRES);
const dataFile = projectId ? (process.env.DATA_FILE ?? "explorie.db") : ":memory:";
const port = Number(process.env.PORT ?? 8787);
// Fixed, so the app's .env.local keeps working across restarts. Nobody holds
// its key, which is fine: the app only needs an address to receive NFTs.
const demoAddress =
  process.env.DEMO_ADDRESS ?? "addr_test1vremee8x8n88fhct3qhjg6xwtmvprylzvnww3dy8f7gn8kcfzddd6";

const minter = new Minter(lucid, issuerAddress);
const app = buildApp(minter, claimSecret, radiusMetres, dataFile);

// Locally, the demo user starts with the original app's wallet: a collectable,
// a voucher, and a voucher already redeemed. Seeding goes through the API, so
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
if (!projectId) {
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
}

// Listens on every interface, so a phone on the same network can reach it.
serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
  console.log(`Explorie server on port ${port} (${projectId ? `Preview testnet, records in ${dataFile}` : "local emulator chain"})`);
  console.log(`Issuer: ${issuerAddress}`);
  console.log(`Policy id: ${minter.policyId}`);
  console.log(`Claim radius: ${radiusMetres} m`);
  if (!projectId) {
    console.log(`For the app's .env.local, the demo user, who starts with 3 NFTs:`);
    console.log(`  EXPO_PUBLIC_WALLET_ADDRESS=${demoAddress}`);
  }
  console.log("QR poster contents:");
  for (const drop of drops) console.log(`  explorie:${drop.id}:${claimCode(claimSecret, drop.id)}  ${drop.title}`);
});

async function localEmulator() {
  const issuer = generateEmulatorAccountFromPrivateKey({ lovelace: 1_000_000_000n });
  const lucid = await Lucid(new Emulator([issuer]), "Custom");
  lucid.selectWallet.fromPrivateKey(issuer.privateKey);
  return { lucid, issuerAddress: issuer.address };
}

async function previewTestnet(projectId: string) {
  const issuerKey = required("ISSUER_PRIVATE_KEY");
  let lucid;
  try {
    lucid = await Lucid(new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", projectId), "Preview");
  } catch (error) {
    // A rejected project id surfaces as a parse error deep in Lucid, so say what to check.
    throw new Error("Couldn't load the Preview testnet from Blockfrost. Is BLOCKFROST_PROJECT_ID a Preview project id?", {
      cause: error,
    });
  }
  lucid.selectWallet.fromPrivateKey(issuerKey);
  return { lucid, issuerAddress: await lucid.wallet().address() };
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} to run on the testnet`);
  return value;
}
