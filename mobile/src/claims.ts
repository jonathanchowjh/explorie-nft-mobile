import Constants from "expo-constants";
import * as Location from "expo-location";

const SERVER_PORT = 8787;

export type ClaimResult = { ok: true } | { ok: false; message: string };

// Expo only inlines EXPO_PUBLIC_ variables that are written out in full, so read them here and nowhere else.
export function walletAddress(): string | undefined {
  return process.env.EXPO_PUBLIC_WALLET_ADDRESS || undefined;
}

// In development the server runs next to the Expo dev server, so a phone reaches
// it at the host Expo Go loaded the app from.
function serverUrl(): string {
  if (process.env.EXPO_PUBLIC_SERVER_URL) return process.env.EXPO_PUBLIC_SERVER_URL;
  const host = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";
  return `http://${host}:${SERVER_PORT}`;
}

// A drop's QR poster holds "explorie:<drop id>:<claim code>".
export function parseClaimQr(data: string): { dropId: string; code: string } | null {
  const match = /^explorie:([^:]+):([^:]+)$/.exec(data);
  return match ? { dropId: match[1], code: match[2] } : null;
}

// Asks the server to mint the drop's NFT to the wallet address. The server
// checks the code and that the phone is at the drop.
export async function claimDrop(dropId: string, code: string): Promise<ClaimResult> {
  const address = walletAddress();
  if (!address) return { ok: false, message: "This app has no wallet address set up." };

  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) return { ok: false, message: "Explorie needs your location to check you're at the drop." };
  let location;
  try {
    const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    location = { latitude: coords.latitude, longitude: coords.longitude };
  } catch {
    return { ok: false, message: "Couldn't find your location." };
  }

  try {
    const response = await fetch(`${serverUrl()}/claims`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ dropId, code, address, location }),
    });
    if (response.ok) return { ok: true };
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, message: body?.error ?? `The server answered ${response.status}.` };
  } catch {
    return { ok: false, message: "Couldn't reach the Explorie server." };
  }
}
