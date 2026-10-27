import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import type { ScreenProps } from "../navigation";
import { catalogue } from "../data/seed";
import { useNfts } from "../state/NftStore";
import { colors } from "../theme";
import { Button } from "../components/ui";

// A valid code is an NFT's id, e.g. a QR code containing "5".
export default function ScannerScreen({ navigation }: ScreenProps<"Scanner">) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);
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

  const onScan = (data: string) => {
    if (handled.current) return;
    handled.current = true;
    setScanned(true);
    const nft = catalogue.find((n) => n.id === data);
    if (!nft) {
      navigation.navigate("Info", { success: false, message: "That QR code isn't an Explorie NFT." });
      return;
    }
    navigation.navigate("Info", { id: nft.id, success: collect(nft.id) });
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
