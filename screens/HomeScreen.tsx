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

interface Card {
  title: String;
  subtitle: String;
  image?: String;
}

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const [text, onChangeText] = React.useState("");
  const [open, onChangeOpen] = React.useState({
    vouchers: false,
    collectables: false,
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerWelcome}>
          <Text style={styles.headerWelcomeText}>Welcome, Sam</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Pressable style={styles.headerWallet}>
            <Text style={styles.headerWalletText}>#10328329</Text>
            <Icon name="copy" size={20} color="grey" />
          </Pressable>
        </View>
      </View>

      <View style={styles.search}>
        <View style={styles.flexRow}>
          <Icon name="search" size={20} color="grey" />
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            placeholder="Search"
          />
        </View>
      </View>

      <View style={styles.wallet}>
        <LinearGradient
          colors={["rgba(255,0,0,0.8)", "rgba(255,0,0,0.4)"]}
          style={{ flex: 1, padding: 15 }}
        >
          <View style={styles.flexRow}>
            <View
              style={{
                flex: 2,
                backgroundColor: "transparent",
                alignSelf: "flex-start",
              }}
            >
              <Text style={styles.walletTitle}>Wallet</Text>
              <Text style={styles.walletSubtitle}>EXP Balance: 5.200</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                alignSelf: "flex-start",
              }}
            >
              <Pressable style={styles.walletButton}>
                <View style={styles.flexRow}>
                  <Text style={styles.walletButtonText}>Change</Text>
                </View>
              </Pressable>
              <Pressable style={styles.walletButton}>
                <View style={styles.flexRow}>
                  <Text style={styles.walletButtonText}>Transfer</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.cards}>
        <View style={styles.cardsHead}>
          <Text style={styles.cardsHeadText}>Your Vouchers</Text>
          <Pressable
            style={styles.cardsHeadMore}
            onPress={() => {
              onChangeOpen({ ...open, vouchers: !open.vouchers });
            }}
          >
            <View style={styles.flexRow}>
              <Text style={styles.cardsHeadMoreText}>View More</Text>
            </View>
          </Pressable>
        </View>
        {reshape2D(
          [
            { title: "Vegan Resto", subtitle: "$1 off NFT" },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
          ],
          3
        ).map((ele: Array<Card>, idx) => {
          if (open.vouchers || idx == 0)
            return (
              <View style={styles.flexRow}>
                {ele.map((ele: Card) => {
                  if (Object.keys(ele).length == 0) {
                    return (
                      <View
                        style={{
                          ...styles.cardsCard,
                          ...noShadow,
                          backgroundColor: "transparent",
                        }}
                      ></View>
                    );
                  }
                  return (
                    <View style={styles.cardsCard}>
                      <View
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          borderRadius: 10,
                        }}
                      >
                        <View style={{ flex: 1, overflow: "hidden" }}>
                          <Image
                            style={styles.cardsCardImg}
                            source={
                              ele.image ? { uri: ele.image } : AdaptiveIcon
                            }
                          />
                        </View>
                        <Text style={styles.cardsCardTitle}>{ele.title}</Text>
                        <Text style={styles.cardsCardSubtitle}>
                          {ele.subtitle}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
        })}
      </View>

      <View style={styles.cards}>
        <View style={styles.cardsHead}>
          <Text style={styles.cardsHeadText}>Your Collectables</Text>
          <Pressable
            style={styles.cardsHeadMore}
            onPress={() => {
              onChangeOpen({ ...open, collectables: !open.collectables });
            }}
          >
            <View style={styles.flexRow}>
              <Text style={styles.cardsHeadMoreText}>View More</Text>
            </View>
          </Pressable>
        </View>
        {reshape2D(
          [
            { title: "Vegan Resto", subtitle: "$1 off NFT" },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
            {
              title: "Vegan Resto",
              subtitle: "$1 off NFT",
              image: "https://i.ibb.co/7b4DSq0/ExpImage.png",
            },
          ],
          3
        ).map((ele: Array<Card>, idx) => {
          if (open.collectables || idx == 0)
            return (
              <View style={styles.flexRow}>
                {ele.map((ele: Card) => {
                  if (Object.keys(ele).length == 0) {
                    return (
                      <View
                        style={{
                          ...styles.cardsCard,
                          ...noShadow,
                          backgroundColor: "transparent",
                        }}
                      ></View>
                    );
                  }
                  return (
                    <View style={styles.cardsCard}>
                      <View
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          borderRadius: 10,
                        }}
                      >
                        <View style={{ flex: 1, overflow: "hidden" }}>
                          <Image
                            style={styles.cardsCardImg}
                            source={
                              ele.image ? { uri: ele.image } : AdaptiveIcon
                            }
                          />
                        </View>
                        <Text style={styles.cardsCardTitle}>{ele.title}</Text>
                        <Text style={styles.cardsCardSubtitle}>
                          {ele.subtitle}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
        })}
      </View>

      <View style={{}}>
        <Button
          title="Next"
          onPress={() => navigation.navigate("ExploryMap")}
        ></Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
    padding: 20,
    paddingBottom: 40,
    paddingTop: 40,
  },
  // HEADER
  header: {
    display: "flex",
    flexDirection: "row",
    height: 80,
  },
  headerWelcome: {
    alignSelf: "center",
    flex: 1,
    margin: 10,
  },
  headerWelcomeText: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerWallet: {
    ...shadow,
    alignItems: "center",
    borderRadius: 20,
    flex: 1,
    flexDirection: "row",
    margin: 10,
    padding: 10,
  },
  headerWalletText: {
    alignSelf: "center",
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
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
