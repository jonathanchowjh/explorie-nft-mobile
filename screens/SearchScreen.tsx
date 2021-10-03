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
  ButtonSmall,
  SimpleList
} from "../components/Elements";
import { AppContext } from "../context/AppContext"

export default function SearchScreen({ route, navigation }: RootTabScreenProps<"Search">) {
  const [search, onChangeSearch] = React.useState("");
  const [status, onChangeStatus] = React.useState("Search here ;)");
  const [header, onChangeHeader] = React.useState("");
  const [list, onChangeList] = React.useState([]);
  const { context, setContext } = React.useContext(AppContext);

  React.useEffect(() => {
    if (!route || !route.params) {
      return
    }
    if (route.params.data) {
      onChangeList(route.params.data)
    }
    if (route.params.title) {
      onChangeHeader(route.params.title)
    }
  }, [])
  
  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <View style={{ flexDirection: "row" }}>
        <Spacer css={{ flex: 0.05 }} />
        <ButtonSmall
          title=""
          icon="chevron-left"
          css={{ backgroundColor: "#CCCCCC", height: 40, flex: 0.2 }}
          onClick={() => navigation.goBack()}
        />
        <Spacer css={{ flex: 0.05 }} />
        <IconInput
          value={search}
          onChangeValue={(e) => {
            onChangeSearch(e)
            if (e.length == 0) {
              onChangeList([])
              onChangeHeader("")
            } else {
              onChangeHeader(`Search: ${e}`)
              onChangeList(context.nfts.filter((ele) => ele.title.toLowerCase().includes(e.toLowerCase())
                || ele.subtitle.toLowerCase().includes(e.toLowerCase())))
            }
          }}
          iconL="search"
          placeholder="Search"
        />
        <Spacer css={{ flex: 0.05 }} />
      </View>
      <Spacer />
      <ScrollView style={styles.container}>
        <SimpleList
          title={header}
          list={list}
          listFunc={(data) => navigation.navigate("ExploryMap", data)}
          error="Search Here..."
          navigation={navigation}
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
    // flex: 1,
    overflow: "hidden",
    padding: 15,
    paddingTop: 5,
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
