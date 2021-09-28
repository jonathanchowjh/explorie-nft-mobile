import * as React from "react";
import { StyleSheet, Button, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
} from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { shadow } from "../constants/Styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { Header, Footer, IconInput, BannerGradient, Spacer } from "../components/Elements"

interface Card {
  title: String;
  subtitle: String;
  image?: String;
}

export default function HomeScreen({
  navigation,
}: RootTabScreenProps<"Home">) {
  const [search, onChangeSearch] = React.useState("");
  const [open, onChangeOpen] = React.useState({ vouchers: false, collectables: false });

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <ScrollView style={styles.container}>
        <BannerGradient
          title="Welcome, Sam"
          subtitle="Apprentice"
          colorOne="rgba(0,0,0,0)"
          colorTwo="rgba(0,0,0,0)"
          profile="https://i.ibb.co/7b4DSq0/ExpImage.png"
          cssTitle={{color: "black"}}
          cssSubtitle={{color: "orange"}}
          imageBool={false}
        />
        <Spacer />
        <IconInput
          value={search}
          onChangeValue={onChangeSearch}
          placeholder="Search"
          iconL="search"
        />
        <Spacer />
        <View style={{}}>
          <Button
            title="Next"
            onPress={() => navigation.navigate("Wallet")}
          ></Button>
        </View>
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
    paddingTop: 5
  },
  // Search
  search: {
    ...shadow,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
    height: 60,
    margin: 10,
    padding: 10,
    paddingLeft: 20,
  },
  flexRow: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
  },
  input: {
    backgroundColor: "transparent",
    fontSize: 20,
    height: 40,
    padding: 10,
  },

  // Wallet
  wallet: {
    ...shadow,
    borderRadius: 10,
    height: 120,
    margin: 10,
    overflow: "hidden",
  },
  walletTitle: {
    color: "white",
    fontSize: 30,
    fontWeight: "800",
  },
  walletSubtitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  walletButton: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 30,
    margin: 7,
  },
  walletButtonText: {
    color: "red",
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  // Cards
  cards: {
    margin: 10,
  },
  cardsHead: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardsHeadText: {
    color: "black",
    fontSize: 20,
    fontWeight: "700",
  },
  cardsHeadMore: {},
  cardsHeadMoreText: {
    alignSelf: "center",
    color: "orange",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  cardsCard: {
    ...shadow,
    borderRadius: 10,
    flex: 1,
    height: 120,
    margin: 10,
  },
  cardsCardImg: {
    flex: 1,
    height: 10,
    resizeMode: "cover",
    width: "100%",
  },
  cardsCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  cardsCardSubtitle: {
    fontSize: 12,
    textAlign: "center",
  },
});
