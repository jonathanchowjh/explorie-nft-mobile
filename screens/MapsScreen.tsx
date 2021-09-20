import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";
import flagPinkImg from "../assets/images/flag-pink.png";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

export default function MapsScreen({ navigation }) {
  const [marker1, setMarker1] = useState(true);
  const [marker2, setMarker2] = useState(false);

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
        <Marker
          onPress={() => navigation.navigate("Modal")}
          coordinate={{
            latitude: LATITUDE + SPACE,
            longitude: LONGITUDE + SPACE,
          }}
          centerOffset={{ x: -18, y: -60 }}
          anchor={{ x: 0.69, y: 1 }}
          image={flagPinkImg}
        ></Marker>
        <Marker
          coordinate={{
            latitude: LATITUDE - SPACE,
            longitude: LONGITUDE - SPACE,
          }}
          centerOffset={{ x: -42, y: -60 }}
          anchor={{ x: 0.84, y: 1 }}
          image={flagPinkImg}
        />
        <Marker
          coordinate={{
            latitude: LATITUDE + SPACE,
            longitude: LONGITUDE - SPACE,
          }}
          centerOffset={{ x: -42, y: -60 }}
          anchor={{ x: 0.84, y: 1 }}
          opacity={0.6}
          image={flagPinkImg}
        />
      </MapView>
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
  marker: {
    fontWeight: "bold",
    marginLeft: 46,
    marginTop: 33,
  },
});
