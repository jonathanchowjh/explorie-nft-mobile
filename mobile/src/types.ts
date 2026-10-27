import type { ImageSourcePropType } from "react-native";

export type NftKind = "voucher" | "collectable";

export type Nft = {
  id: string;
  title: string;
  kind: NftKind;
  image: ImageSourcePropType;
  // Stands in for a real location check: whether the user is close enough to collect it.
  inRange: boolean;
  distance: string;
  rating: string;
  location: {
    name: string;
    photo?: string;
    description: string;
    coordinate: { latitude: number; longitude: number };
  };
};

// An NFT in the user's wallet, in the order it was collected.
export type OwnedNft = { id: string; redeemed: boolean };

export type WalletNft = Nft & { redeemed: boolean };
