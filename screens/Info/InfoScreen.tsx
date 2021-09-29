import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { View, Text } from "../../components/Themed";
import successIcon from "../../assets/images/successIcon.png";
import errorIcon from "../../assets/images/errorIcon.png";

export default function InfoScreen({ route, navigation }) {
  const { title, image, success } = route.params;
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={success ? successIcon : errorIcon}
      ></Image>
      <View style={styles.bottom}>
        <Text style={styles.title}>{success ? "Congrats!" : "Woopsy!"}</Text>
        <Text style={styles.message}>
          {success
            ? `You redeemed the NFT: ${title}!`
            : "In order to redeem this NFT you have to be in the correct location"}
        </Text>
      </View>
    </View>
  );
}

const black = "#000";
const red = "red";
const styles = StyleSheet.create({
  bottom: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    color: black,
    fontSize: 15,
  },
  title: {
    color: red,
    fontSize: 25,
  },
});
