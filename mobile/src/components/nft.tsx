import React from "react";
import { Image, ImageStyle, Pressable, StyleProp, StyleSheet, Text, View } from "react-native";
import type { Nft } from "../types";
import { colors, shadow } from "../theme";
import { Button, EmptyText } from "./ui";

function SectionHeader({ title, onMore }: { title: string; onMore?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text numberOfLines={1} style={styles.sectionTitle}>
        {title}
      </Text>
      {onMore && (
        <Pressable accessibilityRole="button" onPress={onMore}>
          <Text style={styles.sectionMore}>View More</Text>
        </Pressable>
      )}
    </View>
  );
}

export function LocationPhoto({ nft, style }: { nft: Nft; style: StyleProp<ImageStyle> }) {
  // A missing photo shows as a plain grey box.
  return <Image source={nft.location.photo ? { uri: nft.location.photo } : undefined} style={[styles.photo, style]} />;
}

export function NftList({ title, items, empty, onPress, onMore }: {
  title: string;
  items: Nft[];
  empty: string;
  onPress: (nft: Nft) => void;
  onMore?: () => void;
}) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} onMore={onMore} />
      {items.length === 0 && <EmptyText>{empty}</EmptyText>}
      {items.map((nft) => (
        <Pressable key={nft.id} accessibilityRole="button" onPress={() => onPress(nft)} style={styles.listRow}>
          <Image source={nft.image} style={styles.listImage} />
          <View style={styles.listText}>
            <Text numberOfLines={1} style={styles.listTitle}>
              {nft.title}
            </Text>
            <Text numberOfLines={1} style={styles.listSubtitle}>
              {nft.location.name}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

export function NftCards({ title, items, onPress, onMore }: {
  title: string;
  items: Nft[];
  onPress: (nft: Nft) => void;
  onMore: () => void;
}) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} onMore={onMore} />
      {items.length === 0 && <EmptyText>Nothing Here</EmptyText>}
      <View style={styles.cards}>
        {items.slice(0, 3).map((nft) => (
          <Pressable key={nft.id} accessibilityRole="button" onPress={() => onPress(nft)} style={styles.card}>
            <Image source={nft.image} style={styles.cardImage} />
            <Text numberOfLines={1} style={styles.cardTitle}>
              {nft.title}
            </Text>
            <Text numberOfLines={1} style={styles.cardSubtitle}>
              {nft.location.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function NftMapCard({ nft, distance, collected, onCollect, onDetails }: {
  nft: Nft;
  // How far the phone is from the drop, once that's known.
  distance?: string;
  // Whether the wallet already holds it; then the main button opens it there instead.
  collected: boolean;
  onCollect: () => void;
  onDetails: () => void;
}) {
  return (
    <View style={styles.mapCard}>
      <Text style={styles.mapCardTitle}>{nft.title}</Text>
      <View style={styles.mapCardLocation}>
        <LocationPhoto nft={nft} style={styles.mapCardPhoto} />
        <View>
          <Text style={styles.mapCardPlace}>{nft.location.name}</Text>
          {distance && <Text style={styles.mapCardDistance}>{distance} away</Text>}
        </View>
      </View>
      <View style={styles.mapCardButtons}>
        <Button
          title={collected ? "View in wallet" : "Scan to collect"}
          icon={collected ? "wallet" : "qrcode"}
          iconColor={colors.brand}
          onPress={onCollect}
          style={styles.collectButton}
        />
        <Button icon="info-circle" label="Details" iconColor="white" onPress={onDetails} style={styles.infoButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { flex: 1, fontSize: 20, fontWeight: "700", color: colors.text },
  sectionMore: { fontSize: 15, fontWeight: "700", color: colors.accent },

  photo: { backgroundColor: colors.surface },

  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 70,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  listImage: { width: 50, height: 50, borderRadius: 10 },
  listText: { flex: 1 },
  listTitle: { fontSize: 16, fontWeight: "600", color: colors.text },
  listSubtitle: { fontSize: 14, color: colors.textMuted },

  cards: { flexDirection: "row", gap: 20 },
  card: { ...shadow, flex: 1, maxWidth: "30%", paddingBottom: 6, borderRadius: 10, backgroundColor: "white" },
  cardImage: { width: "100%", height: 90, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  cardTitle: { textAlign: "center", fontWeight: "600", fontSize: 14, color: colors.text },
  cardSubtitle: { textAlign: "center", fontSize: 12, color: colors.textMuted },

  mapCard: { gap: 10, margin: 15, padding: 15, borderRadius: 25, backgroundColor: "#F2F6F9" },
  mapCardTitle: { fontSize: 20, fontWeight: "500", marginLeft: 5 },
  mapCardLocation: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 15, backgroundColor: "white" },
  mapCardPhoto: { width: 60, height: 60, borderRadius: 10 },
  mapCardPlace: { fontSize: 15, fontWeight: "500", marginBottom: 5 },
  mapCardDistance: { fontSize: 13, color: "#3B3B3B" },
  mapCardButtons: { flexDirection: "row", gap: 10 },
  collectButton: { flex: 7, height: 56, borderRadius: 10 },
  infoButton: { flex: 1, height: 56, borderRadius: 10, backgroundColor: colors.brand },
});
