import * as React from "react";
import { StyleSheet } from "react-native";
import { View, Text, ScrollView } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import {
  Header,
  Footer,
  BannerGradient,
  Spacer,
} from "../components/Elements";

export default function MarketplaceScreen({ navigation }: RootTabScreenProps<"Home">) {
  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <ScrollView style={styles.container}>
        <BannerGradient
          title="Marketplace"
          subtitle="Buy and Sell your collectables"
          colorOne="rgba(0,200,0,0.8)"
          colorTwo="rgba(0,0,0,0.4)"
          profile="https://i.ibb.co/7b4DSq0/ExpImage.png"
          cssTitle={{ color: "black" }}
          cssSubtitle={{ color: "white" }}
          imageBool={false}
        />
        <Spacer />
        <Text style={{
          textAlign: "center",
          fontSize: 16,
          color: "grey",
          fontWeight: "800"
        }}>Under Development</Text>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
    padding: 15,
    paddingTop: 5,
  },
});
