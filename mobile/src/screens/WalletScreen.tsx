import React from "react";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "@react-navigation/native";
import type { ScreenProps } from "../navigation";
import { profile } from "../data/seed";
import { useNfts } from "../state/NftStore";
import { walletAddress } from "../api";
import { Screen } from "../components/Screen";
import { Banner, EmptyText } from "../components/ui";
import { NftCards } from "../components/nft";

export default function WalletScreen({ navigation }: ScreenProps<"Wallet">) {
  const { wallet, walletError, refresh } = useNfts();
  const address = walletAddress();
  // Reload on every visit, so NFTs sent to or from the address on-chain show up.
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh]),
  );
  const sections = [
    { title: "My Vouchers", nfts: wallet.filter((n) => n.kind === "voucher") },
    { title: "My Collectables", nfts: wallet.filter((n) => n.kind === "collectable") },
  ];

  return (
    <Screen>
      <Banner
        title="Wallet"
        subtitle={`EXP Balance: ${profile.expBalance}`}
        gradient={["rgba(255,0,0,0.8)", "rgba(255,0,0,0.4)"]}
        actions={[
          {
            title: address ?? "No wallet address",
            icon: "clone",
            onPress: () => address && Clipboard.setStringAsync(address),
          },
          { title: "Settings", onPress: () => navigation.navigate("Settings", undefined, { pop: true }) },
        ]}
      />
      {walletError && <EmptyText>{walletError}</EmptyText>}
      {sections.map((section) => (
        <NftCards
          key={section.title}
          title={section.title}
          items={section.nfts}
          onPress={(nft) => navigation.navigate("Nft", { id: nft.id })}
          onMore={() =>
            navigation.navigate("Search", { title: section.title, ids: section.nfts.map((n) => n.id) })
          }
        />
      ))}
    </Screen>
  );
}
