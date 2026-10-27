import React from "react";
import { catalogue } from "../data/seed";
import { claimDrop, fetchWallet, redeemVoucher, type HeldNft, type Result } from "../api";
import type { Nft, WalletNft } from "../types";

export function findNft(id: string): Nft {
  const nft = catalogue.find((n) => n.id === id);
  if (!nft) throw new Error(`No NFT with id ${id}`);
  return nft;
}

export function searchNfts(query: string): Nft[] {
  const q = query.toLowerCase();
  return catalogue.filter(
    (n) => n.title.toLowerCase().includes(q) || n.location.name.toLowerCase().includes(q),
  );
}

// The server's list of what the address holds, as one entry per drop this app
// can show, in the order first minted. An address can hold several of a drop
// (someone can send one to it); the entry is the first unredeemed one, if any,
// so Redeem has something to redeem.
export function toWallet(held: HeldNft[]): WalletNft[] {
  const byDrop = new Map<string, HeldNft>();
  for (const h of held) {
    if (!catalogue.some((n) => n.id === h.dropId)) continue;
    const kept = byDrop.get(h.dropId);
    if (!kept || (kept.redeemed && !h.redeemed)) byDrop.set(h.dropId, h);
  }
  return [...byDrop.values()].map((h) => ({ ...findNft(h.dropId), unit: h.unit, redeemed: h.redeemed }));
}

type NftStore = {
  wallet: WalletNft[];
  // Why the wallet couldn't be loaded, if it couldn't.
  walletError?: string;
  refresh: () => Promise<void>;
  // Asks the server to mint the drop's NFT, then reloads the wallet.
  collect: (id: string, code: string) => Promise<Result>;
  redeem: (id: string) => Promise<Result>;
};

const NftContext = React.createContext<NftStore | null>(null);

// The wallet is whatever the server says the address holds on-chain, so it's
// reloaded after every change rather than edited here.
export function NftProvider({ children }: { children: React.ReactNode }) {
  const [held, setHeld] = React.useState<HeldNft[]>([]);
  const [walletError, setWalletError] = React.useState<string>();

  // Loads can overlap (launch, a visit to Wallet, after a claim), so only the latest one counts.
  const latest = React.useRef(0);
  const refresh = React.useCallback(() => {
    const request = ++latest.current;
    return fetchWallet().then((result) => {
      if (request !== latest.current) return;
      if (result.ok) setHeld(result.value);
      setWalletError(result.ok ? undefined : result.message);
    });
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const store = React.useMemo<NftStore>(() => {
    const wallet = toWallet(held);
    return {
      wallet,
      walletError,
      refresh,
      collect: async (id, code) => {
        const result = await claimDrop(id, code);
        if (result.ok) await refresh();
        return result;
      },
      redeem: async (id) => {
        const nft = wallet.find((n) => n.id === id);
        if (!nft) return { ok: false, message: "That NFT isn't in your wallet." };
        const result = await redeemVoucher(nft.unit);
        if (result.ok) await refresh();
        return result;
      },
    };
  }, [held, walletError, refresh]);
  return <NftContext.Provider value={store}>{children}</NftContext.Provider>;
}

export function useNfts(): NftStore {
  const store = React.useContext(NftContext);
  if (!store) throw new Error("useNfts must be used inside NftProvider");
  return store;
}
