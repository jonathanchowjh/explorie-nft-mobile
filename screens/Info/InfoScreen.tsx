import * as React from "react";
import { useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import { View, Text } from "../../components/Themed";
import successIcon from "../../assets/images/successIcon.png";
import errorIcon from "../../assets/images/errorIcon.png";

export default function InfoScreen({ route, navigation }) {
  const { title, image, success, message } = route.params;
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Home");
    }, 5000);
  });

  return (
    <View style={styles.container}>
      <View style={styles.bottom}>
        <Image source={success ? successIcon : errorIcon}></Image>
        <Text style={styles.title}>{success ? "Congrats!" : "Woopsy!"}</Text>
        <Text style={styles.message}>
          {
            message ? message :
            success
              ? `You redeemed the NFT: ${title}!`
              : "In order to redeem this NFT you have to be in the correct location"
          }
        </Text>
        {success && <Image style={styles.nftImage} source={image}></Image>}
      </View>
    </View>
  );
}

const white = "white";
const black = "#000";
const red = "red";
const styles = StyleSheet.create({
  bottom: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    backgroundColor: white,
    flex: 1,
    justifyContent: "center",
  },
  message: {
    color: black,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    width: 290,
  },
  nftImage: {
    borderRadius: 25,
    maxHeight: "30%",
    maxWidth: "60%",
  },
  title: {
    color: red,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 30,
  },
});
