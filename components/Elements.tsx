import React, { useState } from "react";
import { StyleSheet, Button, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TextInput, ScrollView, Pressable } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { shadow, noShadow } from "../constants/Styles"
import { reshape2D } from "../constants/Functions"
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import LogoLabel from "../assets/images/logo-label.png"

interface StringMap { [key: string]: any; }

export const Spacer = (props : {
  css?: StringMap
}) => <View style={{
  height: 10,
  width: "100%",
  backgroundColor: "transparent",
  ...props.css
}} />

export const ButtonSmall = (props: {
  title?: string,
  icon?: string,
  onClick?: () => void,
  css?: StringMap
}) => {
  return (
    props.title || props.icon ? (
      <Pressable
        style={{ ...styles.smallButton, ...props.css }}
        onPress={props.onClick ? props.onClick : () => {}}
      >
        <View style={{ ...styles.flexRow, justifyContent: "center" }}>
          {
            props.icon ? <Icon name={props.icon} size={20} color="rgb(80,80,80)" /> : <View />
          }
          {
            props.title ? <Text style={styles.smallButtonText}>{props.title}</Text> : <View />
          }
        </View>
      </Pressable>
    ) : (<View />)
  )
}

export const Header = (props: {
  navigation: {
    navigate: (a: string) => void
  }
}) => {
  return (
    <View style={{ ...styles.flexRow,
      maxHeight: 50,
      minHeight: 50,
      margin: 10,
      marginTop: 30,
      marginBottom: 0,
      padding: 10,
      paddingBottom: 5,
      backgroundColor: "white" }}>
      <Pressable style={{flex: 10}} onPress={() => props.navigation.navigate("Home")}>
        <Text style={{
          color: "red",
          fontSize: 20,
          fontWeight: "700"
        }}>Explorie</Text>
      </Pressable>
      
      <View style={{ ...styles.flexRow, flex: 3, justifyContent: "flex-end"}}>
        <ButtonSmall
          icon="search"
          css={{ padding: 5, flex: 1 }}
          onClick={() => props.navigation.navigate("Home")}
        />
        <ButtonSmall
          icon="qrcode"
          css={{ padding: 5, marginLeft: 10 }}
          onClick={() => props.navigation.navigate("Home")}
        />
      </View>
    </View>
  )
}

export const Footer = (props: {
  navigation: {
    navigate: (a: string) => void
  }
}) => {
  return (
    <View style={{ ...styles.flexRow,
      maxHeight: 60,
      minHeight: 60,
      margin: 10,
      marginTop: 0,
      marginBottom: 20,
      padding: 10,
      justifyContent: "space-around",
      backgroundColor: "transparent" }}>
        <ButtonSmall
          title="Explore"
          icon="map"
          css={{ padding: 5, flex: 1.5, ...shadow, }}
          onClick={() => props.navigation.navigate("ExploryMap")}
        />
        <Spacer css={{ flex: 0.1 }} />
        <ButtonSmall
          icon="qrcode"
          css={{ padding: 5 }}
          onClick={() => props.navigation.navigate("Home")}
        />
        <Spacer css={{ flex: 0.1 }} />
        <ButtonSmall
          icon="search"
          css={{ padding: 5 }}
          onClick={() => props.navigation.navigate("Home")}
        />
        <Spacer css={{ flex: 0.1 }} />
        <ButtonSmall
          icon="qrcode"
          css={{ padding: 5 }}
          onClick={() => props.navigation.navigate("Home")}
        />
    </View>
  )
}

export const IconInput = (props : {
  value: string,                          // required
  onChangeValue: (a: string) => void,

  placeholder?: string,                   // design
  css?: StringMap,
  cssInput?: StringMap,

  iconL?: string                          // icons
  iconLeft?: boolean,
  iconR?: string,
  iconRight?: boolean
}) => {
  const { iconLeft, iconRight } = props
  return (
    <View style={{ ...styles.IconInput, ...props.css }}>
      <View style={styles.flexRow}>
        {
          (iconLeft || iconLeft == null || iconLeft == undefined) ? (
            <Icon name={props.iconL ? props.iconL : "pencil"} size={16} color="grey" />
          ) : (<View />)
        }
        <TextInput
          style={{ ...styles.input, ...props.cssInput }}
          onChangeText={props.onChangeValue}
          value={props.value}
          placeholder={props.placeholder ? props.placeholder : "Type here..."}
        />
        {
          (iconRight && iconRight != null && iconRight != undefined) ? (
            <Icon name={props.iconR ? props.iconR : "pencil"} size={16} color="grey" />
          ) : (<View />)
        }
      </View>
    </View>
  )
}

export const BannerGradient = (props : {
  colorOne: string,               // required
  colorTwo: string,
  title: string,
  subtitle: string,

  css?: StringMap,                // design
  cssTitle?: StringMap
  cssSubtitle?: StringMap
  image?: string
  imageBool?: boolean
  profile?: string

  bOne?: string,                  // buttons
  bTwo?: string,
  bOneOnclick?: () => void,
  bTwoOnclick?: () => void
}) => {
  const { imageBool } = props
  return (
    <View style={{ ...styles.banner, ...props.css }}>
      <LinearGradient
        colors={[props.colorOne, props.colorTwo]}
        style={{ flex: 1, padding: 15 }}
      >
        <View style={styles.flexRow}>
          {/* === BANNER === */}
          <View style={{ ...styles.transparent, flex: 2, justifyContent: "space-between"}}>
            <View style={styles.transparent}>
              <Text style={{ ...styles.bannerTitle, ...props.cssTitle }}>{props.title}</Text>
              <Text style={{ ...styles.bannerSubtitle, ...props.cssSubtitle }}>{props.subtitle}</Text>
            </View>
            {
              imageBool || imageBool == undefined || imageBool == null ? <Image
                style={styles.bannerIcon}
                source={props.image ? ({ uri: props.image }) : LogoLabel}
              /> : <View />
            }
          </View>
          {/* === BUTTONS or PROFILE PIC === */}
          <View style={{ ...styles.transparent, flex: 1, alignSelf: "flex-start" }}>
            {
              props.bOne || props.bTwo ? (
                <View>
                  <ButtonSmall
                    title={props.bOne}
                    onClick={props.bOneOnclick}
                  />
                  <Spacer />
                  <ButtonSmall
                    title={props.bTwo}
                    onClick={props.bTwoOnclick}
                  />
                </View>
              ) : <View />
            }
            {
              (!props.bOne && !props.bTwo) && props.profile ? (
                <View style={{ ...styles.flexRow,
                  aspectRatio: 1,
                  borderRadius: 100,
                  overflow: "hidden",
                  justifyContent: "flex-end" }}>
                  <Image
                    style={styles.bannerProfile}
                    source={{ uri: props.profile }}
                  />
                </View>
              ) : <View />
            }
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

export const ProgressBar = (props: {
  icon?: string,
  text?: string,
  iconColor?: string,
  progressColor?: string
  progressWidth?: number
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#ebebeb", padding: 10, borderRadius: 10 }}>
      <View style={{ ...styles.flexRow, justifyContent: "flex-start", marginBottom: 10 }}>
        <Icon name={props.icon ? props.icon : "bicycle"} size={20} color={props.iconColor} />
        <Text style={{ marginLeft: 8, fontWeight: "600" }}>{props.text ? props.text : ""}</Text>
      </View>
      <Progress.Bar progress={0.3} width={props.progressWidth} color={props.progressColor} />
    </View>
    
  )
}

interface Card {
  title: String,
  subtitle: String,
  image?: String
}
export const CardsView = (props: {
  onPress: () => void,
  open: boolean
}) => {
  return(
    <View style={styles.cards}>
    <View style={styles.cardsHead}>
      <Text style={styles.cardsHeadText}>Your Collectables</Text>
      <Pressable style={styles.cardsHeadMore} onPress={() => {}}>
        <View style={styles.flexRow}>
          <Text style={styles.cardsHeadMoreText}>View More</Text>
        </View>
      </Pressable>
    </View>
    {
      reshape2D([{title: "Vegan Resto", subtitle: "$1 off NFT"},
      {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i.ibb.co/7b4DSq0/ExpImage.png"},
      {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i.ibb.co/7b4DSq0/ExpImage.png"},
      {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i.ibb.co/7b4DSq0/ExpImage.png"},
      {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i.ibb.co/7b4DSq0/ExpImage.png"},
      {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i.ibb.co/7b4DSq0/ExpImage.png"},
      {title: "Vegan Resto", subtitle: "$1 off NFT", image: "https://i.ibb.co/7b4DSq0/ExpImage.png"}]
      , 3).map((ele : Array<Card>, idx) => {
        if (props.open || idx == 0)
        return (
        <View style={styles.flexRow}>
        {
          ele.map((ele : Card) => {
            if (Object.keys(ele).length == 0) {
              return <View style={{ ...styles.cardsCard, ...noShadow, backgroundColor: "transparent" }}></View>
            }
            return (
              <View style={styles.cardsCard}>
                <View style={{flex: 1, overflow: "hidden", borderRadius: 10 }}>
                  <View style={{flex: 1, overflow: "hidden" }}>
                    <Image
                      style={styles.cardsCardImg}
                      source={ele.image ? {uri:ele.image} : LogoLabel}
                    />
                  </View>
                  <Text style={styles.cardsCardTitle}>{ele.title}</Text>
                  <Text style={styles.cardsCardSubtitle}>{ele.subtitle}</Text>
                </View>
              </View>
            )
          })
        }
        </View>
        )
      })
    }
    
  </View>
  )
}

const styles = StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  transparent: {
    backgroundColor: "transparent"
  },

  // SMALL BUTTON
  smallButton: {
    backgroundColor: "white",
    height: 30,
    borderRadius: 7,
    flex: 1,
    alignSelf: 'flex-start'
  },
  smallButtonText: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "red"
  },

  // ICON INPUT
  IconInput: {
    ...shadow,
    height: 40,
    padding: 5,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: "#eeeeee"
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 30,
    padding: 5,
    backgroundColor: "transparent"
  },

  // Banner Gradient
  banner: {
    ...shadow,
    height: 120,
    borderRadius: 10,
    overflow: "hidden"
  },
  bannerTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "white"
  },
  bannerSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "white"
  },
  bannerIcon: {
    marginTop: 5,
    height: "100%",
    width: "70%",
    resizeMode: "stretch",
    flex: 1,
  },
  bannerProfile: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    flex: 1,
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
