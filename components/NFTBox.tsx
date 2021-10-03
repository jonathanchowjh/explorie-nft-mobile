import * as React from "react";
import { View as ThemedView, Text, Button } from "./Themed";
import { StyleSheet, View, Image } from "react-native";
import { AppContext } from "../context/AppContext"

interface NFTBoxProps {
  nft: any;
  navigation: any;
}

export const NFTBox = ({ nft, navigation }: NFTBoxProps) => {
  const { context, setContext } = React.useContext(AppContext);

  return (
    <>
      <Text style={styles.title}>{nft.title ? nft.title : "Title"}</Text>
      <ThemedView style={styles.nftRow}>
        <Image
          source={{ uri: nft.locationImage }}
          style={styles.tinyNft}
        ></Image>
        <ThemedView style={styles.nftColumn}>
          <Text style={styles.nftText}>{nft.location}</Text>
          <Text style={styles.nftDistance}>{nft.distance} away</Text>
        </ThemedView>
      </ThemedView>
      <View style={styles.buttonsRow}>
        <Button
          onPress={() => {
            if (nft.success) {
              setContext({
                ...context,
                // nfts: context.nfts.filter((ele: any) => ele.asset_name != nft.asset_name),
                myNfts: [
                  ...context.myNfts,
                  nft
                ]
              })
            }
            navigation.navigate("Redeem", { ...nft })
          }}
          title="Collect"
          icon="check"
          styles={{
            buttonText: {
              color: "red",
              fontSize: 18,
              fontWeight: "500",
              marginLeft: 5,
            },
            buttonBackground: {
              flexDirection: "row",
              justifyContent: "center",
              borderRadius: 10,
              padding: 15,
              marginRight: 10,
              alignItems: "center",
              flexGrow: 7,
              backgroundColor: "white",
            },
          }}
        ></Button>
        <Button
          onPress={() => console.log("pressed")}
          icon="info-circle"
          styles={{
            buttonText: {
              color: "white",
              fontWeight: "bold",
            },
            buttonBackground: {
              justifyContent: "center",
              borderRadius: 10,
              padding: 15,
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
    marginBottom: 10,
    padding: 10,
  },
  nftText: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
  },
  tinyNft: {
    borderRadius: 10,
    height: 60,
    marginRight: 10,
    width: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 15,
    marginLeft: 5,
  },
});
