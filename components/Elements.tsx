import React, { useState } from "react";
import { StyleSheet, Button, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TextInput, ScrollView, Pressable } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { shadow, noShadow } from "../constants/Styles"
import { reshape2D } from "../constants/Functions"
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LogoLabel from "../assets/images/logo-label.png"
import { Nft } from "../types"

interface StringMap { [key: string]: any; }

export const Spacer = (props : {
  css?: StringMap
}) => <View style={{
  height: 10,
  width: "100%",
  backgroundColor: "transparent",
  ...props.css
}} />


/* IMPLEMENT BUTTON AS FOLLOWS WITH FLEX ROW WRAPPER
    <View style={{ flex: 1, flexDirection: "row" }}>
      <ButtonSmall
        title="Search"
        icon="search"
        css={{ backgroundColor: "black" }}
      />
    </View> */
export const ButtonSmall = (props: {
  title?: string,
  icon?: string,
  onClick?: () => void,
  css?: StringMap
  cssText?: StringMap
}) => {
  return (
    props.title || props.icon ? (
      <Pressable
        style={{ ...styles.smallButton, ...props.css }}
        onPress={props.onClick ? props.onClick : () => {}}
      >
        <View style={{ ...styles.flexRow, justifyContent: "center", alignContent: "center" }}>
          {
            props.icon ? <Icon name={props.icon} size={16} color="rgb(80,80,80)" /> : <View />
          }
          {
            props.icon && props.title ? <Spacer css={{ flex: 0.2 }} /> : <View />
          }
          {
            props.title ? <Text numberOfLines={1} style={{ ...styles.smallButtonText, ...props.cssText }}>{props.title}</Text> : <View />
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
          onClick={() => props.navigation.navigate("Search")}
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
          icon="wallet"
          css={{ padding: 5 }}
          onClick={() => props.navigation.navigate("Wallet")}
        />
        <Spacer css={{ flex: 0.1 }} />
        <ButtonSmall
          icon="search"
          css={{ padding: 5 }}
          onClick={() => props.navigation.navigate("Search")}
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
  bOneIcon?: string,
  bTwoIcon?: string,
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
                <View style={{ flex: 1, backgroundColor: "transparent" }}>
                  <View style={{ flex: 1, flexDirection: "row", backgroundColor: "transparent" }}>
                    <ButtonSmall
                      title={props.bOne ? props.bOne.slice(0,8) : undefined}
                      onClick={props.bOneOnclick}
                      icon={props.bOneIcon}
                    />
                  </View>
                  <View style={{ flex: 1, flexDirection: "row", backgroundColor: "transparent" }}>
                    <ButtonSmall
                      title={props.bTwo ? props.bTwo.slice(0,8): undefined}
                      onClick={props.bTwoOnclick}
                      icon={props.bTwoIcon}
                    />
                  </View>
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


export const CardsView = (props: {
  navigation: {
    navigate: (a: string, b:StringMap) => void
  },
  items: Array<Nft>,
  title: string
}) => {
  return (
    <View style={styles.cards}>
      <View style={styles.cardsHead}>
        <Text style={styles.cardsHeadText}>{props.title}</Text>
        <Pressable style={styles.cardsHeadMore} onPress={() => {
          props.navigation.navigate("Search", { title: props.title, data: props.items })
          }}>
          <View style={styles.flexRow}>
            <Text style={styles.cardsHeadMoreText}>View More</Text>
          </View>
        </Pressable>
      </View>
      <View style={{ ...styles.flexRow, width: "100%" }}>
        {
          (props.items ? props.items.slice(0,3) : []).map((ele : Nft) => {
            return (
              <Pressable
                style={styles.cardsCard}
                key={ele.asset_name}
                onPress={() => props.navigation.navigate("NFT", { data: ele })}
              >
                <View style={{flex: 1, overflow: "hidden", borderRadius: 10 }}>
                  <View style={{flex: 1, overflow: "hidden" }}>
                    <Image
                      style={styles.cardsCardImg}
                      source={ele.image ? (
                        (ele.image instanceof String) ? { uri: ele.image } : ele.image
                      ): LogoLabel}
                    />
                  </View>
                  <Text numberOfLines={1} style={styles.cardsCardTitle}>{ele.title}</Text>
                  <Text numberOfLines={1} style={styles.cardsCardSubtitle}>{ele.subtitle}</Text>
                </View>
              </Pressable>
            )
          })
        }
      </View>
    </View>
  )
}

export const SimpleListElement = (props: {
  item: Nft,
  onClick: () => void
}) => {
  return (
    <Pressable
      onPress={props.onClick}
      style={{ ...styles.flexRow, height: 70, padding: 10, backgroundColor: "#eeeeee", borderRadius: 10, overflow: "hidden" }}
    >
      <View style={{
        aspectRatio: 1,
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "center" }}>
        <Image
          style={{ flex: 1, width: "100%", aspectRatio: 1, resizeMode: "cover" }}
          source={props.item.image ? (
            (props.item.image instanceof String) ? { uri: props.item.image } : props.item.image
          ): LogoLabel}
        />
      </View>
      <Spacer css={{ flex: 0.05 }} />
      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#111111" }}>{props.item.title}</Text>
        <Text style={{ fontSize: 14, fontWeight: "400", color: "#666666" }}>{props.item.subtitle}</Text>
      </View>
    </Pressable>
  )
}

export const SimpleList = (props: {
  list: Array<Nft>,
  listFunc?: (a: any) => void,
  error: string,
  title: string,
  button?: string,
  buttonFunc?: () => void,
  navigation?: {
    navigate: () => void
  }
}) => {
  return !props.list || props.list.length == 0 ? <Text style={styles.textBar}>{props.error}</Text> : (
    <View style={{ flex: 1 }}>
      <View style={styles.flexRow}>
        <Text numberOfLines={1} style={{ fontSize: 20, fontWeight: "600", width: "50%" }}>{props.title}</Text>
        <Spacer css={{ flex: 1 }} />
        {
          props.button ? (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <ButtonSmall
                title={props.button}
                onClick={props.buttonFunc}
                css={{ backgroundColor: "#cccccc" }}
                cssText={{ color: "#333333" }}
              />
            </View>
          ) : <View />
        }
        
      </View>
      
      <Spacer />
      {
        props.list.map((ele: Nft, idx: number) => {
          return (
            <View key={idx}>
              <SimpleListElement
                item={ele}
                onClick={props.listFunc ? (
                  () => props.listFunc({ data: ele })
                 ) : () => {}}
              />
              <Spacer />
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
  textBar: {
    textAlign: "center",
    fontSize: 16,
    color: "grey",
    fontWeight: "800"
  },

  // SMALL BUTTON
  smallButton: {
    backgroundColor: "white",
    height: 30,
    borderRadius: 7,
    overflow: "hidden",
    flex: 1,
    alignSelf: 'flex-start'
  },
  smallButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "red"
  },

  // ICON INPUT
  IconInput: {
    height: 40,
    padding: 5,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: "#eeeeee",
    flex: 1
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
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    flex: 1,
  },
  
  // Cards
  cards: {
    margin: 10,
    flex: 1
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
