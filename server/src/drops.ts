import { readFileSync } from "node:fs";

export type Drop = {
  id: string;
  title: string;
  kind: "voucher" | "collectable";
  coordinate: { latitude: number; longitude: number };
};

// How close a phone must be to a drop to claim it, unless the server is started with another radius.
export const CLAIM_RADIUS_METRES = 100;

// The app bundles the same file, adding each drop's images and copy by id.
export const drops = JSON.parse(
  readFileSync(new URL("../../mobile/src/data/drops.json", import.meta.url), "utf8"),
) as Drop[];
