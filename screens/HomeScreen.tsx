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

      <View style={{ flex: 1 }}>
        <Text style={{ flex: 1 }}>Explore the world, one NFT at a time</Text>
      </View>
      <View style={{ flex: 1 }}>
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
    marginTop: 50
  },
  input: {
    borderWidth: 1,
    height: 40,
    margin: 12,
    padding: 10,
  }
});
