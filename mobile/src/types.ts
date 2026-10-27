import type { ImageSourcePropType } from "react-native";

export type NftKind = "voucher" | "collectable";

export type Nft = {
  id: string;
  title: string;
  kind: NftKind;
  image: ImageSourcePropType;
  rating: string;
  location: {
    name: string;
    photo?: string;
    description: string;
    coordinate: { latitude: number; longitude: number };
  };
};

// An NFT the wallet holds, in the order it was minted. `unit` is its on-chain id.
export type WalletNft = Nft & { unit: string; redeemed: boolean };
