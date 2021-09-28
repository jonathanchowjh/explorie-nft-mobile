import React, { useState } from "react";
import { StyleSheet, Button, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TextInput, ScrollView, Pressable } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { shadow, noShadow } from "../constants/Styles"
import { reshape2D } from "../constants/Functions"
import Icon from 'react-native-vector-icons/FontAwesome';
import LogoLabel from "../assets/images/logo-label.png"

interface StringMap { [key: string]: string; }

export const Spacer = () => <View style={{
  height: 10,
  width: "100%",
  backgroundColor: "transparent"
}} />

export const ButtonSmall = (props: {
  title?: string,
  onClick?: string
}) => {
  return (
    props.title ? (
      <Pressable style={styles.bannerButton}>
        <View style={styles.flexRow}>
          <Text style={styles.bannerButtonText}>{props.title}</Text>
        </View>
      </Pressable>
    ) : (<View />)
  )
}

export const Header = (props: {

}) => {
  return (
    <View>
      <Text>HEADER</Text>
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
  image?: string

  bOne?: string,                  // buttons
  bTwo?: string,
  bOneOnclick?: string,
  bTwoOnclick?: string
}) => {
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
              <Text style={styles.bannerTitle}>{props.title}</Text>
              <Text style={styles.bannerSubtitle}>{props.subtitle}</Text>
            </View>
            <Image
              style={styles.bannerIcon}
              source={props.image ? ({ uri: props.image }) : LogoLabel}
            />
          </View>
          {/* === BUTTONS === */}
          <View style={{ ...styles.transparent, flex: 1, alignSelf: "flex-start" }}>
            <ButtonSmall
              title={props.bOne}
              onClick={props.bOneOnclick}
            />
            <ButtonSmall
              title={props.bTwo}
              onClick={props.bTwoOnclick}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    overflow: "scroll"
  },
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
  bannerButton: {
    backgroundColor: "white",
    height: 30,
    margin: 7,
    borderRadius: 10
  },
  bannerButtonText: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "red"
  },
  bannerIcon: {
    marginTop: 5,
    height: "100%",
    width: "70%",
    resizeMode: "stretch",
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
  // cardsCardImg: {
  //   resizeMode: "cover",
  //   flex: 1,
  //   height: 10,
  //   width: "100%"
  // },
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
