import { beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  Data,
  Emulator,
  Lucid,
  fromText,
  generateEmulatorAccountFromPrivateKey,
  paymentCredentialOf,
  toUnit,
  type EmulatorAccount,
  type LucidEvolution,
} from "@lucid-evolution/lucid";
import { buildApp } from "../src/app.ts";
import { claimCode, nftName } from "../src/claims.ts";
import { drops } from "../src/drops.ts";
import { Minter } from "../src/Minter.ts";

const SECRET = "test-secret";
const popUp = drops.find((d) => d.id === "6")!;
// The error Lucid raises when the minting policy itself fails, rather than, say, coin selection.
const SCRIPT_REJECTED = /failed script execution Mint/;

let emulator: Emulator;
let issuer: EmulatorAccount;
let user: EmulatorAccount;
let lucid: LucidEvolution;
let minter: Minter;
let app: ReturnType<typeof buildApp>;

beforeEach(async () => {
  issuer = generateEmulatorAccountFromPrivateKey({ lovelace: 100_000_000n });
  user = generateEmulatorAccountFromPrivateKey({ lovelace: 20_000_000n });
  emulator = new Emulator([issuer, user]);
  lucid = await Lucid(emulator, "Custom");
  lucid.selectWallet.fromPrivateKey(issuer.privateKey);
  minter = new Minter(lucid, issuer.address);
  app = buildApp(minter, SECRET);
});

function claim(overrides: Record<string, unknown> = {}) {
  return app.request("/claims", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      dropId: popUp.id,
      code: claimCode(SECRET, popUp.id),
      address: user.address,
      location: popUp.coordinate,
      ...overrides,
    }),
  });
}

async function unitsHeldBy(address: string) {
  const utxos = await emulator.getUtxos(address);
  return utxos.flatMap((u) => Object.keys(u.assets)).filter((unit) => unit.startsWith(minter.policyId));
}

describe("GET /drops", () => {
  test("lists the drops and the policy id", async () => {
    const body = await (await app.request("/drops")).json();
    assert.equal(body.drops.length, 11);
    assert.equal(body.policyId, minter.policyId);
  });
});

describe("POST /claims", () => {
  test("mints the drop's NFT to the user's address", async () => {
    const [seed] = await emulator.getUtxos(issuer.address);
    const response = await claim();
    assert.equal(response.status, 201);

    const { unit } = await response.json();
    assert.equal(unit, toUnit(minter.policyId, nftName(seed.txHash, seed.outputIndex)));
    assert.deepEqual(await unitsHeldBy(user.address), [unit]);
  });

  test("refuses a second claim of the same drop by the same address", async () => {
    assert.equal((await claim()).status, 201);
    assert.equal((await claim()).status, 409);
    assert.equal((await unitsHeldBy(user.address)).length, 1);
  });

  test("mints concurrent claims one after another", async () => {
    const other = drops.find((d) => d.id === "7")!;
    const responses = await Promise.all([
      claim(),
      claim({ dropId: other.id, code: claimCode(SECRET, other.id), location: other.coordinate }),
    ]);
    assert.deepEqual(
      responses.map((r) => r.status),
      [201, 201],
    );
    assert.equal((await unitsHeldBy(user.address)).length, 2);
  });

  test("rejects a wrong code, a distant phone, a bad address, an unknown drop and a bad body", async () => {
    const away = { latitude: popUp.coordinate.latitude + 0.01, longitude: popUp.coordinate.longitude };
    assert.equal((await claim({ code: claimCode(SECRET, "5") })).status, 403);
    assert.equal((await claim({ location: away })).status, 403);
    assert.equal((await claim({ address: "addr_test1nope" })).status, 400);
    assert.equal((await claim({ dropId: "99" })).status, 404);
    assert.equal((await claim({ location: "here" })).status, 400);
    assert.deepEqual(await unitsHeldBy(user.address), []);
  });
});

describe("the on-chain policy", () => {
  const issuerKeyHash = () => paymentCredentialOf(issuer.address).hash;

  test("rejects a mint whose name the issuer chose", async () => {
    const unit = toUnit(minter.policyId, fromText("Pop UP #1"));
    const tx = lucid
      .newTx()
      .mintAssets({ [unit]: 1n }, Data.void())
      .attach.MintingPolicy(minter.policy)
      .addSignerKey(issuerKeyHash())
      .pay.ToAddress(user.address, { [unit]: 1n });
    await assert.rejects(tx.complete(), SCRIPT_REJECTED);
  });

  test("rejects minting two of a token", async () => {
    const [seed] = await emulator.getUtxos(issuer.address);
    const unit = toUnit(minter.policyId, nftName(seed.txHash, seed.outputIndex));
    const tx = lucid
      .newTx()
      .collectFrom([seed])
      .mintAssets({ [unit]: 2n }, Data.void())
      .attach.MintingPolicy(minter.policy)
      .addSignerKey(issuerKeyHash())
      .pay.ToAddress(user.address, { [unit]: 2n });
    await assert.rejects(tx.complete(), SCRIPT_REJECTED);
  });

  test("rejects a mint by someone other than the issuer", async () => {
    const userLucid = await Lucid(emulator, "Custom");
    userLucid.selectWallet.fromPrivateKey(user.privateKey);
    const [seed] = await emulator.getUtxos(user.address);
    const unit = toUnit(minter.policyId, nftName(seed.txHash, seed.outputIndex));
    const tx = userLucid
      .newTx()
      .collectFrom([seed])
      .mintAssets({ [unit]: 1n }, Data.void())
      .attach.MintingPolicy(minter.policy)
      .pay.ToAddress(user.address, { [unit]: 1n });
    await assert.rejects(tx.complete(), SCRIPT_REJECTED);
  });

  test("lets the holder burn their NFT without the issuer", async () => {
    const { unit } = await (await claim()).json();
    const userLucid = await Lucid(emulator, "Custom");
    userLucid.selectWallet.fromPrivateKey(user.privateKey);

    const tx = await userLucid
      .newTx()
      .mintAssets({ [unit]: -1n }, Data.void())
      .attach.MintingPolicy(minter.policy)
      .complete();
    const txHash = await (await tx.sign.withWallet().complete()).submit();
    await userLucid.awaitTx(txHash);
    assert.deepEqual(await unitsHeldBy(user.address), []);
  });
});
