import { test } from "node:test";
import assert from "node:assert/strict";
import { claimCode } from "../src/claims.ts";
import { drops } from "../src/drops.ts";
import { posterSvg } from "../src/posters.ts";

test("a poster shows the title and the text the QR code holds, escaped for SVG", async () => {
  const drop = { ...drops[0], id: "5", title: `Nets <vs> "Knicks" & more` };
  const svg = await posterSvg("secret", drop);
  assert.ok(svg.includes("Nets &lt;vs&gt; &quot;Knicks&quot; &amp; more"));
  assert.ok(svg.includes(`explorie:5:${claimCode("secret", "5")}`));
  // The QR code is an <svg> nested in the poster's.
  assert.equal(svg.match(/<svg /g)?.length, 2);
});
