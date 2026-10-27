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

// The server's list of what the address holds, keeping only drops this app can show.
export function toWallet(held: HeldNft[]): WalletNft[] {
  return held
    .filter((h) => catalogue.some((n) => n.id === h.dropId))
    .map((h) => ({ ...findNft(h.dropId), unit: h.unit, redeemed: h.redeemed }));
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

  const show = React.useCallback((result: Result<HeldNft[]>) => {
    if (result.ok) setHeld(result.value);
    setWalletError(result.ok ? undefined : result.message);
  }, []);
  const refresh = React.useCallback(async () => show(await fetchWallet()), [show]);

  React.useEffect(() => {
    fetchWallet().then(show);
  }, [show]);

  const store = React.useMemo<NftStore>(
    () => ({
      wallet: toWallet(held),
      walletError,
      refresh,
      collect: async (id, code) => {
        const result = await claimDrop(id, code);
        if (result.ok) await refresh();
        return result;
      },
      redeem: async (id) => {
        const nft = held.find((h) => h.dropId === id);
        if (!nft) return { ok: false, message: "That NFT isn't in your wallet." };
        const result = await redeemVoucher(nft.unit);
        if (result.ok) await refresh();
        return result;
      },
    }),
    [held, walletError, refresh],
  );
  return <NftContext.Provider value={store}>{children}</NftContext.Provider>;
}

export function useNfts(): NftStore {
  const store = React.useContext(NftContext);
  if (!store) throw new Error("useNfts must be used inside NftProvider");
  return store;
}
