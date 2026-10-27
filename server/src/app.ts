import { Hono } from "hono";
import { distanceMetres, isClaimCode, isSignedRedemption } from "./claims.ts";
import { CLAIM_RADIUS_METRES, drops } from "./drops.ts";
import type { Minter } from "./Minter.ts";
import { Records } from "./Records.ts";

type Claim = {
  dropId: string;
  code: string;
  address: string;
  location: { latitude: number; longitude: number };
};

// publicKey and signature are hex: the wallet's key, and its signature of redemptionMessage(unit).
type Redemption = { address: string; unit: string; publicKey: string; signature: string };

const isString = (v: unknown) => typeof v === "string" && v.length > 0;
const isNumber = (v: unknown) => typeof v === "number" && Number.isFinite(v);

function parseClaim(body: unknown): Claim | null {
  const b = body as Partial<Claim> | null;
  if (!b || !isString(b.dropId) || !isString(b.code) || !isString(b.address)) return null;
  if (!b.location || !isNumber(b.location.latitude) || !isNumber(b.location.longitude)) return null;
  return b as Claim;
}

function parseRedemption(body: unknown): Redemption | null {
  const b = body as Partial<Redemption> | null;
  if (!b || !isString(b.address) || !isString(b.unit)) return null;
  return isString(b.publicKey) && isString(b.signature) ? (b as Redemption) : null;
}

// A claim mints a drop's NFT to the user's address. It needs the code from the
// drop's QR poster and a location within radiusMetres of the drop, and each
// address can claim a drop once. A wallet is whatever the chain says the
// address holds; the server only records which drop each NFT came from and
// which vouchers were redeemed, in `dataFile`.
export function buildApp(minter: Minter, claimSecret: string, radiusMetres = CLAIM_RADIUS_METRES, dataFile = ":memory:") {
  // NaN would pass every distance check.
  if (!(radiusMetres > 0)) throw new Error(`The claim radius must be a positive number of metres, not ${radiusMetres}`);
  const records = new Records(dataFile);
  const app = new Hono();

  app.get("/drops", (c) => c.json({ policyId: minter.policyId, radiusMetres, drops }));

  app.post("/claims", async (c) => {
    const claim = parseClaim(await c.req.json().catch(() => null));
    if (!claim) {
      return c.json({ error: "Expected { dropId, code, address, location: { latitude, longitude } }" }, 400);
    }
    const drop = drops.find((d) => d.id === claim.dropId);
    if (!drop) return c.json({ error: "No such drop" }, 404);
    if (!minter.isAddressOnThisNetwork(claim.address)) {
      return c.json({ error: "Not a Cardano address on this network" }, 400);
    }
    if (!isClaimCode(claimSecret, drop.id, claim.code)) return c.json({ error: "Wrong claim code" }, 403);
    if (distanceMetres(claim.location, drop.coordinate) > radiusMetres) {
      return c.json({ error: "Too far from the drop" }, 403);
    }

    // Reserve before minting, so two requests at once can't both mint.
    if (!records.reserveClaim(claim.address, drop.id)) return c.json({ error: "Already claimed" }, 409);
    let sent = false;
    try {
      const result = await minter.mint(claim.address, drop, (unit) => {
        sent = true;
        records.recordMint(claim.address, drop.id, unit);
      });
      return c.json(result, 201);
    } catch (error) {
      console.error("Mint failed", error);
      // A sent mint may still confirm, so the claim stays taken and the NFT shows up when it lands.
      if (sent) return c.json({ error: "Your NFT is on its way but hasn't confirmed yet. Check your wallet soon." }, 504);
      records.releaseClaim(claim.address, drop.id);
      return c.json({ error: "Minting failed" }, 502);
    }
  });

  app.get("/wallet/:address", async (c) => {
    const address = c.req.param("address");
    if (!minter.isAddressOnThisNetwork(address)) return c.json({ error: "Not a Cardano address on this network" }, 400);
    return c.json({ nfts: records.held(await minter.unitsAt(address)) });
  });

  // Only the address's own key can redeem its vouchers: the request carries
  // that key and its signature, which must match the address.
  app.post("/redemptions", async (c) => {
    const redemption = parseRedemption(await c.req.json().catch(() => null));
    if (!redemption) return c.json({ error: "Expected { address, unit, publicKey, signature }" }, 400);
    const { address, unit, publicKey, signature } = redemption;
    const dropId = records.dropOf(unit);
    const drop = drops.find((d) => d.id === dropId);
    if (!drop) return c.json({ error: "No such NFT" }, 404);
    if (drop.kind !== "voucher") return c.json({ error: "Only vouchers can be redeemed" }, 400);
    if (!minter.isAddressOnThisNetwork(address)) return c.json({ error: "Not a Cardano address on this network" }, 400);
    if (!isSignedRedemption(address, unit, publicKey, signature)) {
      return c.json({ error: "Not signed by this address's key" }, 401);
    }
    if (!(await minter.unitsAt(address)).includes(unit)) return c.json({ error: "That address doesn't hold this NFT" }, 403);
    if (!records.redeem(unit)) return c.json({ error: "Already redeemed" }, 409);
    return c.json({ unit }, 201);
  });

  return app;
}
