import React from "react";
import * as Clipboard from "expo-clipboard";
import type { ScreenProps } from "../navigation";
import { profile } from "../data/seed";
import { useNfts } from "../state/NftStore";
import { Screen } from "../components/Screen";
import { Banner } from "../components/ui";
import { NftCards } from "../components/nft";

export default function WalletScreen({ navigation }: ScreenProps<"Wallet">) {
  const { wallet } = useNfts();
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
            title: profile.walletAddress,
            icon: "clone",
            onPress: () => Clipboard.setStringAsync(profile.walletAddress),
          },
          { title: "Settings", onPress: () => navigation.navigate("Settings", undefined, { pop: true }) },
        ]}
      />
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
