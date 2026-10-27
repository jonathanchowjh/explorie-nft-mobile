import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NftProvider } from "./state/NftStore";
import Navigation from "./navigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <NftProvider>
        <Navigation />
        <StatusBar style="dark" />
      </NftProvider>
    </SafeAreaProvider>
  );
}
