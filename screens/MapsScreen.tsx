import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import { View as ThemedView, Text, Button } from "../components/Themed";
import flagPinkImg from "../assets/images/flag-pink.png";
import oni from "../assets/images/oni.png";
import kong from "../assets/images/pixilart.png";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const demoNfts = [
  {
    title: "0N1 Force #2819",
    coordinates: {
      latitude: LATITUDE + SPACE,
      longitude: LONGITUDE + SPACE,
    },
    centerOffset: {
      x: -18,
      y: -60,
    },
    anchor: {
      x: 0.84,
      y: 1,
    },
    image: oni,
  },
  {
    title: "Cyber kongz #0000",
    coordinates: {
      latitude: LATITUDE - SPACE,
      longitude: LONGITUDE - SPACE,
    },
    centerOffset: {
      x: -42,
      y: -60,
    },
    anchor: {
      x: 0.84,
      y: 1,
    },
    image: kong,
  },
  {
    title: "Crypto punk #7777",
    coordinates: {
      latitude: LATITUDE + SPACE,
      longitude: LONGITUDE - SPACE,
    },
    centerOffset: {
      x: -42,
      y: -60,
    },
    anchor: {
      x: 0.84,
      y: 1,
    },
    image: kong,
  },
];

export default function MapsScreen({ navigation }) {
  const [activeNft, setActiveNft] = useState(1);

  return (
    <View style={styles.container}>
      <MapView
        //provider={this.props.provider}
        style={styles.map}
        userInterfaceStyle="dark"
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {demoNfts.map((nft, index) => (
          <Marker
            key={index}
            onPress={() => setActiveNft(index)}
            coordinate={nft.coordinates}
            centerOffset={nft.centerOffset}
            anchor={nft.anchor}
            image={flagPinkImg}
            opacity={activeNft === index ? 1 : 0.6}
          ></Marker>
        ))}
      </MapView>
      <ThemedView style={styles.nftView}>
        <Text style={styles.title}>{demoNfts[activeNft].title}</Text>
        <ThemedView style={styles.nftRow}>
          <Image
            source={demoNfts[activeNft].image}
            style={styles.tinyNft}
          ></Image>
          <ThemedView style={styles.nftColumn}>
            <Text style={styles.nftText}>{demoNfts[activeNft].title}</Text>
            <Text style={styles.nftDistance}>5min away</Text>
          </ThemedView>
        </ThemedView>
        <View style={styles.buttonsRow}>
          <Button
            onPress={() => console.log("pressed")}
            title="Redeem"
            styles={{
              buttonText: {
                color: "red",
                fontWeight: "bold",
              },
              buttonBackground: {
                borderRadius: 10,
                padding: 15,
                marginRight: 5,
                alignItems: "center",
                flexGrow: 2,
                backgroundColor: "white",
              },
            }}
          ></Button>
          <Button
            onPress={() => console.log("pressed")}
            title="+"
            styles={{
              buttonText: {
                color: "white",
                fontWeight: "bold",
              },
              buttonBackground: {
                borderRadius: 10,
                padding: 18,
                alignItems: "center",
                flexGrow: 1,
                backgroundColor: "red",
              },
            }}
          ></Button>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: "row",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  nftColumn: {
    flexDirection: "column",
    justifyContent: "center",
  },
  nftDistance: {
    color: "#3B3B3B",
    fontSize: 13,
  },
  nftRow: {
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
    padding: 10,
  },
  nftText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  nftView: {
    backgroundColor: "#F2F6F9",
    borderRadius: 25,
    margin: 15,
    paddingBottom: 25,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 25,
    width: width - 30,
  },
  tinyNft: {
    height: 50,
    marginRight: 10,
    width: 50,
  },
  title: {
    fontWeight: "bold",
    marginLeft: 10,
  },
});
