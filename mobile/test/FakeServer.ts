import { jest } from "@jest/globals";
import type { HeldNft } from "../src/api";

type Reply = { status: number; body: object };

// An in-memory stand-in for the claim server, answering the app's fetch calls.
// It starts with the server's demo wallet.
export class FakeServer {
  held: HeldNft[] = [
    { unit: "u11", dropId: "11", redeemed: false },
    { unit: "u6", dropId: "6", redeemed: false },
    { unit: "u7", dropId: "7", redeemed: true },
  ];
  claims: { dropId: string; code: string; address: string; location: object }[] = [];
  // Set to refuse every claim with this reply.
  claimRefusal?: Reply;
  unreachable = false;

  fetch = jest.fn(async (url: string, init?: RequestInit) => {
    if (this.unreachable) throw new TypeError("Network request failed");
    const path = url.replace(/^https?:\/\/[^/]+/, "");
    const body = init?.body ? JSON.parse(init.body as string) : undefined;
    const reply = this.#handle(path, body);
    return { ok: reply.status < 300, status: reply.status, json: async () => reply.body } as Response;
  });

  install() {
    process.env.EXPO_PUBLIC_WALLET_ADDRESS = "addr_test1demo";
    globalThis.fetch = this.fetch as unknown as typeof fetch;
  }

  #handle(path: string, body: any): Reply {
    // Copies, as a real response would be: the store must not share these objects.
    if (path.startsWith("/wallet/")) return { status: 200, body: { nfts: this.held.map((h) => ({ ...h })) } };
    if (path === "/claims") {
      this.claims.push(body);
      if (this.claimRefusal) return this.claimRefusal;
      this.held.push({ unit: `u${body.dropId}`, dropId: body.dropId, redeemed: false });
      return { status: 201, body: { txHash: "tx", unit: `u${body.dropId}` } };
    }
    if (path === "/redemptions") {
      const nft = this.held.find((h) => h.unit === body.unit)!;
      nft.redeemed = true;
      return { status: 201, body: { unit: nft.unit } };
    }
    return { status: 404, body: { error: "Not found" } };
  }
}
