import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ScreenProps } from "../navigation";
import { findNft } from "../state/NftStore";
import { colors } from "../theme";
import { Button, Icon } from "../components/ui";
import { LocationPhoto } from "../components/nft";

export default function RedeemScreen({ navigation, route }: ScreenProps<"Redeem">) {
  const nft = findNft(route.params.id);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LocationPhoto nft={nft} style={styles.photo} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 20 + insets.bottom }]}>
        <View style={styles.pills}>
          <Text style={[styles.pill, styles.pillText]}>{nft.location.name}</Text>
          <View style={styles.pill}>
            <Icon name="location-arrow" size={22} color={colors.brand} />
          </View>
          <View style={styles.pill}>
            <Icon name="heart" size={22} color={colors.brand} />
          </View>
        </View>
        <View style={styles.summary}>
          <View style={styles.summaryText}>
            <Text style={styles.title}>{nft.title}</Text>
            <View style={styles.stats}>
              <Icon name="arrow-down" size={20} color={colors.brand} />
              <Text>{nft.distance}</Text>
              <Icon name="heart" size={20} color={colors.brand} />
              <Text>{nft.rating}</Text>
            </View>
          </View>
          <Image source={nft.image} style={styles.nftImage} />
        </View>
        <Text style={styles.description}>{nft.location.description}</Text>
        <Button
          title="Scan to collect"
          onPress={() => navigation.navigate("Scanner", undefined, { pop: true })}
          style={styles.collect}
          textStyle={styles.collectText}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  photo: { height: 250 },
  body: { gap: 15, padding: 20 },
  pills: { flexDirection: "row", gap: 8 },
  pill: {
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 50,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  pillText: { color: colors.brand, fontSize: 12, fontWeight: "bold", paddingVertical: 10 },
  summary: { flexDirection: "row", gap: 10 },
  summaryText: { flex: 1, gap: 10 },
  title: { fontSize: 25, fontWeight: "bold", color: colors.text },
  stats: { flexDirection: "row", alignItems: "center", gap: 10 },
  nftImage: { width: 140, height: 140, borderRadius: 25 },
  description: { fontSize: 13, lineHeight: 23 },
  collect: { height: 56, borderRadius: 10, backgroundColor: colors.brand },
  collectText: { color: "white" },
});
