import Constants from "expo-constants";
import { currentPosition } from "./location";

const SERVER_PORT = 8787;

export type Result<T = undefined> = { ok: true; value: T } | { ok: false; message: string };

// An NFT the wallet address holds on-chain, as the server reports it.
export type HeldNft = { unit: string; dropId: string; redeemed: boolean };

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

async function call<T>(path: string, body?: object): Promise<Result<T>> {
  try {
    const response = await fetch(
      `${serverUrl()}${path}`,
      body && { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) },
    );
    const json = await response.json().catch(() => null);
    if (response.ok) return { ok: true, value: json as T };
    return { ok: false, message: (json as { error?: string } | null)?.error ?? `The server answered ${response.status}.` };
  } catch {
    return { ok: false, message: "Couldn't reach the Explorie server." };
  }
}

const noAddress = { ok: false, message: "This app has no wallet address set up." } as const;

// A drop's QR poster holds "explorie:<drop id>:<claim code>".
export function parseClaimQr(data: string): { dropId: string; code: string } | null {
  const match = /^explorie:([^:]+):([^:]+)$/.exec(data);
  return match ? { dropId: match[1], code: match[2] } : null;
}

export async function fetchWallet(): Promise<Result<HeldNft[]>> {
  const address = walletAddress();
  if (!address) return noAddress;
  const result = await call<{ nfts: HeldNft[] }>(`/wallet/${address}`);
  return result.ok ? { ok: true, value: result.value.nfts } : result;
}

// Asks the server to mint the drop's NFT to the wallet address. The server
// checks the code and that the phone is at the drop.
export async function claimDrop(dropId: string, code: string): Promise<Result> {
  const address = walletAddress();
  if (!address) return noAddress;

  const location = await currentPosition();
  if (!location.ok) return location;

  const result = await call("/claims", { dropId, code, address, location: location.value });
  return result.ok ? { ok: true, value: undefined } : result;
}

export async function redeemVoucher(unit: string): Promise<Result> {
  const address = walletAddress();
  if (!address) return noAddress;
  const result = await call("/redemptions", { address, unit });
  return result.ok ? { ok: true, value: undefined } : result;
}
