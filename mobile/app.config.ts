import type { ConfigContext, ExpoConfig } from "expo/config";

// Extends app.json with values that come from the environment.
// - Android builds outside Expo Go need a Google Maps key, or the map renders blank.
// - Android release builds refuse plain http, which the local claim server speaks. EAS sets
//   EAS_BUILD_PROFILE, so every build but production may use it; production should use an https server.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  plugins: [
    ...(config.plugins ?? []),
    ["react-native-maps", { androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY }],
    ["expo-build-properties", { android: { usesCleartextTraffic: process.env.EAS_BUILD_PROFILE !== "production" } }],
  ],
});
