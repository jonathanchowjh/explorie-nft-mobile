import * as React from "react";
import { StyleSheet, Button, Image } from "react-native";
import { View, Text } from "../../components/Themed";
import logo from "../../assets/images/logo-label.png";
import { RootTabScreenProps } from "../../types";

export default function FirstStepScreen({
  navigation,
}: RootTabScreenProps<"Step1">) {
  return (
    <View style={styles.container}>
      <Image source={logo}></Image>
      <Text style={styles.subtitle}>Explore the world, one NFT at a time</Text>
      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={() => navigation.navigate("Home")}
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    color: "#FF0000",
    padding: 15,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#FF0000",
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    bottom: 50,
    position: "absolute",
  },
  subtitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
