import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";
import { View as ThemedView, Text } from "../components/Themed";
import { NFTBox } from "../components/NFTBox";
import flagPinkImg from "../assets/images/pointer.png";
import oni from "../assets/images/oni.png";
import kong from "../assets/images/pixilart.png";
import sutu from "../assets/images/sutu.gif";

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
    distance: "2 Km",
    rating: "4,8 Rating",
    location: "Grafitti Zone @ Mauer Park",
    locationImage:
      "https://lh5.googleusercontent.com/p/AF1QipOa23rPK0ZG_8VcP8D5w0GO1xvrk6SZ4XNxC6Rr=w408-h306-k-no",
    locationDescription:
      "Mauerpark is a public linear park in Berlin's Prenzlauer Berg district. The name translates to 'Wall Park', referring to its status as a former part of the Berlin Wall and its Death Strip. The park is located at the border of Prenzlauer Berg and Gesundbrunnen district of former West Berlin.",
    centerOffset: {
      x: -18,
      y: -60,
    },
    anchor: {
      x: 0.84,
      y: 1,
    },
    image: oni,
    success: true,
  },
  {
    title: "Cyber kongz #0000",
    location: "betahaus @ Kreuzberg",
    locationImage:
      "https://lh5.googleusercontent.com/p/AF1QipMF7ZT-a5V0BIgu3ZvstuLKHj9ZFOlOvQt18Zge=w426-h240-k-no",
    locationDescription:
      "betahaus | Kreuzberg is our HQ space, and in some ways, our heart and soul. It's a coworking and event space that's been serving the city's startup and freelancer community since 2009. In 2018, we moved into a building at the edge of Kreuzberg with a long legacy of influential tenants. We've restored the space to include modern coworking areas, event spaces, team rooms, balconies, café, and rooftop terrace.",
    distance: "500 m",
    rating: "2,8 Rating",
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
    success: false,
  },
  {
    title: "Sutu Data Healer",
    location: "Gropius-Bau @ Mitte",
    locationImage:
      "https://lh5.googleusercontent.com/p/AF1QipPprvlubkbvLCzPVl_YefU4WryX6Jf0LogsvDn9=w408-h271-k-no",
    locationDescription:
      "Martin-Gropius-Bau, commonly known as Gropius Bau, is an important exhibition building in Berlin, Germany. Originally a museum of applied arts, the building has been a listed historical monument since 1966. It is located at 7 Niederkirchnerstraße in Berlin-Kreuzber",
    distance: "1.4 Km",
    rating: "4,1 Rating",
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
    image: sutu,
    success: true,
  },
];

export default function MapsScreen({ navigation }) {
  const [activeNft, setActiveNft] = useState(2);
  const [redeemerActive, setRedeemerActive] = useState(false);

  return (
    <View style={styles.container}>
      <MapView
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
      <ThemedView
        style={{
          ...styles.nftView,
          height: redeemerActive ? height - 60 : "auto",
        }}
      >
        <NFTBox nft={demoNfts[activeNft]} navigation={navigation} />
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
