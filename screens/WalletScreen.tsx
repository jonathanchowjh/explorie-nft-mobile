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
import { shadow, noShadow } from "../constants/Styles";
import { reshape2D } from "../constants/Functions";
import AdaptiveIcon from "../assets/images/adaptive-icon.png";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Header,
  Footer,
  IconInput,
  BannerGradient,
  Spacer,
  ProgressBar,
  CardsView,
} from "../components/Elements";

import { AppContext } from "../context/AppContext"

interface Card {
  title: String;
  subtitle: String;
  image?: String;
}

export default function WalletScreen({
  navigation,
}: RootTabScreenProps<"Home">) {
  const { context, setContext } = React.useContext(AppContext);
  const [wallet, onChangeWallet] = React.useState([
    {
      title: "My Vouchers",
      nfts: [],
      filter: ele => ele.type == "voucher" || ele.type == "voucherRedeemed"
    },
    {
      title: "My Collectables",
      nfts: [],
      filter: ele => ele.type == "collectable"
    }
  ]);

  React.useEffect(() => {
    if (!context || !context.myNfts) return
    onChangeWallet(wallet.map((ele) => {
      return {
        ...ele,
        nfts: context.myNfts.filter(ele.filter)
      }
    }))
  }, [context])

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <ScrollView style={styles.container}>
        <BannerGradient
          title="Wallet"
          subtitle="EXP Balance: 582.34"
          colorOne="rgba(255,0,0,0.8)"
          colorTwo="rgba(255,0,0,0.4)"
          bOne="djnsj2udb2j"
          bTwo="Settings"
          bOneIcon="clone"
          imageBool={false}
        />
        <Spacer />
        {
          wallet ? wallet.map((ele, num) => {
            return (
              <CardsView
                key={num}
                items={ele.nfts}
                title={ele.title}
                navigation={navigation}
              />
            )
          }) : <View />
        }
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
