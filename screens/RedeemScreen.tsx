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
        <Text style={styles.title}>{title}</Text>
        <Image style={styles.nftImage} source={image} />
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
        <Text style={styles.locationDescription}>{locationDescription}</Text>
        <Button
          title="Redeem"
          styles={{
            buttonText: {
              color: "white",
              fontWeight: "bold",
            },
            buttonBackground: {
              width: "auto",
              borderRadius: 10,
              padding: 18,
              alignItems: "center",
              backgroundColor: "red",
            },
          }}
          onPress={() => navigation.navigate("Scanner", { ...route.params })}
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
  locationDescription: {
    fontSize: 13,
    lineHeight: 23,
    marginBottom: 15,
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
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: 400,
    padding: 20,
  },
  nftImage: {
    height: 180,
    width: 350,
  },
  rating: {
    flexDirection: "row",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 15,
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
