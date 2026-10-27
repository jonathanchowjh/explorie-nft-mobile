import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import MapScreen from "./screens/MapScreen";
import RedeemScreen from "./screens/RedeemScreen";
import InfoScreen from "./screens/InfoScreen";
import WalletScreen from "./screens/WalletScreen";
import NftScreen from "./screens/NftScreen";
import MarketplaceScreen from "./screens/MarketplaceScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ScannerScreen from "./screens/ScannerScreen";

export type RootStackParamList = {
  Home: undefined;
  Search: { title: string; ids: string[] } | undefined;
  Map: { id: string } | undefined;
  Redeem: { id: string };
  Info: { id?: string; success: boolean; message?: string };
  Wallet: undefined;
  Nft: { id: string };
  Marketplace: undefined;
  Settings: undefined;
  Scanner: undefined;
};

export type ScreenProps<Name extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, Name>;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Redeem" component={RedeemScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Nft" component={NftScreen} />
        <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
