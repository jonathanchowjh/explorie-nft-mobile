import React from "react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import App from "../App";

// Jest only lets mock factories use variables whose names start with "mock".
let mockPermission = { granted: true, canAskAgain: true };
let mockOnScan: ((result: { data: string }) => void) | undefined;

jest.mock("expo-camera", () => ({
  useCameraPermissions: () => [mockPermission, () => Promise.resolve(mockPermission)],
  CameraView: (props: { onBarcodeScanned?: (result: { data: string }) => void }) => {
    mockOnScan = props.onBarcodeScanned;
    return null;
  },
}));
jest.mock("react-native-maps", () => ({ __esModule: true, default: () => null, Marker: () => null }));
jest.mock("@expo/vector-icons/FontAwesome5", () => ({ __esModule: true, default: () => null }));
jest.mock(
  "react-native-safe-area-context",
  () => jest.requireActual<{ default: object }>("react-native-safe-area-context/jest/mock").default,
);

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

describe("Scanner", () => {
  beforeEach(() => {
    mockPermission = { granted: true, canAskAgain: true };
    mockOnScan = undefined;
  });

  it("collects the NFT whose id is in the QR code", async () => {
    jest.useFakeTimers();
    await openScanner();
    await scan("5");
    expect(await screen.findByText("Congrats!")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText("4 NFTs collected")).toBeTruthy();
    jest.useRealTimers();
  });

  it("acts on only the first of a burst of scan events", async () => {
    await openScanner();
    await scan("nope", "5");
    expect(await screen.findByText("That QR code isn't an Explorie NFT.")).toBeTruthy();
    expect(screen.queryByText("Congrats!")).toBeNull();
  });

  it("offers Settings when camera access is permanently denied", async () => {
    mockPermission = { granted: false, canAskAgain: false };
    await openScanner();
    expect(screen.getByText("Open Settings")).toBeTruthy();

    await fireEvent.press(screen.getByText("Back"));
    expect(screen.getByText("Popular NFTs")).toBeTruthy();
  });
});
