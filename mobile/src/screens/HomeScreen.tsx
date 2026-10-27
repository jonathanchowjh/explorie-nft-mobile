import React from "react";
import { StyleSheet, View } from "react-native";
import type { ScreenProps } from "../navigation";
import { catalogue, profile } from "../data/seed";
import { useNfts } from "../state/NftStore";
import { colors } from "../theme";
import { Screen } from "../components/Screen";
import { Banner, ProgressCard } from "../components/ui";
import { NftList } from "../components/nft";

const sections = [
  { title: "Popular NFTs", nfts: catalogue },
  { title: "Vouchers Near Me", nfts: catalogue.filter((n) => n.kind === "voucher") },
  { title: "Collectables Near Me", nfts: catalogue.filter((n) => n.kind === "collectable") },
];

export default function HomeScreen({ navigation }: ScreenProps<"Home">) {
  const { wallet } = useNfts();
  return (
    <Screen>
      <Banner
        title={profile.name}
        subtitle={profile.rank}
        gradient={["transparent", "transparent"]}
        titleColor="black"
        subtitleColor={colors.accent}
        profile={profile.picture}
      />
      <View style={styles.row}>
        <ProgressCard icon="bicycle" text="30 km travelled" color={colors.green} progress={0.3} />
        <ProgressCard
          icon="cubes"
          text={`${wallet.length} NFTs collected`}
          color={colors.green}
          progress={wallet.length / catalogue.length}
        />
      </View>
      <ProgressCard icon="check" text="Daily Tasks" color={colors.amber} progress={0.3} />
      {sections.map((section) => (
        <NftList
          key={section.title}
          title={section.title}
          items={section.nfts.slice(0, 2)}
          empty="Search Here..."
          onPress={(nft) => navigation.navigate("Map", { id: nft.id })}
          onMore={() =>
            navigation.navigate("Search", { title: section.title, ids: section.nfts.map((n) => n.id) })
          }
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
});
