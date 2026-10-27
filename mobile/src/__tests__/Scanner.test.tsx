import React from "react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import App from "../App";
import { DEMO_ADDRESS, FakeServer } from "../../test/FakeServer";

// Jest only lets mock factories use variables whose names start with "mock".
let mockPermission = { granted: true, canAskAgain: true };
let mockOnScan: ((result: { data: string }) => void) | undefined;
let mockLocationGranted = true;
const madisonSquareGarden = { latitude: 40.7547105, longitude: -73.9856321 };

jest.mock("expo-camera", () => ({
  useCameraPermissions: () => [mockPermission, () => Promise.resolve(mockPermission)],
  CameraView: (props: { onBarcodeScanned?: (result: { data: string }) => void }) => {
    mockOnScan = props.onBarcodeScanned;
    return null;
  },
}));
jest.mock("expo-location", () => ({
  Accuracy: { Balanced: 3 },
  requestForegroundPermissionsAsync: () => Promise.resolve({ granted: mockLocationGranted }),
  getCurrentPositionAsync: () => Promise.resolve({ coords: madisonSquareGarden }),
}));
jest.mock("react-native-maps", () => ({ __esModule: true, default: () => null, Marker: () => null }));
jest.mock("@expo/vector-icons/FontAwesome5", () => ({ __esModule: true, default: () => null }));
jest.mock(
  "react-native-safe-area-context",
  () => jest.requireActual<{ default: object }>("react-native-safe-area-context/jest/mock").default,
);

let server: FakeServer;

async function openScanner() {
  await render(<App />);
  const buttons = screen.getAllByLabelText("Scan QR code");
  await fireEvent.press(buttons[buttons.length - 1]);
}

async function scan(...codes: string[]) {
  await act(async () => {
    for (const data of codes) mockOnScan?.({ data });
  });
}

// Info returns to Home after five seconds, where the collected count shows.
async function backHome() {
  await act(async () => {
    jest.advanceTimersByTime(5000);
  });
}

describe("Scanner", () => {
  beforeEach(() => {
    mockPermission = { granted: true, canAskAgain: true };
    mockOnScan = undefined;
    mockLocationGranted = true;
    server = new FakeServer();
    server.install();
  });

  it("claims the drop in the QR code, from where the phone is", async () => {
    jest.useFakeTimers();
    await openScanner();
    await scan("explorie:5:0123456789abcdef");
    expect(await screen.findByText("Congrats!")).toBeTruthy();

    expect(server.fetch.mock.calls.some(([url]) => /:8787\/claims$/.test(url))).toBe(true);
    expect(server.claims).toEqual([{
      dropId: "5",
      code: "0123456789abcdef",
      address: DEMO_ADDRESS,
      location: madisonSquareGarden,
    }]);

    await backHome();
    expect(screen.getByText("4 NFTs collected")).toBeTruthy();
    jest.useRealTimers();
  });

  it("shows the server's reason when it refuses the claim", async () => {
    jest.useFakeTimers();
    server.claimRefusal = { status: 403, body: { error: "Too far from the drop" } };
    await openScanner();
    await scan("explorie:5:0123456789abcdef");
    expect(await screen.findByText("Woopsy!")).toBeTruthy();
    expect(screen.getByText("Too far from the drop")).toBeTruthy();

    await backHome();
    expect(screen.getByText("3 NFTs collected")).toBeTruthy();
    jest.useRealTimers();
  });

  it("says so when the server can't be reached", async () => {
    await openScanner();
    server.unreachable = true;
    await scan("explorie:5:0123456789abcdef");
    expect(await screen.findByText("Couldn't reach the Explorie server.")).toBeTruthy();
  });

  it("doesn't call the server without location access", async () => {
    mockLocationGranted = false;
    await openScanner();
    await scan("explorie:5:0123456789abcdef");
    expect(await screen.findByText("Explorie needs your location to check you're at the drop.")).toBeTruthy();
    expect(server.claims).toEqual([]);
  });

  it("doesn't call the server without a wallet key", async () => {
    delete process.env.EXPO_PUBLIC_WALLET_KEY;
    await openScanner();
    await scan("explorie:5:0123456789abcdef");
    expect(await screen.findByText("This app has no wallet key set up.")).toBeTruthy();
    expect(server.claims).toEqual([]);
  });

  it("acts on only the first of a burst of scan events, and rejects a bare NFT id", async () => {
    await openScanner();
    await scan("5", "explorie:5:0123456789abcdef");
    expect(await screen.findByText("That QR code isn't an Explorie NFT.")).toBeTruthy();
    expect(server.claims).toEqual([]);
  });

  it("claims a typed-in code, for a poster the camera can't read", async () => {
    await openScanner();
    await fireEvent.changeText(screen.getByLabelText("Poster code"), " explorie:5:0123456789abcdef ");
    await fireEvent.press(screen.getByText("Claim"));
    expect(await screen.findByText("Congrats!")).toBeTruthy();
    expect(screen.getByText("Added to your wallet: Nets vs. Knicks game ticket (front seats)!")).toBeTruthy();
    expect(server.claims.map((c) => c.code)).toEqual(["0123456789abcdef"]);
  });

  it("takes a typed-in code without camera access", async () => {
    mockPermission = { granted: false, canAskAgain: false };
    await openScanner();
    await fireEvent.changeText(screen.getByLabelText("Poster code"), "explorie:5:0123456789abcdef");
    await fireEvent(screen.getByLabelText("Poster code"), "submitEditing");
    expect(await screen.findByText("Congrats!")).toBeTruthy();
  });

  it("offers Settings when camera access is permanently denied", async () => {
    mockPermission = { granted: false, canAskAgain: false };
    await openScanner();
    expect(screen.getByText("Open Settings")).toBeTruthy();

    await fireEvent.press(screen.getByText("Back"));
    expect(screen.getByText("Popular NFTs")).toBeTruthy();
  });
});
