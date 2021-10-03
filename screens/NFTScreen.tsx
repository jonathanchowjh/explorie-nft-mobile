import * as React from "react";
import { StyleSheet, Button, Image } from "react-native";
import Clipboard from '@react-native-community/clipboard';
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
import { AppContext } from "../context/AppContext"
import {
  Header,
  Footer,
  IconInput,
  BannerGradient,
  Spacer,
  ProgressBar,
  CardsView,
  ButtonSmall
} from "../components/Elements";

interface Card {
  title: String;
  subtitle: String;
  image?: String;
}

export default function NFTScreen({
  navigation, route
}: RootTabScreenProps<"Home">) {
  const { context, setContext } = React.useContext(AppContext);
  const [nft, onChangeNft] = React.useState({});
  const [open, onChangeOpen] = React.useState({ qr: false })
  React.useEffect(() => {
    if (!route || !route.params) {
      return
    }
    if (route.params.data) {
      onChangeNft(route.params.data)
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <ScrollView style={styles.container}>
        {/* <BannerGradient
          title="Collectable"
          subtitle="Your Collectable"
          colorOne="rgba(0,255,0,0.8)"
          colorTwo="rgba(255,0,0,0.4)"
          profile="https://i.ibb.co/7b4DSq0/ExpImage.png"
          imageBool={false}
        /> */}
        <Spacer />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Spacer css={{ flex: 1 }} />
          <View style={{ flex: 3 }}>
            <View style={{
              aspectRatio: 1,
              borderRadius: 10,
              overflow: "hidden",
              justifyContent: "center" }}>
                <Image
                  style={{ flex: 1, width: "100%", aspectRatio: 1, resizeMode: "cover" }}
                  source={(nft && nft.image) ?
                    (nft.image instanceof String ? { uri: nft.image } : nft.image) :
                    "https://i.ibb.co/7b4DSq0/ExpImage.png"
                  }
                />
              </View>
            </View>
          <Spacer css={{ flex: 1 }} />
        </View>
        <Spacer css={{ height: 20 }} />
        <Text style={{ fontSize: 20, fontWeight: "600" }}>{nft ? nft.title : ""}</Text>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>{nft ? nft.subtitle : ""}</Text>
        <Spacer />
        {
          nft && nft.type == "voucher" ? (
            <ButtonSmall
              title="Redeem"
              css={{ padding: 10, height: 40, backgroundColor: "#ff4444" }}
              cssText={{ color: "white" }}
              onClick={() => {
                setContext({
                  ...context,
                  myNfts: [
                    ...context.myNfts.filter((ele) => ele.asset_name != nft.asset_name),
                    {
                      ...nft,
                      type: "voucherRedeemed"
                    }
                  ]
                })
                navigation.navigate("Info", { ...nft, message: "Voucher Redeemed!" })
              }}
            />
            ) : (
              nft.type == "voucherRedeemed" ? (
                <View>
                  <ButtonSmall
                    title="Redeemed"
                    css={{ padding: 10, height: 40, backgroundColor: "#aaaaaa" }}
                    cssText={{ color: "black" }}
                    onClick={() => {}}
                  />
                  <Spacer />
                  <View style={{ flexDirection: "row" }}>
                    <ButtonSmall
                      title="Code: #jdndn"
                      icon="copy"
                      css={{ padding: 10, height: 40, backgroundColor: "#9bcdd4" }}
                      cssText={{ color: "black", fontSize: 12 }}
                      // onClick={async () => await Clipboard.setString("#jdndn")}
                      onClick={() => {}}
                    />
                    <Spacer css={{ flex: 0.1 }} />
                    <ButtonSmall
                      title="View QR Code"
                      icon="qrcode"
                      css={{ padding: 10, height: 40, backgroundColor: "#9bcdd4" }}
                      cssText={{ color: "black", fontSize: 12 }}
                      onClick={() => onChangeOpen({ ...open, qr: !open.qr })}
                    />
                    <Spacer css={{ flex: 0.5 }} />
                  </View>
                </View>
                
              ) : (
                <ButtonSmall
                  title="Marketplace"
                  css={{ padding: 10, height: 40, backgroundColor: "red" }}
                  cssText={{ color: "black" }}
                  onClick={() => navigation.navigate("Marketplace", { ...nft })}
                />
              )
            )
            
        }
        <Spacer />
        <Text style={{ fontSize: 14, fontWeight: "300" }}>{nft ? nft.locationDescription : ""}</Text>
        {
          open && open.qr ? (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Spacer css={{ flex: 1 }} />
              <View style={{ flex: 3 }}>
                <View style={{
                  aspectRatio: 1,
                  borderRadius: 10,
                  overflow: "hidden",
                  justifyContent: "center" }}>
                    <Image
                      style={{ flex: 1, width: "100%", aspectRatio: 1, resizeMode: "cover" }}
                      source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" }}
                    />
                  </View>
                </View>
              <Spacer css={{ flex: 1 }} />
            </View>
          ) : <View />
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
