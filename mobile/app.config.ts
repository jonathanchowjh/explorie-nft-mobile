import type { ConfigContext, ExpoConfig } from "expo/config";

// Extends app.json with values that come from the environment.
// Android builds outside Expo Go need a Google Maps key, or the map renders blank.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  plugins: [
    ...(config.plugins ?? []),
    ["react-native-maps", { androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY }],
  ],
});
