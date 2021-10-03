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
import {
  Header,
  Footer,
  IconInput,
  BannerGradient,
  Spacer,
  ProgressBar,
  CardsView,
  SimpleList
} from "../components/Elements";
import { AppContext } from "../context/AppContext"

interface Card {
  title: String;
  subtitle: String;
  image?: String;
}

export default function MarketplaceScreen({ navigation }: RootTabScreenProps<"Home">) {
  const { context, setContext } = React.useContext(AppContext);
  const [home, onChangeHome] = React.useState([
    {
      title: "Popular NFTs",
      nfts: [],
      filter: () => true
    },
    {
      title: "Vouchers Near Me",
      nfts: [],
      filter: () => true
    },
    {
      title: "Collectables Near Me",
      nfts: [],
      filter: () => true
    }
  ]);

  React.useEffect(() => {
    if (!context || !context.nfts) return
    onChangeHome(home.map((ele) => {
      return {
        ...ele,
        nfts: context.nfts.filter(ele.filter)
      }
    }))
  }, [context])
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
