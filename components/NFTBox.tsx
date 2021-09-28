import * as React from "react";
import { View as ThemedView, Text, Button } from "./Themed";
import { StyleSheet, View, Image } from "react-native";

interface NFTBoxProps {
  nft: any;
  navigation: any;
}

export const NFTBox = ({ nft, navigation }: NFTBoxProps) => {
  return (
    <>
      <Text style={styles.title}>{nft.title}</Text>
      <ThemedView style={styles.nftRow}>
        <Image source={nft.image} style={styles.tinyNft}></Image>
        <ThemedView style={styles.nftColumn}>
          <Text style={styles.nftText}>{nft.title}</Text>
          <Text style={styles.nftDistance}>{nft.distance}</Text>
        </ThemedView>
      </ThemedView>
      <View style={styles.buttonsRow}>
        <Button
          onPress={() => navigation.navigate("Redeem", { ...nft })}
          title="Redeem"
          styles={{
            buttonText: {
              color: "red",
              fontWeight: "bold",
            },
            buttonBackground: {
              borderRadius: 10,
              padding: 15,
              marginRight: 5,
              alignItems: "center",
              flexGrow: 2,
              backgroundColor: "white",
            },
          }}
        ></Button>
        <Button
          onPress={() => console.log("pressed")}
          title="+"
          styles={{
            buttonText: {
              color: "white",
              fontWeight: "bold",
            },
            buttonBackground: {
              borderRadius: 10,
              padding: 18,
              alignItems: "center",
              flexGrow: 1,
              backgroundColor: "red",
            },
          }}
        ></Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: "row",
  },
  nftColumn: {
    flexDirection: "column",
    justifyContent: "center",
  },
  nftDistance: {
    color: "#3B3B3B",
    fontSize: 13,
  },
  nftRow: {
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
    padding: 10,
  },
  nftText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  tinyNft: {
    height: 50,
    marginRight: 10,
    width: 50,
  },
  title: {
    fontWeight: "bold",
    marginLeft: 10,
  },
});
