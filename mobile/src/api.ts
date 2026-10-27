import Constants from "expo-constants";
import { currentPosition } from "./location";
import { Wallet } from "./Wallet";

const SERVER_PORT = 8787;

export type Result<T = undefined> = { ok: true; value: T } | { ok: false; message: string };

// An NFT the wallet address holds on-chain, as the server reports it.
export type HeldNft = { unit: string; dropId: string; redeemed: boolean };

// The wallet whose key is in EXPO_PUBLIC_WALLET_KEY. Expo only inlines
// EXPO_PUBLIC_ variables that are written out in full, so read them here and
// nowhere else. The key ships inside the app, so it's for testnet demos only.
function loadWallet(): Result<Wallet> {
  const key = process.env.EXPO_PUBLIC_WALLET_KEY;
  if (!key) return { ok: false, message: "This app has no wallet key set up." };
  try {
    return { ok: true, value: new Wallet(key) };
  } catch {
    return { ok: false, message: "EXPO_PUBLIC_WALLET_KEY isn't an ed25519_sk key." };
  }
}

export function walletAddress(): string | undefined {
  const wallet = loadWallet();
  return wallet.ok ? wallet.value.address : undefined;
}

// In development the server runs next to the Expo dev server, so a phone reaches
// it at the host Expo Go loaded the app from. A build has no dev server, so it
// needs EXPO_PUBLIC_SERVER_URL.
function serverUrl(): string | undefined {
  if (process.env.EXPO_PUBLIC_SERVER_URL) return process.env.EXPO_PUBLIC_SERVER_URL;
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  return host && `http://${host}:${SERVER_PORT}`;
}

async function call<T>(path: string, body?: object): Promise<Result<T>> {
  const url = serverUrl();
  if (!url) return { ok: false, message: "This build doesn't know where the Explorie server is (EXPO_PUBLIC_SERVER_URL)." };
  try {
    const response = await fetch(
      `${url}${path}`,
      body && { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) },
    );
    const json = await response.json().catch(() => null);
    if (response.ok) return { ok: true, value: json as T };
    return { ok: false, message: (json as { error?: string } | null)?.error ?? `The server answered ${response.status}.` };
  } catch {
    return { ok: false, message: "Couldn't reach the Explorie server." };
  }
}

// A drop's QR poster holds "explorie:<drop id>:<claim code>".
export function parseClaimQr(data: string): { dropId: string; code: string } | null {
  const match = /^explorie:([^:]+):([^:]+)$/.exec(data);
  return match ? { dropId: match[1], code: match[2] } : null;
}

export async function fetchWallet(): Promise<Result<HeldNft[]>> {
  const wallet = loadWallet();
  if (!wallet.ok) return wallet;
  const result = await call<{ nfts: HeldNft[] }>(`/wallet/${wallet.value.address}`);
  return result.ok ? { ok: true, value: result.value.nfts } : result;
}

// Asks the server to mint the drop's NFT to the wallet address. The server
// checks the code and that the phone is at the drop.
export async function claimDrop(dropId: string, code: string): Promise<Result> {
  const wallet = loadWallet();
  if (!wallet.ok) return wallet;

  const location = await currentPosition();
  if (!location.ok) return location;

  const result = await call("/claims", { dropId, code, address: wallet.value.address, location: location.value });
  return result.ok ? { ok: true, value: undefined } : result;
}

// Signs the redemption, so the server knows the request comes from the
// address's owner. server/src/claims.ts checks the same message.
export async function redeemVoucher(unit: string): Promise<Result> {
  const wallet = loadWallet();
  if (!wallet.ok) return wallet;
  const { address, publicKey } = wallet.value;
  const signature = wallet.value.sign(`explorie:redeem:${unit}`);
  const result = await call("/redemptions", { address, unit, publicKey, signature });
  return result.ok ? { ok: true, value: undefined } : result;
}
