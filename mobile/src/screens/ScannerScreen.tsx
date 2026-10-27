import React from "react";
import { ActivityIndicator, Linking, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import type { ScreenProps } from "../navigation";
import { catalogue } from "../data/seed";
import { useNfts } from "../state/NftStore";
import { parseClaimQr } from "../claims";
import { colors } from "../theme";
import { Button } from "../components/ui";

// Scans a drop's QR poster and claims its NFT.
export default function ScannerScreen({ navigation }: ScreenProps<"Scanner">) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);
  const [claiming, setClaiming] = React.useState(false);
  // The camera can report a code several times before the re-render turns scanning off.
  const handled = React.useRef(false);
  const { collect } = useNfts();

  if (!permission) {
    return <Message text="Requesting camera permission" />;
  }
  if (!permission.granted) {
    return (
      <Message text="Explorie needs the camera to scan NFT QR codes.">
        {permission.canAskAgain ? (
          <Button title="Allow camera" onPress={requestPermission} />
        ) : (
          <Button title="Open Settings" onPress={() => Linking.openSettings()} />
        )}
        <Button title="Back" onPress={() => navigation.goBack()} />
      </Message>
    );
  }

  if (claiming) {
    return (
      <Message text="Claiming your NFT…">
        <ActivityIndicator color={colors.brand} />
      </Message>
    );
  }

  const onScan = async (data: string) => {
    if (handled.current) return;
    handled.current = true;
    setScanned(true);
    const qr = parseClaimQr(data);
    if (!qr || !catalogue.some((n) => n.id === qr.dropId)) {
      navigation.navigate("Info", { success: false, message: "That QR code isn't an Explorie NFT." });
      return;
    }
    setClaiming(true);
    const result = await collect(qr.dropId, qr.code);
    setClaiming(false);
    navigation.navigate("Info", { id: qr.dropId, success: result.ok, message: result.ok ? undefined : result.message });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : ({ data }) => onScan(data)}
      />
      {scanned && (
        <Button
          title="Tap to Scan your NFT"
          onPress={() => {
            handled.current = false;
            setScanned(false);
          }}
          style={styles.rescan}
        />
      )}
    </View>
  );
}

function Message({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <View style={[styles.container, styles.message]}>
      <Text style={styles.messageText}>{text}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end", backgroundColor: colors.background },
  message: { justifyContent: "center", alignItems: "center", gap: 15, padding: 20 },
  messageText: { fontSize: 16, textAlign: "center", color: colors.text },
  rescan: { margin: 40, height: 50 },
});
