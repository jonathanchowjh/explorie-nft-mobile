import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ScreenProps } from "../navigation";
import { catalogue } from "../data/seed";
import { findNft } from "../state/NftStore";
import { NftMapCard } from "../components/nft";

const CENTER = { latitude: 40.7496569, longitude: -73.9930029 };
const LATITUDE_DELTA = 0.0922;
const pointer = require("../../assets/images/pointer.png");

export default function MapScreen({ navigation, route }: ScreenProps<"Map">) {
  const { width, height } = useWindowDimensions();
  const [selectedId, setSelectedId] = React.useState(route.params?.id ?? catalogue[0].id);
  const selected = findNft(selectedId);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...CENTER, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LATITUDE_DELTA * (width / height) }}
      >
        {catalogue.map((nft) => (
          <Marker
            key={nft.id}
            coordinate={nft.location.coordinate}
            image={pointer}
            anchor={{ x: 0.5, y: 1 }}
            centerOffset={{ x: 0, y: -60 }}
            opacity={nft.id === selectedId ? 1 : 0.6}
            onPress={() => setSelectedId(nft.id)}
          />
        ))}
      </MapView>
      <SafeAreaView edges={["bottom"]}>
        <NftMapCard
          nft={selected}
          onCollect={() => navigation.navigate("Scanner", undefined, { pop: true })}
          onDetails={() => navigation.navigate("Redeem", { id: selected.id })}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
});
