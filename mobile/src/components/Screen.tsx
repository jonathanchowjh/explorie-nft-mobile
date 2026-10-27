import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { colors, shadow } from "../theme";
import { Button } from "./ui";

type TopLevelScreen = "Home" | "Search" | "Scanner" | "Map" | "Wallet" | "Settings" | "Marketplace";

// The header, scrolling body and footer shared by the app's main screens.
// Header and footer links go back to the screen if it is already in the stack,
// and otherwise push it, so the stack stays bounded and Back keeps working.
// (popTo would instead replace the current screen when the target isn't open.)
export function Screen({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const goTo = (name: TopLevelScreen) => navigation.navigate(name, undefined, { pop: true });
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Home" onPress={() => goTo("Home")}>
          <Text style={styles.logo}>Explorie</Text>
        </Pressable>
        <View style={styles.headerButtons}>
          <Button icon="search" label="Search" onPress={() => goTo("Search")} />
          <Button icon="qrcode" label="Scan QR code" onPress={() => goTo("Scanner")} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Explore" icon="map" onPress={() => goTo("Map")} style={styles.explore} />
        <Button icon="wallet" label="Wallet" onPress={() => goTo("Wallet")} style={styles.footerButton} />
        <Button icon="cog" label="Settings" onPress={() => goTo("Settings")} style={styles.footerButton} />
        <Button icon="store" label="Marketplace" onPress={() => goTo("Marketplace")} style={styles.footerButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logo: { color: colors.brand, fontSize: 20, fontWeight: "700" },
  headerButtons: { flexDirection: "row", gap: 10 },
  body: { gap: 15, padding: 15, paddingTop: 5 },
  footer: { flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingVertical: 10 },
  explore: { ...shadow, flex: 1.5 },
  footerButton: { flex: 1 },
});
