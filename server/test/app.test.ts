import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
import { claimCode, nftName, signRedemption } from "../src/claims.ts";
import { drops } from "../src/drops.ts";
import { Minter } from "../src/Minter.ts";
import { Records } from "../src/Records.ts";

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

  test("accepts a distant phone when the server is started with a wider radius", async () => {
    app = buildApp(minter, SECRET, 20_000_000);
    const singapore = { latitude: 1.2966, longitude: 103.7764 };
    assert.equal((await claim({ location: singapore })).status, 201);
  });

  test("keeps the claim when the mint was sent but didn't confirm, and the NFT shows once it lands", async () => {
    lucid.awaitTx = async () => {
      throw new Error("Timed out waiting for the transaction");
    };
    const response = await claim();
    assert.equal(response.status, 504);
    assert.equal((await claim()).status, 409);

    emulator.awaitBlock(1);
    assert.deepEqual(
      (await (await wallet()).json()).nfts.map((n: { dropId: string }) => n.dropId),
      ["6"],
    );
  });

  test("frees the claim when the mint fails before it's sent", async () => {
    const realWallet = lucid.wallet;
    lucid.wallet = () => ({ ...realWallet(), getUtxos: async () => [] });
    assert.equal((await claim()).status, 502);
    lucid.wallet = realWallet;
    assert.equal((await claim()).status, 201);
  });

  test("refuses to start with a radius that isn't a number", () => {
    assert.throws(() => buildApp(minter, SECRET, Number("20km")), /positive number of metres/);
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

function wallet(address = user.address) {
  return app.request(`/wallet/${address}`);
}

// Redeems as `account`, signing with its own key unless `overrides` says otherwise.
function redeem(unit: string, account = user, overrides: Record<string, unknown> = {}) {
  return app.request("/redemptions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ address: account.address, unit, ...signRedemption(account.privateKey, unit), ...overrides }),
  });
}

describe("GET /wallet/:address", () => {
  test("lists the address's NFTs in the order they were minted", async () => {
    const chef = drops.find((d) => d.id === "7")!;
    const first = (await (await claim()).json()).unit;
    const second = (await (await claim({ dropId: chef.id, code: claimCode(SECRET, chef.id), location: chef.coordinate })).json()).unit;

    assert.deepEqual(await (await wallet()).json(), {
      nfts: [
        { unit: first, dropId: "6", redeemed: false },
        { unit: second, dropId: "7", redeemed: false },
      ],
    });
  });

  test("follows the NFT on-chain when the holder sends it on", async () => {
    const { unit } = await (await claim()).json();
    const userLucid = await Lucid(emulator, "Custom");
    userLucid.selectWallet.fromPrivateKey(user.privateKey);
    const tx = await userLucid.newTx().pay.ToAddress(issuer.address, { [unit]: 1n }).complete();
    await userLucid.awaitTx(await (await tx.sign.withWallet().complete()).submit());

    assert.deepEqual((await (await wallet()).json()).nfts, []);
    assert.equal((await (await wallet(issuer.address)).json()).nfts[0].unit, unit);
  });

  test("rejects an address on another network", async () => {
    assert.equal((await wallet("addr_test1nope")).status, 400);
  });
});

describe("POST /redemptions", () => {
  test("marks a held voucher redeemed, once", async () => {
    const { unit } = await (await claim()).json();
    assert.equal((await redeem(unit)).status, 201);
    assert.deepEqual((await (await wallet()).json()).nfts, [{ unit, dropId: "6", redeemed: true }]);
    assert.equal((await redeem(unit)).status, 409);
  });

  test("needs the address's own key to have signed that unit's redemption", async () => {
    const { unit } = await (await claim()).json();
    const other = (await (await claim({ dropId: "7", code: claimCode(SECRET, "7"), location: drops.find((d) => d.id === "7")!.coordinate })).json()).unit;

    assert.equal((await redeem(unit, user, { publicKey: undefined, signature: undefined })).status, 400);
    assert.equal((await redeem(unit, user, signRedemption(issuer.privateKey, unit))).status, 401);
    assert.equal((await redeem(unit, user, signRedemption(user.privateKey, other))).status, 401);
    assert.equal((await redeem(unit, user, { signature: "00".repeat(64) })).status, 401);
    assert.deepEqual(
      (await (await wallet()).json()).nfts.map((n: { redeemed: boolean }) => n.redeemed),
      [false, false],
    );
    assert.equal((await redeem(unit)).status, 201);
  });

  test("rejects an unknown NFT, a collectable, and an address that doesn't hold it", async () => {
    const etherials = drops.find((d) => d.id === "11")!;
    const voucher = (await (await claim()).json()).unit;
    const collectable = (
      await (await claim({ dropId: etherials.id, code: claimCode(SECRET, etherials.id), location: etherials.coordinate })).json()
    ).unit;

    assert.equal((await redeem(`${minter.policyId}00`)).status, 404);
    assert.equal((await redeem(collectable)).status, 400);
    assert.equal((await redeem(voucher, issuer)).status, 403);
    assert.deepEqual(
      (await (await wallet()).json()).nfts.map((n: { redeemed: boolean }) => n.redeemed),
      [false, false],
    );
  });
});

describe("records", () => {
  test("forget a claim whose mint was never sent when they're reopened", () => {
    const file = join(mkdtempSync(join(tmpdir(), "explorie-")), "records.db");
    assert.equal(new Records(file).reserveClaim(user.address, "6"), true);
    assert.equal(new Records(file).reserveClaim(user.address, "6"), true);
  });

  test("survive a restart when kept in a file", async () => {
    const file = join(mkdtempSync(join(tmpdir(), "explorie-")), "records.db");
    app = buildApp(minter, SECRET, undefined, file);
    const { unit } = await (await claim()).json();
    assert.equal((await redeem(unit)).status, 201);

    app = buildApp(minter, SECRET, undefined, file);
    assert.deepEqual((await (await wallet()).json()).nfts, [{ unit, dropId: "6", redeemed: true }]);
    assert.equal((await claim()).status, 409);
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
