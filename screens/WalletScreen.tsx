import * as React from "react";
import { StyleSheet } from "react-native";
import { View, ScrollView } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import {
  Header,
  Footer,
  BannerGradient,
  Spacer,
  CardsView,
} from "../components/Elements";

import { AppContext } from "../context/AppContext"

export default function WalletScreen({
  navigation,
}: RootTabScreenProps<"Home">) {
  const { context } = React.useContext(AppContext);
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
});
