import React from "react";
import { catalogue, initialWallet } from "../data/seed";
import type { Nft, OwnedNft, WalletNft } from "../types";

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

export function collect(owned: OwnedNft[], id: string): OwnedNft[] {
  if (owned.some((o) => o.id === id)) return owned;
  return [...owned, { id, redeemed: false }];
}

export function redeem(owned: OwnedNft[], id: string): OwnedNft[] {
  return owned.map((o) => (o.id === id ? { ...o, redeemed: true } : o));
}

type NftStore = {
  wallet: WalletNft[];
  // Collects the NFT if the user is in range of it; returns whether it was collected.
  collect: (id: string) => boolean;
  redeem: (id: string) => void;
};

const NftContext = React.createContext<NftStore | null>(null);

export function NftProvider({ children }: { children: React.ReactNode }) {
  const [owned, setOwned] = React.useState(initialWallet);
  const store = React.useMemo<NftStore>(
    () => ({
      wallet: owned.map((o) => ({ ...findNft(o.id), redeemed: o.redeemed })),
      collect: (id) => {
        const inRange = findNft(id).inRange;
        if (inRange) setOwned((current) => collect(current, id));
        return inRange;
      },
      redeem: (id) => setOwned((current) => redeem(current, id)),
    }),
    [owned],
  );
  return <NftContext.Provider value={store}>{children}</NftContext.Provider>;
}

export function useNfts(): NftStore {
  const store = React.useContext(NftContext);
  if (!store) throw new Error("useNfts must be used inside NftProvider");
  return store;
}
