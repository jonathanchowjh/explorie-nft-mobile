import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import type { ScreenProps } from "../navigation";
import { findNft, useNfts } from "../state/NftStore";
import { colors } from "../theme";
import { Screen } from "../components/Screen";
import { Button } from "../components/ui";

export default function NftScreen({ navigation, route }: ScreenProps<"Nft">) {
  const { wallet, redeem } = useNfts();
  const { id } = route.params;
  const nft = wallet.find((n) => n.id === id) ?? { ...findNft(id), redeemed: false };
  const [showQr, setShowQr] = React.useState(false);

  return (
    <Screen>
      <Image source={nft.image} style={styles.image} />
      <View>
        <Text style={styles.title}>{nft.title}</Text>
        <Text style={styles.subtitle}>{nft.location.name}</Text>
      </View>
      {nft.kind === "collectable" && (
        <Button
          title="Marketplace"
          onPress={() => navigation.navigate("Marketplace")}
          style={[styles.wide, styles.marketplace]}
          textStyle={styles.darkText}
        />
      )}
      {nft.kind === "voucher" && !nft.redeemed && (
        <Button
          title="Redeem"
          onPress={() => {
            redeem(nft.id);
            navigation.navigate("Info", { id: nft.id, success: true, message: "Voucher Redeemed!" });
          }}
          style={[styles.wide, styles.redeem]}
          textStyle={styles.lightText}
        />
      )}
      {nft.kind === "voucher" && nft.redeemed && (
        <>
          <Button title="Redeemed" disabled style={[styles.wide, styles.redeemed]} textStyle={styles.darkText} />
          <View style={styles.row}>
            <Button
              title="Code: #jdndn"
              icon="copy"
              onPress={() => Clipboard.setStringAsync("#jdndn")}
              style={styles.codeButton}
              textStyle={styles.codeText}
            />
            <Button
              title="View QR Code"
              icon="qrcode"
              onPress={() => setShowQr((shown) => !shown)}
              style={styles.codeButton}
              textStyle={styles.codeText}
            />
          </View>
        </>
      )}
      <Text style={styles.description}>{nft.location.description}</Text>
      {showQr && <Image source={require("../../assets/images/qr-code.png")} style={styles.image} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: "60%", aspectRatio: 1, alignSelf: "center", borderRadius: 10 },
  title: { fontSize: 20, fontWeight: "600", color: colors.text },
  subtitle: { fontSize: 16, fontWeight: "500", color: colors.text },
  wide: { height: 40 },
  marketplace: { backgroundColor: colors.brand },
  redeem: { backgroundColor: "#ff4444" },
  redeemed: { backgroundColor: "#aaaaaa" },
  darkText: { color: "black" },
  lightText: { color: "white" },
  row: { flexDirection: "row", gap: 10 },
  codeButton: { flex: 1, height: 40, backgroundColor: "#9bcdd4" },
  codeText: { color: "black", fontSize: 12 },
  description: { fontSize: 14, fontWeight: "300", color: colors.text },
});
