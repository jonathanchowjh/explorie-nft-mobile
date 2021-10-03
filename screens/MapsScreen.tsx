import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";
import { View as ThemedView } from "../components/Themed";
import { useAppContext } from "../context/AppContext";
import { NFTBox } from "../components/NFTBox";
import pointer from "../assets/images/pointer.png";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 40.7496569;
const LONGITUDE = -73.9930029;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const indexOfFunc = (arr: any, func: (a: any) => Boolean) => {
  for (let i = 0; i < arr.length; i++) {
    if (func(arr[i])) {
      return i
    }
  }
  return 0
}

export default function MapsScreen({ navigation, route }) {
  const [activeNft, setActiveNft] = useState(2);
  const { state } = useAppContext(); // HALP ME HERE!
  const { nfts } = state;

  React.useEffect(() => {
    if (!route || !route.params) {
      return
    }
    if (route.params.data) {
      setActiveNft(indexOfFunc(nfts, (ele: any) => ele.asset_name == route.params.data.asset_name))
    }
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {nfts.map((nft, index) => (
          <Marker
            key={index}
            onPress={() => setActiveNft(index)}
            coordinate={nft.coordinates}
            centerOffset={nft.centerOffset}
            anchor={nft.anchor}
            image={pointer}
            opacity={activeNft === index ? 1 : 0.6}
          ></Marker>
        ))}
      </MapView>
      <ThemedView
        style={{
          ...styles.nftView,
        }}
      >
        <NFTBox nft={nfts[activeNft]} navigation={navigation} />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  nftView: {
    backgroundColor: "#F2F6F9",
    borderRadius: 25,
    margin: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    width: width - 30,
  },
});
