import { Hono } from "hono";
import { distanceMetres, isClaimCode } from "./claims.ts";
import { CLAIM_RADIUS_METRES, drops } from "./drops.ts";
import type { Minter } from "./Minter.ts";

type Claim = {
  dropId: string;
  code: string;
  address: string;
  location: { latitude: number; longitude: number };
};

function parseClaim(body: unknown): Claim | null {
  const b = body as Partial<Claim> | null;
  const isString = (v: unknown) => typeof v === "string" && v.length > 0;
  const isNumber = (v: unknown) => typeof v === "number" && Number.isFinite(v);
  if (!b || !isString(b.dropId) || !isString(b.code) || !isString(b.address)) return null;
  if (!b.location || !isNumber(b.location.latitude) || !isNumber(b.location.longitude)) return null;
  return b as Claim;
}

// A claim mints a drop's NFT to the user's address. It needs the code from the
// drop's QR poster and a location within CLAIM_RADIUS_METRES of the drop, and
// each address can claim a drop once. Claims are kept in memory.
export function buildApp(minter: Minter, claimSecret: string) {
  const claimed = new Set<string>();
  const app = new Hono();

  app.get("/drops", (c) => c.json({ policyId: minter.policyId, radiusMetres: CLAIM_RADIUS_METRES, drops }));

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
    if (distanceMetres(claim.location, drop.coordinate) > CLAIM_RADIUS_METRES) {
      return c.json({ error: "Too far from the drop" }, 403);
    }

    // Reserve before minting, so two requests at once can't both mint.
    const key = `${claim.address}:${drop.id}`;
    if (claimed.has(key)) return c.json({ error: "Already claimed" }, 409);
    claimed.add(key);
    try {
      return c.json(await minter.mint(claim.address, drop), 201);
    } catch (error) {
      claimed.delete(key);
      console.error("Mint failed", error);
      return c.json({ error: "Minting failed" }, 502);
    }
  });

  return app;
}
