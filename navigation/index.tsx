/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import WalletScreen from "../screens/WalletScreen";
import NFTScreen from "../screens/NFTScreen";
import MapsScreen from "../screens/MapsScreen";
import RedeemerScreen from "../screens/RedeemScreen";
import SearchScreen from "../screens/SearchScreen";
import Scanner from "../screens/Scanner";
import InfoScreen from "../screens/Info/InfoScreen";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExploryMap"
        component={MapsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Redeem"
        component={RedeemerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Scanner"
        component={Scanner}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NFT"
        component={NFTScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
