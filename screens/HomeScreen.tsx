import * as React from "react";
import { StyleSheet, Button, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TextInput, ScrollView, Pressable } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { shadow, noShadow } from "../constants/Styles"
import { reshape2D } from "../constants/Functions"
import AdaptiveIcon from "../assets/images/adaptive-icon.png"
import Icon from 'react-native-vector-icons/FontAwesome';

interface Card {
  title: String,
  subtitle: String,
  image?: String
}

export default function HomeScreen({
  navigation,
}: RootTabScreenProps<"Home">) {
  const [text, onChangeText] = React.useState("");
  const [open, onChangeOpen] = React.useState({ vouchers: false, collectables: false });

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
            <View style={{ flex: 2, backgroundColor: "transparent", alignSelf: "flex-start" }}>
              <Text style={styles.walletTitle}>Wallet</Text>  
              <Text style={styles.walletSubtitle}>EXP Balance: 5.200</Text> 
            </View>
            <View style={{ flex: 1, backgroundColor: "transparent", alignSelf: "flex-start" }}>
              <Pressable style={styles.walletButton}>
                <View style={styles.flexRow}>
                  <Text style={styles.walletButtonText}>Buy Now</Text>
                </View>
              </Pressable>
              <Pressable style={styles.walletButton}>
                <View style={styles.flexRow}>
                  <Text style={styles.walletButtonText}>Send</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.cards}>
        <View style={styles.cardsHead}>
          <Text style={styles.cardsHeadText}>Your Vouchers</Text>
          <Pressable style={styles.cardsHeadMore} onPress={() => {
            onChangeOpen({...open, vouchers: !open.vouchers})
          }}>
            <View style={styles.flexRow}>
              <Text style={styles.cardsHeadMoreText}>View More</Text>
            </View>
          </Pressable>
        </View>
        {
          reshape2D([{title: "Vegan Resto", subtitle: "$1 off NFT"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"}]
          , 3).map((ele : Array<Card>, idx) => {
            if (open.vouchers || idx == 0)
            return (
            <View style={styles.flexRow}>
            {
              ele.map((ele : Card) => {
                if (Object.keys(ele).length == 0) {
                  return <View style={{ ...styles.cardsCard, ...noShadow, backgroundColor: "transparent" }}></View>
                }
                return (
                  <View style={styles.cardsCard}>
                    <View style={{flex: 1, overflow: "hidden"}}>
                      <Image
                        style={styles.cardsCardImg}
                        source={ele.image ? {uri:ele.image} : AdaptiveIcon}
                      />
                    </View>
                    <Text style={styles.cardsCardTitle}>{ele.title}</Text>
                    <Text style={styles.cardsCardSubtitle}>{ele.subtitle}</Text>
                  </View>
                )
              })
            }
            </View>
            )
          })
        }
        
      </View>

      <View style={styles.cards}>
        <View style={styles.cardsHead}>
          <Text style={styles.cardsHeadText}>Your Collectables</Text>
          <Pressable style={styles.cardsHeadMore} onPress={() => {
            onChangeOpen({...open, collectables: !open.collectables})
          }}>
            <View style={styles.flexRow}>
              <Text style={styles.cardsHeadMoreText}>View More</Text>
            </View>
          </Pressable>
        </View>
        {
          reshape2D([{title: "Vegan Resto", subtitle: "$1 off NFT"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"},
          {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/eggs-breakfast-avocado-1296x728-header.jpg?w=1155&h=1528"}]
          , 3).map((ele : Array<Card>, idx) => {
            if (open.collectables || idx == 0)
            return (
            <View style={styles.flexRow}>
            {
              ele.map((ele : Card) => {
                if (Object.keys(ele).length == 0) {
                  return <View style={{ ...styles.cardsCard, ...noShadow, backgroundColor: "transparent" }}></View>
                }
                return (
                  <View style={styles.cardsCard}>
                    <View style={{flex: 1, overflow: "hidden"}}>
                      <Image
                        style={styles.cardsCardImg}
                        source={ele.image ? {uri:ele.image} : AdaptiveIcon}
                      />
                    </View>
                    <Text style={styles.cardsCardTitle}>{ele.title}</Text>
                    <Text style={styles.cardsCardSubtitle}>{ele.subtitle}</Text>
                  </View>
                )
              })
            }
            </View>
            )
          })
        }
        
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
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    overflow: "scroll"
  },
  // HEADER
  header: {
    height: 80,
    display: "flex",
    flexDirection: "row"
  },
  headerWelcome: {
    flex: 1,
    margin: 10,
    alignSelf: "center"
  },
  headerWelcomeText: {
    fontSize: 20,
    fontWeight: "700"
  },
  headerWallet: {
    ...shadow,
    flex: 1,
    flexDirection: "row",
    padding: 10,
    borderRadius: 20,
    margin: 10,
    alignItems: "center"
  },
  headerWalletText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    alignSelf: "center",
    textAlign: "center"
  },

  // Search
  search: {
    ...shadow,
    height: 60,
    margin: 10,
    padding: 10,
    paddingLeft: 20,
    borderRadius: 10,
    backgroundColor: "#eeeeee"
  },
  flexRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  input: {
    fontSize: 20,
    height: 40,
    padding: 10,
    backgroundColor: "transparent"
  },

  // Wallet
  wallet: {
    ...shadow,
    height: 120,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden"
  },
  walletTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "white"
  },
  walletSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white"
  },
  walletButton: {
    backgroundColor: "white",
    height: 30,
    margin: 7,
    borderRadius: 10
  },
  walletButtonText: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "red"
  },
  
  // Cards
  cards: {
    margin: 10
  },
  cardsHead: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardsHeadText: {
    color: "black",
    fontSize: 20,
    fontWeight: "700"
  },
  cardsHeadMore: {

  },
  cardsHeadMoreText: {
    color: "orange",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    alignSelf: "center"
  },
  cardsCard: {
    ...shadow,
    flex: 1,
    height: 120,
    margin: 10,
    borderRadius: 10
  },
  cardsCardImg: {
    resizeMode: "cover",
    flex: 1,
    height: 10,
    width: "100%"
  },
  cardsCardTitle: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14
  },
  cardsCardSubtitle: {
    textAlign: "center",
    fontSize: 12
  }
});
