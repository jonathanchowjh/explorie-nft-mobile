import { readFileSync } from "node:fs";
import {
  Data,
  applyParamsToScript,
  getAddressDetails,
  mintingPolicyToId,
  paymentCredentialOf,
  toUnit,
  type LucidEvolution,
  type Script,
} from "@lucid-evolution/lucid";
import { nftName } from "./claims.ts";
import type { Drop } from "./drops.ts";

const blueprint = JSON.parse(readFileSync(new URL("../plutus.json", import.meta.url), "utf8")) as {
  validators: { title: string; compiledCode: string }[];
};
const compiledPolicy = blueprint.validators.find((v) => v.title === "explorie_nft.explorie_nft.mint")!.compiledCode;

// Mints Explorie NFTs from the issuer's wallet, which `lucid` must have selected.
// Mints run one at a time: each spends one of the issuer's outputs, so the next
// must wait for the last to confirm.
export class Minter {
  readonly policy: Script;
  readonly policyId: string;
  #lucid: LucidEvolution;
  #issuerKeyHash: string;
  #networkId: number;
  #queue: Promise<unknown> = Promise.resolve();

  constructor(lucid: LucidEvolution, issuerAddress: string) {
    this.#lucid = lucid;
    this.#issuerKeyHash = paymentCredentialOf(issuerAddress).hash;
    this.#networkId = getAddressDetails(issuerAddress).networkId;
    this.policy = { type: "PlutusV3", script: applyParamsToScript(compiledPolicy, [this.#issuerKeyHash]) };
    this.policyId = mintingPolicyToId(this.policy);
  }

  isAddressOnThisNetwork(address: string): boolean {
    try {
      return getAddressDetails(address).networkId === this.#networkId;
    } catch {
      return false;
    }
  }

  // The Explorie NFTs the address holds on-chain.
  async unitsAt(address: string): Promise<string[]> {
    const utxos = await this.#lucid.utxosAt(address);
    return utxos.flatMap((u) => Object.keys(u.assets)).filter((unit) => unit.startsWith(this.policyId));
  }

  // `onSubmitted` runs as soon as the transaction is sent, before it confirms.
  // From then on the NFT may arrive even if waiting for it fails.
  mint(address: string, drop: Drop, onSubmitted: (unit: string) => void = () => {}): Promise<{ txHash: string; unit: string }> {
    const minted = this.#queue.then(() => this.#mintNow(address, drop, onSubmitted));
    this.#queue = minted.catch(() => {});
    return minted;
  }

  async #mintNow(address: string, drop: Drop, onSubmitted: (unit: string) => void) {
    // The policy names the NFT after an output it spends; the name format needs an index below 256.
    const seed = (await this.#lucid.wallet().getUtxos()).find((u) => u.outputIndex <= 255);
    if (!seed) throw new Error("The issuer wallet has no spendable outputs");
    const name = nftName(seed.txHash, seed.outputIndex);
    const unit = toUnit(this.policyId, name);

    const tx = await this.#lucid
      .newTx()
      .collectFrom([seed])
      .mintAssets({ [unit]: 1n }, Data.void())
      .attach.MintingPolicy(this.policy)
      .addSignerKey(this.#issuerKeyHash)
      .pay.ToAddress(address, { [unit]: 1n })
      // CIP-25 v2 metadata, keyed by the hex asset name.
      .attachMetadata(721, {
        [this.policyId]: { [name]: { name: drop.title, kind: drop.kind, drop: drop.id } },
        version: 2,
      })
      .complete();
    const txHash = await (await tx.sign.withWallet().complete()).submit();
    onSubmitted(unit);
    await this.#lucid.awaitTx(txHash);
    return { txHash, unit };
  }
}
