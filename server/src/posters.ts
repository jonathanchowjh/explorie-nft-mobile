import { mkdirSync, writeFileSync } from "node:fs";
import QRCode from "qrcode";
import { posterText } from "./claims.ts";
import type { Drop } from "./drops.ts";

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A printable poster for a drop: its title, the QR code the app scans, and the
// same text underneath for typing in.
export async function posterSvg(secret: string, drop: Drop): Promise<string> {
  const text = posterText(secret, drop.id);
  const qr = (await QRCode.toString(text, { type: "svg", margin: 2 })).replace(
    "<svg ",
    '<svg x="40" y="80" width="320" height="320" ',
  );
  // The longest title today just fits at 20px; shrink anything longer.
  const titleSize = Math.min(20, Math.floor(820 / drop.title.length));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480">
  <rect width="400" height="480" fill="#ffffff"/>
  <text x="200" y="48" text-anchor="middle" font-family="sans-serif" font-size="${titleSize}" font-weight="700" fill="#e9413c">${escapeXml(drop.title)}</text>
  ${qr}
  <text x="200" y="440" text-anchor="middle" font-family="monospace" font-size="16" fill="#000000">${escapeXml(text)}</text>
</svg>
`;
}

// Writes <dir>/<drop id>.svg for every drop, replacing what's there.
export async function writePosters(dir: string, secret: string, drops: Drop[]) {
  mkdirSync(dir, { recursive: true });
  for (const drop of drops) writeFileSync(`${dir}/${drop.id}.svg`, await posterSvg(secret, drop));
}
