/// <reference types="node" />
import React from "react";
import { spawn, type ChildProcess } from "node:child_process";
import http from "node:http";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import App from "../src/App";
import { fetchWallet } from "../src/api";
import { DEMO_KEY } from "./FakeServer";

// The app against the real claim server (server/src/main.ts) rather than
// FakeServer, so the two can't drift apart. Only the camera, GPS and map are
// stand-ins. Run with `npm run test:e2e`; it needs the server's dependencies
// installed. The tests share one server, so they run in order.

let mockOnScan: ((result: { data: string }) => void) | undefined;
const madisonSquareGarden = { latitude: 40.7547105, longitude: -73.9856321 };

jest.mock("expo-camera", () => ({
  useCameraPermissions: () => [{ granted: true, canAskAgain: true }, jest.fn()],
  CameraView: (props: { onBarcodeScanned?: (result: { data: string }) => void }) => {
    mockOnScan = props.onBarcodeScanned;
    return null;
  },
}));
jest.mock("expo-location", () => ({
  Accuracy: { Balanced: 3 },
  requestForegroundPermissionsAsync: () => Promise.resolve({ granted: true }),
  getCurrentPositionAsync: () => Promise.resolve({ coords: madisonSquareGarden }),
  watchPositionAsync: () => Promise.resolve({ remove: () => {} }),
}));
jest.mock("react-native-maps", () => ({ __esModule: true, default: () => null, Marker: () => null }));
jest.mock("@expo/vector-icons/FontAwesome5", () => ({ __esModule: true, default: () => null }));
jest.mock(
  "react-native-safe-area-context",
  () => jest.requireActual<{ default: object }>("react-native-safe-area-context/jest/mock").default,
);

// Under Jest, Expo replaces fetch with its native implementation, which is
// stubbed out, and Node's own fetch isn't reachable from the test. This is
// enough fetch for the app's calls to the server.
function nodeFetch(url: string, init?: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method: init?.method ?? "GET", headers: init?.headers as http.OutgoingHttpHeaders });
    request.on("error", reject);
    request.on("response", (response) => {
      let body = "";
      response.on("data", (chunk: Buffer) => (body += chunk));
      response.on("end", () => {
        const status = response.statusCode ?? 0;
        resolve({ ok: status >= 200 && status < 300, status, json: async () => JSON.parse(body) } as Response);
      });
    });
    request.end(init?.body as string | undefined);
  });
}

const PORT = "8795";
let server: ChildProcess;
// Drop id → what its poster's QR code holds.
const posters = new Map<string, string>();

beforeAll(async () => {
  server = spawn(process.execPath, ["src/main.ts"], {
    cwd: path.join(__dirname, "../../server"),
    env: { ...process.env, PORT },
  });
  const output = await new Promise<string>((resolve, reject) => {
    let out = "";
    server.stdout!.on("data", (chunk: Buffer) => {
      out += chunk;
      if (/explorie:11:\w+/.test(out)) resolve(out);
    });
    server.on("exit", (code: number | null) => reject(new Error(`The server exited (${code}):\n${out}`)));
  });
  for (const [text, id] of output.matchAll(/explorie:(\d+):\w+/g)) posters.set(id, text);
  globalThis.fetch = nodeFetch as typeof fetch;
  process.env.EXPO_PUBLIC_SERVER_URL = `http://localhost:${PORT}`;
  // The server seeds its demo wallet, so the app signs in with that wallet's key.
  process.env.EXPO_PUBLIC_WALLET_KEY = DEMO_KEY;
}, 60_000);

afterAll(() => {
  server.kill();
});

async function heldDrops() {
  const wallet = await fetchWallet();
  if (!wallet.ok) throw new Error(wallet.message);
  return wallet.value.map((n) => `${n.dropId}${n.redeemed ? " (redeemed)" : ""}`);
}

async function scan(data: string) {
  const buttons = screen.getAllByLabelText("Scan QR code");
  await fireEvent.press(buttons[buttons.length - 1]);
  await fireEvent(screen.getByLabelText("Poster code"), "changeText", data);
  mockOnScan?.({ data });
}

describe("the app against the real server", () => {
  it("starts with the server's demo wallet", async () => {
    await render(<App />);
    expect(await screen.findByText("3 NFTs collected")).toBeTruthy();
    expect(await heldDrops()).toEqual(["11", "6", "7 (redeemed)"]);
  });

  it("claims a drop from its poster, and the server mints it", async () => {
    await render(<App />);
    await screen.findByText("3 NFTs collected");
    await scan(posters.get("5")!);
    expect(await screen.findByText("Congrats!", {}, { timeout: 10_000 })).toBeTruthy();
    expect(await heldDrops()).toEqual(["11", "6", "7 (redeemed)", "5"]);
  });

  it("shows the server's refusals", async () => {
    await render(<App />);
    await scan(posters.get("5")!);
    expect(await screen.findByText("Already claimed", {}, { timeout: 10_000 })).toBeTruthy();
  });

  it("rejects a code made up for a drop", async () => {
    await render(<App />);
    await scan("explorie:8:0000000000000000");
    expect(await screen.findByText("Wrong claim code", {}, { timeout: 10_000 })).toBeTruthy();
  });

  it("redeems a voucher, and the server records it", async () => {
    await render(<App />);
    const wallet = screen.getAllByLabelText("Wallet");
    await fireEvent.press(wallet[wallet.length - 1]);
    await fireEvent.press(await screen.findByText("Pop UP by Reggie Watts"));
    await fireEvent.press(await screen.findByText("Redeem"));
    expect(await screen.findByText("Voucher Redeemed!", {}, { timeout: 10_000 })).toBeTruthy();
    expect(await heldDrops()).toEqual(["11", "6 (redeemed)", "7 (redeemed)", "5"]);
  });
});
