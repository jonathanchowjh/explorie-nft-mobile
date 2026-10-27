import React from "react";
import { ActivityIndicator, KeyboardAvoidingView, Linking, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import type { ScreenProps } from "../navigation";
import { catalogue } from "../data/seed";
import { useNfts } from "../state/NftStore";
import { parseClaimQr } from "../api";
import { colors } from "../theme";
import { Button } from "../components/ui";

// Scans a drop's QR poster, or takes its code typed in, and claims its NFT.
export default function ScannerScreen({ navigation }: ScreenProps<"Scanner">) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);
  const [claiming, setClaiming] = React.useState(false);
  // The camera can report a code several times before the re-render turns scanning off.
  const handled = React.useRef(false);
  const { collect } = useNfts();
  const insets = useSafeAreaInsets();

  const claim = async (data: string) => {
    const qr = parseClaimQr(data.trim());
    if (!qr || !catalogue.some((n) => n.id === qr.dropId)) {
      navigation.navigate("Info", { success: false, message: "That QR code isn't an Explorie NFT." });
      return;
    }
    setClaiming(true);
    const result = await collect(qr.dropId, qr.code);
    setClaiming(false);
    navigation.navigate("Info", { id: qr.dropId, success: result.ok, message: result.ok ? undefined : result.message });
  };

  const onScan = (data: string) => {
    if (handled.current) return;
    handled.current = true;
    setScanned(true);
    claim(data);
  };

  if (!permission) {
    return <Message text="Requesting camera permission" />;
  }
  if (claiming) {
    return (
      <Message text="Claiming your NFT…">
        <ActivityIndicator color={colors.brand} />
      </Message>
    );
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
        <CodeEntry onSubmit={claim} />
      </Message>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : ({ data }) => onScan(data)}
      />
      <View style={[styles.panel, { paddingBottom: 20 + insets.bottom }]}>
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
        <CodeEntry onSubmit={claim} />
      </View>
    </KeyboardAvoidingView>
  );
}

// For a poster the camera can't read, or a device without a camera: the
// line printed under the QR code, such as "explorie:5:e7e7b1c205e7ee6d".
function CodeEntry({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = React.useState("");
  const submit = () => text.trim() && onSubmit(text);
  return (
    <View style={styles.codeEntry}>
      <TextInput
        value={text}
        onChangeText={setText}
        onSubmitEditing={submit}
        placeholder="Or type the poster's code"
        accessibilityLabel="Poster code"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="go"
        style={styles.codeInput}
      />
      <Button title="Claim" onPress={submit} disabled={!text.trim()} style={styles.codeButton} />
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
  panel: { gap: 15, padding: 20 },
  rescan: { height: 50 },
  codeEntry: { flexDirection: "row", alignSelf: "stretch", gap: 10 },
  codeInput: { flex: 1, height: 44, paddingHorizontal: 12, borderRadius: 7, fontSize: 15, backgroundColor: colors.surface },
  codeButton: { height: 44, paddingHorizontal: 16 },
});
