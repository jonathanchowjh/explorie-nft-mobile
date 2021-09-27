import * as React from "react";
import { StyleSheet, Button, Image } from "react-native";
import { View, Text } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export default function HomeScreen({
  navigation,
}: RootTabScreenProps<"Home">) {
  const [text, onChangeText] = React.useState("Username");
  const [number, onChangeNumber] = React.useState("123");

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.headerWelcome}>
          <Text style={styles.headerWelcomeText}>Welcome, Sam</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.headerWallet}>
            <Text style={styles.headerWalletText}>#10328329</Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 8 }}>
        <Text style={{ flex: 1 }}>Explore the world, one NFT at a time</Text>
      </View>
      <View style={{}}>
        <Button
          title="Next"
          onPress={() => navigation.navigate("ExploryMap")}
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40
  },
  // HEADER
  header: {
    flex: 1, 
    flexDirection: "row"
  },
  headerWelcome: {
    flex: 1,
    margin: 10,
    alignSelf: "center"
  },
  headerWelcomeText: {
    fontSize: 20,
    fontWeight: "700"
  },
  headerWallet: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    borderRadius: 20,
    margin: 10
  },
  headerWalletText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    alignSelf: "center",
    textAlign: "center"
  },
  // BODY
  input: {
    borderWidth: 1,
    height: 40,
    margin: 12,
    padding: 10,
  }
});
