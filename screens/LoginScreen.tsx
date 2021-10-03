import * as React from "react";
import { SafeAreaView, StyleSheet, TextInput, Button } from "react-native";
import { RootTabScreenProps } from "../types";

export default function LoginScreen({
  navigation,
}: RootTabScreenProps<"Login">) {
  const [text, onChangeText] = React.useState("Username");
  const [number, onChangeNumber] = React.useState("123");

  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="Password"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    height: 40,
    margin: 12,
    padding: 10,
  },
});
