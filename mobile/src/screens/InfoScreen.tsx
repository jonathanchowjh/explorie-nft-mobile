import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { ScreenProps } from "../navigation";
import { findNft } from "../state/NftStore";
import { colors } from "../theme";

const RETURN_HOME_MS = 5000;

export default function InfoScreen({ navigation, route }: ScreenProps<"Info">) {
  const { id, success, message } = route.params;
  const nft = id ? findNft(id) : undefined;

  React.useEffect(() => {
    const timer = setTimeout(() => navigation.navigate("Home", undefined, { pop: true }), RETURN_HOME_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  const defaultMessage = success
    ? `You redeemed the NFT: ${nft?.title}!`
    : "In order to redeem this NFT you have to be in the correct location";

  return (
    <View style={styles.container}>
      <Image
        source={success ? require("../../assets/images/successIcon.png") : require("../../assets/images/errorIcon.png")}
      />
      <Text style={styles.title}>{success ? "Congrats!" : "Woopsy!"}</Text>
      <Text style={styles.message}>{message ?? defaultMessage}</Text>
      {success && nft && <Image source={nft.image} style={styles.nftImage} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  title: { color: colors.brand, fontSize: 30, fontWeight: "bold", marginVertical: 30 },
  message: { color: "black", fontSize: 20, fontWeight: "bold", marginBottom: 30, textAlign: "center", width: 290 },
  nftImage: { width: 180, height: 180, borderRadius: 25 },
});
