import * as React from "react";
import { StyleSheet, ImageBackground, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { View, Button, Text } from "../components/Themed";

export default function RedeemScreen({ route, navigation }) {
  const {
    title,
    distance,
    rating,
    location,
    locationImage,
    locationDescription,
    image,
  } = route.params;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: locationImage }}
        resizeMode="cover"
        style={styles.image}
      ></ImageBackground>
      <View style={styles.nftBox}>
        <View style={styles.infoButtons}>
          <View style={[styles.tooltip]}>
            <Text style={styles.locationText}>{location}</Text>
          </View>
          <View style={[styles.tooltip]}>
            <FontAwesome
              size={22}
              style={styles.infoIcon}
              name="location-arrow"
              color="red"
            />
          </View>
          <View style={[styles.tooltip]}>
            <FontAwesome
              size={22}
              style={styles.infoIcon}
              name="heart"
              color="red"
            />
          </View>
        </View>
        <View style={styles.infos}>
          <View style={styles.texts}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.infoButtons}>
              <View style={styles.distance}>
                <FontAwesome
                  size={20}
                  name="arrow-down"
                  color="red"
                  style={styles.marginRight}
                />
                <Text style={styles.marginRight}>{distance}</Text>
              </View>
              <View style={styles.rating}>
                <FontAwesome
                  size={20}
                  name="heart"
                  color="red"
                  style={styles.marginRight}
                />
                <Text style={styles.marginRight}>{rating}</Text>
              </View>
            </View>
          </View>
          <Image style={styles.nftImage} source={image} />
        </View>
        <Text style={styles.locationDescription}>{locationDescription}</Text>
        <Button
          title="Collect"
          styles={{
            buttonText: {
              color: "white",
              fontWeight: "bold",
            },
            buttonBackground: {
              width: "auto",
              borderRadius: 10,
              padding: 18,
              justifyContent: "end",
              alignItems: "center",
              backgroundColor: "red",
            },
          }}
          onPress={() =>
            navigation.navigate("Info", {
              ...route.params,
            })
          }
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  distance: {
    flexDirection: "row",
  },
  image: {
    height: 250,
  },
  infoButtons: { flexDirection: "row", marginBottom: 15, marginTop: 15 },
  infoIcon: {
    flexGrow: 1,
    marginTop: 5,
  },
  infos: {
    flexDirection: "row",
  },
  locationDescription: {
    fontSize: 13,
    lineHeight: 23,
    marginBottom: 15,
    marginTop: 15,
    minHeight: 220,
  },
  locationText: {
    color: "red",
    fontSize: 12,
    fontWeight: "bold",
    padding: 10,
    width: "auto",
  },
  marginRight: {
    marginRight: 10,
  },
  nftBox: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: "column",
    height: 400,
    padding: 20,
  },
  nftImage: {
    borderRadius: 25,
    flexGrow: 1,
    maxHeight: 160,
    maxWidth: 190,
  },
  rating: {
    flexDirection: "row",
  },
  texts: {
    flexGrow: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    lineHeight: 40,
    textAlign: "left",
    width: 180,
  },
  tooltip: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 50,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
  },
});
