import React from "react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import App from "../App";
import { FakeServer } from "../../test/FakeServer";

// Scanner tests cover the camera; here it only needs to stand in for the screen.
jest.mock("expo-camera", () => ({ useCameraPermissions: () => [null, jest.fn()], CameraView: () => null }));
// The phone stands at Madison Square Garden.
jest.mock("expo-location", () => ({
  Accuracy: { Balanced: 3 },
  requestForegroundPermissionsAsync: () => Promise.resolve({ granted: true }),
  watchPositionAsync: (_options: object, onChange: (l: object) => void) => {
    onChange({ coords: { latitude: 40.7547105, longitude: -73.9856321 } });
    return Promise.resolve({ remove: () => {} });
  },
}));
// The map is a native view with no JS fallback; these tests don't exercise it.
jest.mock("react-native-maps", () => ({ __esModule: true, default: () => null, Marker: () => null }));
// Icons load their font file on mount, which Jest's asset stubs can't serve.
jest.mock("@expo/vector-icons/FontAwesome5", () => ({ __esModule: true, default: () => null }));
// The real provider renders nothing until native code reports the insets.
jest.mock(
  "react-native-safe-area-context",
  () => jest.requireActual<{ default: object }>("react-native-safe-area-context/jest/mock").default,
);

// Screens lower in the stack stay mounted, so the focused screen's copy of a
// repeated element (header, footer) is the last match.
async function pressLast(label: string) {
  const matches = screen.getAllByLabelText(label);
  await fireEvent.press(matches[matches.length - 1]);
}

describe("App", () => {
  let server: FakeServer;
  beforeEach(() => {
    server = new FakeServer();
    server.install();
  });

  it("opens on Home with the three NFT sections", async () => {
    await render(<App />);
    expect(await screen.findByText("Popular NFTs")).toBeTruthy();
    expect(screen.getByText("Vouchers Near Me")).toBeTruthy();
    expect(screen.getByText("Collectables Near Me")).toBeTruthy();
    // The wallet comes from the server.
    expect(await screen.findByText("3 NFTs collected")).toBeTruthy();
  });

  it("shows why the wallet couldn't load", async () => {
    server.unreachable = true;
    await render(<App />);
    await pressLast("Wallet");
    expect(await screen.findByText("Couldn't reach the Explorie server.")).toBeTruthy();
    expect(screen.getAllByText("Nothing Here")).toHaveLength(2);
  });

  it("keeps history through header and footer links, so Back works", async () => {
    await render(<App />);

    await pressLast("Wallet");
    await pressLast("Search");
    expect(screen.getByPlaceholderText("Search")).toBeTruthy();

    await pressLast("Back");
    expect(screen.queryByPlaceholderText("Search")).toBeNull();
    expect(screen.getByText("My Vouchers")).toBeTruthy();
    // Home is still at the bottom of the stack, mounted but hidden.
    expect(screen.getByText("Popular NFTs", { includeHiddenElements: true })).toBeTruthy();
  });

  it("shows how far the phone is from the drop", async () => {
    await render(<App />);
    await fireEvent.press((await screen.findAllByText("0N1 Force #2819"))[0]);
    expect(await screen.findByText("590 m away")).toBeTruthy();

    await pressLast("Details");
    expect(await screen.findByText("590 m")).toBeTruthy();
  });

  it("opens a drop the wallet already holds instead of the scanner", async () => {
    await render(<App />);
    expect(await screen.findByText("3 NFTs collected")).toBeTruthy();
    await pressLast("Search");
    await fireEvent.changeText(screen.getByPlaceholderText("Search"), "Etherials");
    await fireEvent.press(await screen.findByText("Etherials meetup @ NFT.NYC"));

    await pressLast("View in wallet");
    expect(await screen.findByText("Marketplace")).toBeTruthy();
  });

  it("collects from the map card by opening the scanner", async () => {
    await render(<App />);
    await fireEvent.press((await screen.findAllByText("0N1 Force #2819"))[0]);
    await pressLast("Scan to collect");
    expect(screen.getByText("Requesting camera permission")).toBeTruthy();
  });

  it("collects from the details screen by opening the scanner", async () => {
    await render(<App />);
    await fireEvent.press((await screen.findAllByText("0N1 Force #2819"))[0]);
    await pressLast("Details");
    await pressLast("Scan to collect");
    expect(screen.getByText("Requesting camera permission")).toBeTruthy();
  });

  it("redeems a voucher from the wallet and shows it as redeemed", async () => {
    jest.useFakeTimers();
    await render(<App />);

    await pressLast("Wallet");
    await fireEvent.press(await screen.findByText("Pop UP by Reggie Watts"));
    await fireEvent.press(await screen.findByText("Redeem"));
    expect(await screen.findByText("Voucher Redeemed!")).toBeTruthy();

    // Info returns to Home on its own.
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.queryByText("Voucher Redeemed!")).toBeNull();

    await pressLast("Wallet");
    await fireEvent.press(await screen.findByText("Pop UP by Reggie Watts"));
    expect(await screen.findByText("Redeemed")).toBeTruthy();
    expect(screen.queryByText("Redeem")).toBeNull();
    expect(server.held.find((h) => h.dropId === "6")?.redeemed).toBe(true);
    jest.useRealTimers();
  });
});
